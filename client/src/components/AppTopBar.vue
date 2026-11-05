<template>
  <div class="app-topbar">
    <button
      type="button"
      class="mobile-menu-toggle"
      @click="toggleMobile"
      aria-label="Toggle navigation menu"
    >
      <svg viewBox="0 0 20 20" fill="none">
        <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
      </svg>
    </button>

    <FilterBar class="topbar-filters" />

    <div class="topbar-actions">
      <LanguageSwitcher />
      <ProfileMenu
        @show-profile-details="$emit('show-profile-details')"
        @show-tasks="$emit('show-tasks')"
      />
    </div>
  </div>
</template>

<script>
import FilterBar from './FilterBar.vue'
import LanguageSwitcher from './LanguageSwitcher.vue'
import ProfileMenu from './ProfileMenu.vue'
import { useSidebar } from '../composables/useSidebar'

export default {
  name: 'AppTopBar',
  components: {
    FilterBar,
    LanguageSwitcher,
    ProfileMenu
  },
  emits: ['show-profile-details', 'show-tasks'],
  setup() {
    const { toggleMobile } = useSidebar()

    return {
      toggleMobile
    }
  }
}
</script>

<style scoped>
.app-topbar {
  position: sticky;
  top: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  gap: var(--space-4);
  background: var(--surface-2);
  border-bottom: 1px solid var(--border);
  box-shadow: var(--shadow-sm);
  padding: var(--space-3) var(--space-6);
}

.mobile-menu-toggle {
  display: none;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  background: none;
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text-secondary);
  cursor: pointer;
}

.mobile-menu-toggle:hover {
  background: var(--surface-1);
  color: var(--text-primary);
}

.mobile-menu-toggle svg {
  width: 18px;
  height: 18px;
}

.topbar-filters {
  flex: 1;
  min-width: 0;
}

.topbar-actions {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}

@media (max-width: 768px) {
  .app-topbar {
    flex-wrap: wrap;
    padding: var(--space-3) var(--space-4);
  }

  .mobile-menu-toggle {
    display: flex;
  }

  .topbar-filters {
    order: 3;
    flex-basis: 100%;
  }
}
</style>
