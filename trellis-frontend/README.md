# Flowboard — Frontend

React + Vite client for the Collaborative Task & Project Management API.

## Setup
```bash
npm install
cp .env.example .env    # set VITE_API_BASE_URL if your backend isn't on localhost:8080
npm run dev              # runs on http://localhost:5173
```

Requires the backend running (see backend README — `docker compose up -d` then `mvn spring-boot:run`).

## Stack
- React 18 + Vite
- React Router v6 (client-side routing)
- Axios (with request/response interceptors for auth + error handling)
- Context API for auth state (no Redux — not enough shared state to justify it)
- Plain CSS with design tokens (no Tailwind)

## Known Simplifications
- **No user directory**: assigning a task requires typing a user's numeric ID (there's no `GET /api/users` endpoint on the backend yet). A natural next step is a `GET /api/workspaces/{id}/members` endpoint once the backend supports real workspace membership.
- **Token in localStorage**: fine for a demo; a production app would move to httpOnly cookies to protect against XSS token theft.
- **`WorkspaceFormModal` and `ProjectFormModal` are nearly identical** — a reasonable refactor would be one generic `EntityFormModal(name, description)`; kept separate here for clarity while both entities are still simple.