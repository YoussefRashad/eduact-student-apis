import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class OrderingQuestions extends BaseSchema {
  protected tableName = 'ordering_question_options'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('test_question_id').unsigned().notNullable()
      table.text('option')
      table.integer('order')

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
