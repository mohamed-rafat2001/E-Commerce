# Client Documentation

This directory contains the frontend application for the E-Commerce platform, built using **React** and **Vite**.

## 🚀 Tech Stack

- **Framework:** React (Vite)
- **State Management:** Redux Toolkit (RTK) & React Query (TanStack Query)
- **Styling:** Tailwind CSS & Framer Motion
- **Routing:** React Router DOM
- **HTTP Client:** Axios
- **Icons:** React Icons + FontAwesome

## Complete Project Structure

The following tree represents the complete file organization of the client application.

```
client/
├── public/                 # Static assets served directly
│   └── vite.svg
│
├── src/
│   ├── app/                # Application initialization and global configuration
│   │   ├── api/
│   │   │   └── mainApi.js          # Axios instance with interceptors
│   │   ├── routes/
│   │   │   ├── ProtectedRoute.jsx  # Route guard component
│   │   │   └── router.jsx          # Main routing configuration
│   │   └── store/
│   │       ├── slices/
│   │       │   ├── cartSlice.js    # Redux slice for cart state
│   │       │   └── wishList.js     # Redux slice for wishlist state
│   │       └── store.js            # Redux store configuration
│   │
│   ├── assets/             # Global static assets (imported in code)
│   │   └── react.svg
│   │
│   ├── features/           # Domain-specific business logic (Feature-Sliced Design)
│   │   ├── admin/          # Admin feature
│   │   │   ├── components/ # Admin-specific UI components
│   │   │   ├── hooks/      # Admin-specific hooks
│   │   │   ├── pages/      # Admin dashboard pages
│   │   │   └── services/   # Admin API services
│   │   │
│   │   ├── auth/           # Authentication feature
│   │   │   ├── components/
│   │   │   │   ├── AuthBanner.jsx
│   │   │   │   ├── LoginForm.jsx
│   │   │   │   ├── RegisterStepOne.jsx
│   │   │   │   ├── RegisterStepTwo.jsx
│   │   │   │   ├── RegisterStepThreeCustomer.jsx
│   │   │   │   ├── RegisterStepThreeSeller.jsx
│   │   │   │   └── SocialLogin.jsx
│   │   │   ├── hooks/
│   │   │   │   ├── useLogin.jsx
│   │   │   │   ├── useLogout.jsx
│   │   │   │   ├── useRegister.jsx
│   │   │   │   ├── useForgotPassword.jsx
│   │   │   │   └── useResetPassword.jsx
│   │   │   ├── pages/
│   │   │   │   ├── LoginPage.jsx
│   │   │   │   ├── RegisterPage.jsx
│   │   │   │   └── index.js
│   │   │   └── services/
│   │   │       └── auth.js
│   │   │
│   │   ├── cart/           # Cart feature (UI & Logic)
│   │   ├── customer/       # Customer dashboard & profile
│   │   ├── home/           # Homepage components
│   │   ├── order/          # Order management
│   │   ├── product/        # Product catalog & details
│   │   ├── public/         # Publicly accessible pages
│   │   ├── seller/         # Seller dashboard & tools
│   │   ├── settings/       # App settings
│   │   ├── user/           # User account management
│   │   └── wishList/       # Wishlist feature
│   │
│   ├── shared/             # Reusable code (Domain-agnostic)
│   │   ├── constants/
│   │   │   ├── icons.jsx           # Centralized icon imports
│   │   │   ├── theme.js            # Theme constants (colors, gradients)
│   │   │   └── index.js
│   │   ├── hooks/
│   │   │   ├── useMutationFactory.jsx  # Generic mutation hook
│   │   │   └── useToast.js             # Toast notification hook
│   │   ├── pages/
│   │   │   ├── PlaceholderPage.jsx     # Generic placeholder for empty routes
│   │   │   └── index.js
│   │   ├── services/
│   │   │   ├── handlerFactory.js       # API response handler utility
│   │   │   └── uploadService.js        # File upload service
│   │   ├── ui/             # Atomic UI Components
│   │   │   ├── Avatar/     # Avatar component
│   │   │   ├── Badge/      # Status badge component
│   │   │   ├── Button/     # Reusable button component
│   │   │   ├── Card/       # Card container component
│   │   │   ├── Dropdown/   # Dropdown menu component
│   │   │   ├── Input/      # Form input component
│   │   │   ├── Modal/      # Modal dialog component
│   │   │   ├── Select/     # Select dropdown component
│   │   │   ├── Spinner/    # Loading spinner component
│   │   │   ├── Textarea/   # Textarea input component
│   │   │   ├── LoadingSpinner.jsx
│   │   │   ├── PageNotFound.jsx
│   │   │   ├── ToastError.jsx
│   │   │   ├── ToastSuccess.jsx
│   │   │   └── index.js
│   │   ├── utils/
│   │   │   └── queryClient.js          # React Query client instance
│   │   └── widgets/        # Complex UI Widgets
│   │       ├── Header/
│   │       │   ├── Header.jsx
│   │       │   ├── CartDropdown.jsx
│   │       │   └── WishlistDropdown.jsx
│   │       ├── Sidebar/
│   │       │   └── Sidebar.jsx
│   │       └── index.js
│   │
│   ├── App.jsx             # Root Component
│   ├── main.jsx            # Entry Point
│   └── index.css           # Global Styles (Tailwind)
│
├── .env                    # Environment variables
├── .gitignore              # Git ignore file
├── eslint.config.js        # ESLint configuration
├── index.html              # HTML entry point
├── package.json            # Dependencies and scripts
├── package-lock.json       # Dependency lock file
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
└── vite.config.js          # Vite configuration
```

