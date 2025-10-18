import { gql } from '@apollo/client';

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
