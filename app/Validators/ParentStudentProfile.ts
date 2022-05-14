import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ParentStudentProfile {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    parentPhone: schema.string({ trim: true }, [rules.minLength(11), rules.maxLength(11)]),
    username: schema.string({ trim: true }),
  })

  public messages = {}
}
