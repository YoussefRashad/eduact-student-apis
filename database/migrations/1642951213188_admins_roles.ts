import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AdminsRoles extends BaseSchema {
  protected tableName = 'admin_roles'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('admin_id').unsigned()
      table.integer('role_id').unsigned()
      table.foreign('admin_id').references('id').inTable('admins')
      table.foreign('role_id').references('id').inTable('roles')

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
