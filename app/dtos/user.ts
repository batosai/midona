import { BaseModelDto } from '@adocasts.com/dto/base'
import User from '#models/user'
import Roles from '#enums/roles'

export default class UserDto extends BaseModelDto {
  declare role: Roles
  declare firstname: string
  declare lastname: string
  declare email: string
  declare password: string
  declare disabled: boolean
  declare isAdmin: boolean
  declare isUser: boolean
  declare fullname: string
  declare disabledOn: string | null

  constructor(user?: User) {
    super()

    if (!user) return
    this.role = user.role
    this.firstname = user.firstname
    this.lastname = user.lastname
    this.email = user.email
    this.password = user.password
    this.disabled = user.disabled
    this.isAdmin = user.isAdmin
    this.isUser = user.isUser
    this.fullname = user.fullname
    this.disabledOn = user.disabledOn?.toISO() ?? null
  }
}