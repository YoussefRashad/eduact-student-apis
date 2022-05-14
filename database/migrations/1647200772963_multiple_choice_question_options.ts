import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MultipleChoiceQuestions extends BaseSchema {
  protected tableName = 'multiple_choice_question_options'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('test_question_id').unsigned().notNullable()
      table.text('choice')
      table.boolean('is_correct').defaultTo(false)

      table.foreign('test_question_id').references('id').inTable('test_questions').onDelete('CASCADE')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
