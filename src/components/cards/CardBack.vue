<script setup lang="ts">
import { useGameStore } from '@/stores/useGameStore'

const gameStore = useGameStore()
</script>

<template>
  <div class="card-back">
    <img
      :src="gameStore.cardBackImage?.url ?? '/background-default.png'"
      class="absolute inset-0 w-full h-full object-cover pointer-events-none"
      :style="gameStore.cardBackImage ? { transform: `scale(${gameStore.cardBackImage.scale})` } : {}"
      alt=""
    />
  </div>
</template>
