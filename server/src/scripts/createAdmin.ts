import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { env } from "../config/env";
import { User } from "../models/User";

/**
 * Creates (or updates the password of) the single admin account, using
 * ADMIN_NAME / ADMIN_EMAIL / ADMIN_PASSWORD from .env.
 * Run with: npm run create-admin
 */
async function run() {
  await mongoose.connect(env.mongodbUri);

  const name = process.env.ADMIN_NAME ?? "Rajendran Kaipallil";
  const email = (process.env.ADMIN_EMAIL ?? "admin@example.com").toLowerCase();
  const password = process.env.ADMIN_PASSWORD ?? "change_me_now";

  const passwordHash = await bcrypt.hash(password, 12);

  const existing = await User.findOne({ email });
  if (existing) {
    existing.passwordHash = passwordHash;
    existing.name = name;
    await existing.save();
    console.log(`[create-admin] Updated existing admin: ${email}`);
  } else {
    await User.create({ name, email, passwordHash, role: "admin" });
    console.log(`[create-admin] Created admin: ${email}`);
  }

  await mongoose.disconnect();
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
