import express from "express";
import { connectDB } from "./config/db";
import router from "./routes/index.router";
import { errorHandler } from "./middlewares/error.middleware";
import { requireJwtSecret } from "./utils/token.util";
import "dotenv/config"; // Ensures environment variables are parsed immediately

const app = express();
const PORT = Number(process.env.PORT ?? 3000);

// Inside your src/server.ts file, update the startServer function block:

const startServer = async () => {
  requireJwtSecret();
  await connectDB();

  // 1. Force full module evaluation and runtime assignment
  console.log("⚙️ Binding background queue streams...");
  const { smsWorker } = await import("./queue/sms.worker");
  await import("./queue/whatsapp.worker");

  // 2. Explicitly log the assigned queue configuration to verify it is active
  console.log(
    `📡 BullMQ Active Status: Listening to queue [${smsWorker.name}]`,
  );

  app.use(express.json());
  app.use((_req, res, next) => {
    res.header(
      "Access-Control-Allow-Origin",
      process.env.FRONTEND_URL ?? "http://localhost:3001",
    );
    res.header(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization, X-API-Key",
    );
    res.header("Access-Control-Allow-Methods", "GET,POST,PATCH,DELETE,OPTIONS");
    if (_req.method === "OPTIONS") return res.sendStatus(204);
    return next();
  });
  app.use("/", router);

  app.get("/", (req, res) => {
    res.send("Hello, World!");
  });

  app.use(errorHandler);

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
    console.log(
      "🚀 Background systems are active and listening to Redis keyspaces!",
    );
  });
};

startServer();
