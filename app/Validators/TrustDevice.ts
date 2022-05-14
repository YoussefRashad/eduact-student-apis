import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class TrustDevice {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    'device-uuid': schema.string({ trim: true }, [
      rules.regex(new RegExp('[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}')),
    ]),
  })

  public messages = {}
}
