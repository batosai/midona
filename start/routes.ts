/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'

const UploadsController = () => import('#controllers/uploads_controller')
const DrivesController = () => import('#controllers/drives_controller')

router.on('/').renderInertia('home').as('home')
router.on('/login').renderInertia('login').as('login')
router.on('/notes').renderInertia('notes/index').as('notes')
router.on('/notes/:id').renderInertia('notes/show').as('notes.show')
router.on('/videos').renderInertia('videos/index').as('videos')
router.on('/videos/:id').renderInertia('videos/show').as('videos.show')
router.on('/documents').renderInertia('documents/index').as('documents')
router.on('/documents/:id').renderInertia('documents/show').as('documents.show')
router.on('/settings').renderInertia('settings').as('settings')
router.on('/users').renderInertia('users').as('users')

router.resource('/drive', DrivesController).as('drives')

router.post('/uploads', [UploadsController]).as('uploads')
