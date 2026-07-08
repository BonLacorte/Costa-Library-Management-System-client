# Costa LMS Client Setup Guide

This guide explains how to run the frontend locally or with Docker. The backend is maintained separately in `Costa-LMS-Server`.

## Prerequisites

- Node.js 20 or newer
- npm 10 or newer
- Costa-LMS backend running locally or deployed
- Docker Desktop, if using containers

## Environment

Create `.env.local` from the example file:

```bash
cp .env.example .env.local
```

Set the backend origin:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

Important:

- Use the backend origin only, not `/api`.
- This value is public because it is bundled into the browser.
- Never put private secrets in `NEXT_PUBLIC_*` variables.

## Local Development

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Backend Connection

Start `Costa-LMS-Server` first and confirm it is available at the URL configured in `NEXT_PUBLIC_API_URL`.

The frontend calls backend routes such as:

- `/auth/login`
- `/auth/signup`
- `/api/books`
- `/api/users/profile`
- `/api/book-loans`
- `/api/reservations`
- `/api/fines`
- `/api/subscriptions`

## Docker

Build with the default local backend:

```bash
docker build -t costa-lms-client .
```

Build with a custom backend:

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.example.com -t costa-lms-client .
```

Run:

```bash
docker run --rm -p 3000:3000 --name costa-lms-client costa-lms-client
```

Open [http://localhost:3000](http://localhost:3000).

## Deployment Notes

- Configure `NEXT_PUBLIC_API_URL` in the hosting provider before building.
- Keep private payment keys, JWT signing secrets, database credentials, SMTP credentials, and cloud tokens out of the frontend.
- If the backend URL changes after the frontend is built, rebuild the frontend image or deployment because Next.js embeds public variables at build time.

## Validation

Run these checks before pushing:

```bash
npm run lint
npm run build
```

Also confirm no local-only files are staged:

```bash
git status --short
```
