import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class InstructorCodes extends BaseSchema {
  protected tableName = 'instructor_codes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('student_id').unsigned()
      table.integer('instructor_id').unsigned().notNullable()
      table.string('code')

      table.foreign('student_id').references('user_id').inTable('students').onDelete('CASCADE')
      table.foreign('instructor_id').references('user_id').inTable('instructors').onDelete('CASCADE')
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
