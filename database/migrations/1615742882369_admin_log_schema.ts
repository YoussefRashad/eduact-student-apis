import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AdminLogSchema extends BaseSchema {
  protected tableName = 'admin_logs'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('event').notNullable()
      table.string('tag').notNullable()
      table.text('description').notNullable()
      table.integer('admin_id').unsigned().notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('admin_id').references('id').inTable('admins')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
