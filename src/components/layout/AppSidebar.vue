<script setup lang="ts">
import { ref, computed } from 'vue'
import { useUiStore } from '@/stores/useUiStore'
import { useGameStore } from '@/stores/useGameStore'
import CardEditor from '@/components/editor/CardEditor.vue'
import TextSizeControls from '@/components/controls/TextSizeControls.vue'
import ImageUploadWidget from '@/components/controls/ImageUploadWidget.vue'
import DataSection from '@/components/data/DataSection.vue'

const uiStore = useUiStore()
const gameStore = useGameStore()

const activeSection = computed({
  get: () => uiStore.activeSidebarSection,
  set: (v) => { uiStore.activeSidebarSection = v },
})
const openAccordionId = ref<string | null>(null)

const selectedCard = computed(() =>
  uiStore.selectedCardId ? gameStore.cards[uiStore.selectedCardId] : null
)
const selectedParty = computed(() =>
  selectedCard.value ? gameStore.getPartyById(selectedCard.value.partyId) : null
)
const selectedStatement = computed(() =>
  selectedCard.value ? gameStore.getStatementById(selectedCard.value.statementId) : null
)
</script>

<template>
  <aside class="w-80 flex flex-col border-r border-gray-200 bg-gray-50 shrink-0 overflow-hidden">

    <!-- Abschnitts-Buttons -->
    <div class="flex border-b border-gray-200 bg-white shrink-0">
      <button
        class="flex-1 text-xs py-2.5 font-medium transition-colors border-b-2"
        :class="activeSection === 'schrift'
          ? 'border-primary-600 text-primary-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'"
        @click="activeSection = 'schrift'"
      >
        <span data-tour="sidebar-schrift">Schrift</span>
      </button>
      <button
        class="flex-1 text-xs py-2.5 font-medium transition-colors border-b-2"
        :class="activeSection === 'bilder'
          ? 'border-primary-600 text-primary-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'"
        @click="activeSection = 'bilder'"
      >
        <span data-tour="sidebar-bilder">Bilder</span>
      </button>
      <button
        class="flex-1 text-xs py-2.5 font-medium transition-colors border-b-2"
        :class="activeSection === 'daten'
          ? 'border-primary-600 text-primary-600'
          : 'border-transparent text-gray-500 hover:text-gray-700'"
        @click="activeSection = 'daten'"
      >
        Daten
      </button>
    </div>

    <!-- Inhalt -->
    <div class="flex-1 overflow-y-auto">

      <!-- ── SCHRIFT ──────────────────────────────────── -->
      <template v-if="activeSection === 'schrift'">
        <!-- Selektiert -->
        <div class="border-b border-gray-200">
          <div class="px-3 pt-2 pb-0.5 text-xs text-gray-400">Selektiert</div>
          <CardEditor />
        </div>
        <!-- Global -->
        <div>
          <div class="px-3 pt-2 pb-0.5 text-xs text-gray-400">Global</div>
          <TextSizeControls />
        </div>
      </template>

      <!-- ── BILDER ──────────────────────────────────── -->
      <template v-else-if="activeSection === 'bilder'">
        <!-- Global -->
        <div>
          <div class="px-3 pt-2 pb-0.5 text-xs text-gray-400">Global</div>
          <div class="p-3 pt-2 space-y-4">

            <!-- Globales Vorderseitenbild -->
            <ImageUploadWidget
              :model-value="gameStore.cardFrontGlobalImage"
              label="Vorderseitenbild (global)"
              :show-hint="true"
              @update:model-value="gameStore.setCardFrontGlobalImage($event)"
            />

            <!-- Kartenrücken-Bild -->
            <ImageUploadWidget
              :model-value="gameStore.cardBackImage"
              label="Kartenrücken-Bild"
              :show-hint="true"
              @update:model-value="gameStore.setCardBackImage($event)"
            />

            <!-- Variante je Partei / je Thema (nur mit Thema-Daten) -->
            <div v-if="gameStore.hasData && gameStore.hasThema">
              <div class="text-xs font-medium text-gray-700 mb-1.5">Variante</div>
              <div class="flex rounded-md border border-gray-200 overflow-hidden text-xs">
                <button
                  class="flex-1 px-3 py-1.5 transition-colors"
                  :class="gameStore.frontImageGrouping === 'partei'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white hover:bg-gray-50 text-gray-700'"
                  @click="gameStore.setFrontImageGrouping('partei')"
                >
                  Je Partei
                </button>
                <button
                  class="flex-1 px-3 py-1.5 transition-colors border-l border-gray-200"
                  :class="gameStore.frontImageGrouping === 'thema'
                    ? 'bg-primary-600 text-white'
                    : 'bg-white hover:bg-gray-50 text-gray-700'"
                  @click="gameStore.setFrontImageGrouping('thema')"
                >
                  Je Thema
                </button>
              </div>
            </div>

            <!-- Partei-Akkordeon -->
            <div
              v-if="gameStore.hasData && gameStore.parties.length > 0 && gameStore.frontImageGrouping === 'partei'"
            >
              <div class="text-xs font-medium text-gray-700 mb-1">Vorderseitenbild je Partei</div>
              <div class="border border-gray-200 rounded-lg overflow-hidden">
                <div
                  v-for="party in gameStore.parties"
                  :key="party.id"
                  class="border-t border-gray-100 first:border-t-0"
                >
                  <button
                    class="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-gray-100 transition-colors"
                    :class="openAccordionId === party.id ? 'text-primary-600 font-medium' : 'text-gray-700'"
                    @click="openAccordionId = openAccordionId === party.id ? null : party.id"
                  >
                    <span class="truncate">{{ party.name }}</span>
                    <span class="flex items-center gap-1 shrink-0 ml-2">
                      <span
                        v-if="gameStore.cardFrontPartyImages[party.id]"
                        class="w-1.5 h-1.5 rounded-full bg-primary-500"
                        title="Bild vorhanden"
                      />
                      <i class="fa-thin text-gray-400 text-xs" :class="openAccordionId === party.id ? 'fa-chevron-up' : 'fa-chevron-down'" />
                    </span>
                  </button>
                  <div v-if="openAccordionId === party.id" class="px-3 pb-3">
                    <ImageUploadWidget
                      :model-value="gameStore.cardFrontPartyImages[party.id] ?? null"
                      @update:model-value="gameStore.setCardFrontPartyImage(party.id, $event)"
                    />
                  </div>
                </div>
              </div>
            </div>

            <!-- Thema-Akkordeon -->
            <div
              v-if="gameStore.hasData && gameStore.hasThema && gameStore.frontImageGrouping === 'thema' && gameStore.statements.length > 0"
            >
              <div class="text-xs font-medium text-gray-700 mb-1">Vorderseitenbild je Thema</div>
              <div class="border border-gray-200 rounded-lg overflow-hidden">
                <div
                  v-for="stmt in gameStore.statements"
                  :key="stmt.id"
                  class="border-t border-gray-100 first:border-t-0"
                >
                  <button
                    class="w-full flex items-center justify-between px-3 py-2 text-xs hover:bg-gray-100 transition-colors"
                    :class="openAccordionId === stmt.id ? 'text-primary-600 font-medium' : 'text-gray-700'"
                    @click="openAccordionId = openAccordionId === stmt.id ? null : stmt.id"
                  >
                    <span class="truncate">{{ stmt.label }}</span>
                    <span class="flex items-center gap-1 shrink-0 ml-2">
                      <span
                        v-if="gameStore.cardFrontThemaImages[stmt.id]"
                        class="w-1.5 h-1.5 rounded-full bg-primary-500"
                        title="Bild vorhanden"
                      />
                      <i class="fa-thin text-gray-400 text-xs" :class="openAccordionId === stmt.id ? 'fa-chevron-up' : 'fa-chevron-down'" />
                    </span>
                  </button>
                  <div v-if="openAccordionId === stmt.id" class="px-3 pb-3">
                    <ImageUploadWidget
                      :model-value="gameStore.cardFrontThemaImages[stmt.id] ?? null"
                      @update:model-value="gameStore.setCardFrontThemaImage(stmt.id, $event)"
                    />
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </template>

      <!-- ── DATEN ──────────────────────────────────── -->
      <template v-else-if="activeSection === 'daten'">
        <DataSection />
      </template>

    </div>
  </aside>
</template>
