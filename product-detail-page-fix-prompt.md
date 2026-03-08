# Product Detail Page — Fix & Redesign Prompt
# Seller Panel + Admin Panel

---

## Your Role
You are a senior React frontend engineer. The product detail page currently exists in the seller panel (and admin panel) but has serious UI problems — it is overcomplicated, full of unnecessary sections, uses confusing jargon, and does not show product images properly. Your job is to **completely redesign this page** into a clean, professional product detail page that a seller or admin can actually use.

---

## ⚠️ FIRST — Scan and Read Before Changing Anything

1. Open and read the existing product detail page component and every sub-component it uses
2. Open and read the existing data/API call to understand what product fields are actually available
3. List every component currently on the page — identify which ones to DELETE and which data to KEEP
4. Show the developer the deletion plan and the new layout plan before writing any code
5. Only after confirmation — rebuild the page

> Do NOT change any API calls or backend data. Only fix the UI.
> Do NOT change any route paths.
> Follow the existing project folder structure for where to place files.

---

## PART 1 — What to DELETE from the Current Page

Remove every one of the following sections entirely — they are unnecessary, confusing, and cluttering the page:

| Element to Delete | Why |
|-------------------|-----|
| "Operations \| LIVE SYNCING" dark panel | Unnecessary jargon, not useful for sellers |
| "STATUS PIPELINE" dropdown in side panel | Overly complex label — replace with simple "Status" |
| "VISIBILITY MODE" label | Replace with simple "Visibility" |
| "STOCK RESERVOIR" label | Replace with simple "Stock" |
| "VISION NARRATIVE" section | Meaningless jargon |
| "Technical Blueprint — Comprehensive Product Data Architecture" | Overcomplicated section header |
| "PRODUCT UUID" field display | Not useful for seller to see |
| "GLOBAL SLUG" field | Not useful for seller |
| "PRIMARY VERT." field | Jargon — this is just "Category", rename it |
| "SUB HIERARCHY" field | Jargon — this is just "Subcategory", rename it |
| "STOCK RESERVOIR" label | Jargon — rename to "Stock" |
| "FULFILLMENT VELOCITY" field | Jargon — this is just "Shipping Speed" |
| "STORE PERFORMANCE — 5.0 Grade" | Meaningless metric |
| "The Narrative" section with big decorative first letter | Poor UI, replace with clean description section |
| "CHARACTER COUNT" and "TONE ANALYSIS" fields | Completely unnecessary |
| "EDIT NARRATIVE" link | Confusing — merge into main Edit button |
| "Engagement Hub" dark panel | Unnecessary panel — move actions to simple buttons |
| "PUBLIC REACH", "CONVERSION", "RATING" metrics on product detail | Move these to Analytics page, not product detail |
| Any decorative/artistic text effects on product name | Replace with clean readable typography |

---

## PART 2 — What to KEEP from the Current Page

Keep the following data but display it in a clean redesigned layout:

| Data to Keep | Clean Label to Use |
|-------------|-------------------|
| Product images | "Images" — shown in a slider |
| Product name | "Product Name" |
| Product description | "Description" |
| Price | "Price" |
| Discounted price / sale price | "Sale Price" |
| Stock quantity | "Stock" |
| Category | "Category" |
| Subcategory | "Subcategory" |
| Brand | "Brand" |
| Visibility (public/private) | "Visibility" |
| Product status (active/inactive) | "Status" |
| Color variants | "Colors" |
| Size variants | "Sizes" |
| Rating + review count | "Rating" |
| Created date / last modified date | "Created" / "Last Updated" |
| Seller name (admin view only) | "Seller" |

---

## PART 3 — New Page Layout

Redesign the entire page into this clean standard layout:

---

### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  PAGE HEADER                                        │
│  ← Back    Store Inventory > Product Name    [Edit] │
├───────────────────────────┬─────────────────────────┤
│                           │                         │
│   LEFT COLUMN (60%)       │   RIGHT COLUMN (40%)    │
│                           │                         │
│   Image Slider            │   Product Info          │
│                           │   Name, Price, Status   │
│                           │   Stock, Rating         │
│                           │                         │
│                           │   Quick Actions         │
│                           │   Edit / Delete / Share │
│                           │                         │
├───────────────────────────┴─────────────────────────┤
│  TABS ROW                                           │
│  Details | Description | Variants | Reviews         │
├─────────────────────────────────────────────────────┤
│  TAB CONTENT PANEL                                  │
│  (changes based on active tab)                      │
└─────────────────────────────────────────────────────┘
```

---

### Page Header
- Left: back arrow + breadcrumb ("Store Inventory → Product Name")
- Right: "Edit Product" primary button + a "..." more options menu (Delete, Share, View Public Listing)
- Below header: last modified date in small muted text

---

### Left Column — Image Slider

Build a proper product image slider/gallery:

**Main viewer:**
- Large main image display area (aspect ratio 1:1 or 4:3)
- Rounded corners, clean white background
- If image fails to load → show a clean placeholder with product icon

**Thumbnail strip:**
- Row of small thumbnail images below the main image
- Clicking a thumbnail → updates the main image
- Active thumbnail: highlighted border with primary color
- If only 1 image → hide the thumbnail strip

**Navigation:**
- Left/right arrow buttons on the main image (appear on hover)
- Dot indicators below if more than 3 images

**Zoom:**
- Clicking the main image opens a full-screen lightbox modal with the image
- Lightbox has close button and prev/next navigation

**Hook:** `useProductImageSlider`
- Manages `activeImageIndex`
- Exposes: `activeImage`, `goToNext`, `goToPrev`, `goToIndex`, `openLightbox`, `closeLightbox`, `isLightboxOpen`

---

### Right Column — Product Info Card

Display these in order, clean and readable:

**Product name** — large bold heading

**Price row:**
- If no discount: show price in large text
- If discounted: show original price crossed out + sale price in primary color + discount % badge in red

**Status + Visibility row:**
- Status badge (Active = green / Inactive = gray / Draft = yellow)
- Visibility badge (Public = blue / Private = gray)

**Stock:**
- Show stock number
- If stock ≤ 5 → show "Low Stock" warning badge in orange
- If stock = 0 → show "Out of Stock" badge in red

**Rating:**
- Star icons + numeric rating + "(X reviews)"

**Category / Brand row:**
- Category → Subcategory (with arrow between)
- Brand name with a small logo if available

**Quick Actions (bottom of right card):**
- "Edit Product" — primary button (full width)
- "View Public Listing" — outline button (full width) — opens product on the customer-facing site
- "Delete Product" — ghost/danger text button — triggers confirmation modal before deleting

---

### Tabs Section

4 tabs below the main two-column layout:

#### Tab 1 — Details
Clean grid of product technical details:

| Field | Value |
|-------|-------|
| Category | value |
| Subcategory | value |
| Brand | value |
| Status | value |
| Visibility | value |
| Stock | value |
| Created | date |
| Last Updated | date |
| Seller (admin only) | seller name |

Layout: 2-column grid of label: value pairs inside a clean card.

#### Tab 2 — Description
- Full product description in readable body text
- If no description → EmptyState with "No description added yet" + "Edit Product" button
- Clean left-aligned text, proper line height

#### Tab 3 — Variants
- Colors section: row of color swatches (circles with the actual color)
- Sizes section: row of size pills/tags (S, M, L, XL etc.)
- If no variants → EmptyState: "No variants added yet"
- Each variant shows: label + stock for that variant if available

#### Tab 4 — Reviews
- List of customer reviews for this product
- Each review: avatar + name + star rating + date + review text
- If no reviews → EmptyState: "No reviews yet"
- Average rating summary at the top: big number + star breakdown bars

---

## PART 4 — Components to Create

| Component | Purpose |
|-----------|---------|
| `ProductImageSlider` | Main image + thumbnails + navigation |
| `ProductLightbox` | Full-screen image modal |
| `ProductThumbnails` | Row of thumbnail images |
| `ProductInfoCard` | Right column — name, price, status, stock, rating |
| `ProductPriceDisplay` | Price with/without discount logic |
| `ProductStatusBadges` | Status + Visibility badges row |
| `ProductStockIndicator` | Stock number + low/out-of-stock warning |
| `ProductQuickActions` | Edit, View Public, Delete buttons |
| `ProductDetailTabs` | Tab bar with 4 tabs |
| `ProductDetailsTab` | Details grid (Tab 1) |
| `ProductDescriptionTab` | Description text (Tab 2) |
| `ProductVariantsTab` | Color swatches + size pills (Tab 3) |
| `ProductReviewsTab` | Reviews list + rating summary (Tab 4) |
| `ProductPageHeader` | Breadcrumb + Edit button + modified date |
| `DeleteProductModal` | Confirmation modal before deleting |

---

## PART 5 — Hooks to Create

| Hook | Logic |
|------|-------|
| `useProductDetail` | Fetch product by ID from API, return `{ product, isLoading, error }` |
| `useProductImageSlider` | Active image index, lightbox state, navigation |
| `useProductDetailTabs` | Active tab state, `{ activeTab, setActiveTab }` |
| `useDeleteProduct` | Delete confirmation flow, call delete API, redirect after success |

---

## PART 6 — Design Rules

Match the existing seller panel design exactly:

- **Same sidebar and navbar** — do not change the layout shell
- **Same card style** — white background, rounded corners, subtle border and shadow
- **Same primary color** — use the existing green primary color for active states and buttons
- **Same font** — do not introduce any new fonts
- **Same button style** — use existing Button component with correct variants
- **Same badge style** — use existing Badge component for status, visibility, stock warnings
- **Same spacing** — same padding and gap values used elsewhere in the seller panel
- **Tabs:** simple text tabs with an active underline in primary color — no heavy borders or backgrounds
- **Breadcrumb:** small muted text, current page in dark text, separator "›" between items

---

## PART 7 — Admin Panel Differences

The product detail page is shared by both seller and admin panels.
When rendered in the **admin panel**, additionally show:

- "Seller" field in the Details tab with the seller's name (linked to seller profile)
- An "Approve / Reject" action button if the product is pending review
- A "Force Inactive" button to deactivate the product from admin side
- No "Edit Product" button for admin — admins view only, sellers edit

Use a prop or context value (e.g. `viewerRole: "seller" | "admin"`) to conditionally show/hide these elements.

---

## PART 8 — What NOT to Do

- ❌ Do NOT keep any of the deleted sections listed in Part 1
- ❌ Do NOT use jargon labels — every label must be plain English a non-technical seller understands
- ❌ Do NOT put the image in a decorative/artistic layout — it must be a standard clean slider
- ❌ Do NOT show analytics metrics (reach, conversion) on this page — those belong in Analytics
- ❌ Do NOT use dark panels unless they match the existing design system
- ❌ Do NOT create a new design language — match the existing seller panel look exactly
- ❌ Do NOT change any route, API call, or backend data structure
- ❌ Do NOT hardcode any folder paths — follow where existing seller panel components live
- ❌ Do NOT put logic inside components — hooks only
- ❌ Do NOT make the page feel like a dashboard — it should feel like a clean product detail page

---

## Deliverables — In This Order

> Show the deletion plan + new layout plan first. Wait for developer confirmation. Then build.

1. `useProductDetail` hook
2. `useProductImageSlider` hook
3. `useProductDetailTabs` hook
4. `useDeleteProduct` hook
5. `ProductPageHeader` component
6. `ProductImageSlider` + `ProductThumbnails` + `ProductLightbox` components
7. `ProductInfoCard` + `ProductPriceDisplay` + `ProductStatusBadges` + `ProductStockIndicator` + `ProductQuickActions`
8. `ProductDetailTabs` tab bar component
9. `ProductDetailsTab` content
10. `ProductDescriptionTab` content
11. `ProductVariantsTab` content
12. `ProductReviewsTab` content
13. `DeleteProductModal` component
14. Fully rebuilt product detail page file (replaces the existing one entirely)
