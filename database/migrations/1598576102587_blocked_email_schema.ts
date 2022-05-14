import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class BlockedEmailSchema extends BaseSchema {
  protected tableName = 'blocked_emails'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('email').notNullable().unique()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

module.exports = BlockedEmailSchema
