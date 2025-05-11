import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import DocumentService from '#services/document_service'
import DocumentDto from '#dtos/document'
import DeleteDocumentFileAction from '#actions/delete_document_file_action'
import DocumentPolicy from '#policies/document_policy'

export default class DrivesController {
  @inject()
  async index({ inertia, auth }: HttpContext, documentService: DocumentService) {
    const documents = await documentService.findAll({ userId: auth.user!.id })

    return inertia.render('drives/index', {
      documents: DocumentDto.fromArray(documents)
    })
  }

  @inject()
  async destroy({ params, response, auth, bouncer }: HttpContext, documentService: DocumentService, deleteDocumentFileAction: DeleteDocumentFileAction) {
    const document = await documentService.findOrFail({ id: params.id, userId: auth.user!.id })
    if (await bouncer.with(DocumentPolicy).denies('delete', document)) {
      return response.forbidden('Cannot delete a document')
    }

    await deleteDocumentFileAction.execute({ id: params.id })
    return response.redirect().back()
  }
}
