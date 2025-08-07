import type { CommandOptions } from '@adonisjs/core/types/ace'

import crypto from 'node:crypto'
import { BaseCommand, flags } from '@adonisjs/core/ace'
import User from '#models/user'

export default class DBUserCreate extends BaseCommand {
  static commandName = 'db:user:create'
  static aliases = ['user:create']
  static description = 'Create a new user in the database'

  static options: CommandOptions = {
    startApp: true,
  }

  @flags.string()
  declare firstname: string

  @flags.string()
  declare lastname: string

  @flags.string()
  declare email: string

  @flags.string()
  declare password: string

  async run() {
    this.logger.info('Create user')

    const { createUserValidator } = await import('#validators/user')

    let { firstname, lastname, email, password } = this.parsed.flags

    if (!email) {
      email = await this.prompt.ask('Enter the email')
    }

    if (!firstname) {
      firstname = await this.prompt.ask('Enter the firstname')
    }

    if (!lastname) {
      lastname = await this.prompt.ask('Enter the lastname')
    }

    if (!password) {
      password = await this.prompt.ask('Enter the password', {
        default: crypto.randomUUID(),
        validate(value) {
          return value.length >= 4
        },
      })
    }

    try {
      const payload = await createUserValidator.validate({
        firstname,
        lastname,
        email,
        password,
      })

      const user = await User.create(payload)

      this.ui
        .table()
        .head(['id', 'email', 'password'])
        .row([user.id, user.email, user.password])
        .render()
    } catch (error) {
      this.logger.error(error.message)
    }
  }
}
