<script setup lang="ts">
  import { ref } from 'vue'
  import { tuyau } from '~/settings/tuyau'
  import { useActionStore } from '~/stores/actionStore'
  import { useUploadDrawerStore } from '~/stores/uploadDrawerStore'
  import { useUploadStore } from '~/stores/uploadStore'
  import Link from './Link.vue'
  import { router } from '@inertiajs/vue3'

  const store = useActionStore()
  const uploadDrawerStore = useUploadDrawerStore()
  const uploadStore = useUploadStore()
  const visibleBottom = ref(false)

  const menu = ref()

  const toggleAccount = () => {
    menu.value.toggle(event)
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
        },
      ],
    },
  ])
</script>

<template>
  <div class="sm:hidden! fixed! bottom-4 left-4 z-2!">
    <OverlayBadge
      :value="uploadStore.files.length"
      size="small"
      severity="danger"
      v-if="uploadStore.files.length != 0"
    >
      <Button
        @click="visibleBottom = true"
        rounded
        href="/comment"
        icon="pi pi-th-large"
        aria-label="th-large"
      />
    </OverlayBadge>
    <Button
      v-else
      @click="visibleBottom = true"
      rounded
      href="/comment"
      icon="pi pi-th-large"
      aria-label="th-large"
    />

    <Drawer v-model:visible="visibleBottom" position="bottom" style="height: auto" class="p-0">
      <template #header>
        <div>
          <Link @click="toggleAccount" :label="$t('nav.settings')" :unstyled="true">
            <Avatar
              image="https://www.primefaces.org/cdn/primevue/images/landing/apps/main-avatar.png"
              shape="circle"
              size="large"
            />
          </Link>
        </div>
        <Divider layout="vertical" v-if="store.items.length" />
        <div class="grid grid-cols-5 gap-8">
          <Link
            v-for="item in store.items"
            :key="item.href"
            :href="item.href"
            :label="item.label"
            :icon="item.icon"
            variant="outlined"
            rounded
            size="small"
          />
        </div>
      </template>
      <div class="grid grid-cols-5 gap-8 pt-3">
        <Link
          :href="tuyau.$route('home').path"
          :label="$t('nav.home')"
          icon="pi pi-home"
          @click="visibleBottom = false"
        />
        <Link
          :href="tuyau.$route('drive').path"
          :label="$t('nav.drive')"
          icon="pi pi-folder-open"
          @click="visibleBottom = false"
        />
        <Link
          :href="tuyau.$route('notes').path"
          :label="$t('nav.notes')"
          icon="pi pi-clipboard"
          @click="visibleBottom = false"
        />
        <Link
          :href="tuyau.$route('videos').path"
          :label="$t('nav.videos')"
          icon="pi pi-video"
          @click="visibleBottom = false"
        />

        <OverlayBadge :value="uploadStore.files.length" class="w-10" size="small" severity="danger">
          <Link
            @click="uploadDrawerStore.open"
            icon="pi pi-upload"
            label="bell"
            v-tooltip="'Uploads'"
          />
        </OverlayBadge>
      </div>
    </Drawer>

    <Menu ref="menu" :model="items" :popup="true" />
  </div>
</template>
