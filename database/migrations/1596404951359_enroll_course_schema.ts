import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class EnrollCourseSchema extends BaseSchema {
  protected tableName = 'enroll_courses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('user_id').unsigned().notNullable()
      table.integer('course_id').unsigned().notNullable()
      table.string('purchase_method').notNullable()
      table.boolean('expired').notNullable().defaultTo(false)
      table.timestamp('expire_at')
      table.float('progress').defaultTo(0)
      table.integer('completed_units').defaultTo(0)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.primary(['user_id', 'course_id'])
      table.foreign('user_id').references('user_id').inTable('students').onDelete('CASCADE')
      table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

module.exports = EnrollCourseSchema
