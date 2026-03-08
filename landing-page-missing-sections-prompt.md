# Landing Page — Add Missing Sections Prompt

---

## Your Role
You are a senior React frontend engineer. The landing page already exists and is working.
Your job is to **add the missing sections only** — do NOT touch, rewrite, or restructure any existing section.
Every new section must match the exact same style, font, spacing, and design language as the existing page.

---

## ⚠️ FIRST — Scan Before You Write Anything

1. **Open and read the existing landing page file** and every component it imports
2. **Identify the exact design system being used** — what colors, fonts, spacing, card styles, button styles the page already uses
3. **Find the exact insertion points** — where in the page file each new section should be placed
4. **Show the developer the insertion plan** before writing any code
5. Only after confirmation — build one section at a time

> Do NOT invent new folder paths. Place every new file inside the correct existing feature/landing folder by following where the current landing page components already live.

---

## What Already Exists (Do NOT Rebuild These)

From the existing page, these sections are already built — leave them completely untouched:

| # | Section | Status |
|---|---------|--------|
| 1 | Sticky Navbar | ✅ exists |
| 2 | Hero Slider (Elegant Collections) | ✅ exists |
| 3 | Global Brand Partners (ticker) | ✅ exists |
| 4 | Curated Collections (categories grid) | ✅ exists |
| 5 | New Arrivals (products grid) | ✅ exists |
| 6 | What Our Community Says (testimonials) | ✅ exists |
| 7 | Stay in the Loop (newsletter) | ✅ exists |
| 8 | Footer | ✅ exists |

---

## What Needs to Be Added (Build These)

Add ALL of the following sections in the exact order shown in the final page layout below.

---

### 🔴 NEW SECTION 1 — Announcement Bar
**Position:** Very top of the page — ABOVE the navbar, first thing visible

**What it is:**
A slim full-width bar (40–48px height) that shows a rotating promotional message with a close button.

**Content to rotate (every 4 seconds):**
- "🚚 Free shipping on all orders over $50"
- "🔥 Flash Sale live now — up to 70% off"
- "🎁 New members get 10% off their first order"
- "📦 Easy 30-day returns on all products"

**Design:**
- Background: brand primary color (match existing primary color on the page)
- Text: white, small, centered, font-medium
- Left side: small rotating icon
- Right side: X close button — clicking hides the bar and saves to localStorage so it doesn't reappear on refresh
- Smooth slide-down entrance animation on page load (Framer Motion)

**Hook:** `useAnnouncementBar`
- Manages current message index (rotates every 4s)
- Manages visibility (reads/writes localStorage key `"announcement_closed"`)
- Returns: `{ currentMessage, isVisible, close }`

---

### 🔴 NEW SECTION 2 — Features / Trust Strip
**Position:** Immediately AFTER the hero slider, BEFORE the brands section

**What it is:**
A horizontal strip of 4 trust icons showing why customers should buy here.

**4 features to show:**
1. 🚚 **Free Shipping** — "On orders over $50 worldwide"
2. 🔄 **Easy Returns** — "30-day hassle-free return policy"
3. 🔒 **Secure Payment** — "256-bit SSL encrypted checkout"
4. 🎧 **24/7 Support** — "We're here whenever you need us"

**Design:**
- Light background (match existing bg-gray-50 or white alternating)
- 4 equal columns on desktop, 2×2 grid on tablet, stacked on mobile
- Each item: large icon (top or left), bold title, subtitle below
- Subtle top and bottom border to separate from sections above and below
- No card shadows — flat clean strip design

**Animation:**
- Each item fades up with stagger on scroll (use the same ScrollReveal/animation pattern already in the page)

---

### 🔴 NEW SECTION 3 — Flash Sale with Countdown Timer
**Position:** AFTER the categories section, BEFORE New Arrivals

**What it is:**
The highest-converting section on any e-commerce page. Shows discounted products with a live countdown timer.

**Design:**
- Dark background (bg-gray-900 or match existing dark sections on the page)
- Section header: "⚡ Flash Sale" title on the left + live countdown timer on the right
- Countdown shows: HH : MM : SS — updates every second
- Below the header: horizontal Swiper carousel of 4–6 sale products
- Each product card in the carousel:
  - Product image
  - Original price (crossed out) + discounted price in red
  - Discount % badge (e.g. "-40%") in red top-left
  - Progress bar showing "X sold out of Y" (creates urgency)
  - "Add to Cart" button
