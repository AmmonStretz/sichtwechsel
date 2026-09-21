import { ref } from 'vue'

export function useDragDrop(onFile: (file: File) => void, accept?: string[]) {
  const isDragging = ref(false)

  function onDragOver(e: DragEvent) {
    e.preventDefault()
    isDragging.value = true
  }

  function onDragLeave(e: DragEvent) {
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
      isDragging.value = false
    }
  }

  function onDrop(e: DragEvent) {
    e.preventDefault()
    isDragging.value = false
    const file = e.dataTransfer?.files[0]
    if (!file) return
    if (accept && !accept.some(ext => file.name.toLowerCase().endsWith(ext))) return
    onFile(file)
  }

  function onFileInput(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0]
    if (file) onFile(file)
  }

  return { isDragging, onDragOver, onDragLeave, onDrop, onFileInput }
}
