# E-Commerce Landing Page + Global Design System — Full Implementation Prompt
# Covers: Landing Page · Customer Panel · Seller Panel · Admin Panel

---

## Your Role
You are a senior React frontend engineer, UI/UX designer, and design systems architect.
You have two responsibilities in this prompt:

1. **Build a production-grade, fully animated landing page** for a multi-role e-commerce ecosystem (customers, sellers, admins, and other users)
2. **Unify the styles** of the already-built customer panel, seller panel, and admin panel under one global design system so the entire app looks like it was built by one team

> ⚠️ For the existing panels — Do NOT rewrite any logic, hooks, or data-fetching code. Style unification only.
> For the landing page — build everything from scratch following the architecture rules below.

---

## Tech Stack
- Framework: React (functional components + hooks only)
- Styling: Tailwind CSS
- Animations: Framer Motion (primary) + CSS transitions for micro-interactions
- Slider / Carousel: Swiper.js
- AI Images: Banana AI (https://www.banana.dev) for generating hero and product images
- HTTP Client: Axios
- Icons: React Icons or Lucide React
- Smooth scroll: Lenis

---

## ⚠️ FIRST THING TO DO — Scan the Project

Before writing a single line of code:
1. Scan the entire project folder structure
2. Understand how it is already organized — where components live, where hooks live, where pages live, where utilities live
3. Audit the existing customer, seller, and admin panels — note every style inconsistency (different buttons, different card shadows, different spacing, different fonts)
4. List all inconsistencies and confirm brand color + font choices with the developer
5. Only then start building

Every file you create must be placed inside the correct **existing** folder.
**Never invent or suggest new folder paths.** Ask if unsure.

---

## ⚠️ Architecture Rules — Read Before Writing Any Code

### Component Rules
- Every section is its own isolated component file
- Every component over 40 lines must be broken into smaller sub-components
- No component file should exceed 80 lines — split if it does
- Shared/repeated UI elements go into the shared components folder (wherever it already exists)

### Hook Rules
- Every piece of logic (data fetching, state, side effects) must live in a custom hook
- No logic inside JSX — JSX is pure presentation only
- Hook naming: always `use` prefix (e.g. `useHeroSlider`, `useProducts`, `useBrands`)

### Style Rules
- Every color, font, spacing, shadow, and border-radius must come from the global theme file (Part 1)
- Never hardcode a value directly in a component
- Never use arbitrary Tailwind values like `text-[#333]` or `bg-[#fff]`

### Animation Rules
- All Framer Motion variants centralized in one variants file — never defined inline
- Place variants file wherever utilities or helpers already live

---

# ════════════════════════════════════════
# SECTION A — GLOBAL DESIGN SYSTEM
# (Used by Landing Page + All Panels)
# ════════════════════════════════════════

## PART A1 — GLOBAL THEME FILE (Create This First)

Create one global theme constants file before writing any component.
Every panel and the landing page imports from this single file. No exceptions.

```javascript
export const theme = {

  // ─── COLORS ───────────────────────────────────────────────
  colors: {
    primary:       "bg-primary text-white",
    primaryHover:  "hover:bg-primary-dark",
    primaryText:   "text-primary",
    primaryBg:     "bg-primary-light",
    primaryBorder: "border-primary",
    accent:        "text-accent",
    accentBg:      "bg-accent",

    textMain:      "text-gray-900",
    textMuted:     "text-gray-500",
    textLight:     "text-gray-400",
    textInverse:   "text-white",

    bgPage:        "bg-gray-50",
    bgCard:        "bg-white",
    bgSoft:        "bg-gray-100",
    bgDark:        "bg-gray-900",
    bgSidebar:     "bg-white",
    border:        "border-gray-200",
    borderDark:    "border-gray-300",

    success:       "text-green-600",  successBg: "bg-green-50",
    warning:       "text-yellow-600", warningBg: "bg-yellow-50",
    error:         "text-red-600",    errorBg:   "bg-red-50",
    info:          "text-blue-600",   infoBg:    "bg-blue-50",
  },

  // ─── TYPOGRAPHY ───────────────────────────────────────────
  typography: {
    displayFont:  "font-display",
    bodyFont:     "font-body",
    heroTitle:    "text-5xl md:text-7xl font-extrabold tracking-tight font-display",
    pageTitle:    "text-2xl md:text-3xl font-bold tracking-tight font-display",
    sectionTitle: "text-xl md:text-2xl font-semibold font-display",
    cardTitle:    "text-base md:text-lg font-semibold",
    label:        "text-sm font-medium text-gray-700",
    body:         "text-base leading-relaxed",
    small:        "text-sm leading-relaxed",
    tiny:         "text-xs",
    tableHeader:  "text-xs font-semibold uppercase tracking-wider text-gray-500",
  },

  // ─── SPACING ──────────────────────────────────────────────
  spacing: {
    sectionY:       "py-20 md:py-28",       // landing page sections
    sectionX:       "px-4 md:px-8",
    container:      "max-w-7xl mx-auto",
    pageY:          "py-6 md:py-8",         // panel pages
    pageX:          "px-4 md:px-6",
    panelContainer: "max-w-screen-xl mx-auto",
    cardPadding:    "p-4 md:p-6",
    gridGap:        "gap-4 md:gap-6",
    gridGapLarge:   "gap-6 md:gap-10",
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
  },

  // ─── SHADOWS ──────────────────────────────────────────────
  shadow: {
    card:      "shadow-sm border border-gray-200",
    cardHover: "shadow-md",
    panel:     "shadow-sm",
    dropdown:  "shadow-lg",
    modal:     "shadow-2xl",
    sidebar:   "shadow-sm border-r border-gray-200",
    table:     "shadow-sm border border-gray-200",
  },

  // ─── TRANSITIONS ──────────────────────────────────────────
  transition: {
    default: "transition-all duration-300 ease-in-out",
    fast:    "transition-all duration-150 ease-in-out",
    slow:    "transition-all duration-500 ease-in-out",
  },
}
```

---

## PART A2 — TAILWIND CONFIG

Extend the existing `tailwind.config.js` — add to the `extend` block only:

```javascript
extend: {
  fontFamily: {
    display: ["YourDisplayFont", "serif"],
    body:    ["YourBodyFont", "sans-serif"],
  },
  colors: {
    primary: { DEFAULT: "#your-hex", dark: "#your-dark-hex", light: "#your-light-hex" },
    accent:  "#your-accent-hex",
  },
}
```

Import both fonts in the global CSS file (wherever it already exists).

---

## PART A3 — SHARED REUSABLE COMPONENTS

Create these once. Used by landing page AND all panels. No duplication ever.

### Button
```
Props: variant (primary|outline|ghost|danger|success), size (sm|md|lg),
       icon, isLoading, disabled, fullWidth

Styles:
  primary:  bg-primary text-white hover:bg-primary-dark shadow-sm
  outline:  border border-primary text-primary hover:bg-primary-light
  ghost:    text-gray-600 hover:bg-gray-100
  danger:   bg-red-500 text-white hover:bg-red-600
  success:  bg-green-500 text-white hover:bg-green-600
  sm: px-3 py-1.5 text-sm rounded-lg
  md: px-4 py-2 text-sm rounded-lg
  lg: px-6 py-3 text-base rounded-lg
  Always: transition-all duration-150 font-medium
  Loading: spinner replaces content, same size preserved
```

### Input
```
Props: label, placeholder, type, value, onChange, error, hint, icon, disabled

Styles:
  input: w-full px-3 py-2.5 rounded-lg border border-gray-200 bg-white text-sm
         focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary
         disabled:bg-gray-50 disabled:text-gray-400 transition-all duration-150
  label: text-sm font-medium text-gray-700
  error: text-xs text-red-500 mt-1
  hint:  text-xs text-gray-400 mt-1
```

### Card
```
Props: padding (sm|md|lg), hoverable, className
  base:     bg-white rounded-2xl border border-gray-200 shadow-sm
  hoverable: hover:shadow-md hover:-translate-y-0.5 transition-all duration-300
```

### Badge
```
Props: label, variant (default|primary|success|warning|error|info|new|sale|featured)
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

### PageHeader (panels only)
```
Props: title, subtitle, breadcrumbs, actions
  title:    text-2xl md:text-3xl font-bold text-gray-900 font-display
  subtitle: text-sm text-gray-500 mt-1
  actions:  flex items-center gap-3 (right side)
  wrapper:  flex items-start justify-between mb-6 md:mb-8
```

### DataTable (panels only)
```
Props: columns, data, isLoading, emptyMessage
  wrapper: w-full overflow-x-auto rounded-xl border border-gray-200 shadow-sm
  th:      px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-gray-500 bg-gray-50
  td:      px-4 py-3 text-gray-700 text-sm
  tr:      hover:bg-gray-50 border-b border-gray-100 transition-colors duration-150
```

### StatCard (panels only)
```
Props: title, value, change, icon, color
  wrapper: bg-white rounded-2xl border border-gray-200 shadow-sm p-4 md:p-6
  value:   text-2xl md:text-3xl font-bold text-gray-900 font-display
  title:   text-sm text-gray-500 font-medium
  change:  text-xs font-medium (green if positive, red if negative)
```

### SectionTitle (landing page)
```
Props: title, subtitle, align (left|center), actionLabel, actionLink
  title:    sectionTitle token + animated underline on scroll
  subtitle: small token + textMuted color
  action:   text-primary text-sm font-medium hover:underline (right side)
```

### Skeleton
```
Props: variant (text|card|table-row|avatar|image), count
  base: bg-gray-200 rounded animate-pulse
```

### EmptyState
```
Props: icon, title, message, action
  wrapper: flex flex-col items-center justify-center py-16 text-center
  title:   text-lg font-semibold text-gray-700
  message: text-sm text-gray-400 mt-1 max-w-sm
```

### Modal
```
Props: isOpen, onClose, title, size (sm|md|lg), children, footer
  overlay: fixed inset-0 bg-black/50 backdrop-blur-sm z-50
  panel:   bg-white rounded-2xl shadow-2xl
  header:  px-6 py-4 border-b border-gray-200
  footer:  px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl
```

### ScrollReveal (landing page)
```
Props: children, direction (up|down|left|right), delay, duration, distance
  Uses Framer Motion useInView, triggers once at 0.15 threshold
  Animates hidden → visible based on direction
  Wrap every section title, card group, CTA with this
```

---

## PART A4 — STATUS BADGE MAPPING (All Panels Consistent)

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
| featured | featured |
| new | new |
| sale | sale |
| verified | success |
| unverified | warning |
| banned | error |

---

## PART A5 — PANEL LAYOUT RULES (Customer, Seller, Admin — Identical)

### Sidebar
```
wrapper:    w-64 bg-white border-r border-gray-200 h-screen sticky top-0
nav item:   flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
            text-gray-600 hover:bg-gray-100 transition-all duration-150
nav active: bg-primary-light text-primary font-semibold
```

### Top Navbar
```
wrapper: h-16 bg-white border-b border-gray-200 px-4 md:px-6
         sticky top-0 z-40 shadow-sm flex items-center justify-between
avatar:  w-9 h-9 rounded-full ring-2 ring-gray-200 hover:ring-primary transition-all
```

### Main Content Area
```
wrapper: flex-1 bg-gray-50 min-h-screen
inner:   max-w-screen-xl mx-auto px-4 md:px-6 py-6 md:py-8
```

---

# ════════════════════════════════════════
# SECTION B — LANDING PAGE
# ════════════════════════════════════════

## PART B1 — ANIMATION VARIANTS FILE

Create one centralized variants file (place in utilities/helpers folder).
Never define variants inline inside any component — always import from here.

```javascript
export const fadeUp        = { hidden: { opacity: 0, y: 40 },       visible: { opacity: 1, y: 0 } }
export const fadeDown      = { hidden: { opacity: 0, y: -40 },      visible: { opacity: 1, y: 0 } }
export const fadeLeft      = { hidden: { opacity: 0, x: -60 },      visible: { opacity: 1, x: 0 } }
export const fadeRight     = { hidden: { opacity: 0, x: 60 },       visible: { opacity: 1, x: 0 } }
export const scaleIn       = { hidden: { opacity: 0, scale: 0.92 }, visible: { opacity: 1, scale: 1 } }
export const staggerContainer = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }
export const cardHover     = { rest: { scale: 1, y: 0 },            hover: { scale: 1.03, y: -6 } }
export const buttonHover   = { rest: { scale: 1 },                  hover: { scale: 1.05 }, tap: { scale: 0.97 } }
```

---

## PART B2 — SMOOTH SCROLL SETUP

Add Lenis to the existing app entry point (do not create a new file):

```javascript
const lenis = new Lenis({ duration: 1.2, easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)) })
function raf(time) { lenis.raf(time); requestAnimationFrame(raf) }
requestAnimationFrame(raf)
lenis.on('scroll', () => { ScrollTrigger?.update() })
```

---

## PART B3 — BANANA AI IMAGE GENERATION

Create a `useBananaAI` hook (place in existing hooks folder):
- Accept `prompt`, optional `width` and `height`
- Call Banana AI API with the prompt
- Return `{ imageUrl, isLoading, error }`
- Cache results in a local Map keyed by prompt (avoid re-generating same image)
- Fallback to a gradient placeholder if API is slow or fails

**Hero slide prompts — generate all 4 on mount:**
- `"luxury fashion ecommerce hero, elegant woman shopping, cinematic lighting, high fashion editorial"`
- `"modern electronics store hero, sleek products on dark background, blue neon accent lights"`
- `"premium beauty products flat lay, pastel colors, soft lighting, luxury cosmetics"`
- `"sporty lifestyle hero, athletic person outdoor, vibrant colors, energetic composition"`

---

## PART B4 — HERO SECTION (Full Screen Slider)

Create `HeroSection` + `HeroSlide` sub-component + `HeroControls` sub-component.
Create `useHeroSlider` hook.

**Visual:**
- Full viewport height
- Swiper.js carousel, 4 slides, auto-play every 5s, pause on hover
- Each slide: AI-generated background image, gradient overlay, headline, subtext, 2 CTA buttons ("Shop Now" + "Sell With Us")
- Custom prev/next arrows + dot pagination
- Swiper parallax module on background image

**Hook — useHeroSlider:**
`activeIndex`, `goToNext`, `goToPrev`, `goToSlide`, `pauseAutoplay`, `resumeAutoplay`

**Animation:**
- Slide enter: headline `y: 40→0, opacity: 0→1`
- Subtext: +0.2s delay
- CTA buttons: +0.4s delay
- `AnimatePresence` for slide transitions

---

## PART B5 — BRANDS SECTION

Create `BrandsSection` + `BrandCard`.
Create `useBrands` hook — fetch brands, duplicate array for infinite scroll, return `{ brands, isLoading, error }`.

**Visual:**
- Two rows of infinite auto-scrolling tickers (CSS animation), opposite directions
- Each card: logo + name, grayscale → full color on hover
- White background, subtle border

**Animation:**
- Section title: fade up on scroll (`ScrollReveal`)
- Cards: stagger fade-in using `useInView`

---

## PART B6 — CATEGORIES SECTION

Create `CategoriesSection` + `CategoryCard`.
Create `useCategories` hook — return `{ categories, isLoading, error }`.

**Visual:**
- Horizontal scroll on mobile, grid on desktop
- Each card: full-bleed image, name overlay at bottom, hover zoom, product count badge
- Click → navigate to products filtered by category

**Animation:**
- Cards stagger in from bottom: `y: 60→0, opacity: 0→1`, delay `index * 0.1s`
- Hover: scale 1→1.04 + shadow lift

---

## PART B7 — PRODUCTS SECTION (Latest Products)

Create `ProductsSection` + `ProductCard` + `ProductGrid`.
Create `useProducts` hook — fetch latest 8 products, handle add-to-cart, return `{ products, isLoading, error }`.

**Visual:**
- "Latest Products" title + "View All" link (use `SectionTitle` component)
- Grid: 4 cols desktop / 2 tablet / 1 mobile
- Each `ProductCard`: image, New/Sale/Hot badges (absolute top-left), name (2-line clamp), `StarRating`, price with discount, "Add to Cart" on hover (slide up), wishlist icon
- Skeleton cards while loading (same grid)

**Animation:**
- Grid stagger on scroll: `y: 50→0, opacity: 0→1`
- Card hover: scale 1.02 + shadow lift
- "Add to Cart" button: `y: 20→0, opacity: 0→1` on card hover

---

## PART B8 — FEATURED PRODUCTS SECTION

Create `FeaturedSection` + `FeaturedCard`.
Create `useFeaturedProducts` hook — fetch featured products, return top 5.

**Visual:**
- Asymmetric grid: 1 large card (2 cols) + smaller cards beside it
- Large card: full image, overlay text, category badge, price, CTA
- "Featured" gold badge on each card
- Dark background (contrasts with products section above)

**Animation:**
- Large card slides in from left, smaller cards from right
- Stagger right-side cards 0.15s each
- Background subtle animated gradient shift (keyframes)

---

## PART B9 — TESTIMONIALS SECTION

Create `TestimonialsSection` + `TestimonialCard`.

**Visual:**
- Swiper: 3 visible desktop / 1 mobile
- Each card: avatar, name, star rating, review text, date
- Glassmorphism card style, soft gradient/textured background

**Animation:**
- Cards: `scale: 0.95→1, opacity: 0→1` on scroll
- Active/center card slightly larger

---

## PART B10 — NEWSLETTER SECTION

Create `NewsletterSection`.

**Visual:**
- Full-width banner, bold headline, inline email input + subscribe button
- Success state: animated checkmark + thank you message
- Brand primary or dark background with pattern

**Animation:**
- Headline: word-by-word reveal on scroll
- Input: slide in from right on scroll
- Success: spring animation on checkmark

---

## PART B11 — LANDING PAGE ASSEMBLY

Create the landing page file (place where other pages already live). Composition only — no logic:

```jsx
<>
  <HeroSection />        {/* bg-dark */}
  <BrandsSection />      {/* bg-white */}
  <CategoriesSection />  {/* bg-gray-50 */}
  <ProductsSection />    {/* bg-white */}
  <FeaturedSection />    {/* bg-gray-900 */}
  <TestimonialsSection />{/* bg-gray-50 */}
  <NewsletterSection />  {/* bg-primary */}
  <FooterSection />      {/* bg-gray-900 */}
