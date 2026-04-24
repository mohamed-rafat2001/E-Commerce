# 🛒 Order & Checkout Feature — Full Implementation Plan

## Current State Audit

### ✅ Backend — 100% Complete, No Changes Needed

| Layer | File | Status |
|---|---|---|
| Data model | `OrderModel.js` | ✅ Full schema (statuses, prices, address, payment) |
| Data model | `OrderItemsModel.js` | ✅ Per-seller item grouping |
| Service | `orderService.js` | ✅ Checkout transaction, cancel + inventory restore, seller/admin status |
| Controller | `orderController.js` | ✅ All 8 controllers done |
| Router | `orderRouter.js` | ✅ All REST routes wired + Swagger docs |

**Available API Endpoints:**

```
POST   /api/v1/orders/checkout           → Create orders from cart (auth required)
GET    /api/v1/orders/myorders           → Customer's order list (auth required)
GET    /api/v1/orders/myorders/:id       → Single order detail (auth required)
PATCH  /api/v1/orders/:id/cancel         → Cancel pending order (auth required)
GET    /api/v1/orders/seller             → Seller's orders (Seller role)
PATCH  /api/v1/orders/:id/seller-status  → Seller status update
GET    /api/v1/orders/admin/all          → All orders (Admin role)
PATCH  /api/v1/orders/:id/status         → Admin force-update
```

---

### ✅ Frontend — Partially Done

| File | Status |
|---|---|
| `features/order/services/order.js` | ✅ All API calls (`checkoutOrder`, `getOrdersForCustomer`, `cancelOrder`, etc.) |
| `features/order/hooks/useOrder.js` | ✅ Fetch single order |
| `features/order/hooks/useOrders.js` | ✅ Fetch order list |
| `features/order/hooks/useUpdateOrder.js` | ✅ Mutation hook |
| `features/customer/hooks/useOrderHistory.js` | ✅ Wraps useOrders |
| `features/customer/pages/OrderHistoryPage.jsx` | ✅ Dashboard table (action buttons not yet wired) |
| `features/customer/pages/ShippingAddressesPage.jsx` | ✅ Full address CRUD |
| `router.jsx` `/checkout`, `/orders`, `/orders/:id` | ❌ All pointing to `PlaceholderPage` |
| `features/order/pages/OrderPage.jsx` | ❌ Empty file |

---

## 🗺️ Guest + Logged-in User Journey

**Guest user flow:**
```
Add to cart → Cart page → Click "Proceed to Checkout"
→ AuthModal fires ("Sign in to complete your purchase")
→ Login → Cart merges via useCartMerge (already in App.jsx)
→ Redirect to /checkout
```

**Logged-in user flow:**
```
Add to cart → Cart page → Click "Proceed to Checkout" → /checkout directly
```

> **No backend changes needed.** `useCartMerge` already handles post-login cart migration.

---

## 📋 Full Build Plan (Priority Order)

---

## Phase 1 — Hooks First (no UI needed)

### Create `useCheckout.js`

**Path:** `client/src/features/order/hooks/useCheckout.js`

```js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { checkoutOrder } from '../services/order.js';
import { useNavigate } from 'react-router-dom';
import useToast from '../../../shared/hooks/useToast.js';

export default function useCheckout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: checkoutOrder, // already exists in order.js
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      showSuccess('Order placed successfully!');
      navigate('/order-success', { state: { orders: response?.data?.data } });
    },
    onError: (err) => showError(err?.response?.data?.message || 'Checkout failed'),
  });
}
```

### Create `useCancelOrder.js`

**Path:** `client/src/features/order/hooks/useCancelOrder.js`

```js
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { cancelOrder } from '../services/order.js';
import useToast from '../../../shared/hooks/useToast.js';

export default function useCancelOrder(orderId) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();

  return useMutation({
    mutationFn: (reason) => cancelOrder(orderId, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['order', orderId] });
      queryClient.invalidateQueries({ queryKey: ['orders'] });
      showSuccess('Order cancelled successfully.');
    },
    onError: (err) => showError(err?.response?.data?.message || 'Cannot cancel order'),
  });
}
```

---

## Phase 2 — CheckoutPage (Most Critical)

### Files to Create

```
client/src/features/order/pages/CheckoutPage.jsx
client/src/features/order/components/CheckoutSteps.jsx       ← step indicator
client/src/features/order/components/ShippingStep.jsx        ← address selector + inline form
client/src/features/order/components/PaymentStep.jsx         ← payment method picker
client/src/features/order/components/ReviewStep.jsx          ← read-only confirm view
client/src/features/order/components/OrderSummaryPanel.jsx   ← right-side cart summary
```

### Page Layout

