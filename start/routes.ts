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
router.on('/videos').renderInertia('videos').as('videos')
router.on('/settings').renderInertia('settings').as('settings')

