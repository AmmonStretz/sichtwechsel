<script setup lang="ts">
import { computed } from 'vue'
import { useUiStore } from '@/stores/useUiStore'
import { useGameStore } from '@/stores/useGameStore'

const uiStore = useUiStore()
const gameStore = useGameStore()

const totalPages = computed(() =>
  gameStore.getFilteredTotalPages(uiStore.filterPartyId, uiStore.filterStatementId)
)

const canPrev = computed(() => uiStore.currentPage > 0)
const canNext = computed(() => uiStore.currentPage < totalPages.value - 1)

const overflowCount = computed(() => gameStore.overflowingCards.length)

const firstOverflowPage = computed(() => {
  if (overflowCount.value === 0) return null
  return Math.min(...gameStore.overflowingCards.map(c => gameStore.getPageForCard(c.id)))
})

function prev() {
  if (canPrev.value) uiStore.setCurrentPage(uiStore.currentPage - 1)
}

function next() {
  if (canNext.value) uiStore.setCurrentPage(uiStore.currentPage + 1)
}

function jumpToFirstOverflow() {
  if (firstOverflowPage.value !== null) {
    uiStore.setCurrentPage(firstOverflowPage.value)
    uiStore.previewMode = 'vorderseiten'
  }
}
</script>

<template>
  <div class="flex items-center justify-between px-4 py-2 border-b border-gray-100 bg-gray-50">
    <!-- Links: Vorder-/Rückseiten-Toggle -->
    <div data-tour="mode-toggle" class="flex rounded-md border border-gray-200 overflow-hidden text-xs">
      <button
        class="px-3 py-1.5 transition-colors"
        :class="uiStore.previewMode === 'vorderseiten' ? 'bg-primary-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'"
        @click="uiStore.setPreviewMode('vorderseiten')"
      >
        Vorderseiten
      </button>
      <button
        class="px-3 py-1.5 transition-colors"
        :class="uiStore.previewMode === 'rueckseiten' ? 'bg-primary-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'"
        @click="uiStore.setPreviewMode('rueckseiten')"
      >
        Rückseiten
      </button>
    </div>

    <!-- Mitte: Seiten-Navigation (nur im Druck-Layout) -->
    <div v-if="uiStore.layoutMode === 'druck'" data-tour="page-nav" class="flex items-center gap-2 text-sm">
      <button
        class="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
        :disabled="!canPrev"
        @click="prev"
      >
        <i class="fa-thin fa-chevron-left" />
      </button>
      <span class="text-xs text-gray-600 min-w-15 text-center">
        Seite {{ uiStore.currentPage + 1 }} / {{ totalPages }}
      </span>
      <button
        class="w-7 h-7 flex items-center justify-center rounded hover:bg-gray-200 disabled:opacity-30 transition-colors"
        :disabled="!canNext"
        @click="next"
      >
        <i class="fa-thin fa-chevron-right" />
      </button>
    </div>
    <div v-else />

    <!-- Rechts: Ansicht (getrennt) -->
    <div class="flex rounded-md border border-gray-200 overflow-hidden text-xs">
      <button
        class="px-3 py-1.5 transition-colors"
        :class="uiStore.layoutMode === 'partei' ? 'bg-primary-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'"
        @click="uiStore.setLayoutMode('partei')"
      >
        <i class="fa-thin fa-flag mr-1" />Partei
      </button>
      <button
        v-if="gameStore.hasThema"
        class="px-3 py-1.5 transition-colors"
        :class="uiStore.layoutMode === 'thema' ? 'bg-primary-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'"
        @click="uiStore.setLayoutMode('thema')"
      >
        <i class="fa-thin fa-tags mr-1" />Thema
      </button>
      <button
        class="px-3 py-1.5 transition-colors border-l border-gray-200"
        :class="uiStore.layoutMode === 'druck' ? 'bg-primary-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'"
        @click="uiStore.setLayoutMode('druck')"
      >
        <i class="fa-thin fa-print mr-1" />Druck
      </button>
    </div>
  </div>
</template>
