# Development Setup Guide

This guide covers setting up the ProGear Hub development environment from scratch.

## Prerequisites

### Required Software
- **Node.js**: Version 18 or higher
- **pnpm**: Package manager (install with `npm install -g pnpm`)
- **Docker**: For local database
- **Docker Compose**: For orchestrating services
- **Git**: Version control

### Optional Software
- **VS Code**: Recommended editor with extensions
- **Postman**: For API testing
- **TablePlus**: Database management
- **Prisma Studio**: Database GUI (included)

## Quick Start

### 1. Clone Repository
```bash
git clone <repository-url>
cd progearhub
```

### 2. Install Dependencies
```bash
# Install all dependencies for both packages
pnpm install
```

### 3. Environment Setup
```bash
# Copy environment template
cp packages/backend/.env.example packages/backend/.env

# Edit the environment file
nano packages/backend/.env
```

### 4. Start Database
```bash
# Start PostgreSQL with Docker Compose
docker-compose up -d

# Verify database is running
docker-compose ps
```

### 5. Database Setup
```bash
# Run database migrations
pnpm -C packages/backend prisma migrate dev

# Generate Prisma client
pnpm -C packages/backend prisma generate

# Seed the database with sample data
pnpm -C packages/backend prisma:seed
```

### 6. Start Development Servers
```bash
# Terminal 1: Start backend
pnpm -C packages/backend start:dev

# Terminal 2: Start frontend
pnpm -C packages/web dev
```

### 7. Access Applications
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/graphql
- **GraphQL Playground**: http://localhost:3000/graphql

## Detailed Setup

### Backend Setup

#### 1. Environment Configuration
Create `packages/backend/.env`:
```bash
# Database
DATABASE_URL="postgresql://ecommerce:ecommerce_dev_password@localhost:5432/ecommerce_dev?schema=public"

# CORS
CORS_ORIGIN="http://localhost:5173"

# GraphQL
GRAPHQL_PLAYGROUND="true"
GRAPHQL_INTROSPECTION="true"

# Server
PORT=3000

# JWT (generate a secure secret)
JWT_SECRET="your-super-secret-jwt-key-here"

# File Upload (Development - optional)
BLOB_READ_WRITE_TOKEN=""
```

#### 2. Database Setup
```bash
# Navigate to backend directory
cd packages/backend

# Run migrations
pnpm prisma migrate dev

# Generate Prisma client
pnpm prisma generate

# Open Prisma Studio (optional)
pnpm prisma:studio
```

#### 3. Start Backend
```bash
# Development mode with hot reload
pnpm start:dev

# Or build and run
pnpm build
pnpm start:prod
```

### Frontend Setup

#### 1. Environment Configuration
Create `packages/web/.env`:
```bash
# GraphQL Endpoint
VITE_GRAPHQL_ENDPOINT="http://localhost:3000/graphql"

# App URL
VITE_APP_URL="http://localhost:5173"
```

#### 2. Start Frontend
```bash
# Navigate to web directory
cd packages/web

# Development mode
pnpm dev

# Or build and preview
pnpm build
pnpm preview
```

## Docker Development

### Using Docker Compose

The project includes a `docker-compose.yml` for local development:

```yaml
version: '3.8'
services:
  postgres:
    image: postgres:15
    environment:
      POSTGRES_USER: ecommerce
      POSTGRES_PASSWORD: ecommerce_dev_password
      POSTGRES_DB: ecommerce_dev
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data

volumes:
  postgres_data:
```

### Docker Commands
```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs postgres

# Reset database
docker-compose down -v
docker-compose up -d
```

## Database Management

### Prisma Commands
```bash
# Navigate to backend directory
cd packages/backend

# Create new migration
pnpm prisma migrate dev --name migration_name

# Reset database
pnpm prisma migrate reset

# Generate Prisma client
pnpm prisma generate

# Open Prisma Studio
pnpm prisma:studio

# Seed database
pnpm prisma:seed
```

### Database Schema
The database schema is defined in `packages/backend/prisma/schema.prisma`:

- **User**: Authentication and user management
- **Store**: Store information and settings
- **Product**: Product catalog
- **Order**: Order management
- **Review**: Product reviews
- **BlogPost**: Blog content
- **FAQ**: Frequently asked questions
- **About**: Store about pages
- **Contact**: Contact form submissions
- **Promotion**: Discounts and promotions

## Development Workflow

### 1. Feature Development
```bash
# Create feature branch
git checkout -b feature/new-feature

# Make changes
# ... code changes ...

# Run tests
pnpm -C packages/backend test
pnpm -C packages/web test

# Run linting
pnpm -C packages/backend lint
pnpm -C packages/web lint

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push origin feature/new-feature
```

