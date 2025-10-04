import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

import { BasePolicy } from '@adonisjs/bouncer'
import User from '#models/user'

export default class UserPolicy extends BasePolicy {
  resetPassword(currentUser: User, user: User): AuthorizerResponse {

    if (currentUser.isAdmin && currentUser.id !== user.id) {
      return true
    }

    if (!currentUser.currentAccessToken) {
      return false
    }

    return currentUser.id === user.id && currentUser.currentAccessToken.allows('user:reset-password')
  }
}
