import vine from '@vinejs/vine'

import DocumentTypes from '#enums/document_types'

export const DocumentValidator = vine.compile(
  vine.object({
    file: vine.file({ size: '2mb' }).optional(),
    mine: vine.string().trim().optional(),
    content: vine.string().trim().optional(),
    type: vine.enum(Object.values(DocumentTypes)).optional(),
  })
)
