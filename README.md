# MOZAICO COACHES LIMITED — starter repository

This ZIP contains a starter scaffold: three React frontends and one shared Node/Express API. It is not yet a production-ready booking/payment platform.

## Contents
- `apps/admin` — management dashboard starter
- `apps/customer` — passenger app starter
- `apps/staff` — booking clerk app starter
- `backend` — shared API
- `database/schema.sql` — initial PostgreSQL tables

## Requirements
Node.js 20+, GitHub account, Render account, and a Render PostgreSQL database.

## Local test
In one terminal:
```bash
cd backend
cp .env.example .env
npm install
npm start
```
In another terminal:
```bash
cd apps/customer
npm install
# Create an .env file containing VITE_API_URL=http://localhost:10000
npm run dev
```
Use the same steps for `apps/admin` and `apps/staff`.

## Upload to GitHub
1. Create a **private** repository named `mozaico-coaches-system`.
2. Extract this ZIP.
3. Upload the contents of the `mozaico-coaches-system` folder to the repository root.

## Deploy on Render
### PostgreSQL
Create a Render PostgreSQL database. Copy its Internal Database URL into the API service's `DATABASE_URL`.

### API Web Service
- Repository: your GitHub repository
- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`
- Environment variables: `DATABASE_URL`, `NODE_ENV=production`, and `CORS_ORIGINS` (comma-separated deployed frontend URLs)
- Health Check Path: `/health`

### Three Static Sites
Create one Render Static Site for each app:

| App | Root Directory | Build command | Publish directory |
|---|---|---|---|
| Admin | `apps/admin` | `npm install && npm run build` | `dist` |
| Customer | `apps/customer` | `npm install && npm run build` | `dist` |
| Staff | `apps/staff` | `npm install && npm run build` | `dist` |

Set `VITE_API_URL` on each static site to the deployed API URL, e.g. `https://your-api.onrender.com`. Add the three frontend URLs to the API's `CORS_ORIGINS`, then redeploy the API.

### Company domain
After purchasing a domain, add these custom domains in each Render service's Settings → Custom Domains:
- `admin.yourdomain.co.ke`
- `book.yourdomain.co.ke`
- `staff.yourdomain.co.ke`
- `api.yourdomain.co.ke`

Use only the DNS records Render displays. HTTPS certificates are provisioned after domain verification.

## Important security note
This is a starter scaffold only. It does not yet have production login/authentication, role permissions, safe seat locking, payment integration, ticket generation, audit controls, or automated backups. Do not use real passenger data or accept live payments until these are built and tested. The sample booking endpoint is a development placeholder and does not prevent duplicate seat bookings.

Apply `database/schema.sql` to PostgreSQL before using the database endpoints.
