# Testing and Security Optimization Plan

This document outlines the testing strategy for the E-Commerce platform and documents resolved security vulnerabilities.

---

## 1. Manual Testing Guide (Postman / Swagger)

Manual testing is performed via the Swagger UI (`/api-docs`) or Postman. Ensure you have the `CLIENT_URL` and `PORT` configured.

### 1.1 Authentication & Profile
- **Base URL**: `/api/v1/authentications`
- [ ] **POST `/signUp`**: Test with valid data. Verify profile creation (Seller/Customer).
- [ ] **POST `/login`**: Test with valid/invalid credentials. Verify `accessToken` and `refreshToken` cookies are set.
- [ ] **POST `/refresh-token`**: Test token rotation. Verify a new `accessToken` is issued.
- [ ] **POST `/forgotPassword`**: Verify email received with 6-digit code.
- [ ] **PATCH `/resetPassword`**: Use code to set a new password. Verify login with new password.
- [ ] **GET `/me`**: Verify it returns the authenticated user's profile and populate correctly.
- [ ] **PATCH `/updatePassword`**: Change password while logged in. Verify old token revocation.

### 1.2 Product & Inventory
- **Base URL**: `/api/v1/products`
- [ ] **GET `/`**: Test search, filter, and sort queries (e.g., `?sort=-price&category=electronics`).
- [ ] **POST `/`**: (Seller only) Create product with `coverImage` and `images` (multipart/form-data).
- [ ] **GET `/myproducts`**: (Seller only) Verify it only returns products owned by the seller.
- [ ] **PATCH `/:id`**: (Seller only) Update specific fields. Verify image update on Cloudinary.
- [ ] **DELETE `/:id`**: (Seller only) Verify product deletion and cache invalidation.

### 1.3 Order Management
- **Base URL**: `/api/v1/orders`
- [ ] **POST `/checkout`**: (Customer only) Test with valid cart and address. Verify stock decrement.
- [ ] **POST `/guest-checkout`**: Test with `guestEmail` and address.
- [ ] **GET `/myorders`**: (Customer only) Verify order history.
- [ ] **GET `/seller`**: (Seller only) Verify orders for products owned by the seller.
- [ ] **PATCH `/:id/cancel`**: Test order cancellation logic.

### 1.4 Discounts & Coupons
- **Base URL**: `/api/v1/discounts`
- [ ] **GET `/active`**: Verify all active promos are returned.
- [ ] **POST `/validate-coupon`**: Test with valid/expired codes and check saved amount logic.
- [ ] **POST `/admin`**: (Admin only) Create global discounts.
- [ ] **POST `/seller`**: (Seller only) Create brand-specific discounts.

---

## 2. Automated Testing Guide (Jest / Supertest)

Automated tests ensure that updates don't break existing functionality. Recommended structure: `server/tests/*.test.js`.

### 2.1 Integration Test Suites
- **Auth Suite**:
    - Test complete flow: SignUp -> Login -> Protected Route Access -> Logout.
    - Test token expiration and refresh logic.
- **Ownership (IDOR) Suite**:
    - Scenario: Seller A attempts to DELETE Seller B's product via ID.
    - Expected: `404 Not Found` or `403 Forbidden`.
- **Cart & Discount Suite**:
    - Test adding items to cart.
    - Apply various discount types (percentage, fixed, free shipping).
    - Verify final totals calculated by `discountService.js`.

### 2.2 Key Test Command
```bash
# Run all backend tests
npm test

# Run specific suite
npx jest server/tests/auth.test.js
```

### 2.3 Automated Test Coverage Goals
- **Models**: 100% (Validators, complex pre-save hooks).
- **Controllers**: >80% (Happy paths + all common error scenarios).
- **Middlewares**: 100% (`Protect`, `restrictTo`, `globalError`).

---

## 3. Resolved Security Issues (Audit Fixes)

### 3.1 IDOR Protection (Resolved)
- **Status**: Implemented in `handlerFactory.js`.
- **Fix**: Methods like `updateByOwner` force a match on both `_id` and `userId`, preventing cross-user data manipulation.

### 3.2 JWT Session Invalidation (Resolved)
- **Status**: Implemented in `UserModel.js` and `authMiddleware.js`.
- **Fix**: Added `passwordChangedAt`. Any token issued before a password change is rejected with "Please log in again."

### 3.3 Semantic Authorization (Resolved)
- **Status**: Updated in `authMiddleware.js`.
- **Fix**: Permission denied errors now return `403 Forbidden` instead of `400 Bad Request`.

---

## 4. Full API Endpoint Map (For Reference)

| Category | Endpoint | Methods | Access |
| :--- | :--- | :--- | :--- |
| **Auth** | `/authentications/signUp` | POST | Public |
| | `/authentications/login` | POST | Public |
| | `/authentications/me` | GET, PATCH, DELETE | Private |
| **Products** | `/products` | GET, POST, DELETE | Public/Seller |
| | `/products/:id` | GET, PATCH, DELETE | Public/Seller |
| **Orders** | `/orders/checkout` | POST | Customer |
| | `/orders/myorders` | GET | Customer |
| | `/orders/seller` | GET | Seller |
| **Discounts**| `/discounts/active` | GET | Public |
| | `/discounts/admin` | GET, POST | Admin |
| **Customer** | `/customers/profile` | GET | Customer |
| | `/customers/addresses`| PATCH | Customer |
| **Admin** | `/admin/stats` | GET | Admin |
| | `/admin/:model` | GET, POST, DELETE | Admin |
