<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUiStore } from '@/stores/useUiStore'
import { useGameStore } from '@/stores/useGameStore'

const uiStore = useUiStore()
const gameStore = useGameStore()

const pending = computed(() => uiStore.pendingImport)
const confirmingOverwrite = ref(false)

const partyNames = computed(() =>
  pending.value?.parties.map(p => p.name) ?? []
)

const previewRows = computed(() =>
  (pending.value?.rows ?? []).slice(0, 10)
)

function confirm() {
  if (!pending.value) return
  if (gameStore.hasData && !confirmingOverwrite.value) {
    confirmingOverwrite.value = true
    return
  }
  gameStore.importFromExcel(pending.value)
  uiStore.closeImportDialog()
  uiStore.setCurrentPage(0)
  uiStore.selectCard(null)
}

function cancel() {
  confirmingOverwrite.value = false
  uiStore.cancelImport()
}
</script>

<template>
  <div v-if="pending" class="p-4 space-y-4">
    <h2 class="text-base font-semibold text-gray-800">Import-Vorschau</h2>

    <div class="text-sm text-gray-600">
      <strong>{{ partyNames.length }}</strong> Parteien ·
      <strong>{{ pending.rows.length }}</strong> Statements
    </div>

    <!-- Tabellen-Vorschau -->
    <div class="overflow-x-auto border border-gray-200 rounded-lg">
      <table class="text-xs min-w-full">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th class="px-2 py-1.5 text-left font-medium border-r border-gray-200">Thema</th>
            <th
              v-for="name in partyNames"
              :key="name"
              class="px-2 py-1.5 text-left font-medium border-r border-gray-200 last:border-r-0"
            >
              {{ name }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, i) in previewRows"
            :key="i"
            class="border-t border-gray-100 odd:bg-white even:bg-gray-50"
          >
            <td class="px-2 py-1 text-gray-500 border-r border-gray-100">{{ row.label || `#${i + 1}` }}</td>
            <td
              v-for="name in partyNames"
              :key="name"
              class="px-2 py-1 border-r border-gray-100 last:border-r-0 max-w-[120px]"
            >
              <span class="truncate block">
                {{ pending.rows[i]?.cells[name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')] || '–' }}
              </span>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="pending.rows.length > 10" class="text-xs text-gray-400 text-center py-1 border-t border-gray-100">
        … {{ pending.rows.length - 10 }} weitere Zeilen
      </div>
    </div>

    <!-- Überschreib-Warnung -->
    <div v-if="confirmingOverwrite" class="rounded-lg border border-amber-300 bg-amber-50 p-3 space-y-2">
      <div class="text-sm font-medium text-amber-900">Bestehende Daten überschreiben?</div>
      <div class="text-xs text-amber-800">
        Alle bearbeiteten Texte, Schriftgrößen und kartenspezifische Bilder gehen unwiderruflich verloren.
      </div>
      <div class="flex gap-2 pt-1">
        <button
          class="flex-1 py-1.5 px-3 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 transition-colors font-medium"
          @click="confirm"
        >
          Trotzdem importieren
        </button>
        <button
          class="py-1.5 px-3 border border-gray-300 text-xs rounded-md hover:bg-gray-50 transition-colors"
          @click="confirmingOverwrite = false"
        >
          Zurück
        </button>
      </div>
    </div>

    <!-- Normale Aktionen -->
    <div v-else class="flex gap-2">
      <button
        class="flex-1 py-2 px-4 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors font-medium"
        @click="confirm"
      >
        Importieren
      </button>
      <button
        class="py-2 px-4 border border-gray-300 text-sm rounded-md hover:bg-gray-50 transition-colors"
        @click="cancel"
      >
        Abbrechen
      </button>
    </div>
  </div>
</template>
