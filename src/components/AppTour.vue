<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted, onUnmounted } from 'vue'
import { useUiStore } from '@/stores/useUiStore'

const uiStore = useUiStore()

interface TourStep {
  target: string
  title: string
  description: string
  position: 'top' | 'bottom' | 'left' | 'right'
  onEnter?: () => void
}

const steps: TourStep[] = [
  {
    target: 'import-btn',
    title: 'Daten importieren',
    description: 'Hier lädst du jederzeit eine neue Excel-Tabelle. Der Dialog ist beim ersten Start automatisch geöffnet – du wirst vor dem Überschreiben bestehender Daten gewarnt.',
    position: 'bottom',
    onEnter: () => { if (uiStore.showImportDialog) uiStore.closeImportDialog() },
  },
  {
    target: 'structure-toggle',
    title: 'Tabellenstruktur',
    description: '„Mit Thema": Spalte 1 enthält das Thema-Label, Spalten 2+ sind Parteien. Gleiche Themen werden automatisch zusammengefasst, leere Felder erben das vorherige Thema.\n\n„Ohne Thema": Alle Spalten sind Parteien, Zeilen werden nummeriert.',
    position: 'bottom',
    onEnter: () => uiStore.openImportDialog(),
  },
  {
    target: 'drop-zone',
    title: 'Datei hochladen',
    description: 'Ziehe eine Excel-, ODS- oder CSV-Datei in diesen Bereich – oder klicke zum Durchsuchen. Du siehst eine Vorschau der erkannten Daten, bevor sie importiert werden.',
    position: 'top',
  },
  {
    target: 'pdf-btn',
    title: 'PDF exportieren',
    description: 'Erstellt ein druckfertiges PDF mit allen Seiten. Vorder- und Rückseiten wechseln sich automatisch ab – perfekt für den Duplexdruck.',
    position: 'bottom',
    onEnter: () => uiStore.closeImportDialog(),
  },
  {
    target: 'excel-btn',
    title: 'Excel exportieren',
    description: 'Exportiert die aktuell bearbeiteten Texte aller Karten als Excel-Datei – zum Teilen, Überprüfen oder Weiterbearbeiten.',
    position: 'bottom',
  },
  {
    target: 'sidebar-schrift',
    title: 'Schrift & Text',
    description: 'Bearbeite den Text der ausgewählten Karte direkt im WYSIWYG-Editor. Passe Schriftgrößen pro Karte oder global an. Textüberläufe werden rot markiert und können hier behoben werden.',
    position: 'right',
  },
  {
    target: 'sidebar-bilder',
    title: 'Hintergrundbilder',
    description: 'Lade Bilder für die Vorderseite hoch – pro Karte, je Partei oder global als Fallback. Bei Thema-Import kannst du auch je Thema unterschiedliche Bilder vergeben. Außerdem das Bild für den Kartenrücken.',
    position: 'right',
  },
  {
    target: 'mode-toggle',
    title: 'Vorder- und Rückseiten',
    description: 'Wechsle zwischen der Ansicht der Vorderseiten (mit Text und Identifikationscode) und der Rückseiten (mit deinem Hintergrundbild).',
    position: 'bottom',
  },
  {
    target: 'page-nav',
    title: 'Seitennavigation',
    description: 'Jede Seite enthält bis zu 8 Karten im 2×4-Raster. Blättere hier durch alle Seiten deiner Druckvorlage.',
    position: 'bottom',
  },
  {
    target: 'preview-area',
    title: 'Kartenvorschau',
    description: 'Hier siehst du die Karten maßstabsgetreu im A4-Format. Klicke auf eine Karte, um sie im Schrift-Bereich zu bearbeiten. Rote Badges zeigen Karten mit Textüberlauf.',
    position: 'top',
  },
]

const PADDING = 6
const spotlightRect = ref<{ top: number; left: number; width: number; height: number } | null>(null)

async function updatePosition() {
  await nextTick()
  const step = steps[uiStore.tourStep]
  if (!step) return
  const el = document.querySelector<HTMLElement>(`[data-tour="${step.target}"]`)
  if (el) {
    const r = el.getBoundingClientRect()
    spotlightRect.value = { top: r.top, left: r.left, width: r.width, height: r.height }
  } else {
    spotlightRect.value = null
  }
}

watch(
  () => uiStore.tourStep,
  async (step) => {
    steps[step]?.onEnter?.()
    await updatePosition()
  },
)

watch(
  () => uiStore.isTourActive,
  async (active) => {
    if (active) {
      steps[uiStore.tourStep]?.onEnter?.()
      await updatePosition()
    }
  },
)

