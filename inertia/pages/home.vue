<script setup lang="ts">
  import { Head } from '@inertiajs/vue3'
</script>

<template>
  <Head title="Homepage" />

  <div class="flex flex-col w-full h-screen md:justify-center item-center">
    <div class="w-full max-w-2xl px-4 mx-auto mt-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <IconField class="w-full">
        <InputIcon>
          <i class="pi pi-search" />
        </InputIcon>
        <InputText class="w-full" placeholder="Search" />
      </IconField>
    </div>

    <div class="w-full max-w-2xl px-4 py-16 mx-auto sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 class="text-2xl font-bold tracking-tight">Customers also purchased</h2>

      <div class="grid grid-cols-1 mt-6 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        <div class="cursor-pointer">
          <div class="relative aspect-[259/174.5] rounded-lg overflow-hidden">
            <img
              class="object-cover w-full h-full"
              src="https://www.primefaces.org/cdn/primevue/images/landing/apps/movie-cover7.png"
              alt="Popular Movie Cover"
            />
            <Tag class="absolute z-10 top-2 right-2" severity="secondary" value="4.6" />
          </div>
          <div class="flex items-start justify-between gap-1 mt-2">
            <div class="flex-1 px-2">
              <div class="font-medium leading-6 text-color line-clamp-1">Basic Tee</div>
              <div class="mt-1 text-sm leading-5 text-muted-color">Drama</div>
            </div>
            <Button
              icon="pi pi-bookmark"
              severity="secondary"
              variant="text"
              rounded
              aria-label="Bookmark"
            />
          </div>
        </div>

        <div class="cursor-pointer">
          <div class="relative aspect-[259/174.5] rounded-lg overflow-hidden">
            <img
              class="object-cover w-full h-full"
              src="https://www.primefaces.org/cdn/primevue/images/landing/apps/movie-cover8.png"
              alt="Popular Movie Cover"
            />
            <Tag class="absolute z-10 top-2 right-2" severity="secondary" value="3.2" />
          </div>
          <div class="flex items-start justify-between gap-1 mt-2">
            <div class="flex-1 px-2">
              <div class="font-medium leading-6 text-color line-clamp-1">Saving Private Ryan</div>
              <div class="mt-1 text-sm leading-5 text-muted-color">Drama, War</div>
            </div>
            <Button
              icon="pi pi-bookmark-fill"
              severity="secondary"
              variant="text"
              rounded
              aria-label="Bookmark"
            />
          </div>
        </div>

        <div class="cursor-pointer">
          <div class="relative aspect-[259/174.5] rounded-lg overflow-hidden">
            <img
              class="object-cover w-full h-full"
              src="https://www.primefaces.org/cdn/primevue/images/landing/apps/movie-cover8.png"
              alt="Popular Movie Cover"
            />
            <Tag class="absolute z-10 top-2 right-2" severity="secondary" value="3.2" />
          </div>
          <div class="flex items-start justify-between gap-1 mt-2">
            <div class="flex-1 px-2">
              <div class="font-medium leading-6 text-color line-clamp-1">Saving Private Ryan</div>
              <div class="mt-1 text-sm leading-5 text-muted-color">Drama, War</div>
            </div>
            <Button
              icon="pi pi-bookmark-fill"
              severity="secondary"
              variant="text"
              rounded
              aria-label="Bookmark"
            />
          </div>
        </div>

        <div class="cursor-pointer">
          <div class="relative aspect-[259/174.5] rounded-lg overflow-hidden">
            <img
              class="object-cover w-full h-full"
              src="https://www.primefaces.org/cdn/primevue/images/landing/apps/movie-cover8.png"
              alt="Popular Movie Cover"
            />
            <Tag class="absolute z-10 top-2 right-2" severity="secondary" value="3.2" />
          </div>
          <div class="flex items-start justify-between gap-1 mt-2">
            <div class="flex-1 px-2">
              <div class="font-medium leading-6 text-color line-clamp-1">Saving Private Ryan</div>
              <div class="mt-1 text-sm leading-5 text-muted-color">Drama, War</div>
            </div>
            <Button
              icon="pi pi-bookmark-fill"
              severity="secondary"
              variant="text"
              rounded
              aria-label="Bookmark"
            />
          </div>
        </div>
      </div>
    </div>

    <div
      class="grid w-full max-w-2xl grid-cols-4 gap-6 px-4 pb-20 mx-auto sm:grid-cols-6 xl:grid-cols-12 sm:px-6 lg:max-w-7xl lg:px-8"
    >
      <Avatar label="P" class="mr-2" size="xlarge" />
      <Avatar label="P" class="mr-2" size="xlarge" />
      <Avatar label="P" class="mr-2" size="xlarge" />
      <Avatar label="P" class="mr-2" size="xlarge" />
      <Avatar label="P" class="mr-2" size="xlarge" />
      <Avatar label="P" class="mr-2" size="xlarge" />
      <Avatar label="P" class="mr-2" size="xlarge" />
      <Avatar label="P" class="mr-2" size="xlarge" />
      <Avatar label="P" class="mr-2" size="xlarge" />
      <Avatar label="P" class="mr-2" size="xlarge" />
      <Avatar label="P" class="mr-2" size="xlarge" />
      <div>
        <OverlayBadge value="4" severity="danger" class="inline-flex">
          <Avatar label="U" size="xlarge" />
        </OverlayBadge>
      </div>
    </div>
  </div>
</template>
