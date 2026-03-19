# Complete All Public Pages Prompt
# Landing Page · All Products Page · Single Product Page

---

## Your Role
You are a senior React frontend engineer. The app has a public-facing side that any visitor can see without logging in. Several sections and pages are incomplete or missing entirely. Your job is to complete every public page end to end — fully functional, fully styled, with proper loading states, error states, and empty states.

---

## ⚠️ STEP 0 — Scan Everything First

Before writing a single line of code:

1. Open and read every existing public page and component
2. Open and read every existing service file for products, categories, brands, reviews
3. Open and read every existing hook used by public pages
4. Map the current router file — what public routes already exist, what is missing
5. Note what is already built vs what is completely missing vs what is half-built
6. Show the developer a full status report before starting:

```
PUBLIC PAGES STATUS
─────────────────────────────────────────────
Landing Page:
  Announcement Bar:       done / missing / half-built
  Navbar:                 done / missing / half-built
  Hero Slider:            done / missing / half-built
  Features Strip:         done / missing / half-built
  Brands Ticker:          done / missing / half-built
  Categories Section:     done / missing / half-built
  Flash Sale:             done / missing / half-built
  New Arrivals:           done / missing / half-built
  Best Sellers:           done / missing / half-built
  Featured Products:      done / missing / half-built
  Testimonials:           done / missing / half-built
  Stats Section:          done / missing / half-built
  Seller CTA Banner:      done / missing / half-built
  Newsletter:             done / missing / half-built
  Footer:                 done / missing / half-built

All Products Page:        done / missing / half-built
Single Product Page:      done / missing / half-built
─────────────────────────────────────────────
```

Only after confirmation — build what is missing, fix what is half-built.

---

# ══════════════════════════════════════════
# PAGE 1 — LANDING PAGE (Complete All Missing Sections)
# ══════════════════════════════════════════

## Complete Final Section Order

Build or fix every missing section in this exact order:

```
1.  Announcement Bar
2.  Sticky Navbar
3.  Hero Slider
4.  Features Trust Strip
5.  Brands Ticker
6.  Categories Section
7.  Flash Sale + Countdown
8.  New Arrivals
9.  Best Sellers
10. Featured Products
11. Testimonials
12. Stats Counter
13. Seller CTA Banner
14. Newsletter
15. Footer
```

---

### 1 — Announcement Bar
- Thin bar above navbar (40px height)
- Rotates 4 messages every 4 seconds (free shipping, flash sale, new member discount, easy returns)
- Close button → saves dismissed state to localStorage so it doesn't reappear on reload
- Background: primary brand color, white text
- Framer Motion slide-down on page load

### 2 — Sticky Navbar
Already exists — verify it has:
- Logo + brand name (left)
- Search bar (center) — typing navigates to /products?search=query
- Wishlist icon + count badge
- Cart icon + count badge (reflects cart state)
- Notification bell
- If guest: "Sign In" + "Get Started" buttons
- If logged in: avatar + name + role + dropdown menu
- Sticky on scroll with `position: sticky top-0 z-50`
- Background becomes solid white with shadow after scrolling past hero

### 3 — Hero Slider
Already exists — verify:
- Full viewport height
- 4 slides with Banana AI generated background images
- Each slide: badge label, big headline, subtext, two CTA buttons ("Shop Now" → /products, "Sell With Us" → /register?role=seller)
- Swiper autoplay 5s, pause on hover
- Custom prev/next arrows + dot pagination
- Framer Motion text animation per slide (y: 40→0, opacity: 0→1)

### 4 — Features Trust Strip
- 4 columns: Free Shipping · Easy Returns · Secure Payment · 24/7 Support
- Each: icon + bold title + subtitle
- Light background, subtle top/bottom border
- Stagger fade-up animation on scroll

### 5 — Brands Ticker
Already exists — verify:
- Two rows scrolling in opposite directions (infinite CSS animation)
- Each brand: logo image + name
- Grayscale → color on hover
- Fetch brands from API

### 6 — Categories Section
Already exists — verify:
- Grid layout: 6–8 category cards
- Each card: full-bleed image, name overlay, product count badge
- Click → navigates to /products?category=id
- Hover: image zoom scale effect
- Stagger animation on scroll

### 7 — Flash Sale + Countdown Timer
- Dark background section
- Header row: "⚡ Flash Sale" title (left) + live HH:MM:SS countdown (right)
- Countdown boxes: each unit (hours, minutes, seconds) in its own dark box with label
- Countdown resets daily at midnight or use a fixed end time from API
- Below header: Swiper carousel of sale products (isOnSale: true)
- Each sale card: image, crossed-out original price, red sale price, discount % badge, progress bar ("X of Y sold"), Add to Cart button
- "View All Deals →" link top right → navigates to /products?sale=true

