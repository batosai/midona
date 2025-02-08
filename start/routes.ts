/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
router.on('/').renderInertia('home').as('home')
router.on('/notes').renderInertia('notes').as('notes')
router.on('/videos').renderInertia('videos/index').as('videos')
router.on('/videos/:id').renderInertia('videos/show').as('videos.show')
router.on('/settings').renderInertia('settings').as('settings')

