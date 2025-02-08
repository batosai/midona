import { defineConfig } from 'vite'
import { getDirname } from '@adonisjs/core/helpers'
import inertia from '@adonisjs/inertia/client'
import vue from '@vitejs/plugin-vue'
import adonisjs from '@adonisjs/vite/client'
import tailwindcss from '@tailwindcss/vite'
import Components from 'unplugin-vue-components/vite'
import { PrimeVueResolver } from '@primevue/auto-import-resolver'
import svgLoader from 'vite-svg-loader'

export default defineConfig({
  plugins: [
    inertia({ ssr: { enabled: false } }),
    vue(),
    tailwindcss(),
    svgLoader(),
    Components({
      resolvers: [
        PrimeVueResolver()
      ]
    }),
    adonisjs({ entrypoints: ['inertia/app/app.ts'], reload: ['resources/views/**/*.edge'] })
  ],

  /**
   * Define aliases for importing modules from
   * your frontend code
   */
  resolve: {
    alias: {
      '~/': `${getDirname(import.meta.url)}/inertia/`,
      '@/': `${getDirname(import.meta.url)}/inertia/components/`,
    },
  },
})
