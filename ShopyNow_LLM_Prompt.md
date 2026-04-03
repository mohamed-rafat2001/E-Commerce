
You are an expert React/Vite engineer. I have a MERN e-commerce app called "ShopyNow"
with this exact tech stack:

CLIENT:
- React + Vite (JavaScript, NOT TypeScript)
- Tailwind CSS for styling
- Redux Toolkit for global state (auth, cart, wishlist)
- TanStack React Query for server state & data fetching (with Redis cache on server)
- React Router DOM v6 for routing
- Axios for HTTP requests
- Lighthouse scores: Performance 12-31/100, Accessibility 88-90, Best Practices 96, SEO 83-100

SERVER:
- Node.js + Express.js
- MongoDB + Mongoose
- Redis for server-side caching (already implemented)
- JWT + HttpOnly Cookies for auth
- Helmet, Rate Limiting, Mongo Sanitize, HPP for security

3 user roles with separate panels: Customer, Seller, Admin

Fix ALL issues below. I will share my code files with you one by one.
Do NOT suggest packages that conflict with my current stack.
Do NOT add TypeScript. Keep JavaScript.
```

---

## 🔴 Issue 1 — Mobile Navigation Shows No Links

**Problem:** The mobile hamburger menu opens a modal/drawer that only shows the title
"Navigation" and copyright text — NO nav links at all.

**Fix:** Create a complete `MobileNavDrawer` component:

```jsx
// components/layout/MobileNavDrawer.jsx

import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { X, Heart, ShoppingCart, Home,
         Grid, Tag, HelpCircle, Package, ChevronDown } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home',         href: '/',           icon: Home },
  { label: 'All Products', href: '/products',   icon: Package },
  { label: 'Brands',       href: '/brands',     icon: Tag },
  { label: 'Categories',   href: '/categories', icon: Grid },
  { label: 'Help',         href: '/help',       icon: HelpCircle },
];

const CATEGORY_LINKS = [
  { label: 'Clothes',         href: '/categories/clothes' },
  { label: 'Streetwear',      href: '/categories/streetwear' },
  { label: 'Luxury Fashion',  href: '/categories/luxury-fashion' },
  { label: 'Tech Essentials', href: '/categories/tech-essentials' },
  { label: 'Home Decor',      href: '/categories/home-decor' },
  { label: 'Beauty Picks',    href: '/categories/beauty-picks' },
  { label: 'Wellness',        href: '/categories/wellness' },
  { label: 'Outdoor Gear',    href: '/categories/outdoor-gear' },
];

