# Products Listing Page + Single Product Page — Full Improvement Prompt
# /products — Public Listing Page
# /products/:id — Public Single Product Page

---

## Your Role
You are a senior React UI/UX engineer. Two public pages need improvement: the products listing page and the single product detail page. Both have layout, design, and usability problems. Your job is to improve both pages while keeping all existing logic intact.

> Do NOT change any API calls, filter logic, sort logic, or cart/wishlist logic.
> Do NOT change the URL structure or routing.
> This is a UI/UX improvement only — scan existing logic first, keep it, improve the presentation.

---

## ⚠️ FIRST — Scan Before Changing Anything

1. Read the existing products page component fully
2. Read the filter sidebar component — understand all filters already built (category, price range, etc.)
3. Read the sort logic — how sort state is managed
4. Read how products are fetched and what data each product has
5. Identify what is broken vs what just looks bad
6. Confirm the plan before changing anything

---

## What I See in the Current Page (Problems to Fix)

From the current UI:

- Page title "Latest Collection" has no horizontal padding — text touches the screen edge
- No breadcrumb navigation (Home > Products)
- Cards are too large — the image fills everything and product name/price/button are cut off or invisible below the fold
- No product info visible in the card without scrolling — name, price, rating, Add to Cart button all missing from view
- Filter sidebar looks like a plain list with no visual polish
- No active filter tags shown above the grid — user can't see what filters are active
- No clear all filters button
- Sort bar is a separate floating card that feels disconnected from the grid
- No pagination or load more button at the bottom
- No empty state design for when filters return 0 results
- Grid has no consistent card height — cards overflow unevenly
- Page has no breathing room — no consistent padding or max-width container
- Mobile layout not handled — sidebar and grid overlap on small screens

---

## PART 1 — Page Layout Structure

Rebuild the page layout into this structure:

```
┌─────────────────────────────────────────────────────────┐
│  PAGE HEADER                                            │
│  Breadcrumb: Home > Products                            │
│  Title: "Latest Collection"    Subtitle                 │
├─────────────────────────────────────────────────────────┤
│  ACTIVE FILTER TAGS ROW                                 │
│  [clothes ×]  [Price: $0–$200 ×]  [Clear All]          │
├──────────────┬──────────────────────────────────────────┤
│              │  SORT + RESULTS BAR                      │
│   FILTER     │  Showing 3 results    Sort By: [dropdown]│
│   SIDEBAR    ├──────────────────────────────────────────┤
│   (left)     │  PRODUCT GRID                            │
│              │  3 cols desktop / 2 tablet / 1 mobile    │
│              │                                          │
│              ├──────────────────────────────────────────┤
│              │  PAGINATION                              │
└──────────────┴──────────────────────────────────────────┘
```

**Page container:**
- `max-w-screen-xl mx-auto px-4 md:px-6 py-6 md:py-10`

**Two-column layout:**
- Sidebar: `w-72 flex-shrink-0` — sticky on desktop `sticky top-24 self-start`
- Content: `flex-1 min-w-0`
- Gap between: `gap-8`
- On mobile: sidebar collapses into a slide-in drawer triggered by a "Filters" button

---

## PART 2 — Page Header

```
Breadcrumb:
  Home  >  Products
  text-sm text-gray-400
  "Products" in text-gray-700 font-medium

Title:
  text-3xl md:text-4xl font-bold text-gray-900 font-display
  mt-1

Subtitle:
  text-gray-500 text-sm mt-1
  "Explore our hand-picked collection"

Result count shown here too on mobile:
  "Showing 3 products"  text-sm text-gray-500
```

---

## PART 3 — Active Filter Tags Row

Show a horizontal scrollable row of tags for every active filter, directly above the grid:

```
Wrapper: flex items-center gap-2 flex-wrap mb-4
         Only visible when at least one filter is active

Each tag:
  flex items-center gap-1.5
  bg-primary/10 text-primary text-sm font-medium
  px-3 py-1 rounded-full
  border border-primary/20

  Label: filter name + value (e.g. "Category: clothes", "Price: $0 – $200")
  X button: clicking removes that specific filter

Clear All button (shown when 2+ filters active):
  text-sm text-red-500 hover:text-red-600 font-medium
  ml-auto flex-shrink-0
  clicking resets all filters to default
```

