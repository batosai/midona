import type { HttpContext } from '@adonisjs/core/http'
import { ApiOperation, ApiBody, ApiResponse, ApiQuery, ApiParam } from '@foadonis/openapi/decorators'
import Term from '#models/term'
import TermPolicy from '#policies/term_policy'
import { TermValidator } from '#validators/term_validator'

import PaginatedResponse from '#openapi/schemas/paginated_response'
import Response from '#openapi/schemas/term_response'

class TermsPaginatedResponse extends PaginatedResponse(Term) {}
class TermResponse extends Response() {}

export default class TermsController {

  @ApiOperation({ summary: 'Terms list' })
  @ApiQuery({ name: 'page', description: 'default: 1' })
  @ApiQuery({ name: 'limit', description: 'default: 25' })
  @ApiQuery({ name: 'taxonomy', description: 'Filter by taxonomy (category, tag)' })
  @ApiResponse({ type: TermsPaginatedResponse })
  async index({ request, auth, bouncer }: HttpContext) {
    await bouncer.with(TermPolicy).authorize('manage')

    const page = request.input('page', 1)
    const limit = request.input('limit', 25)
    const taxonomy = request.input('taxonomy')

    let query = Term.query()

    // If user is not admin, filter by their terms
    if (!auth.user?.isAdmin && auth.user?.id) {
      query = query.where('userId', auth.user.id)
    }

    if (taxonomy) {
      query = query.where('taxonomy', taxonomy)
    }

    return query.paginate(page, limit)
  }

  @ApiOperation({ summary: 'Get term by ID' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ type: TermResponse })
  async show({ params, bouncer }: HttpContext) {
    const term = await Term.findOrFail(params.id)

    await bouncer.with(TermPolicy).authorize('view', term)

    return { term }
  }

  @ApiOperation({ summary: 'Create new term' })
  @ApiBody({ type: () => TermValidator })
  @ApiResponse({ type: TermResponse })
  async store({ request, auth, bouncer }: HttpContext) {
    await bouncer.with(TermPolicy).authorize('create')

    const payload = await request.validateUsing(TermValidator, {
      meta: {}
    })

    const term = await Term.create({
      ...payload,
      userId: auth.user?.id,
    })

    return { term }
  }

  @ApiOperation({ summary: 'Update term' })
  @ApiParam({ name: 'id' })
  @ApiBody({ type: () => TermValidator })
  @ApiResponse({ type: TermResponse })
  async update({ params, request, bouncer }: HttpContext) {
    const term = await Term.findOrFail(params.id)

    await bouncer.with(TermPolicy).authorize('update', term)

    const payload = await request.validateUsing(TermValidator, {
      meta: {
        record: term,
      }
    })

    return { term: await term.merge(payload).save() }
  }

  @ApiOperation({ summary: 'Delete term' })
  @ApiParam({ name: 'id' })
  @ApiResponse({ status: 204 })
  async destroy({ params, response, bouncer }: HttpContext) {
    const term = await Term.findOrFail(params.id)

    await bouncer.with(TermPolicy).authorize('delete', term)

    await term.delete()

    return response.noContent()
  }
}
