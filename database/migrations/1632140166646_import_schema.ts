import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ImportSchema extends BaseSchema {
  protected tableName = 'imports'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('slug')
      table.text('description')
      table.string('status')
      table.text('imported_data')
      table.text('success_data')
      table.text('failed_data')
      table.integer('imported_count')
      table.integer('success_count')
      table.integer('failed_count')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
