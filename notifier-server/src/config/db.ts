// src/config/db.ts
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pg from "pg";
import "dotenv/config";

// 1. Establish the raw connection pool using standard environment flags
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });

// 2. Wrap it with the Prisma 7 Translator Adapter
const adapter = new PrismaPg(pool);

// 3. Export a single, fully-configured PrismaClient instance
export const prisma = new PrismaClient({ adapter });

export const connectDB = async () => {
  try {
    // Ping the database to ensure connection parameters are accurate
    await pool.query("SELECT 1");
    console.log("PostgreSQL connected successfully via Driver Adapter");
  } catch (error) {
    console.error("PostgreSQL connection failed:", error);
    process.exit(1);
  }
};
