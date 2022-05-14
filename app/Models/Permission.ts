import { DateTime } from 'luxon'
import { BaseModel, column, ManyToMany, manyToMany } from '@ioc:Adonis/Lucid/Orm'
import Role from './Role'

export default class Permission extends BaseModel {
  // public serializeExtras = true    // TODO: check serializing extras on relationships

  @column({ isPrimary: true })
  public id: number

  @column()
  public name: string

  @column()
  public code: string

  @column()
  public description: string

  @column()
  public active: string

  @column()
  public group_id: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // relationships
  @manyToMany(() => Role, {
    pivotTable: 'role_permissions',
    localKey: 'id',
    relatedKey: 'permission_id',
  })
  public permission_roles: ManyToMany<typeof Role>
}
