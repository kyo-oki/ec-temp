import { gql } from '@apollo/client';

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
