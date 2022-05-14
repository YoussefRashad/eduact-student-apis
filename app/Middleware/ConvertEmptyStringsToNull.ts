import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class ConvertEmptyStringsToNull {
  async handle({ request }: HttpContextContract, next: () => Promise<void>) {
    if (Object.keys(request.body).length) {
      // request.body = Object.assign(
      //   ...Object.keys(request.body).map((key) => ({
      //     [key]: request.body[key] !== '' ? request.body[key] : null,
      //   }))
      // )
      request.updateBody(
        Object.assign(
          Object.keys(request.body()).map((key) => ({
            // @ts-ignore
            [key]: request.body[key] !== '' ? request.body[key] : null,
          }))
        )
      )
    }

    await next()
  }
}
