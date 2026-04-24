# Discount System — Implementation Plan (Enhanced)

## 1. Overview
A multi-tier discount engine enabling **Sellers** and **Admins** to create and manage promotions.

| Criteria | Discount Types |
|---|---|
| Category-wide, Seller-wide, Single Product, Platform-wide | Percentage off, Fixed amount off, Free shipping, Shipping discount |

### Senior Suggestions Added
1. **Max discount cap** (`maxDiscountAmount`) — prevents absurd results like "99% off a $5,000 item".
2. **Minimum order value** (`minOrderValue`) — "Get 20% off on orders above $100".
3. **Usage limits** (`usageLimit` / `usageCount`) — limit how many times a discount can be used globally.
4. **Priority field** — explicit numeric priority for deterministic conflict resolution instead of relying on "best discount wins" alone.
5. **Description field** — customer-facing text Sellers can customize (e.g., "Summer Mega Sale — Up to 50% off!").
6. **Computed `activeDiscount` virtual on ProductModel** — avoids N+1 queries; discount info is resolved at read time via middleware.

---

## 2. Conflict Resolution (Stacking Rules)
- **Product-level**: Multiple discounts match → pick **highest priority** first; if tied, pick **highest savings** for customer.
- **Shipping-level**: `free_shipping` overrides `shipping_discount` which overrides normal shipping.
- **Admin vs Seller**: Admin discounts get higher default priority (100) vs Seller (50), so platform promotions always win unless overridden.

---

## 3. Database Schema — `DiscountModel`

```javascript
{
  name, description, type, value,
  maxDiscountAmount,    // cap: e.g., max $50 off even if 50% of $200
  minOrderValue,        // "orders above $X"
  scope,                // 'all_products' | 'category' | 'seller_all' | 'single_product'
  targetIds,            // array — supports multiple categories or products
  creatorRole,          // 'Admin' | 'Seller'
  creatorId,
  priority,             // higher wins in conflicts
  startDate, endDate,
  isActive,
  usageLimit, usageCount
}
```

---

## 4. Execution Phases

### Phase 1 — Backend (THIS BUILD)
- [x] `DiscountModel` with indexes and validation
- [x] `discountService.js` — resolver: given a product, find best active discount
- [x] `discountController.js` — full CRUD
- [x] `discountRouter.js` — routes for Admin + Seller
- [x] Mount in `app.js`
- [x] Update `OrderModel` with discount tracking fields
- [x] Public endpoint to fetch active discounts for products

### Phase 2 — Seller & Admin UI (COMPLETED)
- [x] Dashboard tables, create/edit forms, toggle active/inactive, scheduling

### Phase 3 — Public UI (COMPLETED)
- [x] Strikethrough prices, discount badges, countdown timers, cart savings display

### Phase 4 — Order Integration (COMPLETED)
- [x] Cart Item breakdown with correct pricing
- [x] Cart subtotal & shipping recalculation in `orderCalculations`
- [x] `OrderSummary` visual savings element
- [x] Backend Checkout atomically grabs discounts to lock safe order totals
- [x] Guest and Auth checkouts enriched with discount properties
