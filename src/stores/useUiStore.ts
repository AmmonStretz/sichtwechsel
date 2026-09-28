import { defineStore } from 'pinia'
import type { PreviewMode, LayoutMode, ParsedExcel } from '@/types'

export const useUiStore = defineStore('ui', {
  state: () => ({
    selectedCardId: null as string | null,
    isTourActive: false,
    tourStep: 0,
    currentPage: 0,
    previewMode: 'vorderseiten' as PreviewMode,
    layoutMode: 'partei' as LayoutMode,
    isExporting: false,
    showImportDialog: false,
    showImportPreview: false,
    pendingImport: null as ParsedExcel | null,
    firstColumnIsLabel: true,
    showDataDialog: false,
    activeSidebarSection: 'schrift' as 'schrift' | 'bilder',
    sidebarOpen: false,
    filterPartyId: '',
    filterStatementId: '',
    showImpressumDialog: false,
    showDatenschutzDialog: false,
  }),

  actions: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen
    },

    selectCard(cardId: string | null) {
      this.selectedCardId = cardId
    },

    startTour() {
      this.isTourActive = true
      this.tourStep = 0
    },

    endTour() {
      this.isTourActive = false
    },

    setCurrentPage(page: number) {
      this.currentPage = page
    },

    setPreviewMode(mode: PreviewMode) {
      this.previewMode = mode
      this.currentPage = 0
    },

    setLayoutMode(mode: LayoutMode) {
      this.layoutMode = mode
      this.currentPage = 0
    },

    setFilterParty(id: string) {
      this.filterPartyId = id
      this.currentPage = 0
    },

    setFilterStatement(id: string) {
      this.filterStatementId = id
      this.currentPage = 0
    },

    setPendingImport(data: ParsedExcel | null) {
      this.pendingImport = data
      this.showImportPreview = data !== null
    },

    cancelImport() {
      this.pendingImport = null
      this.showImportPreview = false
    },

    openImportDialog() {
      this.showImportDialog = true
    },

    closeImportDialog() {
      this.showImportDialog = false
      this.pendingImport = null
      this.showImportPreview = false
    },

    openDataDialog() {
      this.showDataDialog = true
    },

    closeDataDialog() {
      this.showDataDialog = false
    },

    openImpressumDialog() {
      this.showImpressumDialog = true
    },

    closeImpressumDialog() {
      this.showImpressumDialog = false
    },

    openDatenschutzDialog() {
      this.showDatenschutzDialog = true
    },

    closeDatenschutzDialog() {
      this.showDatenschutzDialog = false
    },

    resetSession() {
      this.selectedCardId = null
      this.currentPage = 0
      this.previewMode = 'vorderseiten'
      this.layoutMode = 'partei'
      this.showImportDialog = false
      this.showImportPreview = false
      this.pendingImport = null
      this.showDataDialog = false
      this.activeSidebarSection = 'schrift'
      this.sidebarOpen = false
      this.filterPartyId = ''
      this.filterStatementId = ''
    },
  },
})
