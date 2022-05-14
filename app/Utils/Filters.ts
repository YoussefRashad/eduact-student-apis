export type Option = { name: string; value: string }
export type Filter = { name: string; value: string; options: Option[] }
export type FilterObject = {
  name: string
  value: string
  optionNameColumn: string
  optionValueColumn: any
}
export default class DataFilter {
  Model: any
  filterNames: string[] = []
  filterValues: string[] = []
  filterObjects: FilterObject[]
  data: any = []
  options: Option[] = []
  filter: Filter | undefined
  value: string | undefined
  filters: Filter[] = []

  constructor({ model, filterObjects }: any) {
    this.Model = model
    this.filterObjects = filterObjects
  }

  public getFilterNames(): void {
    this.filterObjects.forEach((obj) => this.filterNames.push(obj.value))
  }

  public async getDistinctData(filterNames = this.filterNames): Promise<any> {
    this.data = await this.Model.query()
      .distinctOn(...filterNames)
      .pojo()
  }
  public setName(filterValue: string): void {
    this.filter = {
      name: filterValue.charAt(0).toUpperCase() + filterValue.slice(1),
      value: '',
      options: [],
    }
  }

  public setValue(filterValue: string): void {
    if (this.filter) this.filter.value = filterValue
  }

  public setOptions(filterNameColumn: string, filterValueColumn: string, filter = this.filter) {
    this.data.map((obj: any) => {
      if (!this.options.some((option) => option.value === obj[filterValueColumn]))
        this.options.push({
          name: String(obj[filterNameColumn]),
          value: obj[filterValueColumn],
        })
    })
    if (this.filter) this.filter.options = this.options
    this.options = []
    return filter
  }

  public setOneFilter(filterName: string, filterValue: string, filterNameColumn: string, filterValueColumn: string) {
    this.setName(filterName)
    this.setValue(filterValue)
    return this.setOptions(filterNameColumn, filterValueColumn)
  }

  public setManyFilters(filterObjects = this.filterObjects) {
    filterObjects.forEach((obj) => {
      const filter: any = this.setOneFilter(obj.name, obj.value, obj.optionNameColumn, obj.optionValueColumn)
      this.filters.push(filter)
    })
  }

  public parseFilters() {
    return this.filters
  }

  public async process(): Promise<any> {
    this.getFilterNames()
    await this.getDistinctData()
    this.setManyFilters(this.filterObjects)
    return this.parseFilters()
    // return this.modifyLegacy(parseFilter)
  }

  public async modifyLegacy(parseFilter: any) {
    return parseFilter.map((filter: any) => {
      const valueName = filter.value
      delete filter.name
      delete filter.value
      const newObject = {}
      delete Object.assign(newObject, filter, {
        [valueName]: filter['options'],
      })['options']
      return newObject
    })
  }
}
