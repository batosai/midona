<script setup lang="ts">
  import { onMounted } from 'vue'
  import { usePage } from '@inertiajs/vue3'
  import { useToast } from 'primevue/usetoast'
  import Toast from 'primevue/toast'
  import { transmit } from '~/app/transmit'

  interface FlashProps {
    errors?: Record<string, string>
    success?: string
  }

  interface PageProps {
    flash?: FlashProps
    [key: string]: any
  }

  const page = usePage<PageProps>()
  const toast = useToast()

  onMounted(async () => {
    const subscription = transmit.subscription('notifications')
    await subscription.create()

    subscription.onMessage((data: { severity: string; summary: string; detail: string }) => {
      toast.add({
        ...data,
        life: 5000,
      })
    })

    // Gestion des erreurs
    if (page.props.flash?.errors) {
      Object.entries(page.props.flash.errors).forEach(([_key, value]) => {
        toast.add({
          severity: 'error',
          summary: 'Erreur',
          detail: value,
          life: 5000,
        })
      })
    }

    // Gestion des succès
    if (page.props.flash?.success) {
      toast.add({
        severity: 'success',
        summary: 'Succès',
        detail: page.props.flash.success,
        life: 5000,
      })
    }
  })
</script>

<template>
  <Toast position="bottom-center" />
</template>
