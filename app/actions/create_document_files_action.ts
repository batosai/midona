import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'

import DocumentService from '#services/document_service'
import DocumentTypes from '#enums/document_types'
import { attachmentManager } from '@jrmc/adonis-attachment'

type documentType = {
  type: DocumentTypes
  userId: string
  parentId: string | null
  file: Attachment
}

type CreateDocumentFilesActionParams = {
  files: MultipartFile[],
  parentId: string | null
}

@inject()
export default class CreateDocumentFilesAction {
  constructor(
    private documentService: DocumentService,
    private ctx: HttpContext
  ) {}

  async execute(params: CreateDocumentFilesActionParams) {
    const documents: documentType[] = []

    const files = params.files

    for (const file of files) {
      documents.push({
        type: DocumentTypes.FILE,
        userId: this.ctx.auth.user!.id,
        parentId: params.parentId,
        file: await attachmentManager.createFromFile(file),
      })
    }

    if (documents.length) {
      return await this.documentService.createMany(documents)
    }

    return []
  }
}
