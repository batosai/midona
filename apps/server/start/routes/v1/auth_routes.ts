import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'

const authController = () => import('#controllers/auth_controller')

router
  .group(() => {
    router
      .group(() => {

        router.post('auth/login', [authController, 'login']).as('login')
        router.delete('auth/logout', [authController, 'logout']).use(
          middleware.auth()
        ).as('logout')
        router.post('auth/forgot-password', [authController, 'forgotPassword']).as('forgotPassword')
        router.post('auth/reset-password', [authController, 'resetPassword']).use(
          middleware.auth()
        ).as('resetPassword')

      })
      .prefix('v1')
      .as('v1')
  })
  .prefix('api')
  .as('api')
