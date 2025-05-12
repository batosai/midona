/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import type { DefineComponent } from 'vue'

declare global {
  interface ImportMeta {
    env: {
      VITE_APP_NAME: string
      [key: string]: string
    }
    glob: <T>(pattern: string) => Record<string, () => Promise<T>>
  }
}

import './app.css'
import { createApp, h } from 'vue'
import { createInertiaApp } from '@inertiajs/vue3'
import { createI18n } from 'vue-i18n'
import { createPinia } from 'pinia'
import { resolvePageComponent } from '@adonisjs/inertia/helpers'
import PrimeVue from 'primevue/config'
import ConfirmationService from 'primevue/confirmationservice'
import ToastService from 'primevue/toastservice'
import { TuyauPlugin } from '@tuyau/inertia/vue'

import Noir from './presets/Noir'
import Layout from '~/layouts/Default.vue'
import { tuyau } from '~/settings/tuyau'
import { useActionStore } from '~/stores/actionStore'
import en from './locales/en'
import fr from './locales/fr'

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

const pinia = createPinia()

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: async (name: string) => {
    const page = await resolvePageComponent(
      `../pages/${name}.vue`,
      import.meta.glob<DefineComponent>('../pages/**/*.vue')
    ) as any

    page.default.layout = page.default.layout || Layout
    return page.default
  },

  setup({ el, App, props, plugin }) {
    const i18n = createI18n({
      legacy: false,
      locale: (props.initialPage.props.locale as string) || 'en',
      fallbackLocale: 'en',
      messages: {
        en,
        fr
      },
    })

    const app = createApp({ render: () => h(App, props) })
      .use(plugin)
      .use(pinia)
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
      .use(ConfirmationService)
      .use(ToastService)

    app.config.globalProperties.$tuyau = tuyau

    app.config.globalProperties.$inertia.on('before', () => {
      const store = useActionStore()
      store.reset()
    })

    app.mount(el)
  },
})
