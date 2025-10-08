import type { HttpContext } from '@adonisjs/core/http'
import mail from '@adonisjs/mail/services/main'
import { ApiOperation, ApiBody, ApiResponse, ApiSecurity, ApiHeader } from '@foadonis/openapi/decorators'
import { DateTime } from 'luxon'

import User from '#models/user'
import UserPolicy from '#policies/user_policy'
import ForgotPasswordNotification from '#mails/forgot_password_notification'
import { ForgotPasswordValidator, ResetPasswordValidator } from '#validators/password_validator'

import { Login, LoginResponse, ForgotPassword, ResetPassword } from '#openapi/schemas/auth'

export default class AuthController {

  @ApiOperation({ summary: 'Login' })
  @ApiBody({
    type: Login
  })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: LoginResponse,
  })
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

  @ApiOperation({ summary: 'Logout' })
  @ApiSecurity('basic')
  @ApiHeader({
    name: 'Authorization',
    description: 'Token Authorization received in the login',
    required: true,
  })
  @ApiResponse({
    status: 204
  })
  async logout({ response, auth }: HttpContext) {
    await auth.use('api').invalidateToken()
    return response.noContent()
  }

  @ApiOperation({ summary: 'Forgot Password' })
  @ApiBody({
    type: ForgotPassword
  })
  @ApiResponse({
    status: 204
  })
  async forgotPassword({ request, response }: HttpContext) {
    const payload = await request.validateUsing(ForgotPasswordValidator)

    const user = await User.findBy('email', payload.email)

    if (user) {
      const token = await User.accessTokens.create(user, ['user:reset-password'], {
        expiresIn: '15 minutes'
      })

      await mail.sendLater(new ForgotPasswordNotification(user, token, payload.resetPasswordUrl))
    }

    return response.noContent()
  }

  @ApiOperation({ summary: 'Reset Password' })
  @ApiSecurity('basic')
  @ApiHeader({
    name: 'Authorization',
    description: 'Token Authorization received in the forgot password email',
    required: true,
  })
  @ApiBody({
    type: ResetPassword
  })
  @ApiResponse({
    status: 201,
    description: 'The record has been successfully created.',
    type: LoginResponse,
  })
  async resetPassword({ request, auth, bouncer }: HttpContext) {
    const { password } = await request.validateUsing(ResetPasswordValidator)

    const user = auth?.user!

    await bouncer.with(UserPolicy).authorize('resetPassword', user)

    user.password = password
    await user.save()

    return await auth.use('api').createToken(user)
  }
}
