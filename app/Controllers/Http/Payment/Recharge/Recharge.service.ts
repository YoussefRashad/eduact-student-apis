import Rates from 'App/Constants/Rates'
import BadRequestException from 'App/Exceptions/BadRequestException'
import ResourceNotFoundException from 'App/Exceptions/ResourceNotFoundException'
import RechargeCard from 'App/Models/RechargeCard'
import User from 'App/Models/User'
import StudentService from 'App/Controllers/Http/Student/Student.service'
import Utils from 'App/Utils/Utils'
import Env from '@ioc:Adonis/Core/Env'
import InvoicesRepository from 'App/Controllers/Http/Payment/Invoices/Invoices.repository'
import TransactionsRepository from 'App/Controllers/Http/Payment/Transactions/Transactions.repository'
import CustomException from 'App/Exceptions/CustomException'
import Codes from 'App/Constants/Codes'
import acceptOnline from '@ioc:Payment/AcceptOnline'
import acceptEwallet from '@ioc:Payment/AcceptEwallet'
import acceptKiosk from '@ioc:Payment/AcceptKiosk'
import opayPayment from '@ioc:Payment/Opay'
import { IRechargeRequestParams } from 'App/Interfaces/IRechargeRequestParams.interface'
import HttpContext from '@ioc:Adonis/Core/HttpContext'
import FawryStatusMapper from 'App/Utils/FawryStatusMapper'

export default class RechargeService {
  protected studentService = new StudentService()
  protected invoiceRepository = new InvoicesRepository()
  protected transactionRepository = new TransactionsRepository()
  /**
   *
   * @param method
   */
  public async getPaymentRates(method: string) {
    const obj: any = {
      fawry: Rates.Fawry,
      accept: Rates.Accept,
      opay: Rates.Opay,
    }
    const rates = obj[method]
    if (!rates) {
      throw new BadRequestException('Payment provider not supported')
    }
    return rates
  }

  /**
   *
   * @param user
   * @param code
   */
  public async rechargeWithRechargeCard(user: User, code: string) {
    const rechargeCard = await RechargeCard.query().where('code', code).first()
    if (!rechargeCard) {
      throw new ResourceNotFoundException('Invalid code')
    }
    if (rechargeCard.user_id) {
      throw new BadRequestException('This card has been used before')
    }
    rechargeCard.user_id = user.id
    await rechargeCard.save()
    await this.studentService.addToWallet(user, rechargeCard.value, undefined, `recharge with Recharge Card: ${rechargeCard.code}`)
  }

  /**
   *
   * @param rechargeRequestParams
   */
  public async paymentMethodMapper(rechargeRequestParams: IRechargeRequestParams) {
    const mapperKey = `${rechargeRequestParams.method}_${rechargeRequestParams.provider}`
    const obj: any = {
      fawry_fawry: () => {
        return this.fawryRechargeRequest(rechargeRequestParams)
      },
      aman_accept: () => {
        rechargeRequestParams.provider = 'PAYATAMAN'
        return this.acceptKioskRechargeRequest(rechargeRequestParams)
      },
      masary_accept: () => {
        rechargeRequestParams.provider = 'PAYATMASARY'
        return this.acceptKioskRechargeRequest(rechargeRequestParams)
      },
      card_accept: () => {
        return this.acceptOnlineRechargeRequest(rechargeRequestParams)
      },
      card_opay: () => {
        return this.oPayRechargeRequest(rechargeRequestParams)
      },
      ewallet_accept: () => {
        return this.acceptEwalletRechargeRequest(rechargeRequestParams)
      },
    }
    const rechargeRequest = obj[mapperKey]
    if (!rechargeRequest) {
      throw new BadRequestException('Payment method not supported')
    }
    return rechargeRequest()
  }

  /**
   *
   * @param rates
   * @param amount
   */
  public passPaymentProviderRatesOrFail(rates: any, amount: number) {
    if (amount < rates.min) throw new BadRequestException('Amount is below minimum amount')
    if (amount > rates.max) throw new BadRequestException('Amount is above maximum amount')
    if (amount % 5 !== 0) {
      throw new BadRequestException('Amount must be multiple of 5')
    }
  }

