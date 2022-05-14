import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import Utils from 'App/Utils/Utils'

export default class VerifyFawryCallbackSignature {
  async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    let object = request.all()
    let signature = Utils.fawryMD5Signature(object.Amount, object.FawryRefNo, object.MerchantRefNo, object.OrderStatus)
    if (String(signature) !== String(object.MessageSignature)) {
      throw new ForbiddenException('Signature cannot be verified')
    }
    await next()
  }
}
