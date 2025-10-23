import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import TermsController from '#controllers/terms_controller'

router
  .group(() => {
    router.resource('/terms', TermsController).apiOnly().use('*', middleware.auth()).as('terms')
  })
  .prefix('/api/v1')
