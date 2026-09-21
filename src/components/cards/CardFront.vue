<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import type { Card } from '@/types'
import { useGameStore } from '@/stores/useGameStore'
import { useUiStore } from '@/stores/useUiStore'
import { useOverflowDetection } from '@/composables/useOverflowDetection'

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

const codeStyle = computed(() => ({
  color: gameStore.codeColor,
  fontSize: gameStore.codeFontSize + 'px',
  opacity: gameStore.codeOpacity / 100,
  bottom: gameStore.globalMargin + 'mm',
  right: gameStore.globalMargin + 'mm',
}))

const { isOverflowing } = useOverflowDetection(
  textAreaRef,
  () => [props.card.htmlContent, effectiveFontSize.value]
)

watch(isOverflowing, val => {
  gameStore.markCardOverflow(props.card.id, val)
})

function handleClick() {
  if (!props.isPdf) {
    const wasSelected = isSelected.value
    uiStore.selectCard(wasSelected ? null : props.card.id)
    if (!wasSelected) emit('select')
  }
}
</script>

<template>
  <div
    class="card-front"
    :class="{ 'card-selected': isSelected && !isPdf }"
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

    <!-- Textinhalt -->
    <div
      ref="textAreaRef"
      class="card-text-area"
      :style="{
        top: gameStore.globalMargin + 'mm',
        left: gameStore.globalMargin + 'mm',
        right: gameStore.globalMargin + 'mm',
        bottom: (gameStore.globalMargin + 2) + 'mm',
        fontSize: effectiveFontSize + 'px',
      }"
    >
      <div class="tiptap-output" v-html="card.htmlContent" />
    </div>

    <!-- Identifizierungscode -->
    <div v-if="gameStore.showCode" class="card-hidden-code" :style="codeStyle">
      {{ card.hiddenCode }}
    </div>
  </div>
</template>
