import vine from '@vinejs/vine'
import Taxonomies from '#enums/taxonomies'
import Term from '#models/term'

export const MIN_LENGTH = 2
export const MAX_LENGTH = 40

export const TermValidator = vine.withMetaData<{ record?: Term }>().compile(
  vine.object({
    name: vine.string().trim().minLength(MIN_LENGTH).maxLength(MAX_LENGTH),
    slug: vine
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9-]+$/)
      .unique(async (db, value, field) => {
        const query = db.from('terms').where('slug', value)

        if (field.meta.record) {
          query.whereNot('id', field.meta.record.id)
        }

        return !(await query.first())
      }),
    taxonomy: vine.enum(Object.values(Taxonomies)),
    parentId: vine.string().uuid().optional(),
  })
)
