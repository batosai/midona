<template>
  <div
    class="hover:cursor-pointer hover:dark:bg-primary-800 hover:bg-primary-100"
    @contextmenu.prevent="onImageRightClick"
  >
    <div
      class="relative aspect-[259/174.5] rounded-lg overflow-hidden flex items-center justify-center"
    >
      <template v-if="image">
        <img class="object-cover w-full h-full" :src="image" :alt="name" />
      </template>

      <template v-else>
        <span class="text-blue-300 text-8xl pi pi-folder" v-if="type == 'folder'"></span>
        <span class="text-8xl pi pi-image" v-if="type == 'image'"></span>
        <span class="text-red-600 text-8xl pi pi-video" v-if="type == 'video'"></span>
        <span class="text-red-500 text-8xl pi pi-file-pdf" v-if="type == 'pdf'"></span>
        <span class="text-blue-500 text-8xl pi pi-file-word" v-if="type == 'word'"></span>
        <span class="text-8xl pi pi-file" v-if="type == 'file'"></span>
        <span class="text-green-500 text-8xl pi pi-file-excel" v-if="type == 'excel'"></span>

        <span class="text-8xl! text-yellow-300 material-icons" v-if="type == 'zip' || type == 'rar'"
          >folder_zip</span
        >
        <span class="text-8xl! text-pink-300 material-icons" v-if="type == 'audio'"
          >audiotrack</span
        >
      </template>
    </div>
    <div class="flex items-start justify-between gap-1 mt-2">
      <div class="flex-1 px-2">
        <div class="font-medium leading-6 text-color line-clamp-1">{{ name }}</div>
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
  </div>

  <Dialog v-model:visible="displayFinder" header="Finder" :breakpoints="{ '960px': '50vw' }" :style="{ width: '40vw' }" :maximizable="true">
    <Tree :value="samples" />
  </Dialog>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useConfirm } from "primevue/useconfirm"
import { useToast } from "primevue/usetoast"

defineProps<{
  name?: string
  details?: string
  type: 'folder' | 'pdf' | 'word' | 'excel' | 'file' | 'video' | 'audio' | 'image' | 'zip' | 'rar'
  image?: string
}>()

const confirm = useConfirm()
const toast = useToast()
const displayFinder = ref(false)

const deleteConfirm = () => {
  confirm.require({
    message: 'Do you want to delete this record?',
    header: 'Danger Zone',
    icon: 'pi pi-info-circle',
    rejectLabel: 'Cancel',
    rejectProps: {
      label: 'Cancel',
      severity: 'secondary',
      outlined: true
    },
    acceptProps: {
      label: 'Delete',
      severity: 'danger'
    },
    accept: () => {
      toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Record deleted', life: 3000 });
    },
    reject: () => {
      toast.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
    }
  });
}

const menu = ref()
const items = ref([
  {
    label: 'Open',
    icon: 'pi pi-folder-open',
  },
  {
    label: 'Delete',
    icon: 'pi pi-trash',
    command: () => deleteConfirm()
  },
  {
    label: 'Move',
    icon: 'pi pi-file-export',
    command: () => displayFinder.value = true
  },
  {
    separator: true,
  },
  {
    label: 'Share',
    icon: 'pi pi-link',
  },
  {
    label: 'Info',
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
