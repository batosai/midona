import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import { DateTime } from 'luxon'

export default class AuthController {

  async login({ request, response, auth, i18n }: HttpContext) {
    const { email, password } = request.only(['email', 'password'])

    const user = await User.verifyCredentials(email, password)

    if (user?.disabled) {
      return response.abort({
        errors: [
          { message: i18n.formatMessage('errors.E_INVALID_DISABLED') },
        ]
      }, 403)
    }

    user.lastLoginAt = DateTime.local()
    await user.save()

    return await auth.use('api').createToken(user)
  }

  async logout({ response, auth }: HttpContext) {
    await auth.use('api').invalidateToken()
    return response.noContent()
  }
}
