import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
import Invoice from 'App/Models/Invoice'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public transaction_ref: string

  @column()
  public provider: string

  @column()
  public provider_ref: string

  @column()
  public method: string

  @column()
  public status: string

  @column()
  public amount: number

  @column({ serializeAs: 'expiry_date' })
  public expiryDate: Date

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @belongsTo(() => Invoice)
  public invoice: BelongsTo<typeof Invoice>
}
