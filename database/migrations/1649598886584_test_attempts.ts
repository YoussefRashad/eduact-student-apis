import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TestAttempts extends BaseSchema {
  protected tableName = 'test_attempts'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('student_id').unsigned().notNullable()
      table.integer('test_id').unsigned().notNullable()
      table.enum('status', ['passed', 'failed'])
      table.float('score')
      table.string('grade')
      table.integer('test_model_id').unsigned().nullable()
      table.timestamp('end_date')
      table.boolean('active').defaultTo(true)

      table.foreign('student_id').references('user_id').inTable('students').onDelete('CASCADE')
      table.foreign('test_id').references('id').inTable('tests').onDelete('CASCADE')
      table.foreign('test_model_id').references('id').inTable('test_models').onDelete('CASCADE')

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