---

## PART 4 — Improve the Filter Sidebar

Keep all existing filter logic. Only improve the visual design:

### Sidebar wrapper
```
bg-white rounded-2xl border border-gray-100 shadow-sm p-5
```

### Filter section header (CATEGORY, PRICE RANGE, etc.)
```
flex items-center justify-between mb-3 cursor-pointer
(clicking collapses/expands the filter section)

Label: text-xs font-bold uppercase tracking-widest text-gray-500
Arrow: chevron icon, rotates 180° when collapsed
       transition-transform duration-200
```

### Category filter — replace plain text list with styled options
```
Each category option:
  flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer
  text-sm transition-all duration-150

  Inactive: text-gray-600 hover:bg-gray-50
  Active:   bg-primary/10 text-primary font-semibold
            left border accent: border-l-2 border-primary
```

### Price Range filter — improve input fields
```
Two inputs side by side: Min | — | Max

Each input:
  w-full px-3 py-2 rounded-lg border border-gray-200 text-sm
  focus:ring-2 focus:ring-primary/20 focus:border-primary
  No number spinners: appearance-none

Add a visual range slider below the inputs (optional if already exists)

Apply Range button:
  w-full mt-3 py-2 rounded-lg bg-primary text-white text-sm font-semibold
  hover:bg-primary-dark transition-all duration-150
```

### Add a "Reset Filters" link at the bottom of the sidebar
```
text-sm text-center text-gray-400 hover:text-red-500
transition-colors duration-150 mt-4 block
"Reset all filters"
```

### Mobile — Filter Drawer
On screens smaller than `lg`:
- Hide the sidebar
- Show a "Filters" button in the sort bar: pill button with filter icon + active filter count badge
- Clicking opens a full-height slide-in drawer from the left
- Drawer has a close button at top right
- Drawer contains the exact same filter sidebar content

---

## PART 5 — Sort Bar

Replace the current disconnected sort bar with an integrated bar:

```
Wrapper:
  flex items-center justify-between
  mb-4 pb-4 border-b border-gray-100

Left side:
  "Showing X results" — text-sm text-gray-500
  X is bold: font-semibold text-gray-900

Right side:
  "Sort by:" label — text-sm text-gray-500 mr-2
  
  Sort dropdown — styled select or custom dropdown:
    Options: Newest First | Price: Low to High | Price: High to Low | Best Rated | Most Popular
    
    Styled as:
    flex items-center gap-2 px-4 py-2 rounded-xl border border-gray-200 bg-white
    text-sm font-medium text-gray-700 cursor-pointer
    hover:border-primary transition-all duration-150
    
  On mobile: add Filters button here (left of sort dropdown)
    bg-white border border-gray-200 rounded-xl px-3 py-2
    flex items-center gap-2 text-sm font-medium
    If active filters > 0: show count badge on button
```

---

## PART 6 — Product Grid

Fix the grid so cards are the correct size and all info is visible:

```
Grid:
  grid
  grid-cols-1
  sm:grid-cols-2
  lg:grid-cols-3
  gap-4 md:gap-6
```

Each card must show ALL of the following without scrolling:
- Vertical thumbnail gallery (already built) — image area `aspect-[4/5]`
- Category + Rating row
- Product name (2-line clamp)
- Price (with discount display if applicable)
- Add to Cart button

The card height must be tall enough to show all info — do NOT let cards be so large the info area is pushed off screen. The image area should take roughly 60–65% of the card height, info area 35–40%.

While products are loading: show skeleton cards in same grid (same dimensions).

---

## PART 7 — Empty State

When no products match the current filters, show a clean empty state instead of a blank page:

```
Centered in the grid area:
  Icon: large search/empty icon (gray)
  Title: "No products found" — text-lg font-semibold text-gray-700
  Subtitle: "Try adjusting your filters or search terms" — text-sm text-gray-400
  Button: "Clear all filters" — primary outline button
```

---

## PART 8 — Pagination

At the bottom of the grid, add pagination:

