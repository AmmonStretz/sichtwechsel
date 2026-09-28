<script setup lang="ts">
import { useRouter } from 'vue-router'
import AppFooter from '@/components/layout/AppFooter.vue'

const router = useRouter()

const tools = [
  {
    id: 'sichtwechsel',
    title: 'Sichtwechsel',
    description: 'Kartenset mit Aussagen verschiedener Parteien zu einem Thema erstellen und druckfertig exportieren.',
    icon: 'fa-layer-group',
    route: '/sichtwechsel',
    active: true,
  },
  {
    id: 'infoplakat',
    title: 'Infoplakat',
    description: 'Einseitige Informationsplakate gestalten und als druckfertiges PDF exportieren.',
    icon: 'fa-rectangle-vertical',
    route: null,
    active: false,
  },
  {
    id: 'zitatkarte',
    title: 'Zitatkarte',
    description: 'Grafiken mit Zitaten und Quellenangaben für Social Media erstellen.',
    icon: 'fa-quote-right',
    route: null,
    active: false,
  },
]
</script>

<template>
  <div class="h-full overflow-auto bg-gray-50 flex flex-col">
    <!-- Header -->
    <header class="bg-white border-b border-gray-200 px-6 py-4 flex items-center gap-3">
      <img src="@/assets/logo.jpg" alt="Logo" class="h-8 w-auto object-contain" />
      <div class="w-px h-6 bg-gray-200" />
      <span class="text-sm font-medium text-gray-500">Aktionsmittel</span>
    </header>

    <!-- Hero -->
    <div class="max-w-3xl mx-auto px-6 pt-14 pb-10 text-center">
      <h1 class="text-3xl font-bold text-gray-900 mb-3">Aktionsmittel</h1>
      <p class="text-base text-gray-500 max-w-md mx-auto">
        Werkzeuge für die Erstellung von Druckmaterialien und digitalen Aktionsmitteln.
      </p>
    </div>

    <!-- Tool Grid -->
    <div class="flex-1 max-w-3xl w-full mx-auto px-6 pb-16">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <button
          v-for="tool in tools"
          :key="tool.id"
          class="group text-left bg-white rounded-xl border p-5 transition-all"
          :class="tool.active
            ? 'border-gray-200 hover:border-primary-400 hover:shadow-md cursor-pointer'
            : 'border-gray-200 opacity-60 cursor-default'"
          @click="tool.active && tool.route ? router.push(tool.route) : null"
        >
          <!-- Icon -->
          <div
            class="w-10 h-10 rounded-lg flex items-center justify-center mb-4 transition-colors"
            :class="tool.active
              ? 'bg-primary-50 text-primary-600 group-hover:bg-primary-100'
              : 'bg-gray-100 text-gray-400'"
          >
            <i :class="`fa-thin ${tool.icon} text-lg`" />
          </div>

          <!-- Title + Badge -->
          <div class="flex items-center gap-2 mb-1.5">
            <span class="text-sm font-semibold text-gray-900">{{ tool.title }}</span>
            <span
              v-if="!tool.active"
              class="text-[10px] font-medium px-1.5 py-0.5 rounded-full bg-gray-100 text-gray-400 leading-none"
            >
              Demnächst
            </span>
          </div>

          <!-- Description -->
          <p class="text-xs text-gray-500 leading-relaxed">{{ tool.description }}</p>

          <!-- CTA -->
          <div v-if="tool.active" class="mt-4 flex items-center gap-1 text-xs font-medium text-primary-600 group-hover:gap-2 transition-all">
            <span>Öffnen</span>
            <i class="fa-thin fa-arrow-right text-[11px]" />
          </div>
        </button>
      </div>
    </div>

    <AppFooter />
  </div>
</template>
