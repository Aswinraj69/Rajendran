# Rajendran Kaipallil — Personal Website & CMS

A premium, editorial personal website and content-management system for Rajendran Kaipallil —
Malayalam writer, scriptwriter, storyteller, and creator. Built as a full-stack TypeScript
monorepo with a self-service admin panel so content can be managed without touching code.

## What's included in this pass (core)

This first build pass covers the **core** of the project end-to-end and production-ready:

- Full project architecture (frontend + backend, cleanly separated)
- MongoDB schemas for **User, Story, Video, Book, Audio, Project** (Book/Audio/Project are
  schema-only for now — see "What's next" below)
- JWT authentication with http-only cookies, bcrypt password hashing, rate-limited login
- Public site: cinematic bilingual homepage, About, Stories (list + detail), Videos (list +
  detail), Works/Contact placeholders, responsive nav with a മലയാളം / English switch
- Admin panel (`/admin`): protected dashboard, full **Stories CRUD** with a Tiptap rich-text
  editor (bilingual content, drafts/publish), full **Videos CRUD** with automatic YouTube URL →
  video ID → embed/thumbnail extraction
- Design system: a deliberate editorial palette and type system (Fraunces + Noto Serif/Sans
  Malayalam + Inter), Framer Motion micro-interactions, lazy-loaded YouTube embeds
- Centralized error handling, input validation, Helmet/CORS, environment variable hygiene

## What's next (not built in this pass)

The spec's remaining modules follow the exact same model → controller → route → admin-page
pattern already established for Stories and Videos, so they're straightforward to add next:

- Books, Audio, and Projects CRUD (schemas already exist in `server/src/models`)
- Media library + Cloudinary upload wiring (`server/src/config/cloudinary.ts` is set up; upload
  routes/controllers are not yet added)
- Contact form backend endpoint (the form UI exists on `/contact`, not yet wired to an API)
- SEO extras: sitemap.xml, robots.txt, structured data
- Custom audio player component

Ask for any of these next and they'll slot into the existing structure.

## Project structure

```
rajendran-kaipallil/
  server/     Express + TypeScript API, MongoDB/Mongoose models, JWT auth
  client/     React + TypeScript + Vite + Tailwind + Framer Motion
```

## Prerequisites

- Node.js 18+
- A MongoDB database (local, or a free MongoDB Atlas cluster)
- (Optional, for later media upload work) A Cloudinary account

## 1. Backend setup

```bash
cd server
cp .env.example .env
# edit .env: set MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD, etc.

npm install
npm run create-admin   # creates your admin login from ADMIN_EMAIL / ADMIN_PASSWORD
npm run seed           # optional: adds a couple of clearly-marked demo stories/videos
npm run dev            # starts the API on http://localhost:5000
```

### Environment variables (`server/.env`)

| Variable | Purpose |
|---|---|
| `PORT` | API port (default 5000) |
| `NODE_ENV` | `development` or `production` |
| `CLIENT_URL` | Frontend origin, for CORS |
| `MONGODB_URI` | MongoDB connection string |
| `JWT_SECRET` | Long random string — never commit this |
| `JWT_EXPIRES_IN` | Session length, e.g. `7d` |
| `COOKIE_NAME` | Name of the http-only auth cookie |
| `CLOUDINARY_*` | Needed once media upload routes are added |
| `YOUTUBE_API_KEY` | Optional — for auto-fetching video titles/thumbnails |
| `ADMIN_NAME/EMAIL/PASSWORD` | Used only by `npm run create-admin` |

Never expose `JWT_SECRET`, `MONGODB_URI`, or Cloudinary credentials to the frontend — they stay
server-side only.

## 2. Frontend setup

```bash
cd client
npm install
npm run dev   # starts the site on http://localhost:5173
```

The Vite dev server proxies `/api` to `http://localhost:5000`, so no extra config is needed
locally. In production, set `VITE_API_URL` in the client's environment to the deployed API URL.

## 3. Log in to the admin panel

Visit `http://localhost:5173/admin/login` and sign in with the `ADMIN_EMAIL` / `ADMIN_PASSWORD`
you set in `server/.env` before running `npm run create-admin`.

## 4. Production build

```bash
# Backend
cd server
npm run build
npm start          # runs dist/server.js

# Frontend
cd client
npm run build      # outputs static files to client/dist
npm run preview    # local sanity check of the production build
```

## 5. Deployment

- **Frontend:** deploy `client/` to Vercel (or Netlify). Set `VITE_API_URL` to your API's public URL.
- **Backend:** deploy `server/` to Render, Railway, or a small AWS instance. Set all variables
  from `.env.example` in the platform's environment settings.
- **Database:** MongoDB Atlas (free tier is enough to start).
- **Media (next pass):** Cloudinary, once upload routes are added.

## YouTube integration

Admins never need a video ID — pasting any of these into the video form works:

```
https://www.youtube.com/watch?v=VIDEO_ID
https://youtu.be/VIDEO_ID
https://www.youtube.com/shorts/VIDEO_ID
https://www.youtube.com/embed/VIDEO_ID
```

`server/src/utils/youtube.ts` extracts the ID, builds the embed URL, and generates a thumbnail
automatically. No video is ever downloaded or hosted locally — only the ID and metadata are
stored, and the public site lazy-loads the actual YouTube iframe only once a visitor clicks play.

## Notes on content

Demo content added by `npm run seed` is clearly tagged (`demo-content`) and contains no real
claims about Rajendran's work, achievements, or history — replace it entirely from the admin
panel.
