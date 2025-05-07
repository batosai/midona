import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUploadDrawerStore = defineStore('uploadDrawerStore', () => {
  const visible = ref(false)

  function open() {
    visible.value = true
  }

  function close() {
    visible.value = true
  }

  function toogle() {
    visible.value = !visible.value
  }

  return { visible, open, close, toogle }
})
