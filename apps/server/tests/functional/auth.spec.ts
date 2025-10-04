import { test } from '@japa/runner'
import { UserFactory } from '#database/factories/user_factory'

test.group('Auth', () => {
  test('should loged user', async ({ client, route }) => {
    const user = await UserFactory.merge({
      password: 'secret',
    }).create()

    const response = await client
      .post(route('api.v1.login'))
      .fields({
        email: user.email,
        password: 'secret',
      })
      .redirects(0)

      response.assertStatus(200)
  })

  test('credentials not valid', async ({ client, route }) => {
    const response = await client
      .post(route('api.v1.login'))
      .fields({
        email: '',
      })
      .redirects(0)

    response.assertBodyContains({
      errors: [
        {
          message: 'Invalid user credentials'
        }
      ]
    })

  })

  test('should not logout user', async ({ client, route }) => {
    const response = await client
      .delete(route('api.v1.logout'))
      .redirects(0)

    response.assertStatus(401)
  })

  test('should logout user', async ({ client, route }) => {
    const user = await UserFactory.merge({
      password: 'secret',
    }).create()

    const response = await client
    .delete(route('api.v1.logout'))
    .withGuard('api')
    .loginAs(user)
    .redirects(0)

    response.assertStatus(204)
  })

  test('should forgot password', async ({ client, route }) => {
    const user = await UserFactory.merge({
      password: 'secret',
    }).create()

    const response = await client
      .post(route('api.v1.forgotPassword'))
      .fields({
        email: user.email,
        resetPasswordUrl: 'https://example.com',
      })
      .redirects(0)

    response.assertStatus(204)
  })

  test('should reset password', async ({ client, route }) => {
    const user = await UserFactory.merge({
      password: 'secret',
    }).create()

    const response = await client
      .post(route('api.v1.resetPassword'))
      .withGuard('api')
      .loginAs(user)
      .fields({
        password: 'Secret2025!',
        passwordConfirmation: 'Secret2025!',
      })
      .redirects(0)

    response.assertStatus(200)

    response.assertBodyContains({
      type: 'bearer'
    })
  })
})
