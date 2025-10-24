import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

import { BasePolicy } from '@adonisjs/bouncer'
import User from '#models/user'
import Content from '#models/content'

export default class ContentPolicy extends BasePolicy {

  /**
   * Check if user can manage contents (admin only)
   */
  manage(currentUser: User): AuthorizerResponse {
    return currentUser.isAdmin
  }

  /**
   * Check if user can view a specific content
   */
  view(currentUser: User, content: Content): AuthorizerResponse {
    // Admin can view all contents
    if (currentUser.isAdmin) {
      return true
    }

    // User can only view their own contents
    return content.userId === currentUser.id
  }

  /**
   * Check if user can create contents
   */
  create(_currentUser: User): AuthorizerResponse {
    // All authenticated users can create contents
    return true
  }

  /**
   * Check if user can update a specific content
   */
  update(currentUser: User, content: Content): AuthorizerResponse {
    // Admin can update all contents
    if (currentUser.isAdmin) {
      return true
    }

    // User can only update their own contents
    return content.userId === currentUser.id
  }

  /**
   * Check if user can delete a specific content
   */
  delete(currentUser: User, content: Content): AuthorizerResponse {
    // Admin can delete all contents
    if (currentUser.isAdmin) {
      return true
    }

    // User can only delete their own contents
    return content.userId === currentUser.id
  }
}
