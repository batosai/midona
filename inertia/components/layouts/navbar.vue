<script setup lang="ts">
  import { ref } from 'vue'

  const items = ref([
    { label: 'Comment', url: '/', icon: 'pi pi-comment' },
    { label: 'Médiathèque', url: '/mediatheque', icon: 'pi pi-images' },
    { label: 'Inbox', url: '/inbox', icon: 'pi pi-inbox' },
    { label: 'User', url: '/user', icon: 'pi pi-user' },
    { label: 'Video', url: '/video', icon: 'pi pi-video' },
    { label: 'Large', url: '/', icon: 'pi pi-th-large' },
    { label: 'Cog', url: '/cog', icon: 'pi pi-cog' },
  ])


  const op = ref()
  const selectedMember = ref(null)
  const members = ref([
    { name: 'Amy Elsner', image: 'amyelsner.png', email: 'amy@email.com', role: 'Owner' },
    { name: 'Bernardo Dominic', image: 'bernardodominic.png', email: 'bernardo@email.com', role: 'Editor' },
    { name: 'Ioni Bowcher', image: 'ionibowcher.png', email: 'ioni@email.com', role: 'Viewer' }
  ])

  const toggle = (event) => {
    event.preventDefault()
    op.value.toggle(event)
  }

  const selectMember = (member) => {
    selectedMember.value = member
    op.value.hide()
  }
</script>

<template>
  <SpeedDial :model="items" :radius="180" direction="up" class="fixed! lg:hidden! bottom-4 left-4 z-2!" />

  <div class="sticky top-0 flex flex-col justify-between hidden w-auto h-screen p-5 lg:flex bg-surface-50 dark:bg-surface-900">
    <div class="flex flex-col items-center w-12">
      <div class="flex items-center gap-3">
        <div class="flex items-center justify-center border w-11 h-11 rounded-xl border-primary">
          <svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M14.65 11.0645L13.1283 10.7253L14.3119 12.4216V17.6803L18.3698 14.2876V8.52002L16.5099 9.19856L14.65 11.0645Z" fill="var(--p-primary-color)"></path>
            <path d="M5.18078 11.0645L6.70251 10.7253L5.51894 12.4216V17.6803L1.46098 14.2876V8.52002L3.32088 9.19856L5.18078 11.0645Z" fill="var(--p-primary-color)"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M6.02649 12.7634L7.37914 10.7278L8.22455 11.2367H11.6062L12.4516 10.7278L13.8042 12.7634V20.397L12.7898 21.9237L11.6062 23.1111H8.22455L7.04098 21.9237L6.02649 20.397V12.7634Z" fill="var(--p-primary-color)"></path>
            <path d="M14.311 20.9058L16.5091 18.7005V16.4952L14.311 18.3612V20.9058Z" fill="var(--p-primary-color)"></path>
            <path d="M5.51868 20.9058L3.32062 18.7005V16.4952L5.51868 18.3612V20.9058Z" fill="var(--p-primary-color)"></path>
            <path fill-rule="evenodd" clip-rule="evenodd" d="M9.578 0.888672H7.7177L6.36505 4.11174L8.56311 10.5579H11.4375L13.4665 4.11174L12.1138 0.888672H10.2543V10.5578H9.578V0.888672Z" fill="var(--p-primary-color)"></path>
            <path d="M8.56283 10.5575L1.29232 7.84329L0.277832 3.60242L6.53385 4.11132L8.73191 10.5575H8.56283Z" fill="var(--p-primary-color)"></path>
            <path d="M11.4372 10.5575L18.7077 7.84329L19.7222 3.60242L13.2971 4.11132L11.2681 10.5575H11.4372Z" fill="var(--p-primary-color)"></path>
            <path d="M13.8041 3.60283L17.3548 3.26356L14.9876 0.888672H12.6205L13.8041 3.60283Z" fill="var(--p-primary-color)"></path>
            <path d="M6.02676 3.60283L2.47604 3.26356L4.84318 0.888672H7.21033L6.02676 3.60283Z" fill="var(--p-primary-color)"></path>
          </svg>
        </div>
        <div class="hidden text-3xl font-medium text-surface-950 dark:text-surface-0">Prime</div>
      </div>
      <div class="flex flex-col gap-2 mt-10">
        <Button variant="" as="a" href="/comment" icon="pi pi-home" aria-label="Home" v-tooltip="'Home'" />
        <Button variant="text" as="a" href="/comment" icon="pi pi-inbox" severity="secondary" aria-label="Inbox" v-tooltip="'Inbox'" />
        <Button variant="text" as="a" href="/comment" icon="pi pi-comment" severity="secondary" aria-label="Comment" v-tooltip="'Comment'" />
        <Button variant="text" as="a" href="/mediatheque" icon="pi pi-images" severity="secondary" aria-label="Médiathèque" v-tooltip="'Médiathèque'" />
        <Button variant="text" as="a" href="/comment" icon="pi pi-video" severity="secondary" aria-label="video" v-tooltip="'Video'" />
        <Button @click="toggle" variant="text" as="a" href="/comment" icon="pi pi-th-large" severity="secondary" aria-label="th-large" v-tooltip="'Large'" />
      </div>
    </div>
    <div class="flex flex-col items-center w-12">
      <div class="flex flex-col gap-2 mt-10">
        <OverlayBadge value="4" size="small" severity="danger">
          <Button @click="toggle" variant="text" as="a" icon="pi pi-bell" severity="secondary" aria-label="bell" v-tooltip="'Settings'" />
        </OverlayBadge>

        <Popover ref="op">
            <div class="flex flex-col gap-4">
                <div>
                    <span class="block mb-2 font-medium">Team Members</span>
                    <ul class="flex flex-col p-0 m-0 list-none">
                        <li v-for="member in members" :key="member.name" class="flex items-center gap-2 px-2 py-3 cursor-pointer hover:bg-emphasis rounded-border" @click="selectMember(member)">
                            <img :src="`https://primefaces.org/cdn/primevue/images/avatar/${member.image}`" style="width: 32px" />
                            <div>
                                <span class="font-medium">{{ member.name }}</span>
                                <div class="text-sm text-surface-500 dark:text-surface-400">{{ member.email }}</div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </Popover>


        <Button variant="text" as="a" href="/comment" icon="pi pi-cog" severity="secondary" aria-label="cog" v-tooltip="'Settings'" />
      </div>
      <Divider />
      <div class="flex items-center justify-center">
        <Avatar image="https://www.primefaces.org/cdn/primevue/images/landing/apps/main-avatar.png" size="large" shape="circle" />
      </div>
    </div>
  </div>
</template>
