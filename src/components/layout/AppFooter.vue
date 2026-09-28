<script setup lang="ts">
import { useUiStore } from '@/stores/useUiStore'

const uiStore = useUiStore()
const name = import.meta.env.VITE_VEREIN_NAME
</script>

<template>
  <footer class="shrink-0 border-t border-gray-100 bg-white px-4 py-1.5 flex items-center justify-between text-xs text-gray-400 print:hidden">
    <span>© {{ name }}</span>
    <div class="flex gap-4">
      <button class="hover:text-gray-600 transition-colors" @click="uiStore.openImpressumDialog()">
        Impressum
      </button>
      <button class="hover:text-gray-600 transition-colors" @click="uiStore.openDatenschutzDialog()">
        Datenschutz
      </button>
    </div>
  </footer>
</template>
