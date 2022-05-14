import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class VerificationSchema extends BaseSchema {
  protected tableName = 'verifications'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('user_id').unsigned()
      table.string('token').notNullable().unique()
      table.enum('type', ['phone', 'email', 'device']).notNullable()
      table.timestamp('expires_on')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
