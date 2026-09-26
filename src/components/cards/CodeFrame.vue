<script setup lang="ts">
import { computed } from 'vue'
import type { Card } from '@/types'
import { useGameStore } from '@/stores/useGameStore'

const props = defineProps<{ card: Card }>()
const store = useGameStore()

const MM = 96 / 25.4
const W = 105 * MM
const H = 74.25 * MM

// Circle radius and margins in SVG px
const r = computed(() => (store.codeCircleSize / 2) * MM)
const mo = computed(() => store.codeOuterMargin * MM)

// Circle row/column center lines
const topY    = computed(() => mo.value + r.value)
const bottomY = computed(() => H - mo.value - r.value)
const leftX   = computed(() => mo.value + r.value)
const rightX  = computed(() => W - mo.value - r.value)

// Step = diameter + gap between circles
const step = computed(() => r.value * 2 + store.codeCircleGap * MM)

const nTop = computed(() => {
  const span = rightX.value - leftX.value
  return Math.max(3, Math.floor(span / step.value) + 1)
})

// Evenly spaced x positions for top/bottom rows
const rowXs = computed(() => {
  const n = nTop.value
  const span = rightX.value - leftX.value
  const s = n > 1 ? span / (n - 1) : 0
  return Array.from({ length: n }, (_, i) => leftX.value + i * s)
})

// Left/right column y positions (between corners, same step as horizontal)
const colYs = computed(() => {
  const s = step.value
  const start = topY.value + s
  const end = bottomY.value - s
  if (end <= start) return []
  const n = Math.floor((end - start) / s) + 1
  const actualStep = n > 1 ? (end - start) / (n - 1) : 0
  return Array.from({ length: n }, (_, i) => start + i * actualStep)
})

// 1-indexed party number of this card
const partyNum = computed(() => {
  if (!props.card.partyId) return null
  const i = store.parties.findIndex(p => p.id === props.card.partyId)
  return i >= 0 ? i + 1 : null
})

// 1-indexed statement number (falls back to party number if no statement)
const stmtNum = computed(() => {
  if (props.card.statementId) {
    const i = store.statements.findIndex(s => s.id === props.card.statementId)
    return i >= 0 ? i + 1 : null
  }
  return partyNum.value
})

function outlineSet(num: number | null): Set<number> {
  const n = nTop.value
  if (num === null) return new Set()
  const i1 = num              // 0-indexed position
  const i2 = n - num - 1     // 0-indexed mirror
  const s = new Set<number>()
  if (i1 >= 0 && i1 < n) s.add(i1)
  if (i2 >= 0 && i2 < n && i2 !== i1) s.add(i2)
  return s
}

const topOutline    = computed(() => outlineSet(partyNum.value))
const bottomOutline = computed(() => outlineSet(stmtNum.value))

const color   = computed(() => store.codeColor)
const opacity = computed(() => store.codeOpacity / 100)
const sw      = computed(() => Math.max(0.5, r.value * 0.25))
</script>

<template>
  <svg
    width="100%"
    height="100%"
    :viewBox="`0 0 ${W} ${H}`"
    :style="{ opacity }"
    class="absolute inset-0 pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <!-- Obere Kreisreihe (Partei-Kodierung) -->
    <circle
      v-for="(x, i) in rowXs"
      :key="`t${i}`"
      :cx="x" :cy="topY" :r="r"
      :fill="topOutline.has(i) ? 'none' : color"
      :stroke="color" :stroke-width="sw"
    />

    <!-- Untere Kreisreihe (Thema-Kodierung) -->
    <circle
      v-for="(x, i) in rowXs"
      :key="`b${i}`"
      :cx="x" :cy="bottomY" :r="r"
      :fill="bottomOutline.has(i) ? 'none' : color"
      :stroke="color" :stroke-width="sw"
    />

    <!-- Linke Spalte (dekorativ) -->
    <circle
      v-for="(y, i) in colYs"
      :key="`l${i}`"
      :cx="leftX" :cy="y" :r="r"
      :fill="color" :stroke="color" :stroke-width="sw"
    />

    <!-- Rechte Spalte (dekorativ) -->
    <circle
      v-for="(y, i) in colYs"
      :key="`rr${i}`"
      :cx="rightX" :cy="y" :r="r"
      :fill="color" :stroke="color" :stroke-width="sw"
    />
  </svg>
</template>
