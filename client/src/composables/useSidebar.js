import { ref, computed } from 'vue'

const STORAGE_KEY = 'sidebar-collapsed'

// Shared module-level state so the sidebar, top bar (hamburger) and layout
// shell all stay in sync, following the same pattern as useFilters.js
const savedCollapsed = localStorage.getItem(STORAGE_KEY) === 'true'
const isCollapsed = ref(savedCollapsed)
const isMobileOpen = ref(false)

export function useSidebar() {
  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value
    localStorage.setItem(STORAGE_KEY, String(isCollapsed.value))
  }

  const openMobile = () => {
    isMobileOpen.value = true
  }

  const closeMobile = () => {
    isMobileOpen.value = false
  }

  const toggleMobile = () => {
    isMobileOpen.value = !isMobileOpen.value
  }

  return {
    isCollapsed: computed(() => isCollapsed.value),
    isMobileOpen: computed(() => isMobileOpen.value),
    toggleCollapse,
    openMobile,
    closeMobile,
    toggleMobile
  }
}
