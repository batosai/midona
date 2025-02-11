// @ts-nocheck
/* eslint-disable */
// --------------------------------------------------
// This file is auto-generated by Tuyau. Do not edit manually !
// --------------------------------------------------

import type { MakeTuyauRequest, MakeTuyauResponse } from '@tuyau/utils/types'
import type { InferInput } from '@vinejs/vine/types'

export interface ApiDefinition {}
const routes = [
  {
    params: [],
    name: 'home',
    path: '/',
    method: ['GET', 'HEAD'],
    types: {} as unknown,
  },
  {
    params: [],
    name: 'notes',
    path: '/notes',
    method: ['GET', 'HEAD'],
    types: {} as unknown,
  },
  {
    params: [],
    name: 'videos',
    path: '/videos',
    method: ['GET', 'HEAD'],
    types: {} as unknown,
  },
  {
    params: ['id'],
    name: 'videos.show',
    path: '/videos/:id',
    method: ['GET', 'HEAD'],
    types: {} as unknown,
  },
  {
    params: [],
    name: 'settings',
    path: '/settings',
    method: ['GET', 'HEAD'],
    types: {} as unknown,
  },
] as const
export const api = {
  routes,
  definition: {} as ApiDefinition,
}
