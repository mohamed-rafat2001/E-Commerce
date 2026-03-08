# Global Design System — Full Style Unification Prompt
# Covers: Landing Page · Customer Panel · Seller Panel · Admin Panel

---

## Your Role
You are a senior frontend engineer and design systems architect. The app already has a landing page, customer panel, seller panel, and admin panel — all built separately with inconsistent styles. Your job is to **audit every existing panel and page**, then **unify all styles** under one single design system so the entire app looks and feels like it was built by one team with one vision.

> ⚠️ **Do NOT rewrite any logic, hooks, or data-fetching code.**
> **Do NOT change any component structure or file organization.**
> Your job is ONLY to fix and unify styles — colors, typography, spacing, shadows, borders, buttons, inputs, cards, tables, badges, and layouts.

---

## ⚠️ FIRST THING TO DO — Full Project Audit

Before touching a single file, do the following:

1. **Scan the entire project folder structure** — understand where every panel lives
2. **Open and read the existing styles** in each panel — note every inconsistency you find:
   - Different button colors or shapes across panels
   - Different font sizes for the same type of heading
   - Different card padding, shadow, or border-radius
   - Different input field styles
   - Different table styles (admin vs seller)
   - Different spacing between sections
   - Different sidebar/navbar styles
3. **List all inconsistencies found** and show them to the developer before making any changes
4. **Confirm the design token values** with the developer (brand color, accent, fonts) before writing the theme file

---

## PART 1 — THE SINGLE SOURCE OF TRUTH (Theme File)

Create **one** global theme constants file (place it where utilities or constants already live in the project).
Every panel — landing, customer, seller, admin — must import from this single file.
**No panel has its own separate style constants.** There is only one.

```javascript
export const theme = {

  // ─── COLORS ───────────────────────────────────────────────
  colors: {
    // Brand
    primary:       "bg-primary text-white",          // main buttons, active states
    primaryHover:  "hover:bg-primary-dark",
    primaryText:   "text-primary",
    primaryBg:     "bg-primary-light",               // subtle tinted backgrounds
    primaryBorder: "border-primary",

    // Accent
    accent:        "text-accent",
    accentBg:      "bg-accent",

    // Neutrals — used everywhere
    textMain:      "text-gray-900",                  // headings, labels
    textMuted:     "text-gray-500",                  // subtitles, helper text
    textLight:     "text-gray-400",                  // placeholders, disabled
    textInverse:   "text-white",                     // text on dark backgrounds

    // Backgrounds
    bgPage:        "bg-gray-50",                     // page-level background
    bgCard:        "bg-white",                       // card/panel background
    bgSoft:        "bg-gray-100",                    // subtle section fill
    bgDark:        "bg-gray-900",                    // dark sections, footer
    bgSidebar:     "bg-white",                       // sidebar background

    // Borders
    border:        "border-gray-200",                // default border
    borderDark:    "border-gray-300",
    borderFocus:   "focus:border-primary",

    // Semantic
    success:       "text-green-600",
    successBg:     "bg-green-50",
    successBorder: "border-green-200",
    warning:       "text-yellow-600",
    warningBg:     "bg-yellow-50",
    error:         "text-red-600",
    errorBg:       "bg-red-50",
    errorBorder:   "border-red-200",
    info:          "text-blue-600",
    infoBg:        "bg-blue-50",
  },

  // ─── TYPOGRAPHY ───────────────────────────────────────────
  typography: {
    // Fonts
    displayFont: "font-display",                     // hero headlines, page titles
    bodyFont:    "font-body",                        // all body text

    // Sizes — use these everywhere, never pick random sizes
    heroTitle:     "text-5xl md:text-7xl font-extrabold tracking-tight font-display",
    pageTitle:     "text-2xl md:text-3xl font-bold tracking-tight font-display",   // top of every panel page
    sectionTitle:  "text-xl md:text-2xl font-semibold font-display",               // section headings inside pages
    cardTitle:     "text-base md:text-lg font-semibold",
    label:         "text-sm font-medium text-gray-700",                            // form labels
    body:          "text-base leading-relaxed",
    small:         "text-sm leading-relaxed",
    tiny:          "text-xs",
    tableHeader:   "text-xs font-semibold uppercase tracking-wider text-gray-500", // table <th>
  },

  // ─── SPACING ──────────────────────────────────────────────
  spacing: {
    // Landing page sections
    sectionY:     "py-20 md:py-28",
    sectionX:     "px-4 md:px-8",
    container:    "max-w-7xl mx-auto",

    // Panel pages (customer / seller / admin)
    pageY:        "py-6 md:py-8",
    pageX:        "px-4 md:px-6",
    panelContainer: "max-w-screen-xl mx-auto",

    // Cards
    cardPadding:  "p-4 md:p-6",
    cardGap:      "gap-4 md:gap-6",

    // Grids
    gridGap:      "gap-4 md:gap-6",
    gridGapLarge: "gap-6 md:gap-10",
  },

  // ─── BORDER RADIUS ────────────────────────────────────────
  radius: {
    card:    "rounded-2xl",
    panel:   "rounded-xl",
    button:  "rounded-lg",
    badge:   "rounded-full",
    input:   "rounded-lg",
    image:   "rounded-xl",
    avatar:  "rounded-full",
    table:   "rounded-xl",
    modal:   "rounded-2xl",
    tooltip: "rounded-md",
  },

  // ─── SHADOWS ──────────────────────────────────────────────
  shadow: {
    card:        "shadow-sm border border-gray-200",
    cardHover:   "shadow-md",
    panel:       "shadow-sm",
    dropdown:    "shadow-lg",
    modal:       "shadow-2xl",
    sidebar:     "shadow-sm border-r border-gray-200",
    button:      "shadow-sm",
    input:       "shadow-none",
    inputFocus:  "focus:shadow-sm focus:ring-2 focus:ring-primary/20",
    table:       "shadow-sm border border-gray-200",
  },

  // ─── TRANSITIONS ──────────────────────────────────────────
  transition: {
    default: "transition-all duration-300 ease-in-out",
    fast:    "transition-all duration-150 ease-in-out",
    slow:    "transition-all duration-500 ease-in-out",
    bounce:  "transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
  },
}
```

