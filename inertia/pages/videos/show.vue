<template>
  <div class="m-4 mx-auto w-300">
    <media-player
      class="w-full aspect-video bg-slate-900 text-white font-sans overflow-hidden rounded-md ring-media-focus data-[focus]:ring-4"
      title="Sprite Fight"
      src="https://files.vidstack.io/sprite-fight/720p.mp4"
      crossOrigin
      playsInline
      @provider-change="onProviderChange"
      @can-play="onCanPlay"
      ref="$player"
    >
      <media-provider>
        <media-poster
          class="absolute inset-0 block h-full w-full rounded-md opacity-0 transition-opacity data-[visible]:opacity-100 [&>img]:h-full [&>img]:w-full [&>img]:object-cover"
          src="https://files.vidstack.io/sprite-fight/poster.webp"
          alt="Girl walks into campfire with gnomes surrounding her friend ready for their next meal!"
        />
      </media-provider>

      <VideoLayout thumbnails="https://files.vidstack.io/sprite-fight/thumbnails.vtt" />
    </media-player>
  </div>
</template>

<script setup lang="ts">
import 'vidstack/player/styles/base.css'

import 'vidstack/player'
import 'vidstack/player/ui'
import 'vidstack/icons'

import { isHLSProvider, type MediaCanPlayEvent, type MediaProviderChangeEvent } from 'vidstack'
import type { MediaPlayerElement } from 'vidstack/elements'
import { onMounted, ref } from 'vue'

import VideoLayout from '@/vidstack/layouts/VideoLayout.vue'
import type { TextTrackInit } from 'vidstack'

const $player = ref<MediaPlayerElement>()

const textTracks: TextTrackInit[] = [
  // Subtitles
  {
    src: 'https://files.vidstack.io/sprite-fight/subs/english.vtt',
    label: 'English',
    language: 'en-US',
    kind: 'subtitles',
    default: true,
  },
  {
    src: 'https://files.vidstack.io/sprite-fight/subs/spanish.vtt',
    label: 'Spanish',
    language: 'es-ES',
    kind: 'subtitles',
  },
  // Chapters
  {
    src: 'https://files.vidstack.io/sprite-fight/chapters.vtt',
    kind: 'chapters',
    language: 'en-US',
    default: true,
  },
]

onMounted(() => {
  /**
   * You can add these tracks using HTML as well.
   *
   * @example
   * ```html
   * <media-provider>
   *   <track label="..." src="..." kind="..." srclang="..." default />
   *   <track label="..." src="..." kind="..." srclang="..." />
   * </media-provider>
   * ```
   */
  for (const track of textTracks) $player.value!.textTracks.add(track)

  // Subscribe to state updates - you can connect them to Vue refs if needed.
  return $player.value!.subscribe(({ paused, viewType }) => {
    // console.log('is paused?', '->', paused);
    // console.log('is audio view?', '->', viewType === 'audio');
  })
})

function onProviderChange(event: MediaProviderChangeEvent) {
  const provider = event.detail
  // We can configure provider's here.
  if (isHLSProvider(provider)) {
    provider.config = {}
  }
}

// We can listen for the `can-play` event to be notified when the player is ready.
function onCanPlay(event: MediaCanPlayEvent) {
  // ...
}
</script>
