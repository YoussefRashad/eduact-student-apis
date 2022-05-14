import IHttpResponse from 'App/Interfaces/IHttpResponse.interface'
import Codes from 'App/Constants/Codes'
import User from 'App/Models/User'
import HttpContext from '@ioc:Adonis/Core/HttpContext'

export default class Http {
  public static respond({ message, data = {}, meta = null, filters = null, show = true, statusCode = 200 }: IHttpResponse) {
    const ctx = HttpContext.get()!
    const responseBody: any = {
      data: data,
      meta: meta,
      message: message,
      filters: filters,
      show: show,
    }
    return ctx.response.status(statusCode).send(responseBody)
  }

  static sendAuthenticatedRedirectionResponse(token: string, user: User, type: string[], redirectionCode: number, message: string) {
    return this.respond({
      data: {
        token: token,
        user: user,
        type: type,
        redirect: redirectionCode,
      },
      message,
    })
  }

  static sendForbiddenRedirectionResponse(redirectionCode: string, message: string) {
    return this.respond({
      data: {
        redirect: redirectionCode,
      },
      message,
      statusCode: Codes.Error.Http.FORBIDDEN,
    })
  }
}
