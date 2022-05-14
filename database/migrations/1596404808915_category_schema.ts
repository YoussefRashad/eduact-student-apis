import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CategorySchema extends BaseSchema {
  protected tableName = 'categories'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('parent_id').unsigned()
      table.string('name').notNullable()
      table.string('code').notNullable().unique()
      table.text('icon')
      table.string('theme')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('parent_id').references('id').inTable('categories').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

module.exports = CategorySchema
