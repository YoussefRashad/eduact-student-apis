import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class SupportEmail {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    subject: schema.string({ trim: true, escape: true }),
    body: schema.string({ trim: true, escape: true }, [rules.minLength(8)]),
  })

  public messages = {}
}
