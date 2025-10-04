import testUtils from '@adonisjs/core/services/test_utils'
import mail from '@adonisjs/mail/services/main'
import { test } from '@japa/runner'
import ForgotPasswordNotification from '#mails/forgot_password_notification'
import { UserFactory } from '#database/factories/user_factory'

test.group('Forgot password mailer', (group) => {
  group.each.setup(() => testUtils.db().withGlobalTransaction())

  test('not exist email address', async ({ client, route }) => {
    const { mails } = mail.fake()

    await client
      .post(route('api.v1.forgotPassword'))
      .fields({
        email: 'jeremy@adonis.com',
      })
      .redirects(0)

    mails.assertNotSent(ForgotPasswordNotification)

    mail.restore()
  })

  test('exist email address', async ({ client, route }) => {
    const { mails } = mail.fake()
    const user = await UserFactory.create()

    await client
      .post(route('api.v1.forgotPassword'))
      .fields({
        email: user.email,
        resetPasswordUrl: 'https://example.com',
      })
      .redirects(0)

    mails.assertQueued(ForgotPasswordNotification, ({ message }) => {
      return message.hasSubject('Password change request')
    })

    mail.restore()
  })
})
