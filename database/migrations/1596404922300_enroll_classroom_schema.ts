import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EnrollClassroomSchema extends BaseSchema {
  protected tableName = 'enroll_classrooms'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().notNullable()
      table.integer('classroom_id').unsigned().notNullable()
      table.boolean('active').defaultTo(true)
      table.integer('completed_courses').defaultTo(0)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.primary(['user_id', 'classroom_id'])
      table.foreign('user_id').references('user_id').inTable('students').onDelete('CASCADE')
      table.foreign('classroom_id').references('id').inTable('classrooms').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

module.exports = EnrollClassroomSchema
