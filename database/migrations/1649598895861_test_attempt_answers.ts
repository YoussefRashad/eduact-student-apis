import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TestAttemptAnswers extends BaseSchema {
  protected tableName = 'test_attempt_answers'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('test_attempt_id').unsigned().notNullable()
      table.integer('test_question_id').unsigned().notNullable()
      table.boolean('correct')
      table.jsonb('content')
      table.float('score')

      table.foreign('test_attempt_id').references('id').inTable('test_attempts').onDelete('CASCADE')
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
