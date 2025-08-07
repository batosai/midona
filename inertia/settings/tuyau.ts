import { createTuyau } from '@tuyau/client'
import { api } from 'midona/api'

export const tuyau = createTuyau({
  api,
  baseUrl: 'http://127.0.0.1:3333',
})
