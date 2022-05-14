import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TrustedDeviceSchema extends BaseSchema {
  protected tableName = 'trusted_devices'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').unsigned()
      table.string('device_uuid')
      table.string('device').notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.primary(['user_id', 'device_uuid'])
      table.foreign('user_id').references('user_id').inTable('students').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
