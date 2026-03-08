# E-Commerce Cart & Order System — Full Implementation Prompt

## Your Role
You are a senior backend engineer building a production-grade e-commerce system using **Node.js**, **Express**, and **MongoDB (Mongoose)**. The app has three user roles: **customer**, **seller**, and **admin**. You must implement the complete cart and order workflow described below — including guest cart support, authenticated cart, checkout with atomic inventory decrement, and order lifecycle management.

---

## Tech Stack
- Runtime: Node.js + Express
- Database: MongoDB via Mongoose
- Auth: JWT (req.user is populated by auth middleware)
- Transactions: MongoDB sessions (mongoose.startSession)
- Frontend cart (guest): localStorage

---

## User Roles
| Role | Description |
|------|-------------|
| `customer` | Browses products, manages cart, places orders |
| `seller` | Lists products, manages their own orders |
| `admin` | Full access to all orders, can override any status |

---

## PART 1 — DATA MODELS

> ⚠️ **The `Cart`, `Order`, and `Product` models already exist with custom fields defined by the project.**
> **Do NOT redefine, rename, or suggest any model fields.**
> Use the existing models exactly as they are. When writing services and controllers, reference only the fields already present in the models. If you are unsure what a field is called, **ask before assuming**.

The only structural behaviors you must respect (without adding or changing any fields) are:

- **Cart** has an `items` array and belongs to one customer — one cart per customer
- **Cart** recalculates its totals automatically via a pre-save hook based on items
- **Order** belongs to one customer and one seller — multi-seller carts produce multiple orders
- **Order** stores price and product info as snapshots at checkout time — these never change after creation
- **Product** has a numeric stock/inventory field that must be decremented atomically at checkout

---

## PART 2 — CART BUSINESS LOGIC

### Rule: Cart is lazy-created
Do NOT create a cart document in MongoDB when a user registers. Only create it when they add their first item.

### getCart(customer_id)
1. Find cart by customer_id, populate product details from the Product model
2. If no cart exists, return an empty cart shape with no items and zero totals
3. For each item, enrich with live product data:
   - Whether the item is still available (product exists, is active, has stock)
   - Whether the saved price differs from the current product price
   - The current live price from the product
   - The maximum quantity the customer can buy (current stock)

### addItem(customer_id, { product_id, quantity })
1. Validate quantity is a positive integer
2. Fetch product — throw if not found, not active, or out of stock
3. Find or create cart for this customer
4. If product already exists in cart:
   - New total qty = existing qty + requested qty
   - If new total qty > available stock → throw a clear error showing available stock and what's already in cart
   - Otherwise update quantity
   - Refresh the saved price snapshot to the product's current price
5. If product is not yet in cart:
   - If requested quantity > available stock → throw error
   - Add new item with price snapshot, product name snapshot, and product image snapshot
6. Save cart — the pre-save hook will recalculate totals automatically

### updateItemQuantity(customer_id, product_id, quantity)
1. Validate quantity >= 1
2. Find cart and locate the item — throw if either not found
3. Fetch product — validate it is still active and requested quantity does not exceed stock
4. Update quantity and save

### removeItem(customer_id, product_id)
1. Find cart
2. Filter out the item by product_id
3. If no item was actually removed → throw "Item not found in cart"
4. Save cart

### clearCart(customer_id)
1. Find cart and set its items array to empty, then save

### validateCartForCheckout(customer_id)
Returns `{ valid: Boolean, errors: String[], cart }`
1. If no cart exists or cart is empty → return invalid with message "Cart is empty"
2. For each item, fetch the product and check:
   - Product missing or inactive → add descriptive error
   - Product out of stock → add error
   - Item quantity exceeds available stock → add error with specific numbers
3. Return `valid: true` only if the errors array is empty

---

## PART 3 — CHECKOUT & ORDER BUSINESS LOGIC

### createOrdersFromCart(customer_id, { shipping_address, payment_method, notes })

This is the most critical function. Follow these exact steps in order:

**Step 1 — Validate cart**
- Call validateCartForCheckout
- If invalid → throw with all error messages joined together

**Step 2 — Open MongoDB transaction**
- Use `mongoose.startSession()` + `session.startTransaction()`
- Every DB operation from this point must use `{ session }`

