import Http from 'App/Utils/Http'
import DropdownService from './Dropdown.service'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
export default class DropdownController {
  dropdownService = new DropdownService()
  /**
   *
   * @param param0
   * @returns
   */
  public async fetchCategories({}: HttpContextContract) {
    const categories = await this.dropdownService.getCategories()
    return Http.respond({
      message: 'categories',
      data: categories,
    })
  }

  public async educationInfoDropdown({}: HttpContextContract) {
    const educationInfoDropdown = await this.dropdownService.educationInfoDropdown()
    return Http.respond({
      message: 'categories',
      data: educationInfoDropdown,
    })
  }
}
