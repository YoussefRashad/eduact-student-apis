import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Codes from 'App/Constants/Codes'
import RedirectionException from 'App/Exceptions/RedirectionException'
import Student from '../Models/Student'

export default class IsProfileComplete {
  async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    const student = await Student.findOrFail(request.user.id)
    if (!student.profile_complete) throw new RedirectionException('Please complete your profile first', Codes.Error.Redirect.COMPLETE_PROFILE)
    await next()
  }
}
