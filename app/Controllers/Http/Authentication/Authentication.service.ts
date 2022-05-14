import Env from '@ioc:Adonis/Core/Env'
import Codes from 'App/Constants/Codes'
import Messages from 'App/Constants/Messages'
import ConflictException from 'App/Exceptions/ConflictException'
import CustomException from 'App/Exceptions/CustomException'
import BlockedEmail from 'App/Models/BlockedEmail'
import User from 'App/Models/User'
import Verification from 'App/Models/Verification'
import { Mail } from 'App/Utils/Mail'
import Utils from 'App/Utils/Utils'
import StudentService from '../Student/Student.service'
import Student from 'App/Models/Student'
import Http from 'App/Utils/Http'
import AuthenticationRepository from './Authentication.repository'
import Hash from '@ioc:Adonis/Core/Hash'
import HttpContext from '@ioc:Adonis/Core/HttpContext'
// @ts-ignore
import { stringifyEmail } from 'email-stringify'
import ILoginResponse from 'App/Interfaces/ILoginResponse.interface'
import ResourceNotFoundException from 'App/Exceptions/ResourceNotFoundException'

export default class AuthenticationService {
  private authenticationRepository = new AuthenticationRepository()
  private studentService = new StudentService()
  /**
   *
   * @param email
   * @returns
   */
  public async isValidMailBoxOrFail(email: string): Promise<any> {
    return Mail.isValidEmail(email)
  }

  /**
   * Check if this email is blocked and exists in blocked emails list
   * @param email
   */
  public async isNotBlockedEmailOrFail(email: string): Promise<void> {
    const blockedEmail = await BlockedEmail.findBy('email', email)
    if (blockedEmail) {
      throw new CustomException('Email is blocked, Please contact out customer service', Codes.Error.Http.BAD_REQUEST)
    }
  }

  /**
   *
   * @param identifier
   * @param password
   */
  public async login(identifier: string, password: string): Promise<ILoginResponse | null> {
    const ctx = HttpContext.get()!
    let user: User = await this.studentService.findByEmailOrPhoneOrFail(identifier)
    if (!user) {
      throw new ResourceNotFoundException('User not found')
    }
    let authObj = await ctx.auth.attempt(identifier, password)
    await this.saveLoginIp(user)
    const userProfile = await this.studentService.getUserProfile(user.id)
    if (!user.email_verified) {
      await this.sendEmailVerificationToken(user, ctx.request.header('Accept-Language'))
      this.sendEmailRedirectionResponse(authObj.token, userProfile, userProfile.type)
      return null
    }

    await user.load('student')
    await this.studentService.createStudentWallet(user.student)
    if (!user.student.profile_complete) {
      this.sendCompleteProfileRedirectionResponse(authObj.token, userProfile, userProfile.type)
      return null
    }
    return { user: user, type: userProfile.type, token: authObj.token }
  }

  /**
   *
   * @param user
   * @param localization
   */
  public async sendEmailVerificationToken(user: User, localization: string = 'ar') {
    const verification = await this.addVerificationToken(user.id, 'email')
    try {
      await Mail.sendEmail(
        user.email,
        localization === 'ar' ? Messages.email.subject.emailVerification_ar : Messages.email.subject.emailVerification,
        await stringifyEmail({
          filename: 'verify-' + localization,
          args: {
            name: user.first_name,
            verify_url: Env.get('FRONTEND_URL') + '/verify/' + verification.token,
          },
        })
      )
    } catch (error) {
      console.log('email failed to be sent', error)
    }
  }

  /**
   *
   * @param id
   * @param type
   * @returns
   */
  async addVerificationToken(id: number, type: string): Promise<Verification> {
    const verification = await Verification.query().where('user_id', id).where('type', type).where('expires_on', '>', Utils.now()).first()
    if (!verification) {
      return Verification.create({
        user_id: id,
        token: await Utils.generateToken(),
        type: type,
        expires_on: Utils.expiryTime(6),
      })
    }
    return verification
  }

  /**
   *
   * @param userData
   * @param language
   * @returns
   */
  public async createUserAndSendVerificationMail(userData: any, language: string | undefined): Promise<User> {
    let user: User = new User()
    try {
      user = await this.studentService.createStudent(userData)
      await this.sendEmailVerificationToken(user, language)
    } catch (error: any) {
      if (Number(error.code) === Number(Codes.Error.Database.UNIQUE_VIOLATION)) {
        switch (error.constraint) {
          case 'users_phone_number_unique':
            throw new ConflictException(Messages.user.error.PHONE_UNIQUE)
          case 'users_email_unique':
            throw new ConflictException(Messages.user.error.EMAIL_UNIQUE)
          default:
            throw error
        }
      }
      throw error
    }
    return user
  }
  /**
   * Save the public ip of the user
   * @param user
   */
  async saveLoginIp(user: User) {
    const ctx = HttpContext.get()!
    const student: Student = await user.student
    if (student) student.related('ips').create({ ip_address: ctx.request.ip() })
  }

  /**
   *
   * @param token
   * @param user
   * @param type
   * @returns
   */
  sendEmailRedirectionResponse(token: string, user: User, type: string[]) {
    return Http.sendAuthenticatedRedirectionResponse(token, user, type, Codes.Error.Redirect.EMAIL_VERIFICATION, Messages.user.general.CONFIRM_EMAIL)
  }

  /**
   *
   * @param token
   * @param user
   * @param type
   * @returns
   */
  sendCompleteProfileRedirectionResponse(token: string, user: User, type: string[]) {
    return Http.sendAuthenticatedRedirectionResponse(token, user, type, Codes.Error.Redirect.COMPLETE_PROFILE, Messages.user.general.COMPLETE_PROFILE)
  }

  /**
   *
   * @param token
   * @param type
   * @returns
   */
  async getNonExpiredVerificationOrFail(token: string, type: string): Promise<Verification> {
    const tokenObj = await this.authenticationRepository.getNonExpiredVerificationByToken(token, type)
    if (!tokenObj) throw new CustomException('Invalid or Expired token', Codes.Error.Http.BAD_REQUEST)
    return tokenObj
  }

  /**
   *
   * @param token
   * @returns
   */
  public async deleteVerificationToken(token: string): Promise<void> {
    return this.authenticationRepository.deleteVerificationToken(token)
  }

  /**
   *
   * @param user
   * @returns
   */
  public async generateLoginToken(user: User): Promise<string> {
    const ctx = HttpContext.get()!
    return (await ctx.auth.login(user)).token
  }

  /**
   *
   * @param user
   * @param localization
   */
  public async sendResetPasswordToken(user: User, localization: string = 'ar') {
    let token = await Utils.generateToken()
    await this.studentService.updateUser(user.id, { password_reset_token: token })
    try {
      await Mail.sendEmail(
        user.email,
        localization === 'ar' ? Messages.email.subject.resetPassword_ar : Messages.email.subject.resetPassword,
        await stringifyEmail({
          filename: 'resetPassword-' + localization,
          args: {
            name: user.first_name,
            reset_url: Env.get('FRONTEND_URL') + '/reset/' + token,
          },
        })
      )
    } catch (error) {
      console.log(error)
    }
  }

  public async hashPassword(password: string): Promise<string> {
    return Hash.make(password)
  }
}
