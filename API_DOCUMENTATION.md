# GraphQL API Documentation

This document provides comprehensive documentation for the ProGear Hub GraphQL API.

## Base URL

- **Development**: `http://localhost:3000/graphql`
- **Production**: `https://api.yourdomain.com/graphql`

## Authentication

The API uses JWT-based authentication. Include the token in the Authorization header:

```bash
Authorization: Bearer <your-jwt-token>
```

## Schema Overview

### Core Types

#### User
```graphql
type User {
  id: ID!
  email: String!
  name: String!
  storeId: String
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

#### Store
```graphql
type Store {
  id: ID!
  name: String!
  slug: String!
  subdomain: String!
  ownerId: String!
  settings: String! # JSON string
  customDomain: String
  customDomainVerified: Boolean!
  createdAt: DateTime!
  updatedAt: DateTime!
}
```

#### Product
```graphql
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
```

#### Order
```graphql
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

enum OrderStatus {
  PENDING
  PROCESSING
  SHIPPED
  DELIVERED
  CANCELLED
}
```

## Queries

### Authentication

#### Get Current User
```graphql
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

#### Get User's Stores
```graphql
query MyStores {
  myStores {
    id
    name
    slug
    subdomain
    customDomain
    customDomainVerified
  }
}
```

#### Get Current Store
```graphql
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

#### Get Products
```graphql
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
  }
}
```

#### Get Single Product
```graphql
query Product($id: String!) {
  product(id: $id) {
    id
    name
    description
    price
    stock
    category
    images
    reviews {
      id
      rating
      comment
      reviewerName
      createdAt
    }
  }
}
```

### Order Management

#### Get Orders
```graphql
query Orders(
  $filter: OrderFilterInput
  $pagination: PaginationInput
) {
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

#### Get Blog Posts
```graphql
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
```

#### Get FAQs
```graphql
query Faqs {
  faqs {
    id
    question
    answer
    displayOrder
  }
}
```

#### Get About Page
```graphql
query About {
  about {
    id
    philosophy
    vision
    offerings
  }
}
```

#### Get Promotions
```graphql
query ActivePromotions {
  activePromotions {
    id
    title
    description
    discountPercentage
    startDate
    endDate
  }
}
```

## Mutations

### Authentication

#### Sign Up
```graphql
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

# Input
{
  "input": {
    "email": "user@example.com",
    "password": "password123",
    "name": "John Doe"
  }
}
```

#### Sign In
```graphql
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

# Input
{
  "input": {
    "email": "user@example.com",
    "password": "password123"
  }
}
```

### Store Management

#### Create Store
```graphql
mutation CreateStore($input: CreateStoreInput!) {
  createStore(input: $input) {
    id
    name
    slug
    subdomain
  }
}

# Input
{
  "input": {
    "name": "My Store",
    "slug": "my-store",
    "subdomain": "mystore",
    "description": "A great store"
  }
}
```

#### Update Store
```graphql
mutation UpdateStore($id: String!, $input: UpdateStoreInput!) {
  updateStore(id: $id, input: $input) {
    id
    name
    settings
  }
}
```

### Product Management

#### Create Product
```graphql
mutation CreateProduct($input: CreateProductInput!) {
  createProduct(input: $input) {
    id
    name
    price
    stock
  }
}

# Input
{
  "input": {
    "name": "Wireless Headphones",
    "description": "High-quality wireless headphones",
    "price": 99.99,
    "stock": 50,
    "category": "Electronics",
    "images": ["image1.jpg", "image2.jpg"]
  }
}
```

#### Update Product
```graphql
mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {
  updateProduct(id: $id, input: $input) {
    id
    name
    price
    stock
  }
}
```

#### Delete Product
```graphql
mutation DeleteProduct($id: String!) {
  deleteProduct(id: $id) {
    id
    name
  }
}
```

### Order Management

#### Create Order
```graphql
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

# Input
{
  "input": {
    "orderItems": [
      {
        "productId": "product-1",
        "quantity": 2
      },
      {
        "productId": "product-2",
        "quantity": 1
      }
    ]
  }
}
```

#### Update Order Status
```graphql
mutation UpdateOrder($id: String!, $input: UpdateOrderInput!) {
  updateOrder(id: $id, input: $input) {
    id
    status
    updatedAt
  }
}
```

### Review Management

#### Create Review
```graphql
mutation CreateReview($productId: String!, $input: CreateReviewInput!) {
  createReview(productId: $productId, input: $input) {
    id
    rating
    comment
    reviewerName
  }
}

# Input
{
  "productId": "product-1",
  "input": {
    "rating": 5,
    "comment": "Great product!",
    "reviewerName": "John Doe"
  }
}
```

### Content Management

#### Create Blog Post
```graphql
mutation CreateBlogPost($input: CreateBlogPostInput!) {
  createBlogPost(input: $input) {
    id
    title
    content
    category
    isPublished
  }
}
```

#### Create FAQ
```graphql
mutation CreateFAQ($input: CreateFAQInput!) {
  createFAQ(input: $input) {
    id
    question
    answer
    displayOrder
  }
}
```

#### Update About Page
```graphql
mutation UpdateAbout($input: UpdateAboutInput!) {
  updateAbout(input: $input) {
    id
    philosophy
    vision
    offerings
  }
}
```

#### Create Contact
```graphql
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

#### Upload File
```graphql
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
  settings: String # JSON string
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
  offerings: String # JSON string
}

