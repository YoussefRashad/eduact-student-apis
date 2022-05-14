import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CoursePrerequisitesSchema extends BaseSchema {
  protected tableName = 'course_prerequisites'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('course_id').unsigned().notNullable()
      table.integer('prerequisite').unsigned().notNullable()
      table.integer('path').unsigned().notNullable().defaultTo(1)

      table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE')
      table.foreign('prerequisite').references('id').inTable('courses').onDelete('CASCADE')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
