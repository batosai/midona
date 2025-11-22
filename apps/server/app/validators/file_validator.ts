import vine from '@vinejs/vine'

export const FileValidator = vine.compile(
  vine.object({
    file_data: vine.nativeFile(),
  })
)

export const FileBase64Validator = vine.compile(
  vine.object({
    base64: vine.string().trim(),
    name: vine.string().optional(),
  })
)

export const FileUrlValidator = vine.compile(
  vine.object({
    url: vine.string().trim().activeUrl(),
    name: vine.string().optional(),
  })
)
