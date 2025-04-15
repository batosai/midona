<template>

  <div class="lg:hidden! fixed! bottom-4 left-4 z-2!">
    <OverlayBadge value="4" size="small" severity="danger" v-if="4===4">
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

    <Drawer v-model:visible="visibleBottom" header="Bottom Drawer" position="bottom" style="height: auto" class="p-0">
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
          <Link v-for="item in store.items" rounded :href="item.href" size="small" :label="item.label" :icon="item.icon" variant="outlined" />
        </div>
      </template>
      <div class="grid grid-cols-5 gap-8 pt-3">
        <Link :href="tuyau.$route('home').path" @click="visibleBottom=false" :label="$t('nav.home')" icon="pi pi-home" />
        <Link :href="tuyau.$route('drive').path" @click="visibleBottom=false" :label="$t('nav.drive')" icon="pi pi-folder-open" />
        <Link :href="tuyau.$route('notes').path" @click="visibleBottom=false" :label="$t('nav.notes')" icon="pi pi-clipboard" />
        <Link :href="tuyau.$route('videos').path" @click="visibleBottom=false" :label="$t('nav.videos')" icon="pi pi-video" />

        <OverlayBadge value="4" class="w-10" size="small" severity="danger">
          <Link
            @click="uploads"
            icon="pi pi-upload"
            label="bell"
            v-tooltip="'Uploads'"
          />
        </OverlayBadge>
      </div>
    </Drawer>
  </div>

  <div
    class="sticky top-0 flex flex-col justify-between hidden w-auto h-screen p-5 lg:flex bg-surface-100 dark:bg-surface-900"
  >
    <div class="flex flex-col items-center w-12">
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center p-1 w-11 h-11">
          <Triforce />
        </div>
        <div class="hidden">Midona</div>
      </div>
      <div class="flex flex-col gap-6 mt-10">
        <Link @click="toggle" :label="$t('nav.apps')" icon="pi pi-th-large" />
        <Link :href="tuyau.$route('home').path" :label="$t('nav.home')" icon="pi pi-home" />
        <Link :href="tuyau.$route('drive').path" :label="$t('nav.drive')" icon="pi pi-folder-open" />
        <Link :href="tuyau.$route('notes').path" :label="$t('nav.notes')" icon="pi pi-clipboard" />
        <Link :href="tuyau.$route('videos').path" :label="$t('nav.videos')" icon="pi pi-video" />
      </div>
    </div>
    <div class="flex flex-col items-center w-12">
      <div class="flex flex-col gap-2 mt-10">
        <OverlayBadge value="4" size="small" severity="danger">
          <Link
            @click="toggle"
            variant="text"
            icon="pi pi-bell"
            severity="secondary"
            label="Notifications"
          />
        </OverlayBadge>

        <OverlayBadge :value="uploadStore.files.length" size="small" severity="danger">
          <Link
            @click="uploads"
            variant="text"
            icon="pi pi-upload"
            severity="secondary"
            label="Uploads"
          />
        </OverlayBadge>

        <DrawerCustom
          v-model:visible="drawer"
          position="right"
          class="!w-full md:!w-[30rem]"
        >
          <template #header>
            <div class="flex items-center gap-2">
              <h1 class="text-xl">{{ $t('download.downloads') }}</h1>
              <Button :label="$t('download.add')" icon="pi pi-plus" text @click="uploadStore.browse" />
            </div>
          </template>
          <template #footer v-if="uploadStore.files.length">
            <div class="flex items-center gap-2">
              <Button :label="$t('download.delete_all')" icon="pi pi-trash" severity="danger" text @click="uploadStore.clear()" class="flex-auto"></Button>
            </div>
          </template>

          <div
            v-for="(file, index) in uploadStore.files"
            :key="index"
            class="relative flex flex-row p-2 hover:bg-surface-100 hover:dark:bg-surface-900"
            :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }"
          >
            <div class="w-full">
              <span class="text-lg">{{ file.filename }}</span>
              <div
                class="text-sm"
                :class="{
                  'text-red-800' : uploadStore.isError(file),
                  'dark:text-red-800' : uploadStore.isError(file),
                  'text-surface-500' : !uploadStore.isError(file),
                  'dark:text-surface-400' : !uploadStore.isError(file),
                }">
                {{ $t(`download.status.${file.statusLabel}`) }} - {{ bytes(file.fileSize) }}
              </div>
              <div class="flex items-center gap-2">
                <ProgressBar :mode="file.progress === undefined ? 'indeterminate' : 'determinate'" :value="file.progress" :showValue="false" class="w-full h-2" />
                <div>
                  <Button icon="pi pi-times-circle" text @click="uploadStore.abord(file)" v-if="uploadStore.isProcessing(file) && !uploadStore.isAbort(file)" />
                  <Button icon="pi pi-refresh" text @click="uploadStore.load(file)" v-if="uploadStore.isAbort(file)" />
                </div>
                <div>
                  <Button icon="pi pi-trash" text @click="uploadStore.remove(file)" v-if="uploadStore.isComplete(file) || uploadStore.isAbort(file) || uploadStore.isError(file)" />
                </div>
              </div>
            </div>
          </div>
        </DrawerCustom>

        <Popover ref="op">
          <div class="flex flex-col gap-4">
            <div>
              <span class="block mb-2 font-medium">Team Members</span>
              <ul class="flex flex-col p-0 m-0 list-none">
                <li
                  v-for="member in members"
                  :key="member.name"
                  class="flex items-center gap-2 px-2 py-3 cursor-pointer hover:bg-emphasis rounded-border"
                  @click="selectMember(member)"
                >
                  <img
                    :src="`https://primefaces.org/cdn/primevue/images/avatar/${member.image}`"
                    style="width: 32px"
                  />
                  <div>
                    <span class="font-medium">{{ member.name }}</span>
                    <div class="text-sm text-surface-500 dark:text-surface-400">
                      {{ member.email }}
                    </div>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </Popover>
      </div>
      <Divider />
      <Link @click="toggleAccount" :label="$t('nav.settings')" :unstyled="true" class="flex items-center justify-center">
        <Avatar
          image="https://www.primefaces.org/cdn/primevue/images/landing/apps/main-avatar.png"
          size="large"
          shape="circle"
        />
      </Link>

      <Menu ref="menu" :model="items" :popup="true" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { router } from '@inertiajs/vue3'
