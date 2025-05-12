import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import transmit from '@adonisjs/transmit/services/main'
import DocumentService from '#services/document_service'
import DocumentDto from '#dtos/document'
import DocumentPolicy from '#policies/document_policy'
import DeleteDocumentFileAction from '#actions/delete_document_file_action'
import CreateDocumentFolderAction from '#actions/create_document_folder_action'

export default class DrivesController {
  @inject()
  async index({ inertia, auth }: HttpContext, documentService: DocumentService) {
    const documents = await documentService.findAll({ userId: auth.user!.id })

    return inertia.render('drives/index', {
      documents: DocumentDto.fromArray(documents)
    })
  }

  @inject()
  async store({ request, response, bouncer, i18n }: HttpContext, createDocumentFolderAction: CreateDocumentFolderAction) {
    if (await bouncer.with(DocumentPolicy).denies('create')) {
      return response.forbidden('Cannot create a document')
    }

    const data = request.only(['name', 'parentId'])
    await createDocumentFolderAction.execute(data)

    transmit.broadcast('notifications', {
      severity: 'success',
      summary: i18n.t('drive.create.folder.success.summary'),
      detail: i18n.t('drive.create.folder.success.detail'),
    })

    return response.redirect().back()
  }

  @inject()
  async destroy({ params, response, auth, bouncer, i18n }: HttpContext, documentService: DocumentService, deleteDocumentFileAction: DeleteDocumentFileAction) {
    const document = await documentService.findOrFail({ id: params.id, userId: auth.user!.id })
    if (await bouncer.with(DocumentPolicy).denies('delete', document)) {
      return response.forbidden('Cannot delete a document')
    }

    await deleteDocumentFileAction.execute({ id: params.id })

    transmit.broadcast('notifications', {
      severity: 'success',
      summary: i18n.t('drive.delete.file.success.summary'),
      detail: i18n.t('drive.delete.file.success.detail'),
    })

    return response.redirect().back()
  }
}
