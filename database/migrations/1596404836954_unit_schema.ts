import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class UnitSchema extends BaseSchema {
  protected tableName = 'units'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('course_id').unsigned().notNullable()
      table.string('name').notNullable()
      table.string('type').notNullable()
      table.integer('order')
      table.boolean('active').defaultTo(true)
      table.integer('type_id').unsigned().notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE')
      table.foreign('type_id').references('id').inTable('unit_types').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

module.exports = UnitSchema
