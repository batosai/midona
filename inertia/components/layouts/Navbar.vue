<template>
  <SpeedDial
    :model="items"
    :radius="180"
    direction="up"
    class="fixed! lg:hidden! bottom-4 left-4 z-2!"
  />

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
        <Link :url="tuyau.$route('home').path" :label="$t('nav.home')" icon="pi pi-home" />
        <Link :url="tuyau.$route('drive').path" :label="$t('nav.drive')" icon="pi pi-folder-open" />
        <Link :url="tuyau.$route('notes').path" :label="$t('nav.notes')" icon="pi pi-clipboard" />
        <Button
          variant="text"
          as="a"
          href="/comment"
          icon="pi pi-inbox"
          severity="secondary"
          aria-label="Inbox"
          v-tooltip="'Inbox'"
        />
        <Button
          variant="text"
          as="a"
          href="/mediatheque"
          icon="pi pi-images"
          severity="secondary"
          aria-label="Médiathèque"
          v-tooltip="'Médiathèque'"
        />
        <Link :url="tuyau.$route('videos').path" :label="$t('nav.videos')" icon="pi pi-video" />
      </div>
    </div>
    <div class="flex flex-col items-center w-12">
      <div class="flex flex-col gap-2 mt-10">
        <OverlayBadge value="4" size="small" severity="danger">
          <Button
            @click="toggle"
            variant="text"
            as="a"
            icon="pi pi-bell"
            severity="secondary"
            aria-label="bell"
            v-tooltip="'Notifications'"
          />
        </OverlayBadge>

        <OverlayBadge value="4" size="small" severity="danger">
          <Button
            @click="uploads"
            variant="text"
            as="a"
            icon="pi pi-upload"
            severity="secondary"
            aria-label="bell"
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

        <Button
          variant="text"
          as="a"
          href="/chat"
          icon="pi pi-comment"
          severity="secondary"
          aria-label="Chat"
          v-tooltip="'Chat'"
        />

        <Link :url="tuyau.$route('settings').path" :label="$t('nav.settings')" icon="pi pi-cog" />
      </div>
      <Divider />
      <div class="flex items-center justify-center">
        <Avatar
          image="https://www.primefaces.org/cdn/primevue/images/landing/apps/main-avatar.png"
          size="large"
          shape="circle"
        />
      </div>
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

const FilePond = vueFilePond()

const items = ref([
  { label: 'Comment', url: '/', icon: 'pi pi-comment' },
  { label: 'Médiathèque', url: '/mediatheque', icon: 'pi pi-images' },
  { label: 'Inbox', url: '/inbox', icon: 'pi pi-inbox' },
  { label: 'User', url: '/user', icon: 'pi pi-user' },
  { label: 'Video', url: '/video', icon: 'pi pi-video' },
  { label: 'Large', url: '/', icon: 'pi pi-th-large' },
  { label: 'Cog', url: '/cog', icon: 'pi pi-cog' },
])

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
