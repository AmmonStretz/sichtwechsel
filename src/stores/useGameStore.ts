import { defineStore } from 'pinia'
import type { Party, Statement, Card, ParsedExcel, ImageConfig } from '@/types'
import { exportToExcel } from '@/utils/excelParser'

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export const useGameStore = defineStore('game', {
  state: () => ({
    isInitialized: false,
    parties: [] as Party[],
    statements: [] as Statement[],
    cards: {} as Record<string, Card>,
    globalFontSize: 14,
    globalMargin: 3,
    codeColor: '#000000',
    codeOpacity: 100,
    codeOuterMargin: 1.5,
    codeInnerMargin: 1.5,
    codeCircleSize: 2.5,
    codeCircleGap: 0.5,
    showCode: false,
    cardBackImage: null as ImageConfig | null,
    cardFrontGlobalImage: null as ImageConfig | null,
    cardFrontPartyImages: {} as Record<string, ImageConfig>,
    cardFrontThemaImages: {} as Record<string, ImageConfig>,
    frontImageGrouping: 'partei' as 'partei' | 'thema',
    hasThema: false,
  }),

  getters: {
    hasData(state): boolean {
      return state.parties.length > 0 && state.statements.length > 0
    },

    totalFrontPages(state): number {
      const total = state.parties.length * state.statements.length
      return Math.max(1, Math.ceil(total / 8))
    },

    overflowingCards(state): Card[] {
      return Object.values(state.cards).filter(c => c.isOverflowing)
    },

    getCardsForPage(state) {
      return (pageIndex: number, partyFilter = '', stmtFilter = ''): Card[] => {
        const stmts = stmtFilter ? state.statements.filter(s => s.id === stmtFilter) : state.statements
        const parties = partyFilter ? state.parties.filter(p => p.id === partyFilter) : state.parties
        const allCards: Card[] = stmts.flatMap(stmt =>
          parties
            .map(p => state.cards[`${stmt.id}__${p.id}`])
            .filter(Boolean) as Card[]
        )
        return allCards.slice(pageIndex * 8, pageIndex * 8 + 8)
      }
    },

    getFilteredTotalPages(state) {
      return (partyFilter = '', stmtFilter = ''): number => {
        const stmtCount = stmtFilter ? 1 : state.statements.length
        const partyCount = partyFilter ? 1 : state.parties.length
        return Math.max(1, Math.ceil((stmtCount * partyCount) / 8))
      }
    },

    getEffectiveFrontImage(state) {
      return (card: Card): ImageConfig | null => {
        if (card.frontImage) return card.frontImage
        if (state.frontImageGrouping === 'thema') {
          return (card.statementId ? state.cardFrontThemaImages[card.statementId] : undefined) ?? state.cardFrontGlobalImage ?? null
        }
        return (card.partyId ? state.cardFrontPartyImages[card.partyId] : undefined) ?? state.cardFrontGlobalImage ?? null
      }
    },

    getPageForCard(state) {
      return (cardId: string): number => {
        let i = 0
        for (const stmt of state.statements) {
          for (const party of state.parties) {
            if (`${stmt.id}__${party.id}` === cardId) return Math.floor(i / 8)
            i++
          }
        }
        return 0
      }
    },

    getPartyById(state) {
      return (id: string): Party | undefined => state.parties.find(p => p.id === id)
    },

    getStatementById(state) {
      return (id: string): Statement | undefined => state.statements.find(s => s.id === id)
    },
  },

  actions: {
    importFromExcel(parsed: ParsedExcel) {
      this.isInitialized = true
      this.parties = parsed.parties.map((p, i) => ({
        id: slugify(p.name),
        name: p.name,
        code: i + 1,
      }))

      this.statements = parsed.rows.map((row, i) => ({
        id: `stmt-${i}`,
        rowIndex: i,
        label: row.label || `Statement ${i + 1}`,
      }))

      this.hasThema = parsed.hasThema
      this.cardFrontThemaImages = {}
      this.frontImageGrouping = 'partei'

      this.cards = {}
      for (const stmt of this.statements) {
        for (const party of this.parties) {
          const cardId = `${stmt.id}__${party.id}`
          const rawText = parsed.rows[stmt.rowIndex]?.cells[party.id] ?? ''
          const htmlContent = rawText
            ? rawText.split('\n').filter(t => t.trim()).map(t => `<p>${t}</p>`).join('')
            : ''
          if (!htmlContent) continue
          this.cards[cardId] = {
            id: cardId,
            partyId: party.id,
            statementId: stmt.id,
            htmlContent,
            fontSizeOverride: null,
            isOverflowing: false,
            frontImage: null,
          }
        }
      }
    },

    updateCardContent(cardId: string, html: string) {
      const card = this.cards[cardId]
      if (card) card.htmlContent = html
    },

    setCardFontSize(cardId: string, size: number | null) {
      const card = this.cards[cardId]
      if (card) card.fontSizeOverride = size
    },

    setGlobalFontSize(size: number) {
      this.globalFontSize = size
    },

    setGlobalMargin(mm: number) {
      this.globalMargin = mm
    },

    setCodeColor(color: string) {
      this.codeColor = color
    },

    setCodeOpacity(opacity: number) {
      this.codeOpacity = opacity
    },

    setCodeOuterMargin(v: number) { this.codeOuterMargin = v },
    setCodeInnerMargin(v: number) { this.codeInnerMargin = v },
    setCodeCircleSize(v: number) { this.codeCircleSize = v },
    setCodeCircleGap(v: number) { this.codeCircleGap = v },

    setShowCode(show: boolean) {
      this.showCode = show
    },

    setCardFrontGlobalImage(config: ImageConfig | null) {
      this.cardFrontGlobalImage = config
    },

    setCardFrontPartyImage(partyId: string, config: ImageConfig | null) {
      if (config) {
        this.cardFrontPartyImages[partyId] = config
      } else {
        delete this.cardFrontPartyImages[partyId]
      }
    },

    setCardFrontImage(cardId: string, config: ImageConfig | null) {
      const card = this.cards[cardId]
      if (card) card.frontImage = config
    },

    addCardForParty(partyId: string): string {
      const party = this.parties.find(p => p.id === partyId)
      const cardId = `card-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      this.cards[cardId] = {
        id: cardId, partyId, statementId: null,
        htmlContent: '', fontSizeOverride: null, isOverflowing: false,
        frontImage: null,
      }
      return cardId
    },

    setCardParty(cardId: string, partyId: string | null) {
      const card = this.cards[cardId]
      if (card) card.partyId = partyId
    },

    setCardStatement(cardId: string, statementId: string | null) {
      const card = this.cards[cardId]
      if (card) card.statementId = statementId
    },

    addCardForStatement(statementId: string): string {
      const id = `card-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`
      this.cards[id] = {
        id, partyId: null, statementId,
        htmlContent: '', fontSizeOverride: null, isOverflowing: false,
        frontImage: null,
      }
      return id
    },

    setCardFrontThemaImage(statementId: string, config: ImageConfig | null) {
      if (config) {
        this.cardFrontThemaImages[statementId] = config
      } else {
        delete this.cardFrontThemaImages[statementId]
      }
    },

    setFrontImageGrouping(grouping: 'partei' | 'thema') {
      this.frontImageGrouping = grouping
    },

    setCardBackImage(config: ImageConfig | null) {
      this.cardBackImage = config
    },

    markCardOverflow(cardId: string, overflowing: boolean) {
      const card = this.cards[cardId]
      if (card && card.isOverflowing !== overflowing) {
        card.isOverflowing = overflowing
      }
    },

    addParty(name: string, createCards = true): string {
      const base = slugify(name) || 'partei'
      let id = base
      let n = 2
      while (this.parties.some(p => p.id === id)) id = `${base}-${n++}`
      const code = this.parties.length + 1
      this.parties.push({ id, name, code })
      if (createCards) {
        for (const stmt of this.statements) {
          const cardId = `${stmt.id}__${id}`
          this.cards[cardId] = {
            id: cardId, partyId: id, statementId: stmt.id,
            htmlContent: '', fontSizeOverride: null, isOverflowing: false,
            frontImage: null,
          }
        }
      }
      return id
    },

    renameParty(id: string, name: string) {
      const party = this.parties.find(p => p.id === id)
      if (party) party.name = name
    },

    deleteParty(id: string) {
      for (const stmt of this.statements) delete this.cards[`${stmt.id}__${id}`]
      this.parties = this.parties.filter(p => p.id !== id)
      this.parties.forEach((p, i) => { p.code = i + 1 })
    },

    addStatement(label: string, createCards = true): string {
      const id = `stmt-${Date.now()}`
      const rowIndex = this.statements.length
      this.statements.push({ id, rowIndex, label })
      if (createCards) {
        for (const party of this.parties) {
          const cardId = `${id}__${party.id}`
          this.cards[cardId] = {
            id: cardId, partyId: party.id, statementId: id,
            htmlContent: '', fontSizeOverride: null, isOverflowing: false,
            frontImage: null,
          }
        }
      }
      return id
    },

    renameStatement(id: string, label: string) {
      const stmt = this.statements.find(s => s.id === id)
      if (stmt) stmt.label = label
    },

    deleteStatement(id: string) {
      for (const party of this.parties) delete this.cards[`${id}__${party.id}`]
      this.statements = this.statements.filter(s => s.id !== id)
      this.statements.forEach((s, i) => { s.rowIndex = i })
    },

    deleteCard(cardId: string) {
      delete this.cards[cardId]
      if (!this.hasThema) {
        const stmtId = cardId.split('__')[0]
        this.statements = this.statements.filter(s => s.id !== stmtId)
        this.statements.forEach((s, i) => { s.rowIndex = i })
      }
    },

    moveCard(cardId: string, newPartyId: string, newStatementId: string): string {
      const card = this.cards[cardId]
      if (!card) return cardId
      const newId = `${newStatementId}__${newPartyId}`
      if (newId === cardId) return cardId
      this.cards[newId] = { ...card, id: newId, partyId: newPartyId, statementId: newStatementId }
      delete this.cards[cardId]
      return newId
    },

    initManual(hasThema: boolean) {
      this.reset()
      this.isInitialized = true
      this.hasThema = hasThema
    },

    reset() {
      this.isInitialized = false
      this.parties = []
      this.statements = []
      this.cards = {}
      this.hasThema = false
      this.cardFrontThemaImages = {}
      this.cardFrontPartyImages = {}
      this.cardFrontGlobalImage = null
      this.cardBackImage = null
      this.frontImageGrouping = 'partei'
    },

    exportToExcel() {
      exportToExcel(this.parties, this.statements, this.cards)
    },
  },
})
