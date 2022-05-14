import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class FetchInvoicesValidator {
  constructor(protected ctx?: HttpContextContract) {}

  public schema = schema.create({
    filters: schema.array.optional().anyMembers(),
    from: schema.date.optional(),
    to: schema.date.optional(),
  })

  public messages = {}
}