</>
```

Alternating light/dark backgrounds create visual rhythm — never two dark or two identical backgrounds in a row.

---

# ════════════════════════════════════════
# SECTION C — EXISTING PANELS STYLE FIX
# ════════════════════════════════════════

## PART C1 — What to Find and Fix

When auditing the existing panels, find and replace every instance of:

| Problem | Fix |
|---------|-----|
| Custom button with hardcoded classes | Replace with `Button` component |
| Raw `<input>` with inconsistent styles | Replace with `Input` component |
| Card with different padding/shadow/radius | Replace with `Card` component |
| Raw `<span>` badge with hardcoded color | Replace with `Badge` + correct variant |
| Page title is different size across panels | Replace with `PageHeader` component |
| Table `<th>` styled differently per panel | Replace with `DataTable` component |
| Sidebar active state color differs per panel | Unify with `primaryBg` + `primaryText` tokens |
| Different page padding across panels | Replace with `pageY` + `pageX` tokens |
| Custom spinner per panel | Replace with `Skeleton` component |
| Custom empty state per panel | Replace with `EmptyState` component |
| Hardcoded color hex anywhere | Replace with theme token |
| Arbitrary Tailwind value `text-[#333]` | Replace with theme token |

---

## PART C2 — Per Panel Checklist

**Customer Panel** — every page must use:
`PageHeader`, `Card`, `Button`, `Badge` (for order statuses), `DataTable` (order history), `Skeleton`, `EmptyState`

**Seller Panel** — every page must use:
`PageHeader`, `StatCard` (dashboard metrics), `DataTable` (products/orders/reviews), `Button`, `Badge`, `Modal` (confirmations), `Skeleton`, `EmptyState`

**Admin Panel** — every page must use:
`PageHeader`, `StatCard` (KPIs), `DataTable` (all entities), `Button`, `Badge`, `Modal`, `Skeleton`, `EmptyState`

---

# ════════════════════════════════════════
# SECTION D — RULES & DELIVERABLES
# ════════════════════════════════════════

## PART D1 — Performance Rules

- `React.memo` on ProductCard, BrandCard, CategoryCard
- `useCallback` on all event handlers inside hooks
- `useMemo` on all filtered/sorted lists
- `loading="lazy"` on all images
- `useInView` — only animate elements entering the viewport
- Keep animation state local to each animated component

---

## PART D2 — What NOT to Do

- ❌ Do NOT write logic inside JSX — hooks only
- ❌ Do NOT put multiple sections in one file
- ❌ Do NOT hardcode any color, font, spacing, shadow, or border value in any component
- ❌ Do NOT use arbitrary Tailwind values like `text-[#333]` or `bg-[#f5f5f5]`
- ❌ Do NOT define Framer Motion variants inline — import from variants file
- ❌ Do NOT invent folder paths — follow the existing project structure
- ❌ Do NOT create panel-specific style constants — one theme file for everything
- ❌ Do NOT use different card, button, or badge styles across panels
- ❌ Do NOT skip loading skeletons — every async section must show skeleton state
- ❌ Do NOT make animations feel slow or heavy — fast and springy only
- ❌ Do NOT change any logic, hooks, or data-fetching in existing panels — style only
- ❌ Do NOT use Inter, Roboto, or generic fonts — choose something distinctive

---

## PART D3 — Deliverables — In This Exact Order

> ⚠️ Step 0: Scan project → audit all panels → list inconsistencies → confirm brand color + font → then start.

**Design System (build first):**
1. Global theme constants file
2. Updated `tailwind.config.js` (extend only)
3. Updated global CSS (font imports)
4. `Button` component
5. `Input` component
6. `Card` component
7. `Badge` component
8. `SectionTitle` component
9. `PageHeader` component
10. `DataTable` component
11. `StatCard` component
12. `Skeleton` component
13. `EmptyState` component
14. `Modal` component
15. `ScrollReveal` component
16. Animation variants file

**Landing Page:**
17. Lenis smooth scroll setup (added to existing entry point)
18. `useBananaAI` hook
19. `useHeroSlider` hook
20. `useProducts` hook
21. `useFeaturedProducts` hook
22. `useBrands` hook
23. `useCategories` hook
24. `HeroSection` + sub-components
25. `BrandsSection` + sub-components
26. `CategoriesSection` + sub-components
27. `ProductsSection` + sub-components
28. `FeaturedSection` + sub-components
29. `TestimonialsSection` + sub-components
30. `NewsletterSection`
31. Landing page assembly file

**Panel Style Unification:**
32. Customer panel — replace all custom styles with shared components + tokens
33. Seller panel — replace all custom styles with shared components + tokens
34. Admin panel — replace all custom styles with shared components + tokens

---

## PART D4 — Final Consistency Checklist

Verify across all 4 panels + landing page before delivering:

- [ ] Same button shape, color, and hover everywhere
- [ ] Same input field style everywhere
- [ ] Same card padding, radius, and shadow everywhere
- [ ] Same badge shape and color-per-status everywhere
- [ ] Same page title font and size everywhere
- [ ] Same section heading font and size everywhere
- [ ] Same table header style everywhere
- [ ] Same sidebar active state everywhere
- [ ] Same navbar height and style everywhere
- [ ] Same page-level padding and container width everywhere
- [ ] Same transition speed on all interactive elements
- [ ] No hardcoded colors anywhere
- [ ] No arbitrary Tailwind values anywhere
- [ ] Display font used for all titles, body font for all body text
- [ ] Every async section shows skeleton while loading
- [ ] Every empty state uses EmptyState component
- [ ] Landing page sections alternate light/dark backgrounds correctly
- [ ] All landing page animations trigger on scroll, not on page load
