import type { HttpContext } from '@adonisjs/core/http'
import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'

// import { DocumentValidator } from '#validators/document'


import User from '#models/user'
import Document from '#models/document'
import DocumentTypes from '#enums/document_types'
import { attachmentManager } from '@jrmc/adonis-attachment'

type documentType = {
  type: DocumentTypes
  userId: string
  file: Attachment
}

export default class UploadsController {

  async handle({ request, response }: HttpContext) {
    const user = await User.first()
    const documents: documentType[] = []

    if (!user) {
      return response.badRequest()
    }

    // const payload = await request.validateUsing(DocumentValidator)

    const files = request.files('uploads', {
      size: '2mb',
    })

    for (const file of files) {
      if (file && !file.isValid || !file) {
        return response.badRequest({
          errors: file?.errors[0] ?? 'Fichier invalide'
        })
      }

      documents.push({
        type: DocumentTypes.FILE,
        userId: user.id,
        file: await attachmentManager.createFromFile(file),
      })
    }

    if (documents.length) {
      return response.json(
        await Document.createMany(documents)
      )
    }

    return response.badRequest()
  }
}
