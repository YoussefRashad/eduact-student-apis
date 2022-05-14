import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class InvoiceSchema extends BaseSchema {
  protected tableName = 'invoices'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('transaction_id').unsigned()
      table.integer('user_id').unsigned().notNullable()
      table.string('invoice_ref').notNullable()
      table.float('total_price').notNullable()
      table.float('price').notNullable()
      table.float('tax').notNullable().defaultTo(0)
      table.float('discount').defaultTo(0)
      table.enum('type', ['recharge', 'purchase', 'refund']).notNullable()
      table.enum('status', ['unpaid', 'failed', 'pending', 'canceled', 'delivered', 'expired', 'refunded', 'paid', 'new'])
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('transaction_id').references('id').inTable('transactions')
      table.foreign('user_id').references('user_id').inTable('students').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

module.exports = InvoiceSchema
