'use strict'

import AcceptPayment from 'App/lib/Payment/Accept/AcceptPayment'
import CustomException from 'App/Exceptions/CustomException'
import { EnvContract } from '@ioc:Adonis/Core/Env'
import HttpClient from 'App/Utils/HttpClient'

export default class AcceptEwallet extends AcceptPayment {
  constructor(env: EnvContract) {
    super(env)
    this.integration_id = this.env.get('ACCEPT_PAYMENT_INTEGRATION_WALLET_ID')
  }

  public async payRequest(paymentToken: string, phone: string) {
    let result = null
    try {
      result = await HttpClient.post('https://accept.paymobsolutions.com/api/acceptance/payments/pay', {
        source: {
          identifier: phone,
          subtype: 'WALLET',
        },
        payment_token: paymentToken,
      })
    } catch (error) {
      throw new CustomException('Error in initiating Ewallet Pay Request', 500)
    }
    if (!result.data.pending) {
      throw new CustomException('Transaction failed, Try again later', 400)
    }
    return result.data
  }
}
