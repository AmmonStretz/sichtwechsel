import { ref, watch, onMounted, onUnmounted, type Ref } from 'vue'

export function useOverflowDetection(
  contentRef: Ref<HTMLElement | null>,
  dependencies: () => unknown
) {
  const isOverflowing = ref(false)
  let rafId = 0

  function check() {
    const el = contentRef.value
    if (!el) return
    isOverflowing.value = el.scrollHeight > el.clientHeight + 1
  }

  function scheduleCheck() {
    cancelAnimationFrame(rafId)
    rafId = requestAnimationFrame(check)
  }

  const observer = new ResizeObserver(scheduleCheck)

  onMounted(() => {
    if (contentRef.value) observer.observe(contentRef.value)
    scheduleCheck()
  })

  onUnmounted(() => {
    observer.disconnect()
    cancelAnimationFrame(rafId)
  })

  watch(dependencies, scheduleCheck)
  watch(contentRef, (el, _, onCleanup) => {
    if (el) {
      observer.observe(el)
      onCleanup(() => observer.unobserve(el))
    }
    scheduleCheck()
  })

  return { isOverflowing, checkNow: check }
}
