<script setup lang="ts">
import { useUiStore } from '@/stores/useUiStore'

const uiStore = useUiStore()

const name = import.meta.env.VITE_VEREIN_NAME
const vorstand = import.meta.env.VITE_VEREIN_VORSTAND
const email = import.meta.env.VITE_VEREIN_EMAIL
</script>

<template>
  <Teleport to="body">
    <Transition name="dialog">
      <div
        v-if="uiStore.showDatenschutzDialog"
        class="fixed inset-0 z-50 flex items-center justify-center"
      >
        <div class="absolute inset-0 bg-black/40" @click="uiStore.closeDatenschutzDialog()" />

        <div class="relative bg-white rounded-xl shadow-2xl w-full max-w-lg mx-4 overflow-hidden flex flex-col max-h-[85vh]">
          <div class="flex items-center justify-between px-5 py-4 border-b border-gray-200 shrink-0">
            <h2 class="text-base font-semibold text-gray-900">Datenschutzerklärung</h2>
            <button
              class="w-7 h-7 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors text-sm"
              title="Schließen"
              @click="uiStore.closeDatenschutzDialog()"
            >
              <i class="fa-thin fa-xmark" />
            </button>
          </div>

          <div class="px-5 py-5 text-sm text-gray-700 space-y-4 overflow-y-auto">
            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Verantwortlicher</p>
              <p class="font-semibold text-gray-900">{{ name }}</p>
              <p>vertreten durch: {{ vorstand }}</p>
              <a :href="`mailto:${email}`" class="text-primary-600 hover:underline">{{ email }}</a>
            </div>

            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Grundsatz</p>
              <p>
                Dieses Tool verarbeitet <strong>keine personenbezogenen Daten</strong>.
                Alle Eingaben verbleiben ausschließlich im Arbeitsspeicher Ihres Browsers und
                werden beim Schließen oder Neuladen der Seite unwiederbringlich gelöscht.
                Es findet keine Übertragung an einen Server statt.
              </p>
            </div>

            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Cookies</p>
              <p>Dieses Tool setzt <strong>keine Cookies</strong>.</p>
            </div>

            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Hosting &amp; Serverprotokolle</p>
              <p>
                Beim Aufruf dieser Seite können durch den Hosting-Anbieter technische
                Zugriffsdaten (z.&nbsp;B. IP-Adresse, Uhrzeit, aufgerufene URL) als Server-Log
                gespeichert werden. Diese Daten werden vom Hosting-Anbieter zur Sicherstellung
                des Betriebs verarbeitet und sind für uns nicht einsehbar.
              </p>
            </div>

            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Ihre Rechte (Art. 15–21 DSGVO)</p>
              <p>
                Sie haben das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der
                Verarbeitung sowie Datenübertragbarkeit. Da wir keine personenbezogenen Daten
                verarbeiten, liegen bei uns keine Daten über Sie vor. Für Anfragen wenden Sie
                sich an:
              </p>
              <a :href="`mailto:${email}`" class="text-primary-600 hover:underline">{{ email }}</a>
            </div>

            <div>
              <p class="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-1">Beschwerderecht</p>
              <p>
                Sie haben das Recht, sich bei einer Datenschutz-Aufsichtsbehörde zu beschweren,
                insbesondere in dem Mitgliedstaat Ihres gewöhnlichen Aufenthaltsorts.
              </p>
            </div>
          </div>

          <div class="px-5 py-3 border-t border-gray-100 flex justify-end shrink-0">
            <button
              class="px-4 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-sm text-gray-700 transition-colors"
              @click="uiStore.closeDatenschutzDialog()"
            >
              Schließen
            </button>
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
