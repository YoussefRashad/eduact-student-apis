import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class MatchingQuestionOptions extends BaseSchema {
  protected tableName = 'matching_question_options'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('test_question_id').unsigned().notNullable()
      table.foreign('test_question_id').references('id').inTable('test_questions').onDelete('CASCADE')
      table.string('value')
      table.string('match')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
