import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class ClassroomSchema extends BaseSchema {
  protected tableName = 'classrooms'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('instructor_id').unsigned().notNullable()
      table.integer('category_id').unsigned().notNullable()
      table.integer('current_course').unsigned()
      table.text('title').notNullable()
      table.string('label').notNullable().unique()
      table.string('type').notNullable()
      table.string('sub_type').defaultTo('class').notNullable()
      table.text('description').notNullable()
      table.text('prerequisites')
      table.integer('enrolled_count').notNullable().defaultTo(0)
      table.string('language')
      table.text('thumbnail')
      table.integer('rating').notNullable().defaultTo(0)
      table.integer('rating_count').notNullable().defaultTo(0)
      table.integer('weight')
      table.string('status').notNullable()
      table.boolean('active').notNullable().defaultTo(false)
      table.boolean('accessible').notNullable().defaultTo(false)
      table.string('payment_methods_allowed').defaultTo('*')
      table.boolean('has_admission').defaultTo(false)
      table.boolean('admission_status').defaultTo(false)
      table.integer('admission_form_id').unsigned()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
      table.string('code').unique().notNullable()
      table.boolean('auto_accept_admission').defaultTo(false)
      table.boolean('accept_admission_if_enrolled').defaultTo(false)

      table.foreign('admission_form_id').references('id').inTable('admission_forms').onDelete('SET NULL')
      table.foreign('instructor_id').references('user_id').inTable('instructors').onDelete('CASCADE')
      table.foreign('category_id').references('id').inTable('categories')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

module.exports = ClassroomSchema
