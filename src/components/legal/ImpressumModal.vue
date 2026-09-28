<script setup lang="ts">
import { useUiStore } from '@/stores/useUiStore'

const uiStore = useUiStore()

const name = import.meta.env.VITE_VEREIN_NAME
const strasse = import.meta.env.VITE_VEREIN_STRASSE
const plz = import.meta.env.VITE_VEREIN_PLZ
const ort = import.meta.env.VITE_VEREIN_ORT
const vorstand = import.meta.env.VITE_VEREIN_VORSTAND
const email = import.meta.env.VITE_VEREIN_EMAIL
const registergericht = import.meta.env.VITE_VEREIN_REGISTERGERICHT
const registernummer = import.meta.env.VITE_VEREIN_REGISTERNUMMER
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="uiStore.showImpressumDialog"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div class="absolute inset-0 bg-black/40" @click="uiStore.closeImpressumDialog()" />

        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden">
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200">
            <h2 class="text-base font-semibold text-gray-900">Impressum</h2>
            <button
              class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-sm"
              title="Schließen"
              @click="uiStore.closeImpressumDialog()"
            >
              <i class="fa-thin fa-xmark" />
            </button>
          </div>

          <div class="px-5 py-5 text-sm text-gray-700 space-y-4">
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Angaben gemäß § 5 DDG</p>
              <p class="font-semibold text-gray-900">{{ name }}</p>
              <p>{{ strasse }}</p>
              <p>{{ plz }} {{ ort }}</p>
            </div>

            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Vertreten durch</p>
              <p>{{ vorstand }}</p>
            </div>

            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Kontakt</p>
              <a :href="`mailto:${email}`" class="text-primary-600 hover:underline">{{ email }}</a>
            </div>

            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Vereinsregister</p>
              <p>{{ registergericht }}</p>
              <p>Registernummer: {{ registernummer }}</p>
            </div>
          </div>

          <div class="px-5 py-3 border-t border-gray-100 flex justify-end">
            <button
              class="px-4 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 transition-colors"
              @click="uiStore.closeImpressumDialog()"
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
