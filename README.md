# E-Commerce Platform - Multi-Tenant SaaS

A modern, multi-tenant e-commerce platform built with NestJS, GraphQL, Prisma, and React.

## Project Structure

```
ecommerce-platform/
├── packages/
│   ├── web/              # React frontend (Vite)
│   └── backend/          # NestJS GraphQL API
├── docker-compose.yml    # PostgreSQL for local development
└── package.json          # Workspace configuration
```

## Prerequisites

- Node.js 20.x
- npm 10.x
- Docker & Docker Compose

## Getting Started

### 1. Install Dependencies

```bash
npm install
```

### 2. Start PostgreSQL Database

```bash
npm run docker:up
```

### 3. Set Up Backend Environment

```bash
cp packages/backend/.env.example packages/backend/.env
```

### 4. Run Database Migrations (Coming in Task 2)

```bash
npm run prisma:migrate
```

### 5. Start Development Servers

**Start both frontend and backend:**

```bash
npm run dev:all
```

**Or start individually:**

```bash
# Frontend only (http://localhost:5173)
npm run dev

# Backend only (http://localhost:3000)
npm run dev:backend
```

## Available Scripts

### Root Level

- `npm run dev` - Start frontend dev server
- `npm run dev:backend` - Start backend dev server
- `npm run dev:all` - Start both frontend and backend
- `npm run build` - Build all packages
- `npm run lint` - Lint all packages
- `npm run type-check` - Type check all packages
- `npm run docker:up` - Start Docker containers
- `npm run docker:down` - Stop Docker containers
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:studio` - Open Prisma Studio

### Frontend (packages/web)

- `npm run dev --workspace=packages/web` - Start dev server
- `npm run build --workspace=packages/web` - Build for production
- `npm run lint --workspace=packages/web` - Lint code
- `npm run type-check --workspace=packages/web` - Type check

### Backend (packages/backend)

- `npm run start:dev --workspace=packages/backend` - Start dev server
- `npm run build --workspace=packages/backend` - Build for production
- `npm run lint --workspace=packages/backend` - Lint code
- `npm run type-check --workspace=packages/backend` - Type check

## Tech Stack

### Frontend

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Apollo Client (coming soon)

### Backend

- NestJS 11
- GraphQL with Apollo Server (coming soon)
- Prisma ORM (coming soon)
- PostgreSQL 16
- TypeScript

### Infrastructure

- Docker & Docker Compose (local development)
- Vercel (production deployment)

## Development Workflow

1. **Task 1 ✅**: Monorepo structure and Docker environment
2. **Task 2**: Prisma schema and database migrations
3. **Task 3**: GraphQL setup
4. **Task 4**: Authentication and user management
5. **Task 5**: Store management
6. **Task 6**: Tenant context and isolation
   7-13. Feature modules (products, orders, blog, etc.)
7. File uploads
8. Database seeding
   16-17. Frontend integration
9. Vercel deployment
10. Documentation

## Database

PostgreSQL runs in Docker for local development:

- Host: `localhost`
- Port: `5432`
- Database: `ecommerce_dev`
- User: `ecommerce`
- Password: `ecommerce_dev_password`

## Environment Variables

### Backend (.env)

```
NODE_ENV=development
PORT=3000
DATABASE_URL=postgresql://ecommerce:ecommerce_dev_password@localhost:5432/ecommerce_dev
CORS_ORIGIN=http://localhost:5173
JWT_SECRET=dev_jwt_secret_12345
JWT_EXPIRES_IN=7d
```

## License

UNLICENSED - Private Project