```
Desktop (2-column):                   Mobile (stacked):
┌───────────────────┬──────────────┐  ┌────────────────────┐
│  LEFT: Form Steps │ RIGHT: Cart  │  │   Order Summary    │
│  ─────────────    │  Summary     │  │────────────────────│
│  Step 1:          │              │  │   Form Steps       │
│  Shipping Address │  [Items]     │  │   Step 1 / 2 / 3   │
│                   │  Subtotal    │  │                    │
│  Step 2:          │  Shipping    │  │   [Place Order]    │
│  Payment Method   │  Total       │  └────────────────────┘
│                   │              │
│  Step 3:          │  [Place      │
│  Review & Place   │   Order]     │
└───────────────────┴──────────────┘
```

### CheckoutPage State Machine

```js
const [step, setStep] = useState(1);  // 1=Shipping, 2=Payment, 3=Review
const [shippingAddress, setShippingAddress] = useState(null);
const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
const { mutate: checkout, isPending } = useCheckout();

const handlePlaceOrder = () => {
  checkout({ shippingAddress, paymentMethod });
};
```

### ShippingStep Details

- Use existing `useCustomerAddresses` hook to load saved addresses
- Show address cards (reuse `AddressCard.jsx` from customer components)
- "Use a different address" option → inline form
- Shipping address object shape expected by API:

```json
{
  "street": "123 Main St",
  "city": "Cairo",
  "state": "Cairo",
  "postalCode": "11511",
  "country": "Egypt"
}
```

### PaymentStep — 5 Methods

```js
const PAYMENT_METHODS = [
  { value: 'cash_on_delivery', label: 'Cash on Delivery',   icon: '💵', desc: 'Pay when delivered' },
  { value: 'card',             label: 'Credit / Debit Card', icon: '💳', desc: 'Visa, Mastercard' },
  { value: 'paypal',           label: 'PayPal',              icon: '🅿️', desc: 'Pay via PayPal' },
  { value: 'bank_transfer',    label: 'Bank Transfer',       icon: '🏦', desc: 'Direct bank transfer' },
  { value: 'wallet',           label: 'Wallet',              icon: '👝', desc: 'Use your wallet balance' },
];
```

### OrderSummaryPanel

Reads from `useCart()` (existing hook) to display: product images, quantities, subtotal, shipping estimate, total.

---

## Phase 3 — Cart Page Wiring

**File:** `client/src/features/cart/pages/CartPage.jsx`

### Checkout Button Logic

```jsx
const { isAuthenticated } = useAuth();
const navigate = useNavigate();

const handleCheckout = () => {
  if (!isAuthenticated) {
    openAuthModal(); // use existing auth modal trigger mechanism
  } else {
    navigate('/checkout');
  }
};
```

### Guest Banner (show when not logged in)

```jsx
{!isAuthenticated && (
  <div className="guest-banner">
    ⚠️ Sign in to save your cart and checkout faster.
    <button onClick={openAuthModal}>Sign In</button>
  </div>
)}
```

---

## Phase 4 — Order Success Page

**Path:** `client/src/features/order/pages/OrderSuccessPage.jsx`

```jsx
const { state } = useLocation();
const orders = state?.orders || [];

// Show: success animation, order ID(s), 
// "Track My Order" button → /orders
// "Continue Shopping" button → /
// If multi-seller checkout → multiple orders → show each as a card
```

---

## Phase 5 — Orders List Page (`/orders`)

**Path:** `client/src/features/order/pages/OrdersPage.jsx`

- Filter tabs: All | Pending | Processing | Shipped | Delivered | Cancelled
- Use `useOrderHistory({ status, page, limit })`
- Consumer-facing card layout (not a data table)

### Create `OrderListCard.jsx`

**Path:** `client/src/features/order/components/OrderListCard.jsx`

Shows: short order ID, date, status badge, product thumbnails (max 3), total price, "View Details" button.

---

## Phase 6 — Order Detail Page (`/orders/:orderId`)

**Path:** `client/src/features/order/pages/OrderDetailPage.jsx`

Uses `useOrder(orderId)` (already exists) + `useCancelOrder(orderId)` (new).

### Page Layout

```
← Back to Orders          ORDER #ORD-XXXXXXXX      [Status Badge]
────────────────────────────────────────────────────────────────
ORDER ITEMS
  [img]  Product Name  x2   $49.99
  [img]  Product Name  x1   $24.99
────────────────────────────────────────────────────────────────
SHIPPING ADDRESS              PAYMENT METHOD
  123 Main St                   Cash on Delivery
  Cairo, Egypt                  Status: Not Paid
────────────────────────────────────────────────────────────────
ORDER TRACKING TIMELINE
  ✅ Pending  ✅ Processing  🚚 Shipped  ○ Delivered
────────────────────────────────────────────────────────────────
ORDER SUMMARY
  Items:      $74.98
  Shipping:   $10.00
  Tax:        $0.00
  ──────────────────
  Total:      $84.98
────────────────────────────────────────────────────────────────
  [Cancel Order]  ← only visible when status === 'Pending'
```

