import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class WebinarSlots extends BaseSchema {
  protected tableName = 'webinar_slots'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('webinar_id').unsigned().notNullable()
      table.timestamp('start_time').notNullable()
      table.timestamp('end_time')
      table.integer('capacity')
      table.integer('duration').notNullable()
      table.string('description').notNullable()
      table.string('slot_url').notNullable()
      table.foreign('webinar_id').references('id').inTable('webinars').onDelete('CASCADE')

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
