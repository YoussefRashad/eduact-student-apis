import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ForgetPassword {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    identifier: schema.string({ trim: true }),
  })

  public messages = {}
}
