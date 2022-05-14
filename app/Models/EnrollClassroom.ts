import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column, computed } from '@ioc:Adonis/Lucid/Orm'
import User from './User'
import Classroom from './Classroom'

export default class EnrollClassroom extends BaseModel {
  @column({ isPrimary: true })
  public user_id: number

  @column()
  public classroom_id: number

  @column()
  public active: boolean

  @column()
  public completed_courses: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // relationships
  @belongsTo(() => User, { foreignKey: 'user_id' })
  public user: BelongsTo<typeof User>

  @belongsTo(() => Classroom, { foreignKey: 'classroom_id' })
  public classroom: BelongsTo<typeof Classroom>

  @computed()
  public get pivot() {
    return this.$extras
  }
}
