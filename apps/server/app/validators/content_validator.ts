import vine from '@vinejs/vine'
import ContentTypes from '#enums/content_types'
import Content from '#models/content'

export const MIN_LENGTH = 2
export const MAX_LENGTH = 255

export const ContentValidator = vine.withMetaData<{ record?: Content }>().compile(
  vine.object({
    title: vine.string().trim().minLength(MIN_LENGTH).maxLength(MAX_LENGTH),
    slug: vine
      .string()
      .trim()
      .toLowerCase()
      .regex(/^[a-z0-9-]+$/)
      .unique(async (db, value, field) => {
        const query = db.from('contents').where('slug', value)

        if (field.meta?.record) {
          query.whereNot('id', field.meta.record.id)
        }

        return !(await query.first())
      }),
    text: vine.string().trim().optional(),
    contentType: vine.enum(Object.values(ContentTypes)),
    extra: vine.record(vine.any()).optional(),
    userId: vine.string().uuid(),
    termId: vine.string().uuid(),
  })
)
