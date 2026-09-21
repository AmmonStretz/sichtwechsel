<script setup lang="ts">
import { ref, computed, nextTick } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { useUiStore } from '@/stores/useUiStore'

const gameStore = useGameStore()
const uiStore = useUiStore()

const parties = ref<string[]>([''])

function addPartyField() {
  parties.value.push('')
  nextTick(() => {
    const inputs = document.querySelectorAll<HTMLInputElement>('.party-input')
    inputs[inputs.length - 1]?.focus()
  })
}

function removePartyField(i: number) {
  if (parties.value.length > 1) parties.value.splice(i, 1)
  else parties.value[0] = ''
}

const validParties = computed(() => parties.value.map(s => s.trim()).filter(Boolean))

const canCreate = computed(() => validParties.value.length > 0)

function create() {
  if (!canCreate.value) return
  for (const name of validParties.value) gameStore.addParty(name)
  uiStore.closeDataDialog()
  reset()
}

function reset() {
  parties.value = ['']
}

function close() {
  uiStore.closeDataDialog()
  reset()
}
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="uiStore.showDataDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40" @click="close" />

        <!-- Dialog -->
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col max-h-[90vh]">

          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
            <h2 class="text-sm font-semibold text-gray-900">Parteien anlegen</h2>
            <button
              class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              @click="close"
            >
              <i class="fa-thin fa-xmark" />
            </button>
          </div>

          <!-- Body -->
          <div class="flex-1 overflow-y-auto p-5">
            <p class="text-xs text-gray-500 mb-3">
              Gib die Parteinamen ein. Karten werden anschließend im Tab „Daten" hinzugefügt.
            </p>
            <div class="space-y-1.5">
              <div
                v-for="(_, i) in parties"
                :key="i"
                class="flex items-center gap-1"
              >
                <input
                  v-model="parties[i]"
                  class="party-input flex-1 text-xs border border-gray-200 rounded px-2 py-1.5 focus:outline-none focus:border-primary-400"
                  :placeholder="`Partei ${i + 1}`"
                  @keydown.enter="addPartyField"
                />
                <button
                  class="w-6 h-6 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shrink-0"
                  @click="removePartyField(i)"
                >
                  <i class="fa-thin fa-xmark text-xs" />
                </button>
              </div>
            </div>
            <button
              class="mt-2 w-full text-xs text-primary-600 border border-dashed border-primary-300 rounded py-1 hover:bg-primary-50 transition-colors"
              @click="addPartyField"
            >
              <i class="fa-thin fa-plus mr-1" /> Partei hinzufügen
            </button>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 shrink-0">
            <button
              class="text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
              @click="close"
            >
              Abbrechen
            </button>
            <button
              :disabled="!canCreate"
              class="text-sm px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors font-medium"
              @click="create"
            >
              Erstellen
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