export default function MobileNavDrawer({ isOpen, onClose }) {
  const location = useLocation();
  const { cartItems }     = useSelector(state => state.cart);
  const { wishlistItems } = useSelector(state => state.wishlist);
  const { user }          = useSelector(state => state.auth);

  // Lock body scroll when open
  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on route change
  useEffect(() => { onClose(); }, [location.pathname]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/50 z-[9998]"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div
        className="fixed top-0 right-0 h-full w-[85vw] max-w-sm bg-white z-[9999]
          shadow-2xl flex flex-col transition-transform duration-300 translate-x-0"
        role="dialog"
        aria-label="Navigation menu"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <span className="text-lg font-bold text-gray-900">ShopyNow</span>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close navigation"
          >
            <X size={20} />
          </button>
        </div>

        {/* Icons row */}
        <div className="flex items-center gap-4 px-4 py-3 border-b bg-gray-50">
          <Link to="/wishlist" className="flex items-center gap-2 text-sm text-gray-700">
            <div className="relative">
              <Heart size={20} />
              {wishlistItems?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px]
                  w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {wishlistItems.length}
                </span>
              )}
            </div>
            Wishlist
          </Link>
          <Link to="/cart" className="flex items-center gap-2 text-sm text-gray-700">
            <div className="relative">
              <ShoppingCart size={20} />
              {cartItems?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px]
                  w-4 h-4 rounded-full flex items-center justify-center font-bold">
                  {cartItems.length}
                </span>
              )}
            </div>
            Cart
          </Link>
        </div>

        {/* Nav Links */}
        <nav className="flex-1 overflow-y-auto py-2" aria-label="Mobile navigation">
          {NAV_LINKS.map(({ label, href, icon: Icon }) => (
            <Link
              key={href}
              to={href}
              className={`flex items-center gap-3 px-4 py-3 text-sm font-medium
                hover:bg-gray-50 transition-colors border-b border-gray-100
                ${location.pathname === href ? 'text-primary bg-primary/5' : 'text-gray-700'}`}
            >
              <Icon size={18} aria-hidden="true" />
              {label}
            </Link>
          ))}

          {/* Categories accordion */}
          <details className="border-b border-gray-100">
            <summary className="flex items-center gap-3 px-4 py-3 text-sm font-medium
              text-gray-700 hover:bg-gray-50 cursor-pointer list-none">
              <Grid size={18} aria-hidden="true" />
              Browse Categories
              <ChevronDown size={16} className="ml-auto" />
            </summary>
            <div className="bg-gray-50 pl-10">
              {CATEGORY_LINKS.map(({ label, href }) => (
                <Link
                  key={href}
                  to={href}
                  className="block py-2.5 px-3 text-sm text-gray-600
                    hover:text-primary transition-colors border-b border-gray-100/50"
                >
                  {label}
                </Link>
              ))}
            </div>
          </details>
        </nav>

        {/* Footer: auth buttons */}
        <div className="p-4 border-t flex flex-col gap-2">
          {user ? (
            <Link
              to={`/${user.role}/dashboard`}
              className="w-full text-center py-3 px-4 rounded-xl bg-gray-900
                text-white font-semibold text-sm hover:bg-gray-700 transition-colors"
            >
              My Dashboard
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="w-full text-center py-3 px-4 rounded-xl border-2
                  border-gray-900 text-gray-900 font-semibold text-sm
                  hover:bg-gray-900 hover:text-white transition-colors"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="w-full text-center py-3 px-4 rounded-xl bg-gray-900
                  text-white font-semibold text-sm hover:bg-gray-700 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
          <p className="text-center text-xs text-gray-400 mt-2">
            © {new Date().getFullYear()} ShopyNow
          </p>
        </div>
      </div>
    </>
  );
}
```

**Wire it into your Header:**

```jsx
const [mobileNavOpen, setMobileNavOpen] = useState(false);
// ...
<button onClick={() => setMobileNavOpen(true)} aria-label="Open navigation menu">
  <Menu size={24} />
</button>
<MobileNavDrawer isOpen={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
```

---

## 🔴 Issue 2 — Categories Dropdown Causes Scroll Bug

**Problem:** The mega-menu dropdown makes the page scroll unexpectedly when opened.

**Fix A — `useDropdown` hook:**

```js
// hooks/useDropdown.js
import { useState, useEffect, useRef } from 'react';

export function useDropdown() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  const openDropdown = () => {
    setOpen(true);
    document.body.style.overflow = 'hidden';
  };

  const closeDropdown = () => {
    setOpen(false);
    document.body.style.overflow = '';
  };

  const toggleDropdown = () => open ? closeDropdown() : openDropdown();

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) closeDropdown();
    };
    if (open) {
      document.addEventListener('mousedown', handleClick);
      document.addEventListener('touchstart', handleClick);
    }
    return () => {
      document.removeEventListener('mousedown', handleClick);
      document.removeEventListener('touchstart', handleClick);
    };
  }, [open]);

  useEffect(() => () => { document.body.style.overflow = ''; }, []);

  return { open, ref, openDropdown, closeDropdown, toggleDropdown };
}
```

**Fix B — Use in CategoriesDropdown component:**

```jsx
const { open, ref, toggleDropdown, closeDropdown } = useDropdown();

return (
  <div ref={ref} className="relative">
    <button onClick={toggleDropdown} aria-expanded={open} aria-haspopup="true">
      Categories
      <ChevronDown className={`transition-transform ${open ? 'rotate-180' : ''}`} />
    </button>

    {/* Full-screen overlay */}
    {open && (
      <div
        className="fixed inset-0 bg-black/20 z-[9998]"
        onClick={closeDropdown}
        aria-hidden="true"
      />
    )}

    {/* Dropdown — position: fixed to avoid scroll issues */}
    {open && (
      <div className="fixed left-0 right-0 top-[64px] bg-white z-[9999]
        shadow-2xl border-t border-gray-100 max-h-[70vh] overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-4 gap-8">
          {/* Your mega menu content here */}
        </div>
      </div>
    )}
  </div>
);
```

---

## 🔴 Issue 3 — Performance (Lighthouse 12–31 → Target 70+)

### A. `vite.config.js` — Code Splitting & Minification

```js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom'],
          'router':       ['react-router-dom'],
          'redux':        ['@reduxjs/toolkit', 'react-redux'],
          'query':        ['@tanstack/react-query'],
          'axios':        ['axios'],
        }
      }
    },
    chunkSizeWarningLimit: 600,
    sourcemap: false,
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
        drop_debugger: true,
      }
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom', '@reduxjs/toolkit']
  }
});
```

### B. Lazy Load All Route Pages

```jsx
// App.jsx
import { lazy, Suspense } from 'react';

