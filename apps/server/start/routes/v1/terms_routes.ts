import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import TermsController from '#controllers/terms_controller'

router
.group(() => {
  router
    .group(() => {

      router.resource('/terms', TermsController).apiOnly().use('*', middleware.auth()).as('terms')

    })
    .prefix('v1')
    .as('v1')
})
.prefix('api')
.as('api')
