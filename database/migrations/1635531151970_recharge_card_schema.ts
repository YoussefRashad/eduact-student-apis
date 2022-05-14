import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class RechargecardSchema extends BaseSchema {
  protected tableName = 'recharge_cards'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned()
      table.integer('batch').notNullable()
      table.string('code').unique().notNullable()
      table.integer('value').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('user_id').references('user_id').inTable('students').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
