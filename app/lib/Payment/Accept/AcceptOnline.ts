'use strict'

import AcceptPayment from 'App/lib/Payment/Accept/AcceptPayment'
import { EnvContract } from '@ioc:Adonis/Core/Env'

export default class AcceptOnline extends AcceptPayment {
  constructor(env: EnvContract) {
    super(env)
    this.integration_id = this.env.get('ACCEPT_PAYMENT_INTEGRATION_CARD_ID')
  }
}
