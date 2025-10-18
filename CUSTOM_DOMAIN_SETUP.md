# Custom Domain Setup for Store Owners

This guide helps store owners configure custom domains for their stores on the ProGear Hub platform.

## Overview

Store owners can use their own custom domains instead of the default subdomain format. This allows for:
- Professional branding with your own domain
- Better SEO and search engine visibility
- Enhanced customer trust and credibility
- Custom email addresses (optional)

## Domain Options

### Subdomain Format (Default)
- `yourstore.progearhub.com`
- `yourstore.yourdomain.com`

### Custom Domain Format
- `yourstore.com`
- `www.yourstore.com`
- `shop.yourstore.com`

## Prerequisites

Before setting up a custom domain, you need:
1. A registered domain name
2. Access to your domain's DNS settings
3. A ProGear Hub store account
4. Store admin permissions

## Step-by-Step Setup

### 1. Purchase a Domain (if needed)

If you don't have a domain yet, purchase one from:
- **Namecheap**: Popular and affordable
- **GoDaddy**: Well-known registrar
- **Google Domains**: Simple and reliable
- **Cloudflare**: Good for advanced users

### 2. Access Store Settings

1. Log in to your ProGear Hub account
2. Navigate to your store dashboard
3. Go to **Settings** → **Domain**
4. Click **Add Custom Domain**

### 3. Add Your Domain

1. Enter your domain name (e.g., `yourstore.com`)
2. Click **Add Domain**
3. Note the verification instructions

### 4. Configure DNS Records

You need to add DNS records to verify ownership and point your domain to ProGear Hub.

#### Required DNS Records

Add these records in your domain's DNS management panel:

##### A Record (Root Domain)
```
Type: A
Name: @
Value: 76.76.19.61
TTL: 300 (or default)
```

##### CNAME Record (WWW)
```
Type: CNAME
Name: www
Value: your-store.vercel.app
TTL: 300 (or default)
```

##### CNAME Record (API)
```
Type: CNAME
Name: api
Value: your-backend.vercel.app
TTL: 300 (or default)
```

### 5. Verify Domain Ownership

1. Go back to your store settings
2. Click **Verify Domain**
3. Wait for DNS propagation (up to 24 hours)
4. Check verification status

### 6. Enable SSL Certificate

Once verified, ProGear Hub automatically:
- Issues an SSL certificate
- Enables HTTPS for your domain
- Configures secure redirects

## DNS Configuration Examples

### Cloudflare Setup

1. Add your domain to Cloudflare
2. Update nameservers at your registrar
3. Add DNS records in Cloudflare dashboard:

```
Type    Name    Content                    TTL
A       @       76.76.19.61                Auto
CNAME   www     your-store.vercel.app      Auto
CNAME   api     your-backend.vercel.app    Auto
```

### GoDaddy Setup

1. Log in to GoDaddy DNS management
2. Add the required records:

```
Type    Host    Points To                 TTL
A       @       76.76.19.61               1 Hour
CNAME   www     your-store.vercel.app     1 Hour
CNAME   api     your-backend.vercel.app   1 Hour
```

### Namecheap Setup

1. Access Advanced DNS settings
2. Add the required records:

```
Type    Host    Value                      TTL
A Record @       76.76.19.61               300 min
CNAME    www     your-store.vercel.app     300 min
CNAME    api     your-backend.vercel.app   300 min
```

## Verification Process

### Automatic Verification
ProGear Hub automatically checks for:
- Correct DNS record configuration
- Domain accessibility
- SSL certificate readiness

### Manual Verification
If automatic verification fails:

1. **Check DNS Propagation**
   ```bash
   # Check A record
   dig yourstore.com
   
   # Check CNAME record
   dig www.yourstore.com
   ```

2. **Verify Records**
   - Ensure A record points to `76.76.19.61`
   - Ensure CNAME records point to correct Vercel URLs
   - Check TTL values (300 seconds recommended)

3. **Wait for Propagation**
   - DNS changes can take up to 24 hours
   - Most changes propagate within 1-2 hours

## Common Issues and Solutions

### Issue: Domain Not Verifying

**Symptoms:**
- Verification fails after 24 hours
- "Domain not found" error

**Solutions:**
1. Double-check DNS records
2. Ensure no typos in domain name
3. Wait longer for DNS propagation
4. Contact support if issues persist

### Issue: SSL Certificate Not Issuing

**Symptoms:**
- Domain verifies but no SSL certificate
- "Not Secure" warning in browser

**Solutions:**
1. Wait up to 24 hours for certificate issuance
2. Check that domain is properly verified
3. Ensure DNS records are correct
4. Contact support for manual certificate

