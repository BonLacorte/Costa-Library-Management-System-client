# Costa Library Management System Client

Frontend for the Costa Library Management System, a full-stack library platform with separate patron and administrator experiences. The client is built with Next.js, React, TypeScript, Tailwind CSS, and a Spring Boot backend.

Backend repository: [BonLacorte/Costa-Library-Management-System-server](https://github.com/BonLacorte/Costa-Library-Management-System-server)

## Overview

The app connects to `Costa-LMS-Server` for authentication, catalog browsing, circulation workflows, reservations, fines, payments, subscriptions, and admin reporting. It uses JWT-based authentication stored in browser local storage for this portfolio version.

## Features

### Patron Portal

- Browse books by title, author, genre, ISBN, and availability.
- View active loans, loan details, due dates, and renewal/return actions.
- Reserve unavailable books and track reservation status.
- View and pay fines.
- Browse subscription plans and review subscription history.

### Admin Dashboard

- View operational stats for books, users, revenue, loans, reservations, subscriptions, and fines.
- Manage books, genres, users, reservations, loans, fines, subscription plans, and active user subscriptions.
- Use role-protected admin routes that verify the signed-in user profile.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Base UI, Shadcn-style components, and Lucide React icons
- Docker multi-stage build with Next.js standalone output

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy the environment template:

```bash
cp .env.example .env.local
```

3. Set the backend origin:

```bash
NEXT_PUBLIC_API_URL=http://localhost:8080
```

4. Start the development server:

```bash
npm run dev
```

The frontend runs at [http://localhost:3000](http://localhost:3000) by default. The backend should be running separately on the URL configured in `NEXT_PUBLIC_API_URL`.

## Docker

Build with the default local backend URL:

```bash
docker build -t costa-lms-client .
```

Build with a deployed backend URL:

```bash
docker build --build-arg NEXT_PUBLIC_API_URL=https://api.example.com -t costa-lms-client .
```

Run:

```bash
docker run -p 3000:3000 costa-lms-client
```

## Environment Notes

`NEXT_PUBLIC_API_URL` is public browser configuration. It should contain only the backend origin, such as `http://localhost:8080`, and must not include private API keys, payment secrets, JWT signing secrets, database passwords, or provider tokens.

Private secrets belong in the backend, deployment platform secrets, or local-only files that are never committed.

## Validation

```bash
npm run lint
npm run build
```

## Developer

Florence Bon Lacorte
GitHub: [@BonLacorte](https://github.com/BonLacorte)
