'use strict'

import AcceptPayment from 'App/lib/Payment/Accept/AcceptPayment'
import CustomException from 'App/Exceptions/CustomException'
import { EnvContract } from '@ioc:Adonis/Core/Env'
import HttpClient from 'App/Utils/HttpClient'

export default class AcceptKiosk extends AcceptPayment {
  constructor(env: EnvContract) {
    super(env)
    this.integration_id = this.env.get('ACCEPT_PAYMENT_INTEGRATION_KIOSK_ID')
  }

  public async payRequest(paymentToken: string) {
    let result = null
    try {
      result = await HttpClient.post('https://accept.paymobsolutions.com/api/acceptance/payments/pay', {
        source: {
          identifier: 'AGGREGATOR',
          subtype: 'AGGREGATOR',
        },
        payment_token: paymentToken,
      })
    } catch (error) {
      throw new CustomException('Error in initiating Cash Pay Request', 500)
    }
    if (!result.data.pending) {
      throw new CustomException('Scheduling failed, Try again later', 503)
    }
    return result.data
  }
}
