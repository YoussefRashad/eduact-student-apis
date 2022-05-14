import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TestModelQuestions extends BaseSchema {
  protected tableName = 'test_model_questions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('test_model_id').unsigned().notNullable()
      table.integer('test_question_id').unsigned().notNullable()
      table.integer('order')

      table.foreign('test_model_id').references('id').inTable('test_models').onDelete('CASCADE')
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