input CreateContactInput {
  name: String!
  email: String!
  subject: String!
  message: String!
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

## Pagination

Use the `PaginationInput` type for paginated queries:

```graphql
input PaginationInput {
  limit: Int = 10
  offset: Int = 0
}
```

## Examples

### Complete Store Setup Flow

1. **Sign Up**
```graphql
mutation {
  signUp(input: {
    email: "owner@example.com"
    password: "password123"
    name: "Store Owner"
  }) {
    accessToken
    user { id email name }
  }
}
```

2. **Create Store**
```graphql
mutation {
  createStore(input: {
    name: "My Awesome Store"
    slug: "awesome-store"
    subdomain: "awesome"
    description: "The best store ever"
  }) {
    id
    name
    slug
    subdomain
  }
}
```

3. **Add Products**
```graphql
mutation {
  createProduct(input: {
    name: "Wireless Headphones"
    description: "High-quality wireless headphones"
    price: 99.99
    stock: 50
    category: "Electronics"
    images: ["headphones1.jpg", "headphones2.jpg"]
  }) {
    id
    name
    price
  }
}
```

4. **Create About Page**
```graphql
mutation {
  updateAbout(input: {
    philosophy: "Quality products for everyone"
    vision: "To be the leading electronics store"
    offerings: "{\"key1\": \"Fast Shipping\", \"key2\": \"24/7 Support\"}"
  }) {
    id
    philosophy
    vision
  }
}
```

## Rate Limiting

The API implements rate limiting to prevent abuse:
- **Authentication**: 5 requests per minute per IP
- **General API**: 100 requests per minute per user
- **File Upload**: 10 requests per minute per user

## Webhooks

The API supports webhooks for the following events:
- Order created
- Order status updated
- Product stock low
- New contact form submission

Configure webhooks in your store settings.

## SDKs and Tools

### GraphQL Playground
Access the interactive GraphQL playground at:
- **Development**: `http://localhost:3000/graphql`
- **Production**: `https://api.yourdomain.com/graphql`

### Apollo Studio
For advanced GraphQL development, use Apollo Studio with your schema.

### Code Generation
Generate TypeScript types from your GraphQL schema:

```bash
npx graphql-codegen --config codegen.yml
```

## Support

For API support and questions:
- Check the [GitHub Issues](https://github.com/your-repo/issues)
- Join our [Discord Community](https://discord.gg/your-community)
- Email: api-support@yourdomain.com
