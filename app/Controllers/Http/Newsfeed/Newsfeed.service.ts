import Newsfeed from 'App/Models/Newsfeed'

export default class NewsfeedService {
  /**
   * get newsfeed where is_active is true
   * @returns
   */
  public async index() {
    return Newsfeed.query().where('is_active', true)
  }
}
