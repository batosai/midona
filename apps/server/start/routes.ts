/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/
import { middleware } from '#start/kernel'
import openapi from '@foadonis/openapi/services/main'

openapi.registerRoutes().use([
  middleware.auth({
    guards: ['basicAuth']
  }),
  middleware.user_admin()
])


import '#start/routes/v1/auth_routes'
import '#start/routes/v1/users_routes'
