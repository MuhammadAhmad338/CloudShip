# CloudShip API

Standalone Express and PostgreSQL backend for the CloudShip Next.js frontend.

## Local setup

Use Node.js 22 or newer and Docker Compose for a local PostgreSQL 16 database. Set a `POSTGRES_PASSWORD` environment variable, start the database, and copy `.env.example` to `.env`. Set its `DATABASE_URL` password to the same local password and generate a private API key with at least 32 random characters. Do not put `API_KEY` in browser code; a trusted server-side frontend proxy should call this API.

For GitHub OAuth, create an OAuth App under GitHub **Settings → Developer settings → OAuth Apps**. Set the local homepage to `http://localhost:3001` and the callback URL to `http://localhost:3001/api/auth/callback/github`. Copy `frontend.env.example` to the repository root as `.env.local`, then set `GITHUB_ID`, `GITHUB_SECRET`, and `NEXTAUTH_SECRET` (generate the latter with `openssl rand -base64 32`). The OAuth provider requests `repo` access to list private repositories; review this scope before authorizing. Do not commit `.env.local`.

```sh
export POSTGRES_PASSWORD='choose-a-local-password'
docker compose up -d postgres
npm install
npm run db:migrate
npm run dev
```

The liveness endpoint is `GET /health/live`; `GET /health/ready` also verifies the PostgreSQL connection. API routes require `Authorization: Bearer <API_KEY>`.

For the Next.js frontend, set `CLOUDSHIP_API_URL=http://localhost:4000` and `CLOUDSHIP_API_KEY` to the same server-side key as the backend `API_KEY`. The frontend calls `/api/workspace/*`; the Next.js route forwards requests to Express without exposing the key in browser JavaScript. Keep this local single-workspace setup private until user authentication is added.

## API

- `GET /api/projects`
- `POST /api/projects`
- `GET /api/projects/:projectId`
- `PATCH /api/projects/:projectId`
- `DELETE /api/projects/:projectId`
- `GET /api/deployments?projectId=<uuid>`
- `POST /api/deployments`
- `GET /api/deployments/:deploymentId`
- `PATCH /api/deployments/:deploymentId/status` (for the future deployment worker)
- `GET /api/environments`
- `GET /api/activity`

All database queries are parameterized. Project and deployment records are scoped to `WORKSPACE_ID`. Deployment creation stores a `Queued` record; the status endpoint enforces lifecycle transitions. A separate, isolated build worker and GitHub/Azure authorization are still required before deployments can execute source code or publish an app. This shared API key is only suitable for a private single-workspace prototype; do not expose the API publicly or use the key as a browser credential. Add user authentication and per-user authorization before making CloudShip multi-user.

## Azure services

For a hosted API, the service names are **Azure App Service** (Linux, Node.js runtime) and **Azure Database for PostgreSQL Flexible Server**. The PostgreSQL pricing page currently lists the Burstable B1ms compute tier as paid, before storage and backup charges. Don't assume PostgreSQL is covered by an always-free quota: use local PostgreSQL while developing, or use eligible Azure free-account credit temporarily and review the live estimate before creating a server.

App Service Free F1 can be useful for a demo, but it has a daily CPU quota, shared resources, no SLA, and is not supported for production workloads. Azure free-account credit is temporary; configure a Cost Management budget and alert before deploying, and remember that an alert does not cap spending.