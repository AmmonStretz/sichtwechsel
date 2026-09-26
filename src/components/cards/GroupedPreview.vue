<script setup lang="ts">
import { computed, ref, nextTick, onMounted, onUnmounted } from 'vue'
import CardFront from './CardFront.vue'
import CardBack from './CardBack.vue'
import ConfirmDialog from '@/components/ui/ConfirmDialog.vue'
import { useGameStore } from '@/stores/useGameStore'
import { useUiStore } from '@/stores/useUiStore'

const props = defineProps<{
  mode: 'vorderseiten' | 'rueckseiten'
  groupBy: 'partei' | 'thema'
}>()

const gameStore = useGameStore()
const uiStore = useUiStore()

// ── Kartengröße (dynamisch) ───────────────────────────────────────────
const CARD_NATURAL_W = 105 * (96 / 25.4)  // px bei 96dpi
const CARD_NATURAL_H = 74.25 * (96 / 25.4)
const MIN_CARD_W = 400
const MAX_COLS = 3
const GAP = 16  // gap-4

const containerRef = ref<HTMLElement | null>(null)
const containerWidth = ref(0)

let ro: ResizeObserver | null = null
onMounted(() => {
  ro = new ResizeObserver(([e]) => { containerWidth.value = e.contentRect.width })
  if (containerRef.value) ro.observe(containerRef.value)
})
onUnmounted(() => ro?.disconnect())

const numCols = computed(() => {
  const w = containerWidth.value
  if (!w) return 1
  for (let n = MAX_COLS; n >= 1; n--) {
    if ((w - GAP * (n - 1)) / n >= MIN_CARD_W) return n
  }
  return 1
})

const cardWidth = computed(() => {
  const w = containerWidth.value || MIN_CARD_W
  return (w - GAP * (numCols.value - 1)) / numCols.value
})

const cardHeight = computed(() => cardWidth.value * (CARD_NATURAL_H / CARD_NATURAL_W))
const cardScale = computed(() => cardWidth.value / CARD_NATURAL_W)

// ── Daten ─────────────────────────────────────────────────────────────
const allCards = computed(() => Object.values(gameStore.cards))

const groups = computed(() => {
  if (props.groupBy === 'partei') {
    return gameStore.parties.map(party => ({
      id: party.id,
      label: party.name,
      cards: allCards.value.filter(c => c.partyId === party.id),
    }))
  } else {
    return gameStore.statements.map(stmt => ({
      id: stmt.id,
      label: stmt.label,
      cards: allCards.value.filter(c => c.statementId === stmt.id),
    }))
  }
})

const orphanCards = computed(() =>
  props.groupBy === 'partei'
    ? allCards.value.filter(c => c.partyId === null)
    : allCards.value.filter(c => c.statementId === null)
)

// ── Auf-/Zuklappen ────────────────────────────────────────────────────
const collapsedIds = ref<string[]>([])
function isCollapsed(id: string) { return collapsedIds.value.includes(id) }
function toggleCollapse(id: string) {
  const idx = collapsedIds.value.indexOf(id)
  if (idx >= 0) collapsedIds.value.splice(idx, 1)
  else collapsedIds.value.push(id)
}

// ── Karte hinzufügen ──────────────────────────────────────────────────
function addCard(groupId: string) {
  if (props.groupBy === 'partei') gameStore.addCardForParty(groupId)
  else gameStore.addCardForStatement(groupId)
}

// ── Kategorie umbenennen ──────────────────────────────────────────────
const editingGroupId = ref<string | null>(null)
const editingLabel = ref('')
const editInput = ref<HTMLInputElement | null>(null)

function startRename(groupId: string, currentLabel: string) {
  editingGroupId.value = groupId
  editingLabel.value = currentLabel
  nextTick(() => { editInput.value?.focus(); editInput.value?.select() })
}
function confirmRename() {
  const label = editingLabel.value.trim()
  const id = editingGroupId.value
  editingGroupId.value = null
  if (!id || !label) return
  if (props.groupBy === 'partei') gameStore.renameParty(id, label)
  else gameStore.renameStatement(id, label)
}
function cancelRename() { editingGroupId.value = null }

// ── Kategorie löschen ─────────────────────────────────────────────────
const deletingGroup = ref<{ id: string; label: string } | null>(null)

function startDelete(groupId: string, label: string) {
  deletingGroup.value = { id: groupId, label }
  editingGroupId.value = null
}
function confirmDelete() {
  const id = deletingGroup.value?.id
  deletingGroup.value = null
  if (!id) return
  if (props.groupBy === 'partei') {
    if (uiStore.selectedCardId?.includes(`__${id}`)) uiStore.selectedCardId = null
    gameStore.deleteParty(id)
  } else {
    if (uiStore.selectedCardId?.startsWith(`${id}__`)) uiStore.selectedCardId = null
    gameStore.deleteStatement(id)
  }
}
function cancelDelete() { deletingGroup.value = null }

const deleteMessage = computed(() =>
  deletingGroup.value
    ? `„${deletingGroup.value.label}" und alle zugehörigen Karten wirklich löschen?`
    : ''
)

// ── Neue Kategorie ────────────────────────────────────────────────────
const addingCategory = ref(false)
const newCategoryLabel = ref('')
const categoryInput = ref<HTMLInputElement | null>(null)

function startAddCategory() {
  addingCategory.value = true
  newCategoryLabel.value = ''
  nextTick(() => categoryInput.value?.focus())
}
function confirmAddCategory() {
  const label = newCategoryLabel.value.trim()
  addingCategory.value = false
  newCategoryLabel.value = ''
  if (!label) return
  if (props.groupBy === 'partei') gameStore.addParty(label, false)
  else gameStore.addStatement(label, false)
}
function cancelAddCategory() { addingCategory.value = false; newCategoryLabel.value = '' }
</script>

