# GraphQL API Reference

This document provides a comprehensive reference for the ProGear Hub GraphQL API.

## Base URL

- **Development**: `http://localhost:3001/graphql`
- **Production**: `https://api.yourdomain.com/graphql`

## Interactive Documentation

- **GraphQL Playground**: http://localhost:3001/graphql
- **GraphQL Introspection**: Enabled (allows schema exploration)

## Authentication

All protected endpoints require a JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

## Available Queries

### Authentication

```graphql
# Get current user
query Me {
  me {
    id
    email
    name
    storeId
  }
}
```

### Store Management

```graphql
# Get user's stores
query MyStores {
  myStores {
    id
    name
    slug
    subdomain
    customDomain
    customDomainVerified
    createdAt
  }
}

# Get current store
query CurrentStore {
  currentStore {
    id
    name
    slug
    subdomain
    settings
  }
}
```

### Product Management

```graphql
# Get products with filtering and pagination
query Products(
  $filter: ProductFilterInput
  $pagination: PaginationInput
  $sortBy: String
  $sortOrder: String
) {
  products(
    filter: $filter
    pagination: $pagination
    sortBy: $sortBy
    sortOrder: $sortOrder
  ) {
    id
    name
    description
    price
    stock
    category
    images
    isActive
    createdAt
    updatedAt
  }
}

# Get single product
query Product($id: String!) {
  product(id: $id) {
    id
    name
    description
    price
    stock
    category
    images
    isActive
    createdAt
    updatedAt
    reviews {
      id
      rating
      comment
      customerName
      createdAt
    }
  }
}

# Get product reviews
query ProductReviews($productId: String!) {
  productReviews(productId: $productId) {
    id
    customerName
    rating
    comment
    isApproved
    createdAt
  }
}

# Get featured reviews for homepage
query FeaturedReviews($limit: Int = 3) {
  featuredReviews(limit: $limit) {
    id
    rating
    comment
    customerName
    createdAt
    product {
      id
      name
    }
  }
}
```

### Order Management

```graphql
# Get orders
query Orders($filter: OrderFilterInput, $pagination: PaginationInput) {
  orders(filter: $filter, pagination: $pagination) {
    id
    orderNumber
    totalAmount
    status
    createdAt
    orderItems {
      id
      productId
      quantity
      price
    }
  }
}
```

### Content Management

```graphql
# Get blog posts
query PublishedBlogPosts(
  $filter: BlogFilterInput
  $pagination: PaginationInput
) {
  publishedBlogPosts(filter: $filter, pagination: $pagination) {
    id
    title
    content
    category
    thumbnail
    createdAt
  }
}

# Get single blog post
query BlogPost($id: String!) {
  blogPost(id: $id) {
    id
    title
    content
    category
    thumbnail
    isPublished
    createdAt
    updatedAt
  }
}

# Get FAQs
query Faqs {
  faqs {
    id
    question
    answer
    displayOrder
    createdAt
    updatedAt
  }
}

# Get about page
query About {
  about {
    id
    philosophy
    vision
    offerings
    updatedAt
  }
}

# Get active promotions
query ActivePromotions {
  activePromotions {
    id
    title
    description
    discountPercentage
    startDate
    endDate
    isActive
    createdAt
    updatedAt
  }
}
```

## Available Mutations

### Authentication

```graphql
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

# Sign in
mutation SignIn($input: SignInInput!) {
  signIn(input: $input) {
    accessToken
    user {
      id
      email
      name
      storeId
    }
  }
}
```

### Store Management

```graphql
# Create store
mutation CreateStore($input: CreateStoreInput!) {
  createStore(input: $input) {
    id
    name
    slug
    subdomain
  }
}

# Update store
mutation UpdateStore($id: String!, $input: UpdateStoreInput!) {
  updateStore(id: $id, input: $input) {
    id
    name
    settings
  }
}
```

### Product Management

```graphql
# Create product
mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    id
    name
    price
    stock
  }
}

# Update product
mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {
  updateProduct(id: $id, input: $input) {
    id
    name
    price
    stock
  }
}

# Delete product
mutation DeleteProduct($id: String!) {
  deleteProduct(id: $id) {
    id
    name
  }
}

# Create review
mutation CreateReview($productId: String!, $input: CreateReviewInput!) {
  createReview(productId: $productId, input: $input) {
    id
    rating
    comment
    customerName
  }
}
```

### Order Management

```graphql
# Create order
mutation CreateOrder($input: CreateOrderInput!) {
  createOrder(input: $input) {
    id
    orderNumber
    totalAmount
    status
    orderItems {
      id
      productId
      quantity
      price
    }
  }
}

# Update order
mutation UpdateOrder($id: String!, $input: UpdateOrderInput!) {
  updateOrder(id: $id, input: $input) {
    id
    status
    updatedAt
  }
}
```

### Content Management

