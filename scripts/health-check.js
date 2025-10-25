#!/usr/bin/env node
/**
 * TRS Alliance - System Health Check
 */

import fs from "fs";
import path from "path";

console.log("🔍 Running TRS System Health Check...\n");

const checks = [
  { name: "package.json", exists: fs.existsSync("package.json") },
  { name: "health-check.config.js", exists: fs.existsSync("health-check.config.js") },
  { name: ".github/workflows", exists: fs.existsSync(".github/workflows") },
  { name: "README.md", exists: fs.existsSync("README.md") },
  { name: "firebase.json", exists: fs.existsSync("firebase.json") || false }
];

let passed = 0;
for (const check of checks) {
  if (check.exists) {
    console.log(`✅ ${check.name}`);
    passed++;
  } else {
    console.log(`❌ Missing: ${check.name}`);
  }
}

console.log(`\n📊 Passed: ${passed}/${checks.length}`);
console.log("💾 Report generated successfully.");
