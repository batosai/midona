/// <reference path="../../adonisrc.ts" />
/// <reference path="../../config/inertia.ts" />

import type { DefineComponent } from 'vue'

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

const appName = import.meta.env.VITE_APP_NAME || 'AdonisJS'

const pinia = createPinia()

const i18n = createI18n({
  legacy: false,
  locale: 'fr',
  fallbackLocale: 'en',
  messages: {
    en: {
      nav: {
        apps: 'Applications',
        home: 'Home',
        drive: 'Drive',
        notes: 'Notes',
        videos: 'Videos',
        chat: 'Chat',
        notifications: 'Notifications',
        uploads: 'Downloads',
        settings: 'Settings',
      },
      download: {
        downloads: 'Downloads',
        add: 'Add',
        delete_all: 'Add',
        status: {
          INIT: 'Initialized',
          IDLE: 'Idle',
          PROCESSING_QUEUED: 'Queued for processing',
          PROCESSING: 'Processing',
          PROCESSING_COMPLETE: 'Processing complete',
          PROCESSING_ERROR: 'Processing error',
          PROCESSING_REVERT_ERROR: 'Error reverting processing',
          LOADING: 'Loading',
          LOAD_ERROR: 'Loading error',
        }
      }
    },
    fr: {
      nav: {
        apps: 'Applications',
        home: 'Accueil',
        drive: 'Drive',
        notes: 'Notes',
        videos: 'Vidéos',
        chat: 'Chat',
        notifications: 'Notifications',
        uploads: 'Téléchargements',
        settings: 'Paramètres',
      },
      download: {
        downloads: 'Téléchargements',
        add: 'Ajouter',
        delete_all: 'Vider la liste des téléchargements',
        status: {
          INIT: 'Initialisé',
          IDLE: 'En attente',
          PROCESSING_QUEUED: 'En file d’attente',
          PROCESSING: 'En traitement',
          PROCESSING_COMPLETE: 'Traitement terminé',
          PROCESSING_ERROR: 'Erreur de traitement',
          PROCESSING_REVERT_ERROR: 'Erreur lors de l’annulation du traitement',
          LOADING: 'Chargement',
          LOAD_ERROR: 'Erreur de chargement',
        }
      }
    },
  },
})

createInertiaApp({
  progress: { color: '#5468FF' },

  title: (title) => `${title} - ${appName}`,

  resolve: async (name) => {
    const page = await resolvePageComponent(
      `../pages/${name}.vue`,
      import.meta.glob<DefineComponent>('../pages/**/*.vue')
    )

    page.default.layout = page.default.layout || Layout
    return page
  },

  setup({ el, App, props, plugin }) {
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
