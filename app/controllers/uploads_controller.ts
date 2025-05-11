import type { HttpContext } from '@adonisjs/core/http'

import CreateDocumentFilesAction  from '#actions/create_document_files_action'
import { inject } from '@adonisjs/core'

export default class UploadsController {

  @inject()
  async handle({ request, response }: HttpContext, createDocumentFilesAction: CreateDocumentFilesAction) {
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
      parentId: null,
      files
    })

    if (documents.length) {
      return response.json(documents)
    }

    return response.badRequest()
  }
}