If the existing API supports pages:
```
Wrapper: flex items-center justify-center gap-2 mt-10

Prev button: ← disabled if on page 1
Page numbers: show current ± 2 pages, ellipsis for gaps
Next button: → disabled if on last page

Each page button:
  w-10 h-10 rounded-xl flex items-center justify-center text-sm
  Inactive: bg-white border border-gray-200 text-gray-600 hover:border-primary hover:text-primary
  Active:   bg-primary text-white border-primary font-semibold
  Transition: all 150ms
```

If the API does not support pages — add a "Load More" button instead:
```
w-full max-w-xs mx-auto mt-10
py-3 rounded-xl border-2 border-primary text-primary font-semibold text-sm
hover:bg-primary hover:text-white transition-all duration-200
Shows loading spinner when fetching next batch
Hidden when all products are loaded
```

---

## PART 9 — Mobile Filter Drawer

On mobile, the sidebar becomes a slide-in drawer:

```
Trigger button (in sort bar):
  "Filters" + filter icon + active count badge

Drawer:
  fixed inset-y-0 left-0 z-50
  w-80 max-w-[85vw]
  bg-white shadow-2xl
  slide in from left: translateX(-100%) → translateX(0)
  transition-transform duration-300

Overlay behind drawer:
  fixed inset-0 bg-black/40 z-40
  fade in: opacity 0 → 1

Close button:
  absolute top-4 right-4
  w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center

Drawer header:
  px-5 py-4 border-b border-gray-100
  "Filters" title + close button

Drawer content:
  same filter sidebar content, scrollable
  px-5 pb-6
```

---

## PART 10 — What NOT to Do

- Do NOT change any filter logic, API calls, or sort state management
- Do NOT remove any existing filter options
- Do NOT change the URL or routing
- Do NOT use a different card component — use and improve the existing ProductCard
- Do NOT make cards so large that product info is not visible without scrolling
- Do NOT hide the filter sidebar on desktop — only collapse to drawer on mobile
- Do NOT forget the empty state — blank white page when no results is not acceptable
- Do NOT hardcode any colors — use existing primary color tokens

---

## Deliverables — Listing Page (In This Order)

1. Improved page layout wrapper (container, two-column, padding)
2. Improved page header with breadcrumb
3. Active filter tags row component
4. Improved filter sidebar (same logic, better UI)
5. Mobile filter drawer component
6. Improved sort bar
7. Fixed product grid (correct card size, all info visible)
8. Empty state component
9. Pagination or Load More component
10. Full updated products listing page assembling all of the above

---

# ════════════════════════════════════════
# SECTION B — SINGLE PRODUCT PAGE (/products/:id)
# ════════════════════════════════════════

## What the Single Product Page Must Show

This is the most important conversion page in the entire app. When a customer clicks a product card they land here. It must give them everything they need to decide to buy.

> Scan the existing single product page first. Keep all existing data fetching and cart/wishlist logic. Improve the layout and add missing sections.

---

## PART B1 — Page Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  BREADCRUMB: Home > Products > Product Name         │
├──────────────────────┬──────────────────────────────┤
│                      │                              │
│  IMAGE GALLERY       │  PRODUCT INFO                │
│  (left, 55%)         │  (right, 45%)                │
│                      │                              │
│  Main image          │  Brand · Category            │
│  + thumbnail strip   │  Name                        │
│  (vertical, left     │  Rating + review count       │
│   side — already     │  Price (with discount)       │
│   built)             │  Stock indicator             │
│                      │  Variants (colors, sizes)    │
│                      │  Quantity selector           │
│                      │  Add to Cart button          │
│                      │  Add to Wishlist button      │
│                      │  Delivery info strip         │
│                      │  Share button                │
├──────────────────────┴──────────────────────────────┤
│  TABS: Description | Details | Reviews              │
├─────────────────────────────────────────────────────┤
│  RELATED PRODUCTS (same category)                   │
└─────────────────────────────────────────────────────┘
```

**Page container:** `max-w-screen-xl mx-auto px-4 md:px-8 py-6 md:py-10`

---

## PART B2 — Breadcrumb

```
Home  >  Products  >  Product Name

