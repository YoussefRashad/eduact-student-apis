import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class CompleteProfile {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    gender: schema.enum(['male', 'female']),
    birth_date: schema.date(),
    student: schema.object().members({
      parent1_relation: schema.enum(['Father', 'Mother', 'Brother', 'Sister', 'Other']),
      parent2_relation: schema.enum(['Father', 'Mother', 'Brother', 'Sister', 'Other']),
      parent1_phone: schema.string({ trim: true }, [rules.minLength(11), rules.maxLength(11)]),
      parent2_phone: schema.string({ trim: true }, [rules.minLength(11), rules.maxLength(11)]),
      school: schema.string({ trim: true }),
      education_type_id: schema.number(),
      education_language_id: schema.number.optional(),
      education_section_id: schema.number.optional(),
      education_year_id: schema.number(),
    }),
    address: schema.object().members({
      governorate: schema.number(),
      city: schema.number(),
    }),
  })

  public messages = {
    'parent1_name.alpha': 'Parent name must be letters from A-Z',
    'parent2_name.alpha': 'Parent name must be letters from A-Z',
    'parent1_phone.number': 'Phone Number must contain only numbers from 0-9',
    'parent2_phone.number': 'Phone Number must contain only numbers from 0-9',
  }
}
