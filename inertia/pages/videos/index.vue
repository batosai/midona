<template>
  <Head title="Videos" />

  <div class="flex flex-col w-full h-screen">
    <div class="w-full max-w-2xl px-4 py-16 mx-auto sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
      <h2 class="text-2xl font-bold tracking-tight">Customers also purchased</h2>

      <div class="grid grid-cols-1 mt-6 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
        <Card pt:body:class="p-0">
          <template #header>
            <div class="relative cursor-pointer aspect-[259/174.5] rounded-t-lg overflow-hidden">
              <img
                src="https://www.primefaces.org/cdn/primevue/images/landing/apps/movie-cover7.png"
                alt="Popular Movie Cover"
              />
              <Tag class="absolute z-10 top-2 right-2" severity="secondary" value="4.6" />
              <a href="#" class="absolute inset-0"></a>
            </div>
          </template>
          <template #content>
            <div class="flex items-start justify-between gap-1 p-2">
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
          </template>
        </Card>

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
  </div>
</template>
