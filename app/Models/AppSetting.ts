import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class AppSetting extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public fawry: boolean

  @column()
  public aman: boolean

  @column()
  public masary: boolean

  @column()
  public credit_card: boolean

  @column()
  public vf: boolean

  @column()
  public online_cl: boolean

  @column()
  public parent_portal: boolean

  @column()
  public revision_section: boolean

  @column()
  public exams_section: boolean

  @column()
  public progress: boolean

  @column()
  public recharge_card: boolean

  @column()
  public opay: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
