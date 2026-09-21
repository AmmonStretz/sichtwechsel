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
  <header class="flex items-center justify-between px-4 h-12 border-b border-gray-200 bg-white flex-shrink-0 z-10">
    <!-- Links: Logo + Erstellen/Importieren -->
    <div class="flex items-center gap-2">
      <img src="@/assets/logo.jpg" alt="Logo" class="h-8 w-auto object-contain mr-1" />

      <!-- Neue Karte -->
      <button
        class="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
        title="Neue Karte manuell erstellen"
        @click="openNewCard"
      >
        <i class="fa-thin fa-plus mr-1" /> Neue Karte
      </button>

      <!-- Import -->
      <button
        data-tour="import-btn"
        class="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
        title="Excel-Datei importieren"
        @click="uiStore.openImportDialog()"
      >
        Importieren
      </button>
    </div>

    <!-- Rechts: Exportieren + Neu starten -->
    <div class="flex items-center gap-2">
      <!-- Excel Download -->
      <button
        data-tour="excel-btn"
        :disabled="!hasData"
        class="text-sm px-3 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        title="Aktuelle Texte als Excel herunterladen"
        @click="gameStore.exportToExcel()"
      >
        Excel <i class="fa-thin fa-arrow-down" />
      </button>

      <!-- PDF Export -->
      <button
        data-tour="pdf-btn"
        :disabled="!hasData || uiStore.isExporting"
        class="text-sm px-3 py-1.5 rounded-md bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
        @click="$emit('exportPdf')"
      >
        <span v-if="uiStore.isExporting">Exportiere…</span>
        <span v-else>PDF exportieren</span>
      </button>

      <!-- Neu starten -->
      <template v-if="hasData">
        <div class="w-px h-5 bg-gray-200" />
        <template v-if="confirmingReset">
          <span class="text-xs text-red-600">Alle Daten löschen?</span>
          <button
            class="text-xs px-2.5 py-1.5 rounded-md bg-red-600 text-white hover:bg-red-700 transition-colors font-medium"
            @click="confirmReset"
          >
            Ja, löschen
          </button>
          <button
            class="text-xs px-2.5 py-1.5 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
            @click="cancelReset"
          >
            Abbrechen
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
