# Add to Cart & Wishlist — Complete Flow Prompt
# Customer (authenticated) + Guest (unauthenticated) — All Panels & Pages

---

## Your Role
You are a senior React frontend engineer. Your job is to implement the complete **Add to Cart** and **Add to Wishlist** flows across the entire app — for both authenticated customers and unauthenticated guest users.

> ⚠️ This is a scan-first task. You must read everything that already exists before writing a single line of code. The backend services, API endpoints, cart model, and wishlist model are already built. Your job is frontend implementation only.

---

## ⚠️ STEP 0 — Full Audit Before Anything Else

Do ALL of the following before writing any code:

### 1. Scan existing services
- Find every service file related to cart and wishlist
- Read the exact function names, parameters, and return shapes
- Note which API endpoints are called (GET, POST, DELETE, PATCH)
- Note what request body each endpoint expects
- Note what response shape each endpoint returns

### 2. Scan existing hooks
- Find any hook that already touches cart or wishlist logic (`useCart`, `useWishlist`, `useAddToCart`, etc.)
- Read what state they manage and what they expose
- Note what is already working vs what is missing

### 3. Scan existing components
- Find every component that already has an "Add to Cart" button or heart/wishlist icon
- Note which ones are wired up and which ones are just UI with no logic
- Find the cart drawer/modal/page if it already exists
- Find the wishlist page if it already exists

### 4. Scan existing context / state management
- Find how cart and wishlist state is currently stored globally (Context, Redux, Zustand, or none)
- If a CartContext or WishlistContext already exists — read it fully before touching it
- If nothing exists yet — you will create it

### 5. Scan localStorage usage
- Check if guest cart or guest wishlist is already partially implemented in localStorage
- Note the exact key names used

### 6. Show the developer a full audit report:
```
AUDIT REPORT:
─────────────────────────────────
Cart Service:     found at [path] — functions: [list]
Wishlist Service: found at [path] — functions: [list]
Cart Hook:        found / NOT found
Wishlist Hook:    found / NOT found
Cart Context:     found / NOT found
Wishlist Context: found / NOT found
Guest Cart (localStorage): found / NOT found — key: [name]
Guest Wishlist (localStorage): found / NOT found — key: [name]
Components needing wiring: [list all]
─────────────────────────────────
```

**Only after developer confirms the audit — start implementation.**

---

# ════════════════════════════════════════
# PART 1 — CART FLOW
# ════════════════════════════════════════

## Cart — Two User Types

| | Authenticated Customer | Guest (Not Logged In) |
|---|---|---|
| Storage | Server (MongoDB via API) | Browser localStorage |
| Key | — | `"guest_cart"` |
| Place order | ✅ Yes | ❌ Must login first |
| Cart persists | ✅ Across devices | ❌ Browser only |
| Merge on login | ✅ Triggered after login | — |

---

## Cart — Guest localStorage Structure

```json
{
  "items": [
    {
      "product_id": "abc123",
      "name": "Product Name",
      "price": 99.99,
      "image": "url",
      "seller_id": "seller123",
      "quantity": 1
    }
  ],
  "total": 99.99,
  "total_items": 1
}
```

---

## Cart — Global State Shape (CartContext)

```javascript
{
  items: [],              // cart items array
  total_price: 0,         // calculated total
  total_items: 0,         // total quantity
  isLoading: false,       // loading state for any cart operation
  isCartOpen: false,      // cart drawer open/closed
  error: null,

  // Actions
  addToCart: (product, quantity) => {},
  removeFromCart: (product_id) => {},
  updateQuantity: (product_id, quantity) => {},
  clearCart: () => {},
  openCart: () => {},
  closeCart: () => {},
  mergeGuestCart: () => {},   // called after login
}
```

---

## Cart — useCart Hook Logic

If `useCart` hook already exists → extend it with missing functionality.
If it does not exist → create it.

