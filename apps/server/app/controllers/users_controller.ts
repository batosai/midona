import type { HttpContext } from '@adonisjs/core/http'
import { ApiOperation, ApiBody, ApiResponse, ApiQuery, ApiSecurity, ApiHeader, ApiParam } from '@foadonis/openapi/decorators'
import User from '#models/user'
import UserPolicy from '#policies/user_policy'
import { UserValidator } from '#validators/user_validator'

import PaginatedResponse from '#openapi/schemas/paginated_response'
import Response from '#openapi/schemas/user_response'

class UsersPaginatedResponse extends PaginatedResponse(User) {}
class UserResponse extends Response() {}

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

  @ApiOperation({ summary: 'User' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ type: UserResponse })
  async show({ params, bouncer }: HttpContext) {
    await bouncer.with(UserPolicy).authorize('manage')

    const user = await User.find(params.id)

    return { user }
  }

  @ApiOperation({ summary: 'User' })
  @ApiBody({ type: () => UserValidator })
  @ApiResponse({ type: UserResponse })
  async store({ request, auth, bouncer }: HttpContext) {
    await bouncer.with(UserPolicy).authorize('manage')

    const payload = await request.validateUsing(UserValidator, {
      meta: {
        currentUser: auth.user,
      }
    })

    return { user: await User.create(payload) }
  }

  @ApiOperation({ summary: 'User' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: () => UserValidator })
  @ApiResponse({ type: UserResponse })
  async update({ params, response, request, auth, bouncer }: HttpContext) {
    console.log(params.id)
    await bouncer.with(UserPolicy).authorize('manage')

    const user = await User.find(params.id)

    if (!user) {
      return response.notFound()
    }

    const payload = await request.validateUsing(UserValidator, {
      meta: {
        currentUser: auth.user,
        record: user,
      }
    })

    return { user: await user.merge(payload).save() }
  }

  @ApiOperation({ summary: 'User' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 204 })
  async destroy({ params, response, auth, bouncer }: HttpContext) {
    await bouncer.with(UserPolicy).authorize('manage')

    const user = await User.find(params.id)

    if (!user) {
      return response.notFound()
    }

    if (auth.user?.id === user.id) {
      return response.unauthorized()
    }

    await user.delete()

    return response.noContent()
  }
}
