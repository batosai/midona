<script setup lang="ts">
  import { ref } from 'vue'
  import { VuePDF, usePDF } from '@tato30/vue-pdf'

  const page = ref(1)
  const { pdf, pages } = usePDF('https://pdfobject.com/pdf/sample-3pp.pdf')
</script>

<template>
  <div class="m-4 mx-auto">
    <VuePDF :pdf="pdf" :page="page" />
    <Paginator :rows="1" :totalRecords="pages" @page="(p) => (page = p.page + 1)" />
  </div>
</template>
