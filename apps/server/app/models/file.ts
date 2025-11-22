import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import type { Attachment } from '@jrmc/adonis-attachment/types/attachment'

import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, belongsTo, beforeCreate } from '@adonisjs/lucid/orm'
import { attachment } from '@jrmc/adonis-attachment'

import { UuidPrimaryKey } from '#models/mixins/uuid_primary_key'
import { whithTimestamps } from '#models/mixins/with_timestamps'
import Content from '#models/content'

export default class File extends compose(
  BaseModel,
  UuidPrimaryKey,
  whithTimestamps
) {
  @column()
  declare name: string

  @column()
  declare mimeType: string | null

  @column()
  declare size: number

  @attachment()
  declare file_data: Attachment | null

  @column()
  declare contentId: string

  @belongsTo(() => Content)
  declare content: BelongsTo<typeof Content>

  @beforeCreate()
  static async createDefaultValues(file: File) {
    if (!file.name) {
      file.name = file.file_data!.name
    }

    if (!file.mimeType) {
      file.mimeType = file.file_data!.mimeType
    }

    if (!file.size) {
      file.size = file.file_data!.size
    }
  }

}
