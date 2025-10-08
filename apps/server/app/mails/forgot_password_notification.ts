import type{ AccessToken } from '@adonisjs/auth/access_tokens'

import i18nManager from '@adonisjs/i18n/services/main'
import { BaseMail } from '@adonisjs/mail'
import User from '#models/user'
import env from '#start/env'

export default class ForgotPasswordNotification extends BaseMail {
  constructor(private user: User, private token: AccessToken, private resetPasswordUrl: string) {
    super()
  }

  prepare() {
    const i18n = i18nManager.locale(i18nManager.defaultLocale)

    this.message
      .from(env.get('EMAIL_FROM'), 'Adonis')
      .to(this.user.email, this.user.fullname)
      .subject(i18n.formatMessage('email.forgotPassword.subject'))
      .htmlView('emails/auth/forgot-password', {
        user: this.user,
        url: `${this.resetPasswordUrl}?token=${this.token.value!.release()}`
      })
  }
}
