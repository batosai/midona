import vine from '@vinejs/vine'

export const youtubeIdValidator = vine.compile(
  vine.object({
    id: vine.string().minLength(11).maxLength(11),
  })
)

export const youtubeUrlValidator = vine.compile(
  vine.object({
    url: vine.string()
    .url({
      require_protocol: true,
      protocols: ['https']
    })
    .regex(/(?:youtube\.com\/(?:[^\/]+\/.+\/|(?:v|e(?:mbed)?)\/|.*[?&]v=)|youtu\.be\/)([^"&?\/\s]{11})/),
  })
)
