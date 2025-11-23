import type { HttpContext } from '@adonisjs/core/http'

import Content from '#models/content'
import File from '#models/file'
import { attachmentManager } from '@jrmc/adonis-attachment'
import { FileBase64Validator, FileUrlValidator } from '#validators/file_validator'
import ContentPolicy from '#policies/content_policy'
import { createError } from '@adonisjs/core/exceptions'

export default class FileController {

  async index({ request, params, auth, bouncer }: HttpContext) {
    const content = await Content.findOrFail(params.content_id)
    await bouncer.with(ContentPolicy).authorize('view', content)

    const page = request.input('page', 1)
    const limit = request.input('limit', 25)

    let query = File.query().where('contentId', content.id)

    // If user is not admin, filter by their files
    if (!auth.user?.isAdmin && auth.user?.id) {
      query = query.where('userId', auth.user.id)
    }

    return query.paginate(page, limit)
  }

  async upload({ request, params, auth, bouncer }: HttpContext) {
    await bouncer.with(ContentPolicy).authorize('create')

    const content = await Content.findOrFail(params.content_id)
    const file = new File()

    // await request.validateUsing(FileValidator)
    // error: for adonis 7 ???
    const multipartFile = request.file('file_data')

    // TODO: use validator
    if (!multipartFile) {
      throw createError('File not found', 'E_FILE_NOT_FOUND', 422)
    }

    file.file_data = await attachmentManager.createFromFile(multipartFile)
    file.userId = auth.user?.id!
    await file.related('content').associate(content)
    await file.save()

    return { file }
  }

  async uploadFromBase64({ request, params, auth, bouncer }: HttpContext) {
    await bouncer.with(ContentPolicy).authorize('create')

    const content = await Content.findOrFail(params.content_id)
    const file = new File()

    const payload = await request.validateUsing(FileBase64Validator)

    file.file_data = await attachmentManager.createFromBase64(payload.base64, payload.name)
    file.userId = auth.user?.id!
    await file.related('content').associate(content)
    await file.save()

    return { file }
  }

  async uploadFromUrl({ request, params, auth, bouncer }: HttpContext) {
    await bouncer.with(ContentPolicy).authorize('create')

    const content = await Content.findOrFail(params.content_id)
    const file = new File()

    const payload = await request.validateUsing(FileUrlValidator)
    const url = new URL(payload.url)

    file.file_data = await attachmentManager.createFromUrl(url, payload.name)
    file.userId = auth.user?.id!
    await file.related('content').associate(content)
    await file.save()

    return { file }
  }

  async destroy({ response, params, bouncer }: HttpContext) {
    const content = await Content.findOrFail(params.content_id)
    await bouncer.with(ContentPolicy).authorize('delete', content)

    const file = await File.findOrFail(params.id)
    await file.delete()

    return response.noContent()
  }
}
