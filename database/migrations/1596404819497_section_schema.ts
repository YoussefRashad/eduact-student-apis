import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class SectionSchema extends BaseSchema {
  protected tableName = 'sections'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('classroom_tab_id').unsigned()
      table.integer('classroom_id').unsigned().notNullable()
      table.string('name')
      table.integer('order')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('classroom_tab_id').references('id').inTable('classroom_tabs').onDelete('CASCADE')
      table.foreign('classroom_id').references('id').inTable('classrooms').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

module.exports = SectionSchema
