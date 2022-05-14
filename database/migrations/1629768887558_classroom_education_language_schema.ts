import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ClassroomEducationLanguageSchema extends BaseSchema {
  protected tableName = 'classroom_education_languages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('classroom_id').notNullable().unsigned()
      table.integer('education_language_id').notNullable().unsigned()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.primary(['classroom_id', 'education_language_id'])
      table.foreign('classroom_id').references('id').inTable('classrooms').onDelete('CASCADE')
      table.foreign('education_language_id').references('id').inTable('education_languages')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
