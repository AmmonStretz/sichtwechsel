<script setup lang="ts">
import { ref } from 'vue'
import { useGameStore } from '@/stores/useGameStore'
import { useUiStore } from '@/stores/useUiStore'

const gameStore = useGameStore()
const uiStore = useUiStore()

// --- Parteien ---
const editingPartyId = ref<string | null>(null)
const editingPartyName = ref('')
const deletingPartyId = ref<string | null>(null)
const showNewParty = ref(false)
const newPartyName = ref('')

function startEditParty(id: string, name: string) {
  editingPartyId.value = id
  editingPartyName.value = name
  deletingPartyId.value = null
}

function saveParty() {
  if (editingPartyId.value && editingPartyName.value.trim())
    gameStore.renameParty(editingPartyId.value, editingPartyName.value.trim())
  editingPartyId.value = null
}

function requestDeleteParty(id: string) {
  deletingPartyId.value = deletingPartyId.value === id ? null : id
  editingPartyId.value = null
}

function confirmDeleteParty(id: string) {
  if (uiStore.selectedCardId?.includes(`__${id}`)) uiStore.selectedCardId = null
  gameStore.deleteParty(id)
  deletingPartyId.value = null
}

function addParty() {
  if (!newPartyName.value.trim()) return
  gameStore.addParty(newPartyName.value.trim())
  newPartyName.value = ''
  showNewParty.value = false
}

// --- Themen (nur wenn hasThema) ---
const editingThemaId = ref<string | null>(null)
const editingThemaLabel = ref('')
const deletingThemaId = ref<string | null>(null)
const showNewThema = ref(false)
const newThemaLabel = ref('')

function startEditThema(id: string, label: string) {
  editingThemaId.value = id
  editingThemaLabel.value = label
  deletingThemaId.value = null
}

function saveThema() {
  if (editingThemaId.value && editingThemaLabel.value.trim())
    gameStore.renameStatement(editingThemaId.value, editingThemaLabel.value.trim())
  editingThemaId.value = null
}

function requestDeleteThema(id: string) {
  deletingThemaId.value = deletingThemaId.value === id ? null : id
  editingThemaId.value = null
}

function confirmDeleteThema(id: string) {
  if (uiStore.selectedCardId?.startsWith(`${id}__`)) uiStore.selectedCardId = null
  gameStore.deleteStatement(id)
  deletingThemaId.value = null
}

function addThema() {
  if (!newThemaLabel.value.trim()) return
  gameStore.addStatement(newThemaLabel.value.trim())
  newThemaLabel.value = ''
  showNewThema.value = false
}

</script>

