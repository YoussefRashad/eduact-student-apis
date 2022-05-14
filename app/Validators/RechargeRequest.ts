import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RechargeRequest {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    amount: schema.number(),
    method: schema.enum(['fawry', 'card', 'ewallet', 'aman', 'masary'] as const),
    provider: schema.enum(['fawry', 'opay', 'accept'] as const),
    phone: schema.string.optional(),
  })

  public messages = {}
}
