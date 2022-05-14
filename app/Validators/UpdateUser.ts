import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class UpdateUser {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    phone_number: schema.string.optional({ trim: true }, [rules.minLength(11), rules.maxLength(11)]),
    first_name: schema.string.optional({ trim: true, escape: true }),
    middle_name: schema.string.optional({ trim: true, escape: true }),
    last_name: schema.string.optional({ trim: true, escape: true }),
    gender: schema.enum.optional(['male', 'female']),
    birth_date: schema.date.optional(),
    student: schema.object.optional().members({
      parent1_relation: schema.enum.optional(['Father', 'Mother', 'Brother', 'Sister', 'Other']),
      parent2_relation: schema.enum.optional(['Father', 'Mother', 'Brother', 'Sister', 'Other']),
      parent1_phone: schema.string.optional({ trim: true }, [rules.minLength(11), rules.maxLength(11)]),
      parent2_phone: schema.string.optional({ trim: true }, [rules.minLength(11), rules.maxLength(11)]),
      education_language_id: schema.number.optional(),
      education_type_id: schema.number.optional(),
      education_year_id: schema.number.optional(),
      education_section_id: schema.number.optional(),
      school: schema.string.optional(),
    }),
    address: schema.object.optional().members({
      governorate: schema.number.optional(),
      city: schema.number.optional(),
      building_number: schema.string.optional({ trim: true, escape: true }),
      floor: schema.string.optional({ trim: true, escape: true }),
      apartment: schema.string.optional({ trim: true, escape: true }),
      street: schema.string.optional({ trim: true, escape: true }),
      postal_code: schema.string.optional({ trim: true, escape: true }),
      country: schema.string.optional({ trim: true, escape: true }),
    }),
  })

  public messages = {
    'first_name.alpha': 'First name must be letters from A-Z',
    'last_name.alpha': 'Last name must be letters from A-Z',
    'middle_name.alpha': 'Middle name must be letters from A-Z',
    'student.parent1_name.alpha': 'Parent name must be letters from A-Z',
    'student.parent2_name.alpha': 'Parent name must be letters from A-Z',
  }
}
