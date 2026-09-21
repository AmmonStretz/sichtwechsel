<script setup lang="ts">
import { computed } from 'vue'
import CardFront from './CardFront.vue'
import CardBack from './CardBack.vue'
import { useGameStore } from '@/stores/useGameStore'
import { useUiStore } from '@/stores/useUiStore'

const props = defineProps<{
  pageIndex: number
  mode: 'vorderseiten' | 'rueckseiten'
  isPdf?: boolean
}>()

const gameStore = useGameStore()
const uiStore = useUiStore()

const cards = computed(() =>
  gameStore.getCardsForPage(props.pageIndex, uiStore.filterPartyId, uiStore.filterStatementId)
)

const slots = computed(() => {
  const result = [...cards.value]
  while (result.length < 8) result.push(null as never)
  return result
})
</script>

<template>
  <div class="print-page" :class="{ 'is-pdf': isPdf }">
    <template v-for="(card, i) in slots" :key="card?.id ?? `empty-${i}`">
      <CardFront v-if="mode === 'vorderseiten' && card" :card="card" :is-pdf="isPdf" />
      <CardBack v-else-if="mode === 'rueckseiten'" />
      <div v-else class="card-front" style="background:#f9fafb;" />
    </template>
  </div>
</template>
