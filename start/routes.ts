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
router.on('/notes').renderInertia('notes/index').as('notes')
router.on('/notes/:id').renderInertia('notes/show').as('notes.show')
router.on('/videos').renderInertia('videos/index').as('videos')
router.on('/videos/:id').renderInertia('videos/show').as('videos.show')
router.on('/documents').renderInertia('documents/index').as('documents')
router.on('/documents/:id').renderInertia('documents/show').as('documents.show')
router.on('/settings').renderInertia('settings').as('settings')
router.on('/drive').renderInertia('drive/index').as('drive')
