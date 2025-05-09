import type { HttpContext } from '@adonisjs/core/http'

import { inject } from '@adonisjs/core'
import DocumentService from '#services/document_service'
import DocumentDto from '#dtos/document'

export default class DrivesController {
  @inject()
  async index({ inertia }: HttpContext) {
    const documentService = new DocumentService()
    const documents = await documentService.findAll()

    return inertia.render('drives/index', {
      documents: DocumentDto.fromArray(documents)
    })
  }
}
