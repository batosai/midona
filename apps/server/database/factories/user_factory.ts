import Factory from '@adonisjs/lucid/factories'
import User from '#models/user'
import Roles from '#enums/roles'

export const UserFactory = Factory
  .define(User, async ({ faker }) => {
    return {
      lastname: faker.person.lastName(),
      firstname: faker.person.firstName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      disabled: false,
      role: Roles.USER,
    }
  })
  .state('disabled', (user) => (user.disabled = true))
  .build()