  /**
   *
   * @param rechargeRequestParams
   */
  public async fawryRechargeRequest(rechargeRequestParams: IRechargeRequestParams) {
    const ctx = HttpContext.get()!
    this.passPaymentProviderRatesOrFail(Rates.Fawry, rechargeRequestParams.amount)
    const transaction = await this.transactionRepository.createFawryRechargeTransaction(
      rechargeRequestParams.amount + Utils.calculateTax(rechargeRequestParams.amount, 'fawry'),
      'new'
    )
    const invoice = await this.invoiceRepository.createRechargeInvoice(
      transaction,
      ctx.request.user.id,
      'new',
      rechargeRequestParams.amount,
      Utils.calculateTax(rechargeRequestParams.amount, 'fawry')
    )

    //set expiry date
    const today = new Date()
    today.setHours(today.getHours() + 2)

    let chargeRequest = {
      merchantCode: Env.get('MERCHANT_CODE'),
      merchantRefNum: invoice.invoice_ref,
      customerMobile: ctx.request.user.phone_number,
      customerEmail: ctx.request.user.email,
      customerName: ctx.request.user.first_name + ' ' + ctx.request.user.last_name,
      customerProfileId: ctx.request.user.id,
      paymentExpiry: today.getTime(),
      chargeItems: [
        {
          itemId: 1,
          description: 'Recharge Wallet',
          price: rechargeRequestParams.amount + Utils.calculateTax(rechargeRequestParams.amount, 'fawry'),
          quantity: 1,
        },
      ],
      paymentMethod: 'PayAtFawry',
      returnUrl: Env.get('FRONTEND_URL') + '/payment/callback',
      authCaptureModePayment: false,
      signature: '',
    }
    chargeRequest.signature = Utils.fawrySHA256Signature(
      chargeRequest.merchantCode,
      chargeRequest.merchantRefNum,
      chargeRequest.customerProfileId,
      chargeRequest.returnUrl,
      chargeRequest.customerMobile,
      chargeRequest.customerEmail,
      chargeRequest.chargeItems[0].itemId + chargeRequest.chargeItems[0].quantity + chargeRequest.chargeItems[0].price + '.00',
      chargeRequest.paymentExpiry
    )
    return chargeRequest
  }

  /**
   *
   * @param rechargeRequestParams
   */
  async acceptOnlineRechargeRequest(rechargeRequestParams: IRechargeRequestParams) {
    const ctx = HttpContext.get()!
    this.passPaymentProviderRatesOrFail(Rates.Accept, rechargeRequestParams.amount)
    const transaction = await this.transactionRepository.createAcceptCardTransaction(
      rechargeRequestParams.amount + Utils.calculateTax(rechargeRequestParams.amount, 'accept'),
      'new'
    )
    const invoice = await this.invoiceRepository.createRechargeInvoice(
      transaction,
      ctx.request.user.id,
      'new',
      rechargeRequestParams.amount,
      Utils.calculateTax(rechargeRequestParams.amount, 'accept')
    )
    const order = await acceptOnline.registerOrder(invoice.invoice_ref, [], rechargeRequestParams.amount * 100)
    await this.transactionRepository.updateById(transaction.id, { provider_ref: order.id })
    const tokenObjet = await acceptOnline.requestPaymentKey(transaction, ctx.request.user, ctx.request.user.student.address)
    tokenObjet.referencrNumber = invoice.invoice_ref
    return tokenObjet
  }

  /**
   *
   * @param rechargeRequestParams
   */
  async acceptKioskRechargeRequest(rechargeRequestParams: IRechargeRequestParams) {
    const ctx = HttpContext.get()!
    this.passPaymentProviderRatesOrFail(Rates.Accept, rechargeRequestParams.amount)
    const transaction = await this.transactionRepository.createAcceptKioskTransaction(
      rechargeRequestParams.amount + Utils.calculateTax(rechargeRequestParams.amount, 'accept'),
      'new',
      rechargeRequestParams.provider
    )
    const invoice = await this.invoiceRepository.createRechargeInvoice(
      transaction,
      ctx.request.user.id,
      'new',
      rechargeRequestParams.amount,
      Utils.calculateTax(rechargeRequestParams.amount, 'accept')
    )
    const order = await acceptKiosk.registerOrder(invoice.invoice_ref, [], rechargeRequestParams.amount * 100)
    await this.transactionRepository.updateById(transaction.id, { provider_ref: order.id })
    const tokenObjet = await acceptKiosk.requestPaymentKey(transaction, ctx.request.user, ctx.request.user.student.address)
    try {
      const responseObject = await acceptKiosk.payRequest(tokenObjet.token)
      await this.invoiceRepository.updateById(invoice.id, { status: 'pending' })
      await this.transactionRepository.updateById(transaction.id, { status: 'pending' })
      return responseObject
    } catch (error) {
      await this.invoiceRepository.updateById(invoice.id, { status: 'unpaid' })
      await this.transactionRepository.updateById(transaction.id, { status: 'unpaid' })
      throw new BadRequestException('Transaction failed to be processed')
    }
  }

