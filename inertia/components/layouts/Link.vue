<template>
  <Button @click="router.visit(url)" v-if="$page.url === url" :icon="icon" :aria-label="label" v-tooltip="label" />
  <Button variant="text" @click="router.visit(url)" v-else :icon="icon" severity="secondary" :aria-label="label" v-tooltip="label" />
</template>

<script setup lang="ts">
  import { router } from '@inertiajs/vue3'

  defineProps<{
    url: string,
    label: string,
    icon: string,
  }>()
</script>
