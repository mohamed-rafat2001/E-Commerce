# Feature-Based Architecture Refactor Prompt
# Client Folder — Full Codebase Refactor

---

## Your Role
You are a senior React architect. The client folder already has a feature-based sliced architecture. Your job is to **scan the entire client folder**, find every component that is doing too much, and **refactor it** into small focused pieces — small hooks for logic, small components for UI, and organize everything cleanly inside each feature's own `components/`, `hooks/`, `services/`, and `pages/` folders.

> ⚠️ Do NOT decide any folder paths yourself.
> Do NOT assume where files should go.
> **Scan the project first**, understand the existing structure, then place every refactored file exactly where it belongs inside the already-existing feature folders.

---

## ⚠️ STEP 0 — Scan Before You Touch Anything

Before writing a single line of code, do all of the following:

1. **Scan the entire `client` folder** — map out every feature folder, every file, and every folder inside each feature
2. **Read every component file** — identify which ones are doing too much (logic + UI + API calls mixed together)
3. **Build a full refactor plan** — list every file that needs refactoring, what will be extracted from it, and where each extracted piece will go
4. **Show the developer the full plan** and wait for confirmation before making any changes
5. Only after confirmation — start refactoring one feature at a time

---

## PART 1 — What to Look For (Problems to Identify)

When scanning each component, flag it for refactoring if it has ANY of the following:

### Logic mixed into JSX
- `useState`, `useEffect`, `useCallback`, `useMemo` defined directly inside a component file that also returns JSX
- API calls (`axios.get`, `fetch`) written directly inside a component
- Data transformation logic (filtering, sorting, mapping) written inline inside JSX or directly in the component body
- Form validation logic written directly in the component

### Component doing too much
- A single component file that handles more than one responsibility (e.g. fetches data AND renders a table AND handles a modal AND manages form state)
- A component file longer than 80 lines
- A component that renders multiple distinct UI sections that could each be their own component
- Props being drilled more than 2 levels deep

### Missing separation
- A feature folder that has no `hooks/` subfolder but the components have logic inside them
- A feature folder that has no `services/` subfolder but components are calling APIs directly
- A page-level component that contains UI layout details instead of just composing smaller components

---

## PART 2 — Refactor Rules (Apply to Every Feature)

### Rule 1 — Every feature must have exactly these 4 subfolders
After refactoring, every feature folder must contain:
- `components/` — UI only, no logic, no API calls
- `hooks/`      — all logic, state, effects, and data manipulation
- `services/`   — all API calls, nothing else
- `pages/`      — page-level files that compose components together, no inline logic

If any of these subfolders already exist in the feature folder — use them.
If any are missing — create them inside the correct existing feature folder.

---

### Rule 2 — Components must be pure UI
A component file after refactoring must:
- Only receive data and callbacks via props
- Only return JSX
- Contain zero `useState`, `useEffect`, `useReducer`, or any hook that manages logic
- Contain zero API calls
- Be under 80 lines — if longer, split into smaller sub-components

If a component currently has logic inside it — extract every piece of logic into a custom hook in the same feature's `hooks/` folder.

---

### Rule 3 — Hooks own all logic
A custom hook after refactoring must:
- Be named with `use` prefix always
- Own all `useState`, `useEffect`, `useCallback`, `useMemo` for its feature area
- Call the service functions from the feature's `services/` folder — never call axios/fetch directly
- Return only what the component needs: `{ data, isLoading, error, handlers }`
- Never return JSX — never render anything

**Naming pattern for hooks:**
- Data fetching:    `useFeatureNameData` (e.g. `useProductList`, `useOrderDetails`)
- Form logic:       `useFeatureNameForm` (e.g. `useAddProductForm`, `useCheckoutForm`)
- UI state:         `useFeatureNameState` (e.g. `useProductFilters`, `useCartState`)
- Actions/mutations:`useFeatureNameActions` (e.g. `useOrderActions`, `useProductActions`)

---

### Rule 4 — Services own all API calls
A service file after refactoring must:
- Contain only functions that make API calls (axios/fetch)
- Accept parameters, call the API, return the response or throw an error
- Contain zero React code — no hooks, no state, no JSX
- Be named after the feature: `productService.js`, `orderService.js`, `authService.js`

**Example structure of a service function:**
```javascript
// Get all products
export const fetchProducts = async (filters) => {
  const response = await axios.get('/api/products', { params: filters })
  return response.data
}

// Create a product
export const createProduct = async (productData) => {
  const response = await axios.post('/api/products', productData)
  return response.data
}
```

---

### Rule 5 — Pages only compose
A page file after refactoring must:
- Import and compose section/feature components
- Use one or two top-level hooks to get page-level data if needed
- Contain zero inline logic, zero API calls, zero complex JSX
- Be the single entry point for a route

---

