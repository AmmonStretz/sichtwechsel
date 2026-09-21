<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { useUiStore } from '@/stores/useUiStore'

const gameStore = useGameStore()
const uiStore = useUiStore()

const emit = defineEmits<{
  exportPdf: []
}>()

const hasData = computed(() => gameStore.hasData)

const confirmingReset = ref(false)

function requestReset() {
  confirmingReset.value = true
}

function confirmReset() {
  gameStore.reset()
  uiStore.resetSession()
  confirmingReset.value = false
}

function cancelReset() {
  confirmingReset.value = false
}

function openNewCard() {
  if (gameStore.parties.length === 0) {
    const partyId = gameStore.addParty('Partei 1')
    const stmtId = gameStore.addStatement('Karte 1')
    const cardId = `${stmtId}__${partyId}`
    uiStore.selectedCardId = cardId
    uiStore.setCurrentPage(0)
    uiStore.activeSidebarSection = 'schrift'
  } else {
    uiStore.openDataDialog()
  }
}
</script>

<template>
  <header class="relative flex items-center justify-between px-4 h-12 border-b border-gray-200 bg-white shrink-0 z-10">

    <!-- Links: Hamburger (Mobile) + Neue Karte + Importieren -->
    <div class="flex items-center gap-1.5">
      <button
        class="lg:hidden w-8 h-8 flex items-center justify-center text-gray-500 hover:text-gray-700 transition-colors"
        @click="uiStore.toggleSidebar()"
      >
        <i class="fa-thin fa-bars text-lg" />
      </button>

      <!-- Logo: nur Desktop in linker Gruppe -->
      <img src="@/assets/logo.jpg" alt="Logo" class="hidden lg:block h-8 w-auto object-contain mr-1" />

      <button
        class="w-8 h-8 lg:w-auto lg:h-auto flex items-center justify-center lg:px-3 lg:py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
        title="Neue Karte manuell erstellen"
        @click="openNewCard"
      >
        <i class="fa-thin fa-plus" />
        <span class="hidden lg:inline ml-1">Neue Karte</span>
      </button>

      <button
        data-tour="import-btn"
        class="w-8 h-8 lg:w-auto lg:h-auto flex items-center justify-center lg:px-3 lg:py-1.5 text-sm rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
        title="Excel-Datei importieren"
        @click="uiStore.openImportDialog()"
      >
        <i class="fa-thin fa-file-import" />
        <span class="hidden lg:inline ml-1">Importieren</span>
      </button>
    </div>

    <!-- Logo: Mobile, absolut zentriert -->
    <img src="@/assets/logo.jpg" alt="Logo" class="lg:hidden absolute left-1/2 -translate-x-1/2 h-8 w-auto object-contain pointer-events-none" />

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

      <template v-if="hasData">
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
        <button
          v-else
          class="w-8 h-8 flex items-center justify-center rounded-full border border-gray-200 hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
          title="Neu starten – alle Daten löschen"
          @click="requestReset"
        >
          <i class="fa-thin fa-rotate-left" />
        </button>
      </template>
    </div>
  </header>
</template>
