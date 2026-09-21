<script setup lang="ts">
import { watch, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import TextStyle from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Underline from '@tiptap/extension-underline'
import EditorToolbar from './EditorToolbar.vue'

const props = defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const editor = useEditor({
  extensions: [
    StarterKit.configure({ heading: false, blockquote: false, code: false, codeBlock: false }),
    TextStyle,
    Color,
    Underline,
  ],
  content: props.modelValue,
  onUpdate({ editor }) {
    emit('update:modelValue', editor.getHTML())
  },
})

watch(
  () => props.modelValue,
  val => {
    if (editor.value && editor.value.getHTML() !== val) {
      editor.value.commands.setContent(val, false)
    }
  }
)

onBeforeUnmount(() => editor.value?.destroy())
</script>

<template>
  <div class="tiptap-editor border border-gray-300 rounded-md p-2 bg-white min-h-[100px]">
    <EditorToolbar :editor="editor ?? null" />
    <EditorContent :editor="editor" />
  </div>
</template>