---

## PART 2 — TAILWIND CONFIG

Extend the existing `tailwind.config.js` — do not replace it, only add to the `extend` block:

```javascript
extend: {
  fontFamily: {
    display: ["YourDisplayFont", "serif"],     // used for titles
    body:    ["YourBodyFont", "sans-serif"],   // used for all body text
  },
  colors: {
    primary: {
      DEFAULT: "#your-brand-hex",
      dark:    "#your-brand-dark-hex",
      light:   "#your-brand-light-hex",
    },
    accent: "#your-accent-hex",
  },
  borderRadius: {
    "2xl": "16px",
    "3xl": "24px",
  },
}
```

Import both fonts in the global CSS file (wherever it already exists in the project).

---

## PART 3 — SHARED REUSABLE COMPONENTS

These components must be created once and used across ALL panels without modification.
Place them wherever shared/common components already live in the project.

---

### Button
The single button component used on every page in every panel.

```
Props:
  variant:  "primary" | "outline" | "ghost" | "danger" | "success"
  size:     "sm" | "md" | "lg"
  icon:     ReactNode (optional, left or right)
  isLoading: boolean
  disabled: boolean
  fullWidth: boolean

Styles per variant:
  primary  → bg-primary text-white hover:bg-primary-dark shadow-sm
  outline  → border border-primary text-primary hover:bg-primary-light
  ghost    → text-gray-600 hover:bg-gray-100
  danger   → bg-red-500 text-white hover:bg-red-600
  success  → bg-green-500 text-white hover:bg-green-600

Styles per size:
  sm → px-3 py-1.5 text-sm rounded-lg
  md → px-4 py-2 text-sm rounded-lg   (default)
  lg → px-6 py-3 text-base rounded-lg

Always include: transition-all duration-150 font-medium
Loading state: replace content with a spinner, keep same size
```

---

### Input
The single input component used in all forms across all panels.

```
Props:
  label, placeholder, type, value, onChange
  error: string (validation message)
  hint:  string (helper text below)
  icon:  ReactNode (left icon inside input)
  disabled: boolean

Styles:
  wrapper: flex flex-col gap-1
  label:   text-sm font-medium text-gray-700
  input:   w-full px-3 py-2.5 rounded-lg border border-gray-200
           bg-white text-gray-900 text-sm
           focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
           disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
           transition-all duration-150
  error:   text-xs text-red-500 mt-1
  hint:    text-xs text-gray-400 mt-1
```

---