const HomePage          = lazy(() => import('./pages/HomePage'));
const ProductsPage      = lazy(() => import('./pages/ProductsPage'));
const ProductDetailPage = lazy(() => import('./pages/ProductDetailPage'));
const CartPage          = lazy(() => import('./pages/CartPage'));
const LoginPage         = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage      = lazy(() => import('./pages/auth/RegisterPage'));
const CustomerDashboard = lazy(() => import('./pages/customer/Dashboard'));
const SellerDashboard   = lazy(() => import('./pages/seller/Dashboard'));
const AdminDashboard    = lazy(() => import('./pages/admin/Dashboard'));

// Wrap router:
<Suspense fallback={<PageSkeleton />}>
  {/* routes */}
</Suspense>
```

### C. PageSkeleton Fallback

```jsx
// components/ui/PageSkeleton.jsx
export default function PageSkeleton() {
  return (
    <div className="min-h-screen bg-gray-50 animate-pulse">
      <div className="h-16 bg-white border-b" />
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-4">
        <div className="h-64 bg-gray-200 rounded-xl" />
        <div className="grid grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-64 bg-gray-200 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
```

### D. OptimizedImage Component

```jsx
// components/ui/OptimizedImage.jsx
export default function OptimizedImage({ src, alt, className, priority = false, width, height }) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      className={className}
      onError={(e) => { e.target.src = '/placeholder.jpg'; }}
    />
  );
}

// Hero (above fold):   <OptimizedImage priority={true} ... />
// Product cards:       <OptimizedImage ... />
```

### E. React Query Client Config

```jsx
// main.jsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime:          1000 * 60 * 5,   // 5 min — works with Redis cache
      gcTime:             1000 * 60 * 30,  // keep in memory 30 min
      retry:              1,
      refetchOnWindowFocus: false,
      refetchOnMount:     false,
    },
  },
});
```

### F. Preload LCP Image in `index.html`

```html
<link rel="preload" as="image" href="/hero-image.webp" fetchpriority="high" />
<link rel="preconnect" href="https://your-api-domain.com" />
<link rel="preconnect" href="https://res.cloudinary.com" />
```

### G. Skeleton Loaders for All Data-Fetching Components

```jsx
const { data: products, isLoading } = useQuery({
  queryKey: ['products'],
  queryFn: fetchProducts,
});

if (isLoading) return <ProductsGridSkeleton />;

function ProductsGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {[...Array(8)].map((_, i) => (
        <div key={i} className="rounded-xl bg-gray-200 animate-pulse">
          <div className="aspect-[4/3] bg-gray-300 rounded-t-xl" />
          <div className="p-4 space-y-2">
            <div className="h-4 bg-gray-300 rounded w-3/4" />
            <div className="h-4 bg-gray-300 rounded w-1/2" />
            <div className="h-8 bg-gray-300 rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}
```

---

## 🔴 Issue 4 — Full Responsive Design (Mobile-First)

### Header

```jsx
<header className="sticky top-0 z-50 bg-white border-b shadow-sm">
  <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-4">

    {/* Logo */}
    <Link to="/" className="flex-shrink-0 text-xl font-bold">ShopyNow</Link>

    {/* Search — tablet+ */}
    <div className="hidden md:flex flex-1 max-w-lg">
      <SearchBar />
    </div>

    {/* Desktop nav links */}
    <nav className="hidden lg:flex items-center gap-6">
      <NavLinks />
    </nav>

    {/* Right icons */}
    <div className="flex items-center gap-2">
      <Link to="/wishlist" className="p-2 relative" aria-label="Wishlist">
        <Heart size={22} />
        <CartBadge count={wishlistCount} />
      </Link>
      <Link to="/cart" className="p-2 relative" aria-label="Shopping cart">
        <ShoppingCart size={22} />
        <CartBadge count={cartCount} />
      </Link>

      {/* Auth — desktop only */}
      <div className="hidden md:flex items-center gap-2">
        <Link to="/login"
          className="text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-100">
          Login
        </Link>
        <Link to="/register"
          className="text-sm font-semibold px-4 py-2 rounded-xl bg-gray-900 text-white hover:bg-gray-700">
          Get Started
        </Link>
      </div>

      {/* Hamburger — mobile only */}
      <button
        onClick={() => setMobileNavOpen(true)}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px]
          flex items-center justify-center"
        aria-label="Open navigation menu"
      >
        <Menu size={22} />
      </button>
    </div>
  </div>
</header>
```

### Hero Section

```jsx
<section className="relative min-h-[100svh] flex items-center overflow-hidden">
  <div className="absolute inset-0">
    <OptimizedImage
      src={currentSlide.image}
      alt={currentSlide.alt}
      className="w-full h-full object-cover"
      priority={true}
    />
    <div className="absolute inset-0 bg-black/40" />
  </div>

  <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
    <span className="inline-block px-3 py-1 bg-yellow-400 text-black text-xs
      font-bold uppercase tracking-wider rounded-full mb-4">
      {currentSlide.badge}
    </span>

    <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold
      text-white leading-tight max-w-2xl mb-4">
      {currentSlide.heading}
    </h1>

    <p className="text-base sm:text-lg text-white/80 max-w-lg mb-8">
      {currentSlide.subheading}
    </p>

    {/* Stack on mobile, row on desktop */}
    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
      <Link to="/products"
        className="w-full sm:w-auto min-h-[48px] flex items-center justify-center
          px-8 py-3 bg-white text-gray-900 font-bold rounded-xl hover:bg-gray-100">
        Shop Now
      </Link>
      <Link to="/register"
        className="w-full sm:w-auto min-h-[48px] flex items-center justify-center
          px-8 py-3 border-2 border-white text-white font-bold rounded-xl
          hover:bg-white/10">
        Sell With Us
      </Link>
    </div>
  </div>
</section>
```

### Product Cards Grid

```jsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
  {products.map(product => (
    <ProductCard key={product._id} product={product} />
  ))}
</div>

function ProductCard({ product }) {
  return (
    <article className="bg-white rounded-xl overflow-hidden shadow-sm
      hover:shadow-md transition-shadow group">
      <div className="aspect-[4/3] overflow-hidden bg-gray-100">
        <OptimizedImage
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="p-3 sm:p-4">
        <h3 className="font-semibold text-sm sm:text-base text-gray-900 line-clamp-2 mb-1">
          {product.name}
        </h3>
        <p className="text-primary font-bold text-base sm:text-lg">${product.price}</p>
        <button className="w-full mt-3 min-h-[44px] bg-gray-900 text-white text-sm
          font-semibold rounded-lg hover:bg-gray-700 transition-colors
          flex items-center justify-center gap-2">
          <ShoppingCart size={16} />
          Add to Cart
        </button>
      </div>
    </article>
  );
}
```

### Panel Layout (Customer / Seller / Admin)

```jsx
function PanelLayout({ children, sidebarLinks }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 flex">

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white border-r z-50
        transform transition-transform duration-300 lg:relative lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <SidebarContent links={sidebarLinks} onClose={() => setSidebarOpen(false)} />
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        <div className="sticky top-0 z-30 bg-white border-b h-14 flex items-center px-4 gap-3">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 min-h-[44px] min-w-[44px]"
            aria-label="Open sidebar"
          >
            <Menu size={20} />
          </button>
          <h1 className="font-semibold text-gray-900">Dashboard</h1>
        </div>
        <main className="flex-1 p-4 sm:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
```

### Admin/Seller Tables — Scrollable on Mobile

```jsx
<div className="bg-white rounded-xl shadow-sm overflow-hidden">
  <div className="overflow-x-auto">
    <table className="w-full min-w-[640px] text-sm">
      {/* table content */}
    </table>
  </div>
</div>
```

---

## 🔴 Issue 5 — Full SEO (react-helmet-async)

### Install

```bash
npm install react-helmet-async
```

### Setup in `main.jsx`

```jsx
import { HelmetProvider } from 'react-helmet-async';

<HelmetProvider>
  <App />
</HelmetProvider>
```

### Reusable SEO Component

```jsx
// components/seo/SEO.jsx
import { Helmet } from 'react-helmet-async';

export default function SEO({
  title = 'ShopyNow',
  description = 'Discover curated luxury fashion, tech essentials, and lifestyle products.',
  image = 'https://yoursite.com/og-image.jpg',
  url,
  type = 'website',
  noIndex = false,
}) {
  const fullTitle  = title === 'ShopyNow' ? title : `${title} | ShopyNow`;
  const canonical  = url || (typeof window !== 'undefined' ? window.location.href : '');

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {noIndex && <meta name="robots" content="noindex, nofollow" />}
      <link rel="canonical" href={canonical} />

      <meta property="og:title"       content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image"       content={image} />
      <meta property="og:url"         content={canonical} />
      <meta property="og:type"        content={type} />
      <meta property="og:site_name"   content="ShopyNow" />

      <meta name="twitter:card"        content="summary_large_image" />
      <meta name="twitter:title"       content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image"       content={image} />
    </Helmet>
  );
}
```

### Usage Per Page

```jsx
// Home
<SEO
  title="ShopyNow — Curated Fashion & Tech"
  description="Discover curated luxury fashion pieces, tech essentials, and lifestyle products."
/>

// Product detail
<SEO
  title={product.name}
  description={product.description?.substring(0, 155)}
  image={product.images?.[0]}
  type="product"
/>

// Category
<SEO
  title={`${category.name} — ShopyNow`}
  description={`Browse ${category.name} — curated selection on ShopyNow.`}
/>

// All panel pages (noIndex = true)
<SEO title="My Dashboard" noIndex={true} />
<SEO title="Seller Dashboard" noIndex={true} />
<SEO title="Admin Dashboard" noIndex={true} />
```

### Fixed `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="theme-color" content="#111827" />
  <meta name="robots" content="index, follow" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  <link rel="manifest" href="/manifest.json" />
  <link rel="preconnect" href="https://your-api-url.com" />
  <link rel="preload" as="image" href="/hero-image.webp" fetchpriority="high" />
  <title>ShopyNow — Curated Fashion & Tech</title>
  <meta name="description"
    content="Discover curated luxury fashion, tech essentials, and lifestyle products." />
</head>
<body>
  <noscript>You need JavaScript enabled to use ShopyNow.</noscript>
  <div id="root"></div>
  <script type="module" src="/src/main.jsx"></script>
</body>
</html>
```

### `public/robots.txt`

```
User-agent: *
Allow: /
Disallow: /admin/
Disallow: /seller/
Disallow: /customer/dashboard
Disallow: /cart
Disallow: /checkout
Sitemap: https://yoursite.com/sitemap.xml
```

---

## ✅ Final Checklist

Apply these across every file in the project:

| # | Rule |
|---|------|
| 1 | All `<img>` must have descriptive, non-empty `alt` attributes |
| 2 | All icon-only buttons must have `aria-label` |
| 3 | One `<h1>` per page — then h2, h3 in order |
| 4 | Use semantic tags: `<header>`, `<main>`, `<nav>`, `<footer>`, `<article>`, `<section>` |
| 5 | Remove all `console.log` (handled by vite terser config above) |
| 6 | All buttons/links: `min-height: 44px` on mobile for tap targets |
| 7 | Add `focus-visible` styles to all interactive elements |
| 8 | Wrap router in an `ErrorBoundary` component |
| 9 | All admin/seller tables: wrap in `<div className="overflow-x-auto">` |
| 10 | Panel pages: `<SEO noIndex={true} />` so dashboards are not indexed |

---

## 📌 Recommended Order of Fixes

1. **Header + MobileNavDrawer** — fixes the biggest UX bug (no links showing)
2. **useDropdown hook** — fixes scroll bug immediately
3. **vite.config.js** — biggest performance win with minimal code change
4. **Lazy loading routes** — second biggest performance win
5. **OptimizedImage component** — swap across all pages
6. **React Query config** — tune staleTime to match Redis TTL
7. **SEO component** — add to all pages
8. **index.html** — final SEO base layer
9. **Responsive panels** — PanelLayout component
10. **Skeleton loaders** — polish step

---

> Generated for **ShopyNow** · Stack: React + Vite · Tailwind · Redux Toolkit · TanStack React Query · Axios · React Router DOM v6 · Node.js · Express · MongoDB · Redis
