import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class InstructorEducationLanguageSchema extends BaseSchema {
  protected tableName = 'instructor_education_languages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('instructor_id').notNullable().unsigned()
      table.integer('education_language_id').notNullable().unsigned()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.primary(['instructor_id', 'education_language_id'])
      table.foreign('instructor_id').references('user_id').inTable('instructors')
      table.foreign('education_language_id').references('id').inTable('education_languages')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