<template>
  <div ref="containerRef" class="grouped-preview flex-1 overflow-y-auto p-6 space-y-8 bg-gray-100">
    <!-- Gruppen -->
    <div v-for="group in groups" :key="group.id">
      <!-- Überschrift -->
      <div class="flex items-center gap-2 mb-4">
        <button class="text-gray-400 hover:text-gray-600 shrink-0 w-5 text-center" @click="toggleCollapse(group.id)">
          <i class="fa-solid text-xs" :class="isCollapsed(group.id) ? 'fa-chevron-right' : 'fa-chevron-down'" />
        </button>
        <input
          v-if="editingGroupId === group.id"
          ref="editInput"
          v-model="editingLabel"
          class="text-2xl font-semibold text-gray-800 bg-transparent border-b-2 border-primary-400 outline-none min-w-0 flex-1"
          @keydown.enter.prevent="confirmRename"
          @keydown.escape="cancelRename"
          @blur="cancelRename"
        />
        <h2 v-else class="text-2xl font-semibold text-gray-800 flex-1 cursor-pointer select-none" @click="toggleCollapse(group.id)">
          {{ group.label }}
        </h2>
        <template v-if="editingGroupId !== group.id">
          <button class="text-gray-400 hover:text-gray-700 p-1" @click="startRename(group.id, group.label)">
            <i class="fa-solid fa-pen text-sm" />
          </button>
          <button class="text-gray-400 hover:text-red-500 p-1" @click="startDelete(group.id, group.label)">
            <i class="fa-solid fa-trash text-sm" />
          </button>
        </template>
      </div>

      <!-- Kartengrid -->
      <div
        v-if="!isCollapsed(group.id)"
        class="grid pt-3"
        :style="{ gridTemplateColumns: `repeat(${numCols}, 1fr)`, gap: GAP + 'px' }"
      >
        <div
          v-for="card in group.cards"
          :key="card.id"
          class="relative"
          :style="{ height: cardHeight + 'px' }"
        >
          <div class="overflow-hidden w-full h-full">
            <div :style="{ transform: `scale(${cardScale})`, transformOrigin: 'top left', width: CARD_NATURAL_W + 'px', height: CARD_NATURAL_H + 'px' }">
              <CardFront v-if="mode === 'vorderseiten'" :card="card" />
              <CardBack v-else />
            </div>
          </div>
          <button
            v-if="uiStore.selectedCardId === card.id"
            class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center z-10 transition-colors"
            @click.stop="gameStore.deleteCard(card.id)"
          >
            <i class="fa-solid fa-xmark text-xs" />
          </button>
        </div>

        <!-- Neue Karte -->
        <button
          class="flex items-center justify-center rounded border-2 border-dashed border-gray-300 hover:border-primary-400 hover:bg-primary-50 text-gray-400 hover:text-primary-500 transition-colors"
          :style="{ height: cardHeight + 'px' }"
          @click="addCard(group.id)"
        >
          <i class="fa-thin fa-plus text-2xl" />
        </button>
      </div>
    </div>

    <!-- Waisenkarten -->
    <div v-if="orphanCards.length > 0">
      <h2 class="text-2xl font-semibold text-gray-400 mb-4">
        {{ groupBy === 'partei' ? 'Ohne Partei' : 'Ohne Thema' }}
      </h2>
      <div
        class="grid pt-3"
        :style="{ gridTemplateColumns: `repeat(${numCols}, 1fr)`, gap: GAP + 'px' }"
      >
        <div
          v-for="card in orphanCards"
          :key="card.id"
          class="relative"
          :style="{ height: cardHeight + 'px' }"
        >
          <div class="overflow-hidden w-full h-full">
          <div :style="{ transform: `scale(${cardScale})`, transformOrigin: 'top left', width: CARD_NATURAL_W + 'px', height: CARD_NATURAL_H + 'px' }">
            <CardFront v-if="mode === 'vorderseiten'" :card="card" />
            <CardBack v-else />
          </div>
          </div>
          <button
            v-if="uiStore.selectedCardId === card.id"
            class="absolute top-0 right-0 translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-red-500 hover:bg-red-600 text-white flex items-center justify-center z-10 transition-colors"
            @click.stop="gameStore.deleteCard(card.id)"
          >
            <i class="fa-solid fa-xmark text-xs" />
          </button>
        </div>
      </div>
    </div>

    <!-- Bestätigungsdialog -->
    <ConfirmDialog
      :show="deletingGroup !== null"
      :title="groupBy === 'partei' ? 'Partei löschen' : 'Thema löschen'"
      :message="deleteMessage"
      @confirm="confirmDelete"
      @cancel="cancelDelete"
    />

    <!-- Neue Kategorie -->
    <div class="pt-2">
      <div v-if="addingCategory" class="flex items-center gap-2">
        <input
          ref="categoryInput"
          v-model="newCategoryLabel"
          :placeholder="groupBy === 'partei' ? 'Neue Partei…' : 'Neues Thema…'"
          class="text-2xl font-semibold text-gray-800 bg-transparent border-b-2 border-primary-400 outline-none min-w-0 flex-1"
          @keydown.enter.prevent="confirmAddCategory"
          @keydown.escape="cancelAddCategory"
          @blur="cancelAddCategory"
        />
      </div>
      <button
        v-else
        class="flex items-center gap-2 text-gray-400 hover:text-gray-700 transition-colors"
        @click="startAddCategory"
      >
        <i class="fa-thin fa-plus" />
        <span class="text-sm">{{ groupBy === 'partei' ? 'Neue Partei' : 'Neues Thema' }}</span>
      </button>
    </div>
  </div>
</template>
