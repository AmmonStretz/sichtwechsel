<script setup lang="ts">
import { useGameStore } from '@/stores/useGameStore'
import ImageUploadWidget from './ImageUploadWidget.vue'

const gameStore = useGameStore()
</script>

<template>
  <div class="p-3">
    <ImageUploadWidget
      :model-value="gameStore.cardBackImage"
      label="Kartenrücken-Bild"
      :show-hint="true"
      @update:model-value="gameStore.setCardBackImage($event)"
    />
  </div>
</template>
