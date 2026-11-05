---
name: saas-ui-redesign
description: Redesign this Vue 3 app's UI into a modern SaaS-style interface — a vertical left sidebar for navigation instead of a top nav bar, a consistent spacing/typography scale, and a polished professional look. Use when asked to "redesign the UI", "modernize the app", "add a sidebar", "make it look like a SaaS product/dashboard", or for any broad visual/layout overhaul request (as opposed to adding a single feature or component).
---

# SaaS UI Redesign

Restructures the app's layout and visual design without changing its features, routes, or data logic. The output should look like a modern SaaS dashboard (think Linear, Vercel, Stripe) rather than a classic top-nav web app.

## Success criteria

- Top nav bar is replaced by a **vertical left sidebar** containing all primary navigation.
- Every existing route is still reachable, and the active route is visually highlighted in the sidebar.
- A single **spacing scale** and **type scale** is applied consistently across every page — no more ad hoc margin/padding values.
- Cards, buttons, inputs, and tables share consistent radius, border, and shadow treatment.
- The sidebar collapses (or becomes off-canvas) on narrow viewports — this is not optional, it's what makes it feel like a real product rather than a prototype.
- No regressions: filters, modals, forms, and all other existing functionality keep working exactly as before.

## Process

### 1. Audit before touching anything

- Find the root layout component (in this app, `client/src/App.vue`) and read its current top-nav markup.
- List every route/view currently in the nav (check `client/src/main.js` for the route table) — each one needs an entry in the new sidebar.
- Identify "utility" elements that live in the current header but aren't primary nav: logo/brand, language switcher, profile menu, notifications, search. Decide where each goes:
  - Brand/logo → top of the sidebar.
  - Profile menu / utility icons → bottom of the sidebar, or a slim sticky top bar inside the content area (recommended if pages need breadcrumbs or page-level actions too).
- Check `client/src/locales/*.js` for nav label translation keys (e.g. `nav.overview`) — reuse them in the sidebar; don't hardcode strings that already have i18n keys.

### 2. Define design tokens first

Pick one consistent set of tokens and apply them everywhere, rather than inventing new values per component. Defaults if the app doesn't already have strong brand colors (check `App.vue`'s global `<style>` block first — reuse existing brand colors if they're already good, just apply them more consistently):

```css
:root {
  /* Surfaces */
  --surface-0: #ffffff;       /* page background */
  --surface-1: #f8fafc;       /* app shell / sidebar background */
  --surface-2: #ffffff;       /* cards */
  --border: #e2e8f0;

  /* Text */
  --text-primary: #0f172a;
  --text-secondary: #64748b;
  --text-muted: #94a3b8;

  /* Accent (swap for the app's existing brand color if one exists) */
  --accent: #2563eb;
  --accent-bg: #eff6ff;

  /* Status (keep existing semantics if the app already has them) */
  --success: #16a34a;
  --warning: #d97706;
  --danger: #dc2626;

  /* Spacing scale — 4px base unit, use these everywhere instead of arbitrary values */
  --space-1: 4px;
  --space-2: 8px;
  --space-3: 12px;
  --space-4: 16px;
  --space-5: 24px;
  --space-6: 32px;
  --space-8: 48px;
  --space-10: 64px;

  /* Radius */
  --radius-sm: 6px;   /* buttons, inputs, badges */
  --radius-md: 10px;  /* cards */
  --radius-lg: 14px;  /* modals, large panels */

  /* Elevation */
  --shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.06);
  --shadow-md: 0 4px 12px rgba(15, 23, 42, 0.08);

  /* Sidebar sizing */
  --sidebar-width: 248px;
  --sidebar-width-collapsed: 72px;
}
```

### 3. Build the sidebar component

Create one new component (e.g. `client/src/components/AppSidebar.vue`) that owns all primary navigation:

