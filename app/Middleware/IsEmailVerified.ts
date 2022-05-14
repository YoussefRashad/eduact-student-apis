import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import RedirectionException from '../Exceptions/RedirectionException'
import Codes from 'App/Constants/Codes'

export default class IsEmailVerified {
  async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    if (!request.user.email_verified) throw new RedirectionException('Please verify your email', Codes.Error.Redirect.EMAIL_VERIFICATION)
    await next()
  }
}
