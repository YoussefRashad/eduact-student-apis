import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Response extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public admission_form_response_id: number

  @column()
  public question_id: number

  @column()
  public student_id: number

  @column()
  public answer: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime
}
