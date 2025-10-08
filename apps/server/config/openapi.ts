import { defineConfig } from '@foadonis/openapi'

export default defineConfig({
  ui: 'scalar',
  document: {
    info: {
      title: 'Midona',
      version: '1.0.0',
    },
    components: {
      securitySchemes: {
        basic: {
          type: 'http',
          scheme: 'bearer',
        },
      },
    },
  },
})
