<template>
  <media-slider-chapters class="relative flex h-full w-full items-center rounded-[1px]">
    <template>
      <!-- Chapter -->
      <div
        class="chapter last-child:mr-0 relative mr-0.5 flex h-full w-full items-center rounded-[1px]"
      >
        <!-- Track -->
        <div
          class="ring-media-focus relative z-0 h-[5px] w-full rounded-xs bg-white/30 group-data-focus:ring-[3px]"
        >
          <div
            class="bg-media-brand absolute h-full w-[var(--chapter-fill)] rounded-xs will-change-[width]"
          />
          <div
            class="absolute z-10 h-full w-[var(--chapter-progress)] rounded-xs bg-white/50 will-change-[width]"
          />
        </div>
      </div>
    </template>
  </media-slider-chapters>
</template>

<style scoped>
  .chapter {
    contain: layout style;
  }

  .track {
    contain: strict;
  }
</style>
