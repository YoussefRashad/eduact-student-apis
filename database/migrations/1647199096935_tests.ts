import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Tests extends BaseSchema {
  protected tableName = 'tests'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('unit_id').unsigned().notNullable()
      table.string('uuid').unique().notNullable()
      table.string('title')
      table.integer('duration')
      table.integer('overall_score')
      table.float('passing_value')
      table.enum('passing_unit', ['percentage', 'point'])
      table.integer('allowed_trials')
      table.enum('allow_repetition_when', ['always', 'failed'])
      table.enum('model_mode', ['single', 'multiple']).defaultTo('single')
      table.boolean('shuffle_question').defaultTo(false)
      table.boolean('shuffle_answers').defaultTo(false)
      table.boolean('show_correct_if_passed').defaultTo(false)
      table.boolean('show_correct_if_failed').defaultTo(false)
      table.text('start_text')
      table.text('end_text')
      table.text('message_if_passed')
      table.text('message_if_failed')
      table.boolean('allow_movement').defaultTo(false)
      table.enum('view_mode', ['single', 'multiple']).defaultTo('single')
      table.boolean('show_score_percentage').defaultTo(false)
      table.boolean('show_score_value').defaultTo(false)
      table.boolean('show_grade').defaultTo(false)
      table.boolean('active').defaultTo(false)
      table.timestamp('active_start_date')
      table.timestamp('active_end_date')

      table.foreign('unit_id').references('id').inTable('units').onDelete('CASCADE')
      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
