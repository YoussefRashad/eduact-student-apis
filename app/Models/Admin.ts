import { DateTime } from 'luxon'
import { BaseModel, column, manyToMany, ManyToMany, hasMany, HasMany, beforeSave } from '@ioc:Adonis/Lucid/Orm'
import AdminLog from 'App/Models/AdminLog'
import Hash from '@ioc:Adonis/Core/Hash'
import Utils from 'App/Utils/Utils'
import Role from './Role'

export default class Admin extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public uuid: string

  @column()
  public email: string

  @column()
  public username: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public phone_number: string

  @column()
  public first_name: string

  @column({ serializeAs: null })
  public middle_name: string

  @column()
  public last_name: string

  @column()
  public type: string

  @column()
  public gender: string

  @column()
  public profile_photo: string

  @column()
  public active: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  // relationships
  @manyToMany(() => Role, {
    pivotTable: 'admin_roles',
    localKey: 'id',
    relatedKey: 'admin_id',
  })
  public admin_roles: ManyToMany<typeof Role>

  @hasMany(() => AdminLog, { foreignKey: 'admin_id' })
  public logs: HasMany<typeof AdminLog>

  // hooks
  @beforeSave()
  public static async hashPassword(admin: Admin) {
    if (admin.$dirty.password) {
      admin.password = await Hash.make(admin.password)
    }
  }

  // custom queries
  public static async create_(adminPayload: any) {
    const admin = await this.create({
      uuid: Utils.generateUUID(),
      username: Utils.generateUsername(adminPayload.first_name, adminPayload.last_name),
      first_name: adminPayload.first_name,
      last_name: adminPayload.last_name,
      type: adminPayload.type,
      email: adminPayload.email,
      phone_number: adminPayload.phone_number,
      password: adminPayload.password,
    })
    return admin
  }

  public static async logAction(id: number, event: string, tag: string, description: string) {
    try {
      const admin = await this.findByOrFail('id', id)
      return await admin.related('logs').create({ event, tag, description })
    } catch (error) {
      console.log('error making logs')
      console.log(error)
    }
  }
}
