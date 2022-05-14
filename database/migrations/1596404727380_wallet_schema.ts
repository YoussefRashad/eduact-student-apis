import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class WalletSchema extends BaseSchema {
  protected tableName = 'wallets'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().primary()
      table.float('amount').notNullable().defaultTo(0)
      table.string('currency').notNullable().defaultTo('EGP')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('user_id').references('user_id').inTable('students').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
