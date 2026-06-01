# Server (API)

Backend API for the E-Commerce platform. This server is built with **Node.js + Express (ESM)** and uses **MongoDB (Mongoose)** for persistence. Authentication is cookie-based using **JWT access + refresh tokens**.

This server can run in two modes:
- **Local Express server** via `server.js`
- **Netlify Functions** via `functions/api.js` (serverless-http wrapper)

## Tech Stack
- Node.js + Express
- MongoDB + Mongoose
- JWT (access + refresh) in HttpOnly cookies
- Security: Helmet, rate limiting, mongo sanitize, HPP
- Compression: gzip/brotli via `compression`
- Optional infra:
  - Redis (`ioredis`) for caching + health endpoint
  - Cloudinary for image uploads
  - Nodemailer for sending emails (password reset, etc.)

## Project Structure (High Level)

```
server/
├── app.js                 # Express app: middleware, routes, health, sitemap
├── server.js              # Local entry (loads .env, connects DB, starts HTTP server)
├── db/
│   └── config.js           # Mongo connection (DB_URL + DB_PASSWORD)
├── functions/
│   └── api.js              # Netlify Function handler (serverless-http)
├── routers/                # Route modules (mounted under /api/v1/*)
├── controllers/            # Request handlers
├── models/                 # Mongoose models
├── middlewares/            # Auth, uploads, error handling helpers
└── utils/                  # Cookies, Redis client, email, helpers, etc.
```

## Environment Variables (`server/.env`)

The codebase expects the following variables:

```env
# Required
PORT=4000
DB_URL=mongodb+srv://<username>:<db_password>@cluster0.example.mongodb.net/ecommerce?retryWrites=true&w=majority
DB_PASSWORD=your_db_password

# Recommended (production)
CLIENT_URL=https://your-client-domain.netlify.app
NODE_MODE=PROD
NODE_ENV=production

# JWT
JWT_ACCESS_SECRET=change_me
JWT_REFRESH_SECRET=change_me_too
JWT_ACCESS_EXPIRES=15m
JWT_REFRESH_EXPIRES=7d

# Cookie expiry values used by utils/sendCookies.js
# access: minutes, refresh: days
JWT_ACCESS_COOKIE_EXPIRES=15
JWT_REFRESH_COOKIE_EXPIRES=7

# Optional: Redis
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

# Optional: Cloudinary (note: variables are lowercase in server/utils/cloudinary.js)
cloud_name=
api_key=
api_secret=
```

## Scripts
From `server/`:

```bash
npm run server   # Dev: nodemon + NODE_MODE=DEV
npm start        # Prod: node server.js
npm run dev      # Runs server + client concurrently
npm test         # Jest tests (uses experimental-vm-modules)
```

## API

### Base URL
- Local: `http://localhost:<PORT>`
- API prefix: `/api/v1`

### Health & Infra
- `GET /api/v1/health` — server health check
- `GET /api/v1/health/cache` — Redis connection + stats (returns 503 if Redis not ready)
- `GET /sitemap.xml` — dynamic sitemap (uses `CLIENT_URL` for `<loc>` base)

### Route Map (Mounted in `app.js`)
- `/api/v1/authentications` — sign up, login, refresh token, logout, forgot/reset password, `/me`
- `/api/v1/products` — product listing + CRUD (role-restricted for seller/admin actions)
- `/api/v1/brands` — public brands + seller brand management + follow features
- `/api/v1/categories`, `/api/v1/subcategories`
- `/api/v1/cart`, `/api/v1/wishlist`
- `/api/v1/orders` — guest checkout + authenticated order lifecycle
- `/api/v1/reviews`
- `/api/v1/admin` — admin CRUD + analytics endpoints (restricted)
- `/api/v1/upload` — authenticated image upload
- `/api/v1/discounts` — discount rules + coupon validation

## Cookies, CORS, and Auth Notes
- The server uses `cors({ credentials: true })` and expects the frontend to send requests with `withCredentials: true`.
- In production (`NODE_MODE=PROD`), cookies are configured to be `secure` and `sameSite=None`.
- Make sure `CLIENT_URL` matches your deployed client origin, otherwise the browser will block cookies.

## Deploying the Server to Netlify (Functions)
This repository includes [netlify.toml](./netlify.toml) and a function entrypoint at [functions/api.js](./functions/api.js).

Netlify site settings (recommended):
- Base directory: `server`
- Functions directory: `functions`
- The redirect in `netlify.toml` routes `/*` to `/.netlify/functions/api/:splat` so you can call endpoints as:
  - `https://YOUR-SERVER.netlify.app/api/v1/health`
  - `https://YOUR-SERVER.netlify.app/api/v1/products`

Set these environment variables in Netlify:
- `DB_URL`, `DB_PASSWORD`
- `JWT_ACCESS_SECRET`, `JWT_REFRESH_SECRET`, `JWT_ACCESS_EXPIRES`, `JWT_REFRESH_EXPIRES`
- `JWT_ACCESS_COOKIE_EXPIRES`, `JWT_REFRESH_COOKIE_EXPIRES`
- `CLIENT_URL` (your Netlify client site URL)
- `NODE_MODE=PROD`, `NODE_ENV=production`
- Optional: Redis / Cloudinary / Email variables if you use those features