<template>
  <div class="p-3 space-y-5">

    <!-- ── PARTEIEN ─────────────────────────────────── -->
    <div>
      <div class="text-xs font-medium text-gray-700 mb-1.5">Parteien</div>

      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div v-if="gameStore.parties.length === 0" class="px-3 py-2 text-xs text-gray-400">
          Keine Parteien vorhanden
        </div>
        <div
          v-for="party in gameStore.parties"
          :key="party.id"
          class="border-t border-gray-100 first:border-t-0"
        >
          <div
            v-if="editingPartyId !== party.id && deletingPartyId !== party.id"
            class="flex items-center gap-1 px-2 py-1.5"
          >
            <button
              class="flex-1 text-xs text-left text-gray-700 truncate hover:text-primary-600 transition-colors"
              @click="startEditParty(party.id, party.name)"
            >
              {{ party.name }}
            </button>
            <span class="text-xs text-gray-300 shrink-0 mr-1">{{ party.code }}</span>
            <button
              class="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shrink-0"
              @click="requestDeleteParty(party.id)"
            >
              <i class="fa-thin fa-trash text-xs" />
            </button>
          </div>

          <div v-else-if="editingPartyId === party.id" class="flex items-center gap-1 px-2 py-1.5">
            <input
              v-model="editingPartyName"
              class="flex-1 text-xs border border-gray-200 rounded px-1.5 py-0.5 focus:outline-none focus:border-primary-400"
              autofocus
              @keydown.enter="saveParty"
              @keydown.escape="editingPartyId = null"
            />
            <button class="w-5 h-5 flex items-center justify-center text-white bg-primary-600 rounded hover:bg-primary-700 shrink-0" @click="saveParty">
              <i class="fa-thin fa-check text-xs" />
            </button>
            <button class="w-5 h-5 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 shrink-0" @click="editingPartyId = null">
              <i class="fa-thin fa-xmark text-xs" />
            </button>
          </div>

          <div v-else-if="deletingPartyId === party.id" class="px-2 py-1.5 bg-red-50">
            <div class="text-xs text-red-700 mb-1">
              {{ gameStore.statements.length }} Karte{{ gameStore.statements.length !== 1 ? 'n' : '' }} werden gelöscht.
            </div>
            <div class="flex gap-1">
              <button class="flex-1 text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors" @click="confirmDeleteParty(party.id)">Löschen</button>
              <button class="flex-1 text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors" @click="deletingPartyId = null">Abbrechen</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showNewParty" class="mt-1.5 flex items-center gap-1">
        <input
          v-model="newPartyName"
          placeholder="Parteiname…"
          class="flex-1 text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-primary-400"
          autofocus
          @keydown.enter="addParty"
          @keydown.escape="showNewParty = false; newPartyName = ''"
        />
        <button class="w-6 h-6 flex items-center justify-center text-white bg-primary-600 rounded hover:bg-primary-700 shrink-0" @click="addParty">
          <i class="fa-thin fa-check text-xs" />
        </button>
        <button class="w-6 h-6 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 shrink-0" @click="showNewParty = false; newPartyName = ''">
          <i class="fa-thin fa-xmark text-xs" />
        </button>
      </div>
      <button
        v-else
        class="mt-1.5 w-full text-xs text-primary-600 border border-dashed border-primary-300 rounded py-1 hover:bg-primary-50 transition-colors"
        @click="showNewParty = true; deletingPartyId = null; editingPartyId = null"
      >
        <i class="fa-thin fa-plus mr-1" /> Neue Partei
      </button>
    </div>

    <!-- ── THEMEN (nur wenn hasThema) ────────────────── -->
    <div v-if="gameStore.hasThema">
      <div class="text-xs font-medium text-gray-700 mb-1.5">Themen</div>

      <div class="border border-gray-200 rounded-lg overflow-hidden">
        <div v-if="gameStore.statements.length === 0" class="px-3 py-2 text-xs text-gray-400">
          Keine Themen vorhanden
        </div>
        <div
          v-for="stmt in gameStore.statements"
          :key="stmt.id"
          class="border-t border-gray-100 first:border-t-0"
        >
          <div
            v-if="editingThemaId !== stmt.id && deletingThemaId !== stmt.id"
            class="flex items-center gap-1 px-2 py-1.5"
          >
            <button
              class="flex-1 text-xs text-left text-gray-700 truncate hover:text-primary-600 transition-colors"
              @click="startEditThema(stmt.id, stmt.label)"
            >
              {{ stmt.label }}
            </button>
            <button
              class="w-5 h-5 flex items-center justify-center text-gray-400 hover:text-red-500 transition-colors shrink-0"
              @click="requestDeleteThema(stmt.id)"
            >
              <i class="fa-thin fa-trash text-xs" />
            </button>
          </div>

          <div v-else-if="editingThemaId === stmt.id" class="flex items-center gap-1 px-2 py-1.5">
            <input
              v-model="editingThemaLabel"
              class="flex-1 text-xs border border-gray-200 rounded px-1.5 py-0.5 focus:outline-none focus:border-primary-400"
              autofocus
              @keydown.enter="saveThema"
              @keydown.escape="editingThemaId = null"
            />
            <button class="w-5 h-5 flex items-center justify-center text-white bg-primary-600 rounded hover:bg-primary-700 shrink-0" @click="saveThema">
              <i class="fa-thin fa-check text-xs" />
            </button>
            <button class="w-5 h-5 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 shrink-0" @click="editingThemaId = null">
              <i class="fa-thin fa-xmark text-xs" />
            </button>
          </div>

          <div v-else-if="deletingThemaId === stmt.id" class="px-2 py-1.5 bg-red-50">
            <div class="text-xs text-red-700 mb-1">
              {{ gameStore.parties.length }} Karte{{ gameStore.parties.length !== 1 ? 'n' : '' }} werden gelöscht.
            </div>
            <div class="flex gap-1">
              <button class="flex-1 text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700 transition-colors" @click="confirmDeleteThema(stmt.id)">Löschen</button>
              <button class="flex-1 text-xs px-2 py-1 border border-gray-200 rounded hover:bg-gray-50 transition-colors" @click="deletingThemaId = null">Abbrechen</button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="showNewThema" class="mt-1.5 flex items-center gap-1">
        <input
          v-model="newThemaLabel"
          placeholder="Thema eingeben…"
          class="flex-1 text-xs border border-gray-200 rounded px-2 py-1 focus:outline-none focus:border-primary-400"
          autofocus
          @keydown.enter="addThema"
          @keydown.escape="showNewThema = false; newThemaLabel = ''"
        />
        <button class="w-6 h-6 flex items-center justify-center text-white bg-primary-600 rounded hover:bg-primary-700 shrink-0" @click="addThema">
          <i class="fa-thin fa-check text-xs" />
        </button>
        <button class="w-6 h-6 flex items-center justify-center border border-gray-200 rounded hover:bg-gray-50 shrink-0" @click="showNewThema = false; newThemaLabel = ''">
          <i class="fa-thin fa-xmark text-xs" />
        </button>
      </div>
      <button
        v-else
        class="mt-1.5 w-full text-xs text-primary-600 border border-dashed border-primary-300 rounded py-1 hover:bg-primary-50 transition-colors"
        @click="showNewThema = true; deletingThemaId = null; editingThemaId = null"
      >
        <i class="fa-thin fa-plus mr-1" /> Neues Thema
      </button>
    </div>


  </div>
</template>
