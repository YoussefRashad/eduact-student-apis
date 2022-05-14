import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import Instructor from '../Models/Instructor'

export default class IsInstructor {
  async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    const isInstructor = await Instructor.find(request.user.id)
    if (!isInstructor) throw new ForbiddenException('Only Instructors Are Authorized')
    await next()
  }
}