### Rule 6 — Split large components into sub-components
When a component is over 80 lines or renders multiple distinct UI sections:
- Each distinct UI section becomes its own component file inside the same feature's `components/` folder
- The parent component only imports and composes the sub-components
- Sub-components receive exactly the data they need via props — no over-passing

**Example: a `ProductCard` that is 150 lines gets split into:**
- `ProductCardImage` — image + badges
- `ProductCardInfo` — name, rating, price
- `ProductCardActions` — add to cart, wishlist buttons
- `ProductCard` — composes the three above

---

## PART 3 — Refactor Process (Feature by Feature)

For every feature folder found during the scan, follow this exact process:

### Step 1 — Read every file in the feature folder
Understand what each file currently does — what state it manages, what APIs it calls, what UI it renders.

### Step 2 — Identify what to extract
For each component file:
- List every piece of logic to move into a hook
- List every API call to move into a service
- List every UI section large enough to become its own sub-component

### Step 3 — Create the service file first
Move all API calls out of hooks and components into the feature's `services/` file.

### Step 4 — Create the hooks
Create one hook per responsibility. Each hook imports from the service file.
Hook returns `{ data, isLoading, error }` plus any action handlers.

### Step 5 — Refactor the components
Remove all logic from components. Replace with calls to the new hooks.
Split large components into sub-components.

### Step 6 — Clean up the page file
Make sure the page file only composes components and calls at most one or two hooks.

### Step 7 — Verify
- Every component file is under 80 lines
- Zero API calls inside any component or hook directly (all go through services)
- Zero logic inside any component (all logic in hooks)
- Every hook starts with `use`
- Every service function is a plain async function

---

## PART 4 — Naming Conventions

Follow these naming rules consistently across every feature:

| File type | Naming pattern | Example |
|-----------|----------------|---------|
| Component | PascalCase | `ProductCard.jsx`, `OrderTable.jsx` |
| Sub-component | ParentNamePart | `ProductCardImage.jsx`, `OrderTableRow.jsx` |
| Hook | camelCase with `use` prefix | `useProductList.js`, `useOrderActions.js` |
| Service | camelCase with `Service` suffix | `productService.js`, `orderService.js` |
| Page | PascalCase with `Page` suffix | `ProductsPage.jsx`, `OrderDetailsPage.jsx` |
| Index file | `index.js` | Re-exports from the folder |

---

## PART 5 — Index Files

Every `components/`, `hooks/`, and `services/` folder must have an `index.js` that re-exports everything inside it.

This allows clean imports from other parts of the app:
```javascript
// Instead of:
import ProductCard from '../../features/products/components/ProductCard'

// You can write:
import { ProductCard } from '../../features/products/components'
```

---

## PART 6 — What NOT to Do

- ❌ Do NOT decide folder paths yourself — scan the project and follow what already exists
- ❌ Do NOT move files between feature folders — refactoring happens within each feature
- ❌ Do NOT merge two features into one folder
- ❌ Do NOT put logic inside a component — even one `useState` should be in a hook
- ❌ Do NOT put API calls inside a hook directly — hooks call service functions only
- ❌ Do NOT create a hook that renders JSX
- ❌ Do NOT create a component over 80 lines without splitting it
- ❌ Do NOT change any business logic, API endpoints, or data flow — only restructure where code lives
- ❌ Do NOT rename existing working variables or functions — only move them to the right file
- ❌ Do NOT refactor multiple features at the same time — one feature at a time, in order

---

## PART 7 — Refactor Order Priority

After scanning, refactor features in this priority order:

1. **Highest priority first** — the features with the largest component files (most lines of code)
2. **Then** — features where API calls are directly inside components (most urgent architecture violation)
3. **Then** — features where one component is doing 3+ responsibilities
4. **Last** — features that only need minor splits (components slightly over 80 lines)

---

## PART 8 — Deliverables

> ⚠️ Do NOT start delivering code until the full refactor plan has been shown to and confirmed by the developer.

For each feature, deliver in this order:
1. Service file (API calls extracted)
2. Hook files (logic extracted)
3. Sub-components (large components split)
4. Refactored parent components (now pure UI)
5. Refactored page file (now pure composition)
6. `index.js` files for `components/`, `hooks/`, `services/`

After every feature is done, show a summary:
- How many files were created
- How many files were modified
- What was extracted from each original file
- Confirm the feature folder now has all 4 subfolders: `components/`, `hooks/`, `services/`, `pages/`

---

## Final Checklist (Verify Before Calling It Done)

For every feature folder:
- [ ] Has `components/`, `hooks/`, `services/`, `pages/` subfolders
- [ ] Every component file is under 80 lines
- [ ] Zero `useState` or `useEffect` inside any component file
- [ ] Zero API calls (`axios`, `fetch`) inside any component or hook directly
- [ ] Every hook is named with `use` prefix
- [ ] Every service is a plain async function file
- [ ] Every page only composes components
- [ ] Every folder has an `index.js` re-exporting its contents
- [ ] No business logic was changed — only restructured
