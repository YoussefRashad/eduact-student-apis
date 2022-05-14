import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AdmissionFormResponseSchema extends BaseSchema {
  protected tableName = 'admission_form_responses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id').primary()
      table.integer('admission_form_id').unsigned().notNullable()
      table.integer('student_id').unsigned().notNullable()
      table.string('status').notNullable().defaultTo('pending')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('admission_form_id').references('id').inTable('admission_forms')
      table.foreign('student_id').references('user_id').inTable('students')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
