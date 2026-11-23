#!/usr/bin/env node
/**
 * Adds a person to the Setter Academy.
 *
 *   node scripts/academy-password.mjs "Name" "their-password"
 *
 * Prints the line to add to the ACADEMY_USERS env var on Vercel
 * (Project > Settings > Environment Variables), then redeploy.
 * To remove someone, delete their line from ACADEMY_USERS and redeploy;
 * they are logged out on their next page load.
 */
import { createHash } from "node:crypto";

const [name, password] = process.argv.slice(2);
if (!name || !password) {
  console.error('Usage: node scripts/academy-password.mjs "Name" "password"');
  process.exit(1);
}
if (password.length < 10) {
  console.error("Use a password of at least 10 characters.");
  process.exit(1);
}

const hash = createHash("sha256").update(password, "utf8").digest("hex");
console.log(`Add this inside the ACADEMY_USERS JSON:\n\n  "${hash}": ${JSON.stringify(name)}\n`);
