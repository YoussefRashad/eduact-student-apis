import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class VerifyOpayCallbackSignature {
  public async handle({}: HttpContextContract, next: () => Promise<void>) {
    // TODO: implement opay callback signature verification
    await next()
  }
}
