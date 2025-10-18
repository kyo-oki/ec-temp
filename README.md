# ProGear Hub - Multi-tenant E-commerce Platform

A modern, scalable e-commerce platform built with NestJS, React, and GraphQL, featuring multi-tenant architecture with subdomain-based store isolation.

## 🚀 Features

### Core Platform
- **Multi-tenant Architecture**: Each store gets its own subdomain and isolated data
- **GraphQL API**: Type-safe API with real-time subscriptions
- **Modern Frontend**: React with TypeScript and Tailwind CSS
- **Authentication**: JWT-based authentication with role management
- **File Storage**: Integrated file upload with Vercel Blob support

### Store Management
- **Store Creation**: Easy store setup with custom slugs and subdomains
- **Product Management**: Full CRUD operations for products with variants
- **Order Management**: Complete order processing with status tracking
- **Inventory Management**: Stock tracking and low-stock alerts
- **Review System**: Customer reviews with moderation

### Content Management
- **Blog System**: Content management with categories and tags
- **FAQ Management**: Dynamic FAQ system with reordering
- **About Pages**: Customizable store information pages
- **Contact Forms**: Customer inquiry management
- **Promotions**: Discount and promotion management

### Multi-tenant Features
- **Subdomain Routing**: `store1.yourdomain.com`, `store2.yourdomain.com`
- **Data Isolation**: Complete tenant data separation
- **Custom Domains**: Store owners can use their own domains
- **Tenant Context**: Automatic tenant resolution from subdomains

## 🏗️ Architecture

### Backend (NestJS + GraphQL)
- **Framework**: NestJS with Apollo Server
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT with Passport.js
- **File Storage**: Vercel Blob for production, local storage for development
- **Multi-tenancy**: Subdomain-based tenant isolation

### Frontend (React + TypeScript)
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui components
- **State Management**: Apollo Client for GraphQL
- **Routing**: React Router with protected routes
- **Build Tool**: Vite for fast development and building

### Infrastructure
- **Deployment**: Vercel for both frontend and backend
- **Database**: Vercel Postgres for production
- **File Storage**: Vercel Blob for production
- **DNS**: Wildcard subdomain support
- **SSL**: Automatic SSL certificate management

## 📁 Project Structure

```
progearhub/
├── packages/
│   ├── backend/                 # NestJS GraphQL API
│   │   ├── src/
│   │   │   ├── auth/           # Authentication module
│   │   │   ├── store/          # Store management
│   │   │   ├── tenant/         # Multi-tenant context
│   │   │   ├── products/       # Product management
│   │   │   ├── orders/         # Order management
│   │   │   ├── blog/           # Blog management
│   │   │   ├── faq/            # FAQ management
│   │   │   ├── about/          # About page management
│   │   │   ├── contact/        # Contact form management
│   │   │   ├── promotions/     # Promotion management
│   │   │   ├── upload/         # File upload service
│   │   │   └── prisma/         # Database schema and migrations
│   │   ├── prisma/             # Database migrations and seed
│   │   └── scripts/            # Deployment scripts
│   └── web/                    # React frontend
│       ├── src/
│       │   ├── components/     # Reusable UI components
│       │   ├── pages/          # Page components
│       │   ├── hooks/          # Custom React hooks
│       │   ├── lib/            # Utilities and GraphQL client
│       │   └── contexts/       # React contexts
│       └── public/             # Static assets
├── docker-compose.yml          # Local development setup
├── vercel.json                 # Vercel deployment config
├── DEPLOYMENT.md              # Deployment guide
├── DNS_SETUP.md               # DNS configuration guide
└── README.md                  # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and pnpm
- Docker and Docker Compose
- Git

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd progearhub
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Start the database**
   ```bash
   docker-compose up -d
   ```

4. **Set up environment variables**
   ```bash
   cp packages/backend/.env.example packages/backend/.env
   # Edit the .env file with your database URL
   ```

5. **Run database migrations**
   ```bash
   pnpm -C packages/backend prisma migrate dev
   ```

6. **Seed the database**
   ```bash
   pnpm -C packages/backend prisma:seed
   ```

7. **Start the backend**
   ```bash
   pnpm -C packages/backend start:dev
   ```

8. **Start the frontend**
   ```bash
   pnpm -C packages/web dev
   ```

9. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000/graphql
   - GraphQL Playground: http://localhost:3000/graphql

### Production Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions.

## 🔧 Environment Variables

### Backend (.env)
```bash
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/ecommerce_dev"

