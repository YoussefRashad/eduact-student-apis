import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class CourseSchema extends BaseSchema {
  protected tableName = 'courses'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('classroom_id').unsigned().notNullable()
      table.integer('section_id').unsigned()
      table.string('name').notNullable()
      table.text('description')
      table.string('preview_url')
      table.integer('capacity')
      table.float('price').notNullable()
      table.float('old_price')
      table.integer('order').unsigned()
      table.string('code').notNullable().unique()
      table.boolean('active').notNullable().defaultTo(false)
      table.text('thumbnail')
      table.string('payment_methods_allowed').defaultTo('*').notNullable()
      table.timestamp('active_start_date')
      table.timestamp('active_end_date')
      table.boolean('buyable').notNullable().defaultTo(false)
      table.timestamp('buy_start_date')
      table.timestamp('buy_end_date')
      table.boolean('scores_view').notNullable().defaultTo(false)
      table.boolean('expired').notNullable().defaultTo(false)
      table.timestamp('expiry_date')
      table.integer('expiry_period')
      table.enum('progress_criteria', ['all', 'percentage', 'subset']).defaultTo('all')
      table.float('progress_percentage').defaultTo(0)
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.foreign('classroom_id').references('id').inTable('classrooms').onDelete('CASCADE')
      table.foreign('section_id').references('id').inTable('sections').onDelete('SET NULL')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

module.exports = CourseSchema
