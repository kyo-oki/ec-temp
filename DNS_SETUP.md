# DNS Configuration for Multi-tenant Subdomains

This guide explains how to configure DNS for multi-tenant subdomain routing with Vercel.

## Overview

The platform supports multi-tenant subdomains where each store gets its own subdomain:
- `yourdomain.com` - Main frontend
- `api.yourdomain.com` - Backend API
- `store1.yourdomain.com` - Store 1
- `store2.yourdomain.com` - Store 2
- `*.yourdomain.com` - Any store subdomain

## DNS Configuration

### 1. Main Domain Records

Add these records to your DNS provider:

```
Type    Name    Value                    TTL
A       @       <Vercel-IP-Address>      300
CNAME   www     your-project.vercel.app  300
```

### 2. API Subdomain

```
Type    Name    Value                    TTL
CNAME   api     your-backend.vercel.app  300
```

### 3. Wildcard Subdomain (Multi-tenant)

```
Type    Name    Value                    TTL
CNAME   *       your-frontend.vercel.app 300
```

## Vercel Configuration

### 1. Frontend Project

1. Go to your frontend project in Vercel dashboard
2. Go to Settings → Domains
3. Add your main domain: `yourdomain.com`
4. Add wildcard domain: `*.yourdomain.com`

### 2. Backend Project

1. Go to your backend project in Vercel dashboard
2. Go to Settings → Domains
3. Add API subdomain: `api.yourdomain.com`

## Environment Variables

### Frontend (.env.production)

```bash
VITE_GRAPHQL_ENDPOINT="https://api.yourdomain.com/graphql"
VITE_APP_URL="https://yourdomain.com"
```

### Backend (.env.production)

```bash
CORS_ORIGIN="https://yourdomain.com,https://*.yourdomain.com"
```

## Testing Subdomains

### Local Development

For local testing, add these entries to your `/etc/hosts` file:

```
127.0.0.1 yourdomain.localhost
127.0.0.1 api.yourdomain.localhost
127.0.0.1 store1.yourdomain.localhost
127.0.0.1 store2.yourdomain.localhost
```

Then access:
- `http://yourdomain.localhost:3000` - Frontend
- `http://api.yourdomain.localhost:3000` - Backend API
- `http://store1.yourdomain.localhost:3000` - Store 1

### Production Testing

1. Wait for DNS propagation (up to 24 hours)
2. Test main domain: `https://yourdomain.com`
3. Test API: `https://api.yourdomain.com/graphql`
4. Test subdomains: `https://store1.yourdomain.com`

## Troubleshooting

### Common Issues

1. **Subdomain not working**: Check wildcard DNS record
2. **CORS errors**: Verify CORS_ORIGIN includes wildcard
3. **SSL certificate issues**: Wait for Vercel to provision certificates
4. **DNS propagation**: Use `dig` or `nslookup` to check DNS

### DNS Propagation Check

```bash
# Check A record
dig yourdomain.com

# Check CNAME record
dig www.yourdomain.com

# Check wildcard
dig store1.yourdomain.com
```

### Vercel Domain Verification

1. Go to Vercel dashboard
2. Check domain status in Settings → Domains
3. Ensure all domains show "Valid Configuration"
4. Wait for SSL certificate provisioning

## Security Considerations

1. **HTTPS Only**: All subdomains should use HTTPS
2. **CORS Configuration**: Properly configure CORS for all subdomains
3. **Rate Limiting**: Consider rate limiting per subdomain
4. **Authentication**: Ensure proper tenant isolation

## Monitoring

Monitor these metrics:
- DNS resolution time
- SSL certificate status
- Subdomain availability
- CORS error rates
- API response times per subdomain
