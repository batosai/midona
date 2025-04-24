import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'
import type { MultipartFile } from '@adonisjs/core/bodyparser'

import Document from '#models/document'
import DocumentTypes from '#enums/document_types'
import { attachmentManager } from '@jrmc/adonis-attachment'

type documentType = {
  type: DocumentTypes
  userId: string
  parentId: string | null
  file: Attachment
  position: number
}

type CreateDocumentFilesActionParams = {
  files: MultipartFile[],
  userId: string
  parentId: string | null
}

export default class CreateDocumentFilesAction {
  async execute(params: CreateDocumentFilesActionParams) {
    const documents: documentType[] = []
    const result = await Document.query().count('id', 'count').first()

    const files = params.files

    for (const [index, file] of files.entries()) {
      documents.push({
        type: DocumentTypes.FILE,
        userId: params.userId,
        parentId: params.parentId,
        file: await attachmentManager.createFromFile(file),
        position: result?.$extras.count + index + 1,
      })
    }

    if (documents.length) {
      return await Document.createMany(documents)
    }

    return []
  }
}
