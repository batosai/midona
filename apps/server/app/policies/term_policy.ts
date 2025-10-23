import type { AuthorizerResponse } from '@adonisjs/bouncer/types'

import { BasePolicy } from '@adonisjs/bouncer'
import User from '#models/user'
import Term from '#models/term'

export default class TermPolicy extends BasePolicy {

  /**
   * Check if user can manage terms (admin only)
   */
  manage(currentUser: User): AuthorizerResponse {
    return currentUser.isAdmin
  }

  /**
   * Check if user can view a specific term
   */
  view(currentUser: User, term: Term): AuthorizerResponse {
    // Admin can view all terms
    if (currentUser.isAdmin) {
      return true
    }

    // User can only view their own terms
    return term.userId === currentUser.id
  }

  /**
   * Check if user can create terms
   */
  create(_currentUser: User): AuthorizerResponse {
    // All authenticated users can create terms
    return true
  }

  /**
   * Check if user can update a specific term
   */
  update(currentUser: User, term: Term): AuthorizerResponse {
    // Admin can update all terms
    if (currentUser.isAdmin) {
      return true
    }

    // User can only update their own terms
    return term.userId === currentUser.id
  }

  /**
   * Check if user can delete a specific term
   */
  delete(currentUser: User, term: Term): AuthorizerResponse {
    // Admin can delete all terms
    if (currentUser.isAdmin) {
      return true
    }

    // User can only delete their own terms
    return term.userId === currentUser.id
  }
}