### 8 — New Arrivals
Already exists — verify:
- Section title "New Arrivals" + "View All Products →" link → /products?sort=newest
- Grid: 8 newest products using the unified ProductCard
- Skeleton loading state
- Stagger animation on scroll

### 9 — Best Sellers
- Section title "Best Sellers" + "View All →" → /products?sort=bestselling
- Tab filter row: All · Electronics · Fashion · Home · Beauty
  - Active tab: primary color underline
  - Clicking tab filters the grid client-side
- Grid: 8 products sorted by sales/rating using unified ProductCard
- Smooth fade transition when switching tabs

### 10 — Featured Products
- Dark background (contrast with Best Sellers)
- Title: "Featured Picks" centered
- Asymmetric layout:
  - 1 large card left (60% width, 2 rows tall): full-bleed image, gradient overlay, category badge, product name, price, "Shop Now" button
  - 2 smaller cards stacked right (40% width): image top, name + price + button bottom
- Gold "⭐ Featured" badge on each
- Large card slides from left, small cards from right on scroll

### 11 — Testimonials
Already exists — verify:
- Swiper: 3 visible desktop / 1 mobile
- Each card: avatar, name, "Verified Shopper" label, star rating, review text
- Glassmorphism or soft shadow card style
- Dot pagination

### 12 — Stats Counter Section
- 4 animated number counters that trigger when section enters viewport:
  - 50,000+ Happy Customers
  - 1,200+ Verified Sellers
  - 80,000+ Products Listed
  - 4.9/5 Average Rating
- Numbers count up from 0 using requestAnimationFrame when in view
- Dark or primary background for contrast

### 13 — Seller CTA Banner
- Split layout: left text, right image
- Left: "Start Selling Today" headline + 3 bullet benefits + "Become a Seller" button → /register?role=seller
- Benefits: Set up in minutes · Reach 50k+ buyers · Keep 95% of every sale
- Primary gradient background, white text
- Left content slides from left, right image slides from right on scroll

### 14 — Newsletter
Already exists — verify:
- Email input + Subscribe button
- On submit: call newsletter API endpoint (or save to DB)
- Success state: animated checkmark + "Thanks for subscribing!"
- Error state: show message
- Validate email format before submit

### 15 — Footer
Already exists — verify:
- Logo + tagline + social media icons (left column)
- Link columns: Marketplace · Resources · Legals
- Bottom bar: copyright + System Status + Feedback links
- All links are actual working React Router links

---

# ══════════════════════════════════════════
# PAGE 2 — ALL PRODUCTS PAGE (/products)
# ══════════════════════════════════════════

## URL Structure
```
/products                          — all products
/products?category=id              — filtered by category
/products?search=query             — search results
/products?sort=newest              — sorted by newest
/products?sort=bestselling         — sorted by most sold
/products?sale=true                — only sale products
/products?brand=id                 — filtered by brand
```

## Page Layout

```
┌──────────────────────────────────────────────────────┐
│  NAVBAR (sticky)                                     │
├────────────┬─────────────────────────────────────────┤
│            │  BREADCRUMB + PAGE TITLE                │
│  FILTERS   │  "All Products (248 results)"           │
│  SIDEBAR   ├─────────────────────────────────────────┤
│  (left)    │  SORT BAR + VIEW TOGGLE                 │
│            ├─────────────────────────────────────────┤
│            │                                         │
│            │  PRODUCTS GRID                          │
│            │  (unified ProductCard)                  │
│            │                                         │
│            ├─────────────────────────────────────────┤
│            │  PAGINATION                             │
└────────────┴─────────────────────────────────────────┘
```

## Filters Sidebar (left, collapsible on mobile)

Build each filter as an independent collapsible section:

**Category filter:**
- List of all categories with product count
- Selecting a category → adds ?category=id to URL
- Active category highlighted with primary color

**Price Range filter:**
- Two inputs: Min price · Max price
- OR a range slider
- "Apply" button → adds ?minPrice=X&maxPrice=Y to URL

**Brand filter:**
- List of brands with checkboxes (multi-select)
- Adds ?brand=id1,id2 to URL

**Rating filter:**
- 5 options: 4★ and above, 3★ and above, 2★ and above, 1★ and above, All
- Radio button style

**Availability filter:**
- Checkbox: "In Stock Only" → adds ?inStock=true to URL

**Clear All Filters button:**
- Resets URL to /products with no params
- Only visible when at least one filter is active

## Sort Bar (top of grid)

```
Left:  "248 results" count
Right: Sort dropdown:
  - Newest First (default)
  - Price: Low to High
  - Price: High to Low
  - Best Rating
  - Best Selling
  - Most Reviewed
```