**For authenticated users:**
1. On mount → call GET cart API to load server cart
2. `addToCart(product, quantity)`:
   - Optimistic update: add item to local state immediately
   - Call POST cart API in background
   - On error: revert local state + show error toast
3. `removeFromCart(product_id)`:
   - Optimistic update: remove from local state
   - Call DELETE cart API
   - On error: revert + show toast
4. `updateQuantity(product_id, quantity)`:
   - Validate: quantity must be ≥ 1 and ≤ product stock
   - Optimistic update, call PATCH API
5. `clearCart()`: call DELETE all API, clear local state

**For guest users:**
1. On mount → read from `localStorage.getItem("guest_cart")`
2. `addToCart(product, quantity)`:
   - Read current guest cart from localStorage
   - If product exists → increment quantity
   - Else → push new item
   - Recalculate total and total_items
   - Write back to localStorage
3. `removeFromCart(product_id)`: filter out, recalculate, save
4. `updateQuantity(product_id, quantity)`: update, recalculate, save
5. `clearCart()`: remove `"guest_cart"` key from localStorage

**Auth detection:** use whatever auth context/hook already exists in the project to determine `isAuthenticated`

---

## Cart — Merge Guest Cart After Login

Call this automatically after any successful login:

```javascript
const mergeGuestCart = async () => {
  const guestCart = JSON.parse(localStorage.getItem("guest_cart"))
  if (!guestCart || guestCart.items.length === 0) return

  // Call POST /api/cart/merge with guest items
  // Backend handles: addItem for each, skip unavailable ones
  await cartService.mergeGuestCart(guestCart.items)

  // Clear localStorage after merge
  localStorage.removeItem("guest_cart")

  // Reload server cart
  await fetchCart()
}
```

Find the existing login handler/hook in the project and call `mergeGuestCart()` immediately after successful login.

---

## Cart — Add to Cart Button Behavior

Find every "Add to Cart" button across the entire app and wire it up:

**If user is authenticated:**
- Call `addToCart(product, quantity)` from CartContext
- Button shows loading spinner while request is in flight
- On success → open cart drawer (optional, based on existing UX) + show success toast
- On error → show error toast with message from API

**If user is guest:**
- Call `addToCart(product, quantity)` from CartContext (guest path)
- No API call — instant localStorage write
- Show success toast: "Added to cart — login to checkout"
- Do NOT redirect to login — let them keep browsing

**Button states:**
```
Default:  "Add to Cart"
Loading:  spinner + "Adding..."
Success:  brief "Added ✓" (1.5s) then back to default
Error:    "Try Again"
In Cart:  "Go to Cart →" (if product already in cart)
```

**Quantity validation before adding:**
- If quantity requested > stock → show warning, cap at max stock
- If stock = 0 → button is disabled + shows "Out of Stock"

---

## Cart — Drawer / Mini Cart

Find the existing cart drawer or cart sidebar component.
If it does not exist — create a slide-in drawer from the right side.

Wire it to `isCartOpen` / `openCart` / `closeCart` from CartContext.

The drawer must show:
- List of cart items (image, name, price, quantity stepper, remove button)
- Subtotal
- "Checkout" button → if guest: redirects to `/login?redirect=checkout` | if authenticated: goes to checkout
- "View Full Cart" link
- Empty state if cart is empty: "Your cart is empty" + "Start Shopping" button

---

# ════════════════════════════════════════
# PART 2 — WISHLIST FLOW
# ════════════════════════════════════════

## Wishlist — Two User Types

| | Authenticated Customer | Guest (Not Logged In) |
|---|---|---|
| Storage | Server (MongoDB via API) | Browser localStorage |
| Key | — | `"guest_wishlist"` |
| Persists | ✅ Across devices | ❌ Browser only |
| Merge on login | ✅ Triggered after login | — |

---

## Wishlist — Guest localStorage Structure

