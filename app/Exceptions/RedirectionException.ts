import { Exception } from '@poppinss/utils'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class RedirectionException extends Exception {
  constructor(message: string, code: number, statusCode: number = 200) {
    super(message, statusCode, String(code))
  }

  /**
   * Implement the handle method to manually handle this exception.
   * Otherwise, it will be handled by the global exception handler.
   */
  public async handle(error: this, { response }: HttpContextContract) {
    response.status(error.status).send({ error: error.message })
  }
}