text-sm text-gray-400
Active (last item): text-gray-800 font-medium
Separator >: text-gray-300 mx-2
```

---

## PART B3 — Image Gallery (Left Column)

The vertical thumbnail gallery already built for the card must be expanded here into a full product gallery:

**Main image:**
- Large display area, `aspect-square` or `aspect-[4/5]`
- `rounded-2xl overflow-hidden bg-gray-50`
- Clicking main image → opens fullscreen lightbox with prev/next navigation

**Thumbnail strip:**
- Vertical strip on the LEFT of the main image (same as the card gallery)
- Each thumbnail: `64px × 64px`, `rounded-xl`, active border in primary color
- If more than 6 thumbnails → strip scrolls vertically

**Lightbox:**
- Full screen overlay `bg-black/95`
- Large image centered
- Prev/Next arrows
- Close button top-right (X)
- ESC key closes it
- Dot indicators at bottom

---

## PART B4 — Product Info (Right Column)

Display in this exact order:

### Brand + Category line
```
text-sm text-gray-400
Brand name (linked to brand page if exists) · Category name
```

### Product Name
```
text-2xl md:text-3xl font-bold text-gray-900 font-display
leading-tight mt-1
```

### Rating Row
```
flex items-center gap-3 mt-2

Stars: 5 star icons, filled/half/empty based on rating value
       text-yellow-400 text-lg

Rating number: text-sm font-bold text-gray-800  "4.5"
Review count:  text-sm text-gray-400 underline cursor-pointer
               "(24 reviews)" — clicking scrolls to Reviews tab

If no reviews: "No reviews yet" text-sm text-gray-400
```

### Price Section
```
mt-4

No discount:
  text-3xl font-bold text-gray-900  "$200.00"

With discount:
  Sale price:      text-3xl font-bold text-primary  "$180.00"
  Original price:  text-lg text-gray-400 line-through ml-3  "$200.00"
  Discount badge:  bg-red-500 text-white text-sm font-bold
                   px-2 py-0.5 rounded-lg ml-2  "-10%"
```

### Stock Indicator
```
mt-3 flex items-center gap-2 text-sm

In stock (> 5):    green dot + "In Stock"
Low stock (≤ 5):   orange dot + "Only X left in stock!" (creates urgency)
Out of stock:      red dot + "Out of Stock"
```

### Color Variants (if product has colors)
```
mt-4
Label: "Color:" text-sm font-semibold text-gray-700

Color swatches row:
  Each swatch: w-8 h-8 rounded-full border-2 cursor-pointer
  Inactive: border-transparent hover:border-gray-300
  Active:   border-primary ring-2 ring-primary/30
  Tooltip on hover: color name
```

### Size Variants (if product has sizes)
```
mt-4
Label: "Size:" text-sm font-semibold text-gray-700

Size pills row:
  Each pill: px-3 py-1.5 rounded-lg border text-sm font-medium cursor-pointer
  Inactive: border-gray-200 text-gray-600 hover:border-primary hover:text-primary
  Active:   border-primary bg-primary text-white
  Out of stock size: opacity-40 cursor-not-allowed line-through
```

### Quantity Selector
```
mt-5 flex items-center gap-3

Label: "Qty:" text-sm font-semibold text-gray-700

Stepper:
  [ − ]  [ 2 ]  [ + ]
  
  Buttons: w-9 h-9 rounded-lg border border-gray-200 bg-white
           hover:border-primary hover:text-primary
           transition-all duration-150
  Count:   w-12 text-center text-sm font-semibold text-gray-900
  
  Min: 1 (− disabled at 1)
  Max: available stock (+ disabled at max stock)
```

### Add to Cart Button
```
mt-5 w-full py-3.5 rounded-xl text-base font-semibold
transition-all duration-200

Default:     bg-primary text-white hover:bg-primary-dark shadow-sm hover:shadow-md
Loading:     spinner + "Adding to cart..."
Success:     bg-green-500 text-white "Added to Cart ✓" — 2s then reset
Out of stock: bg-gray-100 text-gray-400 cursor-not-allowed "Out of Stock"
```

### Add to Wishlist Button
```
mt-3 w-full py-3 rounded-xl text-sm font-semibold
border-2 transition-all duration-200

Not in wishlist: border-gray-200 text-gray-600 hover:border-primary hover:text-primary
                 "♡ Save to Wishlist"
