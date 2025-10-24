import type { HttpContext } from '@adonisjs/core/http'
import { ApiOperation, ApiBody, ApiResponse, ApiQuery, ApiParam } from '@foadonis/openapi/decorators'
import Content from '#models/content'
import ContentPolicy from '#policies/content_policy'
import { ContentValidator } from '#validators/content_validator'

import PaginatedResponse from '#openapi/schemas/paginated_response'
import Response from '#openapi/schemas/content_response'

class ContentsPaginatedResponse extends PaginatedResponse(Content) {}
class ContentResponse extends Response() {}

export default class ContentsController {

  @ApiOperation({ summary: 'Contents list' })
  @ApiQuery({ name: 'page', description: 'default: 1' })
  @ApiQuery({ name: 'limit', description: 'default: 25' })
  @ApiQuery({ name: 'contentType', description: 'Filter by content type' })
  @ApiResponse({ type: ContentsPaginatedResponse })
  async index({ request, auth, bouncer }: HttpContext) {
    await bouncer.with(ContentPolicy).authorize('manage')

    const page = request.input('page', 1)
    const limit = request.input('limit', 25)
    const contentType = request.input('contentType')

    let query = Content.query()

    // If user is not admin, filter by their contents
    if (!auth.user?.isAdmin && auth.user?.id) {
      query = query.where('userId', auth.user.id)
    }

    if (contentType) {
      query = query.where('contentType', contentType)
    }

    return query.paginate(page, limit)
  }

  @ApiOperation({ summary: 'Get content by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ type: ContentResponse })
  async show({ params, bouncer }: HttpContext) {
    const content = await Content.findOrFail(params.id)

    await bouncer.with(ContentPolicy).authorize('view', content)

    return { content }
  }

  @ApiOperation({ summary: 'Create new content' })
  @ApiBody({ type: () => ContentValidator })
  @ApiResponse({ type: ContentResponse })
  async store({ request, auth, bouncer }: HttpContext) {
    await bouncer.with(ContentPolicy).authorize('create')

    const payload = await request.validateUsing(ContentValidator, {
      meta: {}
    })

    const content = await Content.create({
      ...payload,
      userId: auth.user?.id,
    })

    return { content }
  }

  @ApiOperation({ summary: 'Update content' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: () => ContentValidator })
  @ApiResponse({ type: ContentResponse })
  async update({ params, request, bouncer }: HttpContext) {
    const content = await Content.findOrFail(params.id)

    await bouncer.with(ContentPolicy).authorize('update', content)

    const payload = await request.validateUsing(ContentValidator, {
      meta: {
        record: content,
      }
    })

    return { content: await content.merge(payload).save() }
  }

  @ApiOperation({ summary: 'Delete content' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 204 })
  async destroy({ params, response, bouncer }: HttpContext) {
    const content = await Content.findOrFail(params.id)

    await bouncer.with(ContentPolicy).authorize('delete', content)

    await content.delete()

    return response.noContent()
  }
}
