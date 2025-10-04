import router from '@adonisjs/core/services/router'

const authController = () => import('#controllers/auth_controller')

router
  .group(() => {
    router
      .group(() => {

        router.post('auth/login', [authController, 'login'])
        router.delete('auth/logout', [authController, 'logout'])
        router.get('auth/reset-password', () => {})
        router.get('auth/verify-email', () => {})

      })
      .prefix('v1')
  })
  .prefix('api')



// TODO
// X-Auth-Mode: token
