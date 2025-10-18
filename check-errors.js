#!/usr/bin/env node

const { execSync } = require("child_process");
const fs = require("fs");

console.log("Running build check...\n");

try {
  // Check if the project builds successfully
  console.log("1. Checking if project builds...");
  execSync("npm run build", {
    stdio: "inherit",
  });
  console.log("Build check passed!\n");
} catch (error) {
  console.log("Build failed!");
  console.log("Fix build errors before committing.\n");
  process.exit(1);
}

console.log("All checks passed! Safe to commit.");
