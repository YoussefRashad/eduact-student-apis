import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StudentProgressInCourse {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    course_id: schema.number(),
    username: schema.string({ trim: true }),
  })

  public messages = {}
}
