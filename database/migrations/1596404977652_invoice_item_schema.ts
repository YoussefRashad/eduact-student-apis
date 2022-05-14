import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class InvoiceItemSchema extends BaseSchema {
  protected tableName = 'invoice_items'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.integer('invoice_id').unsigned().notNullable()
      table.integer('course_id').unsigned().notNullable()
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })

      table.primary(['invoice_id', 'course_id'])
      table.foreign('invoice_id').references('id').inTable('invoices').onDelete('CASCADE')
      table.foreign('course_id').references('id').inTable('courses').onDelete('CASCADE')
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}

module.exports = InvoiceItemSchema
