import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import DocumentService from '#services/document_service'
import DocumentDto from '#dtos/document'
import DeleteDocumentFileAction from '#actions/delete_document_file_action'

export default class DrivesController {
  @inject()
  async index({ inertia, auth }: HttpContext) {
    const documentService = new DocumentService()
    const documents = await documentService.findAll({ userId: auth.user!.id })

    return inertia.render('drives/index', {
      documents: DocumentDto.fromArray(documents)
    })
  }

  @inject()
  async destroy({ params, response }: HttpContext, deleteDocumentFileAction: DeleteDocumentFileAction) {
    await deleteDocumentFileAction.execute({ id: params.id })
    return response.redirect().back()
  }
}
