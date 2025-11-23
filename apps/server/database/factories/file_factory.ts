import Factory from '@adonisjs/lucid/factories'
import File from '#models/file'
import { attachmentManager } from '@jrmc/adonis-attachment'
import Content from '#models/content'
import User from '#models/user'

export const FileFactory = Factory
  .define(File, async ({ faker }) => {
    // Create a simple text file content
    const fileContent = faker.lorem.paragraph()
    const base64Content = Buffer.from(fileContent).toString('base64')
    const fileName = `${faker.system.fileName()}.txt`

    // Create attachment from base64
    const file_data = await attachmentManager.createFromBase64(base64Content, fileName)

    return {
      name: fileName,
      mimeType: 'text/plain',
      size: fileContent.length,
      file_data,
    }
  })
  .relation('content', () => Content)
  .relation('user', () => User)
  .build()

