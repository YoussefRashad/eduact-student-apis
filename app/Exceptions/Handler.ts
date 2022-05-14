/*
|--------------------------------------------------------------------------
| Http Exception Handler
|--------------------------------------------------------------------------
|
| AdonisJs will forward all exceptions occurred during an HTTP request to
| the following class. You can learn more about exception handling by
| reading docs.
|
| The exception handler extends a base `HttpExceptionHandler` which is not
| mandatory, however it can do lot of heavy lifting to handle the errors
| properly.
|
*/

import Logger from '@ioc:Adonis/Core/Logger'
import Http from 'App/Utils/Http'
import Codes from 'App/Constants/Codes'
import { Mail } from '../Utils/Mail'
import HttpExceptionHandler from '@ioc:Adonis/Core/HttpExceptionHandler'

export default class ExceptionHandler extends HttpExceptionHandler {
  constructor() {
    super(Logger)
  }

  public async handle(error: any) {
    //response.status(error.status).send(error.message)
    switch (error.name) {
      case 'ValidationException':
        console.log(error)
        return Http.respond({
          message: error.messages.errors[0].field + ' ' + error.messages.errors[0].message,
          statusCode: Codes.Error.Http.BAD_REQUEST,
        })
      case 'UnauthorizedException':
        return Http.respond({
          message: error.message,
          statusCode: Codes.Error.Http.UNAUTHORIZED,
        })
      case 'ResourceNotFoundException':
        return Http.respond({
          message: error.message,
          statusCode: Codes.Error.Http.NOT_FOUND,
        })
      case 'ConflictException':
        return Http.respond({
          message: error.message,
          statusCode: Codes.Error.Http.CONFLICT,
        })
      case 'ForbiddenException':
        return Http.respond({
          message: error.message,
          statusCode: Codes.Error.Http.FORBIDDEN,
        })
      case 'CustomException':
        return Http.respond({
          message: error.message,
          statusCode: error.status,
        })
      case 'RedirectionException':
        return Http.respond({
          data: { redirect: Number(error.code) },
          message: error.message,
          statusCode: error.status || 200,
        })
      case 'BadRequestException':
        return Http.respond({
          message: error.message,
          statusCode: Codes.Error.Http.BAD_REQUEST,
        })
      default:
        if (error.status === 500 && process.env.NODE_ENV === 'production') {
          await Mail.sendEmail('ynabil@eduact.com', 'ERROR 500, Please Check!!', error.stack)
        }
        return Http.respond({
          message: error.status === 500 ? 'Oops!! Something went wrong.' : error.message,
          statusCode: error.status || Codes.Error.Http.INTERNAL_SERVER_ERROR,
        })
    }
  }
}
