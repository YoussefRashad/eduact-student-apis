import Category from 'App/Models/Category'
import DropdownRepository from './Dropdown.repository'
export default class DropdownService {
  dropdownRepository = new DropdownRepository()
  /**
   *
   * @returns
   */
  public async getCategories() {
    return Category.all()
  }
  public async educationInfoDropdown() {
    return this.dropdownRepository.educationInfoDropdown()
  }
}
