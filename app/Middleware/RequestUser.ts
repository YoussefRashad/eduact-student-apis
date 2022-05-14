import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User'

export default class RequestUser {
  public async handle({ request, auth }: HttpContextContract, next: () => Promise<void>) {
    // code for middleware goes here. ABOVE THE NEXT CALL
    try {
      if (await auth.check()) {
        request.user = <User>await auth.user
        await request.user?.load('student')
        await request.user?.load('instructor')
      }
    } catch (e) {}
    await next()
  }
}
