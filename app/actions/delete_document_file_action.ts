import { inject } from '@adonisjs/core'

import DocumentService from '#services/document_service'

type DeleteDocumentFileActionParams = {
  id: string
}

@inject()
export default class DeleteDocumentFileAction {
  constructor(private documentService: DocumentService) {}

  async execute(params: DeleteDocumentFileActionParams) {
    const deleted = await this.documentService.delete(params.id)

    if (!deleted) {
      throw new Error('Document not found')
    }
  }
}
