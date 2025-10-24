import Factory from '@adonisjs/lucid/factories'
import Term from '#models/term'
import Taxonomies from '#enums/taxonomies'
import User from '#models/user'

export const TermFactory = Factory
  .define(Term, async ({ faker }: any) => {
    const name = faker.lorem.word()

    return {
      name,
      slug: name.toLowerCase().replace(/\s+/g, '-'),
      taxonomy: faker.helpers.enumValue(Taxonomies),
      parentId: null,
    }
  })
  .relation('user', () => User)
  .build()
