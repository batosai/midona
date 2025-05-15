import User from '#models/user'
import Document from '#models/document'
import { BasePolicy } from '@adonisjs/bouncer'
import { AuthorizerResponse } from '@adonisjs/bouncer/types'

export default class DocumentPolicy extends BasePolicy {
    /**
   * Every logged-in user can create a document
   */
    create(_user: User): AuthorizerResponse {
      return true
    }

    /**
     * Only the document creator can edit the document
     */
    edit(user: User, document: Document): AuthorizerResponse {
      return user.id === document.userId
    }

    /**
     * Only the document creator can update the document
     */
    update(user: User, document: Document): AuthorizerResponse {
      return user.id === document.userId
    }

    /**
     * Only the document creator can delete the document
     */
    delete(user: User, document: Document): AuthorizerResponse {
      return user.id === document.userId
    }

}
