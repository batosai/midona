<script setup lang="ts">
  import type { MenuPlacement, TooltipPlacement } from 'vidstack'

  import CaptionSubmenu from '../menus/CaptionSubmenu.vue'
  import Menu from '../menus/Menu.vue'

  const { placement, tooltipPlacement } = defineProps<{
    placement: MenuPlacement
    tooltipPlacement: TooltipPlacement
  }>()
</script>

<template>
  <Menu :placement="placement" :tooltip-placement="tooltipPlacement">
    <template #button>
      <media-icon
        class="h-8 w-8 transform transition-transform duration-200 ease-out group-data-open:rotate-90"
        type="settings"
      />
    </template>
    <template #content>
      <CaptionSubmenu />
    </template>
    <template #tooltip-content>
      <span>Settings</span>
    </template>
  </Menu>
</template>
