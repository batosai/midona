import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import transmit from '@adonisjs/transmit/services/main'
import vine from '@vinejs/vine'
import DocumentService from '#services/document_service'
import DocumentDto from '#dtos/document'
import DocumentPolicy from '#policies/document_policy'
import DeleteDocumentFileAction from '#actions/delete_document_file_action'
import CreateDocumentFolderAction from '#actions/create_document_folder_action'

export default class DrivesController {

  static validator = vine.compile(
		vine.object({
			name: vine.string().minLength(1),
      parentId: vine.string().uuid().nullable(),
		})
	);

  @inject()
  async index({ inertia, auth, params }: HttpContext, documentService: DocumentService) {
    const documents = await documentService.findAll({
      userId: auth.user!.id,
      parentId: params.id || null
    })

    return inertia.render('drives/index', {
      documents: DocumentDto.fromArray(documents),
      parentId: params.id || null
    })
  }

  @inject()
  async store({ request, response, bouncer, i18n }: HttpContext, createDocumentFolderAction: CreateDocumentFolderAction) {
    await bouncer.with(DocumentPolicy).allows('create')

    const payload = await request.validateUsing(
			DrivesController.validator
		)

    await createDocumentFolderAction.execute(payload)

    transmit.broadcast('notifications', {
      severity: 'success',
      summary: i18n.t('drive.create.folder.success.summary'),
      detail: i18n.t('drive.create.folder.success.detail'),
    })

    return response.redirect().back()
  }

  @inject()
  async update({ request, response, bouncer, i18n, params, auth }: HttpContext, documentService: DocumentService) {
    const document = await documentService.find({ id: params.id, userId: auth.user!.id })
    if (!document) {
      return response.notFound()
    }

    if (await bouncer.with(DocumentPolicy).denies('update', document)) {
      return response.forbidden('Cannot update a document')
    }

    const data = request.only(['parentId'])
    await documentService.update({ id: params.id, data })

    transmit.broadcast('notifications', {
      severity: 'success',
      summary: i18n.t('drive.move.success.summary'),
      detail: i18n.t('drive.move.success.detail'),
    })

    return response.redirect().back()
  }

  @inject()
  async destroy({ request, response, bouncer, i18n, auth }: HttpContext, deleteDocumentFileAction: DeleteDocumentFileAction, documentService: DocumentService) {
    const document = await documentService.find({ id: request.param('id'), userId: auth.user!.id })
    if (!document) {
      return response.notFound()
    }

    if (await bouncer.with(DocumentPolicy).denies('delete', document)) {
      return response.forbidden('Cannot delete a document')
    }

    await deleteDocumentFileAction.execute({ id: request.param('id') })

    transmit.broadcast('notifications', {
      severity: 'success',
      summary: i18n.t('drive.delete.file.success.summary'),
      detail: i18n.t('drive.delete.file.success.detail'),
    })

    return response.redirect().back()
  }
}
