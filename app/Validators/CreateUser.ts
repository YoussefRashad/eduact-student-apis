import { schema, rules } from '@ioc:Adonis/Core/Validator'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { password } from 'App/Constants/Regex'

export default class CreateUser {
  constructor(protected ctx: HttpContextContract) {}

  public schema = schema.create({
    email: schema.string({ trim: true }),
    password: schema.string({ trim: true }, [rules.minLength(8), rules.maxLength(20), rules.regex(password)]),
    phone_number: schema.string({ trim: true }, [rules.maxLength(11), rules.maxLength(11)]),
    first_name: schema.string({ trim: true, escape: true }),
    middle_name: schema.string({ trim: true, escape: true }, [rules.minLength(2)]),
    last_name: schema.string({ trim: true, escape: true }, [rules.maxLength(8), rules.maxLength(20)]),
    gender: schema.enum.optional(['male', 'female']),
    birth_date: schema.date.optional(),
  })

  public messages = {
    'first_name.alpha': 'First name must be letters from A-Z',
    'last_name.alpha': 'Last name must be letters from A-Z',
    'email.email': 'Email must be a valid email format (User@example.com)',
    'phone_number.number': 'Phone Number must contain only numbers from 0-9',
    'password.regex': 'The password must contain lettters and numbers Ex: letters1234',
  }
}
