<script setup lang="ts">
import { computed } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { useUiStore } from '@/stores/useUiStore'
import TipTapEditor from './TipTapEditor.vue'

const gameStore = useGameStore()
const uiStore = useUiStore()

const card = computed(() =>
  uiStore.selectedCardId ? gameStore.cards[uiStore.selectedCardId] : null
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

function setParty(e: Event) {
  if (!card.value) return
  const val = (e.target as HTMLSelectElement).value
  gameStore.setCardParty(card.value.id, val || null)
}

function setStatement(e: Event) {
  if (!card.value) return
  const val = (e.target as HTMLSelectElement).value
  gameStore.setCardStatement(card.value.id, val || null)
}
</script>

<template>
  <div v-if="card" class="flex flex-col gap-3 p-3">
    <!-- Zuweisung -->
    <div class="space-y-2 border-b border-gray-100 pb-3">
      <div>
        <label class="text-xs text-gray-500 mb-0.5 block">Partei</label>
        <select
          :value="card.partyId ?? ''"
          class="w-full text-xs border border-gray-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-primary-400"
          @change="setParty"
        >
          <option value="">Ohne Partei</option>
          <option v-for="p in gameStore.parties" :key="p.id" :value="p.id">{{ p.name }}</option>
        </select>
      </div>
      <div v-if="gameStore.hasThema">
        <label class="text-xs text-gray-500 mb-0.5 block">Thema</label>
        <select
          :value="card.statementId ?? ''"
          class="w-full text-xs border border-gray-200 rounded px-2 py-1.5 bg-white focus:outline-none focus:border-primary-400"
          @change="setStatement"
        >
          <option value="">Ohne Thema</option>
          <option v-for="s in gameStore.statements" :key="s.id" :value="s.id">{{ s.label }}</option>
        </select>
      </div>
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
  </div>

  <div v-else class="p-4 text-sm text-gray-400 text-center">
    Karte in der Vorschau anklicken zum Bearbeiten
  </div>
</template>
