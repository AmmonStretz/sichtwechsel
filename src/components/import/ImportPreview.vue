<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useUiStore } from '@/stores/useUiStore'
import { useGameStore } from '@/stores/useGameStore'
import type { ParsedExcel } from '@/types'

const uiStore = useUiStore()
const gameStore = useGameStore()

const pending = computed(() => uiStore.pendingImport)
const confirmingOverwrite = ref(false)

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

function deepCopy(data: ParsedExcel): ParsedExcel {
  return {
    hasThema: data.hasThema,
    parties: data.parties.map(p => ({ ...p })),
    rows: data.rows.map(r => ({ label: r.label, cells: { ...r.cells } })),
  }
}

const editablePending = ref<ParsedExcel | null>(null)

watch(pending, (val) => {
  editablePending.value = val ? deepCopy(val) : null
}, { immediate: true })

const partyKeys = computed(() =>
  editablePending.value?.parties.map(p => slugify(p.name)) ?? []
)

function removeParty(idx: number) {
  if (!editablePending.value) return
  const key = partyKeys.value[idx]
  editablePending.value.parties.splice(idx, 1)
  for (const row of editablePending.value.rows) {
    delete row.cells[key]
  }
}

function removeRow(idx: number) {
  if (!editablePending.value) return
  editablePending.value.rows.splice(idx, 1)
}

function confirm() {
  if (!editablePending.value) return
  if (gameStore.hasData && !confirmingOverwrite.value) {
    confirmingOverwrite.value = true
    return
  }
  gameStore.importFromExcel(editablePending.value)
  if (!gameStore.hasThema && uiStore.layoutMode === 'thema') uiStore.setLayoutMode('partei')
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
  <div v-if="editablePending" class="p-4 space-y-4">
    <h2 class="text-base font-semibold text-gray-800">Import-Vorschau</h2>

    <div class="text-sm text-gray-600">
      <strong>{{ editablePending.parties.length }}</strong> Parteien ·
      <strong>{{ editablePending.rows.length }}</strong> Statements
    </div>

    <!-- Tabellen-Vorschau -->
    <div class="overflow-x-auto border border-gray-200 rounded-lg">
      <table class="text-xs min-w-full">
        <thead class="bg-gray-50 text-gray-700">
          <tr>
            <th v-if="editablePending.hasThema" class="px-2 py-1.5 text-left font-medium border-r border-gray-200 text-gray-400">
              Thema
            </th>
            <th
              v-for="(party, pIdx) in editablePending.parties"
              :key="pIdx"
              class="px-2 py-1 text-left font-medium border-r border-gray-200 last:border-r-0"
            >
              <div class="flex items-center gap-1 min-w-0">
                <span class="truncate flex-1">{{ party.name }}</span>
                <button
                  class="shrink-0 w-4 h-4 flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors"
                  title="Spalte löschen"
                  @click="removeParty(pIdx)"
                >
                  <i class="fa-thin fa-xmark text-xs" />
                </button>
              </div>
            </th>
            <!-- Platzhalter für Zeilen-Löschen-Buttons -->
            <th class="w-6 border-l border-gray-200" />
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="(row, rIdx) in editablePending.rows"
            :key="rIdx"
            class="border-t border-gray-100 odd:bg-white even:bg-gray-50 group"
          >
            <td v-if="editablePending.hasThema" class="px-2 py-1 text-gray-500 border-r border-gray-100 whitespace-nowrap">
              {{ row.label || `#${rIdx + 1}` }}
            </td>
            <td
              v-for="(party, pIdx) in editablePending.parties"
              :key="pIdx"
              class="px-2 py-1 border-r border-gray-100 last:border-r-0 max-w-[120px]"
            >
              <span class="truncate block">
                {{ row.cells[partyKeys[pIdx]] || '–' }}
              </span>
            </td>
            <td class="border-l border-gray-100 w-6">
              <button
                class="w-6 h-full flex items-center justify-center text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100"
                title="Zeile löschen"
                @click="removeRow(rIdx)"
              >
                <i class="fa-thin fa-xmark text-xs" />
              </button>
            </td>
          </tr>
        </tbody>
      </table>
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
