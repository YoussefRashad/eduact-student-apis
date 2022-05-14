import AppSetting from 'App/Models/AppSetting'
export default class SettingsService {
  /**
   * get the first row from AppSetting
   * @returns
   */
  public async getAppSetting() {
    return AppSetting.first()
  }
}