  /**
   *
   * @param rechargeRequestParams
   */
  async acceptEwalletRechargeRequest(rechargeRequestParams: IRechargeRequestParams) {
    const ctx = HttpContext.get()!
    if (!rechargeRequestParams.phone) {
      throw new CustomException('Phone is required', Codes.Error.Http.INTERNAL_SERVER_ERROR)
    }
    this.passPaymentProviderRatesOrFail(Rates.Accept, rechargeRequestParams.amount)
    const transaction = await this.transactionRepository.createAcceptEwalletTransaction(
      rechargeRequestParams.amount + Utils.calculateTax(rechargeRequestParams.amount, 'accept'),
      'new'
    )
    const invoice = await this.invoiceRepository.createRechargeInvoice(
      transaction,
      ctx.request.user.id,
      'new',
      rechargeRequestParams.amount,
      Utils.calculateTax(rechargeRequestParams.amount, 'accept')
    )
    const order = await acceptEwallet.registerOrder(invoice.invoice_ref, [], rechargeRequestParams.amount * 100)
    await this.transactionRepository.updateById(transaction.id, { provider_ref: order.id })
    const tokenObjet = await acceptEwallet.requestPaymentKey(transaction, ctx.request.user, ctx.request.user.student.address)
    try {
      const responseObject = await acceptEwallet.payRequest(tokenObjet.token, rechargeRequestParams.phone)
      await this.invoiceRepository.updateById(invoice.id, { status: 'pending' })
      await this.transactionRepository.updateById(transaction.id, { status: 'pending' })
      return responseObject
    } catch (error) {
      await this.invoiceRepository.updateById(invoice.id, { status: 'unpaid' })
      await this.transactionRepository.updateById(transaction.id, { status: 'unpaid' })
      throw new BadRequestException('Transaction failed to be processed')
    }
  }

  /**
   *
   * @param rechargeRequestParams
   */
  async oPayRechargeRequest(rechargeRequestParams: IRechargeRequestParams) {
    const ctx = HttpContext.get()!
    this.passPaymentProviderRatesOrFail(Rates.Opay, rechargeRequestParams.amount)
    const transaction = await this.transactionRepository.createOpayTransaction(
      rechargeRequestParams.amount + Utils.calculateTax(rechargeRequestParams.amount, 'opay'),
      'new'
    )
    await this.invoiceRepository.createRechargeInvoice(
      transaction,
      ctx.request.user.id,
      'new',
      rechargeRequestParams.amount,
      Utils.calculateTax(rechargeRequestParams.amount, 'opay')
    )
    const opayResponse = await opayPayment.initTransaction(ctx.request.user, transaction, rechargeRequestParams.amount * 100)
    await this.transactionRepository.updateById(transaction.id, { provider_ref: opayResponse.data.orderNo })
    return opayResponse
  }

  /**
   *
   * @param referenceNumber
   */
  public async rollbackRechargeRequest(referenceNumber: string) {
    await this.invoiceRepository.delete(referenceNumber)
    await this.transactionRepository.delete(referenceNumber)
  }

  /**
   *
   * @param callbackObject
   */
  async fawryRechargeRequestUpdate(callbackObject: any) {
    await this.transactionRepository.updateByReference(callbackObject.merchantRefNumber, {
      provider: callbackObject.provider,
      provider_ref: callbackObject.fawryRefNumber,
      method: callbackObject.paymentMethod,
      status: FawryStatusMapper.map(callbackObject.OrderStatus),
    })
    await this.invoiceRepository.updateByReference(callbackObject.merchantRefNumber, {
      status: FawryStatusMapper.map(callbackObject.OrderStatus),
    })
  }
}
