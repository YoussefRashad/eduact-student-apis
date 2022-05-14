import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class QuestionSchema extends BaseSchema {
  protected tableName = 'questions'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.text('question').notNullable()
      table.string('type').notNullable()
      table.text('options')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
