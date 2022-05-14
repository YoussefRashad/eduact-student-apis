import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ClassroomEducationYearSchema extends BaseSchema {
  protected tableName = 'classroom_education_years'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('classroom_id').notNullable().unsigned()
      table.integer('education_year_id').notNullable().unsigned()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.primary(['classroom_id', 'education_year_id'])
      table.foreign('classroom_id').references('id').inTable('classrooms').onDelete('CASCADE')
      table.foreign('education_year_id').references('id').inTable('education_years')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
