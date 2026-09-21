<script setup lang="ts">
import { computed, ref } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { useUiStore } from '@/stores/useUiStore'
import TipTapEditor from './TipTapEditor.vue'

const gameStore = useGameStore()
const uiStore = useUiStore()

const card = computed(() =>
  uiStore.selectedCardId ? gameStore.cards[uiStore.selectedCardId] : null
)

const party = computed(() =>
  card.value ? gameStore.getPartyById(card.value.partyId) : null
)

const statement = computed(() =>
  card.value ? gameStore.getStatementById(card.value.statementId) : null
)

const htmlContent = computed({
  get: () => card.value?.htmlContent ?? '',
  set: (val: string) => {
    if (card.value) gameStore.updateCardContent(card.value.id, val)
  },
})

const effectiveFontSize = computed(
  () => card.value?.fontSizeOverride ?? gameStore.globalFontSize
)

function setFontSize(e: Event) {
  if (!card.value) return
  const val = Number((e.target as HTMLInputElement).value)
  gameStore.setCardFontSize(card.value.id, val === gameStore.globalFontSize ? null : val)
}

function resetFontSize() {
  if (card.value) gameStore.setCardFontSize(card.value.id, null)
}

// --- Karte löschen ---
const confirmingDelete = ref(false)

function deleteCard() {
  if (!card.value) return
  gameStore.deleteCard(card.value.id)
  uiStore.selectedCardId = null
  confirmingDelete.value = false
}



</script>

<template>
  <div v-if="card" class="flex flex-col gap-3 p-3">
    <!-- Karten-Info -->
    <div class="text-xs text-gray-500 border-b border-gray-100 pb-2">
      <div class="font-semibold text-gray-700">
        {{ party?.name ?? '–' }}
        <span class="font-normal text-gray-400 ml-1">(Partei {{ party?.code }})</span>
      </div>
      <div class="truncate mt-0.5">{{ statement?.label ?? '–' }}</div>
    </div>

    <!-- WYSIWYG -->
    <TipTapEditor v-model="htmlContent" />

    <!-- Overflow-Warnung -->
    <div v-if="card.isOverflowing" class="flex items-center gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded px-2 py-1">
      <i class="fa-thin fa-circle-exclamation" />
      Text zu groß – Inhalt wird auf der Karte abgeschnitten.
    </div>

    <!-- Schriftgröße pro Karte -->
    <div class="space-y-1">
      <div class="flex items-center justify-between">
        <label class="text-xs text-gray-600 font-medium">Schriftgröße</label>
        <button
          v-if="card.fontSizeOverride !== null"
          class="text-xs text-primary-600 hover:underline"
          @click="resetFontSize"
        >
          Zurücksetzen
        </button>
      </div>
      <div class="flex items-center gap-2">
        <input
          type="range"
          min="8"
          max="24"
          :value="effectiveFontSize"
          class="flex-1 h-1.5 accent-primary-600"
          @input="setFontSize"
        />
        <span class="text-xs w-8 text-right text-gray-700">{{ effectiveFontSize }}px</span>
      </div>
      <div v-if="card.fontSizeOverride !== null" class="text-xs text-amber-600">
        Individuelle Größe aktiv (global: {{ gameStore.globalFontSize }}px)
      </div>
    </div>

    <!-- Karte löschen -->
    <div class="border-t border-gray-100 pt-3">
      <div v-if="confirmingDelete" class="rounded bg-red-50 px-2 py-2">
        <div class="text-xs text-red-700 mb-1.5">Diese Karte wirklich löschen?</div>
        <div class="flex gap-1">
          <button
            class="flex-1 text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            @click="deleteCard"
          >Löschen</button>
          <button
            class="flex-1 text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors"
            @click="confirmingDelete = false"
          >Abbrechen</button>
        </div>
      </div>
      <button
        v-else
        class="w-full text-xs px-3 py-1.5 border border-red-200 text-red-500 rounded hover:bg-red-50 transition-colors"
        @click="confirmingDelete = true"
      >
        <i class="fa-thin fa-trash mr-1" /> Karte löschen
      </button>
    </div>

  </div>

  <div v-else class="p-4 text-sm text-gray-400 text-center">
    Karte in der Vorschau anklicken zum Bearbeiten
  </div>
</template>
