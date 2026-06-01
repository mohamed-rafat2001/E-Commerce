# E-Commerce Platform (MERN)

Full-stack E-Commerce application built with **React (Vite)** on the client and **Node.js/Express + MongoDB** on the server. The platform supports multiple roles (**Customer**, **Seller**, **Admin/SuperAdmin**) with role-based dashboards, product & brand management, cart/checkout, and orders.

## Tech Stack

### Client (`/client`)
- React 19 + Vite
- React Router
- Redux Toolkit + TanStack Query
- Tailwind CSS + Framer Motion
- Axios (cookie-based auth with `withCredentials`)

### Server (`/server`)
- Node.js + Express
- MongoDB + Mongoose
- JWT (access + refresh) stored in HttpOnly cookies
- Security: Helmet, rate limiting, mongo sanitize, HPP, compression
- Optional infra: Redis cache + Cloudinary uploads

## Repository Structure
- [client/](./client) — frontend app
- [server/](./server) — backend API (can run as an Express server locally, or as Netlify Functions in deployment)

## Features
- Authentication: sign up, login, logout, refresh token, forgot/reset password
- Role-based access control (Customer / Seller / Admin / SuperAdmin)
- Products: listing, details, filtering, seller product management
- Brands: public brand discovery, seller brand management, follow/followers
- Categories/Subcategories
- Cart + Wishlist
- Orders: guest checkout and authenticated checkout, order history, cancellations, seller/admin status updates
- Uploads: image uploads via Cloudinary (server-side)
- Health + Infra checks: `/api/v1/health`, `/api/v1/health/cache`
- SEO: dynamic `/sitemap.xml`

## Local Development

### Requirements
- Node.js 18+ (recommended)
- MongoDB Atlas (recommended) or MongoDB locally
- (Optional) Redis for cache endpoints
- (Optional) Cloudinary account for image uploads

### Install Dependencies
From the repository root:

```bash
cd server
npm install

cd ../client
npm install
```

### Environment Variables

#### Server (`server/.env`)
The server reads configuration from environment variables (see usage in `server/server.js`, `server/db/config.js`, and auth/cookie utilities).

```env
PORT=4000

# MongoDB (Atlas URL template)
DB_URL=mongodb+srv://<username>:<db_password>@cluster0.example.mongodb.net/ecommerce?retryWrites=true&w=majority
DB_PASSWORD=your_db_password

# CORS / sitemap base
CLIENT_URL=http://localhost:5173

# JWT (access + refresh)
JWT_ACCESS_SECRET=change_me
JWT_REFRESH_SECRET=change_me_too
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Cookie expiration (numbers)
JWT_ACCESS_COOKIE_EXPIRES=15
JWT_REFRESH_COOKIE_EXPIRES=7

# Runtime mode flags used by the codebase
NODE_MODE=DEV
NODE_ENV=development

# Optional: Redis cache
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
# REDIS_PASSWORD=

# Optional: Email
EMAIL_SERVICE=
EMAIL_HOST=
EMAIL_PORT=
EMAIL_USERNAME=
EMAIL_PASSWORD=
EMAIL_FROM_NAME=
EMAIL_FROM=

# Optional: Cloudinary (note: keys are lowercase in this codebase)
cloud_name=
api_key=
api_secret=
```

#### Client (`client/.env`)

```env
VITE_API_URL=http://localhost:4000/api/v1/
```

### Run (Dev)
Run both client + server using the server workspace script:

```bash
cd server
npm run dev
```

Or run them separately:

```bash
cd server
npm run server

cd ../client
npm run dev
```

## Deployment

### Client on Netlify
This repository includes [client/netlify.toml](./client/netlify.toml).

- Base directory: `client`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables:
  - `VITE_API_URL` = your deployed server base (example: `https://YOUR-SERVER.netlify.app/api/v1/`)

### Server on Netlify (Functions)
This repository includes [server/netlify.toml](./server/netlify.toml) and a Netlify Function handler at [server/functions/api.js](./server/functions/api.js).

- Base directory: `server`
- Functions directory: `functions`
- Requests to `/api/v1/*` are redirected to the Netlify function and handled by Express.
- Environment variables: use the same variables as `server/.env` (set them in Netlify site settings).
  - Important: set `CLIENT_URL` to your deployed client URL and `NODE_MODE=PROD` so cookies use secure settings.

## Documentation
- [server/README.md](./server/README.md) — API, env vars, deployment (Netlify Functions)
- [client/README.md](./client/README.md) — UI architecture, env vars, deployment (Netlify)
