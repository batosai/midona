import { defineConfig } from '@jrmc/adonis-attachment'
import { InferConverters } from '@jrmc/adonis-attachment/types/config'

const attachmentConfig = defineConfig({
  converters: {
    thumbnail: {
      resize: 300,
    },
  },
})

export default attachmentConfig

declare module '@jrmc/adonis-attachment' {
  interface AttachmentVariants extends InferConverters<typeof attachmentConfig> {}
}