function onResize() {
  if (uiStore.isTourActive) updatePosition()
}
onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))

const currentStep = computed(() => steps[uiStore.tourStep])
const isLast = computed(() => uiStore.tourStep === steps.length - 1)

const spotlightStyle = computed(() => {
  const r = spotlightRect.value
  if (!r) return { display: 'none' as const }
  return {
    position: 'fixed' as const,
    top: `${r.top - PADDING}px`,
    left: `${r.left - PADDING}px`,
    width: `${r.width + PADDING * 2}px`,
    height: `${r.height + PADDING * 2}px`,
    boxShadow: '0 0 0 9999px rgba(0,0,0,0.65)',
    borderRadius: '8px',
    zIndex: 9991,
    pointerEvents: 'none' as const,
    transition: 'top 0.25s ease, left 0.25s ease, width 0.25s ease, height 0.25s ease',
  }
})

const tooltipStyle = computed(() => {
  const r = spotlightRect.value
  const step = currentStep.value
  const gap = PADDING + 10
  const W = 304 // tooltip width

  if (!r || !step) {
    return { position: 'fixed' as const, top: '50%', left: '50%', transform: 'translate(-50%,-50%)', zIndex: 9992 }
  }

  const style: Record<string, string> = { position: 'fixed', zIndex: '9992' }

  switch (step.position) {
    case 'bottom':
      style.top = `${r.top + r.height + gap}px`
      style.left = `${Math.max(8, Math.min(window.innerWidth - W - 8, r.left + r.width / 2 - W / 2))}px`
      break
    case 'top':
      style.bottom = `${window.innerHeight - r.top + gap}px`
      style.left = `${Math.max(8, Math.min(window.innerWidth - W - 8, r.left + r.width / 2 - W / 2))}px`
      break
    case 'right':
      style.top = `${Math.max(8, Math.min(window.innerHeight - 300, r.top + r.height / 2 - 100))}px`
      style.left = `${r.left + r.width + gap}px`
      break
    case 'left':
      style.top = `${Math.max(8, Math.min(window.innerHeight - 300, r.top + r.height / 2 - 100))}px`
      style.right = `${window.innerWidth - r.left + gap}px`
      break
  }

  return style
})

function next() {
  if (!isLast.value) {
    uiStore.tourStep++
  } else {
    uiStore.endTour()
  }
}

function prev() {
  if (uiStore.tourStep > 0) uiStore.tourStep--
}
</script>

<template>
  <Teleport to="body">
    <div v-if="uiStore.isTourActive">
      <!-- Klick-Blocker (Backdrop) -->
      <div class="fixed inset-0" style="z-index: 9990;" @click="uiStore.endTour()" />

      <!-- Spotlight-Ausschnitt -->
      <div :style="spotlightStyle" />

      <!-- Tooltip-Karte -->
      <div :style="tooltipStyle" class="w-76 bg-white rounded-xl shadow-2xl overflow-hidden" style="width: 304px;">
        <!-- Fortschrittsbalken -->
        <div class="h-1 bg-gray-100">
          <div
            class="h-full bg-primary-500 transition-all duration-300"
            :style="{ width: `${((uiStore.tourStep + 1) / steps.length) * 100}%` }"
          />
        </div>

        <div class="p-5">
          <!-- Schritt-Zähler -->
          <div class="text-xs text-gray-400 mb-1.5">
            {{ uiStore.tourStep + 1 }} / {{ steps.length }}
          </div>

          <!-- Titel -->
          <h3 class="font-semibold text-gray-900 text-sm mb-2">
            {{ currentStep?.title }}
          </h3>

          <!-- Beschreibung -->
          <p class="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
            {{ currentStep?.description }}
          </p>

          <!-- Aktionen -->
          <div class="flex items-center justify-between mt-4">
            <button
              class="text-xs text-gray-400 hover:text-gray-600 transition-colors"
              @click="uiStore.endTour()"
            >
              Überspringen
            </button>
            <div class="flex gap-2">
              <button
                v-if="uiStore.tourStep > 0"
                class="w-8 h-8 flex items-center justify-center border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-gray-600"
                @click="prev"
              >
                <i class="fa-thin fa-chevron-left text-xs" />
              </button>
              <button
                class="px-4 h-8 text-xs bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium flex items-center gap-1.5"
                @click="next"
              >
                {{ isLast ? 'Fertig' : 'Weiter' }}
                <i v-if="!isLast" class="fa-thin fa-chevron-right" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
