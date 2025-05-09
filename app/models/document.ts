import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'

import { BaseModel, column, belongsTo, beforeCreate, computed } from '@adonisjs/lucid/orm'
import { compose } from '@adonisjs/core/helpers'
import { attachment } from '@jrmc/adonis-attachment'
import DocumentTypes from '#enums/document_types'
import { UuidPrimaryKey } from '#models/mixins/uuid_primary_key'
import { whithTimestamps } from '#models/mixins/with_timestamps'
import { whithDeletedOn } from '#models/mixins/with_deleted_on'
import User from './user.js'

export default class Document extends compose(BaseModel, UuidPrimaryKey, whithTimestamps, whithDeletedOn) {
  @column()
  declare type: DocumentTypes

  @column()
  declare userId: string

  @column()
  declare parentId: string | null

  @attachment({
    preComputeUrl: true,
    variants: ['thumbnail'],
  })
  declare file: Attachment

  @column()
  declare mimeType: string | null

  @column()
  declare content: string | null

  @column()
  declare views: number

  // Computed

  @computed()
  get name() {
    return this.file?.originalName
  }

  @computed()
  get size() {
    return this.file?.size
  }

  @computed()
  get isFolder() {
    return this.type === DocumentTypes.FOLDER
  }

  @computed()
  get isFile() {
    return this.type === DocumentTypes.FILE
  }

  @computed()
  get isImage() {
    return this.mimeType?.startsWith('image/')
  }

  @computed()
  get isVideo() {
    return this.mimeType?.startsWith('video/')
  }

  @computed()
  get isAudio() {
    return this.mimeType?.startsWith('audio/')
  }

  @computed()
  get isPdf() {
    return this.mimeType?.startsWith('application/pdf')
  }

  @computed()
  get isWord() {
    return this.mimeType?.startsWith('application/msword')
  }

  @computed()
  get isExcel() {
    return this.mimeType?.startsWith('application/vnd.ms-excel')
  }

  @computed()
  get isZip() {
    return this.mimeType?.startsWith('application/zip')
  }

  @computed()
  get isRar() {
    return this.mimeType?.startsWith('application/x-rar-compressed')
  }

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