```json
{
  "items": [
    {
      "product_id": "abc123",
      "name": "Product Name",
      "price": 99.99,
      "image": "url"
    }
  ]
}
```

---

## Wishlist — Global State Shape (WishlistContext)

```javascript
{
  items: [],              // wishlist items
  isLoading: false,
  error: null,

  // Actions
  addToWishlist: (product) => {},
  removeFromWishlist: (product_id) => {},
  isInWishlist: (product_id) => boolean,
  clearWishlist: () => {},
  mergeGuestWishlist: () => {},   // called after login
}
```

---

## Wishlist — useWishlist Hook Logic

If `useWishlist` hook already exists → extend with missing parts.
If it does not exist → create it.

**For authenticated users:**
1. On mount → call GET wishlist API
2. `addToWishlist(product)`:
   - Optimistic update
   - Call POST wishlist API
   - On error: revert + toast
3. `removeFromWishlist(product_id)`:
   - Optimistic update
   - Call DELETE wishlist API
   - On error: revert + toast
4. `isInWishlist(product_id)`: returns true/false by checking local items array

**For guest users:**
1. On mount → read from `localStorage.getItem("guest_wishlist")`
2. `addToWishlist(product)`:
   - If already in wishlist → skip (no duplicates)
   - Else → push to items array, save to localStorage
3. `removeFromWishlist(product_id)`: filter out, save
4. `isInWishlist(product_id)`: check local array

---

## Wishlist — Merge After Login

```javascript
const mergeGuestWishlist = async () => {
  const guestWishlist = JSON.parse(localStorage.getItem("guest_wishlist"))
  if (!guestWishlist || guestWishlist.items.length === 0) return

  // Add each guest wishlist item to server wishlist
  // Skip items that already exist in server wishlist
  await wishlistService.mergeWishlist(guestWishlist.items)

  localStorage.removeItem("guest_wishlist")
  await fetchWishlist()
}
```

Call `mergeGuestWishlist()` immediately after login — same place as `mergeGuestCart()`.

---

## Wishlist — Heart Icon Button Behavior

Find every heart/wishlist icon button across the entire app and wire it up:

**If user is authenticated:**
- Check `isInWishlist(product.id)` on render
- If NOT in wishlist → hollow heart icon, clicking calls `addToWishlist(product)`
- If IS in wishlist → filled red heart icon, clicking calls `removeFromWishlist(product.id)`
- Show brief animation on toggle (scale bounce)
- Show toast: "Added to wishlist" / "Removed from wishlist"

**If user is guest:**
- Same toggle behavior but uses localStorage
- Show toast: "Saved to wishlist — login to access from any device"

**Icon states:**
```
Not in wishlist (default):  hollow heart, gray
Not in wishlist (hover):    hollow heart, red
In wishlist:                filled heart, red
Loading:                    spinning loader (small)
```

---

## Wishlist — Wishlist Page

Find the existing wishlist page (if it exists).
If it does not exist — create it (place it where customer pages already live).

The page must show:
- Grid of saved products — use the existing ProductCard component
- Each card has a "Remove from Wishlist" button (or the heart icon toggles it)
- "Add to Cart" button on each saved product
- Empty state: "Your wishlist is empty" + "Discover Products" button
- For guest: banner at the top — "Login to sync your wishlist across all your devices"

---

# ════════════════════════════════════════
# PART 3 — WHERE TO WIRE ACROSS THE APP
# ════════════════════════════════════════

Find every location below and wire up both actions:

### Landing Page
- Every ProductCard in: New Arrivals, Best Sellers, Flash Sale, Featured Products
- Each card has both: "Add to Cart" button + heart icon

### Customer Panel
- Product listing/search page → every ProductCard
- Product detail page → "Add to Cart" button (with quantity selector) + heart icon
- Wishlist page → "Add to Cart" from wishlist + remove from wishlist
- Cart page / Cart drawer → full cart management

