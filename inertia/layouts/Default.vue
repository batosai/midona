<template>
  <div class="flex items-start h-full">
    <FlashMessages />
    <ConfirmDialog />
    <Navbar />
    <input type="file" id="uploads" multiple class="hidden" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import Navbar from '~/components/layouts/Navbar.vue'
import FlashMessages from '~/components/FlashMessages.vue'
import ConfirmDialog from 'primevue/confirmdialog'
</script>
