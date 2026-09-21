<script setup lang="ts">
import type { Editor } from '@tiptap/vue-3'

const props = defineProps<{
  editor: Editor | null
}>()

function toggleBold() {
  props.editor?.chain().focus().toggleBold().run()
}

function toggleItalic() {
  props.editor?.chain().focus().toggleItalic().run()
}

function toggleUnderline() {
  props.editor?.chain().focus().toggleUnderline().run()
}

function setColor(e: Event) {
  const color = (e.target as HTMLInputElement).value
  props.editor?.chain().focus().setColor(color).run()
}

function clearColor() {
  props.editor?.chain().focus().unsetColor().run()
}

function clearFormatting() {
  props.editor?.chain().focus().clearNodes().unsetAllMarks().run()
}
</script>

<template>
  <div class="flex items-center gap-1 flex-wrap border-b border-gray-200 pb-2 mb-2">
    <button
      class="px-2 py-1 rounded text-sm hover:bg-gray-100 transition-colors min-w-7 text-center"
      :class="{ 'bg-gray-200': editor?.isActive('bold') }"
      title="Fett (Strg+B)"
      @click="toggleBold"
    >
      <strong>B</strong>
    </button>
    <button
      class="px-2 py-1 rounded text-sm hover:bg-gray-100 transition-colors min-w-7 text-center"
      :class="{ 'bg-gray-200': editor?.isActive('italic') }"
      title="Kursiv (Strg+I)"
      @click="toggleItalic"
    >
      <em>I</em>
    </button>
    <button
      class="px-2 py-1 rounded text-sm hover:bg-gray-100 transition-colors min-w-7 text-center"
      :class="{ 'bg-gray-200': editor?.isActive('underline') }"
      title="Unterstrichen (Strg+U)"
      @click="toggleUnderline"
    >
      <u>U</u>
    </button>

    <div class="w-px h-5 bg-gray-300 mx-1" />

    <label class="px-2 py-1 rounded text-sm hover:bg-gray-100 transition-colors min-w-7 text-center relative cursor-pointer" title="Textfarbe">
      <span>A</span>
      <span
        class="absolute bottom-0.5 left-1 right-1 h-0.5 rounded"
        :style="{ background: editor?.getAttributes('textStyle').color ?? '#000' }"
      />
      <input
        type="color"
        class="sr-only"
        @input="setColor"
      />
    </label>

    <button class="px-2 py-1 rounded text-sm hover:bg-gray-100 transition-colors min-w-7 text-center" title="Farbe zurücksetzen" @click="clearColor">
      <span class="text-gray-400 line-through">A</span>
    </button>

    <div class="w-px h-5 bg-gray-300 mx-1" />

    <button class="px-2 py-1 rounded text-sm hover:bg-gray-100 transition-colors min-w-7 text-center text-gray-500" title="Formatierung löschen" @click="clearFormatting">
      <i class="fa-thin fa-eraser" />
    </button>
  </div>
</template>
