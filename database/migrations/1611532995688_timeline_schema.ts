import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class TimelineSchema extends BaseSchema {
  protected tableName = 'timelines'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.string('event').notNullable()
      table.string('tag').notNullable()
      table.text('description').notNullable()
      table.integer('user_id').unsigned().notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
