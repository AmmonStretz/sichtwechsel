import { ref, onMounted, onUnmounted, type Ref } from 'vue'

const A4_WIDTH_PX = 794

export function usePrintScale(containerRef: Ref<HTMLElement | null>) {
  const scale = ref(1)

  function updateScale() {
    if (!containerRef.value) return
    const available = containerRef.value.clientWidth - 48
    scale.value = Math.min(1, available / A4_WIDTH_PX)
  }

  const observer = new ResizeObserver(updateScale)

  onMounted(() => {
    if (containerRef.value) observer.observe(containerRef.value)
    updateScale()
  })

  onUnmounted(() => observer.disconnect())

  return { scale }
}
