#!/usr/bin/env node

/**
 * Vercel build script for backend
 * Handles Prisma generation and database migrations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function build() {
  try {
    console.log('🏗️ Starting Vercel build process...');
    
    // Install dependencies
    console.log('📦 Installing dependencies...');
    execSync('pnpm install --frozen-lockfile', { stdio: 'inherit' });

    // Generate Prisma client
    console.log('🔧 Generating Prisma client...');
    execSync('npx prisma generate', { stdio: 'inherit' });

    // Build the application
    console.log('🏗️ Building application...');
    execSync('pnpm build', { stdio: 'inherit' });

    // Run migrations if DATABASE_URL is available
    if (process.env.DATABASE_URL) {
      console.log('🗄️ Running database migrations...');
      try {
        execSync('npx prisma migrate deploy', { stdio: 'inherit' });
        console.log('✅ Database migrations completed');
      } catch (error) {
        console.warn('⚠️ Migration failed (this might be expected for new deployments):', error.message);
      }
    } else {
      console.log('⚠️ No DATABASE_URL found, skipping migrations');
    }

    console.log('✅ Build completed successfully!');
  } catch (error) {
    console.error('❌ Build failed:', error.message);
    process.exit(1);
  }
}

build();
