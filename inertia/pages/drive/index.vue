<template>
  <Head title="Videos" />

  <div class="flex flex-col w-full h-screen">
    <div class="w-full h-full">
      <Menubar class="sticky top-0 border-0 rounded-none z-100 bg-surface-100 dark:bg-surface-900">
        <template #start> Drive </template>
        <template #end>
          <SplitButton icon="pi pi-plus" @click="uploadStore.browse" :model="itemsAdd" />
        </template>
      </Menubar>

      <Breadcrumb :home="home" :model="items" />

      <ContextMenu global :model="itemsMenu" />

      <div
        class="grid grid-cols-2 p-8 gap-x-6 gap-y-10 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8"
      >
        <File name="Documents" type="folder" />
        <File name="file.pdf" details="40 Ko" type="pdf" />
        <File name="file.mp4" details="4 Go" type="video" />
        <File name="file.mp3" details="3 Mo" type="audio" />
        <File name="file.docx" details="500 Ko" type="word" />
        <File
          name="file.png"
          details="800 Ko"
          type="image"
          image="https://www.primefaces.org/cdn/primevue/images/landing/apps/movie-cover7.png"
        />
        <File name="file.xlsx" details="1 Mo" type="excel" />
        <File name="file.txt" details="20 ko" type="file" />
        <File name="file.zip" details="40 Mo" type="zip" />
        <File name="image.jpeg" details="4 Mo" type="image" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import File from '@/drive/file.vue'
import { useActionStore } from '~/stores/actionStore'
import { useUploadStore } from '~/stores/uploadStore'

const uploadStore = useUploadStore()
const store = useActionStore()
store.set([{
  label: 'Add',
  icon: 'pi pi-plus',
  href: '/'
}])

const home = ref({
  icon: 'pi pi-home',
})
const items = ref([
  { label: 'Electronics' },
  { label: 'Computer' },
  { label: 'Accessories' },
  { label: 'Keyboard' },
  { label: 'Wireless' },
])

const itemsAdd = ref([
  {
    label: 'Répertoire',
    command: () => {
      uploadStore.browse()
    }
  },
  {
    label: 'Youtude',
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
  { label: 'Add', icon: 'pi pi-plus' },
])
</script>
