<script setup lang="ts">
  import Navbar from '@/layouts/navbar.vue'
</script>

<template>
  <div class="flex items-start h-full gap-6">
    <Navbar />
    <div class="flex flex-col w-full h-screen md:justify-center item-center">
      <slot />
    </div>
  </div>
</template>
