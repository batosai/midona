import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

import DocumentService from '#services/document_service'

type DeleteDocumentFileActionParams = {
  id: string
}

@inject()
export default class DeleteDocumentFileAction {
  constructor(
    private documentService: DocumentService,
    private ctx: HttpContext
  ) {}

  async execute(params: DeleteDocumentFileActionParams) {
    const deleted = await this.documentService.delete({
      id: params.id,
      userId: this.ctx.auth.user!.id,
    })

    if (!deleted) {
      throw new Error('Document not found')
    }
  }
}
