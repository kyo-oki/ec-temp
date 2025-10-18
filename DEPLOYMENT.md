# Vercel Deployment Guide

This guide covers deploying the ProGear Hub e-commerce platform to Vercel.

## Prerequisites

- Vercel account
- GitHub repository connected to Vercel
- Domain name (optional, for custom domain)

## Environment Variables

Set these environment variables in your Vercel dashboard:

### Backend Environment Variables

```bash
# Database
DATABASE_URL="postgresql://username:password@host:port/database?schema=public"

# CORS
CORS_ORIGIN="https://yourdomain.com"

# GraphQL
GRAPHQL_PLAYGROUND="false"
GRAPHQL_INTROSPECTION="true"

# Server
PORT=3000

# JWT
JWT_SECRET="your-super-secret-jwt-key-here"

# File Upload (Vercel Blob)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

### Frontend Environment Variables

```bash
# GraphQL Endpoint
VITE_GRAPHQL_ENDPOINT="https://your-backend.vercel.app/graphql"

# App URL
VITE_APP_URL="https://yourdomain.com"
```

## Deployment Steps

### 1. Backend Deployment

1. Create a new Vercel project
2. Connect your GitHub repository
3. Set the root directory to `packages/backend`
4. Configure build settings:
   - Build Command: `pnpm build`
   - Output Directory: `dist`
   - Install Command: `pnpm install`
5. Add environment variables
6. Deploy

### 2. Frontend Deployment

1. Create a new Vercel project
2. Connect your GitHub repository
3. Set the root directory to `packages/web`
4. Configure build settings:
   - Build Command: `pnpm build`
   - Output Directory: `build`
   - Install Command: `pnpm install`
5. Add environment variables
6. Deploy

### 3. Database Setup

1. Enable Vercel Postgres addon
2. Run Prisma migrations:
   ```bash
   pnpm -C packages/backend prisma migrate deploy
   ```
3. Generate Prisma client:
   ```bash
   pnpm -C packages/backend prisma generate
   ```

### 4. File Storage Setup

1. Enable Vercel Blob addon
2. Get the `BLOB_READ_WRITE_TOKEN`
3. Add it to your backend environment variables

### 5. Custom Domain Setup

1. Add your domain to Vercel project
2. Configure DNS:
   - A record: `@` → Vercel IP
   - CNAME record: `www` → your-project.vercel.app
   - CNAME record: `*` → your-project.vercel.app (for subdomains)
3. Enable SSL certificate

## Multi-tenant Subdomain Routing

The platform supports multi-tenant subdomains:

- `yourdomain.com` - Main frontend
- `api.yourdomain.com` - Backend API
- `store1.yourdomain.com` - Store 1
- `store2.yourdomain.com` - Store 2

Configure wildcard DNS (`*.yourdomain.com`) to point to your Vercel deployment.

## Build Commands

### Backend
```bash
cd packages/backend
pnpm install
pnpm build
```

### Frontend
```bash
cd packages/web
pnpm install
pnpm build
```

## Troubleshooting

### Common Issues

1. **Build Failures**: Check that all dependencies are installed
2. **Database Connection**: Verify DATABASE_URL is correct
3. **CORS Issues**: Ensure CORS_ORIGIN matches your frontend URL
4. **File Upload**: Verify BLOB_READ_WRITE_TOKEN is set

### Logs

Check Vercel function logs for backend issues:
- Go to Vercel dashboard
- Select your project
- Go to Functions tab
- View logs for debugging

## Production Checklist

- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] File storage configured
- [ ] Custom domain set up
- [ ] SSL certificate enabled
- [ ] CORS configured correctly
- [ ] JWT secret is secure
- [ ] GraphQL playground disabled in production
