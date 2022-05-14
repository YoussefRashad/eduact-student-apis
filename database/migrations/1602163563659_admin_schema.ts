import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AdminSchema extends BaseSchema {
  protected tableName = 'admins'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('uuid').notNullable().unique()
      table.string('email', 254).notNullable().unique()
      table.string('username').notNullable().unique()
      table.string('password').notNullable()
      table.string('phone_number').notNullable().unique()
      table.string('first_name').notNullable()
      table.string('middle_name')
      table.string('last_name').notNullable()
      table.string('type').notNullable()
      table.enum('gender', ['male', 'female'])
      table.text('profile_photo')
      table.boolean('active').notNullable().defaultTo(true)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

module.exports = AdminSchema
