import type { BelongsTo } from '@adonisjs/lucid/types/relations'

import { compose } from '@adonisjs/core/helpers'
import { BaseModel, column, scope, belongsTo } from '@adonisjs/lucid/orm'

import { UuidPrimaryKey } from '#models/mixins/uuid_primary_key'
import { whithTimestamps } from '#models/mixins/with_timestamps'
import User from '#models/user'
import Taxonomies from '#enums/taxonomies'

export default class Term extends compose(
  BaseModel,
  UuidPrimaryKey,
  whithTimestamps
) {
  @column()
  declare name: string

  @column()
  declare slug: string

  @column()
  declare taxonomy: Taxonomies

  @column()
  declare parentId: string | null

  @column()
  declare userId: string


  // scopes

  static categories = scope((query: any) => {
    query.where('taxonomy', Taxonomies.CATEGORY)
  })

  static tags = scope((query: any) => {
    query.where('taxonomy', Taxonomies.TAG)
  })

  // Relationships

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  @belongsTo(() => Term)
  declare parent: BelongsTo<typeof Term>
}
