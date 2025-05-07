<template>
  <DrawerCustom
    v-model:visible="uploadDrawerStore.visible"
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

    <UploadItem
      v-for="(file, index) in uploadStore.files"
      :key="index"
      :file="file"
      :is-first="index === 0"
      :is-error="uploadStore.isError(file)"
      :is-processing="uploadStore.isProcessing(file)"
      :is-abort="uploadStore.isAbort(file)"
      :is-complete="uploadStore.isComplete(file)"
      @abort="uploadStore.abort(file)"
      @retry="uploadStore.load(file)"
      @remove="uploadStore.remove(file)"
    />
  </DrawerCustom>
</template>

<script setup lang="ts">
import DrawerCustom from '@/primevue/drawer/Drawer.vue'
import { useUploadStore } from '~/stores/uploadStore'
import { useUploadDrawerStore } from '~/stores/uploadDrawerStore'
import UploadItem from './UploadItem.vue'

const uploadStore = useUploadStore()
const uploadDrawerStore = useUploadDrawerStore()
</script>
