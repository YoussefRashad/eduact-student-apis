'use strict'

import CustomException from 'App/Exceptions/CustomException'
import User from 'App/Models/User'
import Ip from 'App/Models/Ip'
import Transaction from 'App/Models/Transaction'
import { EnvContract } from '@ioc:Adonis/Core/Env'
import HttpClient from 'App/Utils/HttpClient'

export default class OpayPayment {
  protected env: EnvContract

  constructor(env: EnvContract) {
    this.env = env
  }

  public async initTransaction(user: User, transaction: Transaction, amount: number) {
    const userIp: Ip | null = await user.related('ips').query().orderBy('created_at', 'desc').first()
    try {
      const result = await HttpClient.post(
        this.env.get('OPAY_BASE_URL') + '/international/cashier/create',
        {
          merchantName: 'Eduact',
          country: 'EG',
          reference: transaction.transaction_ref,
          amount: {
            total: amount,
            currency: 'EGP',
          },
          product: {
            name: 'Recharge',
            description: 'Recharge Eduact Wallet',
          },
          returnUrl: this.env.get('FRONTEND_URL'),
          cancelUrl: this.env.get('FRONTEND_URL'),
          callbackUrl: this.env.get('BACKEND_URL') + '/api/opay/callback',
          userClientIP: userIp?.ip_address || '127.0.0.1',
          expireAt: 30,
          payMethod: 'BankCard',
        },
        {},
        {
          Authorization: 'Bearer ' + this.env.get('OPAY_PUBLIC_KEY'),
          MerchantId: this.env.get('OPAY_MERCHANT_ID'),
        }
      )
      return result.data
    } catch (error) {
      throw new CustomException('Error occurred in Opay Payment Request', 500)
    }
  }
}