# CORS
CORS_ORIGIN="http://localhost:5173"

# GraphQL
GRAPHQL_PLAYGROUND="true"
GRAPHQL_INTROSPECTION="true"

# Server
PORT=3000

# JWT
JWT_SECRET="your-jwt-secret"

# File Upload (Production)
BLOB_READ_WRITE_TOKEN="your-vercel-blob-token"
```

### Frontend (.env)
```bash
# GraphQL Endpoint
VITE_GRAPHQL_ENDPOINT="http://localhost:3000/graphql"

# App URL
VITE_APP_URL="http://localhost:5173"
```

## 📚 API Documentation

### GraphQL Schema

The API uses GraphQL with the following main types:

- **User**: Authentication and user management
- **Store**: Store information and settings
- **Product**: Product catalog with variants
- **Order**: Order management and tracking
- **Review**: Product reviews and ratings
- **BlogPost**: Blog content management
- **FAQ**: Frequently asked questions
- **About**: Store about page content
- **Contact**: Contact form submissions
- **Promotion**: Discounts and promotions

### Example Queries

```graphql
# Get products
query GetProducts {
  products {
    id
    name
    price
    description
    images
  }
}

# Create a store
mutation CreateStore($input: CreateStoreInput!) {
  createStore(input: $input) {
    id
    name
    slug
    subdomain
  }
}

# Sign up
mutation SignUp($input: SignUpInput!) {
  signUp(input: $input) {
    accessToken
    user {
      id
      email
      name
    }
  }
}
```

See [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) for complete API reference.

## 🏪 Multi-tenant Architecture

### Subdomain Routing
- `yourdomain.com` - Main platform
- `api.yourdomain.com` - Backend API
- `store1.yourdomain.com` - Store 1
- `store2.yourdomain.com` - Store 2

### Tenant Isolation
- Each store has its own data namespace
- Automatic tenant resolution from subdomains
- Isolated product catalogs, orders, and content
- Shared authentication across all stores

### Custom Domains
Store owners can configure custom domains:
- `store1.com` → `store1.yourdomain.com`
- DNS verification required
- Automatic SSL certificate provisioning

## 🛠️ Development

### Available Scripts

#### Backend
```bash
pnpm -C packages/backend start:dev    # Start development server
pnpm -C packages/backend build        # Build for production
pnpm -C packages/backend test         # Run tests
pnpm -C packages/backend lint         # Run linter
pnpm -C packages/backend prisma:studio # Open Prisma Studio
```

#### Frontend
```bash
pnpm -C packages/web dev              # Start development server
pnpm -C packages/web build            # Build for production
pnpm -C packages/web preview          # Preview production build
pnpm -C packages/web lint             # Run linter
```

#### Database
```bash
pnpm -C packages/backend prisma migrate dev    # Run migrations
pnpm -C packages/backend prisma generate       # Generate Prisma client
pnpm -C packages/backend prisma:seed           # Seed database
```

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code linting and formatting
- **Prettier**: Code formatting
- **Husky**: Pre-commit hooks
- **Jest**: Unit and integration testing

## 🚀 Deployment

### Vercel Deployment
1. Connect your GitHub repository to Vercel
2. Configure environment variables
3. Deploy backend and frontend separately
4. Set up custom domains and DNS

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed instructions.

### Environment Setup
- **Development**: Docker Compose with local PostgreSQL
- **Production**: Vercel Postgres with connection pooling
- **File Storage**: Vercel Blob for production, local storage for development

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Update documentation as needed
- Use conventional commit messages

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Documentation**: Check the docs folder for detailed guides
- **Issues**: Create an issue on GitHub
- **Discussions**: Use GitHub Discussions for questions

## 🗺️ Roadmap

- [ ] Advanced analytics and reporting
- [ ] Payment gateway integration
- [ ] Email marketing integration
- [ ] Mobile app (React Native)
- [ ] Advanced inventory management
- [ ] Multi-language support
- [ ] Advanced SEO features
- [ ] API rate limiting and caching

---

Built with ❤️ using NestJS, React, GraphQL, and Vercel.