<script setup lang="ts">
  import { ref } from 'vue'

  const items = ref([
    { name: 'note 1', category: 'dev', date: '01/02/2025' },
    { name: 'note 2', category: 'idée', date: '01/02/2025' },
  ])
</script>

<template>
  <div
    class="flex-col hidden h-screen md:flex lg:border-r border-surface-200 dark:border-primary-600 w-100"
  >
    <Menubar class="rounded-none">
      <template #start> Notes </template>
      <template #end>
        <Button icon="pi pi-pen-to-square" />
      </template>
    </Menubar>

    <div class="flex flex-col">
      <div
        v-for="(item, index) in items"
        :key="index"
        class="relative flex flex-row p-2 hover:bg-surface-100 hover:dark:bg-surface-900"
        :class="{ 'border-t border-surface-200 dark:border-surface-700': index !== 0 }"
      >
        <div class="flex flex-col items-start">
          <span class="text-lg">{{ item.category }}</span>
          <div class="text-sm text-surface-500 dark:text-surface-400">
            {{ item.date }} {{ item.name }}
          </div>
          <a href="#" class="absolute inset-0"></a>
        </div>
      </div>
    </div>
  </div>
  <slot />
</template>
