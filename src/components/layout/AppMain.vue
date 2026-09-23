<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { useUiStore } from '@/stores/useUiStore'
import { usePrintScale } from '@/composables/usePrintScale'
import PrintPage from '@/components/cards/PrintPage.vue'
import GroupedPreview from '@/components/cards/GroupedPreview.vue'
import PageNavigator from '@/components/controls/PageNavigator.vue'

const gameStore = useGameStore()
const uiStore = useUiStore()

const containerRef = ref<HTMLElement | null>(null)
const { scale } = usePrintScale(containerRef)

const scaledWidth = computed(() => 794 * scale.value)
const scaledHeight = computed(() => 1123 * scale.value)
</script>

<template>
  <main ref="containerRef" data-tour="preview-area" class="flex-1 overflow-y-auto bg-gray-100 flex flex-col">
    <!-- Leerzustand -->
    <div
      v-if="!gameStore.isInitialized"
      class="flex-1 flex flex-col items-center justify-center text-center p-8"
    >
      <i class="fa-thin fa-cards-blank text-6xl text-gray-300 mb-6" />
      <h2 class="text-lg font-semibold text-gray-700 mb-1">Noch keine Karten</h2>
      <p class="text-sm text-gray-400 max-w-xs mb-8">
        Importiere eine Excel-Tabelle oder erstelle Karten manuell.
      </p>
      <div class="flex flex-col sm:flex-row gap-3">
        <button
          class="flex items-center gap-2 px-5 py-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-400 hover:bg-primary-50 text-gray-600 hover:text-primary-700 transition-colors"
          @click="uiStore.openImportDialog()"
        >
          <i class="fa-thin fa-file-arrow-up text-lg" />
          <div class="text-left">
            <div class="text-sm font-medium">Importieren</div>
            <div class="text-xs text-gray-400">Excel, ODS oder CSV</div>
          </div>
        </button>
        <button
          class="flex items-center gap-2 px-5 py-3 rounded-lg border-2 border-dashed border-gray-300 hover:border-primary-400 hover:bg-primary-50 text-gray-600 hover:text-primary-700 transition-colors"
          @click="uiStore.openDataDialog()"
        >
          <i class="fa-thin fa-pen-to-square text-lg" />
          <div class="text-left">
            <div class="text-sm font-medium">Manuell erstellen</div>
            <div class="text-xs text-gray-400">Parteien und Themen eingeben</div>
          </div>
        </button>
      </div>
    </div>

    <template v-else-if="gameStore.isInitialized">
      <!-- Navigation -->
      <PageNavigator />

      <!-- Druck-Layout -->
      <div v-if="uiStore.layoutMode === 'druck'" class="flex-1 flex items-start justify-center p-6">
        <div
          class="origin-top-left"
          :style="{
            width: scaledWidth + 'px',
            height: scaledHeight + 'px',
            transform: `scale(${scale})`,
          }"
        >
          <div class="shadow-lg">
            <PrintPage
              :page-index="uiStore.currentPage"
              :mode="uiStore.previewMode"
            />
          </div>
        </div>
      </div>

      <!-- Gruppierte Ansicht (nach Partei oder Thema) -->
      <GroupedPreview
        v-else
        :mode="uiStore.previewMode"
        :group-by="uiStore.layoutMode as 'partei' | 'thema'"
      />
    </template>
  </main>
</template>
