import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ResponseSchema extends BaseSchema {
  protected tableName = 'responses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('admission_form_response_id').unsigned().notNullable()
      table.integer('question_id').unsigned().notNullable()
      table.integer('student_id').unsigned().notNullable()
      table.text('answer')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('admission_form_response_id').references('id').inTable('admission_form_responses').onDelete('cascade')
      table.foreign('question_id').references('id').inTable('questions').onDelete('cascade')
      table.foreign('student_id').references('user_id').inTable('students').onDelete('cascade')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
