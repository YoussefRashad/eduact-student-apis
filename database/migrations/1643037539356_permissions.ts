import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class PermissionSchema extends BaseSchema {
  protected tableName = 'permissions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('name')
      table.string('code').unique()
      table.text('description')
      table.boolean('active').defaultTo(true)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.integer('group_id').unsigned()
      table.foreign('group_id').references('id').inTable('permission_groups')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
