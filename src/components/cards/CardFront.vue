<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Card } from '@/types'
import { useGameStore } from '@/stores/useGameStore'
import { useUiStore } from '@/stores/useUiStore'
import { useOverflowDetection } from '@/composables/useOverflowDetection'
import CodeFrame from './CodeFrame.vue'

const props = defineProps<{
  card: Card
  isPdf?: boolean
}>()

const emit = defineEmits<{
  select: []
}>()

const gameStore = useGameStore()
const uiStore = useUiStore()

const textAreaRef = ref<HTMLElement | null>(null)

const isSelected = computed(() => uiStore.selectedCardId === props.card.id)
const effectiveFontSize = computed(
  () => props.card.fontSizeOverride ?? gameStore.globalFontSize
)

const effectiveFrontImage = computed(() =>
  gameStore.getEffectiveFrontImage(props.card)
)

// Extra padding from the circle frame (outerMargin + circleSize + innerMargin)
const framePadding = computed(() =>
  gameStore.showCode
    ? gameStore.codeOuterMargin + gameStore.codeCircleSize + gameStore.codeInnerMargin
    : 0
)

const contentStyle = computed(() => {
  const m = gameStore.globalMargin
  const f = framePadding.value
  return {
    top:    (m + f) + 'mm',
    left:   (m + f) + 'mm',
    right:  (m + f) + 'mm',
    bottom: (m + f) + 'mm',
  }
})

const { isOverflowing } = useOverflowDetection(
  textAreaRef,
  () => [props.card.htmlContent, effectiveFontSize.value]
)

watch(isOverflowing, val => {
  gameStore.markCardOverflow(props.card.id, val)
})

function handleClick() {
  if (!props.isPdf && uiStore.layoutMode !== 'druck') {
    const wasSelected = isSelected.value
    uiStore.selectCard(wasSelected ? null : props.card.id)
    if (!wasSelected) emit('select')
  }
}
</script>

<template>
  <div
    class="card-front"
    :class="{ 'card-selected': isSelected && !isPdf, 'cursor-default!': uiStore.layoutMode === 'druck' }"
    @click="handleClick"
  >
    <!-- Hintergrundbild -->
    <img
      v-if="effectiveFrontImage"
      :src="effectiveFrontImage.url"
      class="absolute inset-0 w-full h-full object-cover pointer-events-none"
      :style="{ transform: `scale(${effectiveFrontImage.scale})` }"
      alt=""
    />

    <!-- Overflow-Warnung -->
    <div
      v-if="isOverflowing && !isPdf"
      class="overflow-badge absolute top-1 left-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold z-10 leading-none"
      title="Text zu groß – Inhalt wird abgeschnitten"
    >
      !
    </div>

    <!-- Kreisrahmen -->
    <CodeFrame v-if="gameStore.showCode" :card="card" />

    <!-- Textinhalt -->
    <div
      ref="textAreaRef"
      class="card-text-area"
      :style="{ ...contentStyle, fontSize: effectiveFontSize + 'px' }"
    >
      <div class="tiptap-output" v-html="card.htmlContent" />
    </div>
  </div>
</template>
