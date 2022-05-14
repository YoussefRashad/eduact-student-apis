import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class DragDropQuestionOptions extends BaseSchema {
  protected tableName = 'drag_drop_question_options'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('test_question_id').unsigned().notNullable()
      table.string('value')
      table.integer('gap').nullable()

      table.foreign('test_question_id').references('id').inTable('test_questions').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
