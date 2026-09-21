<script setup lang="ts">
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { useUiStore } from '@/stores/useUiStore'

const gameStore = useGameStore()
const uiStore = useUiStore()

const open = ref(false)

const overflowing = computed(() => gameStore.overflowingCards)

function jumpToCard(cardId: string) {
  const page = gameStore.getPageForCard(cardId)
  uiStore.setCurrentPage(page)
  uiStore.previewMode = 'vorderseiten'
  uiStore.selectCard(cardId)
  open.value = false
}
</script>

<template>
  <Teleport to="body">
    <template v-if="overflowing.length > 0">
      <!-- Backdrop -->
      <div
        v-if="open"
        class="fixed inset-0 z-40"
        @click="open = false"
      />

      <!-- Container -->
      <div class="fixed bottom-5 right-5 z-50 flex flex-col items-end gap-2">

        <!-- Popup -->
        <Transition
          enter-active-class="transition-all duration-150"
          enter-from-class="opacity-0 translate-y-1"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-100"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 translate-y-1"
        >
          <div
            v-if="open"
            class="bg-white rounded-xl shadow-xl border border-gray-200 w-72 overflow-hidden"
          >
            <div class="px-3 py-2.5 border-b border-gray-100 flex items-center gap-2">
              <i class="fa-thin fa-triangle-exclamation text-red-500 text-sm" />
              <span class="text-xs font-semibold text-gray-800">
                {{ overflowing.length }} Karte{{ overflowing.length !== 1 ? 'n' : '' }} mit Textüberlauf
              </span>
            </div>
            <div class="max-h-64 overflow-y-auto">
              <button
                v-for="card in overflowing"
                :key="card.id"
                class="w-full text-left px-3 py-2 text-xs hover:bg-red-50 transition-colors border-b border-gray-50 last:border-0"
                @click="jumpToCard(card.id)"
              >
                <div class="font-medium text-gray-800">
                  {{ gameStore.getPartyById(card.partyId)?.name }}
                </div>
                <div class="text-gray-400 truncate">
                  {{ gameStore.getStatementById(card.statementId)?.label }}
                </div>
              </button>
            </div>
          </div>
        </Transition>

        <!-- Floating Button -->
        <button
          class="w-12 h-12 bg-red-500 hover:bg-red-600 text-white rounded-full shadow-lg flex items-center justify-center transition-colors"
          :title="`${overflowing.length} Karte${overflowing.length !== 1 ? 'n' : ''} mit Textüberlauf`"
          @click="open = !open"
        >
          <i class="fa-thin fa-triangle-exclamation text-lg" />
        </button>
      </div>
    </template>
  </Teleport>
</template>
