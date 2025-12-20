# Client Documentation

This directory contains the frontend application for the E-Commerce platform, built using **React** and **Vite**.

## 🚀 Tech Stack

- **Framework:** React (Vite)
- **State Management:** Redux Toolkit (RTK)
- **Styling:** Tailwind CSS
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Data Fetching:** React Query (implied by `queryClient.js`)

## 🛠️ Project Structure

The client is organized as follows:

- **`src/RTK/`**: Redux Toolkit setup, including store and slices for global state (Cart, Wishlist).
- **`src/pages/`**: Main page components, categorized by user roles:
  - `adminPannel/`: Dashboard and tools for SuperAdmins.
  - `sellerPannel/`: Product and shop management for Sellers.
  - `customerPannel/`: Order history, addresses, and settings for Customers.
  - `employeePannel/`: Specific dashboards for staff members.
- **`src/ui/`**: Reusable UI components:
  - `sideBar/`: Role-based navigation sidebars.
  - `AppLayout.jsx`: The main layout wrapper for the application.
  - `MainNavbar.jsx`: Global top navigation.
- **`src/features/`**: Modular feature logic (e.g., user profile management).
- **`src/hooks/`**: Custom React hooks for shared logic (e.g., `useAuth`).
- **`src/api/`**: API service configurations and interceptors.

## 🔑 Key Features

### 1. Multi-Role Dashboards

The application dynamically adjusts its UI based on the logged-in user's role:

- **SuperAdmin**: Full system control via the Dynamic Admin Dashboard.
- **Seller**: Manage inventory and track sales.
- **Customer**: Shop, manage wishlist, and track orders.
- **Employee**: Specialized access for logistics or support.

### 2. Advanced Shopping Experience

- **Dynamic Cart**: Real-time price calculations and quantity updates.
- **Wishlist**: Save favorite items for later.
- **Product Discovery**: Browse products with pagination, filtering, and detailed views.

### 3. Secure Authentication

- Persistent login using JWT stored in `httpOnly` cookies.
- Role-based route protection via the `ProtectedRoute` component.

### 4. User Profile Management

- Update personal details and profile images.
- Manage multiple shipping addresses and payment methods.

## 📦 Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Environment Setup

Create a `.env` file in the root of the `client/` directory and add the backend API URL:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

### 3. Run Development Server

```bash
npm run dev
```

## 🏗️ Architecture & Best Practices

- **Component-Based UI**: High reusability using functional components.
- **State Separation**: UI state in local components, global state in Redux.
- **Protected Routing**: Centralized routing logic in `appRouting.jsx` with role-based restrictions.
- **Responsive Design**: Mobile-first approach using Tailwind CSS.
