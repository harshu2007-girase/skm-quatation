# Shree Kali Manufacturers Sales OS

Production-oriented Next.js sales, CRM, quotation, order, and document system for Shree Kali Manufacturers.

## Included

- Role-aware login for Admin, Sales, and Owner access models
- Customer master with search and document history
- Product and accessory masters with controlled pricing and asset upload
- Smart quotation studio with fixed company, bank, GST, warranty, and terms data
- PDF quotation, proforma invoice, order confirmation, and QR warranty card generation
- Automatic mapped brochure page and conditional accessory page
- Web Share API support for PDF sharing, with WhatsApp download fallback
- Supabase PostgreSQL schema, RLS policies, Storage buckets, templates, and seed data
- Responsive industrial ERP interface

## Local development

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`. Without Supabase environment values the app uses its local demonstration data. The supplied usernames work with the password provided by the company administrator.

## Supabase setup

1. Create a Supabase project.
2. Run `supabase/migrations/001_sales_os.sql` in the SQL editor or with the Supabase CLI.
3. Copy `.env.example` to `.env.local` and add the project URL, anon key, and service role key.
4. Set `SKM_INITIAL_PASSWORD` in the shell, then run `node scripts/create-users.mjs` once.
5. Remove the service role key from any client/deployment environment after provisioning users if it is not needed by server-side jobs.

The service role key is never exposed to browser code. RLS remains the authorization boundary for all database records.

## Vercel deployment

Import this folder into Vercel, add `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, and `DEMO_AUTH_SECRET`, then deploy. Add a custom domain and verify Supabase Auth redirect URLs before production use.

## Commercial data note

The 10KG prices in the supplied references conflict. Sales OS uses the explicit brief as the pre-tax master: Economic `130000`, Commercial High Load `150000`; GST-inclusive prices are calculated at exactly 18% by the engine.
