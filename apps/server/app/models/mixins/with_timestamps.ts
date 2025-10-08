import type { BaseModel } from '@adonisjs/lucid/orm'
import type { NormalizeConstructor } from '@adonisjs/core/types/helpers'
import type { DateTime } from 'luxon'

import { column } from '@adonisjs/lucid/orm'
import { ApiProperty } from '@foadonis/openapi/decorators'

export const whithTimestamps = <Model extends NormalizeConstructor<typeof BaseModel>>(
  superclass: Model
) => {
  class whithTimestampsClass extends superclass {
    @column.dateTime({ autoCreate: true })
    @ApiProperty({ type: String })
    declare createdAt: DateTime

    @column.dateTime({ autoCreate: true, autoUpdate: true })
    @ApiProperty({ type: String })
    declare updatedAt: DateTime
  }

  return whithTimestampsClass
}
