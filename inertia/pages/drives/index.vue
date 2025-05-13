<template>
  <Head :title="$t('drive.title')" />

  <div class="flex flex-col w-full h-screen">
    <div class="w-full h-full">
      <Menubar class="sticky top-0 border-0 rounded-none z-100 bg-surface-100 dark:bg-surface-900">
        <template #start> {{ $t('drive.title') }} </template>
        <template #end>
          <SplitButton icon="pi pi-plus" @click=" () => uploadStore.browse()" :model="itemsAdd" />
        </template>
      </Menubar>

      <ContextMenu global :model="itemsMenu" />

      <div
        class="grid grid-cols-2 p-8 gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
      >
        <template v-for="document in documents" :key="document.id">
          <File :id="document.id" :name="document.name" :image="document.thumbnail" :details="bytes(document.size)" type="folder" v-if="document.isFolder" />
          <File :id="document.id" :name="document.name" :image="document.thumbnail" :details="bytes(document.size)" type="pdf" v-else-if="document.isPdf" />
          <File :id="document.id" :name="document.name" :image="document.thumbnail" :details="bytes(document.size)" type="word" v-else-if="document.isWord" />
          <File :id="document.id" :name="document.name" :image="document.thumbnail" :details="bytes(document.size)" type="excel" v-else-if="document.isExcel" />
          <File :id="document.id" :name="document.name" :image="document.thumbnail" :details="bytes(document.size)" type="video" v-else-if="document.isVideo" />
          <File :id="document.id" :name="document.name" :image="document.thumbnail" :details="bytes(document.size)" type="audio" v-else-if="document.isAudio" />
          <File :id="document.id" :name="document.name" :image="document.thumbnail" :details="bytes(document.size)" type="image" v-else-if="document.isImage" />
          <File :id="document.id" :name="document.name" :image="document.thumbnail" :details="bytes(document.size)" type="zip" v-else-if="document.isZip" />
          <File :id="document.id" :name="document.name" :image="document.thumbnail" :details="bytes(document.size)" type="rar" v-else-if="document.isRar" />
          <File :id="document.id" :name="document.name" :image="document.thumbnail" :details="bytes(document.size)" type="file" v-else />
        </template>
      </div>
    </div>
  </div>

  <Dialog v-model:visible="showCreateFolderModal" modal :header="$t('drive.create.folder.title')" :style="{ width: '50vw' }">
    <div class="flex flex-col gap-4">
      <div class="field">
        <label for="folderName" class="block mb-2">{{ $t('drive.create.folder.name') }}</label>
        <InputText id="folderName" v-model="folderName" class="w-full" @keyup.enter="createFolder" />
      </div>
    </div>
    <template #footer>
      <Button :label="$t('drive.create.folder.cancel')" icon="pi pi-times" @click="showCreateFolderModal = false" class="p-button-text" />
      <Button :label="$t('drive.create.folder.submit')" icon="pi pi-check" @click="createFolder" autofocus />
    </template>
  </Dialog>
</template>

<script setup lang="ts">
import type DrivesController from '#controllers/drives_controller'

import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { Head, router } from '@inertiajs/vue3'
import { InferPageProps } from '@adonisjs/inertia/types'
import bytes from 'bytes'
import File from '@/drive/file.vue'
import { useActionStore } from '~/stores/actionStore'
import { useUploadStore } from '~/stores/uploadStore'
import { tuyau } from '~/settings/tuyau'

defineProps<{
  documents: InferPageProps<DrivesController, 'index'>['documents'],
}>()

const uploadStore = useUploadStore()
const actionStore = useActionStore()
actionStore.set([{
  label: 'Add',
  icon: 'pi pi-plus',
  href: '/'
}])

const { t } = useI18n()

const showCreateFolderModal = ref(false)
const folderName = ref('')

const createFolder = () => {
  router.post(tuyau.drive.$url(), {
    name: folderName.value,
    parentId: null
  })
  showCreateFolderModal.value = false
  folderName.value = ''
}

const itemsAdd = ref([
  {
    label: t('drive.menu.add.folder'),
    command: () => {
      showCreateFolderModal.value = true
    }
  },
  {
    label: t('drive.menu.add.youtube'),
    command: () => {
      uploadStore.browse()
    }
  },
  {
    label: t('drive.menu.add.note'),
    command: () => {
      uploadStore.browse()
    }
  },
])

const itemsMenu = ref([
  {
    label: 'Add',
    icon: 'pi pi-plus',
    command: () => {
      uploadStore.browse()
    },
    items: [
      ...itemsAdd.value
    ]
  },
])
</script>
