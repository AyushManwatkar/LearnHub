# LearnHub - Complete Fullstack (MVP)

This repo contains a working LearnHub MVP:

- Backend: Node.js + Express + sqlite3
  - Exposes `/api/youtube/search?q=...` which proxies YouTube Data API v3.
  - Falls back to mock videos when YOUTUBE_API_KEY is not set or API fails.
  - Auth endpoints: /api/auth/register, /api/auth/login
  - Playlist/notes endpoints (protected)

- Frontend: React + Vite + Tailwind
  - Pages: Home, Search, MyCourses, CourseDetail, Video Player
  - Search calls backend `/api/youtube/search` and shows results. If backend returns fallback/mock, frontend still displays them.

## Quick start

1. Backend
   - cd backend
   - cp .env.example .env and set values (especially JWT_SECRET; optional YOUTUBE_API_KEY)
   - npm install
   - npm run dev

2. Frontend
   - cd frontend
   - npm install
   - npm run dev

Notes:
- If you don't have a YOUTUBE_API_KEY, the backend will return sample fallback videos so you can test UI without Google Cloud setup.
- To use real search, create a Google Cloud API key and enable YouTube Data API v3, then set `YOUTUBE_API_KEY` in backend `.env`.

