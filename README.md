# Nova Site Care website

React (Vite) frontend + Spring Boot API + PostgreSQL.

```
web/    React SPA: public site + admin dashboard at /admin
api/    Spring Boot 4 / Java 25 REST API
docs/   Design prompts (Google Stitch)
```

## Run locally

```bash
docker compose -f docker-compose.dev.yml up -d          # Postgres on :5434

cd api
ADMIN_EMAIL=you@example.com ADMIN_PASSWORD='at-least-12-chars' ./mvnw spring-boot:run   # API on :8081

cd web
npm install
npm run dev                                             # http://localhost:5173 (proxies /api to :8081)
```

Environment variables are listed in `.env.example`. Tests: `cd api && ./mvnw test` (needs Docker).

## Admin dashboard

Open http://localhost:5173/admin and sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD` used on first start.
From there Nova can manage quote requests, services, projects (with before/after photos), the photo
gallery, testimonials, and site settings (contacts, WhatsApp number, social links, map, service areas).
Uploaded images are stored in `api/uploads/` in development and in Cloudflare R2 in production.
