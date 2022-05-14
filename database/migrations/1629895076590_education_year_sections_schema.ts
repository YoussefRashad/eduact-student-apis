import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EducationYearSectionsSchema extends BaseSchema {
  protected tableName = 'education_year_sections'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('education_year_id').notNullable().unsigned()
      table.integer('education_section_id').notNullable().unsigned()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.primary(['education_year_id', 'education_section_id'])
      table.foreign('education_year_id').references('id').inTable('education_years')
      table.foreign('education_section_id').references('id').inTable('education_sections')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
