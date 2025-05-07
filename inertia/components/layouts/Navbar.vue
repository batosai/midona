<template>
  <DesktopNavbar />
  <MobileNavbar />
  <UploadDrawer />
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import UploadDrawer from '../upload/UploadDrawer.vue'
import { useUploadStore } from '~/stores/uploadStore'
import DesktopNavbar from '../navigation/DesktopNavbar.vue'
import MobileNavbar from '../navigation/MobileNavbar.vue'

const uploadStore = useUploadStore()

onMounted(() => {
  uploadStore.init()
})
</script>
