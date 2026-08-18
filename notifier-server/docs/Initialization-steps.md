# Notifier — Project Initialization Guide

This document contains the complete initialization process for the **Notifier** backend project.

## 1. Project Overview

**Project:** Notifier

**Stack:**

* Node.js
* TypeScript
* Express.js
* PostgreSQL
* Docker
* Prisma ORM

### Architecture

```text
Client
  |
  v
Express API
  |
  v
Node.js + TypeScript
  |
  v
Prisma ORM
  |
  v
PostgreSQL
  |
  v
Docker Container
```

---

# 2. Prerequisites

Make sure the following are installed:

```bash
node -v
npm -v
docker -v
```

Recommended:

* Node.js 22 LTS or newer
* npm
* Docker Desktop
* VS Code

> Current project was initially created with Node.js `20.19.4`. Prisma 7 may show engine warnings for some packages requiring Node.js 22+, so Node.js 22 LTS is recommended.

---

# 3. Create Node.js Project

Create the project folder:

```bash
mkdir Notifier
cd Notifier
```

Initialize npm:

```bash
npm init -y
```

This creates:

```text
package.json
```

---

# 4. Install Express

Install Express:

```bash
npm install express
```

Install TypeScript development dependencies:

```bash
npm install -D typescript ts-node-dev @types/node @types/express
```

---

# 5. Initialize TypeScript

Run:

```bash
npx tsc --init
```

Configure `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "commonjs",
    "rootDir": "./src",
    "outDir": "./dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "verbatimModuleSyntax": false
  }
}
```

### Why `verbatimModuleSyntax` is disabled

The project uses:

```ts
import express from "express";
```

with CommonJS:

```json
"module": "commonjs"
```

Therefore:

```json
"verbatimModuleSyntax": false
```

avoids the TypeScript error:

```text
ECMAScript imports and exports cannot be written in a CommonJS file
under 'verbatimModuleSyntax'
```

---

# 6. Initial Project Structure

Create:

```text
Notifier/
│
├── src/
│   └── server.ts
│
├── package.json
├── tsconfig.json
└── .gitignore
```

---

# 7. Create Express Server

`src/server.ts`

```ts
import express from "express";

const app = express();

const PORT = 3000;

app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    message: "Notifier API is running"
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

# 8. Add NPM Scripts

Update `package.json`:

```json
{
  "scripts": {
    "dev": "ts-node-dev --respawn --transpile-only src/server.ts",
    "build": "tsc",
    "start": "node dist/server.js"
  }
}
```

### Development

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Production

```bash
npm start
```

---

# 9. PostgreSQL Setup Using Docker

The project uses PostgreSQL running inside Docker.

Check running containers:

```bash
docker ps
```

Current PostgreSQL container:

```text
CONTAINER ID   IMAGE      PORTS                    NAMES
a0a3df3fc57e   postgres   0.0.0.0:5432->5432/tcp   postgres
```

Important:

```text
Docker PostgreSQL
       |
       +---- localhost:5432
```

Because PostgreSQL port `5432` is mapped to the host.

---

# 10. Access PostgreSQL Container

Open PostgreSQL shell:

```bash
docker exec -it postgres psql -U postgres
```

Check databases:

```sql
\l
```

Create the project database:

```sql
CREATE DATABASE notifier;
```

Check again:

```sql
\l
```

Exit:

```sql
\q
```

---

# 11. Environment Variables

Create:

```text
.env
```

Example:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD
DB_NAME=notifier
```

Do not commit `.env` to Git.

Add to `.gitignore`:

```text
node_modules/
dist/
.env
```

---

# 12. Initial PostgreSQL Connection Using `pg`

Before Prisma was added, PostgreSQL was connected using the `pg` package.

Install:

```bash
npm install pg dotenv
```

TypeScript types:

```bash
npm install -D @types/pg
```

Example:

```text
src/
└── config/
    └── db.ts
```

