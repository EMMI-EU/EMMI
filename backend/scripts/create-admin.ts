#!/usr/bin/env tsx

import "dotenv/config";
import readline from "readline";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { db, pool } from "../src/lib/db.js";
import { adminsTable } from "../src/lib/schema.js";

const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

function question(prompt: string) {
  return new Promise<string>((resolve) => rl.question(prompt, resolve));
}

async function createAdmin() {
  console.log("\n🔐 Create New Admin User");
  console.log("═".repeat(40));

  let email = "";
  while (!email) {
    email = (await question("Enter admin email: ")).trim().toLowerCase();
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      console.log("❌ Invalid email. Please try again.");
      email = "";
    }
  }

  let password = "";
  while (password.length < 8) {
    password = await question("Enter password (min 8 characters): ");
    if (password.length < 8) {
      console.log("❌ Password must be at least 8 characters.");
      password = "";
    }
  }

  const confirmPassword = await question("Confirm password: ");
  if (password !== confirmPassword) {
    console.log("❌ Passwords do not match.");
    return;
  }

  const existing = await db.select().from(adminsTable).where(eq(adminsTable.email, email)).limit(1);
  if (existing.length > 0) {
    console.log("❌ Email already exists!");
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const [newAdmin] = await db.insert(adminsTable).values({ email, passwordHash, role: "admin", isActive: "true" }).returning();

  console.log("\n✅ Admin created successfully!");
  console.log("─".repeat(40));
  console.log(`Email:  ${newAdmin.email}`);
  console.log(`ID:     ${newAdmin.id}`);
  console.log(`Role:   ${newAdmin.role}`);
}

createAdmin()
  .catch((error) => {
    console.error("❌ Error creating admin:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    rl.close();
    await pool.end();
  });
