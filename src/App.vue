<script setup lang="ts">
import ImpressumModal from '@/components/legal/ImpressumModal.vue'
import DatenschutzModal from '@/components/legal/DatenschutzModal.vue'
</script>

<template>
  <div class="flex flex-col h-screen overflow-hidden bg-gray-50">
    <RouterView class="flex-1 min-h-0" />
    <ImpressumModal />
    <DatenschutzModal />
  </div>
</template>
