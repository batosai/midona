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

        router
        .group(() => {
          router.resource('users', usersController)
          router.get('users/me', () => {})
          router.get('users/:id/tokens', () => {})
        })
        .use(
          middleware.auth()
        )

      })
      .prefix('v1')
  })
  .prefix('api')




