import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Course from 'App/Models/Course'

export default class Unit extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public course_id: number

  @column()
  public name: string

  @column()
  public type: string

  @column()
  public unitable_id: number

  @column()
  public order: number

  @column()
  public active: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // relationships
  @belongsTo(() => Course, { foreignKey: 'course_id' })
  public course: BelongsTo<typeof Course>
}