### Issue: Subdomain Not Working

**Symptoms:**
- Main domain works but subdomains don't
- API calls failing

**Solutions:**
1. Add CNAME record for `api` subdomain
2. Ensure API subdomain points to backend URL
3. Check CORS configuration
4. Verify all required DNS records

### Issue: Redirects Not Working

**Symptoms:**
- HTTP not redirecting to HTTPS
- WWW not redirecting properly

**Solutions:**
1. Wait for SSL certificate to be active
2. Check redirect configuration in store settings
3. Clear browser cache
4. Test in incognito mode

## Advanced Configuration

### Email Setup (Optional)

If you want custom email addresses:

1. **Add MX Records**
   ```
   Type: MX
   Name: @
   Value: mail.yourstore.com
   Priority: 10
   ```

2. **Configure Email Service**
   - Use G Suite, Office 365, or similar
   - Follow their DNS configuration guide

### Subdomain Management

For multiple subdomains:

1. **Add CNAME Records**
   ```
   Type: CNAME
   Name: blog
   Value: your-store.vercel.app
   
   Type: CNAME
   Name: shop
   Value: your-store.vercel.app
   ```

2. **Configure in Store Settings**
   - Add subdomains in store settings
   - Configure routing for each subdomain

### CDN Configuration

For better performance:

1. **Use Cloudflare**
   - Add domain to Cloudflare
   - Enable CDN features
   - Configure caching rules

2. **Optimize Images**
   - Use WebP format
   - Implement lazy loading
   - Configure image optimization

## Testing Your Setup

### 1. Basic Connectivity
```bash
# Test main domain
curl -I https://yourstore.com

# Test www subdomain
curl -I https://www.yourstore.com

# Test API subdomain
curl -I https://api.yourstore.com/graphql
```

### 2. SSL Certificate
```bash
# Check SSL certificate
openssl s_client -connect yourstore.com:443 -servername yourstore.com
```

### 3. DNS Resolution
```bash
# Check A record
nslookup yourstore.com

# Check CNAME records
nslookup www.yourstore.com
nslookup api.yourstore.com
```

### 4. Browser Testing
1. Open your domain in a browser
2. Check for SSL certificate (lock icon)
3. Test all store functionality
4. Verify API calls work
5. Test on mobile devices

## Maintenance and Monitoring

### Regular Checks
- Monitor domain expiration
- Check SSL certificate status
- Verify DNS record validity
- Test store functionality

### Updates and Changes
- Update DNS records when needed
- Renew domain registration
- Monitor for security issues
- Keep contact information current

### Support and Troubleshooting
- Check ProGear Hub status page
- Review DNS configuration
- Test with different DNS providers
- Contact support for complex issues

## Security Considerations

### SSL/TLS
- Always use HTTPS
- Monitor certificate expiration
- Use strong encryption
- Implement HSTS headers

### DNS Security
- Use DNSSEC if available
- Monitor for DNS hijacking
- Use reputable DNS providers
- Keep DNS records secure

### Domain Security
- Enable domain locking
- Use strong registrar passwords
- Enable two-factor authentication
- Monitor for unauthorized changes

## Cost Considerations

### Domain Registration
- Annual renewal fees: $10-15/year
- Premium domains: Higher costs
- Multi-year discounts available

### DNS Services
- Basic DNS: Usually free
- Advanced DNS: $5-20/month
- CDN services: $5-50/month

### SSL Certificates
- Included with ProGear Hub
- No additional cost
- Automatic renewal

## Best Practices

### Domain Selection
- Choose memorable names
- Avoid hyphens and numbers
- Consider international domains
- Check trademark availability

### DNS Management
- Use reliable DNS providers
- Keep records simple
- Document all changes
- Monitor DNS performance

### Security
- Enable all security features
- Use strong passwords
- Monitor for issues
- Keep software updated

## Support

### ProGear Hub Support
- **Email**: support@progearhub.com
- **Documentation**: [docs.progearhub.com](https://docs.progearhub.com)
- **Status Page**: [status.progearhub.com](https://status.progearhub.com)

### DNS Provider Support
- Contact your DNS provider for DNS-related issues
- Check their documentation and support resources
- Consider switching providers if needed

### Community Support
- **Discord**: [discord.gg/progearhub](https://discord.gg/progearhub)
- **GitHub**: [github.com/progearhub](https://github.com/progearhub)
- **Forum**: [community.progearhub.com](https://community.progearhub.com)

---

Need help? Contact our support team or check our comprehensive documentation for more detailed guides.
