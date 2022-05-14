'use strict'

import Transaction from 'App/Models/Transaction'
import User from 'App/Models/User'
import Invoice from 'App/Models/Invoice'
import date from 'date-and-time'
import CustomException from 'App/Exceptions/CustomException'
import Address from 'App/Models/Address'
import HttpClient from 'App/Utils/HttpClient'

export default class AcceptPayment {
  protected token: string
  protected profile: any
  protected env: any
  protected deliveryNeeded: string = 'false'
  protected integration_id: string

  constructor(env: any) {
    this.env = env
  }

  public async confirmAuthentication() {
    if (!this.token) await this.authenticate()
  }

  private async authenticate() {
    try {
      const result = await HttpClient.post('https://accept.paymobsolutions.com/api/auth/tokens', {
        api_key: this.env.get('ACCEPT_API_KEY'),
      })
      this.profile = result.data.profile
      this.token = result.data.token
      return result.data
    } catch (error) {
      throw new CustomException('Error in Payment Authentication Request' + error.message, 500)
    }
  }

  public async registerOrder(referenceNumber: string, items: any, amountCents: number) {
    await this.authenticate()
    if (!(items instanceof Array)) {
      throw new CustomException(`registerOrder function only accept array of items given: ${typeof items}`, 500)
    }
    try {
      const result = await HttpClient.post('https://accept.paymobsolutions.com/api/ecommerce/orders', {
        auth_token: this.token,
        delivery_needed: this.deliveryNeeded,
        merchant_id: this.profile.id,
        amount_cents: amountCents,
        currency: 'EGP',
        merchant_order_id: referenceNumber,
        items: items,
      })
      return result.data
    } catch (error) {
      throw new CustomException('Error in Payment Registering Order Request' + error.message, 500)
    }
  }

  public async requestPaymentKey(transaction: Transaction, user: User, address: Address) {
    if (!this.integration_id) throw new CustomException('No Integration id provided', 500)
    await this.authenticate()
    try {
      const result = await HttpClient.post('https://accept.paymobsolutions.com/api/acceptance/payment_keys', {
        auth_token: this.token,
        amount_cents: transaction.amount * 100,
        expiration: new Date(this.getExpiryTime(2)).getTime(),
        order_id: transaction.provider_ref,
        billing_data: {
          apartment: address?.apartment || 'NA',
          email: user.email,
          floor: address?.floor || 'NA',
          first_name: user.first_name,
          street: address?.street || 'NA',
          building: address?.building_number || 'NA',
          phone_number: user.phone_number,
          postal_code: address?.postal_code || 'NA',
          city: address?.city || 'NA',
          country: address?.country || 'NA',
          last_name: user.last_name,
          state: address?.governorate || 'NA',
        },
        currency: 'EGP',
        integration_id: this.integration_id,
      })
      return result.data
    } catch (error) {
      throw new CustomException('Error Requesting Accept Payment Key' + error.message, 500)
    }
  }

  public async getTransactionData(transaction_id: string) {
    await this.authenticate()
    try {
      const result = await HttpClient.get(
        'https://accept.paymobsolutions.com/api/acceptance/transactions/' + transaction_id,
        {},
        {
          Authorization: 'Bearer ' + this.token,
        }
      )
      return result.data
    } catch (error) {
      throw new CustomException(error, 500)
    }
  }

  public getExpiryTime(hours: number) {
    const now = new Date()
    const expiryDate = date.addHours(now, hours)
    return date.format(expiryDate, 'YYYY/MM/DD HH:mm:ss')
  }

  public async fetchTransaction(invoice: Invoice, transaction: Transaction) {
    await this.authenticate()
    return HttpClient.post('https://accept.paymobsolutions.com/api/ecommerce/orders/transaction_inquiry', {
      auth_token: this.token,
      merchant_order_id: invoice.invoice_ref,
      order_id: transaction.provider_ref,
    })
  }
}
