import type { BaseModel } from '@adonisjs/lucid/orm'
import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { DateTime } from 'luxon'
import type { ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'

import { column, scope } from '@adonisjs/lucid/orm'

export const whithDeletedOn = <Model extends NormalizeConstructor<typeof BaseModel>>(
  superclass: Model
) => {
  class whithDeletedOnClass extends superclass {
    @column.dateTime()
    declare deletedOn: DateTime | null

    static withoutDeleted = scope((query: ModelQueryBuilderContract<any>) => {
      query.whereNull('deletedOn')
    })

    static withDeleted = scope((query: ModelQueryBuilderContract<any>) => {
      query.whereNotNull('deletedOn')
    })
  }

  return whithDeletedOnClass
}
