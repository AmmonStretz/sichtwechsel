import { createApp, nextTick } from 'vue'
import { type Pinia } from 'pinia'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'
import PrintPage from '@/components/cards/PrintPage.vue'
async function renderPageToCanvas(
  piniaInstance: Pinia,
  pageIndex: number,
  mode: 'vorderseiten' | 'rueckseiten'
): Promise<HTMLCanvasElement> {
  const container = document.createElement('div')
  container.style.cssText = [
    'position:fixed',
    'left:0',
    'top:0',
    'width:794px',
    'height:1123px',
    'z-index:99999',
    'background:white',
    'pointer-events:none',
  ].join(';')
  document.body.appendChild(container)

  const app = createApp(PrintPage, {
    pageIndex,
    mode,
    isPdf: true,
  })
  app.use(piniaInstance)
  app.mount(container)

  await nextTick()
  await new Promise<void>(resolve => requestAnimationFrame(() => requestAnimationFrame(() => resolve())))

  const canvas = await html2canvas(container.firstElementChild as HTMLElement, {
    scale: 3,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false,
  })

  app.unmount()
  document.body.removeChild(container)

  return canvas
}

export async function exportToPdf(
  piniaInstance: Pinia,
  totalPages: number,
  onProgress?: (current: number, total: number) => void
): Promise<void> {
  const pdf = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  })

  const totalOperations = totalPages * 2
  let done = 0

  for (let i = 0; i < totalPages; i++) {
    for (const mode of ['vorderseiten', 'rueckseiten'] as const) {
      if (done > 0) pdf.addPage()

      const canvas = await renderPageToCanvas(piniaInstance, i, mode)
      const imgData = canvas.toDataURL('image/png')
      pdf.addImage(imgData, 'PNG', 0, 0, 210, 297)

      done++
      onProgress?.(done, totalOperations)
    }
  }

  pdf.save('sichtwechsel.pdf')
}
