/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'
import { middleware } from '#start/kernel'

transmit.registerRoutes()

const SessionController = () => import('#controllers/session_controller')
const UploadsController = () => import('#controllers/uploads_controller')
const DrivesController = () => import('#controllers/drives_controller')
const FoldersController = () => import('#controllers/folders_controller')

router
  .group(() => {
    router.get('login', [SessionController, 'create']).as('session.create')
    router.post('login', [SessionController, 'store']).as('session.store')
  })
  .prefix('auth')
  .as('auth')
  .use(middleware.guest())

router
  .delete('auth/logout', [SessionController, 'destroy'])
  .as('auth.session.destroy')
  .use(middleware.auth())


router
  .group(() => {
    router.on('/').renderInertia('home').as('home')
    router.on('/notes').renderInertia('notes/index').as('notes')
    router.on('/notes/:id').renderInertia('notes/show').as('notes.show')
    router.on('/videos').renderInertia('videos/index').as('videos')
    router.on('/videos/:id').renderInertia('videos/show').as('videos.show')
    router.on('/documents').renderInertia('documents/index').as('documents')
    router.on('/documents/:id').renderInertia('documents/show').as('documents.show')
    router.on('/settings').renderInertia('settings').as('settings')
    router.on('/users').renderInertia('users').as('users')

    router.resource('/drive', DrivesController).only(['index', 'store', 'update', 'destroy']).as('drive')
    router.get('/drive/folders/:id', [DrivesController, 'index']).as('drive.folders.show')
    router.get('/api/folders', [FoldersController, 'list']).as('api.folders.list')

    router.post('/uploads', [UploadsController]).as('uploads')

    router.attachments()
  })
  .use(middleware.auth())


