import vine from '@vinejs/vine'

export const createUserValidator = vine.compile(
  vine.object({
    lastname: vine.string(),
    firstname: vine.string(),
    email: vine.string().email().unique(async (db, value) => {
      const user = await db
        .from('users')
        .where('email', value)
        .first()
      return !user
    }),
    password: vine.string().minLength(4),
  })
)
