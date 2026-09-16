# Abinash Sculptures — E-commerce Upgrade Roadmap

Decisions (from user):
- Razorpay: keys NOT available yet. Build checkout + order flow; payment plug-in later.
- Auth: Email OTP (magic link/OTP) + Google OAuth now. Phone OTP later (needs SMS provider).
- WhatsApp: ready-to-buy products use cart/checkout. WhatsApp kept for custom enquiries only.
- Delivery: quoted separately (no auto shipping calculation).

## Phase 2 — Database schema + auth (in progress)
- [ ] profiles, addresses, categories, product_variants/images normalisation, inventory
- [ ] carts, cart_items, wishlists
- [ ] orders, order_items, order_status_history, payments
- [ ] coupons, coupon_usage, reviews
- [ ] custom_enquiries, enquiry_files, quotations, quotation_items
- [ ] notifications, admin_audit_log
- [ ] RLS for customer/admin/staff roles
- [ ] Auth pages: email OTP + Google, session provider, logout

## Phase 3 — Catalogue
- [ ] Migrate existing products to new schema (slug, category, dimensions, material)
- [ ] Product listing with search/filter/sort, category pages
- [ ] Product detail page /products/:slug with gallery, tabs, variants, reviews

## Phase 4 — Customer account
- [ ] Dashboard: overview, orders, wishlist, addresses, profile, security

## Phase 5 — Cart + checkout
- [ ] Guest local cart merged on login
- [ ] Multi-step checkout, coupon, totals (shipping = quoted separately)

## Phase 6 — Razorpay (blocked: waiting on keys)
- [ ] Edge functions: create order, verify signature, webhook

## Phase 7 — Orders
- [ ] Order confirmation, history, tracking timeline

## Phase 8 — Admin panel
- [ ] Dashboard metrics/charts, products, categories, orders, customers,
      payments, inventory, coupons, reviews, enquiries, analytics, settings, audit log

## Phase 9 — Custom enquiry + quotation
- [ ] Request Custom Sculpture form + storage uploads
- [ ] Admin enquiry pipeline, quotation builder, PDF, customer view

## Phase 10 — SEO, performance, security, testing
- [ ] Structured data, sitemap, lazy images, RLS + flow testing
