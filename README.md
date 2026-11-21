# WedPlan — Wedding Planning Platform (Client)

**WedPlan** is a role-based wedding planning platform. Couples discover wedding services and send booking requests. Vendors publish services, manage requests and can upgrade to Premium through Stripe. Admins moderate users, services and payments.

- **Live website:** _coming soon_
- **Client repository:** https://github.com/FahimF22/wedplan-client
- **Server repository:** https://github.com/FahimF22/wedplan-server

## Important features

**Everyone**
- Home page with an animated banner, **Featured Services** (approved and active only, Premium partners first), six **categories** with live counts, **Why Choose WedPlan**, **How WedPlan Works** and **Testimonials**. Animations use Motion and respect *reduced motion*.
- **Browse Services**: advanced search, category and location filters, **price sort (asc/desc)**, pagination, and a URL-synced filter bar. Includes skeleton loading and empty states.
- Responsive Navbar that updates instantly on sign-in and sign-out, with a profile dropdown (name and photo, Dashboard, Profile Settings, Logout), and a full footer.

**Authentication (Better Auth)**
- Email/password sign-up (password needs 6+ characters, one uppercase and one lowercase letter), **Google sign-in**, optional profile photo upload (ImgBB), and Vendor/Customer role selection.
- New Google users choose their role once on an onboarding screen.
- **Admin accounts cannot be created through registration.** A database hook rejects any role other than vendor or customer.
- Role-based redirect after login. Private routes survive refresh, and sessions persist.
- Protected routes at two layers: a `proxy.ts` session check, plus server-side role guards in each dashboard layout. A user who edits the URL to reach another role's dashboard is redirected. Blocked users are signed out and can't sign in again.
- The Express API is called with a **short-lived JWT** (15 min, EdDSA) issued by Better Auth's JWT plugin. It is kept in memory only and refreshed automatically.

**Customer dashboard**: overview stats and upcoming events, plus My Bookings (status filter, details dialog, cancel *pending* requests).

**Vendor dashboard**: overview stats, My Services (approval status, availability toggle, edit, delete), Add/Edit Service with up to **6 images uploaded to ImgBB**, Booking Requests (accept/reject once), and **Subscription**: Free vs Premium ($29/month) via **Stripe Checkout**, payment history, and cancel/resume.

**Admin dashboard**: platform stats and verified revenue, Manage Users (search, role/status filter, details, block/unblock), Manage Services (review, approve, reject, move back to pending, activate/deactivate, delete), and **read-only** Transactions.

**Payments**: Payment Success page shows *"Verifying your Stripe payment…"* and polls the API until the **verified webhook** has activated Premium. Visiting the URL without paying grants nothing. There is also a Payment Cancel page.

**UX**: toast notifications for every action (no `alert()`), confirmation dialogs, loading states for data, forms, bookings and payments, error boundaries, a custom 404, and fully responsive layouts (mobile sidebar sheet, tables become cards).

## Technology stack

Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS 4 · shadcn/ui (Radix) · Motion · Better Auth (MongoDB adapter, JWT plugin, Google OAuth) · react-hook-form + zod · sonner · Stripe Checkout · ImgBB · Express API · MongoDB · Vercel

## Installation

```bash
git clone https://github.com/FahimF22/wedplan-client.git
cd wedplan-client
npm install
cp .env.example .env.local   # then fill in the values
```

### Environment variables

| Name | Description |
|---|---|
| `BETTER_AUTH_SECRET` | Random secret (`openssl rand -base64 32`) |
| `BETTER_AUTH_URL` | Public URL of this app (e.g. `http://localhost:3000`) |
| `MONGODB_URI` | MongoDB connection string (same database as the server) |
| `DB_NAME` | Database name (default `wedplan`) |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth credentials. Redirect URI: `<BETTER_AUTH_URL>/api/auth/callback/google` |
| `NEXT_PUBLIC_API_URL` | URL of the Express API |
| `NEXT_PUBLIC_APP_URL` | Public URL of this app |

Secrets (Stripe, ImgBB) live only on the server.

## Run locally

1. Start the API (`wedplan-server`) on `http://localhost:5000`.
2. Start the client:

```bash
npm run dev     # http://localhost:3000
```

3. Optionally seed demo data from the server repo with `npm run seed`.

## Build

```bash
npm run build && npm start
```

## Testing payments

Use Stripe test card **4242 4242 4242 4242**, any future expiry date, any CVC and any ZIP code.
