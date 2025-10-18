#!/usr/bin/env node

/**
 * Deploy Prisma migrations to production database
 * This script should be run in Vercel's build process
 */

const { execSync } = require('child_process');
const path = require('path');

async function deployMigrations() {
  try {
    console.log('🚀 Starting Prisma migration deployment...');
    
    // Check if DATABASE_URL is set
    if (!process.env.DATABASE_URL) {
      throw new Error('DATABASE_URL environment variable is not set');
    }

    // Generate Prisma client
    console.log('📦 Generating Prisma client...');
    execSync('npx prisma generate', { 
      stdio: 'inherit',
      cwd: __dirname 
    });

    // Deploy migrations
    console.log('🗄️ Deploying database migrations...');
    execSync('npx prisma migrate deploy', { 
      stdio: 'inherit',
      cwd: __dirname 
    });

    console.log('✅ Database migrations deployed successfully!');
  } catch (error) {
    console.error('❌ Migration deployment failed:', error.message);
    process.exit(1);
  }
}

deployMigrations();
