import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import ContentsController from '#controllers/contents_controller'

  router
.group(() => {
  router
    .group(() => {

      router.resource('/contents', ContentsController).apiOnly().use('*', middleware.auth()).as('contents')

    })
    .prefix('v1')
    .as('v1')
})
.prefix('api')
.as('api')
