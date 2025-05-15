import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import DocumentService from '#services/document_service'
import DocumentDto from '#dtos/document'
import DocumentTypes from '#enums/document_types'

export default class FoldersController {
  @inject()
  async show({ inertia, auth, params }: HttpContext, documentService: DocumentService) {
    const documents = await documentService.findAll({
      userId: auth.user!.id,
      parentId: params.id
    })

    return inertia.render('drives/folder', {
      documents: DocumentDto.fromArray(documents),
      folderId: params.id
    })
  }

  @inject()
  async list({ response, auth, request }: HttpContext, documentService: DocumentService) {
    const parentId = request.input('parentId', null)

    const folders = await documentService.findAll({
      userId: auth.user!.id,
      parentId,
      type: DocumentTypes.FOLDER
    })

    const dtos = DocumentDto.fromArray(folders)

    return response.json(dtos)
  }
}
