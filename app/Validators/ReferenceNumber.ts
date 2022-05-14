import { schema } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ReferenceNumber {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    reference_number: schema.string(),
  })

  public messages = {}
}