```ts
import { Pool } from "pg";
import dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

export const connectDB = async () => {
  try {
    await pool.query("SELECT 1");
    console.log("PostgreSQL connected successfully");
  } catch (error) {
    console.error("PostgreSQL connection failed:", error);
    process.exit(1);
  }
};

export default pool;
```

This confirmed that Node.js could communicate with PostgreSQL.

---

# 13. PostgreSQL Connection Architecture

When Node.js is running directly on Windows:

```text
Windows
│
├── Node.js Application
│        |
│        | localhost:5432
│        v
└── Docker
         |
         └── PostgreSQL Container
                  |
                  └── notifier database
```

Therefore:

```env
DB_HOST=localhost
DB_PORT=5432
```

### Important

If Node.js is later moved into Docker as well, the database host will normally become the Docker service/container name rather than `localhost`.

Example:

```env
DB_HOST=postgres
```

---

# 14. Install Prisma

Install Prisma and Prisma Client:

```bash
npm install prisma @prisma/client
```

Initialize Prisma:

```bash
npx prisma init
```

Prisma creates:

```text
prisma/
├── schema.prisma

prisma.config.ts
```

Prisma 7 also creates configuration for the Prisma CLI.

---

# 15. Prisma Configuration

Prisma 7 uses `prisma.config.ts`.

Configure:

```ts
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations"
  },
  datasource: {
    url: env("DATABASE_URL")
  }
});
```

---

# 16. Prisma Database URL

Add the Prisma connection string to `.env`.

Example:

```env
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/notifier?schema=public"
```

For example:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/notifier?schema=public"
```

Use the actual PostgreSQL password.

The final `.env` can contain:

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=YOUR_PASSWORD
DB_NAME=notifier

DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/notifier?schema=public"
```

---

# 17. Prisma Schema

`prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
}

model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  createdAt DateTime @default(now())
}
```

---

# 18. Generate Prisma Client

Run:

```bash
npx prisma generate
```

This generates Prisma Client inside:

```text
node_modules/@prisma/client
```

---

# 19. Verify Database Connection

Run:

```bash
npx prisma db pull
```

This connects Prisma to the PostgreSQL database.

The connection should point to:

```text
localhost:5432
```

and:

```text
database: notifier
```

### Previous problem

The project initially pointed to:

```text
localhost:51213
localhost:51214
```

This was incorrect because the actual PostgreSQL Docker container is exposed on:

```text
localhost:5432
```

The problem was fixed by configuring:

```text
prisma.config.ts
```

to use:

```text
DATABASE_URL
```

from `.env`.

---

# 20. Create Database Migration

After defining models:

```bash
npx prisma migrate dev --name init
```

Prisma creates:

```text
prisma/
│
├── migrations/
│   └── <timestamp>_init/
│       └── migration.sql
│
└── schema.prisma
```

The migration creates the required database tables.

---

# 21. Prisma Client Configuration

Create:

```text
src/config/prisma.ts
```

```ts
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default prisma;
```

Now the application can use:

```ts
import prisma from "./config/prisma";
```

---

# 22. Test Prisma With an API

Example:

```ts
import express from "express";
import prisma from "./config/prisma";

const app = express();

app.use(express.json());

app.get("/users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();

    res.json(users);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to fetch users"
    });
  }
});

app.post("/users", async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email
      }
    });

    res.json(user);
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Failed to create user"
    });
  }
});

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

---

# 23. Prisma Studio

Prisma provides a GUI for viewing the database.

Run:

```bash
npx prisma studio
```

Do not use:

```bash
prisma studio
```

because Prisma is installed locally in the project.

Use:

```bash
npx prisma studio
```

Prisma Studio normally opens at:

```text
http://localhost:5555
```

You can view:

```text
User
├── id
├── name
├── email
└── createdAt
```

You can also add, edit, and delete records from Prisma Studio.

---

# 24. Complete Database Flow

The final architecture is:

```text
                    Client
                      |
                      v
               Express REST API
                      |
                      v
              Node.js + TypeScript
                      |
                      v
                   Prisma
                      |
             localhost:5432
                      |
                      v
            Docker PostgreSQL
                      |
                      v
                  notifier
                      |
          +-----------+-----------+
          |                       |
          v                       v
       Tables               Prisma Studio
                               :5555