```graphql
# Create blog post
mutation CreateBlogPost($input: CreateBlogPostInput!) {
  createBlogPost(input: $input) {
    id
    title
    content
    category
    isPublished
  }
}

# Create FAQ
mutation CreateFAQ($input: CreateFAQInput!) {
  createFAQ(input: $input) {
    id
    question
    answer
    displayOrder
  }
}

# Update about page
mutation UpdateAbout($input: UpdateAboutInput!) {
  updateAbout(input: $input) {
    id
    philosophy
    vision
    offerings
  }
}

# Create contact
mutation CreateContact($input: CreateContactInput!) {
  createContact(input: $input) {
    id
    name
    email
    subject
    message
    createdAt
  }
}
```

### File Upload

```graphql
# Upload file
mutation UploadFile($file: Upload!) {
  uploadFile(file: $file) {
    filename
    mimetype
    encoding
    url
  }
}
```

## Input Types

### Authentication Inputs

```graphql
input SignUpInput {
  email: String!
  password: String!
  name: String!
}

input SignInInput {
  email: String!
  password: String!
}
```

### Store Inputs

```graphql
input CreateStoreInput {
  name: String!
  slug: String!
  subdomain: String!
  description: String
}

input UpdateStoreInput {
  name: String
  description: String
  settings: String
  customDomain: String
}
```

### Product Inputs

```graphql
input CreateProductInput {
  name: String!
  description: String!
  price: Float!
  stock: Int!
  category: String!
  images: [String!]!
  isActive: Boolean = true
}

input UpdateProductInput {
  name: String
  description: String
  price: Float
  stock: Int
  category: String
  images: [String!]
  isActive: Boolean
}

input ProductFilterInput {
  category: String
  minPrice: Float
  maxPrice: Float
  search: String
  isActive: Boolean
}

input CreateReviewInput {
  rating: Int!
  comment: String!
  customerName: String!
}
```

### Order Inputs

```graphql
input CreateOrderInput {
  orderItems: [OrderItemInput!]!
}

input OrderItemInput {
  productId: String!
  quantity: Int!
}

input UpdateOrderInput {
  status: OrderStatus
}

input OrderFilterInput {
  status: OrderStatus
  startDate: DateTime
  endDate: DateTime
}
```

### Content Inputs

```graphql
input CreateBlogPostInput {
  title: String!
  content: String!
  category: String!
  thumbnail: String
  isPublished: Boolean = false
}

input CreateFAQInput {
  question: String!
  answer: String!
  displayOrder: Int = 0
}

input UpdateAboutInput {
  philosophy: String
  vision: String
  offerings: String
}

input CreateContactInput {
  name: String!
  email: String!
  subject: String!
  message: String!
}
```

### Pagination Input

```graphql
input PaginationInput {
  limit: Int = 10
  offset: Int = 0
}
```

## Response Types

### Core Types

```graphql
type User {
  id: ID!
  email: String!
  name: String!
  storeId: String
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Store {
  id: ID!
  name: String!
  slug: String!
  subdomain: String!
  ownerId: String!
  settings: String!
  customDomain: String
  customDomainVerified: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}

type Product {
  id: ID!
  storeId: String!
  name: String!
  description: String!
  price: Float!
  stock: Int!
  category: String!
  images: [String!]!
  isActive: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
  reviews: [Review!]
}

type Review {
  id: ID!
  productId: String!
  customerName: String!
  rating: Int!
  comment: String!
  isApproved: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
  product: Product
}

type Order {
  id: ID!
  storeId: String!
  userId: String!
  orderNumber: String!
  totalAmount: Float!
  status: OrderStatus!
  createdAt: DateTime!
  updatedAt: DateTime!
  orderItems: [OrderItem!]!
}

type OrderItem {
  id: ID!
  orderId: String!
  productId: String!
  quantity: Int!
  price: Float!
  product: Product
}

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

## Error Handling

The API returns structured errors with the following format:

```graphql
type GraphQLError {
  message: String!
  code: String!
  statusCode: Int!
  path: [String!]
}
```

### Common Error Codes

- `UNAUTHENTICATED`: User not authenticated
- `FORBIDDEN`: User not authorized
- `NOT_FOUND`: Resource not found
- `VALIDATION_ERROR`: Input validation failed
- `INTERNAL_SERVER_ERROR`: Server error

## Rate Limiting

- **Authentication**: 5 requests per minute per IP
- **General API**: 100 requests per minute per user
- **File Upload**: 10 requests per minute per user

## Testing the API

### Using GraphQL Playground

1. Go to http://localhost:3001/graphql
2. Use the interactive interface to write queries
3. Test mutations with sample data
4. Explore the schema documentation

### Using curl

```bash
# Test a simple query
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "query { products { id name price } }"}'

# Test with authentication
curl -X POST http://localhost:3001/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{"query": "query { me { id email name } }"}'
```

### Using Apollo Client (Frontend)

```typescript
import { useQuery } from '@apollo/client';
import { GET_PRODUCTS } from './graphql/queries';

function ProductsList() {
  const { data, loading, error } = useQuery(GET_PRODUCTS);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.products.map(product => (
        <div key={product.id}>{product.name}</div>
      ))}
    </div>
  );
}
```

## Schema Introspection

You can introspect the schema programmatically:

```graphql
query IntrospectionQuery {
  __schema {
    types {
      name
      kind
      description
    }
  }
}
```

This will return the complete schema structure for programmatic use.