### Card
The single card component used across all panels.

```
Props:
  padding: "sm" | "md" | "lg" (default: "md")
  hoverable: boolean (adds hover shadow + slight lift)
  className: string (for overrides)

Styles:
  base:     bg-white rounded-2xl border border-gray-200 shadow-sm
  padding sm:  p-3
  padding md:  p-4 md:p-6  (default)
  padding lg:  p-6 md:p-8
  hoverable:   hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 cursor-pointer
```

---

### Badge
Used for status labels, tags, and category pills across all panels.

```
Props:
  label:   string
  variant: "default" | "primary" | "success" | "warning" | "error" | "info" | "new" | "sale" | "featured"

Styles per variant:
  default:  bg-gray-100 text-gray-600
  primary:  bg-primary-light text-primary
  success:  bg-green-50 text-green-700
  warning:  bg-yellow-50 text-yellow-700
  error:    bg-red-50 text-red-600
  info:     bg-blue-50 text-blue-700
  new:      bg-emerald-500 text-white
  sale:     bg-red-500 text-white
  featured: bg-yellow-400 text-yellow-900

Always: text-xs font-semibold px-2.5 py-0.5 rounded-full inline-flex items-center
```

---

### PageHeader
Used at the top of every page in every panel.

```
Props:
  title:        string
  subtitle:     string (optional)
  breadcrumbs:  array (optional)
  actions:      ReactNode (buttons on the right)

Styles:
  wrapper:    flex items-start justify-between mb-6 md:mb-8
  title:      text-2xl md:text-3xl font-bold text-gray-900 font-display
  subtitle:   text-sm text-gray-500 mt-1
  breadcrumb: text-xs text-gray-400 mb-2 flex items-center gap-1
  actions:    flex items-center gap-3
```

---

### DataTable
Used for all tables in seller and admin panels.

```
Props:
  columns:  array of { key, label, render? }
  data:     array
  isLoading: boolean
  emptyMessage: string

Styles:
  wrapper:  w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm
  table:    w-full text-sm
  thead:    bg-gray-50 border-b border-gray-200
  th:       px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500
  tbody tr: hover:bg-gray-50 border-b border-gray-100 last:border-0 transition-colors duration-150
  td:       px-4 py-3 text-gray-700
```

---

### StatCard
Used in admin and seller dashboards for metric cards.

```
Props:
  title:  string
  value:  string | number
  change: number (% change, positive or negative)
  icon:   ReactNode
  color:  "primary" | "success" | "warning" | "error" | "info"

Styles:
  wrapper:   bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6
  icon area: w-12 h-12 rounded-xl flex items-center justify-center (color-tinted bg)
  title:     text-sm text-gray-500 font-medium
  value:     text-2xl md:text-3xl font-bold text-gray-900 font-display mt-1
  change:    text-xs font-medium (green if positive, red if negative)
```

---

### Skeleton
Used in every panel while data is loading.

```
Props:
  variant: "text" | "card" | "table-row" | "avatar" | "image"
  count:   number

Styles:
  base:    bg-gray-200 rounded animate-pulse
  text:    h-4 w-full rounded
  card:    h-40 w-full rounded-2xl
  avatar:  h-10 w-10 rounded-full
  image:   h-48 w-full rounded-xl
```

---

### EmptyState
Used whenever a list, table, or section has no data.

```
Props:
  icon:     ReactNode
  title:    string
  message:  string
  action:   { label, onClick } (optional)

Styles:
  wrapper:  flex flex-col items-center justify-center py-16 px-4 text-center
  icon:     text-gray-300 mb-4 (size: 48px)
  title:    text-lg font-semibold text-gray-700
  message:  text-sm text-gray-400 mt-1 max-w-sm
  action:   mt-6 (uses Button component, variant: primary)
```

---

### Modal
Used for all dialogs/confirmations across all panels.

```
Props:
  isOpen, onClose, title, size ("sm" | "md" | "lg")
  children, footer

Styles:
  overlay:  fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4
  panel:    bg-white rounded-2xl shadow-2xl w-full
            sm: max-w-sm, md: max-w-md, lg: max-w-2xl
  header:   flex items-center justify-between px-6 py-4 border-b border-gray-200
  title:    text-lg font-semibold text-gray-900
  body:     px-6 py-5
  footer:   flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl
```

---

## PART 4 — PANEL-SPECIFIC LAYOUT RULES