**Step 3 — Atomic inventory decrement**
- For each cart item run a single atomic operation:
  ```
  Product.findOneAndUpdate(
    { _id: product_id, stock_quantity: { $gte: requested_quantity } },
    { $inc: { stock_quantity: -requested_quantity } },
    { new: true, session }
  )
  ```
- If the result is null → stock was insufficient (race condition caught) → collect the error
- If ANY item fails → abort transaction immediately, throw with all collected stock error messages

**Step 4 — Group items by seller**
- Group all cart items by their seller
- Each seller group will become one separate order document

**Step 5 — Build and save each order**
- For each seller group, map items to order items using the price snapshot as the locked unit price (this never changes)
- Calculate subtotal from items
- Calculate shipping fee:
  - subtotal >= 500 → free
  - subtotal >= 200 → small fee
  - else → standard fee
- Set total = subtotal + shipping fee
- Record the initial status history entry (status: pending, placed by customer)
- Save the order using the session

**Step 6 — Clear the cart**
- Inside the same transaction, clear all items from the cart and reset totals to zero

**Step 7 — Commit or rollback**
- On success → commitTransaction
- On any error → abortTransaction, then rethrow the error
- In the `finally` block → always call endSession()

**Return**: array of all created orders

---

### cancelOrder(order_id, customer_id, reason)

1. Open a transaction
2. Find order matching both order_id AND customer_id — a customer can only cancel their own order
3. If order status is not `pending` → throw: "Cannot cancel order with status [X]. Only pending orders can be cancelled."
4. Restore inventory: for each item increment the product's stock by the ordered quantity
5. Update the order: set status to cancelled, record cancellation timestamp, save the reason, append to status history
6. Commit transaction

---

### updateOrderStatusBySeller(order_id, seller_id, new_status, { tracking_number, note })

Allowed transitions for sellers only:
- `pending → processing`
- `processing → shipped`

1. Find order matching both order_id AND seller_id — seller can only update their own orders
2. If the requested transition is not in the allowed list → throw with a clear message
3. Update status, optionally save tracking number
4. Append to status history with the seller as the actor
5. Save

---

### updateOrderStatusByAdmin(order_id, admin_id, new_status, { note, tracking_number })

Admin can force any status transition.

1. Find order by order_id
2. Open a transaction
3. If new status is `delivered` → record delivery timestamp
4. If new status is `cancelled` AND order was not already cancelled → restore inventory for all items
5. Update status, tracking number if provided, append to status history with admin as the actor
6. Commit transaction

---

## PART 4 — GUEST CART WORKFLOW

### Concept
Unauthenticated users can add products to cart using **localStorage** on the frontend only. They cannot place orders. When they log in or register, their guest cart is merged into their account cart on the server.

### Frontend localStorage Structure
The guest cart is stored under the key `"guest_cart"` as JSON:
```json
{
  "items": [
    {
      "product_id": "abc123",
      "name": "Product Name",
      "price": 99.99,
      "image": "url",
      "seller_id": "seller123",
      "quantity": 2
    }
  ],
  "total": 199.98
}
```

### Frontend Guest Cart Utility (guestCart.js)
Implement these functions:
- `getGuestCart()` → read and parse `"guest_cart"` from localStorage, return `{ items: [], total: 0 }` if empty or missing
- `addToGuestCart(product, quantity)`:
  1. Get current guest cart
  2. If product already exists → increment quantity
  3. Else → push new item with product id, name, price, image, seller id, quantity
  4. Recalculate total
  5. Save updated cart back to localStorage
- `removeFromGuestCart(product_id)` → filter out item, recalculate total, save
- `updateGuestCartQty(product_id, quantity)` → update quantity, recalculate total, save
- `clearGuestCart()` → remove the `"guest_cart"` key from localStorage entirely

### Backend — Merge Endpoint: POST /api/cart/merge
Called once immediately after login if localStorage has items.

Logic:
1. Read `guest_items` array from request body
2. For each guest item call `cartService.addItem(customer_id, { product_id, quantity })`
3. Wrap each call in try/catch — silently skip items that fail (out of stock, unavailable, etc.)
4. After processing all items, fetch and return the full updated cart

### Frontend — After Login Handler
```
1. Call login API → receive token
2. Save token to storage
3. Read guest cart from localStorage
4. If guest cart has items:
   a. POST /api/cart/merge  with { guest_items: guestCart.items }
   b. clearGuestCart()
5. Redirect user to cart or checkout
```

