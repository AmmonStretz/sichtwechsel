<script setup lang="ts">
import { useGameStore } from '@/stores/useGameStore'

const gameStore = useGameStore()

function setGlobal(e: Event) {
  gameStore.setGlobalFontSize(Number((e.target as HTMLInputElement).value))
}

function setMargin(e: Event) {
  gameStore.setGlobalMargin(Number((e.target as HTMLInputElement).value))
}

function setCodeColor(e: Event) {
  gameStore.setCodeColor((e.target as HTMLInputElement).value)
}

function setCodeFontSize(e: Event) {
  gameStore.setCodeFontSize(Number((e.target as HTMLInputElement).value))
}

function setCodeOpacity(e: Event) {
  gameStore.setCodeOpacity(Number((e.target as HTMLInputElement).value))
}

</script>

<template>
  <div class="p-3 space-y-3">
    <!-- Globale Schriftgröße -->
    <div class="space-y-1">
      <div class="flex items-center justify-between">
        <label class="text-xs font-medium text-gray-700">Globale Schriftgröße</label>
        <span class="text-xs text-gray-500">{{ gameStore.globalFontSize }}px</span>
      </div>
      <input
        type="range"
        min="8"
        max="24"
        :value="gameStore.globalFontSize"
        class="w-full h-1.5 accent-primary-600"
        @input="setGlobal"
      />
    </div>

    <!-- Globaler Sicherheitsrand -->
    <div class="space-y-1">
      <div class="flex items-center justify-between">
        <label class="text-xs font-medium text-gray-700">Sicherheitsrand</label>
        <span class="text-xs text-gray-500">{{ gameStore.globalMargin }} mm</span>
      </div>
      <input
        type="range"
        min="1"
        max="10"
        step="0.5"
        :value="gameStore.globalMargin"
        class="w-full h-1.5 accent-primary-600"
        @input="setMargin"
      />
    </div>

    <!-- Code-Einstellungen -->
    <div class="space-y-2">
      <label class="flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer select-none">
        <input
          type="checkbox"
          :checked="gameStore.showCode"
          class="accent-primary-600"
          @change="gameStore.setShowCode(!gameStore.showCode)"
        />
        Identifizierungscode anzeigen
      </label>

      <template v-if="gameStore.showCode">
        <div class="flex items-center justify-between gap-2">
          <label class="text-xs text-gray-600">Farbe</label>
          <label class="relative cursor-pointer">
            <span
              class="inline-block w-6 h-6 rounded border border-gray-300"
              :style="{ background: gameStore.codeColor }"
            />
            <input
              type="color"
              :value="gameStore.codeColor"
              class="sr-only"
              @input="setCodeColor"
            />
          </label>
        </div>

        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <label class="text-xs text-gray-600">Deckkraft</label>
            <span class="text-xs text-gray-500">{{ gameStore.codeOpacity }} %</span>
          </div>
          <input
            type="range"
            min="1"
            max="100"
            :value="gameStore.codeOpacity"
            class="w-full h-1.5 accent-primary-600"
            @input="setCodeOpacity"
          />
        </div>

        <div class="space-y-1">
          <div class="flex items-center justify-between">
            <label class="text-xs text-gray-600">Schriftgröße</label>
            <span class="text-xs text-gray-500">{{ gameStore.codeFontSize }} px</span>
          </div>
          <input
            type="range"
            min="4"
            max="18"
            step="0.5"
            :value="gameStore.codeFontSize"
            class="w-full h-1.5 accent-primary-600"
            @input="setCodeFontSize"
          />
        </div>
      </template>
    </div>

  </div>
</template>
