import type { HttpContext } from '@adonisjs/core/http'

import CreateDocumentFilesAction  from '#actions/create_document_files_action'
import { inject } from '@adonisjs/core'
import DocumentPolicy from '#policies/document_policy'
import transmit from '@adonisjs/transmit/services/main'
export default class UploadsController {

  @inject()
  async handle({ request, response, bouncer, i18n }: HttpContext, createDocumentFilesAction: CreateDocumentFilesAction) {
    if (await bouncer.with(DocumentPolicy).denies('create')) {
      return response.forbidden('Cannot create a document')
    }

    const files = request.files('uploads', {
      size: '2mb',
    })

    for (const file of files) {
      if (file && !file.isValid || !file) {
        return response.badRequest({
          errors: file?.errors[0] ?? 'Fichier invalide'
        })
      }
    }

    const documents = await createDocumentFilesAction.execute({
      parentId: request.input('parentId'),
      files
    })

    if (documents.length) {

      transmit.broadcast('notifications', {
        severity: 'success',
        summary: i18n.t('drive.upload.success.summary'),
        detail: i18n.t('drive.upload.success.detail'),
      })

      return response.json(documents)
    }

    return response.badRequest()
  }
}
