import EducationType from 'App/Models/EducationType'

export default class DropdownRepository {
  public async educationInfoDropdown() {
    return EducationType.query()
      .preload('educationLanguages', (query) => {
        query.orderBy('id')
      })
      .preload('educationYears', (query) => {
        query.orderBy('id')
        query.preload('educationSections')
      })
      .exec()
  }
}
