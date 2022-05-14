import Invoice from 'App/Models/Invoice'
import Env from '@ioc:Adonis/Core/Env'
import { v4 } from 'uuid'
import date from 'date-and-time'
import sha256 from 'crypto-js/sha256'
import crypto from 'crypto'
import Rates from 'App/Constants/Rates'
import ReferenceLookup from 'App/Models/ReferenceLookup'
import HttpContext from '@ioc:Adonis/Core/HttpContext'
const ObjectsToCsv = require('objects-to-csv')
const CsvParser = require('json2csv')

export default class Utils {
  public static generateUUID() {
    return v4().replace(/-/g, '')
  }

  public static generatePinCode(length: number = 6) {
    return Math.floor(Math.pow(10, length - 1) + Math.random() * length * Math.pow(10, length - 1))
  }

  public static generateUsername(firstname: string, lastname: string) {
    return firstname[0].toLowerCase() + lastname[0].toLowerCase() + this.generatePinCode()
  }

  public static generateMixedCaseToken(length: number, chars?: any) {
    chars = chars || 'abcdefghjkmnpqrstuwxyzABCDEFGHJKMNPQRSTUWXYZ123456789'
    let rnd = crypto.randomBytes(length),
      value = new Array(length),
      len = Math.min(256, chars.length),
      d = 256 / len

    for (let i = 0; i < length; i++) {
      value[i] = chars[Math.floor(rnd[i] / d)]
    }

    return value.join('')
  }

  static now(format: string = 'YYYY/MM/DD HH:mm:ss') {
    const now = new Date()
    return date.format(now, format)
  }

  public static exportCsv(headers: Array<string>, data: any, filename: string = 'data-' + Date.now()) {
    const ctx = HttpContext.get()!
    let csv = new ObjectsToCsv(data)
    if (csv.data.length < 1)
      return ctx.response
        .header('Content-type', 'text/csv')
        .header('Content-disposition', 'attachment; filename=' + filename + '.csv')
        .header('Accept-Charset', 'UTF-8')
        .send('No Content')
    const csvFields = headers
    const csvParser = new CsvParser.Parser({ csvFields })
    const csvData = csvParser.parse(csv.data)
    return ctx.response
      .header('Content-type', 'text/csv')
      .header('Content-disposition', 'attachment; filename=' + filename + '.csv')
      .header('Accept-Charset', 'UTF-8')
      .send(csvData)
  }

  static async generateToken(length: number = 64) {
    let token, invoice
    do {
      token = crypto
        .randomBytes(Math.ceil(length / 2))
        .toString('hex') // convert to hexadecimal format
        .slice(0, length) // return required number of characters
      invoice = await Invoice.query()
        .where('invoice_ref', 'r-' + token)
        .orWhere('invoice_ref', 'w-' + token)
        .first()
    } while (invoice)
    return token
  }

  static async generateInvoiceReference(): Promise<string> {
    const reference = await ReferenceLookup.first()
    if (!reference) {
      return '0000000001'
    }
    reference.invoice_reference += 1
    await reference.save()
    return this.pad(Number(reference.invoice_reference), 10)
  }

  static pad(num: number, size: number): string {
    let s = '000000000' + num
    return s.substr(s.length - size)
  }

  static expiryTimeString(hours: number): string {
    const now = new Date()
    const expiryDate = date.addHours(now, hours)
    return date.format(expiryDate, 'YYYY/MM/DD HH:mm:ss')
  }

  static expiryTime(hours: number): Date {
    const now = new Date()
    return date.addHours(now, hours)
  }

  static fawryMD5Signature(...params: any): string {
    let message = Env.get('FPAY_SECURITY_CODE')
    params.forEach((element: any) => {
      message += element
    })

    return crypto.createHash('md5').update(message).digest('hex').toUpperCase()
  }

  static fawrySHA256Signature(...params: any): string {
    let message = ''
    params.forEach((element: any) => {
      message += element
    })

    return sha256(message + Env.get('FPAY_SECURITY_CODE')).toString()
  }

  static upperCaseFirstLetter(string: string): string {
    return string.charAt(0).toUpperCase() + string.slice(1)
  }

  static lowerCaseAllWordsExceptFirstLetters(string: string): string {
    return string.replace(/\S*/g, function (word: string) {
      return word.charAt(0) + word.slice(1).toLowerCase()
    })
  }

  static capitalizeWord(word: string): string {
    return this.upperCaseFirstLetter(this.lowerCaseAllWordsExceptFirstLetters(word))
  }

  static calculateTax(amount: number, provider: string): number {
    switch (provider) {
      case 'fawry':
        return Math.round((Rates.Fawry.percentage / 100) * amount + Rates.Fawry.constant)
      case 'accept':
        return Math.round((Rates.Accept.percentage / 100) * amount + Rates.Accept.constant)
    }
    return 0
  }
}