## Active Filters Display

Show active filters as dismissible chips below the sort bar:
```
Filters: [Category: Electronics ×] [Brand: Apple ×] [Min: $50 ×]  Clear All
```
Each chip × removes that specific filter from the URL.

## Products Grid

- Uses the unified ProductCard component
- Grid: 2 cols mobile / 3 cols tablet / 4 cols desktop
- Show 12 or 24 products per page
- Skeleton cards while loading (same count as page size)
- Empty state if no results: "No products found" + "Clear Filters" button

## Pagination

- Page numbers with prev/next arrows
- Current page highlighted
- Updates URL: ?page=2
- Scrolls to top of grid on page change

## Hook: useProductsPage
- Reads all filter/sort/page params from URL (useSearchParams)
- Fetches products from API with those params
- Returns: { products, totalCount, totalPages, currentPage, isLoading, error }
- All filter changes update the URL — URL is the single source of truth for filters

---

# ══════════════════════════════════════════
# PAGE 3 — SINGLE PRODUCT PAGE (/products/:id)
# ══════════════════════════════════════════

## URL: /products/:productId

## Page Layout

```
┌──────────────────────────────────────────────────────┐
│  NAVBAR (sticky)                                     │
├──────────────────────────────────────────────────────┤
│  BREADCRUMB: Home > Category > Product Name          │
├─────────────────────┬────────────────────────────────┤
│                     │  Product Name                  │
│  IMAGE GALLERY      │  Rating + Review count         │
│  (left 55%)         │  Brand                         │
│                     │  Price (with discount)         │
│  Main image large   │  ─────────────────────         │
│  + thumbnail strip  │  Variants (Color, Size)        │
│  below or left      │  ─────────────────────         │
│                     │  Quantity Selector             │
│                     │  [Add to Cart] [♥ Wishlist]    │
│                     │  ─────────────────────         │
│                     │  Stock status                  │
│                     │  Seller info (name + rating)   │
│                     │  Delivery info                 │
├─────────────────────┴────────────────────────────────┤
│  TABS: Description · Specifications · Reviews        │
├──────────────────────────────────────────────────────┤
│  RELATED PRODUCTS (same category)                    │
└──────────────────────────────────────────────────────┘
```

## Left Column — Image Gallery

- Large main image display (aspect 1:1 or 4:5)
- Thumbnail strip: vertical on desktop (left side of main image), horizontal on mobile (below)
- Clicking thumbnail → updates main image with crossfade transition
- Clicking main image → opens full-screen lightbox modal with zoom + prev/next navigation
- If only 1 image: no thumbnails shown

## Right Column — Product Info

**Product name:** large bold heading (font-display, text-2xl md:text-3xl)

**Rating row:**
- Star icons (filled/half/empty based on average)
- "4.5" number
- "(124 reviews)" — clicking scrolls to reviews tab

**Brand:** clickable link → /products?brand=id

**Price section:**
- No discount: show price in primary color, large font
- With discount: original price crossed out (gray) + sale price (primary, large) + "-X%" red badge

**Variants section (if product has variants):**

Colors:
```
Label: "Color: Navy Blue" (shows selected color name)
Swatches: circles with actual background color
Selected: ring-2 ring-primary ring-offset-2
Out of stock color: opacity-40 + diagonal line through it
```

Sizes:
```
Label: "Size: M"
Pills: "S" "M" "L" "XL" "XXL"
Selected: bg-primary text-white
Out of stock size: bg-gray-100 text-gray-300 line-through cursor-not-allowed
```

**Quantity selector:**
```
[ − ] [ 2 ] [ + ]

Minus disabled when quantity = 1
Plus disabled when quantity = stock
Shows "Only X left!" warning when stock ≤ 5
```

**Action buttons:**
```
[    Add to Cart    ]    ← full width, primary style
[  ♥ Add to Wishlist ]  ← full width, outline style below

If out of stock:
  [  Out of Stock  ]    ← disabled, gray
  [ 🔔 Notify Me  ]    ← outline button
```

**Stock status:**
- In stock + qty > 10: "✓ In Stock" in green
- In stock + qty ≤ 5: "⚠ Only X left in stock!" in orange
- Out of stock: "✗ Out of Stock" in red

**Seller info card:**
```
Small card with:
  Seller avatar + name + "Verified Seller" badge
  Store rating + total sales count
  "Visit Store →" link → /store/sellerId
```

**Delivery info:**
```
🚚 Free delivery on orders over $50
↩ Free 30-day returns
🔒 Secure checkout
```

## Tabs Section

**Tab 1 — Description:**
- Full product description in readable body text
- If empty: "No description provided"