- **Top**: logo/brand, matching whatever was in the old header.
- **Middle**: nav links, each an icon + label, using `<router-link>` with active-state styling (`router-link-active` class, or compare `$route.path`). Pull labels from i18n if the app has it.
- **Bottom**: profile/utility menu, pinned with `margin-top: auto` in a flex column.
- **Collapse toggle**: a button that toggles between full width (`--sidebar-width`) and icon-only (`--sidebar-width-collapsed`). Persist the collapsed state in `localStorage` so it survives reloads. Below a breakpoint (~768px), prefer an off-canvas drawer with a hamburger trigger over squeezing a collapsed rail onto a phone-sized screen.
- Mark the `<nav>` with proper landmarks (`<nav aria-label="Primary">`) and set `aria-current="page"` on the active link.

Skeleton (match the app's existing component style — this project uses Composition API via `setup()`, not `<script setup>`; follow `client/CLAUDE.md` conventions):

```vue
<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }">
    <div class="sidebar-brand">
      <!-- logo / app name, hide label text when collapsed -->
    </div>
    <nav class="sidebar-nav" aria-label="Primary">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="sidebar-link"
        :class="{ active: route.path === item.path }"
      >
        <component :is="item.icon" class="sidebar-icon" />
        <span v-if="!isCollapsed" class="sidebar-label">{{ item.label }}</span>
      </router-link>
    </nav>
    <div class="sidebar-footer">
      <!-- profile menu / collapse toggle -->
    </div>
  </aside>
</template>
```

### 4. Restructure the root layout

In the root layout component, replace the stacked `header + main` structure with a horizontal layout:

```css
.app-shell {
  display: grid;
  grid-template-columns: var(--sidebar-width) 1fr;
  min-height: 100vh;
  transition: grid-template-columns 0.2s ease;
}
.app-shell.sidebar-collapsed {
  grid-template-columns: var(--sidebar-width-collapsed) 1fr;
}
.app-content {
  overflow-y: auto;
  padding: var(--space-6);
}
```

If any page-level bar (filters, search, page title) needs to stay visible across pages, make it a slim sticky bar inside `.app-content`, not part of the sidebar.

### 5. Apply the spacing scale everywhere

Sweep existing views and components and replace arbitrary padding/margin/gap values with the scale from step 2. Look especially at:
- Card/panel padding (standardize on one value, e.g. `--space-5`).
- Gaps between stat tiles, table rows, form fields.
- Page gutters (the padding around `.app-content`).

Don't do a silent global find-and-replace — check each usage renders correctly, since some values may be load-bearing for alignment with other elements.

### 6. Polish pass

- One consistent border-radius per element type (buttons/inputs = `--radius-sm`, cards = `--radius-md`, modals = `--radius-lg`).
- Subtle shadows only on elevated surfaces (cards, dropdowns, modals) — flat surfaces (the page background, the sidebar) stay shadow-free.
- Consistent hover/focus/active states for nav links, buttons, and table rows.
- Consistent loading/empty/error state styling across views (reuse one pattern, don't let each page invent its own).
- No emojis anywhere in the UI.

### 7. Verify before calling it done

- Every route in the old top nav is reachable from the new sidebar, and deep-linking still works.
- Active-route highlighting updates correctly when navigating.
- Resize to a narrow viewport and confirm the sidebar collapses/becomes off-canvas instead of overflowing or squashing content.
- Click through existing interactive features (filters, modals, forms) to confirm nothing broke — this is a layout/visual change, not a feature change.
- Visually inspect the result in a real browser (not just "looks right in the diff") — use the Playwright MCP tools if available, or the project's `run`/`verify` skill if one exists.

## Guardrails

- This is a structural + visual change only. Don't touch API calls, business logic, or data shapes unless a piece of logic needs to physically move (e.g. relocating a filter bar).
- Any `.vue` file you create or modify must go through the **vue-expert** subagent if this project's `CLAUDE.md` mandates that (check for a rule like "ANY time you create or modify a .vue file, delegate to vue-expert").
- Preserve all existing routes and i18n keys — add to them, don't replace without checking usage elsewhere.
- Keep the diff reviewable: resist the urge to also refactor unrelated logic while you're in these files.
