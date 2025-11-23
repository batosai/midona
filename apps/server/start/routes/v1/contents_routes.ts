import router from '@adonisjs/core/services/router'
import { middleware } from '#start/kernel'
import ContentsController from '#controllers/contents_controller'
import FileController from '#controllers/file_controller'

  router
.group(() => {
  router
    .group(() => {

      router.resource('/contents', ContentsController).apiOnly().use('*', middleware.auth()).as('contents')
      router.post('/contents/:content_id/files', [FileController, 'upload']).use(middleware.auth()).as('contents.files.upload')
      router.post('/contents/:content_id/files/base64', [FileController, 'uploadFromBase64']).use(middleware.auth()).as('contents.files.uploadFromBase64')
      router.post('/contents/:content_id/files/url', [FileController, 'uploadFromUrl']).use(middleware.auth()).as('contents.files.uploadFromUrl')
      router.delete('/contents/:content_id/files/:id', [FileController, 'destroy']).use(middleware.auth()).as('contents.files.destroy')
      router.get('/contents/:content_id/files', [FileController, 'index']).use(middleware.auth()).as('contents.files.index')
    })
    .prefix('v1')
    .as('v1')
})
.prefix('api')
.as('api')