**Tab 2 — Specifications:**
- Table of key-value pairs: Category, Subcategory, Brand, Weight, Material, etc.
- Clean 2-column table, alternating row backgrounds

**Tab 3 — Reviews:**
- Summary at top:
  - Big average rating number
  - 5 progress bars (one per star rating, showing distribution)
  - Total review count
  - "Write a Review" button (only if authenticated customer who purchased this product)
- Review list below:
  - Avatar + name + date + star rating + review text
  - "Verified Purchase" badge if applicable
  - Helpful "👍 Helpful (X)" button
  - Paginated: show 5 per page
- Empty state: "No reviews yet — be the first to review this product"

## Related Products Section

- Title: "You Might Also Like"
- Horizontal Swiper carousel (not grid) — 4 cards visible on desktop
- Fetches products from same category, excluding current product
- Uses the unified ProductCard component

## Hook: useProductDetail
- Fetches product by ID
- Manages selected color, selected size, quantity
- Validates: quantity cannot exceed stock
- Handles add to cart + add to wishlist
- Returns all state and handlers

## Hook: useProductReviews
- Fetches reviews for this product with pagination
- Manages review submit form (if user is eligible)
- Returns: { reviews, totalCount, averageRating, ratingDistribution, page, setPage }

---

# ══════════════════════════════════════════
# SHARED RULES FOR ALL PUBLIC PAGES
# ══════════════════════════════════════════

## SEO
- Every public page must have a document title (use `document.title = "..."` or react-helmet)
- Landing page: "E-Commerce — Shop Premium Products"
- Products page: "All Products | E-Commerce" (updates with filters: "Electronics | E-Commerce")
- Single product: "[Product Name] | E-Commerce"

## URL-Driven Filters
- All filters on the products page live in the URL via useSearchParams
- Sharing a URL with filters works correctly
- Browser back/forward navigation works correctly with filters

## Loading States
- Every section and page must show skeleton UI while loading
- Never show an empty page — always show skeletons or spinners

## Error States
- If API fails: show a clean error message + "Try Again" button that retries the fetch
- Never show a raw error or blank screen

## Empty States
- No products matching filters: illustration + "No products found" + "Clear Filters" button
- No reviews yet: "Be the first to review this product"
- Use the shared EmptyState component

## Authentication Rules on Public Pages
- All public pages visible to guests — no login required to browse
- Add to Cart: works for guests (localStorage) + authenticated (API)
- Add to Wishlist: works for guests (localStorage) + authenticated (API)
- Write a Review: requires login — clicking "Write a Review" redirects to /login?redirect=back
- Checkout: requires login — clicking "Checkout" redirects to /login?redirect=checkout

---

# ══════════════════════════════════════════
# HOOKS TO CREATE (if not already existing)
# ══════════════════════════════════════════

| Hook | Page | Purpose |
|------|------|---------|
| `useAnnouncementBar` | Landing | Message rotation + localStorage dismiss |
| `useHeroSlider` | Landing | Slide index + autoplay control |
| `useFlashSale` | Landing | Fetch sale products + countdown timer |
| `useCountdownTimer` | Landing | HH:MM:SS live countdown |
| `useBestSellers` | Landing | Fetch + tab filter |
| `useFeaturedProducts` | Landing | Fetch featured |
| `useCounterAnimation` | Landing | Animate numbers on scroll |
| `useProductsPage` | Products | URL params + fetch + pagination |
| `useProductFilters` | Products | Filter state + URL sync |
| `useProductDetail` | Single product | Fetch + variant selection + qty |
| `useProductReviews` | Single product | Fetch reviews + pagination |
| `useRelatedProducts` | Single product | Fetch same-category products |

---

# ══════════════════════════════════════════
# DELIVERABLES — IN THIS ORDER
# ══════════════════════════════════════════

> Show the status report first → get confirmation → then build section by section.

**Landing Page — complete all missing sections (in order 1–15)**

**All Products Page:**
1. Route added to router
2. `useProductsPage` hook
3. `useProductFilters` hook
4. Filters sidebar component + all filter sections
5. Sort bar + active filter chips
6. Products grid with skeleton loading
7. Pagination component
8. Empty state

**Single Product Page:**
9. Route added to router
10. `useProductDetail` hook
11. `useProductReviews` hook
12. `useRelatedProducts` hook
13. Image gallery + lightbox
14. Product info column (name, price, variants, qty, buttons, stock, seller, delivery)
15. Tabs section (Description, Specifications, Reviews)
16. Related products carousel

**Final checks:**
17. All pages have correct document titles
18. All loading states show skeletons
19. All error states show retry UI
20. Cart + wishlist work on all three pages (guest + auth)
21. All internal links navigate correctly
