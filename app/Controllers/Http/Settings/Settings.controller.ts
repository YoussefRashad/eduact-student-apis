import SettingsService from './Settings.service'
import Http from 'App/Utils/Http'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class SettingsController {
  settingsService = new SettingsService()
  /**
   * get the App settings
   * @param param0
   * @returns
   */
  public async settings({}: HttpContextContract) {
    const settings = await this.settingsService.getAppSetting()
    return Http.respond({
      message: 'App settings',
      data: settings,
    })
  }
}
