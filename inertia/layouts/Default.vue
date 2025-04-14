<template>
  <div class="flex items-start h-full">
    <Toast />
    <ConfirmDialog />
    <Navbar />
    <input type="file" id="uploads" multiple class="hidden" />
    <slot />
  </div>
</template>

<script setup lang="ts">
import Navbar from '~/components/layouts/Navbar.vue'
</script>
