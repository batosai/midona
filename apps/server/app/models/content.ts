import type { BelongsTo, ManyToMany, HasOne } from '@adonisjs/lucid/types/relations'

import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, belongsTo, manyToMany, hasOne } from '@adonisjs/lucid/orm'

import { UuidPrimaryKey } from '#models/mixins/uuid_primary_key'
import { whithTimestamps } from '#models/mixins/with_timestamps'
import User from '#models/user'
import Category from '#models/category'
import Tag from '#models/tag'
import File from '#models/file'

export default class Content extends compose(
  BaseModel,
  UuidPrimaryKey,
  whithTimestamps
) {
  @column()
  declare title: string

  @column()
  declare slug: string

  @column()
  declare text: string

  @column()
  declare extra: Record<string, any>

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
