<script setup lang="ts">
import { ref } from 'vue'
import { useDragDrop } from '@/composables/useDragDrop'
import { parseExcelFile } from '@/utils/excelParser'
import { useUiStore } from '@/stores/useUiStore'
import { useGameStore } from '@/stores/useGameStore'

const uiStore = useUiStore()
const gameStore = useGameStore()

const error = ref('')
const loading = ref(false)
const withThema = ref(true)

async function handleFile(file: File) {
  error.value = ''
  loading.value = true
  try {
    const parsed = await parseExcelFile(file, withThema.value)
    uiStore.setPendingImport(parsed)
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Fehler beim Lesen der Datei.'
  } finally {
    loading.value = false
  }
}

const { isDragging, onDragOver, onDragLeave, onDrop, onFileInput } = useDragDrop(
  handleFile,
  ['.xlsx', '.xls', '.ods', '.csv']
)
</script>

<template>
  <div class="p-4 space-y-4">
    <p class="text-sm text-gray-600">
      Importiere eine Excel-Tabelle: Spalten = Parteien, Zeilen = Statements.
    </p>

    <!-- Mit/Ohne Thema -->
    <div data-tour="structure-toggle" class="space-y-1">
      <div class="text-xs font-medium text-gray-700">Tabellenstruktur</div>
      <div class="flex rounded-md border border-gray-200 overflow-hidden text-xs">
        <button
          class="flex-1 px-3 py-2 transition-colors"
          :class="withThema ? 'bg-primary-600 text-white font-medium' : 'bg-white hover:bg-gray-50 text-gray-700'"
          @click="withThema = true"
        >
          Mit Thema
          <div class="font-normal opacity-80 mt-0.5" :class="withThema ? 'text-primary-100' : 'text-gray-400'">
            Spalte 1 = Thema, Spalten 2+ = Parteien
          </div>
        </button>
        <button
          class="flex-1 px-3 py-2 transition-colors border-l border-gray-200"
          :class="!withThema ? 'bg-primary-600 text-white font-medium' : 'bg-white hover:bg-gray-50 text-gray-700'"
          @click="withThema = false"
        >
          Ohne Thema
          <div class="font-normal opacity-80 mt-0.5" :class="!withThema ? 'text-primary-100' : 'text-gray-400'">
            Alle Spalten = Parteien
          </div>
        </button>
      </div>
    </div>

    <!-- Drop-Zone -->
    <div
      data-tour="drop-zone"
      class="border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer"
      :class="isDragging ? 'border-primary-500 bg-primary-50' : 'border-gray-300 hover:border-gray-400'"
      @dragover="onDragOver"
      @dragleave="onDragLeave"
      @drop="onDrop"
      @click="($refs.fileInput as HTMLInputElement).click()"
    >
      <div v-if="loading" class="text-sm text-gray-500">Wird geladen…</div>
      <div v-else>
        <i class="fa-thin fa-file-arrow-up text-2xl text-gray-400 mb-1" />
        <div class="text-sm text-gray-600">
          Datei hier ablegen oder <span class="text-primary-600 underline">durchsuchen</span>
        </div>
        <div class="text-xs text-gray-400 mt-1">.xlsx · .xls · .ods · .csv</div>
      </div>
    </div>

    <input
      ref="fileInput"
      type="file"
      accept=".xlsx,.xls,.ods,.csv"
      class="sr-only"
      @change="onFileInput"
    />

    <!-- Fehler -->
    <div v-if="error" class="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
      {{ error }}
    </div>

    <!-- Vorhandene Daten -->
    <div v-if="gameStore.hasData" class="text-xs text-gray-500 border-t border-gray-100 pt-3">
      Geladen: {{ gameStore.parties.length }} Parteien · {{ gameStore.statements.length }} Statements
      · {{ Object.keys(gameStore.cards).length }} Karten
    </div>
  </div>
</template>
