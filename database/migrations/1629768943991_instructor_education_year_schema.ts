import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class InstructorEducationYearSchema extends BaseSchema {
  protected tableName = 'instructor_education_years'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('instructor_id').notNullable().unsigned()
      table.integer('education_year_id').notNullable().unsigned()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.primary(['instructor_id', 'education_year_id'])
      table.foreign('instructor_id').references('user_id').inTable('instructors')
      table.foreign('education_year_id').references('id').inTable('education_years')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
