# E-Commerce Platform

A robust and scalable E-Commerce application built with the MERN stack (MongoDB, Express, React, Node.js). This project features a comprehensive backend API and a modern frontend user interface, supporting multiple user roles including Customers, Sellers, and Admins.

## 🚀 Tech Stack

### Client
- **Framework:** React (Vite)
- **State Management:** Redux Toolkit
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **HTTP Client:** Axios (or similar)

### Server
- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens) & Cookies
- **Security:** Helmet, Rate Limiting, Mongo Sanitize, HPP

## 🛠️ Project Structure

The project is organized as a monorepo-style structure:

- **`/client`**: The React frontend application.
- **`/server`**: The Node.js/Express backend API.

## 📦 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (Local or Atlas connection string)

### 1. Clone the Repository
```bash
git clone <repository-url>
cd E-Commerce
```

### 2. Install Dependencies
Install dependencies for both the root (if any), server, and client.

**Root & Server:**
```bash
npm install
```

**Client:**
```bash
cd client
npm install
cd ..
```

### 3. Environment Variables
Create a `.env` file in the **`server/`** directory with the following variables:

```env
PORT=4000
DATABASE_URL=mongodb://localhost:27017/ecommerce  # Or your Atlas URL
JWT_SECRET=your_super_secret_key_change_this
JWT_EXPIRES_IN=30d
COOKIE_EXPIRES_IN=30
NODE_ENV=development
```

### 4. Running the Application

You can run both the client and server concurrently from the root directory:

```bash
# Runs both Client and Server
npm run dev
```

Or run them individually:

```bash
# Server only
npm run server

# Client only
npm run client
```

## 🔑 Key Features
- **User Authentication:** Secure login/register flow with JWT and HttpOnly cookies.
- **Role-Based Access Control:** Separate portals/permissions for Customers, Sellers, and Admins.
- **Product Management:** Create, read, update, delete products with image support.
- **Order System:** Unified order lifecycle management (Processing, Shipped, Delivered, Cancelled) with Snapshot tracking via `OrderItems`.
- **Dynamic Admin Dashboard:** Centralized SuperAdmin control panel for managing all system models with field-level security.
- **Shopping Cart & Wishlist:** Persistent cart and wishlist management with real-time price aggregation.
- **Reviews:** Product review and rating system with automatic average calculation.

## 📄 Documentation

- **[Server Documentation](./server/README.md):** Detailed API endpoints, user flow diagrams, and backend architecture.
- **[Client Documentation](./client/README.md):** Frontend project structure, role-based UI components, and state management details.
