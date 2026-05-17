# ecommerce-fullstack-design

Alibaba/AliExpress-style B2B ecommerce web application built with Next.js 14 (App Router), TypeScript, and Tailwind CSS.

## Features

- **Home** — Category sidebar, hero banner, deals countdown, promo grids, quote request, recommended items, extra services, suppliers by region, newsletter
- **Product listing** — List/grid toggle (`?view=list` | `?view=grid`), filters sidebar, pagination
- **Product detail** — Image gallery, variants, tabs (description, reviews, shipping, seller), related products
- **Cart** — Select items, quantity controls, order summary, localStorage persistence

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript (strict)
- Tailwind CSS
- lucide-react icons
- React Context API for cart state

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

- `npm run dev` — Start development server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint

## Project Structure

```
app/                 # Pages (home, products, cart)
components/          # UI components by feature
context/             # CartContext
data/mockData.ts     # 24 mock products & categories
types/               # TypeScript interfaces
```
