import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Env from '@ioc:Adonis/Core/Env'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import crypto from 'crypto'

export default class VerifyAcceptNotificationCallbackSignature {
  async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    // call next to advance the request
    const text =
      request.body().obj.amount_cents +
      request.body().obj.created_at +
      request.body().obj.currency +
      request.body().obj.error_occured +
      request.body().obj.has_parent_transaction +
      request.body().obj.id +
      request.body().obj.integration_id +
      request.body().obj.is_3d_secure +
      request.body().obj.is_auth +
      request.body().obj.is_capture +
      request.body().obj.is_refunded +
      request.body().obj.is_standalone_payment +
      request.body().obj.is_voided +
      request.body().obj.order.id +
      request.body().obj.owner +
      request.body().obj.pending +
      request.body().obj.source_data.pan +
      request.body().obj.source_data.sub_type +
      request.body().obj.source_data.type +
      request.body().obj.success

    let value = crypto.createHmac('sha512', Env.get('ACCEPT_HMAC_SECRET')).update(text).digest('hex')
    if (value !== request.all().hmac) {
      throw new ForbiddenException('Cannot Verify Signature')
    }
    await next()
  }
}
