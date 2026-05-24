# Performance Optimization Strategy

This document outlines a roadmap to optimize the E-Commerce platform for speed, scalability, and enhanced user experience.

---

## 1. Frontend Optimizations (Client-Side)

### 1.1 Asset Optimization
- [x] **Next-Gen Image Formats**: Migrate all static and user-uploaded images to **WebP** or **AVIF**. These formats are 25-35% smaller than JPEG at same quality.
- [x] **Responsive Image Components**: Use `srcset` and `<picture>` tags to serve optimized sizes based on the user's viewport (don't serve a 2000px image on a mobile device).
- [x] **Lazy Loading Images**: Use `loading="lazy"` browser attribute for late-discovery images.

### 1.2 Bundle & Rendering
- [x] **Dynamic Imports (Code Splitting)**: (Already implemented in `router.jsx`) Continue using `lazy()` for feature-heavy modules like Dashboards.
- [x] **CSS Minification**: Ensure the production build uses `PostCSS` or `LightningCSS` to strip unused styles.
- [x] **Memoization**: Use `React.memo`, `useMemo`, and `useCallback` selectively in heavy components (like the `ProductGrid`) to prevent unnecessary re-renders.

---

## 2. Backend Optimizations (Server-Side)

### 2.1 Caching Strategy
- [x] **Multi-Layer Caching**:
    - **In-Memory (Redis)**: Continue expanding Redis cache for high-traffic public endpoints (Categories, Brands).
    - **HTTP Caching**: Use `Cache-Control` headers for static assets and public API data.
- [x] **Stale-While-Revalidate**: Implement a stale-while-revalidate pattern in the `discountService.js` to avoid blocking main threads for calculation.

### 2.2 Database Performance (MongoDB)
- [x] **Compound Indexing**:
    - Add `{ status: 1, createdAt: -1 }` index for the Product Feed.
    - Add `{ primaryCategory: 1, price: 1 }` for faceted searches.
- [x] **Selective Fields**: Always use `.select("field1 field2")` to avoid fetching large `description` or `images` arrays when only a name/price is needed for list views.
- [x] **Lean Queries**: Use `.lean()` for all read-only queries to bypass Mongoose's heavyweight document instantiation.

---

## 3. Network & Infrastructure

### 3.1 Content Delivery Network (CDN)
- [x] Serve all frontend build assets (`index.js`, `index.css`) and media assets via a global CDN (e.g., Cloudflare, Akamai) to reduce TTFB (Time to First Byte).

### 3.2 Gzip & Brotli Compression
- [x] **Brotli Implementation**: Ensure `app.js` prioritizes Brotli compression (via `brotli-compression` middleware) as it is significantly more efficient than standard Gzip for text/JSON payloads.

### 3.3 HTTP/2 or HTTP/3
- [x] Deploy the app on a server that supports **HTTP/2** to allow multiplexing multiple requests over a single TCP connection, eliminating the head-of-line blocking issue.

---

## 4. Monitoring & KPIs

To measure the success of these optimizations, we will track:
- **LCP (Largest Contentful Paint)**: Goal < 2.5s
- **FID (First Input Delay)**: Goal < 100ms
- **CLS (Cumulative Layout Shift)**: Goal < 0.1
- **TTFB (Time to First Byte)**: Goal < 200ms
