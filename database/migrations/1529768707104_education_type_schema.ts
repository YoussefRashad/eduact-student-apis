import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EducationTypeSchema extends BaseSchema {
  protected tableName = 'education_types'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.string('name').notNullable().unique()
      table.string('code').notNullable().unique()
      table.string('colour_code')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
