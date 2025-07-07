# Kaminski Portfolio

Personal interactive portfolio:
- **Frontend:** React (Vite, TS)
- **Backend:** Python FastAPI + GraphQL
- **DB:** Neon/Postgres-ready

## Local Dev
- `cd backend && pip install -r requirements.txt && uvicorn app.main:app --reload`
- `cd frontend && npm install && npm run dev`

Edit backend/app/api_graphql.py to connect to real data.

## Deploy
- Vercel: Import `frontend` (custom settings).
- Backend: Render.com, Fly.io, or Vercel (if using serverless FastAPI).

## Customize and extend freely.
