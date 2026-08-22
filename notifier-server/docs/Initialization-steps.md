# Notifier: Local Setup Guide

This guide describes the current Notifier workspace. It documents the existing setup only; it does not change the application architecture or runtime behavior.

## Workspace layout

```text
Notifier/
|- notifier-client/  # Next.js dashboard (port 3001)
|- notifier-server/  # Express API and BullMQ workers (port 3000)
`- notifier-sdk/     # TypeScript SDK package
```

The server uses PostgreSQL through Prisma 7's `@prisma/adapter-pg` driver adapter. Redis and BullMQ handle queued SMS, WhatsApp, and email jobs.

## Prerequisites

- Node.js 22 LTS or later
- npm
- PostgreSQL 16+ (local or Docker)
- Redis 7+ (local or Docker)

Check the installed tools:

```bash
node -v
npm -v
docker -v
```

## 1. Set up PostgreSQL and Redis

The server requires a PostgreSQL database and Redis instance. For local Docker development, the following commands expose the default ports:

```bash
docker run --name notifier-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=notifier -p 5432:5432 -d postgres:16
docker run --name notifier-redis -p 6379:6379 -d redis:7
```

If containers already exist, start them instead:

```bash
docker start notifier-postgres notifier-redis
```

To open a PostgreSQL shell:

```bash
docker exec -it notifier-postgres psql -U postgres -d notifier
```

## 2. Configure the server

From `notifier-server`, install dependencies and copy the example environment file:

```powershell
npm install
Copy-Item .env.example .env
```

On macOS or Linux, use `cp .env.example .env` instead. Update `.env` with your own credentials. At minimum, set a real database URL and a long random JWT secret:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/notifier?schema=public"
JWT_SECRET=replace-with-a-long-random-secret
```

`REDIS_HOST`, `REDIS_PORT`, `PORT`, and `FRONTEND_URL` have local-development defaults. Twilio variables are required only when sending SMS or WhatsApp.

## 3. Prepare Prisma

Run Prisma commands from `notifier-server`:

```bash
npm run generate
npx prisma migrate deploy
```

For local schema development, create a new migration instead:

```bash
npm run migrate -- --name <migration-name>
```

Useful commands:

```bash
npx prisma studio
npx prisma validate
```

Do not edit files in `src/generated/prisma`; they are generated and ignored by Git.

## 4. Run the server and workers

Start the API:

```bash
npm run dev
```

The API listens on `http://localhost:3000` by default. The main server starts the SMS and WhatsApp workers. Dedicated worker commands are also available:

```bash
npm run worker:sms
npm run worker:whatsapp
```

Build and run the compiled server:

```bash
npm run build
npm start
```

## 5. Run the client

In a second terminal, configure and start `notifier-client`:

```powershell
npm install
Set-Content .env.local 'NEXT_PUBLIC_API_URL=http://localhost:3000'
npm run dev
```

On macOS or Linux, create `.env.local` with the same variable using your editor or `printf`. The dashboard runs at `http://localhost:3001`.

## 6. Build the SDK

The SDK is independent of the web application:

```bash
npm install
npm run build
```

Its compiled files are written to `notifier-sdk/dist`.

## Environment reference

| Variable | Used by | Default | Purpose |
| --- | --- | --- | --- |
| `DATABASE_URL` | Server | - | PostgreSQL connection string; required. |
| `JWT_SECRET` | Server | - | JWT signing secret; required. |
| `PORT` | Server | `3000` | API port. |
| `FRONTEND_URL` | Server | `http://localhost:3001` | Allowed browser origin. |
| `REDIS_HOST` | Server | `127.0.0.1` | Redis hostname. |
| `REDIS_PORT` | Server | `6379` | Redis port. |
| `TWILIO_ACCOUNT_SID` | SMS/WhatsApp worker | - | Twilio account identifier. |
| `TWILIO_AUTH_TOKEN` | SMS/WhatsApp worker | - | Twilio authentication token. |
| `TWILIO_PHONE_NUMBER` | SMS worker | - | Sender phone number. |
| `TWILIO_WHATSAPP_FROM` | WhatsApp worker | - | Sender WhatsApp address. |
| `NEXT_PUBLIC_API_URL` | Client | `http://localhost:3000` | API base URL used by the dashboard. |

## Generated and local-only files

Keep these out of source control:

```text
node_modules/
dist/
.next/
.env
.env.local
src/generated/prisma/
```

They are generated dependency, build, environment, or Prisma-client artifacts. Do not delete `node_modules` while the applications are running; remove it only when you intentionally need a clean dependency installation.
