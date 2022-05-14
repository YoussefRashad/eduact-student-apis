import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RechargeRequestCallback {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    provider: schema.enum(['fawry']),
  })

  public messages = {}
}
