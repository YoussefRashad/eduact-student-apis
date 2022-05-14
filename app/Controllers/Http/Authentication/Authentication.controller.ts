import CustomException from 'App/Exceptions/CustomException'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import Verification from 'App/Models/Verification'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Codes from 'App/Constants/Codes'
import Messages from 'App/Constants/Messages'
import Http from 'App/Utils/Http'
import CreateUser from 'App/Validators/CreateUser'
import Login from 'App/Validators/Login'
import StudentService from '../Student/Student.service'
import AuthenticationService from './Authentication.service'
import VerifyToken from 'App/Validators/VerifyToken'
import ResetPassword from 'App/Validators/ResetPassword'
import ForgetPassword from 'App/Validators/ForgetPassword'
import EmailCheck from 'App/Validators/EmailCheck'
import ConflictException from 'App/Exceptions/ConflictException'
import ILoginResponse from 'App/Interfaces/ILoginResponse.interface'

export default class AuthenticationController {
  private authenticationService = new AuthenticationService()
  private studentService = new StudentService()

  /**
   *
   * @param request
   */
  public async signup({ request }: HttpContextContract) {
    const requestPayload = await request.validate(CreateUser)
    await this.authenticationService.isNotBlockedEmailOrFail(requestPayload.email)
    await this.authenticationService.isValidMailBoxOrFail(requestPayload.email)
    const user = await this.authenticationService.createUserAndSendVerificationMail(requestPayload, request.header('Accept-Language'))
    return Http.respond({
      data: {
        user: user,
        redirect: Codes.Error.Redirect.EMAIL_VERIFICATION,
      },
      message: Messages.user.success.SIGNUP,
    })
  }

  /**
   *
   * @param request
   */
  async login({ request }: HttpContextContract) {
    const requestPayload = await request.validate(Login)
    const loginResponse: ILoginResponse | null = await this.authenticationService.login(requestPayload.identifier, requestPayload.password)
    if (!loginResponse) {
      return
    }
    return Http.respond({
      message: Messages.user.success.LOGIN,
      data: {
        token: loginResponse?.token,
        user: loginResponse?.user,
        type: loginResponse?.type,
      },
    })
  }

  /**
   *
   * @param request
   */
  async confirmEmailAddress({ request }: HttpContextContract) {
    const requestPayload = await request.validate(VerifyToken)
    let tokenObj: Verification = await this.authenticationService.getNonExpiredVerificationOrFail(requestPayload.token, 'email')
    await this.studentService.updateUser(tokenObj.user_id, { email_verified: true })
    await this.authenticationService.deleteVerificationToken(requestPayload.token)
    const user = await this.studentService.getUserProfile(tokenObj.user_id)
    const token = await this.authenticationService.generateLoginToken(user)
    if (user.student.profile_complete) {
      return this.authenticationService.sendCompleteProfileRedirectionResponse(token, user, user.type)
    }
    return Http.respond({
      data: {
        token: token,
        user: user,
      },
      message: Messages.user.success.LOGIN,
    })
  }

  /**
   *
   * @param request
   * @param response
   */
  public async forgetPassword({ request }: HttpContextContract) {
    const requestPayload = await request.validate(ForgetPassword)
    const user = await this.studentService.findByOrFail('email', requestPayload.identifier)
    if (!user.email_verified) throw new ForbiddenException('Email is not verified, Please verify and try again')
    await this.authenticationService.sendResetPasswordToken(user, request.header('Accept-Language'))
    return Http.respond({ message: Messages.user.general.CHECK_EMAIL })
  }

  /**
   *
   * @param request
   * @param response
   */
  public async resetPassword({ request }: HttpContextContract) {
    const requestPayload = await request.validate(ResetPassword)
    let user = await this.studentService.findByOrFail('password_reset_token', requestPayload.token)
    if (requestPayload.token !== user.password_reset_token) throw new CustomException('Invalid token', Codes.Error.Http.BAD_REQUEST)
    await this.studentService.updateUser(user.id, {
      password: this.authenticationService.hashPassword(requestPayload.password),
      password_reset_token: null,
    })
    return Http.respond({ message: 'Password changed successfully' })
  }

  /**
   *
   * @param request
   * @param response
   */
  public async resendEmailVerification({ request }: HttpContextContract) {
    const requestPayload = await request.validate(EmailCheck)
    let user = await this.studentService.findByOrFail('email', requestPayload.email)
    if (user.email_verified) throw new ConflictException(Messages.user.error.EMAIL_VERIFIED)
    await this.authenticationService.sendEmailVerificationToken(user, request.header('Accept-Language'))
    return Http.respond({ message: Messages.user.general.CONFIRM_EMAIL })
  }
}
