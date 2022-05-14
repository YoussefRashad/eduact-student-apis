export default class ControllersUtils {
  public static async applySearchOnQuery(query: any, columns: any[], searchString: any) {
    if (searchString) {
      query.where((innerQuery: any) => {
        columns.forEach((column) => innerQuery.orWhere(column, 'ilike', `%${searchString}%`))
      })
      return query
    }
  }

  public static async applyFromOnQuery(query: any, from: any, dateField = 'created_at') {
    if (from) return query.whereRaw(`${dateField} >= '${from.toString().split('T')[0]}'`)
  }

  public static async applyToOnQuery(query: any, to: any, dateField = 'created_at') {
    if (to) return query.whereRaw(`${dateField} <= '${to.toString().split('T')[0]}'`)
  }

  public static async applySortByOnQuery(query: any, sortBy: any, tablename: any = undefined) {
    // direction ternary operator for type checking
    if (sortBy) {
      return query.orderBy(sortBy.field, sortBy.direction === 'asc' ? 'asc' : 'desc')
    }
    return query.orderBy(tablename ? tablename + '.created_at' : 'created_at', 'desc')
  }

  public static async applyFiltersOnQuery(query: any, filters: any[]) {
    if (filters) filters.forEach((filter) => query.where(filter))
    return query
  }

  /**
   * apply all query operations: search, filters, sorting, from and to date where clauses on the created_at column
   */
  public static async applyAllQueryUtils(
    query: any,
    from: any,
    to: any,
    filters: any,
    sortBy: any,
    columns: any,
    searchString: any,
    tableName: any = undefined
  ) {
    await this.applyFiltersOnQuery(query, filters)
    await this.applySearchOnQuery(query, columns, searchString)
    if (tableName) {
      await this.applyFromOnQuery(query, from, `${tableName + '.created_at'}`)
      await this.applyToOnQuery(query, to, `${tableName + '.created_at'}`)
    } else {
      await this.applyFromOnQuery(query, from)
      await this.applyToOnQuery(query, to)
    }
    await this.applySortByOnQuery(query, sortBy, tableName)
    return query
  }
}
