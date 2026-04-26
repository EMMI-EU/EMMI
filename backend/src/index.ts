import "dotenv/config";
import app from "./app.js";
import { env } from "./config/env.js";
import { pool } from "./lib/db.js";

async function start() {
  // Verify DB connection
  try {
    await pool.query("SELECT 1");
    console.log("✅ Database connected");
  } catch (err) {
    console.error("❌ Database connection failed:", err);
    process.exit(1);
  }

  app.listen(env.API_PORT, () => {
    console.log(`🚀 API Server running on port ${env.API_PORT} [${env.NODE_ENV}]`);
  });

  // Graceful shutdown
  const shutdown = async () => {
    console.log("Shutting down...");
    await pool.end();
    process.exit(0);
  };
  process.on("SIGTERM", shutdown);
  process.on("SIGINT", shutdown);
}

start();
