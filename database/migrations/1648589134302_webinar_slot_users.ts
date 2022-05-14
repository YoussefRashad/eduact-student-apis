import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class WebinarSlotUsers extends BaseSchema {
  protected tableName = 'webinar_slot_users'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('webinar_slot_id').unsigned().notNullable()
      table.integer('student_id').unsigned().notNullable()
      table.string('status').defaultTo('registered')

      table.foreign('webinar_slot_id').references('id').inTable('webinar_slots').onDelete('CASCADE')
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
