import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ResourceNotFoundException from 'App/Exceptions/ResourceNotFoundException'
import Invoice from '../Models/Invoice'
import '../../contracts/request'

export default class InvoiceIssuedByUser {
  async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    const invoice = await Invoice.query().where('invoice_ref', request.body().reference_number).where('user_id', request.user.id).first()
    if (!invoice) throw new ResourceNotFoundException('Invoice Not Found')
    await next()
  }
}

module.exports = InvoiceIssuedByUser
