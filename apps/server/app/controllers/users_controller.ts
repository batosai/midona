import type { HttpContext } from '@adonisjs/core/http'
import { ApiOperation, ApiBody, ApiResponse, ApiQuery, ApiSecurity, ApiHeader } from '@foadonis/openapi/decorators'
import User from '#models/user'
import UserPolicy from '#policies/user_policy'

import PaginatedResponse from '#openapi/schemas/paginated_response'

class UsersPaginatedResponse extends PaginatedResponse(User) {}

export default class UsersController {

  @ApiOperation({ summary: 'Users list' })
  @ApiQuery({ name: 'page', description: 'default: 1' })
  @ApiQuery({ name: 'limit', description: 'default: 25' })
  @ApiResponse({ type: UsersPaginatedResponse })
  async index({ request, bouncer }: HttpContext) {
    await bouncer.with(UserPolicy).authorize('manage')

    const page = request.input('page', 1)
    const limit = request.input('limit', 25)

    return User.query().paginate(page, limit)
  }
}
