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
        <div class="grid grid-cols-5 gap-8 pt-3">
          <Link v-for="item in store.items" :href="item.href" :label="item.label" :icon="item.icon" variant="outlined" />
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
    class="sticky top-0 flex flex-col justify-between hidden w-auto h-screen p-5 lg:flex bg-surface-50 dark:bg-surface-900"
  >
    <div class="flex flex-col items-center w-12">
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center p-1 w-11 h-11">
          <Triforce />
        </div>
        <div class="hidden">Midona</div>
      </div>
      <div class="flex flex-col gap-2 mt-10">
        <Button
          @click="toggle"
          variant="text"
          as="a"
          href="/comment"
          icon="pi pi-th-large"
          severity="secondary"
          aria-label="th-large"
          v-tooltip="'Large'"
        />
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
            label="bell"
            v-tooltip="'Notifications'"
          />
        </OverlayBadge>

        <OverlayBadge value="4" size="small" severity="danger">
          <Link
            @click="uploads"
            variant="text"
            icon="pi pi-upload"
            severity="secondary"
            label="bell"
            v-tooltip="'Uploads'"
          />
        </OverlayBadge>

        <DrawerCustom
          v-model:visible="drawer"
          header="Downloads"
          position="right"
          class="!w-full md:!w-[30rem]"
        >
          <FilePond
            name="test"
            ref="pond"
            label-idle="Drop files here..."
            :allow-multiple="true"
            accepted-file-types="image/jpeg, image/png"
            server="/api"
            credits=""
          />
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
      <Link :href="tuyau.$route('settings').path" :label="$t('nav.settings')" :unstyled="true" class="flex items-center justify-center">
        <Avatar
          image="https://www.primefaces.org/cdn/primevue/images/landing/apps/main-avatar.png"
          size="large"
          shape="circle"
        />
      </Link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import vueFilePond from 'vue-filepond'
import { tuyau } from '~/settings/tuyau'
import Link from './Link.vue'
import DrawerCustom from '@/primevue/drawer/Drawer.vue'
import Triforce from '~/images/triforce.svg'
import { useActionsStore } from '~/stores/actions'

const store = useActionsStore()

const FilePond = vueFilePond()

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
</script>
