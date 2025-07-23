<script setup lang="ts">
  import bytes from 'bytes'

  defineProps<{
    file: any
    isFirst: boolean
    isError: boolean
    isProcessing: boolean
    isAbort: boolean
    isComplete: boolean
  }>()

  defineEmits<{
    (e: 'abort'): void
    (e: 'retry'): void
    (e: 'remove'): void
  }>()
</script>

<template>
  <div
    class="relative flex flex-row p-2 hover:bg-surface-100 hover:dark:bg-surface-900"
    :class="{ 'border-t border-surface-200 dark:border-surface-700': !isFirst }"
  >
    <div class="w-full">
      <span class="text-lg">{{ file.filename }}</span>
      <div
        class="text-sm"
        :class="{
          'text-red-800': isError,
          'dark:text-red-800': isError,
          'text-surface-500': !isError,
          'dark:text-surface-400': !isError,
        }"
      >
        {{ $t(`download.status.${file.statusLabel}`) }} - {{ bytes(file.fileSize) }}
      </div>
      <div class="flex items-center gap-2">
        <ProgressBar
          :mode="file.progress === undefined ? 'indeterminate' : 'determinate'"
          :value="file.progress"
          :showValue="false"
          class="w-full h-2"
        />
        <div>
          <Button
            icon="pi pi-times-circle"
            text
            @click="$emit('abort')"
            v-if="isProcessing && !isAbort"
          />
          <Button icon="pi pi-refresh" text @click="$emit('retry')" v-if="isAbort" />
        </div>
        <div>
          <Button
            icon="pi pi-trash"
            text
            @click="$emit('remove')"
            v-if="isComplete || isAbort || isError"
          />
        </div>
      </div>
    </div>
  </div>
</template>
