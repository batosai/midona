import crypto from 'node:crypto'
import { DateTime } from 'luxon'
import hash from '@adonisjs/core/services/hash'
import { compose } from '@adonisjs/core/helpers'
import { BaseModel, computed, column, beforeCreate, scope, beforeSave } from '@adonisjs/lucid/orm'
import { withAuthFinder } from '@adonisjs/auth/mixins/lucid'
import { DbRememberMeTokensProvider } from '@adonisjs/auth/session'
import Roles from '#enums/roles'
import { UuidPrimaryKey } from '#models/mixins/uuid_primary_key'
import { whithTimestamps } from '#models/mixins/with_timestamps'

const AuthFinder = withAuthFinder(() => hash.use('scrypt'), {
  uids: ['email'],
  passwordColumnName: 'password',
})

export default class User extends compose(BaseModel, AuthFinder, UuidPrimaryKey, whithTimestamps) {
  static rememberMeTokens = DbRememberMeTokensProvider.forModel(User)

  @column()
  declare role: Roles

  @column()
  declare firstname: string

  @column()
  declare lastname: string

  @column()
  declare email: string

  @column()
  declare password: string

  @column()
  declare disabled: boolean

  // @attachment({
  //   folder: 'avatars',
  //   variants: ['thumbnail']
  // })
  // declare avatar: Attachment | null

  @column.dateTime({ autoCreate: false })
  declare disabledOn: DateTime | null

  @column.dateTime({ autoCreate: false })
  declare lastLoginAt: DateTime

  @column.dateTime({ autoCreate: false })
  declare passwordChangedAt: DateTime

  @column.dateTime({ autoCreate: false })
  declare discardedAt: DateTime

  // scopes

  static admin = scope((query: any) => {
    query.where('role', Roles.ADMIN)
  })

  // Computed

  @computed()
  get isAdmin() {
    return this.role === Roles.ADMIN
  }

  @computed()
  get isUser() {
    return this.role === Roles.USER
  }

  @computed()
  get fullname() {
    return `${this.firstname} ${this.lastname}`
  }

  // Hooks

  @beforeCreate()
  static defaultPassword(user: User) {
    if (!user.password) {
      user.password = crypto.randomUUID()
    }
  }

  @beforeSave()
  static async disabledDate(user: User) {
    if (user.$dirty.disabled) {
      if (user.disabled === true) {
        user.disabledOn = DateTime.local()
      } else {
        user.disabledOn = null
      }
    }
  }
}
