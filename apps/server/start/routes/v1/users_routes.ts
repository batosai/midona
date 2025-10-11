import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const usersController = () => import('#controllers/users_controller')

router.get('/', async () => {
  return {
    hello: 'world',
  }
})

router
  .group(() => {
    router
      .group(() => {

        router.resource('users', usersController).apiOnly().use('*', middleware.auth()).as('users')
        router.get('users/me', () => {}).use(middleware.auth()).as('users.me')
        router.get('users/:id/tokens', () => {}).use(middleware.auth()).as('users.tokens')

      })
      .prefix('v1')
      .as('v1')
  })
  .prefix('api')
  .as('api')




