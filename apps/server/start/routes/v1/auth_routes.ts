import router from '@adonisjs/core/services/router'

router
  .group(() => {
    router
      .group(() => {

        router.get('auth/login', () => {})
        router.get('auth/logout', () => {})
        router.get('auth/reset-password', () => {})
        router.get('auth/verify-email', () => {})

      })
      .prefix('v1')
  })
  .prefix('api')



// TODO
// X-Auth-Mode: token
