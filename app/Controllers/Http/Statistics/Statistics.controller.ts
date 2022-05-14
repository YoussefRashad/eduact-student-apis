import Http from 'App/Utils/Http'
import StatisticsService from './Statistics.service'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

export default class StatisticsController {
  statisticsService = new StatisticsService()
  /**
   * get site statistics from instructor, classroom and enrolled classroom
   * @param param0
   * @returns
   */
  public async siteStatistics({}: HttpContextContract) {
    const statistics = await this.statisticsService.siteStatistics()
    return Http.respond({
      message: 'statistics',
      data: statistics,
    })
  }
}
