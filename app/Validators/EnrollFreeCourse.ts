import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class EnrollFreeCourse {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    course_id: schema.number(),
  })

  public messages = {}
}
