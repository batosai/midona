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

  const getBasePath = (url: string) => {
    try {
      const urlObj = new URL(url)
      return urlObj.pathname
    } catch {
      return url
    }
  }

  const handleClick = (event: MouseEvent) => {
    emit('click', event)

    if (props.href) {
      router.visit(props.href)
    }
  }
</script>

<template>
  <Button
    @click="handleClick"
    :severity="
      href && (href === '/' ? $page.url === '/' : $page.url.includes(getBasePath(href)))
        ? ''
        : 'secondary'
    "
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
