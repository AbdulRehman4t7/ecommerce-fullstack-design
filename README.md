# ecommerce-fullstack-design

Alibaba/AliExpress-style B2B ecommerce web application built with Next.js 14 (App Router), TypeScript, Tailwind CSS, and Supabase.

## Week 2 — Backend integration

- **Supabase** PostgreSQL database (`products`, `categories`, `cart_items`)
- **REST API routes** under `app/api/`
- **Server Components** fetch data via API (no `useEffect` for page data)
- **Live search** in navbar with debounced `/api/search`
- **URL-based filters** on product listing (`?category=`, `?search=`, `?sort=`, `?page=`)
- **Loading skeletons** and **error boundaries**
- **Fallback** to local mock data when Supabase env vars are not set

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Supabase

1. Create a project at [supabase.com](https://supabase.com)
2. Open **SQL Editor** and run the full script: `supabase-schema.sql`
3. Copy **Project URL** and **anon key** (and **service role key** for POST/PUT/DELETE)

### 3. Environment variables

Create `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
```

See `.env.example` for the template.

### 4. Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Without Supabase credentials, the app still runs using fallback mock data from `data/mockData.ts`.

## API endpoints

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/products` | List with filters, sort, pagination |
| POST | `/api/products` | Create product |
| GET | `/api/products/[id]` | Single product + related (UUID or slug) |
| PUT | `/api/products/[id]` | Update product |
| DELETE | `/api/products/[id]` | Delete product |
| GET | `/api/categories` | Categories with product counts |
| GET | `/api/search?q=` | Full-text search |
| GET/POST | `/api/cart` | Optional session cart sync |

## Scripts

- `npm run dev` — Development server
- `npm run build` — Production build
- `npm run start` — Production server
- `npm run lint` — ESLint
