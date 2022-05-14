import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class GradeSchemes extends BaseSchema {
  protected tableName = 'grade_schemes'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('test_id').unsigned().notNullable()
      table.string('grade')
      table.integer('from')
      table.integer('to')

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
