/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import type { DefineComponent } from 'vue'

import './app.css'
import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { createI18n } from 'vue-i18n'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import PrimeVue from 'primevue/config'
import { TuyauPlugin } from '@tuyau/inertia/vue'

import Noir from './presets/Noir'
import Layout from '~/layouts/Default.vue'
import { tuyau } from '~/settings/tuyau'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

const i18n = createI18n({
  locale: 'fr',
  fallbackLocale: 'en',
  messages: {
    en: {
      hello: 'hello'
    },
    fr: {
      hello: 'Bonjour'
    }
  }
})

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: async (name) => {
    const page = await resolvePageComponent(
      `../pages/${name}.vue`,
      import.meta.glob<DefineComponent>('../pages/**/*.vue'),
    )

    page.default.layout = page.default.layout || Layout
    return page
  },

  setup({ el, App, props, plugin }) {

    const app = createApp({ render: () => h(App, props) })
      .use(plugin)
      .use(i18n)
      .use(TuyauPlugin, { client: tuyau })
      .use(PrimeVue, {
        ripple: true,
        theme: {
          preset: Noir,
          options: {
            darkModeSelector: 'system',
            cssLayer: {
              name: 'primevue',
              order: 'base, primevue',
            },
          },
        },
      })


    app.config.globalProperties.$tuyau = tuyau

    app.mount(el)
  },
})
