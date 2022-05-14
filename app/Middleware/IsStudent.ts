import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import ForbiddenException from 'App/Exceptions/ForbiddenException'
import Student from '../Models/Student'

export default class IsStudent {
  async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    const isStudent = await Student.find(request.user?.id)
    if (!isStudent) throw new ForbiddenException('Only Students Are Authorized')
    await next()
  }
}
