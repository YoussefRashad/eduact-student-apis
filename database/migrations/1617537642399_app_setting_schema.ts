import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class AppSettingSchema extends BaseSchema {
  protected tableName = 'app_settings'

  public async up() {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.boolean('fawry')
      table.boolean('aman')
      table.boolean('masary')
      table.boolean('credit_card')
      table.boolean('vf')
      table.boolean('online_cl')
      table.boolean('parent_portal')
      table.boolean('revision_section')
      table.boolean('exams_section')
      table.boolean('progress')
      table.boolean('recharge_card')
      table.boolean('opay')
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
