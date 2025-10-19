import { gql } from "@apollo/client";

// Product queries
export const GET_PRODUCTS = gql`
  query GetProducts($filter: ProductFilterInput) {
    products(filter: $filter) {
      id
      name
      description
      price
      category
      images
      availableSizes
      availableColors
      stockQuantity
      isActive
      createdAt
      reviews {
        id
        customerName
        rating
        comment
        isApproved
        createdAt
      }
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    product(id: $id) {
      id
      name
      description
      price
      category
      images
      availableSizes
      availableColors
      stockQuantity
      isActive
      createdAt
      reviews {
        id
        customerName
        rating
        comment
        isApproved
        createdAt
      }
    }
  }
`;

export const GET_PRODUCT_REVIEWS = gql`
  query GetProductReviews($productId: String!) {
    productReviews(productId: $productId) {
      id
      customerName
      rating
      comment
      isApproved
      createdAt
    }
  }
`;

export const GET_FEATURED_REVIEWS = gql`
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
`;

// Blog queries
export const GET_BLOG_POSTS = gql`
  query GetBlogPosts($filter: BlogFilterInput) {
    publishedBlogPosts(filter: $filter) {
      id
      title
      description
      content
      category
      thumbnailUrl
      isPublished
      createdAt
      updatedAt
    }
  }
`;

export const GET_BLOG_POST = gql`
  query GetBlogPost($id: String!) {
    blogPost(id: $id) {
      id
      title
      description
      content
      category
      thumbnailUrl
      isPublished
      createdAt
      updatedAt
    }
  }
`;

export const GET_BLOG_CATEGORIES = gql`
  query GetBlogCategories {
    blogCategories
  }
`;

// FAQ queries
export const GET_FAQS = gql`
  query GetFaqs {
    faqs {
      id
      question
      answer
      displayOrder
      createdAt
    }
  }
`;

// About query
export const GET_ABOUT = gql`
  query GetAbout {
    about {
      id
      philosophy
      vision
      offerings
      updatedAt
    }
  }
`;

// Promotions queries
export const GET_PROMOTIONS = gql`
  query GetPromotions($filter: PromotionFilterInput) {
    promotions(filter: $filter) {
      id
      title
      description
      discountPercentage
      startDate
      endDate
      isActive
      createdAt
    }
  }
`;

export const GET_ACTIVE_PROMOTIONS = gql`
  query GetActivePromotions {
    activePromotions {
      id
      title
      description
      discountPercentage
      startDate
      endDate
      isActive
      createdAt
    }
  }
`;

// Store queries
export const GET_STORE = gql`
  query GetStore($slug: String!) {
    storeBySlug(slug: $slug) {
      id
      name
      slug
      subdomain
      settings
      customDomain
      customDomainVerified
      createdAt
    }
  }
`;

// Auth queries
export const GET_ME = gql`
  query GetMe {
    me {
      id
      email
      name
      createdAt
    }
  }
`;

export const GET_CONTACTS = gql`
  query GetContacts($filter: ContactFilterInput, $pagination: PaginationInput) {
    contacts(filter: $filter, pagination: $pagination) {
      items {
        id
        name
        email
        subject
        message
        isRead
        createdAt
      }
      total
      page
      pageSize
    }
  }
`;

export const GET_CONTACT = gql`
  query GetContact($id: String!) {
    contact(id: $id) {
      id
      name
      email
      subject
      message
      isRead
      createdAt
    }
  }
`;

export const GET_ALL_BLOG_POSTS = gql`
  query GetAllBlogPosts(
    $filter: BlogFilterInput
    $pagination: PaginationInput
  ) {
    blogPosts(filter: $filter, pagination: $pagination) {
      items {
        id
        title
        description
        content
        category
        thumbnailUrl
        isPublished
        createdAt
        updatedAt
      }
      total
      page
      pageSize
    }
  }
`;

// Additional admin queries
export const GET_FAQ = gql`
  query GetFaq($id: String!) {
    faq(id: $id) {
      id
      question
      answer
      displayOrder
      createdAt
    }
  }
`;

export const GET_PROMOTION = gql`
  query GetPromotion($id: String!) {
    promotion(id: $id) {
      id
      title
      description
      discountType
      discountValue
      startDate
      endDate
      isActive
      createdAt
    }
  }
`;

// Admin queries
export const GET_ORDERS = gql`
  query GetOrders(
    $filter: OrderFilterInput
    $pagination: PaginationInput
    $sortBy: String
    $sortOrder: String
  ) {
    orders(
      filter: $filter
      pagination: $pagination
      sortBy: $sortBy
      sortOrder: $sortOrder
    ) {
      items {
        id
        orderNumber
        customerName
        customerEmail
        customerPhone
        shippingAddress
        billingAddress
        items {
          id
          productId
          productName
          quantity
          price
        }
        totalAmount
        status
        paymentStatus
        shippingStatus
        notes
        createdAt
        updatedAt
      }
      total
      page
      pageSize
    }
  }
`;

export const GET_ORDER = gql`
  query GetOrder($id: String!) {
    order(id: $id) {
      id
      orderNumber
      customerName
      customerEmail
      customerPhone
      shippingAddress
      billingAddress
      items {
        id
        productId
        productName
        quantity
        price
      }
      totalAmount
      status
      paymentStatus
      shippingStatus
      notes
      createdAt
      updatedAt
    }
  }
`;

// Dashboard queries
export const GET_DASHBOARD_STATS = gql`
  query GetDashboardStats {
    products {
      id
      stockQuantity
      isActive
    }
    orders {
      id
      totalAmount
      status
      createdAt
    }
  }
`;

export const GET_RECENT_ORDERS = gql`
  query GetRecentOrders($limit: Int = 5) {
    orders(limit: $limit) {
      id
      orderNumber
      customerName
      totalAmount
      status
      createdAt
    }
  }
`;

export const GET_LOW_STOCK_PRODUCTS = gql`
  query GetLowStockProducts($limit: Int = 5) {
    products(filter: { limit: $limit }) {
      id
      name
      stockQuantity
    }
  }
`;