### Add to Cart — Frontend Decision Logic
```
If user is authenticated:
  → POST /api/cart/items  (persisted in MongoDB)
Else:
  → addToGuestCart(product, quantity)  (stored in localStorage only)
```

### Checkout Button — Frontend Decision Logic
```
If user is authenticated:
  → navigate to /checkout
Else:
  → navigate to /login?redirect=checkout
  → after successful login, trigger cart merge, then navigate to /checkout
```

---

## PART 5 — API ROUTES

**Cart controllers (customer, authenticated):**
- Get cart
- Add item to cart
- Update item quantity
- Remove item
- Clear entire cart
- Merge guest cart after login

**Order controllers (customer):**
- Checkout — place order from cart
- Get my orders (with status filter and pagination)
- Cancel an order

**Order controllers (seller):**
- Get orders for my products
- Update order status

**Order controllers (admin):**
- Get all orders (with filters)
- Force update any order status

---

## PART 6 — EDGE CASES TO HANDLE

| Scenario | Expected Behavior |
|----------|-------------------|
| Guest adds item → item sells out → guest logs in | Merge silently skips that item, no crash |
| Two customers buy the last unit simultaneously | Atomic `$gte` check in findOneAndUpdate prevents overselling — second buyer gets a stock error |
| Customer adds item → seller changes price → customer checks out | Order uses the saved price snapshot — not the new price |
| Authenticated customer opens cart on a second device | Sees the same cart (stored in MongoDB, not browser) |
| Customer logs out | DB cart is preserved untouched for next login |
| Brand new user registers, had a guest cart | No DB cart exists yet — after merge, guest items become their first cart |
| Same product exists in both guest cart and DB cart | Keep the DB cart quantity as-is — do not add guest quantity on top |
| Seller tries to update an order that belongs to another seller | findOne({ _id, seller_id }) returns null → 404 unauthorized |
| Customer tries to cancel a shipped order | Status check fails with "Cannot cancel order with status shipped" |
| Product is deleted or deactivated by seller while in cart | getCart returns that item flagged as unavailable — customer sees a warning |

---

## PART 7 — CRITICAL BUSINESS RULES SUMMARY

1. **Price is locked at the moment the item is added to cart** — never auto-update the price snapshot from the product on cart fetch
2. **Inventory decrement is atomic** — always use `$gte` + `$inc` in a single findOneAndUpdate, never read stock then write separately
3. **Checkout is one all-or-nothing MongoDB transaction** — validate, decrement inventory, create orders, clear cart — if any step fails, everything rolls back
4. **Multi-seller cart always produces multiple orders** — one order document per seller, created in the same checkout transaction
5. **Cart is cleared only after all orders are successfully saved** — inside the same transaction, never before
6. **Inventory is always restored when an order is cancelled** — inside a transaction, using the same atomic approach as decrement
7. **Order items are permanent snapshots** — product name, price, and image are copied at checkout and must never reference or update from live product data
8. **Guest cart lives only in localStorage** — never saved to MongoDB until the user logs in and triggers a merge
9. **Merge is strictly additive** — guest items are added to existing DB cart items; the DB cart is never replaced or overwritten
10. **Order numbers must be human-readable and unique** — generate on pre-save using a timestamp + random component pattern

---

## PART 8 — WHAT NOT TO DO

- ❌ Do NOT create a cart document when a user registers
- ❌ Do NOT decrement inventory when adding to cart — only at the moment of checkout
- ❌ Do NOT save guest cart data to MongoDB — localStorage only until login
- ❌ Do NOT run checkout outside of a MongoDB transaction
- ❌ Do NOT auto-refresh price snapshots when loading the cart — only flag the change, never silently overwrite
- ❌ Do NOT allow sellers to view or modify orders that belong to other sellers
- ❌ Do NOT allow customers to cancel orders in any status other than `pending`
- ❌ Do NOT forget to restore inventory when cancelling an order
- ❌ Do NOT create a single order for multiple sellers — always split by seller at checkout
- ❌ Do NOT invent or assume field names — always refer to the existing model fields
- ❌ Do NOT generate route files, route paths, or HTTP method definitions — routes are handled separately

---