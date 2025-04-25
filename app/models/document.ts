import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'

import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { attachment } from '@jrmc/adonis-attachment'
import DocumentTypes from '#enums/document_types'
import { UuidPrimaryKey } from '#models/mixins/uuid_primary_key'
import { whithTimestamps } from '#models/mixins/with_timestamps'

import User from './user.js'

export default class Document extends compose(BaseModel, UuidPrimaryKey, whithTimestamps) {
  @column()
  declare type: DocumentTypes

  @column()
  declare userId: string

  @column()
  declare parentId: string | null

  @attachment()
  declare file: Attachment

  @column()
  declare mimeType: string | null

  @column()
  declare content: string | null

  @column()
  declare views: number

  // Hooks

  @beforeCreate()
  static async insertMineType(document: Document) {
    document.mimeType = document.file.mimeType
  }

  // Relationships

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Document)
  declare parent: BelongsTo<typeof Document>
}
