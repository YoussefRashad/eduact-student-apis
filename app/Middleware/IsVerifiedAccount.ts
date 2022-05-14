import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Codes from 'App/Constants/Codes'
import RedirectionException from 'App/Exceptions/RedirectionException'

export default class IsVerifiedAccount {
  async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    let redirectCode: number | null = null
    let message: string = ''

    if (!request.user?.email_verified) {
      redirectCode = Codes.Error.Redirect.EMAIL_VERIFICATION
      message = 'Email is not verified'
    }
    if (!request.user?.student.profile_complete) {
      redirectCode = Codes.Error.Redirect.COMPLETE_PROFILE
      message = 'Please complete your profile first'
    }
    if (redirectCode) throw new RedirectionException(message, redirectCode)
    await next()
  }
}
