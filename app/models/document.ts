import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { DateTime } from 'luxon'
import { BaseModel, column, beforeCreate, belongsTo } from '@adonisjs/lucid/orm'
import DocumentTypes from '#enums/document_types'

import User from './user.js'

export default class Document extends BaseModel {
  static selfAssignPrimaryKey = true

  @column({ isPrimary: true })
  declare id: string

  @column()
  declare type: DocumentTypes

  @column()
  declare userId: string

  // @attachment({ folder: 'files', preComputeUrl: true })
  // declare file: Attachment

  @column()
  declare mine: string | null

  @column()
  declare content: string | null

  @column.dateTime({ autoCreate: true })
  declare createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  declare updatedAt: DateTime

  // Relationships

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  // Hooks

  @beforeCreate()
  static assignUuid(document: Document) {
    document.id = crypto.randomUUID()
  }
}
