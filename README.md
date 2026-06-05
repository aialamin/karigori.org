# Karigori

Karigori is a local service professional directory for Dhaka. Users can browse, filter, review, and contact workers such as plumbers, electricians, cleaners, AC repair technicians, carpenters, painters, gas fitters, and home helpers.

## Tech Stack

- Frontend: React 18 + Vite
- Backend: Express.js
- Database: MongoDB Atlas + Mongoose
- Auth: JWT
- Hosting: Vercel for the frontend, Render for the backend

## Local Setup

Install dependencies:

```bash
npm install
cd server && npm install
cd ../client && npm install
```

Create `server/.env` from `server/.env.example`:

```bash
PORT=5000
MONGO_URI=mongodb+srv://YOUR_ATLAS_USER:YOUR_ATLAS_PASSWORD@YOUR_CLUSTER.mongodb.net/karigori?appName=Cluster0
JWT_SECRET=replace-with-a-long-random-secret
CLIENT_URL=http://localhost:3000
```

Create `client/.env` from `client/.env.example`:

```bash
VITE_API_URL=http://localhost:5000
```

Run both apps:

```bash
npm run dev
```

Frontend: `http://localhost:3000`

Backend health check: `http://localhost:5000/api/health`

## Render Deployment

Deploy the backend as a Render web service from this repository. The included `render.yaml` points Render at the `server` directory.

Set these environment variables in Render:

```bash
MONGO_URI=your MongoDB Atlas connection string
JWT_SECRET=a long random secret
CLIENT_URL=https://your-vercel-app.vercel.app
NODE_ENV=production
```

After deploy, confirm the API is live:

```bash
https://your-render-service.onrender.com/api/health
```

## Vercel Deployment

Deploy the frontend to Vercel from this repository. The included `vercel.json` builds the Vite app from the `client` directory.

Set this environment variable in Vercel:

```bash
VITE_API_URL=https://your-render-service.onrender.com
```

After Vercel deploys, update Render's `CLIENT_URL` to the final Vercel URL and redeploy the backend if needed.

## Important Security Notes

- Do not commit `server/.env` or any real secrets.
- Store the MongoDB Atlas URI only in Render environment variables.
- Store the frontend API URL only in Vercel environment variables.
- Uploaded user files in `server/uploads` are ignored by Git.

## API Endpoints

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Backend health check |
| GET | `/api/workers` | List approved workers |
| GET | `/api/workers/:id` | Worker profile |
| POST | `/api/workers/:id/reviews` | Add a review |
| POST | `/api/auth/register` | Register a user |
| POST | `/api/auth/login` | Log in |
| GET | `/api/auth/me` | Current user |
| GET | `/api/profile/worker` | Worker dashboard profile |
| PUT | `/api/profile/worker` | Update worker profile |
| GET | `/api/admin/stats` | Admin dashboard stats |

## Project Structure

```text
karigori/
  client/      React + Vite frontend
  server/      Express + Mongoose backend
  render.yaml  Render backend blueprint
  vercel.json  Vercel frontend build config
```
