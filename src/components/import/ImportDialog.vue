<script setup lang="ts">
import { useUiStore } from '@/stores/useUiStore'
import ImportPanel from './ImportPanel.vue'
import ImportPreview from './ImportPreview.vue'

const uiStore = useUiStore()

function onBackdropClick() {
  uiStore.closeImportDialog()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="uiStore.showImportDialog"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <!-- Backdrop -->
        <div
          class="absolute inset-0 bg-black/40"
          @click="onBackdropClick"
        />

        <!-- Dialog -->
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h2 class="text-base font-semibold text-gray-900">Daten importieren</h2>
            <button
              class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-sm"
              title="Schließen"
              @click="uiStore.closeImportDialog()"
            >
              <i class="fa-thin fa-xmark" />
            </button>
          </div>

          <!-- Content -->
          <ImportPreview v-if="uiStore.showImportPreview" />
          <ImportPanel v-else />
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.dialog-enter-active,
.dialog-leave-active {
  transition: opacity 0.15s ease;
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
</style>
