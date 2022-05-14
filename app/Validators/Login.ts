import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class Login {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    identifier: schema.string({ trim: true }),
    password: schema.string({ trim: true }, [rules.minLength(8), rules.maxLength(20)]),
  })

  public messages = {}
}
