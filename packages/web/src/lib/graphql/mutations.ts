import { gql } from "@apollo/client";

// Auth mutations
export const SIGN_UP = gql`
  mutation SignUp($input: SignUpInput!) {
    signUp(input: $input) {
      access_token
      user {
        id
        email
        name
      }
    }
  }
`;

export const SIGN_IN = gql`
  mutation SignIn($input: SignInInput!) {
    signIn(input: $input) {
      access_token
      user {
        id
        email
        name
      }
    }
  }
`;

// Store mutations
export const CREATE_STORE = gql`
  mutation CreateStore($input: CreateStoreInput!) {
    createStore(input: $input) {
      id
      name
      slug
      subdomain
      description
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const VERIFY_SLUG_AVAILABILITY = gql`
  query VerifySlugAvailability($slug: String!) {
    verifySlugAvailability(slug: $slug) {
      available
      slug
    }
  }
`;

export const VERIFY_SUBDOMAIN_AVAILABILITY = gql`
  query VerifySubdomainAvailability($subdomain: String!) {
    verifySubdomainAvailability(subdomain: $subdomain) {
      available
      subdomain
    }
  }
`;

export const GET_MY_STORES = gql`
  query GetMyStores {
    myStores {
      id
      name
      slug
      subdomain
      description
      isActive
      customDomain
      customDomainVerified
      ownerId
      settings
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_STORE = gql`
  mutation UpdateStore($input: UpdateStoreInput!) {
    updateStore(input: $input) {
      id
      name
      slug
      subdomain
      description
      isActive
      customDomain
      customDomainVerified
      ownerId
      settings
      createdAt
      updatedAt
    }
  }
`;

// Order mutations
export const CREATE_ORDER = gql`
  mutation CreateOrder($input: CreateOrderInput!) {
    createOrder(input: $input) {
      id
      orderNumber
      customerName
      customerEmail
      customerPhone
      deliveryAddress
      city
      stateRegion
      postcode
      totalAmount
      status
      createdAt
      items {
        id
        productName
        quantity
        price
        size
        color
      }
    }
  }
`;

export const UPDATE_ORDER = gql`
  mutation UpdateOrder($id: String!, $input: UpdateOrderInput!) {
    updateOrder(id: $id, input: $input) {
      id
      orderNumber
      customerName
      customerEmail
      customerPhone
      deliveryAddress
      city
      stateRegion
      postcode
      totalAmount
      status
      updatedAt
      items {
        id
        productName
        quantity
        price
        size
        color
      }
    }
  }
`;

// Review mutations
export const CREATE_REVIEW = gql`
  mutation CreateReview($input: CreateReviewInput!) {
    createReview(input: $input) {
      id
      productId
      customerName
      rating
      comment
      isApproved
      createdAt
    }
  }
`;

// Contact mutations
export const CREATE_CONTACT = gql`
  mutation CreateContact($input: CreateContactInput!) {
    createContact(input: $input) {
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

// File upload mutation
export const UPLOAD_FILE = gql`
  mutation UploadFile($file: Upload!) {
    uploadFile(file: $file) {
      url
      filename
      originalName
      mimetype
      size
    }
  }
`;

// Admin mutations
export const CREATE_PRODUCT = gql`
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
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
      updatedAt
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: String!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
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
      updatedAt
    }
  }
`;

export const DELETE_PRODUCT = gql`
  mutation DeleteProduct($id: String!) {
    deleteProduct(id: $id)
  }
`;

export const BULK_UPDATE_PRODUCTS = gql`
  mutation BulkUpdateProducts(
    $ids: [String!]!
    $input: BulkUpdateProductInput!
  ) {
    bulkUpdateProducts(ids: $ids, input: $input) {
      count
    }
  }
`;

export const CREATE_BLOG_POST = gql`
  mutation CreateBlogPost($input: CreateBlogPostInput!) {
    createBlogPost(input: $input) {
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

export const UPDATE_BLOG_POST = gql`
  mutation UpdateBlogPost($id: String!, $input: UpdateBlogPostInput!) {
    updateBlogPost(id: $id, input: $input) {
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

export const DELETE_BLOG_POST = gql`
  mutation DeleteBlogPost($id: String!) {
    deleteBlogPost(id: $id)
  }
`;

export const CREATE_FAQ = gql`
  mutation CreateFaq($input: CreateFaqInput!) {
    createFaq(input: $input) {
      id
      question
      answer
      displayOrder
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_FAQ = gql`
  mutation UpdateFaq($id: String!, $input: UpdateFaqInput!) {
    updateFaq(id: $id, input: $input) {
      id
      question
      answer
      displayOrder
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_FAQ = gql`
  mutation DeleteFaq($id: String!) {
    deleteFaq(id: $id)
  }
`;

export const CREATE_PROMOTION = gql`
  mutation CreatePromotion($input: CreatePromotionInput!) {
    createPromotion(input: $input) {
      id
      title
      description
      discountType
      discountValue
      startDate
      endDate
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PROMOTION = gql`
  mutation UpdatePromotion($id: String!, $input: UpdatePromotionInput!) {
    updatePromotion(id: $id, input: $input) {
      id
      title
      description
      discountType
      discountValue
      startDate
      endDate
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_PROMOTION = gql`
  mutation DeletePromotion($id: String!) {
    deletePromotion(id: $id)
  }
`;

export const UPDATE_CONTACT = gql`
  mutation UpdateContact($id: String!, $input: UpdateContactInput!) {
    updateContact(id: $id, input: $input) {
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

export const UPDATE_ABOUT = gql`
  mutation UpdateAbout($input: UpdateAboutInput!) {
    updateAbout(input: $input) {
      id
      philosophy
      vision
      offerings
      updatedAt
    }
  }
`;

export const DELETE_CONTACT = gql`
  mutation DeleteContact($id: String!) {
    deleteContact(id: $id)
  }
`;
