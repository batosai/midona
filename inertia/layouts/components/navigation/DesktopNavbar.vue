<script setup lang="ts">
  import { ref } from 'vue'
  import { router } from '@inertiajs/vue3'
  import { tuyau } from '~/settings/tuyau'
  import Triforce from '~/images/triforce.svg'
  import Link from './Link.vue'
  import { useUploadDrawerStore } from '~/stores/uploadDrawerStore'
  import { useUploadStore } from '~/stores/uploadStore'

  const uploadDrawerStore = useUploadDrawerStore()
  const uploadStore = useUploadStore()

  const menu = ref()

  const toggleAccount = () => {
    menu.value.toggle(event)
  }

  const toggleApps = () => {
    alert('toggleApps')
  }

  const items = ref([
    {
      label: 'Administrator',
      items: [
        {
          label: 'Users',
          icon: 'pi pi-users',
        },
      ],
    },
    {
      label: 'Profile',
      items: [
        {
          label: 'Informations',
          icon: 'pi pi-user',
        },
        {
          label: 'Settings',
          icon: 'pi pi-cog',
          // url: tuyau.$route('settings').path
          command: () => router.visit(tuyau.$route('settings').path),
        },
        {
          separator: true,
        },
        {
          label: 'Logout',
          icon: 'pi pi-sign-out',
          command: () => router.delete(tuyau.auth.logout.$url()),
        },
      ],
    },
  ])
</script>

<template>
  <div
    class="sticky top-0 flex flex-col justify-between hidden w-auto h-screen p-5 sm:flex bg-surface-100 dark:bg-surface-900"
  >
    <div class="flex flex-col items-center w-12">
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center p-1 w-11 h-11">
          <Triforce />
        </div>
        <div class="hidden">Midona</div>
      </div>
      <div class="flex flex-col gap-6 mt-10">
        <Link @click="toggleApps" :label="$t('nav.apps')" icon="pi pi-th-large" />
        <Link href="/" :label="$t('nav.home')" icon="pi pi-home" />
        <Link :href="tuyau.drive.$url()" :label="$t('nav.drive')" icon="pi pi-folder-open" />
        <!-- <Link :href="tuyau.notes.$url()" :label="$t('nav.notes')" icon="pi pi-clipboard" />
        <Link :href="tuyau.videos.$url()" :label="$t('nav.videos')" icon="pi pi-video" /> -->
      </div>
    </div>
    <div class="flex flex-col items-center w-12">
      <div class="flex flex-col mt-10">
        <template v-if="uploadStore.files.length > 0">
          <OverlayBadge :value="uploadStore.files.length" size="small" severity="danger">
            <Link
              @click="uploadDrawerStore.open"
              variant="text"
              icon="pi pi-upload"
              severity="secondary"
              label="Uploads"
            />
          </OverlayBadge>

          <Divider />
        </template>
        <Link
          @click="toggleAccount"
          :label="$t('nav.settings')"
          :unstyled="true"
          class="flex items-center justify-center"
        >
          <Avatar
            image="https://www.primefaces.org/cdn/primevue/images/landing/apps/main-avatar.png"
            size="large"
            shape="circle"
          />
        </Link>
      </div>
    </div>
  </div>
  <Menu ref="menu" :model="items" :popup="true" />
</template>
