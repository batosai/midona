<script setup lang="ts">
  import { ref, watch } from 'vue'
  import { useI18n } from 'vue-i18n'
  import { tuyau } from '~/settings/tuyau'
  import type { TreeSelectionKeys } from 'primevue/tree'
  import type DocumentDto from '#dtos/document'

  interface FolderNode {
    key: string
    name: string
    children: FolderNode[]
    data: DocumentDto
    leaf: boolean
    expanded: boolean
  }

  const props = defineProps<{
    visible: boolean
    documentId: string
  }>()

  const emit = defineEmits<{
    (e: 'update:visible', value: boolean): void
  }>()

  const { t } = useI18n()

  const folders = ref<FolderNode[]>([
    {
      key: 'root',
      name: 'root',
      children: [],
      data: { id: null, name: 'root' } as unknown as DocumentDto,
      leaf: false,
      expanded: true,
    },
  ])
  const selectedFolder = ref<TreeSelectionKeys>({})
  const currentParentId = ref<string | null>(null)
  const currentFolderName = ref<string>('')
  const folderHistory = ref<Array<{ id: string | null; name: string }>>([])

  const loadFolders = async (parentId: string | null = null) => {
    try {
      const response = await tuyau.api.folders.$get({ query: { parentId: parentId || '' } })

      if (!response.data) {
        return []
      }

      const mappedFolders = response.data.map((folder: DocumentDto) => {
        return {
          key: folder.id,
          name: folder.name,
          children: [],
          data: folder,
          leaf: false,
          expanded: false,
        } as FolderNode
      })
      return mappedFolders
    } catch (error) {
      console.error('Error loading folders:', error)
      return []
    }
  }

  const onNodeSelect = (event: any) => {
    if (!event.data) return
    selectedFolder.value = { [event.data.id]: true }
  }

  const onNodeExpand = async (event: any) => {
    if (!event.data || !event.data.id) {
      return
    }

    event.loading = true
    try {
      const children = await loadFolders(event.data.id)

      const updateFolderChildren = (folders: FolderNode[]) => {
        for (const folder of folders) {
          if (folder.key === event.data.id) {
            folder.children = children
            folder.expanded = true
            return true
          }
          if (folder.children && folder.children.length > 0) {
            if (updateFolderChildren(folder.children)) {
              return true
            }
          }
        }
        return false
      }

      updateFolderChildren(folders.value)
    } catch (error) {
      console.error('Error loading children:', error)
    } finally {
      event.loading = false
    }
  }

  const goBack = async () => {
    const previousFolder = folderHistory.value.pop()
    if (previousFolder) {
      currentParentId.value = previousFolder.id
      currentFolderName.value = previousFolder.name
      await loadFolders(previousFolder.id)
    }
  }

  const close = () => {
    emit('update:visible', false)
    selectedFolder.value = {}
    currentParentId.value = null
    currentFolderName.value = ''
    folderHistory.value = []
  }

  const move = async () => {
    if (!selectedFolder.value) return

    try {
      const parentId =
        Object.keys(selectedFolder.value)[0] === 'root'
          ? 'root'
          : Object.keys(selectedFolder.value)[0]
      await tuyau.drive({ id: props.documentId }).$put({}, { query: { parentId } })
      close()
    } catch (error) {
      console.error('Error moving document:', error)
    }
  }

  watch(
    () => props.visible,
    async (newValue) => {
      if (newValue) {
        folders.value[0].children = await loadFolders()
      }
    }
  )
</script>

<template>
  <Dialog
    :visible="visible"
    @update:visible="emit('update:visible', $event)"
    modal
    :header="$t('drive.file.move.title')"
    :style="{ width: '50vw' }"
  >
    <div class="flex flex-col gap-4">
      <div class="flex items-center gap-2">
        <Button
          v-if="currentParentId"
          icon="pi pi-arrow-left"
          @click="goBack"
          class="p-button-text"
        />
        <span class="text-lg font-medium">{{ currentFolderName || t('drive.folder.title') }}</span>
      </div>
      <div class="field">
        <Tree
          v-model:selectionKeys="selectedFolder"
          :value="folders"
          selectionMode="single"
          :metaKeySelection="false"
          class="w-full"
          loadingMode="icon"
          @node-select="onNodeSelect"
          @node-expand="onNodeExpand"
        >
          <template #default="slotProps">
            <div class="flex items-center gap-2">
              <i class="pi pi-folder text-yellow-500"></i>
              <span>{{ slotProps.node.name }}</span>
            </div>
          </template>
        </Tree>
      </div>
    </div>
    <template #footer>
      <Button
        :label="$t('drive.file.move.cancel')"
        icon="pi pi-times"
        @click="close"
        class="p-button-text"
      />
      <Button
        :label="$t('drive.file.move.submit')"
        icon="pi pi-check"
        @click="move"
        :disabled="!selectedFolder"
        autofocus
      />
    </template>
  </Dialog>
</template>
