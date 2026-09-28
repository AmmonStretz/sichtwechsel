<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { useUiStore } from '@/stores/useUiStore'

const gameStore = useGameStore()
const uiStore = useUiStore()

const emit = defineEmits<{
  exportPdf: []
}>()

const isInitialized = computed(() => gameStore.isInitialized)
const hasData = computed(() => gameStore.hasData)

const confirmingReset = ref(false)
const showProjectMenu = ref(false)

function confirmReset() {
  gameStore.reset()
  uiStore.resetSession()
  confirmingReset.value = false
}

function cancelReset() {
  confirmingReset.value = false
}

function openImport() {
  showProjectMenu.value = false
  uiStore.openImportDialog()
}

function openNewProject() {
  showProjectMenu.value = false
  uiStore.openDataDialog()
}
</script>

<template>
  <header class="relative flex items-center justify-between px-4 h-12 border-b border-gray-200 bg-white shrink-0 z-10">

    <!-- Links: Hamburger (Mobile) + Neues Projekt -->
    <div class="flex items-center gap-1.5">
      <button
        class="lg:hidden w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
        @click="uiStore.toggleSidebar()"
      >
        <i class="fa-thin fa-bars text-lg" />
      </button>

      <!-- Logo: nur Desktop in linker Gruppe -->
      <RouterLink to="/" class="hidden lg:block mr-1">
        <img src="@/assets/logo.jpg" alt="Logo" class="h-8 w-auto object-contain" />
      </RouterLink>

      <!-- Neues Projekt Dropdown -->
      <div class="relative">
        <button
          data-tour="import-btn"
          class="w-8 h-8 lg:w-auto lg:h-auto flex items-center justify-center lg:px-3 lg:py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50 transition-colors gap-1.5"
          title="Neues Projekt erstellen"
          @click="showProjectMenu = !showProjectMenu"
        >
          <i class="fa-thin fa-folder-plus" />
          <span class="hidden lg:inline">Neues Projekt</span>
          <i class="fa-thin fa-chevron-down hidden lg:inline text-xs text-gray-400" />
        </button>

        <!-- Overlay zum Schließen -->
        <div
          v-if="showProjectMenu"
          class="fixed inset-0 z-20"
          @click="showProjectMenu = false"
        />

        <!-- Dropdown -->
        <div
          v-if="showProjectMenu"
          class="absolute left-0 top-full mt-1 z-30 w-48 bg-white rounded-lg border border-gray-200 shadow-lg overflow-hidden"
        >
          <button
            class="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
            @click="openImport"
          >
            <i class="fa-thin fa-file-import text-gray-400 w-4 text-center" />
            Importieren
          </button>
          <div class="border-t border-gray-100" />
          <button
            class="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors text-left"
            @click="openNewProject"
          >
            <i class="fa-thin fa-pen-to-square text-gray-400 w-4 text-center" />
            Leeres Projekt
          </button>
        </div>
      </div>
    </div>

    <!-- Logo: Mobile, absolut zentriert -->
    <RouterLink to="/" class="lg:hidden absolute left-1/2 -translate-x-1/2">
      <img src="@/assets/logo.jpg" alt="Logo" class="h-8 w-auto object-contain" />
    </RouterLink>

    <!-- Rechts: Excel + PDF + Reset -->
    <div class="flex items-center gap-1.5">
      <button
        data-tour="excel-btn"
        :disabled="!hasData"
        class="w-8 h-8 lg:w-auto lg:h-auto flex items-center justify-center lg:px-3 lg:py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        title="Aktuelle Texte als Excel herunterladen"
        @click="gameStore.exportToExcel()"
      >
        <span class="hidden lg:inline">Excel </span><i class="fa-thin fa-arrow-down" />
      </button>

      <button
        data-tour="pdf-btn"
        :disabled="!hasData || uiStore.isExporting"
        class="w-8 h-8 lg:w-auto lg:h-auto flex items-center justify-center lg:px-3 lg:py-1.5 text-sm rounded-md bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
        :title="uiStore.isExporting ? 'Exportiere…' : 'PDF exportieren'"
        @click="$emit('exportPdf')"
      >
        <i class="fa-thin fa-file-pdf" />
        <span class="hidden lg:inline ml-1">
          <span v-if="uiStore.isExporting">Exportiere…</span>
          <span v-else>PDF exportieren</span>
        </span>
      </button>

      <template v-if="isInitialized">
        <div class="w-px h-5 bg-gray-200" />
        <template v-if="confirmingReset">
          <span class="hidden lg:inline text-xs text-red-600">Alle Daten löschen?</span>
          <button
            class="w-8 h-8 lg:w-auto lg:h-auto flex items-center justify-center lg:px-2.5 lg:py-1.5 text-xs rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
            title="Ja, alle Daten löschen"
            @click="confirmReset"
          >
            <i class="fa-thin fa-check" />
            <span class="hidden lg:inline ml-1">Ja, löschen</span>
          </button>
          <button
            class="w-8 h-8 lg:w-auto lg:h-auto flex items-center justify-center lg:px-2.5 lg:py-1.5 text-xs rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
            title="Abbrechen"
            @click="cancelReset"
          >
            <i class="fa-thin fa-xmark" />
            <span class="hidden lg:inline ml-1">Abbrechen</span>
          </button>
        </template>
      </template>
    </div>
  </header>
</template>
