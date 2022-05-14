import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Http from 'App/Utils/Http'
import RechargeService from 'App/Controllers/Http/Payment/Recharge/Recharge.service'
import RechargeWithRechargeCard from 'App/Validators/RechargeWithRechargeCard'
import RechargeRequest from 'App/Validators/RechargeRequest'
import ReferenceNumber from 'App/Validators/ReferenceNumber'
import BadRequestException from 'App/Exceptions/BadRequestException'

export default class RechargeController {
  protected rechargeService = new RechargeService()

  /**
   * Get the payment rates
   * @param request
   */
  public async getPaymentRates({ request }: HttpContextContract) {
    const rates = await this.rechargeService.getPaymentRates(request.all().method)
    return Http.respond({ data: rates, message: 'Rates' })
  }

  /**
   *
   * @param request
   */
  public async rechargeWithRechargeCard({ request }: HttpContextContract) {
    const requestPayload = await request.validate(RechargeWithRechargeCard)
    await this.rechargeService.rechargeWithRechargeCard(request.user, requestPayload.code)
    return Http.respond({ message: 'wallet Recharged' })
  }

  /**
   *
   * @param request
   * @param response
   */
  public async rechargeRequest({ request }: HttpContextContract) {
    const requestPayload = await request.validate(RechargeRequest)
    const response = await this.rechargeService.paymentMethodMapper(requestPayload)
    return Http.respond({ data: response, message: 'Charge Request' })
  }

  /**
   *
   * @param request
   */
  public async rechargeRollback({ request }: HttpContextContract) {
    const requestPayload = await request.validate(ReferenceNumber)
    await this.rechargeService.rollbackRechargeRequest(requestPayload.reference_number)
    return Http.respond({ message: 'Request Cancelled' })
  }

  /**
   *
   * @param request
   */
  public async rechargeCallback({ request }: HttpContextContract) {
    switch (request.body().provider) {
      case 'fawry':
        await this.rechargeService.fawryRechargeRequestUpdate(request.body)
        break
      default:
        throw new BadRequestException('Provider callback method not supported')
    }
    return Http.respond({ message: 'Payment Processed' })
  }
}
