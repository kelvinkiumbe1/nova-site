# Nova Site Care website

React (Vite) frontend + Spring Boot API + PostgreSQL.

```
web/    React SPA: public site (admin dashboard to come under /admin)
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
