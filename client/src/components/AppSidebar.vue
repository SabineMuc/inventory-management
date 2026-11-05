<template>
  <div v-if="isMobileOpen" class="sidebar-backdrop" @click="closeMobile"></div>

  <aside
    class="app-sidebar"
    :class="{ collapsed: isCollapsed, 'mobile-open': isMobileOpen }"
  >
    <div class="sidebar-brand">
      <div class="brand-mark">CC</div>
      <div v-if="!isCollapsed" class="brand-text">
        <span class="brand-name">{{ t('nav.companyName') }}</span>
        <span class="brand-subtitle">{{ t('nav.subtitle') }}</span>
      </div>
    </div>

    <nav class="sidebar-nav" aria-label="Primary">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="sidebar-link"
        :class="{ active: route.path === item.path }"
        :aria-current="route.path === item.path ? 'page' : null"
        :title="isCollapsed ? item.label : null"
        @click="closeMobile"
      >
        <svg class="sidebar-icon" viewBox="0 0 20 20" fill="none" v-html="item.icon"></svg>
        <span v-if="!isCollapsed" class="sidebar-label">{{ item.label }}</span>
      </router-link>
    </nav>

    <div class="sidebar-footer">
      <button
        type="button"
        class="collapse-toggle"
        @click="toggleCollapse"
        :title="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
        :aria-label="isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'"
      >
        <svg
          class="collapse-icon"
          :class="{ flipped: isCollapsed }"
          viewBox="0 0 20 20"
          fill="none"
        >
          <path d="M12.5 5L7.5 10l5 5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
        <span v-if="!isCollapsed" class="sidebar-label">Collapse</span>
      </button>
    </div>
  </aside>
</template>

<script>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from '../composables/useI18n'
import { useSidebar } from '../composables/useSidebar'

const ICONS = {
  overview: '<rect x="2.5" y="2.5" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="11.5" y="2.5" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="2.5" y="11.5" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/><rect x="11.5" y="11.5" width="6" height="6" rx="1" stroke="currentColor" stroke-width="1.5"/>',
  inventory: '<path d="M2.5 6.5L10 2.5l7.5 4-7.5 4-7.5-4z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M2.5 6.5v7L10 17.5l7.5-4v-7" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M10 10.5v7" stroke="currentColor" stroke-width="1.5"/>',
  orders: '<path d="M2.5 3h2l1.7 9.2a1.5 1.5 0 001.5 1.3h6.6a1.5 1.5 0 001.5-1.3l1-5.7h-12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><circle cx="7.5" cy="16.5" r="1.2" stroke="currentColor" stroke-width="1.5"/><circle cx="14" cy="16.5" r="1.2" stroke="currentColor" stroke-width="1.5"/>',
  finance: '<path d="M3 15l4.5-5 3 3L17 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 6h4v4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>',
  demand: '<path d="M3 17V10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M8 17V6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M13 17v-4" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M18 17V3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  reports: '<path d="M5.5 2.5h6l3 3v12h-9z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M11.5 2.5v3h3" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round"/><path d="M7.5 10.5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M7.5 13.5h5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>',
  restocking: '<path d="M16.5 8a6.5 6.5 0 00-11.6-2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M3.5 12a6.5 6.5 0 0011.6 2.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/><path d="M4.9 2.5v3h3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/><path d="M15.1 17.5v-3h-3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>'
}

export default {
  name: 'AppSidebar',
  setup() {
    const route = useRoute()
    const { t } = useI18n()
    const { isCollapsed, isMobileOpen, toggleCollapse, closeMobile } = useSidebar()

    const navItems = computed(() => [
      { path: '/', label: t('nav.overview'), icon: ICONS.overview },
      { path: '/inventory', label: t('nav.inventory'), icon: ICONS.inventory },
      { path: '/orders', label: t('nav.orders'), icon: ICONS.orders },
      { path: '/spending', label: t('nav.finance'), icon: ICONS.finance },
      { path: '/demand', label: t('nav.demandForecast'), icon: ICONS.demand },
      { path: '/reports', label: t('nav.reports'), icon: ICONS.reports },
      { path: '/restocking', label: t('nav.restocking'), icon: ICONS.restocking }
    ])

    return {
      route,
      t,
      isCollapsed,
      isMobileOpen,
      toggleCollapse,
      closeMobile,
      navItems
    }
  }
}
</script>

<style scoped>
.sidebar-backdrop {
  display: none;
}

.app-sidebar {
  display: flex;
  flex-direction: column;
  width: var(--sidebar-width);
  background: var(--surface-2);
  border-right: 1px solid var(--border);
  height: 100vh;
  position: sticky;
  top: 0;
  overflow-y: auto;
  overflow-x: hidden;
  transition: width 0.2s ease;
}

.app-sidebar.collapsed {
  width: var(--sidebar-width-collapsed);
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-4);
  border-bottom: 1px solid var(--border);
  min-height: 70px;
}

.brand-mark {
  flex-shrink: 0;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-sm);
  background: linear-gradient(135deg, var(--accent) 0%, #1e40af 100%);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  font-size: 0.813rem;
  letter-spacing: 0.025em;
}

.brand-text {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.brand-name {
  font-size: 0.938rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.025em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.brand-subtitle {
  font-size: 0.688rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  padding: var(--space-4) var(--space-3);
  flex: 1;
}

.sidebar-link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  color: var(--text-secondary);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.875rem;
  border-radius: var(--radius-sm);
  transition: all 0.15s ease;
  white-space: nowrap;
}

.sidebar-link:hover {
  color: var(--text-primary);
  background: var(--surface-1);
}

.sidebar-link.active {
  color: var(--accent);
  background: var(--accent-bg);
}

.sidebar-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
}

.sidebar-label {
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-footer {
  padding: var(--space-3);
  border-top: 1px solid var(--border);
}

.collapse-toggle {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  width: 100%;
  padding: var(--space-3);
  background: none;
  border: none;
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 500;
  transition: all 0.15s ease;
}

.collapse-toggle:hover {
  color: var(--text-primary);
  background: var(--surface-1);
}

.collapse-icon {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  transition: transform 0.2s ease;
}

.collapse-icon.flipped {
  transform: rotate(180deg);
}

/* Off-canvas drawer behavior on narrow viewports */
@media (max-width: 768px) {
  .app-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    z-index: 300;
    width: var(--sidebar-width);
    transform: translateX(-100%);
    box-shadow: var(--shadow-md);
  }

  .app-sidebar.collapsed {
    width: var(--sidebar-width);
  }

  .app-sidebar.mobile-open {
    transform: translateX(0);
  }

  .sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.4);
    z-index: 250;
  }
}
</style>
