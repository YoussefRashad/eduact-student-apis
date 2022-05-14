import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class StudentSchema extends BaseSchema {
  protected tableName = 'students'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().primary()
      table.integer('education_type_id')
      table.integer('education_language_id')
      table.integer('education_section_id')
      table.integer('education_year_id')
      table.string('school')
      table.string('ssn')
      table.string('parent1_relation')
      table.string('parent1_phone')
      table.string('parent2_relation')
      table.string('parent2_phone')
      table.boolean('profile_complete').notNullable().defaultTo(false)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('education_type_id').references('id').inTable('education_types')
      table.foreign('education_language_id').references('id').inTable('education_languages')
      table.foreign('education_section_id').references('id').inTable('education_sections')
      table.foreign('education_year_id').references('id').inTable('education_years')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
