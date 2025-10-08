import type { BaseModel } from '@adonisjs/lucid/orm'
import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'

import crypto from 'node:crypto'
import { column, beforeCreate } from '@adonisjs/lucid/orm'
import { ApiProperty } from '@foadonis/openapi/decorators'

export const UuidPrimaryKey = <Model extends NormalizeConstructor<typeof BaseModel>>(
  superclass: Model
) => {
  class UuidPrimaryKeyClass extends superclass {
    static selfAssignPrimaryKey = true

    @column({ isPrimary: true })
    @ApiProperty()
    declare id: string

    @beforeCreate()
    static assignUuid(entity: any) {
      entity.id = crypto.randomUUID()
    }
  }

  return UuidPrimaryKeyClass
}
