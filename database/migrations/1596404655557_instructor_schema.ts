import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class InstructorSchema extends BaseSchema {
  protected tableName = 'instructors'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().primary()
      table.string('label').notNullable().unique()
      table.text('bio')
      table.integer('weight')
      table.string('fb_link')
      table.string('youtube_link')
      table.string('website_link')
      table.integer('rating').notNullable().defaultTo(0)
      table.integer('rating_count').notNullable().defaultTo(0)
      table.boolean('is_active').notNullable().defaultTo(true)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('user_id').references('id').inTable('users').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
