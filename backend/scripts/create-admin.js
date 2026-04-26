#!/usr/bin/env node

/**
 * Create a new admin user
 * 
 * Usage:
 *   node scripts/create-admin.js
 * 
 * Then follow the interactive prompts to create a new admin account
 */

import "dotenv/config";
import readline from "readline";
import bcrypt from "bcryptjs";
import { db } from "../src/lib/db.js";
import { adminsTable } from "../src/lib/schema.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

async function createAdmin() {
  console.log("\n🔐 Create New Admin User");
  console.log("═".repeat(40));

  // Get email
  let email = "";
  while (!email) {
    email = await question("Enter admin email: ");
    if (!email.includes("@")) {
      console.log("❌ Invalid email. Please try again.");
      email = "";
    }
  }

  // Get password
  let password = "";
  while (password.length < 8) {
    password = await question("Enter password (min 8 characters): ");
    if (password.length < 8) {
      console.log("❌ Password must be at least 8 characters.");
      password = "";
    }
  }

  // Confirm password
  const confirmPassword = await question("Confirm password: ");
  if (password !== confirmPassword) {
    console.log("❌ Passwords do not match.");
    rl.close();
    return;
  }

  try {
    // Check if email already exists
    const existing = await db
      .select()
      .from(adminsTable)
      .where(adminsTable.email == email)
      .limit(1);

    if (existing.length > 0) {
      console.log("❌ Email already exists!");
      rl.close();
      return;
    }

    // Hash password
    const passwordHash = await bcrypt.hash(password, 12);

    // Create admin
    const [newAdmin] = await db
      .insert(adminsTable)
      .values({
        email,
        passwordHash,
        role: "admin",
        isActive: "true",
      })
      .returning();

    console.log("\n✅ Admin created successfully!");
    console.log("─".repeat(40));
    console.log(`Email:  ${newAdmin.email}`);
    console.log(`ID:     ${newAdmin.id}`);
    console.log(`Role:   ${newAdmin.role}`);
    console.log("─".repeat(40));
    console.log("\n🔑 You can now log in with:");
    console.log(`   Email:    ${newAdmin.email}`);
    console.log(`   Password: (the password you just entered)\n`);

    rl.close();
  } catch (error) {
    console.error("❌ Error creating admin:", error);
    rl.close();
    process.exit(1);
  }
}

createAdmin();