### Create `OrderTimeline.jsx`

**Path:** `client/src/features/order/components/OrderTimeline.jsx`

Visual stepper: Pending → Processing → Shipped → Delivered.
Cancelled = separate red error state.

---

## Phase 7 — Router Updates

**File:** `client/src/app/routes/router.jsx`

### Add Lazy Imports

```js
const CheckoutPage    = lazy(() => import('../../features/order/pages/CheckoutPage.jsx'));
const OrdersPage      = lazy(() => import('../../features/order/pages/OrdersPage.jsx'));
const OrderDetailPage = lazy(() => import('../../features/order/pages/OrderDetailPage.jsx'));
const OrderSuccessPage = lazy(() => import('../../features/order/pages/OrderSuccessPage.jsx'));
```

### Replace 4 PlaceholderPage Routes

```js
// Inside ProtectedRoute children (public layout):
{ path: '/checkout',        element: S(CheckoutPage) },
{ path: '/order-success',   element: S(OrderSuccessPage) },   // NEW route
{ path: '/orders',          element: S(OrdersPage) },
{ path: '/orders/:orderId', element: S(OrderDetailPage) },
```

---

## Phase 8 — Fix Customer Dashboard

### `OrderHistoryPage.jsx` — Wire Action Buttons

```jsx
// Replace placeholder Actions column render:
render: (row) => (
  <div className="flex gap-2">
    <Button variant="outline" size="sm" onClick={() => navigate(`/orders/${row._id}`)}>
      Details
    </Button>
    {row.status === 'Pending' && (
      <Button variant="ghost" size="sm" onClick={() => handleCancel(row._id)}>
        Cancel
      </Button>
    )}
  </div>
)
```

### `RecentOrders.jsx` — Wire Real Data

Use `useOrderHistory({ limit: 3 })` instead of placeholder/hardcoded data.

---

## ⚠️ Backend Gaps (Minor)

| Gap | Recommendation |
|---|---|
| `checkout` requires auth — no guest path | ✅ Handled by Option A (auth prompt + `useCartMerge`) |
| No `orderNumber` field on `OrderModel` | Optional: add field using `generateOrderNumber()` already in `orderService.js` |
| `isPaid` never set for `cash_on_delivery` | Seller/Admin sets it when moving to Processing (already works) |
| No email on order creation | Optional future: send confirmation email inside `createOrdersFromCart` |

---

## ✅ Complete File Checklist

```
✅ client/src/features/order/hooks/useCheckout.js              NEW
✅ client/src/features/order/hooks/useCancelOrder.js           NEW
✅ client/src/features/order/pages/CheckoutPage.jsx            NEW
✅ client/src/features/order/components/CheckoutSteps.jsx      NEW
✅ client/src/features/order/components/ShippingStep.jsx       NEW
✅ client/src/features/order/components/PaymentStep.jsx        NEW
✅ client/src/features/order/components/ReviewStep.jsx         NEW
✅ client/src/features/order/components/OrderSummaryPanel.jsx  NEW
✅ client/src/features/order/pages/OrderSuccessPage.jsx        NEW
✅ client/src/features/order/pages/OrdersPage.jsx              NEW  (replaces placeholder)
✅ client/src/features/order/components/OrderListCard.jsx      NEW
✅ client/src/features/order/pages/OrderDetailPage.jsx         NEW  (replaces placeholder)
✅ client/src/features/order/components/OrderTimeline.jsx      NEW
✅ client/src/app/routes/router.jsx                            UPDATE (4 routes + /order-success)
✅ client/src/features/cart/pages/CartPage.jsx                 NO CHANGE NEEDED (already wired via useCartPage)
✅ client/src/features/customer/pages/OrderHistoryPage.jsx     UPDATE (wired action buttons)
✅ client/src/features/customer/components/RecentOrders.jsx    UPDATE (wired real data)
```

---

## 🏁 Recommended Build Order

| # | What to Build | Why |
|---|---|---|
| 1 | `useCheckout.js` + `useCancelOrder.js` | Hooks first — no UI needed |
| 2 | `CheckoutPage.jsx` + all sub-components | Most critical user path |
| 3 | `CartPage.jsx` checkout button + guest auth prompt | Connects cart → checkout |
| 4 | `OrderSuccessPage.jsx` | Needed immediately after checkout works |
| 5 | `router.jsx` — all 4 route updates | Everything becomes accessible |
| 6 | `OrdersPage.jsx` + `OrderListCard.jsx` | Orders history public view |
| 7 | `OrderDetailPage.jsx` + `OrderTimeline.jsx` | Order detail + cancel flow |
| 8 | Fix `OrderHistoryPage` + `RecentOrders` | Customer dashboard polish |

---

> **The entire backend is 100% ready.  
> All work is frontend only.  
> Start with Phase 1 (hooks) then Phase 2 (CheckoutPage).**
