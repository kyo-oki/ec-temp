# Vercel Deployment Guide

This comprehensive guide covers deploying the ProGear Hub e-commerce platform to Vercel, including production setup, monitoring, and maintenance.

## Prerequisites

- Vercel account (free tier available)
- GitHub repository connected to Vercel
- Domain name (optional, for custom domain)
- Basic understanding of DNS configuration

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
- [ ] Monitoring and logging configured
- [ ] Backup strategy implemented
- [ ] Performance optimization applied
- [ ] Security headers configured

## Monitoring and Maintenance

### Performance Monitoring
- Monitor API response times
- Track database query performance
- Monitor file upload success rates
- Set up alerts for high error rates

### Security Monitoring
- Monitor failed authentication attempts
- Track suspicious API usage
- Monitor file upload patterns
- Set up security alerts

### Database Maintenance
- Regular backup verification
- Monitor database size and growth
- Optimize slow queries
- Update database indexes as needed

### Application Updates
- Regular dependency updates
- Security patch deployment
- Feature updates and bug fixes
- Database migration testing

## Scaling Considerations

### Horizontal Scaling
- Use Vercel's automatic scaling
- Implement database connection pooling
- Consider read replicas for heavy read workloads
- Use CDN for static assets

### Vertical Scaling
- Upgrade Vercel plan as needed
- Optimize database queries
- Implement caching strategies
- Monitor resource usage

### Cost Optimization
- Monitor Vercel usage and costs
- Optimize database queries
- Use appropriate file storage tiers
- Implement efficient caching

## Security Best Practices

### Environment Security
- Use strong, unique secrets
- Rotate secrets regularly
- Limit environment variable access
- Use Vercel's secret management

### API Security
- Implement rate limiting
- Use HTTPS everywhere
- Validate all inputs
- Implement proper error handling

### Database Security
- Use connection pooling
- Implement proper access controls
- Regular security audits
- Monitor for suspicious activity

## Backup and Recovery

### Database Backups
- Vercel Postgres automatic backups
- Regular backup verification
- Test restore procedures
- Document recovery processes

### File Storage Backups
- Vercel Blob redundancy
- Regular backup verification
- Cross-region replication
- Disaster recovery planning

## Support and Resources

### Vercel Support
- Vercel documentation
- Vercel community forum
- Vercel support tickets
- Vercel status page

### ProGear Hub Support
- GitHub issues
- Discord community
- Email support
- Documentation updates

### Third-party Services
- PostgreSQL documentation
- Prisma documentation
- GraphQL best practices
- React deployment guides
