import type { BelongsTo, ManyToMany, HasOne } from '@adonisjs/lucid/types/relations'

import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, belongsTo, manyToMany, hasOne } from '@adonisjs/lucid/orm'
import { ApiProperty } from '@foadonis/openapi/decorators'

import { UuidPrimaryKey } from '#models/mixins/uuid_primary_key'
import { whithTimestamps } from '#models/mixins/with_timestamps'
import User from '#models/user'
import Category from '#models/category'
import Tag from '#models/tag'
import File from '#models/file'
import ContentTypes from '#enums/content_types'

export default class Content extends compose(
  BaseModel,
  UuidPrimaryKey,
  whithTimestamps
) {
  @column()
  @ApiProperty()
  declare title: string

  @column()
  @ApiProperty()
  declare slug: string

  @column()
  @ApiProperty()
  declare text: string

  @column()
  @ApiProperty({ type: 'object', nullable: true })
  declare extra: Record<string, any>

  @column()
  @ApiProperty({ type: String, enum: ContentTypes })
  declare contentType: ContentTypes

  @column()
  @ApiProperty()
  declare userId: string

  @column()
  @ApiProperty()
  declare termId: string

  // Relationships

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @manyToMany(() => Category)
  declare categories: ManyToMany<typeof Category>

  @manyToMany(() => Tag)
  declare tags: ManyToMany<typeof Tag>

  @hasOne(() => File)
  declare file: HasOne<typeof File>
}
