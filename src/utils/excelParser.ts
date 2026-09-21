import * as XLSX from 'xlsx'
import type { ParsedExcel } from '@/types'

function slugify(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')
}

export async function parseExcelFile(file: File, withThema: boolean = true): Promise<ParsedExcel> {
  const buffer = await file.arrayBuffer()
  const workbook = XLSX.read(buffer, { type: 'array' })
  const sheetName = workbook.SheetNames[0]
  const sheet = workbook.Sheets[sheetName]

  const rows: string[][] = XLSX.utils.sheet_to_json(sheet, {
    header: 1,
    defval: '',
    blankrows: false,
  }) as string[][]

  if (rows.length < 2) {
    throw new Error('Die Datei enthält zu wenige Zeilen (mindestens 1 Header + 1 Datenzeile erforderlich).')
  }

  const headerRow = rows[0].map(String)
  const dataRows = rows.slice(1)

  const partyStartIndex = withThema ? 1 : 0

  const parties: ParsedExcel['parties'] = []
  for (let i = partyStartIndex; i < headerRow.length; i++) {
    const name = headerRow[i]?.trim()
    if (name) {
      parties.push({ name, columnIndex: i })
    }
  }

  if (parties.length === 0) {
    throw new Error('Keine Parteien in der Datei gefunden. Prüfe die Kopfzeile.')
  }

  let parsedRows: ParsedExcel['rows'] = dataRows
    .filter(row => row.some(cell => String(cell).trim() !== ''))
    .map(row => {
      const label = withThema ? String(row[0] ?? '').trim() : ''
      const cells: Record<string, string> = {}
      for (const party of parties) {
        const id = slugify(party.name)
        cells[id] = String(row[party.columnIndex] ?? '').trim()
      }
      return { label, cells }
    })

  if (withThema) {
    // Fill forward: leere Thema-Felder erben das vorherige Thema
    let lastLabel = ''
    for (const row of parsedRows) {
      if (row.label) {
        lastLabel = row.label
      } else if (lastLabel) {
        row.label = lastLabel
      }
    }

    // Zeilen mit gleichem Label zusammenführen (Zellinhalte mit Zeilenumbruch verbinden)
    const mergedMap = new Map<string, ParsedExcel['rows'][number]>()
    const mergedOrder: string[] = []
    for (const row of parsedRows) {
      const key = row.label
      if (mergedMap.has(key)) {
        const existing = mergedMap.get(key)!
        for (const [partyId, text] of Object.entries(row.cells)) {
          if (text) {
            existing.cells[partyId] = existing.cells[partyId]
              ? existing.cells[partyId] + '\n' + text
              : text
          }
        }
      } else {
        mergedMap.set(key, { label: row.label, cells: { ...row.cells } })
        mergedOrder.push(key)
      }
    }
    parsedRows = mergedOrder.map(k => mergedMap.get(k)!)
  }

  return { parties, rows: parsedRows, hasThema: withThema }
}

export function exportToExcel(
  parties: Array<{ id: string; name: string }>,
  statements: Array<{ id: string; label: string }>,
  cards: Record<string, { htmlContent: string }>
): void {
  const stripHtml = (html: string): string => {
    const tmp = document.createElement('div')
    tmp.innerHTML = html
    return tmp.textContent ?? ''
  }

  const headerRow = ['Thema', ...parties.map(p => p.name)]
  const dataRows = statements.map(stmt => [
    stmt.label,
    ...parties.map(p => {
      const card = cards[`${stmt.id}__${p.id}`]
      return card ? stripHtml(card.htmlContent) : ''
    }),
  ])

  const ws = XLSX.utils.aoa_to_sheet([headerRow, ...dataRows])
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sichtwechsel')
  XLSX.writeFile(wb, 'sichtwechsel-export.xlsx')
}
