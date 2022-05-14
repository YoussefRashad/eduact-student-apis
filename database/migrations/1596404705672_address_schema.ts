import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AddressSchema extends BaseSchema {
  protected tableName = 'addresses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').primary().unsigned()
      table.string('building_number')
      table.string('floor')
      table.string('apartment')
      table.string('street')
      table.integer('governorate').notNullable()
      table.integer('city').notNullable()
      table.string('country')
      table.string('postal_code')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('user_id').references('user_id').inTable('students').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