### 2. Database Changes
```bash
# Modify schema.prisma
# ... schema changes ...

# Create migration
pnpm -C packages/backend prisma migrate dev --name add_new_field

# Update Prisma client
pnpm -C packages/backend prisma generate

# Update seed data if needed
pnpm -C packages/backend prisma:seed
```

### 3. API Development
```bash
# Add new resolver
# ... resolver code ...

# Add new DTOs
# ... DTO code ...

# Test in GraphQL Playground
# Visit http://localhost:3000/graphql
```

### 4. Frontend Development
```bash
# Add new components
# ... component code ...

# Add new pages
# ... page code ...

# Test in browser
# Visit http://localhost:5173
```

## Testing

### Backend Testing
```bash
# Unit tests
pnpm -C packages/backend test

# E2E tests
pnpm -C packages/backend test:e2e

# Test coverage
pnpm -C packages/backend test:cov

# Watch mode
pnpm -C packages/backend test:watch
```

### Frontend Testing
```bash
# Run tests
pnpm -C packages/web test

# Watch mode
pnpm -C packages/web test:watch

# Coverage
pnpm -C packages/web test:coverage
```

## Code Quality

### Linting
```bash
# Backend linting
pnpm -C packages/backend lint

# Frontend linting
pnpm -C packages/web lint

# Fix linting issues
pnpm -C packages/backend lint --fix
pnpm -C packages/web lint --fix
```

### Type Checking
```bash
# Backend type checking
pnpm -C packages/backend type-check

# Frontend type checking
pnpm -C packages/web type-check
```

### Pre-commit Hooks
The project uses Husky for pre-commit hooks:
- TypeScript compilation check
- ESLint checks
- Prettier formatting

## Debugging

### Backend Debugging
```bash
# Start with debugger
pnpm -C packages/backend start:debug

# Attach debugger in VS Code
# Use "Attach to Node Process" configuration
```

### Frontend Debugging
```bash
# Start with source maps
pnpm -C packages/web dev

# Use browser dev tools
# React DevTools extension recommended
```

### Database Debugging
```bash
# Open Prisma Studio
pnpm -C packages/backend prisma:studio

# Connect with external tool
# Use connection string from .env
```

## Common Issues

### Database Connection Issues
```bash
# Check if PostgreSQL is running
docker-compose ps

# Restart database
docker-compose restart postgres

# Check logs
docker-compose logs postgres
```

### Port Conflicts
```bash
# Check if ports are in use
lsof -i :3000
lsof -i :5173
lsof -i :5432

# Kill processes using ports
kill -9 <PID>
```

### Dependency Issues
```bash
# Clear node_modules and reinstall
rm -rf node_modules packages/*/node_modules
pnpm install

# Clear pnpm cache
pnpm store prune
```

### Environment Issues
```bash
# Check environment variables
echo $DATABASE_URL

# Verify .env files exist
ls -la packages/backend/.env
ls -la packages/web/.env
```

## Performance Optimization

### Backend Optimization
- Use database indexes
- Implement query optimization
- Add caching where appropriate
- Monitor memory usage

### Frontend Optimization
- Use React.memo for expensive components
- Implement code splitting
- Optimize bundle size
- Use lazy loading

### Database Optimization
- Regular VACUUM and ANALYZE
- Monitor query performance
- Use connection pooling
- Implement read replicas for scaling

## Monitoring and Logging

### Backend Logging
```bash
# View application logs
pnpm -C packages/backend start:dev

# Log levels: error, warn, info, debug
```

### Database Monitoring
```bash
# Monitor database performance
pnpm -C packages/backend prisma:studio

# Check database size
docker exec -it progearhub_postgres_1 psql -U ecommerce -d ecommerce_dev -c "SELECT pg_size_pretty(pg_database_size('ecommerce_dev'));"
```

## Contributing

### Code Style
- Follow TypeScript best practices
- Use meaningful variable names
- Add JSDoc comments for complex functions
- Keep functions small and focused

### Git Workflow
- Use conventional commit messages
- Create feature branches
- Write descriptive PR descriptions
- Keep commits atomic

### Testing Requirements
- Write unit tests for new features
- Add integration tests for API endpoints
- Test error scenarios
- Maintain test coverage above 80%

## Resources

### Documentation
- [NestJS Documentation](https://docs.nestjs.com/)
- [React Documentation](https://react.dev/)
- [GraphQL Documentation](https://graphql.org/)
- [Prisma Documentation](https://www.prisma.io/docs/)
- [Vercel Documentation](https://vercel.com/docs)

### Tools
- [GraphQL Playground](https://www.graphqlplayground.com/)
- [Apollo Studio](https://studio.apollographql.com/)
- [Prisma Studio](https://www.prisma.io/studio)
- [React DevTools](https://react.dev/learn/react-developer-tools)

### Community
- [NestJS Discord](https://discord.gg/nestjs)
- [React Community](https://react.dev/community)
- [GraphQL Community](https://graphql.org/community/)
