export interface ImageConfig {
  url: string
  scale: number
}

export interface Party {
  id: string
  name: string
  code: number
}

export interface Statement {
  id: string
  rowIndex: number
  label: string
}

export interface Card {
  id: string
  partyId: string
  statementId: string
  htmlContent: string
  fontSizeOverride: number | null
  isOverflowing: boolean
  hiddenCode: string
  frontImage: ImageConfig | null
}

export interface ParsedExcel {
  parties: Array<{ name: string; columnIndex: number }>
  rows: Array<{
    label: string
    cells: Record<string, string>
  }>
  hasThema: boolean
}

export type PreviewMode = 'vorderseiten' | 'rueckseiten'
