import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import _ from 'lodash'

export default class FilterReviewObject {
  public async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    request.body().review = _.pick(request.body(), ['rating', 'comment'])
    await next()
  }
}