Each panel has a layout wrapper (sidebar + content area). These must be consistent:

### Sidebar (Customer, Seller, Admin)
```
Styles:
  wrapper:     w-64 bg-white border-r border-gray-200 shadow-sm h-screen sticky top-0
  logo area:   h-16 px-6 flex items-center border-b border-gray-200
  nav list:    flex flex-col gap-1 px-3 py-4
  nav item:    flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
               text-gray-600 hover:bg-gray-100 hover:text-gray-900
               transition-all duration-150 cursor-pointer
  nav active:  bg-primary-light text-primary font-semibold
  nav icon:    w-5 h-5 flex-shrink-0
  section label: text-xs font-semibold uppercase tracking-wider text-gray-400 px-3 mb-1 mt-4
```

### Top Navbar (all panels)
```
Styles:
  wrapper:     h-16 bg-white border-b border-gray-200 flex items-center
               justify-between px-4 md:px-6 sticky top-0 z-40 shadow-sm
  left:        flex items-center gap-4
  right:       flex items-center gap-3
  avatar:      w-9 h-9 rounded-full object-cover cursor-pointer ring-2 ring-gray-200
               hover:ring-primary transition-all duration-150
  notification icon: w-9 h-9 rounded-lg flex items-center justify-center
                     text-gray-500 hover:bg-gray-100 transition-all duration-150
```

### Main Content Area (all panels)
```
Styles:
  wrapper: flex-1 bg-gray-50 min-h-screen
  inner:   max-w-screen-xl mx-auto px-4 md:px-6 py-6 md:py-8
```

---

## PART 5 — PAGE-BY-PAGE STYLE RULES

### Landing Page
- Already defined in the landing page prompt
- Must import all buttons, badges, cards from the shared component library

### Customer Panel
Every customer page must use:
- `PageHeader` component at the top
- `Card` for content sections
- `Button` from shared library — no custom styled buttons
- `Badge` for order statuses (pending → warning, delivered → success, cancelled → error)
- `DataTable` for order history
- `Skeleton` while any data loads
- `EmptyState` when orders/wishlist/addresses are empty

### Seller Panel
Every seller page must use:
- `PageHeader` component at the top
- `StatCard` for dashboard metrics grid
- `DataTable` for products, orders, reviews tables
- `Button` from shared library for all actions
- `Badge` for product status (active → success, inactive → default) and order status
- `Modal` for confirmations (delete product, update status)
- `Skeleton` while data loads
- `EmptyState` when no products or orders exist

### Admin Panel
Every admin page must use:
- `PageHeader` component at the top
- `StatCard` for all KPI/metric grids
- `DataTable` for all entity listings (users, orders, products, sellers)
- `Button` from shared library only
- `Badge` for all status labels (user status, order status, seller verification)
- `Modal` for all confirmations and detail views
- `Skeleton` while data loads
- `EmptyState` for empty states

---

## PART 6 — STATUS BADGE MAPPING (Consistent Across All Panels)

Use the same badge variant for the same status everywhere — customer panel, seller panel, admin panel:

| Status | Badge Variant |
|--------|--------------|
| pending | warning |
| processing | info |
| shipped | primary |
| delivered | success |
| cancelled | error |
| refunded | default |
| active / in stock | success |
| inactive / out of stock | error |
| draft | default |
| featured | featured |
| new | new |
| sale | sale |
| verified | success |
| unverified | warning |
| banned / suspended | error |

---

## PART 7 — TYPOGRAPHY CONSISTENCY RULES

Every heading in every panel must follow this exact mapping:

| Element | Token to use |
|---------|-------------|
| Browser page `<title>` | — |
| Main page heading (top of page) | `pageTitle` |
| Section heading inside a page | `sectionTitle` |
| Card title | `cardTitle` |
| Form label | `label` |
| Table header `<th>` | `tableHeader` |
| Body / description text | `body` |
| Helper / hint text | `small` |
| Metadata / timestamps | `tiny` |

**Rules:**
- Never use `font-bold` without also specifying a size token
- Never use `text-2xl` alone — always combine with a semantic token
- Never use system fonts — always use the two registered fonts (display + body)

---

## PART 8 — SPACING CONSISTENCY RULES

