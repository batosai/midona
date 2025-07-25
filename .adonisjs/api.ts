// @ts-nocheck
/* eslint-disable */
// --------------------------------------------------
// This file is auto-generated by Tuyau. Do not edit manually !
// --------------------------------------------------

import type { MakeTuyauRequest, MakeTuyauResponse } from '@tuyau/utils/types'
import type { InferInput } from '@vinejs/vine/types'

type AuthLoginGetHead = {
  request: unknown
  response: MakeTuyauResponse<
    import('../app/controllers/session_controller.ts').default['create'],
    false
  >
}
type AuthLoginPost = {
  request: unknown
  response: MakeTuyauResponse<
    import('../app/controllers/session_controller.ts').default['store'],
    false
  >
}
type AuthLogoutDelete = {
  request: unknown
  response: MakeTuyauResponse<
    import('../app/controllers/session_controller.ts').default['destroy'],
    false
  >
}
type DriveGetHead = {
  request: unknown
  response: MakeTuyauResponse<
    import('../app/controllers/drives_controller.ts').default['index'],
    false
  >
}
type DrivePost = {
  request: MakeTuyauRequest<
    InferInput<(typeof import('../app/controllers/drives_controller.ts').default)['validator']>
  >
  response: MakeTuyauResponse<
    import('../app/controllers/drives_controller.ts').default['store'],
    true
  >
}
type DriveIdPutPatch = {
  request: unknown
  response: MakeTuyauResponse<
    import('../app/controllers/drives_controller.ts').default['update'],
    false
  >
}
type DriveIdDelete = {
  request: unknown
  response: MakeTuyauResponse<
    import('../app/controllers/drives_controller.ts').default['destroy'],
    false
  >
}
type DriveFoldersIdGetHead = {
  request: unknown
  response: MakeTuyauResponse<
    import('../app/controllers/drives_controller.ts').default['index'],
    false
  >
}
type ApiFoldersGetHead = {
  request: unknown
  response: MakeTuyauResponse<
    import('../app/controllers/folders_controller.ts').default['list'],
    false
  >
}
type UploadsPost = {
  request: unknown
  response: MakeTuyauResponse<
    import('../app/controllers/uploads_controller.ts').default['handle'],
    false
  >
}
export interface ApiDefinition {
  auth: {
    login: {
      $url: {}
      $get: AuthLoginGetHead
      $head: AuthLoginGetHead
      $post: AuthLoginPost
    }
    logout: {
      $url: {}
      $delete: AuthLogoutDelete
    }
  }
  drive: {
    '$url': {}
    '$get': DriveGetHead
    '$head': DriveGetHead
    '$post': DrivePost
    ':id': {
      $url: {}
      $put: DriveIdPutPatch
      $patch: DriveIdPutPatch
      $delete: DriveIdDelete
    }
    'folders': {
      ':id': {
        $url: {}
        $get: DriveFoldersIdGetHead
        $head: DriveFoldersIdGetHead
      }
    }
  }
  api: {
    folders: {
      $url: {}
      $get: ApiFoldersGetHead
      $head: ApiFoldersGetHead
    }
  }
  uploads: {
    $url: {}
    $post: UploadsPost
  }
}
const routes = [
  {
    params: ['*'],
    name: 'drive.fs.serve',
    path: '/uploads/*',
    method: ['GET', 'HEAD'],
    types: {} as unknown,
  },
  {
    params: [],
    name: 'auth.session.create',
    path: '/auth/login',
    method: ['GET', 'HEAD'],
    types: {} as AuthLoginGetHead,
  },
  {
    params: [],
    name: 'auth.session.store',
    path: '/auth/login',
    method: ['POST'],
    types: {} as AuthLoginPost,
  },
  {
    params: [],
    name: 'auth.session.destroy',
    path: '/auth/logout',
    method: ['DELETE'],
    types: {} as AuthLogoutDelete,
  },
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
    params: ['id'],
    name: 'notes.show',
    path: '/notes/:id',
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
    name: 'documents',
    path: '/documents',
    method: ['GET', 'HEAD'],
    types: {} as unknown,
  },
  {
    params: ['id'],
    name: 'documents.show',
    path: '/documents/:id',
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
  {
    params: [],
    name: 'users',
    path: '/users',
    method: ['GET', 'HEAD'],
    types: {} as unknown,
  },
  {
    params: [],
    name: 'drive.index',
    path: '/drive',
    method: ['GET', 'HEAD'],
    types: {} as DriveGetHead,
  },
  {
    params: [],
    name: 'drive.store',
    path: '/drive',
    method: ['POST'],
    types: {} as DrivePost,
  },
  {
    params: ['id'],
    name: 'drive.update',
    path: '/drive/:id',
    method: ['PUT', 'PATCH'],
    types: {} as DriveIdPutPatch,
  },
  {
    params: ['id'],
    name: 'drive.destroy',
    path: '/drive/:id',
    method: ['DELETE'],
    types: {} as DriveIdDelete,
  },
  {
    params: ['id'],
    name: 'drive.folders.show',
    path: '/drive/folders/:id',
    method: ['GET', 'HEAD'],
    types: {} as DriveFoldersIdGetHead,
  },
  {
    params: [],
    name: 'api.folders.list',
    path: '/api/folders',
    method: ['GET', 'HEAD'],
    types: {} as ApiFoldersGetHead,
  },
  {
    params: [],
    name: 'uploads',
    path: '/uploads',
    method: ['POST'],
    types: {} as UploadsPost,
  },
  {
    params: ['key', 'name'],
    name: 'attachments',
    path: '/attachments/:key/:name?',
    method: ['GET', 'HEAD'],
    types: {} as unknown,
  },
] as const
export const api = {
  routes,
  definition: {} as ApiDefinition,
}
