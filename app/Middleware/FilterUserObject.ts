import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import _ from 'lodash'

export default class FilterUserObject {
  async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    // call next to advance the request
    request.updateBody(
      _.pick(request.body(), ['first_name', 'middle_name', 'last_name', 'gender', 'profile_photo', 'birth_date', 'address', 'student', 'instructor'])
    )
    request.body().address = _.omit(request.body().address, ['user_id', 'created_at', 'updated_at'])
    request.body().student = _.omit(request.body().student, ['user_id', 'profile_complete', 'created_at', 'updated_at'])
    request.body().instructor = _.omit(request.body().instructor, ['user_id', 'tid', 'branch_id', 'branch_name', 'created_at', 'updated_at'])

    await next()
  }
}