### Seller Panel
- Product detail page (view only) → NO cart or wishlist buttons
- Seller does not shop — do not show these buttons in seller views

### Admin Panel
- Product detail page (view only) → NO cart or wishlist buttons
- Admin does not shop — do not show these buttons in admin views

---

# ════════════════════════════════════════
# PART 4 — AFTER LOGIN FLOW
# ════════════════════════════════════════

Find the login success handler in the project. After successful login:

```
1. Save auth token
2. Load user profile
3. Check localStorage for "guest_cart"
   → If has items: call mergeGuestCart() → clear localStorage
4. Check localStorage for "guest_wishlist"
   → If has items: call mergeGuestWishlist() → clear localStorage
5. Redirect user to original destination (redirect param) or home
```

This must happen automatically — the user should never manually need to do anything.

---

# ════════════════════════════════════════
# PART 5 — TOAST NOTIFICATIONS
# ════════════════════════════════════════

Find the existing toast/notification system in the project and use it.
If none exists — use `react-hot-toast` or `sonner`.

| Action | Toast message |
|--------|--------------|
| Added to cart (auth) | "Added to cart ✓" |
| Added to cart (guest) | "Added to cart — login to checkout" |
| Removed from cart | "Item removed" |
| Cart error | Error message from API |
| Added to wishlist (auth) | "Saved to wishlist ♥" |
| Added to wishlist (guest) | "Saved — login to sync across devices" |
| Removed from wishlist | "Removed from wishlist" |
| Guest tries to checkout | "Please login to place your order" |
| Merge complete | silent — no toast needed |
| Out of stock | "This item is out of stock" |
| Stock limit reached | "Only X items available" |

---

# ════════════════════════════════════════
# PART 6 — RULES
# ════════════════════════════════════════

## What NOT to Do

- ❌ Do NOT start coding before completing the full audit in Step 0
- ❌ Do NOT rewrite existing working cart/wishlist services — use them as-is
- ❌ Do NOT rewrite existing working hooks — extend them only if needed
- ❌ Do NOT show cart/wishlist buttons in seller or admin views
- ❌ Do NOT block guest users from adding to cart or wishlist — they can do both
- ❌ Do NOT redirect guest users to login when they add to cart/wishlist — only on checkout
- ❌ Do NOT make two separate implementations for guest/auth — one hook handles both cases
- ❌ Do NOT hardcode folder paths — follow the existing project structure
- ❌ Do NOT put cart/wishlist logic inside components — context + hooks only
- ❌ Do NOT skip optimistic updates — every action must feel instant

---

# ════════════════════════════════════════
# PART 7 — DELIVERABLES
# ════════════════════════════════════════

> Show audit report first → get confirmation → then deliver in this order:

**Step 1 — Foundation:**
1. Audit report (services, hooks, contexts, components found)
2. `CartContext` (create or extend existing)
3. `WishlistContext` (create or extend existing)
4. `useCart` hook (create or extend existing)
5. `useWishlist` hook (create or extend existing)

**Step 2 — Guest utilities:**
6. Guest cart localStorage helpers (if not already exist)
7. Guest wishlist localStorage helpers (if not already exist)
8. `mergeGuestCart` function wired into login handler
9. `mergeGuestWishlist` function wired into login handler

**Step 3 — UI components:**
10. `AddToCartButton` shared component (all states: default, loading, success, error, in-cart, out-of-stock)
11. `WishlistButton` shared component (hollow/filled heart, all states)
12. Cart drawer component (create or wire existing)
13. Wishlist page (create or wire existing)

**Step 4 — Wire across the app:**
14. Landing page — all product cards wired
15. Customer panel product listing — all cards wired
16. Customer panel product detail page — wired
17. Customer panel wishlist page — wired
18. Verify seller/admin panels have NO cart or wishlist buttons

**Step 5 — Post-login merge:**
19. Login handler updated with guest cart + wishlist merge
