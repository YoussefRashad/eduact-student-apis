import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TransactionSchema extends BaseSchema {
  protected tableName = 'transactions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('transaction_ref').notNullable().unique()
      table.string('provider')
      table.string('provider_ref')
      table.enum('method', ['PAYATFAWRY', 'CARD', 'EWALLET', 'WALLET', 'PAYATAMAN', 'PAYATMASARY', 'CASHCOLLECT']).notNullable()
      table.enum('status', ['unpaid', 'failed', 'pending', 'canceled', 'delivered', 'expired', 'refunded', 'paid', 'new']).notNullable()
      table.float('amount').notNullable()
      table.timestamp('expiry_date')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

module.exports = TransactionSchema
