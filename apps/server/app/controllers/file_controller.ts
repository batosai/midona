import type { HttpContext } from '@adonisjs/core/http'

import Content from '#models/content'
import File from '#models/file'
import { attachmentManager } from '@jrmc/adonis-attachment'
import { FileBase64Validator, FileUrlValidator } from '#validators/file_validator'
import ContentPolicy from '#policies/content_policy'
import { createError } from '@adonisjs/core/exceptions'

export default class FileController {
  async upload({ request, params, bouncer }: HttpContext) {
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
    await file.related('content').associate(content)
    await file.save()

    return { file }
  }

  async uploadFromBase64({ request, params, bouncer }: HttpContext) {
    await bouncer.with(ContentPolicy).authorize('create')

    const content = await Content.findOrFail(params.content_id)
    const file = new File()

    const payload = await request.validateUsing(FileBase64Validator)

    file.file_data = await attachmentManager.createFromBase64(payload.base64, payload.name)
    await file.related('content').associate(content)
    await file.save()

    return { file }
  }

  async uploadFromUrl({ request, params, bouncer }: HttpContext) {
    await bouncer.with(ContentPolicy).authorize('create')

    const content = await Content.findOrFail(params.content_id)
    const file = new File()

    const payload = await request.validateUsing(FileUrlValidator)
    const url = new URL(payload.url)

    file.file_data = await attachmentManager.createFromUrl(url, payload.name)
    await file.related('content').associate(content)
    await file.save()

    return { file }
  }
}