## 🏗️ Architecture & File Responsibilities

The project follows a layered architecture to separate concerns and improve maintainability.

### 1. App Layer (`src/app`)
This layer initializes the application and ties everything together.
- **`api/mainApi.js`**: Configures the global Axios instance with base URLs and interceptors for handling authentication tokens and errors.
- **`routes/router.jsx`**: Defines the application's routing structure using `react-router-dom`. It maps paths to components and wraps protected routes with `ProtectedRoute.jsx`.
- **`store/store.js`**: Sets up the Redux store, combining reducers from different slices.

### 2. Features Layer (`src/features`)
Each folder in `features/` represents a distinct business domain.
- **Example: `features/auth/`**
  - **`components/`**: UI specific to auth (e.g., login forms).
  - **`hooks/`**: Custom hooks encapsulating auth logic (e.g., `useLogin` handles the API call and state).
  - **`pages/`**: The actual page components rendered by the router (e.g., `LoginPage`).
  - **`services/`**: API functions that interact with the backend auth endpoints.

### 3. Shared Layer (`src/shared`)
Code that is used across multiple features lives here.
- **`ui/`**: Contains "dumb" components (Buttons, Inputs) that only handle UI rendering and events, with no business logic.
- **`widgets/`**: Contains "smart" components (Header, Sidebar) that might interact with global state (Redux) or navigation.
- **`hooks/`**: Generic hooks like `useToast` for showing notifications or `useMutationFactory` for standardizing API mutations.

### 4. State Management
- **Redux (`src/app/store`)**: Manages synchronous global client state (e.g., is the cart open? is the user logged in?).
- **React Query (`src/shared/utils/queryClient.js`)**: Manages asynchronous server state (caching API responses, handling loading/error states).

## 🔑 Key Features

### 1. Multi-Role Dashboards
The application dynamically adjusts its UI based on the logged-in user's role:
- **SuperAdmin**: Full system control, analytics, and user management.
- **Seller**: Product management, order processing, and sales tracking.
- **Customer**: Shopping experience, order history, and profile management.

### 2. Advanced Shopping Experience
- **Dynamic Cart**: Real-time updates and management.
- **Wishlist**: Save favorite items.
- **Product Discovery**: Filtering, searching, and detailed product views.

### 3. Secure Authentication
- JWT-based authentication with `httpOnly` cookies.
- Secure login, registration, and password reset flows.

## Scripts
From `client/`:

```bash
npm run dev       # Start Vite dev server
npm run build     # Production build
npm run preview   # Preview production build locally
npm run lint      # ESLint
npm run test:flows
npm run test:forms-security
```

## 📦 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
Create a `.env` file in the root of the `client/` directory:
```env
VITE_API_URL=http://localhost:4000/api/v1/
```

### 3. Run Development Server
```bash
npm run dev
```

## Deployment (Netlify)
This repository includes [netlify.toml](./netlify.toml) for SPA routing.

Recommended Netlify settings:
- Base directory: `client`
- Build command: `npm run build`
- Publish directory: `dist`
- Environment variables:
  - `VITE_API_URL` = `https://YOUR-SERVER.netlify.app/api/v1/`

Build note:
- `vite.config.js` uses `minify: "terser"`, so `terser` must be installed (this repo includes it as a dev dependency).
