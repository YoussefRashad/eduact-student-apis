import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class BuyNow {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    course_id: schema.number(),
    payment_method: schema.enum(['wallet', 'scratchCard']),
    code: schema.string({ trim: true }),
  })

  public messages = {}
}
