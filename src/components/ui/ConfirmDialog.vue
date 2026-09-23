<script setup lang="ts">
defineProps<{
  show: boolean
  title: string
  message: string
  confirmLabel?: string
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="show"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div class="absolute inset-0 bg-black/40" @click="emit('cancel')" />
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-sm mx-4">
          <div class="px-5 py-4 border-b border-gray-200">
            <h2 class="text-base font-semibold text-gray-900">{{ title }}</h2>
          </div>
          <div class="px-5 py-4">
            <p class="text-sm text-gray-600">{{ message }}</p>
          </div>
          <div class="flex justify-end gap-2 px-5 py-4 border-t border-gray-100">
            <button
              class="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
              @click="emit('cancel')"
            >
              Abbrechen
            </button>
            <button
              class="px-4 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              @click="emit('confirm')"
            >
              {{ confirmLabel ?? 'Löschen' }}
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
