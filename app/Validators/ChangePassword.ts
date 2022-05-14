import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ChangePassword {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    old_password: schema.string({ trim: false }, [rules.minLength(8), rules.maxLength(20)]),
    new_password: schema.string({ trim: false }, [rules.minLength(8), rules.maxLength(20)]),
    confirm_new_password: schema.string({ trim: false }, [rules.minLength(8), rules.maxLength(20)]),
  })

  public messages = {}
}
