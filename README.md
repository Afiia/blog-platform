# BlogSpace – MERN Blogging Platform

A full-stack blog: JWT auth, posts with author-only edit/delete, comments, and paginated listing.

## Quick start
```bash
# Backend  → http://localhost:5000
cd backend && npm install && cp .env.example .env   # set MONGO_URI and JWT_SECRET
npm run dev

# Frontend → http://localhost:5173 (proxies /api to the backend)
cd frontend && npm install && npm run dev
```

## Architecture
```
backend/src
  config.js            validated environment (fails fast)
  app.js / server.js   Express app (testable) / bootstrap + graceful shutdown
  routes/              auth, posts (+ comments), zod-validated input
  middleware/          requireAuth, validate, errorHandler
  models/              User (hashed pw, select:false), Post, Comment (indexed)
frontend/src
  api.js               fetch client + token store
  context/             AuthContext (session state)
  components/ pages/   Layout, RequireAuth, Home, PostPage, Editor, AuthPage
```

Highlights: helmet, CORS allow-list, auth rate limiting, bcrypt (cost 12), centralized error
handling, ObjectId validation, client-side routing with deep links, accessible forms.

## REST API
| Method | Endpoint | Auth | Purpose |
|---|---|---|---|
| GET | /api/health | - | Health check |
| POST | /api/auth/register | - | Create account |
| POST | /api/auth/login | - | Get JWT |
| GET | /api/auth/me | yes | Current user |
| GET | /api/posts?page=1 | - | List posts |
| GET | /api/posts/:id | - | Post + comments |
| POST | /api/posts | yes | Create post |
| PUT | /api/posts/:id | owner | Edit post |
| DELETE | /api/posts/:id | owner | Delete post + comments |
| POST | /api/posts/:id/comments | yes | Add comment |
| DELETE | /api/posts/:id/comments/:cid | owner | Delete comment |