| Context | Token to use |
|---------|-------------|
| Landing page section padding | `sectionY` + `sectionX` |
| Panel page outer padding | `pageY` + `pageX` |
| Panel content container | `panelContainer` |
| Card internal padding | `cardPadding` |
| Grid between cards | `gridGap` |
| Large grid (featured, hero grid) | `gridGapLarge` |

**Rules:**
- Never use `p-5` or `p-7` — only use token padding values
- Never mix `gap-3` in one section and `gap-6` in another for the same grid type
- All panel pages have the same max-width container

---

## PART 9 — WHAT TO FIX IN EXISTING PANELS

When you audit the existing code, find and fix all of these:

| Problem | Fix |
|---------|-----|
| Button in one panel is `rounded-full`, in another is `rounded-md` | Replace all with `Button` component, `radius.button` |
| Card shadow is `shadow-lg` in customer, `shadow-sm` in admin | Replace all with `Card` component, `shadow.card` |
| Input has `rounded-md` in one place, `rounded-xl` in another | Replace all with `Input` component, `radius.input` |
| Table `<th>` text is `font-bold text-sm` somewhere and `font-medium text-xs` elsewhere | Replace all with `DataTable`, `tableHeader` token |
| Status badge is a raw `span` with hardcoded color class | Replace all with `Badge` component and correct variant |
| Page title is `text-3xl` here and `text-2xl` there | Replace all with `PageHeader` component, `pageTitle` token |
| Sidebar active state is `bg-blue-100` in one panel and `bg-indigo-50` in another | Unify with `primary-light` + `text-primary` token |
| Some panels have `py-4` page padding, others have `py-8` | Replace all with `pageY` token |
| Custom spinner/loading components per panel | Replace all with `Skeleton` component |
| Custom empty state per panel | Replace all with `EmptyState` component |

---

## PART 10 — WHAT NOT TO DO

- ❌ Do NOT create panel-specific style constants — there is ONE theme file for everything
- ❌ Do NOT write a button with custom Tailwind classes — always use the `Button` component
- ❌ Do NOT hardcode any color, font, spacing, shadow, or border-radius in any component
- ❌ Do NOT use arbitrary Tailwind values like `text-[#333]` or `bg-[#f5f5f5]`
- ❌ Do NOT use different card styles across panels — one `Card` component everywhere
- ❌ Do NOT use different badge implementations — one `Badge` component everywhere
- ❌ Do NOT use different table styles — one `DataTable` component everywhere
- ❌ Do NOT skip the transition class on any interactive element
- ❌ Do NOT change any component logic, hooks, or data-fetching — style only
- ❌ Do NOT invent new folder paths — follow the existing project structure

---

## Deliverables — In This Exact Order

> ⚠️ **Step 0:** Scan the entire project, audit all 4 panels, list every style inconsistency found, confirm theme values (brand color, fonts) with the developer — then start.

1. Global theme constants file
2. Updated `tailwind.config.js` (extend only)
3. Updated global CSS file (font imports)
4. Shared `Button` component
5. Shared `Input` component
6. Shared `Card` component
7. Shared `Badge` component
8. Shared `PageHeader` component
9. Shared `DataTable` component
10. Shared `StatCard` component
11. Shared `Skeleton` component
12. Shared `EmptyState` component
13. Shared `Modal` component
14. Updated sidebar styles (same across all panels)
15. Updated navbar styles (same across all panels)
16. Customer panel — replace all custom styles with shared components + tokens
17. Seller panel — replace all custom styles with shared components + tokens
18. Admin panel — replace all custom styles with shared components + tokens
19. Landing page — connect to shared Button, Badge, Card components

**After all changes:** do a final pass and verify the consistency checklist below is fully satisfied.

---

## Final Consistency Checklist

Before delivering, verify across all 4 panels:

- [ ] Same button shape, color, and hover style everywhere
- [ ] Same input field style everywhere
- [ ] Same card padding, radius, and shadow everywhere
- [ ] Same badge shape and color-per-status everywhere
- [ ] Same page title size and font everywhere
- [ ] Same section heading size and font everywhere
- [ ] Same table header style everywhere
- [ ] Same sidebar active state everywhere
- [ ] Same navbar height and style everywhere
- [ ] Same page-level padding and container width everywhere
- [ ] Same transition speed on all interactive elements
- [ ] No hardcoded colors anywhere
- [ ] No arbitrary Tailwind values anywhere
- [ ] Both registered fonts (display + body) used correctly everywhere
