import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class WalletLogSchema extends BaseSchema {
  protected tableName = 'wallet_logs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.float('old_amount').notNullable()
      table.float('amount').notNullable()
      table.float('new_amount').notNullable()
      table.text('description')
      table.integer('user_id').unsigned().notNullable()
      table.integer('invoice_id').unsigned().nullable()
      table.timestamp('timestamp').defaultTo(this.now())
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
      table.foreign('invoice_id').references('id').inTable('invoices').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
