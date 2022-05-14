'use strict'

import AcceptPayment from 'App/lib/Payment/Accept/AcceptPayment'
import CustomException from 'App/Exceptions/CustomException'
import Transaction from 'App/Models/Transaction'
import User from 'App/Models/User'
import Address from 'App/Models/Address'
import { EnvContract } from '@ioc:Adonis/Core/Env'
import HttpClient from 'App/Utils/HttpClient'

export default class AcceptCash extends AcceptPayment {
  constructor(env: EnvContract) {
    super(env)
    this.integration_id = this.env.getOrFail('ACCEPT_PAYMENT_INTEGRATION_CASH_ID')
    this.deliveryNeeded = 'false'
  }

  public async requestPaymentKey(transaction: Transaction, user: User, address: Address) {
    if (!this.integration_id) throw new CustomException('No Integration id provided', 500)
    await this.confirmAuthentication()
    if (!address) {
      throw new CustomException('No Address Available', 400)
    }
    try {
      const result = await HttpClient.post('https://accept.paymobsolutions.com/api/acceptance/payment_keys', {
        auth_token: this.token,
        amount_cents: transaction.amount * 100,
        expiration: 3600,
        order_id: transaction.provider_ref,
        billing_data: {
          apartment: address.apartment,
          email: user.email,
          floor: address.floor,
          first_name: user.first_name,
          street: address.street,
          building: address.building_number,
          phone_number: user.phone_number,
          postal_code: address.postal_code,
          city: address.city,
          country: address.country,
          last_name: user.last_name,
          state: address.governorate,
        },
        currency: 'EGP',
        integration_id: this.integration_id,
      })
      return result.data
    } catch (error) {
      throw new CustomException('Error Requesting Accept Payment Key', 500)
    }
  }

  public async payRequest(paymentToken: string) {
    let result = null
    try {
      result = await HttpClient.post('https://accept.paymobsolutions.com/api/acceptance/payments/pay', {
        source: {
          identifier: 'cash',
          subtype: 'CASH',
        },
        payment_token: paymentToken,
      })
    } catch (error) {
      throw new CustomException('Error in initiating Cash Pay Request', 500)
    }
    if (result.data.pending === 'false') {
      throw new CustomException('Scheduling failed, Try again later', 503)
    }
    return result.data
  }
}