- "View All Deals →" link at top right

**Hook:** `useFlashSale`
- Fetches products where `isOnSale: true` or `discount > 0`
- Manages countdown timer — accepts an end time, counts down to zero
- When timer hits 0 → shows "Sale Ended" state
- Returns: `{ products, isLoading, timeLeft: { hours, minutes, seconds }, isSaleEnded }`

**Countdown sub-component:** `CountdownTimer`
- Props: `hours`, `minutes`, `seconds`
- Each number in a dark box with label below (like Amazon's deal timer)
- Flip animation on each number change

**Animation:**
- Section slides in from bottom on scroll
- Product cards stagger in with the same animation pattern already used on the page

---

### 🔴 NEW SECTION 4 — Best Sellers
**Position:** AFTER New Arrivals, BEFORE testimonials

**What it is:**
The most purchased / highest rated products. Different from New Arrivals — these are proven popular products.

**Design:**
- Light background (alternate with New Arrivals dark/light pattern)
- Section title: "Best Sellers" with subtitle + "View All →" link (match existing SectionTitle style exactly)
- Tab bar above the grid: "All" | "Electronics" | "Fashion" | "Home" | "Beauty" — clicking filters the shown products
- Active tab: primary color underline or pill (match existing primary color)
- Grid: same layout as New Arrivals (4 cols desktop / 2 tablet / 1 mobile)
- Each product card: same card component already used in New Arrivals — do NOT create a new card style
- "🏆 Best Seller" gold badge on each card

**Hook:** `useBestSellers`
- Fetches products sorted by sales count or rating
- Manages active category tab filter
- Returns: `{ products, isLoading, activeTab, setActiveTab, filteredProducts }`

**Animation:**
- Tab switching: smooth fade transition between product sets
- Grid cards stagger in — same pattern as existing product sections

---

### 🔴 NEW SECTION 5 — Featured Products
**Position:** AFTER Best Sellers, BEFORE testimonials

**What it is:**
A visually bold asymmetric layout showcasing hand-picked hero products — different layout from the standard grid.

**Design:**
- Dark background (contrast with Best Sellers light section)
- Section title: "Featured Picks" centered
- Layout: 1 large card on the left (spans 2 rows) + 2 smaller cards stacked on the right
- Large card: full-bleed image, gradient overlay text at bottom, category badge, price, "Shop Now" button
- Small cards: image top half, name + price + button bottom half
- "⭐ Featured" gold badge on every card

**Hook:** `useFeaturedProducts`
- Fetches products where `isFeatured: true`
- Returns top 3 featured products

**Animation:**
- Large card slides in from left
- Right cards slide in from right with 0.15s stagger between them

---

### 🔴 NEW SECTION 6 — Stats / Social Proof Numbers
**Position:** BETWEEN testimonials and newsletter

**What it is:**
A full-width section with big animated numbers showing platform scale — instant trust builder.

**4 stats to show:**
1. **50,000+** — Happy Customers
2. **1,200+** — Verified Sellers
3. **80,000+** — Products Listed
4. **4.9 / 5** — Average Rating

**Design:**
- Dark background OR brand primary color (pick whichever contrasts better with the newsletter section below it)
- 4 equal columns, each with: giant bold number + label below
- Numbers count up from 0 to final value when section enters viewport (animated counter)

**Hook:** `useCounterAnimation`
- Accepts `targetValue` and `duration`
- Uses `useInView` to trigger only when section is visible
- Animates from 0 to target using requestAnimationFrame
- Returns: `{ displayValue, ref }`

---

### 🔴 NEW SECTION 7 — Seller CTA Banner
**Position:** BETWEEN stats section and newsletter section

**What it is:**
A bold full-width banner targeting potential sellers — unique to your multi-role platform.

**Design:**
- Split layout: left side text, right side illustration/image
- Left: "Start Selling Today" headline + 2–3 bullet benefits + "Become a Seller" button (primary)
- Right: an image or illustration of a seller dashboard / store front (use a relevant Banana AI generated image or a clean SVG illustration)
- Bullet benefits:
  - ✅ Set up your store in minutes
  - ✅ Reach 50,000+ active buyers
  - ✅ Keep 95% of every sale
- Background: gradient from brand primary to a darker shade
- Text: white throughout

**Animation:**
- Left content slides in from left on scroll
- Right image slides in from right on scroll

---

## Final Page Section Order (Complete)

After all additions, the page must render in this exact order:

```
1.  Announcement Bar          ← 🔴 NEW
2.  Sticky Navbar             ← ✅ existing
3.  Hero Slider               ← ✅ existing
4.  Features Trust Strip      ← 🔴 NEW
5.  Global Brand Partners     ← ✅ existing
6.  Curated Collections       ← ✅ existing
7.  Flash Sale + Countdown    ← 🔴 NEW
8.  New Arrivals              ← ✅ existing
9.  Best Sellers              ← 🔴 NEW
10. Featured Products         ← 🔴 NEW
11. What Our Community Says   ← ✅ existing
12. Stats / Numbers           ← 🔴 NEW
13. Seller CTA Banner         ← 🔴 NEW
14. Stay in the Loop          ← ✅ existing
15. Footer                    ← ✅ existing
```

---

## Style Consistency Rules

> Every new section must look like it was built at the same time as the existing sections.

- **Match the existing primary color exactly** — do not use a different shade
- **Match the existing font** — use the same font family already imported in the project
- **Match card border-radius** — use the same rounded corners as existing product cards
- **Match button style** — use the same button component or exact same classes already used
- **Match section padding** — use the same vertical and horizontal padding as existing sections
- **Match section title style** — use the same SectionTitle component or exact same heading classes
- **Match animation style** — use the same Framer Motion variants or animation approach already in the page
- **Alternate backgrounds correctly** — continue the existing light/dark alternating pattern

---

## Hooks to Create

| Hook | Purpose |
|------|---------|
| `useAnnouncementBar` | Message rotation + visibility toggle + localStorage |
| `useFlashSale` | Fetch sale products + countdown timer logic |
| `useCountdownTimer` | Reusable countdown HH:MM:SS (used by flash sale) |
| `useBestSellers` | Fetch best sellers + tab filter logic |
| `useFeaturedProducts` | Fetch featured products |
| `useCounterAnimation` | Animated number counter triggered by scroll |

---

## Sub-Components to Create

| Component | Used In |
|-----------|---------|
| `AnnouncementBar` | Top of page |
| `FeatureItem` | Features strip (one icon+text item) |
| `CountdownTimer` | Flash sale header |
| `FlashSaleCard` | Flash sale carousel item (extends existing ProductCard) |
| `SaleProgressBar` | Inside FlashSaleCard |
| `BestSellersTabs` | Tab filter bar above best sellers grid |
| `FeaturedLargeCard` | Large asymmetric featured card |
| `FeaturedSmallCard` | Small asymmetric featured card |
| `StatItem` | One stat number + label |
| `SellerCtaBanner` | Full seller CTA section |

---

## What NOT to Do

- ❌ Do NOT rebuild or modify any existing section
- ❌ Do NOT change the existing hero, brands, categories, new arrivals, testimonials, newsletter, or footer
- ❌ Do NOT use different colors, fonts, or spacing than what already exists on the page
- ❌ Do NOT create a new card design — reuse the existing ProductCard for Best Sellers and Flash Sale
- ❌ Do NOT hardcode any folder paths — follow where existing landing components live
- ❌ Do NOT put logic inside components — all logic in hooks
- ❌ Do NOT animate on page load — all scroll-based animations only (except announcement bar entrance)
- ❌ Do NOT add more than one dark section in a row — always alternate light and dark

---

## Deliverables — In This Order

> Show the developer the insertion plan first, then deliver one section at a time.

1. `useAnnouncementBar` hook + `AnnouncementBar` component
2. Features Trust Strip component + `FeatureItem` sub-component
3. `useCountdownTimer` hook + `CountdownTimer` component
4. `useFlashSale` hook + `FlashSaleCard` + `SaleProgressBar` + full `FlashSaleSection`
5. `useBestSellers` hook + `BestSellersTabs` + full `BestSellersSection`
6. `useFeaturedProducts` hook + `FeaturedLargeCard` + `FeaturedSmallCard` + full `FeaturedSection`
7. `useCounterAnimation` hook + `StatItem` + full `StatsSection`
8. `SellerCtaBanner` component
9. Updated landing page assembly file with all sections in the correct order
