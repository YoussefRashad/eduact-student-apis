import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class FormQuestionSchema extends BaseSchema {
  protected tableName = 'form_questions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('admission_form_id').unsigned().notNullable()
      table.integer('question_id').unsigned().notNullable()
      table.integer('order')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('admission_form_id').references('id').inTable('admission_forms')
      table.foreign('question_id').references('id').inTable('questions')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
