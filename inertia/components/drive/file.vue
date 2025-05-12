<template>

  <Card class="group hover:bg-surface-100 hover:dark:bg-surface-800" @contextmenu.prevent="onImageRightClick" pt:body:class="p-0">
    <template #header>
      <div
        class="cursor-pointer relative aspect-[259/174.5] overflow-hidden flex items-center justify-center p-4"
      >
        <template v-if="image">
          <img class="object-cover w-full h-full" :src="image" :alt="name" />
        </template>

        <template v-else>
          <span class="text-6xl text-blue-300 pi pi-folder" v-if="type == 'folder'"></span>
          <span class="text-6xl pi pi-image" v-if="type == 'image'"></span>
          <span class="text-6xl text-red-600 pi pi-video" v-if="type == 'video'"></span>
          <span class="text-6xl text-red-500 pi pi-file-pdf" v-if="type == 'pdf'"></span>
          <span class="text-6xl text-blue-500 pi pi-file-word" v-if="type == 'word'"></span>
          <span class="text-6xl pi pi-file" v-if="type == 'file'"></span>
          <span class="text-6xl text-green-500 pi pi-file-excel" v-if="type == 'excel'"></span>

          <span class="text-6xl! text-yellow-300 material-icons" v-if="type == 'zip' || type == 'rar'"
            >folder_zip</span
          >
          <span class="text-6xl! text-pink-300 material-icons" v-if="type == 'audio'"
            >audiotrack</span
          >
        </template>

        <Tag class="absolute z-10 top-2 right-2 group-hover:dark:bg-surface-900 group-hover:bg-surface-0" severity="secondary" :value="type" />
        <a href="#" class="absolute inset-0"></a>
      </div>
    </template>
    <template #content>
      <div class="flex items-start justify-between gap-1 p-2">
        <div class="flex-1 px-2 min-w-0">
          <div class="font-medium leading-6 text-color truncate">{{ name }}</div>
          <div class="mt-1 text-sm leading-5 text-muted-color">{{ details }}</div>
        </div>
        <Button
          icon="pi pi-ellipsis-v"
          severity="secondary"
          variant="text"
          rounded
          @click="toggle"
          aria-label="Bookmark"
        />
        <TieredMenu ref="menu" id="overlay_tmenu" :model="items" popup />
      </div>
    </template>
  </Card>

  <Dialog v-model:visible="displayFinder" header="Finder" :breakpoints="{ '960px': '50vw' }" :style="{ width: '40vw' }" :maximizable="true">
    <Tree :value="samples" />
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"
import { router } from '@inertiajs/vue3'
import { useI18n } from 'vue-i18n'
import { tuyau } from '~/settings/tuyau'

const props = defineProps<{
  id: string
  name?: string
  details?: string | null
  type?: 'folder' | 'pdf' | 'word' | 'excel' | 'file' | 'video' | 'audio' | 'image' | 'zip' | 'rar'
  image?: string
}>()

const { t } = useI18n()
const confirm = useConfirm()
const toast = useToast()
const displayFinder = ref(false)

const deleteConfirm = () => {
  confirm.require({
    message: t('drive.file.delete.message'),
    header: t('drive.file.delete.title'),
    icon: 'pi pi-info-circle',
    rejectLabel: t('drive.file.delete.cancel'),
    rejectProps: {
      label: t('drive.file.delete.cancel'),
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: t('drive.file.delete.confirm'),
      severity: 'danger'
    },
    accept: () => {
      router.delete(tuyau.drive({ id: props.id }).$url())
    },
    reject: () => {
      toast.add({ severity: 'error', summary: t('drive.file.delete.summary.error'), detail: t('drive.file.delete.error'), life: 3000 })
    }
  });
}

const menu = ref()
const items = ref([
  {
    label: t('drive.file.menu.open'),
    icon: 'pi pi-folder-open',
  },
  {
    label: t('drive.file.menu.delete'),
    icon: 'pi pi-trash',
    command: () => deleteConfirm()
  },
  {
    label: t('drive.file.menu.move'),
    icon: 'pi pi-file-export',
    command: () => displayFinder.value = true
  },
  {
    separator: true,
  },
  {
    label: t('drive.file.menu.share'),
    icon: 'pi pi-link',
  },
  {
    label: t('drive.file.menu.info'),
    icon: 'pi pi-info-circle',
  },
])

const samples = ref([
{
                    key: '0',
                    label: 'Documents',
                    data: 'Documents Folder',
                    icon: 'pi pi-fw pi-inbox',
                    children: [
                        {
                            key: '0-0',
                            label: 'Work',
                            data: 'Work Folder',
                            icon: 'pi pi-fw pi-cog',
                            children: [
                                { key: '0-0-0', label: 'Expenses.doc', icon: 'pi pi-fw pi-file', data: 'Expenses Document' },
                                { key: '0-0-1', label: 'Resume.doc', icon: 'pi pi-fw pi-file', data: 'Resume Document' }
                            ]
                        },
                        {
                            key: '0-1',
                            label: 'Home',
                            data: 'Home Folder',
                            icon: 'pi pi-fw pi-home',
                            children: [{ key: '0-1-0', label: 'Invoices.txt', icon: 'pi pi-fw pi-file', data: 'Invoices for this month' }]
                        }
                    ]
                },
                {
                    key: '1',
                    label: 'Events',
                    data: 'Events Folder',
                    icon: 'pi pi-fw pi-calendar',
                    children: [
                        { key: '1-0', label: 'Meeting', icon: 'pi pi-fw pi-calendar-plus', data: 'Meeting' },
                        { key: '1-1', label: 'Product Launch', icon: 'pi pi-fw pi-calendar-plus', data: 'Product Launch' },
                        { key: '1-2', label: 'Report Review', icon: 'pi pi-fw pi-calendar-plus', data: 'Report Review' }
                    ]
                },
])

const toggle = (event: any) => {
  menu.value.toggle(event)
}

const onImageRightClick = (event: any) => {
  event.stopPropagation()
  menu.value.show(event)
}


</script>
