## Deployment (Vercel + Render + Postgres + S3/R2 + Razorpay)

This repo is a monorepo:
- **Web**: `apps/web` (Vite React)
- **API**: `apps/api` (Express)
- **DB**: Render Postgres
- **Uploads**: S3-compatible bucket (Cloudflare R2 / AWS S3 / etc)

---

### 1) Create the Postgres database (Render)

- Create a **Render Postgres** database.
- Copy its **External Database URL** (Render shows it as `postgres://...`).

Set this in the API environment as `DATABASE_URL`.

---

### 2) Deploy the API (Render Web Service)

Create a new **Render Web Service** from this repo.

- **Root directory**: `apps/api`
- **Build command**:

```bash
npm i && npm run build
```

- **Start command**:

```bash
npm run start
```

#### Required API environment variables

- **Database**
  - `DATABASE_URL`: Render Postgres URL

- **Auth (admin)**
  - `JWT_SECRET`: long random string
  - `ADMIN_BOOTSTRAP_EMAIL`: email for admin login
  - `ADMIN_BOOTSTRAP_PASSWORD`: password for admin login

- **S3 / R2 (uploads)**
  - `S3_ENDPOINT`: e.g. Cloudflare R2 endpoint or AWS S3 endpoint
  - `S3_REGION`: `auto` for R2, or AWS region (e.g. `ap-south-1`)
  - `S3_ACCESS_KEY_ID`
  - `S3_SECRET_ACCESS_KEY`
  - `S3_BUCKET`

- **Razorpay**
  - `RAZORPAY_KEY_ID`
  - `RAZORPAY_KEY_SECRET`
  - `RAZORPAY_WEBHOOK_SECRET`

#### Run DB migrations + seed

In Render, add a one-time “Shell” (or run in your CI) with:

```bash
npx prisma migrate deploy
npx prisma db seed
```

The repo includes the initial migration SQL at:
- `apps/api/prisma/migrations/000_init/migration.sql`

---

### 3) Configure your S3/R2 bucket

#### CORS (required for browser uploads)

Allow `PUT` from your Vercel domain (and localhost for dev).

Example CORS rule (conceptually):
- **Allowed origins**: `https://<your-vercel-domain>` and `http://localhost:5173`
- **Allowed methods**: `PUT`, `GET`, `HEAD`
- **Allowed headers**: `Content-Type`

---

### 4) Configure Razorpay webhook

In Razorpay Dashboard:
- Create a webhook pointing to:
  - `https://<your-render-api-domain>/payments/razorpay/webhook`
- Set the same secret in:
  - Razorpay webhook secret
  - `RAZORPAY_WEBHOOK_SECRET` env var in Render

Recommended events:
- `payment.captured`
- `payment.failed`
- `order.paid`

---

### 5) Deploy the frontend (Vercel)

Create a **Vercel** project from this repo.

- **Root directory**: `apps/web`
- **Build command**:

```bash
npm i && npm run build
```

- **Output directory**: `dist`

#### Required Web environment variables

- `VITE_API_URL`: your Render API base URL, e.g. `https://<api>.onrender.com`
- `VITE_WHATSAPP_NUMBER`: e.g. `919999999999`
- `VITE_SHOP_PHONE`: e.g. `+91 63642 18486`
- `VITE_GOOGLE_MAPS_EMBED_URL`: Google maps embed URL for your shop

---

### 6) Admin access

After the web deploy:
- Visit `/admin/login`
- Login using `ADMIN_BOOTSTRAP_EMAIL` + `ADMIN_BOOTSTRAP_PASSWORD`

---

### Notes

- If you use a custom domain, update:
  - `apps/web/public/robots.txt` (sitemap URL)
  - `apps/web/public/sitemap.xml` (site URLs)

