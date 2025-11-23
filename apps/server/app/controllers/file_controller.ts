import type { HttpContext } from '@adonisjs/core/http'
import { ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@foadonis/openapi/decorators'

import Content from '#models/content'
import File from '#models/file'
import { attachmentManager } from '@jrmc/adonis-attachment'
import { FileBase64Validator, FileUrlValidator } from '#validators/file_validator'
import ContentPolicy from '#policies/content_policy'
import { createError } from '@adonisjs/core/exceptions'

import PaginatedResponse from '#openapi/schemas/paginated_response'
import Response from '#openapi/schemas/file_response'
import {
  FileUploadRequest,
  FileBase64UploadRequest,
  FileUrlUploadRequest,
} from '#openapi/schemas/file_request'

class FilesPaginatedResponse extends PaginatedResponse(File) {}
class FileResponse extends Response() {}

export default class FileController {

  @ApiOperation({ summary: 'List files for a content' })
  @ApiParam({ name: 'content_id', description: 'Content ID' })
  @ApiQuery({ name: 'page', description: 'default: 1' })
  @ApiQuery({ name: 'limit', description: 'default: 25' })
  @ApiResponse({ type: FilesPaginatedResponse })
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

  @ApiOperation({ summary: 'Upload a file to a content' })
  @ApiParam({ name: 'content_id', description: 'Content ID' })
  @ApiBody({ type: FileUploadRequest })
  @ApiResponse({ type: FileResponse })
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

  @ApiOperation({ summary: 'Upload a file from base64 to a content' })
  @ApiParam({ name: 'content_id', description: 'Content ID' })
  @ApiBody({ type: FileBase64UploadRequest })
  @ApiResponse({ type: FileResponse })
  async uploadFromBase64({ request, params, auth, bouncer }: HttpContext) {
    await bouncer.with(ContentPolicy).authorize('create')

    const content = await Content.findOrFail(params.content_id)
    const file = new File()

    const payload = await request.validateUsing(FileBase64Validator)

    file.file_data = await attachmentManager.createFromBase64(payload.file_data, payload.name)
    file.userId = auth.user?.id!
    await file.related('content').associate(content)
    await file.save()

    return { file }
  }

  @ApiOperation({ summary: 'Upload a file from URL to a content' })
  @ApiParam({ name: 'content_id', description: 'Content ID' })
  @ApiBody({ type: FileUrlUploadRequest })
  @ApiResponse({ type: FileResponse })
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

  @ApiOperation({ summary: 'Delete a file' })
  @ApiParam({ name: 'content_id', description: 'Content ID' })
  @ApiParam({ name: 'id', description: 'File ID' })
  @ApiResponse({ status: 204 })
  async destroy({ response, params, bouncer }: HttpContext) {
    const content = await Content.findOrFail(params.content_id)
    await bouncer.with(ContentPolicy).authorize('delete', content)

    const file = await File.findOrFail(params.id)
    await file.delete()

    return response.noContent()
  }
}
