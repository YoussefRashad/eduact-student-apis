import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Http from 'App/Utils/Http'
import NewsfeedService from './Newsfeed.service'
export default class NewsfeedController {
  newsfeedService = new NewsfeedService()
  /**
   * get newsfeed where is_active is true
   * @param param0
   * @returns
   */
  public async newsfeeds({}: HttpContextContract) {
    const newsfeed = await this.newsfeedService.index()
    return Http.respond({
      message: 'newsfeed',
      data: newsfeed,
    })
  }
}
