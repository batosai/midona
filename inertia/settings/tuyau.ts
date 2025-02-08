import { createTuyau } from '@tuyau/client'
import { api } from 'midona/api'

export const tuyau = createTuyau({
  api,
  baseUrl: 'http://localhost:3333',
})
