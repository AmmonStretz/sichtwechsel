<script setup lang="ts">
import { ref } from 'vue'
import type { ImageConfig } from '@/types'
import { useDragDrop } from '@/composables/useDragDrop'

const props = defineProps<{
  modelValue: ImageConfig | null
  label?: string
  showHint?: boolean
}>()

const emit = defineEmits<{
  'update:modelValue': [ImageConfig | null]
}>()

const fileInput = ref<HTMLInputElement | null>(null)

function handleFile(file: File) {
  const reader = new FileReader()
  reader.onload = e => {
    emit('update:modelValue', {
      url: e.target?.result as string,
      scale: props.modelValue?.scale ?? 1,
    })
  }
  reader.readAsDataURL(file)
}

const { isDragging, onDragOver, onDragLeave, onDrop, onFileInput } = useDragDrop(
  handleFile,
  ['.png', '.jpg', '.jpeg', '.webp', '.svg']
)

function setScale(e: Event) {
  if (!props.modelValue) return
  emit('update:modelValue', {
    ...props.modelValue,
    scale: Number((e.target as HTMLInputElement).value),
  })
}
</script>

<template>
  <div class="space-y-2">
    <div v-if="label" class="text-xs font-medium text-gray-700">{{ label }}</div>

    <!-- Vorschau -->
    <div
      v-if="modelValue"
      class="relative rounded-lg overflow-hidden border border-gray-200"
      style="height: 60px;"
    >
      <img :src="modelValue.url" class="w-full h-full object-cover" alt="" />
      <button
        class="absolute top-1 right-1 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs text-gray-500 hover:text-red-500 shadow transition-colors"
        title="Bild entfernen"
        @click="emit('update:modelValue', null)"
      >
        <i class="fa-thin fa-xmark" />
      </button>
    </div>

    <!-- Upload-Zone -->
    <div
      class="border-2 border-dashed rounded-lg p-2 text-center transition-colors cursor-pointer text-xs"
      :class="isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-200 hover:border-gray-400'"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
      @click="fileInput?.click()"
    >
      {{ modelValue ? 'Bild ersetzen' : 'Bild ablegen oder' }}
      <span v-if="!modelValue" class="text-primary-600 underline">auswählen</span>
      <div class="text-gray-400 mt-0.5">PNG · JPG · WebP · SVG</div>
      <div v-if="showHint" class="text-gray-400 mt-0.5">Mindestgröße: 1240 × 877 Pixel (1,41 : 1)</div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept=".png,.jpg,.jpeg,.webp,.svg"
      class="sr-only"
      @change="onFileInput"
    />

    <!-- Skalierung -->
    <div v-if="modelValue" class="space-y-1">
      <div class="flex items-center justify-between">
        <label class="text-xs text-gray-600">Skalierung</label>
        <span class="text-xs text-gray-500">{{ Math.round(modelValue.scale * 100) }} %</span>
      </div>
      <input
        type="range"
        min="0.25"
        max="3"
        step="0.05"
        :value="modelValue.scale"
        class="w-full h-1.5 accent-primary-600"
        @input="setScale"
      />
    </div>

  </div>
</template>
