import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Webinars extends BaseSchema {
  protected tableName = 'webinars'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('unit_id').unsigned().notNullable()
      table.string('name').notNullable()
      table.string('description').notNullable()
      table.foreign('unit_id').references('id').inTable('units').onDelete('CASCADE')

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
