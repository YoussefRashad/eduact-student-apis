import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BulkMessagesHistories extends BaseSchema {
  protected tableName = 'bulk_messages_histories'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('slug')
      table.text('description')
      table.string('status')
      table.string('via')
      table.text('subject')
      table.text('content')
      table.text('sent_to_data')
      table.text('success_data')
      table.text('failed_data')
      table.integer('sent_to_count')
      table.integer('success_count')
      table.integer('failed_count')

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
