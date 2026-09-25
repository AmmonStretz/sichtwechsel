<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { useUiStore } from '@/stores/useUiStore'
import { exportToPdf } from '@/utils/pdfExporter'
import { pinia } from './pinia'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'
import AppMain from '@/components/layout/AppMain.vue'
import ImportDialog from '@/components/import/ImportDialog.vue'
import DataInputDialog from '@/components/data/DataInputDialog.vue'
import OverflowButton from '@/components/controls/OverflowButton.vue'
import AppTour from '@/components/AppTour.vue'

const gameStore = useGameStore()
const uiStore = useUiStore()

const exportProgress = ref(0)
const exportTotal = ref(0)

const totalPages = computed(() =>
  gameStore.getFilteredTotalPages(uiStore.filterPartyId, uiStore.filterStatementId)
)

async function handleExportPdf() {
  if (!gameStore.hasData || uiStore.isExporting) return

  uiStore.isExporting = true
  exportProgress.value = 0
  exportTotal.value = totalPages.value * 2

  try {
    await exportToPdf(pinia, totalPages.value, (done, total) => {
      exportProgress.value = done
      exportTotal.value = total
    })
  } finally {
    uiStore.isExporting = false
  }
}
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden bg-white">
    <AppHeader @export-pdf="handleExportPdf" />

    <!-- Export-Fortschritt -->
    <div
      v-if="uiStore.isExporting"
      class="bg-primary-50 border-b border-primary-200 px-4 py-2 text-sm text-primary-700 flex items-center gap-3"
    >
      <div class="animate-spin w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full" />
      PDF wird erstellt… {{ exportProgress }} / {{ exportTotal }} Seiten
    </div>

    <div class="flex flex-1 overflow-hidden">
      <AppSidebar v-if="uiStore.layoutMode !== 'druck'" />
      <AppMain />
    </div>

    <ImportDialog />
    <DataInputDialog />
    <OverflowButton />
    <AppTour />

    <!-- Tour-FAB -->
    <button
      class="fixed bottom-5 right-5 w-12 h-12 flex items-center justify-center rounded-full bg-white border border-gray-200 shadow-md hover:shadow-lg text-gray-400 hover:text-primary-600 transition-all z-40"
      title="Führung starten"
      @click="uiStore.startTour()"
    >
      <i class="fa-thin fa-circle-question text-xl" />
    </button>
  </div>
</template>
