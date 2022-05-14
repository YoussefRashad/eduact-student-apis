import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class StudentUnitProgresses extends BaseSchema {
  protected tableName = 'student_unit_progresses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('unit_id').unsigned().notNullable()
      table.integer('student_id').unsigned().notNullable()
      table.enu('status', ['not started', 'registered', 'in progress', 'failed', 'not attended', 'completed'])

      table.foreign('unit_id').references('id').inTable('units').onDelete('CASCADE')
      table.foreign('student_id').references('user_id').inTable('students').onDelete('CASCADE')
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
