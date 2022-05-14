import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class NewsFeedSchema extends BaseSchema {
  protected tableName = 'news_feeds'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.text('content')
      table.string('photo')
      table.string('redirection_url')
      table.boolean('is_active').notNullable().defaultTo(false)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
