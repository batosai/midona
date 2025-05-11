<template>
  <Head title="Drive" />

  <div class="flex flex-col w-full h-screen">
    <div class="w-full h-full">
      <Menubar class="sticky top-0 border-0 rounded-none z-100 bg-surface-100 dark:bg-surface-900">
        <template #start> Drive </template>
        <template #end>
          <SplitButton icon="pi pi-plus" @click="uploadStore.browse" :model="itemsAdd" />
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
</template>

<script setup lang="ts">
import type DrivesController from '#controllers/drives_controller'

import { ref } from 'vue'
import { Head } from '@inertiajs/vue3'
import { InferPageProps } from '@adonisjs/inertia/types'
import bytes from 'bytes'
import File from '@/drive/file.vue'
import { useActionStore } from '~/stores/actionStore'
import { useUploadStore } from '~/stores/uploadStore'

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

const itemsAdd = ref([
  {
    label: 'Répertoire',
    command: () => {
      uploadStore.browse()
    }
  },
  {
    label: 'Youtube',
    command: () => {
      uploadStore.browse()
    }
  },
  {
    label: 'Note',
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
