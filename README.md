# Sanjpriya — Heritage Moderne 🌸

A full-stack women's ethnic fashion e-commerce platform built with **Next.js 14**, featuring the **Heritage Moderne** design system. Categories: **Kurtis**, **Blouses**, **Dresses**.

---

## ✨ Features

- **Homepage** — Parallax hero carousel, category grid, featured products, testimonials, stats, newsletter
- **Collection Pages** — Kurtis / Blouses / Dresses with filter sidebar (size, price range) and sort controls
- **Product Detail** — Image gallery, size & colour selectors, add-to-cart, related products, tabs
- **Cart** — Persistent cart (localStorage), dynamic free-shipping threshold, quantity controls
- **Checkout** — Floating-label form, payment method selection, order placement
- **Order Success** — Confirmation with order number
- **Search** — Full-text search across name & description
- **Admin Panel** (`/admin`) — Dashboard stats, product CRUD, order management with inline status updates
- **Custom 404** — On-brand page not found

---

## 🏗 Tech Stack

| Layer | Tech |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Language | TypeScript |
| Styling | Vanilla CSS (Heritage Moderne design system) |
| Database | SQLite via `better-sqlite3` (file-based, zero config) |
| Fonts | Google Fonts — Playfair Display + Barlow Condensed |
| Images | Unsplash (free, no auth needed) |

---

## 🚀 Getting Started

### Development

```bash
cd sanjpriya-app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

The database is **auto-created and seeded** on first request — no manual setup needed.

### Production Build

```bash
npm run build
npm start
```

---

## 📁 Project Structure

```
sanjpriya-app/
├── app/
│   ├── page.tsx              # Homepage
│   ├── globals.css           # Full Heritage Moderne design system
│   ├── layout.tsx            # Root layout
│   ├── not-found.tsx         # Custom 404
│   ├── kurtis/page.tsx       # Kurtis collection
│   ├── blouses/page.tsx      # Blouses collection
│   ├── dresses/page.tsx      # Dresses collection
│   ├── product/[slug]/       # Product detail
│   ├── cart/page.tsx         # Shopping cart
│   ├── checkout/page.tsx     # Checkout form
│   ├── order-success/        # Confirmation page
│   ├── search/page.tsx       # Search results
│   ├── admin/                # Admin panel
│   │   ├── page.tsx          # Dashboard
│   │   ├── products/         # Product management
│   │   └── orders/           # Order management
│   └── api/
│       ├── products/         # GET (list), POST (create)
│       ├── products/[slug]/  # GET, PUT, DELETE
│       ├── orders/           # GET, POST, PATCH
│       └── newsletter/       # POST
├── components/
│   ├── Navbar.tsx            # Glassmorphism navbar
│   ├── Footer.tsx            # Dark footer with gold accents
│   ├── ProductCard.tsx       # Card with Quick Add hover
│   ├── CollectionPage.tsx    # Reusable collection + filters
│   ├── CartProvider.tsx      # Cart context (localStorage)
│   └── ToastProvider.tsx     # Notification system
├── lib/
│   ├── db.ts                 # SQLite connection + schema
│   ├── seed.ts               # 30 products (10 per category)
│   └── types.ts              # TypeScript interfaces
└── data/
    └── sanjpriya.db          # Auto-generated SQLite database
```

---

## 🎨 Design System

**Heritage Moderne** — Contemporary Luxury with Ethnic Accents

| Token | Value |
|---|---|
| Primary (Magenta) | `#E5097F` |
| Heritage Gold | `#C5A059` |
| Surface | `#FFF8F6` |
| Dark Surface | `#3B2D2B` |
| Display Font | Playfair Display |
| Body Font | Barlow Condensed |

---

## 🛒 Admin Panel

Navigate to `/admin` — no authentication required in development.

| Feature | Description |
|---|---|
| Dashboard | Total products, orders, revenue |
| Products | List all, filter by category, delete |
| Add Product | Full form with fabric, care, images, badge |
| Orders | View all, update status (Pending → Delivered) |

---

## 📦 Deployment (Vercel)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

> **Note:** SQLite is file-based. For production at scale, migrate to PostgreSQL using Prisma. For small/medium traffic, SQLite works perfectly on Vercel with the filesystem volume addon.

---

## 🌸 Products Seeded

- **10 Kurtis** — Anarkali, Block Print, Chikankari, Palazzo Set, Mirror Work, Floral, Bandhani, Kaftan, Ikat, Zari
- **10 Blouses** — Kanjeevaram Silk, Backless Embroidered, Mirror Work, Chikankari, Brocade, Off-Shoulder, Patola, Bandhej, Zardozi, Crop
- **10 Dresses** — Anarkali Gown, Sharara Set, Printed Maxi, Lehenga Choli, Kaftan, Salwar Kameez, Patiala, Gown, Indo-Western, Banarasi Silk

---

Built with ♥ for Sanjpriya — *Heritage Moderne*
