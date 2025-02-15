<template>
  <EditorContent
    :editor="editor"
    class="flex flex-col w-full h-screen p-4 mx-auto prose prose-2xl border-dashed md:border-x dark:prose-invert"
  />

  <BubbleMenu :editor="editor" :tippy-options="{ duration: 100 }" v-if="editor">
    <div class="bubble-menu">
      <Button
        size="small"
        @click="editor.chain().focus().toggleHeading({ level: 2 }).run()"
        :outlined="!editor.isActive('heading', { level: 2 })"
      >
        <span class="material-icons-outlined">title</span>
      </Button>
      <Button
        size="small"
        @click="editor.chain().focus().toggleBold().run()"
        :outlined="!editor.isActive('bold')"
      >
        <span class="material-icons-outlined">format_bold</span>
      </Button>
      <Button
        size="small"
        @click="editor.chain().focus().toggleItalic().run()"
        :outlined="!editor.isActive('italic')"
      >
        <span class="material-icons-outlined">format_italic</span>
      </Button>
      <Button
        size="small"
        @click="editor.chain().focus().toggleStrike().run()"
        :outlined="!editor.isActive('strike')"
      >
        <span class="material-icons-outlined">format_strikethrough</span>
      </Button>
      <Button
        size="small"
        @click="editor.chain().focus().toggleBulletList().run()"
        :outlined="!editor.isActive('listItem')"
      >
        <span class="material-icons-outlined">list</span>
      </Button>
    </div>
  </BubbleMenu>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { BubbleMenu, Editor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import BulletList from '@tiptap/extension-bullet-list'
import ListKeymap from '@tiptap/extension-list-keymap'
import Layout from '~/layouts/Default.vue'
import NotesLayout from '~/layouts/Notes.vue'

defineOptions({ layout: [Layout, NotesLayout] })

const editor = ref<Editor | null>(null)

onMounted(() => {
  editor.value = new Editor({
    extensions: [BulletList, ListKeymap, StarterKit],
    content: `
            <p>
              J'ai une <strong>expérience</strong> variée dans la réalisation de missions multiples, comprenant notamment l'analyse préalable des besoins, la réalisation d'audits techniques approfondis, ainsi que la coordination des équipes en collaboration directe avec le directeur de projet et les chefs de projet. Ma responsabilité principale consiste à superviser et à encadrer efficacement une équipe de développeurs, généralement constituée d'une dizaine de membres.
            </p>
          `,
  })
})

onUnmounted(() => {
  editor.value?.destroy()
})
</script>

<style>
@reference "../../app/app.css";

.tiptap {
  @apply h-full;
}

.tiptap:focus-visible {
  @apply outline-none;
}

.bubble-menu {
  @apply bg-white dark:bg-primary-800 rounded-md p-2 flex gap-2 ring ring-slate-200 dark:ring-primary-800;
}
</style>
