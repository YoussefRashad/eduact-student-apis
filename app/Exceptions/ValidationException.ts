import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Exception } from '@poppinss/utils'

export default class ValidationException extends Exception {
  constructor(message: string) {
    super(message, 400)
  }

  /**
   * Implement the handle method to manually handle this exception.
   * Otherwise it will be handled by the global exception handler.
   */
  public async handle(error: this, { response }: HttpContextContract) {
    response.status(error.status).send({ error: error.message })
  }
}
