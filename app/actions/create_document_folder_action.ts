import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

import DocumentService from '#services/document_service'
import DocumentTypes from '#enums/document_types'

type CreateDocumentFolderActionParams = {
  name: string
  parentId: string | null
}

@inject()
export default class CreateDocumentFolderAction {
  constructor(
    private documentService: DocumentService,
    private ctx: HttpContext
  ) {}

  async execute(params: CreateDocumentFolderActionParams) {
    return this.documentService.create({
      name: params.name,
      type: DocumentTypes.FOLDER,
      userId: this.ctx.auth.user!.id,
      parentId: params.parentId
    })
  }
}