```

---

# 25. Important Prisma Commands

### Initialize Prisma

```bash
npx prisma init
```

### Generate Prisma Client

```bash
npx prisma generate
```

### Check database schema

```bash
npx prisma db pull
```

### Create migration

```bash
npx prisma migrate dev --name init
```

### Apply migrations

```bash
npx prisma migrate deploy
```

### Open Prisma Studio

```bash
npx prisma studio
```

### Check Prisma version

```bash
npx prisma -v
```

---

# 26. Common Mistakes

## Mistake 1 — Using `npm prisma`

Incorrect:

```bash
npm prisma migrate
```

Correct:

```bash
npx prisma migrate dev --name init
```

---

## Mistake 2 — Using global `prisma`

Incorrect:

```bash
prisma studio
```

Correct:

```bash
npx prisma studio
```

---

## Mistake 3 — Wrong PostgreSQL port

Your Docker container exposes:

```text
5432:5432
```

Therefore:

```env
DATABASE_URL="postgresql://postgres:PASSWORD@localhost:5432/notifier?schema=public"
```

Do not use:

```text
51213
51214
```

unless your PostgreSQL container is actually running on those ports.

---

## Mistake 4 — Database does not exist

Error:

```text
database "Notifier" does not exist
```

Fix:

```bash
docker exec -it postgres psql -U postgres
```

Then:

```sql
CREATE DATABASE notifier;
```

---

## Mistake 5 — `.env` committed to Git

Never commit:

```text
.env
```

Add:

```text
.env
```

to `.gitignore`.

---

# 27. Recommended Final Project Structure

As the Notifier project grows:

```text
Notifier/
│
├── prisma/
│   ├── migrations/
│   │   └── ...
│   │
│   └── schema.prisma
│
├── src/
│   │
│   ├── config/
│   │   └── prisma.ts
│   │
│   ├── controllers/
│   │
│   ├── services/
│   │
│   ├── repositories/
│   │
│   ├── routes/
│   │
│   ├── middlewares/
│   │
│   ├── app.ts
│   └── server.ts
│
├── .env
├── .gitignore
├── package.json
├── prisma.config.ts
├── tsconfig.json
└── PROJECT_INITIALIZATION.md
```

---

# 28. Daily Development Workflow

After the project is initialized, the normal workflow is:

```text
1. Start Docker
       ↓
2. PostgreSQL container running
       ↓
3. Update prisma/schema.prisma
       ↓
4. Create migration
       ↓
5. Prisma updates PostgreSQL
       ↓
6. Write API/service code
       ↓
7. Run application
       ↓
8. Test API
       ↓
9. Open Prisma Studio when needed
```

Commands:

```bash
docker ps

npx prisma migrate dev --name <migration-name>

npm run dev

npx prisma studio
```

---

# 29. Current Technology Stack

The initialized project currently uses:

| Technology    | Purpose               |
| ------------- | --------------------- |
| Node.js       | Runtime               |
| TypeScript    | Programming language  |
| Express       | REST API framework    |
| PostgreSQL    | Relational database   |
| Docker        | PostgreSQL container  |
| Prisma        | ORM / database client |
| Prisma Studio | Database GUI          |
| npm           | Package management    |
| dotenv        | Environment variables |

---

# 30. Next Development Stage

The project initialization is now complete.

The next stage is to design the actual **Notifier** domain.

Expected initial entities could include:

```text
User
Notification
NotificationTemplate
NotificationPreference
NotificationChannel
NotificationDelivery
```

Then the project can gradually introduce:

```text
REST API
   ↓
PostgreSQL
   ↓
Redis
   ↓
Kafka
   ↓
Notification Workers
   ↓
Email / SMS / Push
```

This will allow the project to move beyond simple CRUD and become a practical **system-design + backend project**.
