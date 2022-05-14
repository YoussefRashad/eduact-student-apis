import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EducationTypeLanguageSchema extends BaseSchema {
  protected tableName = 'education_type_languages'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('education_type_id').notNullable().unsigned()
      table.integer('education_language_id').notNullable().unsigned()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.primary(['education_type_id', 'education_language_id'])
      table.foreign('education_type_id').references('id').inTable('education_types')
      table.foreign('education_language_id').references('id').inTable('education_languages')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