In wishlist:     border-primary bg-primary/5 text-primary
                 "♥ Saved to Wishlist"
```

### Delivery Info Strip
```
mt-6 p-4 bg-gray-50 rounded-xl space-y-2

3 rows:
  🚚 "Free delivery on orders over $50"         text-sm text-gray-600
  🔄 "Easy 30-day returns"                       text-sm text-gray-600
  🔒 "Secure checkout"                           text-sm text-gray-600
```

### Share Button
```
mt-4 flex items-center gap-2 text-sm text-gray-400
hover:text-gray-600 cursor-pointer w-fit

Share icon + "Share this product"
Clicking copies the product URL to clipboard + shows "Link copied!" toast
```

---

## PART B5 — Tabs Section (Below the Two Columns)

Three tabs below the main layout:

```
Tab bar:
  flex border-b border-gray-200 mt-12 mb-6

Each tab:
  px-6 py-3 text-sm font-semibold cursor-pointer
  transition-all duration-150
  
  Inactive: text-gray-500 hover:text-gray-800
  Active:   text-primary border-b-2 border-primary -mb-px
```

### Tab 1 — Description
- Full product description in clean readable prose
- `text-gray-600 leading-relaxed text-sm md:text-base`
- If no description → empty state: "No description provided"

### Tab 2 — Details
Clean 2-column grid of product specifications:

| Field | Value |
|-------|-------|
| Category | value |
| Subcategory | value |
| Brand | value |
| SKU / ID | short version |
| Availability | In Stock / Out of Stock |
| Condition | New |

```
Each row:
  grid grid-cols-2 py-3 border-b border-gray-100 last:border-0
  Label: text-sm text-gray-500
  Value: text-sm font-medium text-gray-800
```

### Tab 3 — Reviews
**Rating summary at the top:**
```
flex gap-8 items-center p-6 bg-gray-50 rounded-2xl mb-6

Left: Big number "4.5" text-5xl font-bold + stars + "24 reviews"
Right: Rating breakdown bars
  5★ ████████░░ 60%
  4★ ████░░░░░░ 30%
  3★ █░░░░░░░░░  7%
  2★ ░░░░░░░░░░  2%
  1★ ░░░░░░░░░░  1%
  
  Each bar: h-2 rounded-full bg-gray-200 with filled portion bg-yellow-400
```

**Individual reviews:**
```
Each review card:
  py-5 border-b border-gray-100 last:border-0

  Top row: avatar circle (initials) + name + date (right aligned)
  Stars row: rating stars text-yellow-400
  Review text: text-sm text-gray-600 leading-relaxed mt-2

Avatar:
  w-10 h-10 rounded-full bg-primary/10 text-primary
  font-semibold text-sm flex items-center justify-center
  Shows first letter of reviewer name
```

If no reviews → empty state:
```
py-12 text-center
Icon (empty chat bubble) + "No reviews yet"
"Be the first to review this product"
```

---

## PART B6 — Related Products Section

Below the tabs, show products from the same category:

```
Section title: "You Might Also Like"
               text-2xl font-bold text-gray-900 mb-6

Grid: 4 cols desktop / 2 tablet / 1 mobile
      same ProductCard component used everywhere
      show max 8 related products

"View All in [Category]" link — right aligned, text-primary text-sm
```

---

## PART B7 — What NOT to Do

- Do NOT change any existing API calls or data fetching
- Do NOT change cart or wishlist logic — use existing hooks
- Do NOT remove any existing data shown on the page
- Do NOT use a different image gallery component — expand the one already built
- Do NOT make the page feel like an admin panel — this is public-facing, must feel like a real store
- Do NOT skip the Related Products section — it directly increases time on site

---

## Deliverables — Single Product Page (In This Order)

11. Improved breadcrumb component
12. Expanded image gallery with lightbox (builds on existing gallery)
13. ProductInfoPanel — brand, name, rating, price, stock, variants, quantity, buttons, delivery strip
14. ColorVariantSelector component
15. SizeVariantSelector component
16. QuantitySelector component
17. DeliveryInfoStrip component
18. Product tabs component (Description / Details / Reviews)
19. ReviewSummary component (rating bars)
20. ReviewCard component
21. RelatedProducts section
22. Full updated single product page assembling all of the above
