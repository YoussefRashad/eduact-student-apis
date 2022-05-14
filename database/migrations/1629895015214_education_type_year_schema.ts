import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EducationTypeYearSchema extends BaseSchema {
  protected tableName = 'education_type_years'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('education_type_id').notNullable().unsigned()
      table.integer('education_year_id').notNullable().unsigned()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.primary(['education_type_id', 'education_year_id'])
      table.foreign('education_type_id').references('id').inTable('education_types')
      table.foreign('education_year_id').references('id').inTable('education_years')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
