import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ClassroomEducationTypeSchema extends BaseSchema {
  protected tableName = 'classroom_education_types'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('classroom_id').notNullable().unsigned()
      table.integer('education_type_id').notNullable().unsigned()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.primary(['classroom_id', 'education_type_id'])
      table.foreign('classroom_id').references('id').inTable('classrooms').onDelete('CASCADE')
      table.foreign('education_type_id').references('id').inTable('education_types')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
