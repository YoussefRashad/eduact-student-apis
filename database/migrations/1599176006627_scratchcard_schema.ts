import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ScratchcardSchema extends BaseSchema {
  protected tableName = 'scratchcards'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('user_id').unsigned()
      table.integer('course_id').unsigned()
      table.integer('classroom_id').unsigned().notNullable()
      table.integer('batch').notNullable()
      table.string('code').unique().notNullable().index('code')
      table.string('serial').unique().notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('user_id').references('user_id').inTable('students').onDelete('CASCADE')
      table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE')
      table.foreign('classroom_id').references('id').inTable('classrooms').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

module.exports = ScratchcardSchema
