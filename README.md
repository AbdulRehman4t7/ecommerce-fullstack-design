# ShopZone — B2B eCommerce (Alibaba-Style)

A full-stack B2B marketplace web app inspired by **Alibaba / AliExpress**: product discovery, cart, search, filters, user accounts, admin CRUD, and Supabase backend. Built as a **3-week coursework project** (frontend → backend → auth & admin).

**Live stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase (PostgreSQL + Auth) · Vercel-ready deployment

---

## Table of contents

- [Project overview](#project-overview)
- [Tech stack](#tech-stack)
- [Week 1 — Frontend](#week-1--frontend-ui--static-experience)
- [Week 2 — Backend & APIs](#week-2--backend--apis)
- [Week 3 — Auth, Cart, Admin & Deploy](#week-3--auth-cart-admin--deploy)
- [Project structure](#project-structure)
- [Getting started](#getting-started)
- [Admin access](#admin-access)
- [Authentication notes](#authentication-notes)
- [API reference](#api-reference)
- [Deploy on Vercel](#deploy-on-vercel)
- [Scripts](#scripts)

---

## Project overview

**ShopZone** is a dense, trade-focused storefront where buyers browse categories, search products, view detail pages, manage a cart, and (when logged in) sync cart data to the cloud. Admins manage products and categories from a separate dashboard.

| Area | Description |
|------|-------------|
| **Design** | Blue primary (`#0D6EFD`), orange accents, green success — Inter font, compact Alibaba-like layout |
| **Data** | 24 products across Electronics, Clothes, Home & Garden (Supabase seed) + local `/assets` product images |
| **Users** | Sign up / sign in (email + Google OAuth), profiles, protected routes |
| **Admins** | Role-based access to `/admin` for products, categories, users |

Without Supabase env vars, the app still runs using **fallback mock data** from `data/mockData.ts`.

---

## Tech stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 14.2 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS 3 |
| Icons | lucide-react |
| Database | Supabase PostgreSQL |
| Auth | Supabase Auth (email/password + Google OAuth) |
| Client state | React Context (`AuthContext`, `CartContext`) |
| Deployment | Vercel |

---

## Week 1 — Frontend (UI & static experience)

**Goal:** Alibaba-style UI with mock data — no backend required.

### Pages

| Route | Description |
|-------|-------------|
| `/` | Home — hero, deals, category grids, recommended products, suppliers, newsletter |
| `/products` | Product listing — list/grid toggle, filters, sort, pagination |
| `/products/[id]` | Product detail — gallery, specs, tabs, related products, add to cart |
| `/cart` | Cart — quantity, select items, order summary |

### Layout & components

- **TopBar**, **Navbar** (search, cart count), **SecondNav**, **Footer**
- **Category sidebar** on home (desktop)
- **Product cards**, **deals row**, **promo banners**
- Local images under `public/assets/` (mapped in `lib/productImages.ts`)

### State (Week 1)

- **Cart:** `CartContext` + `localStorage` (`ecommerce-cart`)
- **Products:** Hardcoded in `data/mockData.ts` (24 items with numeric IDs)

### Deliverables (Week 1)

- Responsive product grid (2–4 columns by breakpoint)
- List vs grid view via `?view=list` / `?view=grid`
- Sticky navbar, dense product cards, min-order labels
- UI palette and typography per design spec

---

## Week 2 — Backend & APIs

**Goal:** Replace static catalog with **Supabase** and **REST API routes**; keep Week 1 UI unchanged.

### Database (`supabase-schema.sql`)

| Table | Purpose |
|-------|---------|
| `categories` | 8 categories (electronics, clothes, home-garden, …) |
| `products` | 24 seeded products (UUID ids, slugs, images, specs JSON, tags) |
| `cart_items` | Session-based cart rows (later extended in Week 3) |

Includes indexes, RLS (public read on products/categories), and seed data.

### API routes (`app/api/`)

- `GET/POST /api/products` — list, filter, sort, paginate; create product
- `GET/PUT/DELETE /api/products/[id]` — by UUID or slug + related products
- `GET /api/categories` — categories with product counts
- `GET /api/search?q=` — product search (navbar dropdown)
- `GET/POST /api/cart` — optional session cart sync

### App changes

- Server pages fetch data via `lib/queries/*` (direct Supabase — no HTTP loopback)
- `Product.id` is **string (UUID)**; URLs use **slug** (e.g. `/products/macbook-pro-14-m3`)
- **Live search** in navbar (300ms debounce → `/api/search`)
- **URL filters:** `?category=`, `?search=`, `?sort=`, `?page=`, `?badge=`, price range
- **Loading skeletons** (`loading.tsx`) and **error boundaries** (`error.tsx`)
- **Image fix:** Seed `placehold.co` URLs mapped to local `/assets/` in `lib/productImages.ts` (Next.js Image does not optimize SVG placeholders)

### Deliverables (Week 2)

- Dynamic home, listing, and detail pages from Supabase
- 7 API endpoints functional
- Fallback to mock data when env is missing

---

## Week 3 — Auth, Cart, Admin & Deploy

**Goal:** User accounts, persistent cart, admin panel, responsive polish, production deploy.

### Database (`supabase-week3.sql`)

Run **after** `supabase-schema.sql`:

| Addition | Purpose |
|----------|---------|
| `profiles` | User profile + `role` (`user` \| `admin`) |
| `handle_new_user` trigger | Auto-create profile on signup |
| `cart_items.user_id` | Link cart to logged-in users |
| RLS updates | Users only see their own cart rows |

### Authentication

| Route | Description |
|-------|-------------|
| `/signup` | Full name, email, password, terms, Google OAuth |
| `/login` | Email/password, remember me, forgot password link |
| `/forgot-password` | Reset email via Supabase |
| `/auth/callback` | OAuth redirect handler |

- **`AuthContext`** — `signUp`, `signIn`, `signInWithGoogle`, `signOut`, `isAdmin`
- **Middleware** protects `/profile`, `/orders`, `/admin/*`
- Navbar: **Sign In / Join Free** (guest) vs **avatar dropdown** (logged in)

### Cart upgrade

| User | Storage |
|------|---------|
| Guest | `localStorage` |
| Logged in | Supabase `cart_items` (`user_id`) |
| On login | Guest cart **merged** via `POST /api/cart/merge` |
| Navbar count | Realtime Supabase subscription on `cart_items` |

APIs: `GET/POST/DELETE /api/cart`, `PATCH/DELETE /api/cart/[productId]`, `POST /api/cart/merge`

### Admin panel (`/admin` — admin role only)

| Route | Features |
|-------|----------|
| `/admin` | Dashboard stats, recent products, quick links |
| `/admin/products` | Table, search, filter, add/edit modal, bulk delete |
| `/admin/categories` | CRUD form + table |
| `/admin/users` | User list, **Make Admin** |
| `/admin/orders` | Placeholder |
| `/admin/settings` | Placeholder |

Product/category **POST/PUT/DELETE** require admin session (`lib/auth/session.ts`).

### Responsive (Week 3)

- Mobile **hamburger drawer** (`MobileDrawer.tsx`)
- Full-width mobile search under navbar
- Floating **Filters** button on product listing (mobile)
- Sticky **Add to Cart / Buy Now** bar on product detail (mobile)
- Admin sidebar → overlay on small screens

### Deployment prep

- SEO metadata (`ShopZone` title, Open Graph)
- `next.config.mjs` — image domains, `compress: true`
- `NEXT_PUBLIC_APP_URL` for OAuth and redirects
- Server pages use **direct Supabase queries** (fixes Vercel “Something went wrong” from self-HTTP fetch)

### Deliverables (Week 3)

- [x] Signup / login / forgot password / Google OAuth  
- [x] Protected routes + profile page  
- [x] Cart sync + merge on login  
- [x] Admin CRUD (products, categories, users)  
- [x] Mobile-friendly layout  
- [x] Production build (`npm run build`)

---

## Project structure

```
ecommerce-fullstack-design/
├── app/
│   ├── page.tsx                 # Home
│   ├── products/                # Listing + [id] detail
│   ├── cart/
│   ├── login/ signup/ forgot-password/
│   ├── profile/ orders/
│   ├── admin/                   # Dashboard, products, categories, users
│   ├── auth/callback/           # OAuth
│   └── api/                     # REST routes
├── components/
│   ├── layout/                  # Navbar, Footer, PageShell, MobileDrawer
│   ├── home/                    # Hero, deals, category grid
│   ├── products/                # Listing, detail, filters, search
│   ├── cart/
│   ├── auth/
│   ├── admin/
│   └── shared/
├── context/
│   ├── AuthContext.tsx
│   └── CartContext.tsx
├── lib/
│   ├── supabase/                # client, server, middleware
│   ├── queries/                 # products, categories, fallback
│   ├── mappers/                 # DB row → Product
│   ├── auth/                    # session, requireAdmin
│   └── api/                     # server fetch helpers
├── data/mockData.ts             # Week 1 fallback
├── public/assets/               # Product & UI images
├── supabase-schema.sql          # Week 2 schema + seed
├── supabase-week3.sql           # Week 3 profiles + cart user_id
├── middleware.ts                # Auth session + route protection
└── .env.example
```

---

## Getting started

### 1. Install dependencies

```bash
npm install
```

### 2. Supabase project

1. Create a project at [supabase.com](https://supabase.com)
2. **SQL Editor** → run **`supabase-schema.sql`** (tables + seed)
3. **SQL Editor** → run **`supabase-week3.sql`** (profiles + cart user_id)
4. Copy from **Settings → API**:
   - Project URL (`https://xxxx.supabase.co` — no `/rest/v1/`)
   - `anon` public key
   - `service_role` key (server only — never expose in client code)

### 3. Environment variables

Create `.env.local` (see `.env.example`):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 4. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

---

## Admin access

There is **no separate admin login**. Use the same `/login` as any user.

1. **Sign up** at `/signup` and **confirm email** (if Supabase “Confirm email” is enabled).
2. In Supabase **SQL Editor**, set your user as admin:

```sql
UPDATE profiles
SET role = 'admin'
WHERE email = 'your-email@example.com';
```

3. **Sign out** and **sign in** again.
4. Open **`/admin`** or use **Admin Panel** in the navbar dropdown.

To disable email confirmation during development:  
**Authentication → Providers → Email → turn off “Confirm email”.**

---

## Authentication notes

| Topic | Detail |
|-------|--------|
| Email confirmation | Default ON — users must click the link in email before login works |
| Google OAuth | Enable in Supabase → add redirect: `http://localhost:3000/auth/callback` and your Vercel URL |
| Site URL | Supabase **Auth → URL Configuration** must match `NEXT_PUBLIC_APP_URL` |
| Profiles | Created automatically by trigger when a user signs up |

---

## API reference

### Public

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products` | List (`category`, `search`, `sort`, `page`, `limit`, `badge`, …) |
| GET | `/api/products/[id]` | Single product + related (UUID or slug) |
| GET | `/api/categories` | All categories |
| GET | `/api/search?q=` | Search suggestions |

### Authenticated user

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/cart` | User cart with product details |
| POST | `/api/cart` | Upsert line item |
| DELETE | `/api/cart` | Clear user cart |
| PATCH/DELETE | `/api/cart/[productId]` | Update/remove line |
| POST | `/api/cart/merge` | Merge guest cart after login |

### Admin only

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/products` | Create product |
| PUT/DELETE | `/api/products/[id]` | Update/delete product |
| POST | `/api/categories` | Create category |
| PUT/DELETE | `/api/categories/[id]` | Update/delete category |
| GET | `/api/admin/stats` | Dashboard counts |
| GET | `/api/profiles` | List users |
| PATCH | `/api/profiles/[id]` | e.g. set `role: admin` |

---

## Deploy on Vercel

1. Push repo to GitHub and **Import** on [vercel.com](https://vercel.com).
2. Add **Environment Variables** (same as `.env.local`):
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `NEXT_PUBLIC_APP_URL` → `https://your-app.vercel.app`
3. **Deploy** → wait for build to finish.
4. In **Supabase → Auth → URL Configuration**:
   - **Site URL:** `https://your-app.vercel.app`
   - **Redirect URLs:** `https://your-app.vercel.app/**` and `https://your-app.vercel.app/auth/callback`
5. For **Google OAuth**, add the same callback URL in Google Cloud Console.

If the homepage shows “Something went wrong”, check that all four env vars are set and redeploy.

---

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server (port 3000) |
| `npm run build` | Production build |
| `npm run start` | Run production build locally |
| `npm run lint` | ESLint |

---

## Week summary

| Week | Focus | Status |
|------|--------|--------|
| **Week 1** | Static frontend — 4 pages, Alibaba UI, local cart | ✅ |
| **Week 2** | Supabase + APIs + dynamic catalog + search/filters | ✅ |
| **Week 3** | Auth, cart sync, admin panel, responsive, Vercel | ✅ |

---

## License

Educational / coursework project. Assets and design inspired by B2B marketplace patterns.
