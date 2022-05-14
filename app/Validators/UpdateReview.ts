import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class UpdateReview {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    review: schema.object().members({
      rating: schema.string({ trim: true, escape: true }),
      comment: schema.string({ trim: true, escape: true }),
    }),
  })

  public messages = {}
}