import { tuyau } from '~/settings/tuyau'
import Link from './Link.vue'
import DrawerCustom from '@/primevue/drawer/Drawer.vue'
import Triforce from '~/images/triforce.svg'
import { useActionStore } from '~/stores/actionStore'
import { useUploadStore } from '~/stores/uploadStore'
import Divider from 'primevue/divider'
import bytes from 'bytes'

const store = useActionStore()
const uploadStore = useUploadStore()

const visibleBottom = ref(false)

const op = ref()
const drawer = ref(false)
const selectedMember = ref(null)
const members = ref([
  { name: 'Amy Elsner', image: 'amyelsner.png', email: 'amy@email.com', role: 'Owner' },
  {
    name: 'Bernardo Dominic',
    image: 'bernardodominic.png',
    email: 'bernardo@email.com',
    role: 'Editor',
  },
  { name: 'Ioni Bowcher', image: 'ionibowcher.png', email: 'ioni@email.com', role: 'Viewer' },
])

const menu = ref()
const items = ref([
  {
    label: 'Administrator',
    items: [
      {
        label: 'Users',
        icon: 'pi pi-users'
      },
    ]
  },
  {
    label: 'Profile',
    items: [
      {
        label: 'Informations',
        icon: 'pi pi-user'
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        // url: tuyau.$route('settings').path
        command: () => router.visit(tuyau.$route('settings').path)
      },
      {
        separator: true
      },
      {
        label: 'Logout',
        icon: 'pi pi-sign-out'
      }
    ]
    }
])

const toggleAccount = (event) => {
    menu.value.toggle(event);
}

const toggle = (event: any) => {
  event.preventDefault()
  op.value.toggle(event)
}

const uploads = (event: any) => {
  event.preventDefault()
  drawer.value = true
}

const selectMember = (member: any) => {
  selectedMember.value = member
  op.value.hide()
}

onMounted(() => {
  uploadStore.init()
})

</script>
