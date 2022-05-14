import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TestQuestions extends BaseSchema {
  protected tableName = 'test_questions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('test_id').unsigned().notNullable()
      table.integer('weight')
      table.text('content')
      table.text('parsed_content')
      table.string('type')
      table.text('feedback')
      table.integer('order')

      table.foreign('test_id').references('id').inTable('tests').onDelete('CASCADE')
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
