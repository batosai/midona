<template>
  <div class="flex items-start h-full">
    <Navbar />
    <slot />
  </div>
</template>

<script setup lang="ts">
  import Navbar from '~/components/layouts/Navbar.vue'
</script>
