import Factory from '@adonisjs/lucid/factories'
import Content from '#models/content'
import ContentTypes from '#enums/content_types'
import User from '#models/user'

export const ContentFactory = Factory
  .define(Content, async ({ faker }: any) => {
    const title = faker.lorem.sentence()

    return {
      title,
      slug: title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      text: faker.lorem.paragraph(),
      contentType: faker.helpers.enumValue(ContentTypes),
      extra: {},
    }
  })
  .relation('user', () => User)
  .build()
