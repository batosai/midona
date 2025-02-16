<template>
  <Button
    @click="handleClick"
    :severity="$page.url === href ? '' : 'secondary'"
    :variant="variant"
    :icon="icon"
    :size="size"
    :aria-label="label"
    v-tooltip="label"
    :unstyled="unstyled"
    :class="{ 'cursor-pointer': unstyled }"
  >
    <slot />
  </Button>
</template>

<script setup lang="ts">
import { router } from '@inertiajs/vue3'

const emit = defineEmits(['click'])
const props = defineProps<{
  href?: string
  label: string
  icon?: string
  size?: 'small' | 'large'
  variant?: 'outlined' | 'text' | 'link'
  unstyled?: boolean
}>()

const handleClick = (event: MouseEvent) => {
  emit('click', event)

  if (props.href) {
    router.visit(props.href)
  }
}
</script>
