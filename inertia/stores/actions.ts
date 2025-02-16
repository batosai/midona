import { ref } from 'vue'
import { defineStore } from 'pinia'

type Item = {
  label: string
  icon: string
  href: string
}

export const useActionsStore = defineStore('counter', () => {
  const items = ref<Item[]>([])

  function add(value: Item) {
    items.value.push(value)
  }

  function set(value: Item[]) {
    items.value = value
  }

  function reset() {
    items.value = []
  }

  return { items, set, add, reset }
})
