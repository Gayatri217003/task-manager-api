# Task Manager API

A minimal Task Manager REST API built with **Express.js**, **MongoDB/Mongoose**, and **JWT** authentication.

## Features

- User signup/login with JWT
- Protected CRUD endpoints for tasks
- Request validation (title >= 3 chars)
- Health check endpoint: `/health`
- Optional in-memory caching for GETs (60s)

## Tech

Express, Mongoose, bcrypt, jsonwebtoken, dotenv, cors, nodemon (dev).

## Quick Start (Local)

1. Clone the repo and install dependencies:
   ```bash
   npm install
   ```
2. Copy `.env.example` to `.env` and set values:
   ```bash
   cp .env.example .env
   ```
3. Start in dev:
   ```bash
   npm run dev
   ```
   Or production:
   ```bash
   npm start
   ```

## Environment Variables

- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — any secure random string
- `PORT` — default 5000

## API Reference

Base URL: `http://localhost:5000` (or your deployed URL)

### Auth

**Signup**
```
POST /api/auth/signup
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "secret123"
}
```
**Login**
```
POST /api/auth/login
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "secret123"
}
```
Response for both:
```
{ "token": "JWT_TOKEN_HERE" }
```

### Tasks (All require `Authorization: Bearer <token>`)

**Create**
```
POST /api/tasks
{
  "title": "Buy milk",
  "completed": false
}
```
**List**
```
GET /api/tasks
```
**Get by ID**
```
GET /api/tasks/:id
```
**Update**
```
PUT /api/tasks/:id
{
  "title": "Buy almond milk",
  "completed": true
}
```
**Delete**
```
DELETE /api/tasks/:id
```

### Health
```
GET /health
```

## Example cURL

```bash
# Signup
curl -X POST http://localhost:5000/api/auth/signup -H "Content-Type: application/json" -d "{"email":"me@test.com","password":"secret123"}"

# Login
TOKEN=$(curl -s -X POST http://localhost:5000/api/auth/login -H "Content-Type: application/json" -d "{"email":"me@test.com","password":"secret123"}" | jq -r .token)

# Create a task
curl -X POST http://localhost:5000/api/tasks -H "Authorization: Bearer $TOKEN" -H "Content-Type: application/json" -d "{"title":"Read docs","completed":false}"

# List tasks
curl -H "Authorization: Bearer $TOKEN" http://localhost:5000/api/tasks
```

## Deployment (Render)

1. Push this project to a public GitHub repo.
2. On [Render](https://render.com): **New +** → **Web Service** → Connect your repo.
3. Settings:
   - Runtime: Node
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add Environment Variables:
   - `MONGO_URI` = your MongoDB connection string
   - `JWT_SECRET` = strong secret
   - `PORT` = 10000 (Render sets dynamically but exposing is fine)
5. Deploy. After build, use the generated URL (e.g., `https://your-app.onrender.com`).

## Deployment (Railway)

1. Create a new project and deploy from GitHub.
2. Add variables `MONGO_URI`, `JWT_SECRET`.
3. Railway will detect `npm start` for the start command.

## Notes

- This project uses a simple **in-memory cache** for GET requests. It resets on server restart and is per-instance (fine for the bonus requirement).
- Errors return JSON with appropriate status codes.

---

**License:** MIT
