<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { useUiStore } from '@/stores/useUiStore'

const gameStore = useGameStore()
const uiStore = useUiStore()

const withThema = ref(true)

function create() {
  gameStore.initManual(withThema.value)
  uiStore.closeDataDialog()
  withThema.value = true
}

function close() {
  uiStore.closeDataDialog()
  withThema.value = true
}
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div v-if="uiStore.showDataDialog" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <!-- Backdrop -->
        <div class="absolute inset-0 bg-black/40" @click="close" />

        <!-- Dialog -->
        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-sm flex flex-col">

          <!-- Header -->
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-100">
            <h2 class="text-sm font-semibold text-gray-900">Neues Projekt</h2>
            <button
              class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors"
              @click="close"
            >
              <i class="fa-thin fa-xmark" />
            </button>
          </div>

          <!-- Body -->
          <div class="p-5 space-y-3">
            <div class="text-xs font-medium text-gray-700">Struktur</div>
            <div class="flex rounded-md border border-gray-200 overflow-hidden text-xs">
              <button
                class="flex-1 px-3 py-2 transition-colors"
                :class="withThema ? 'bg-primary-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'"
                @click="withThema = true"
              >
                Mit Thema
              </button>
              <button
                class="flex-1 px-3 py-2 transition-colors border-l border-gray-200"
                :class="!withThema ? 'bg-primary-600 text-white' : 'bg-white hover:bg-gray-50 text-gray-700'"
                @click="withThema = false"
              >
                Ohne Thema
              </button>
            </div>
            <p class="text-xs text-gray-400">
              <template v-if="withThema">
                Karten sind Themen zugeordnet. Themen und Parteien werden nach der Erstellung im Tab „Daten" verwaltet.
              </template>
              <template v-else>
                Karten sind nur Parteien zugeordnet, ohne Themenstruktur. Parteien werden im Tab „Daten" verwaltet.
              </template>
            </p>
          </div>

          <!-- Footer -->
          <div class="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100">
            <button
              class="text-sm px-4 py-2 rounded-md border border-gray-300 hover:bg-gray-50 transition-colors"
              @click="close"
            >
              Abbrechen
            </button>
            <button
              class="text-sm px-4 py-2 rounded-md bg-primary-600 text-white hover:bg-primary-700 transition-colors font-medium"
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
