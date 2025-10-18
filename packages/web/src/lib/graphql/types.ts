// Base types
export interface User {
  id: string;
  email: string;
  name: string;
  createdAt: string;
}

export interface AuthPayload {
  access_token: string;
  user: User;
}

// Product types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  availableSizes: string[];
  availableColors: string[];
  stockQuantity: number;
  isActive: boolean;
  createdAt: string;
  reviews?: Review[];
}

export interface Review {
  id: string;
  customerName: string;
  rating: number;
  comment: string;
  isApproved: boolean;
  createdAt: string;
}

export interface ProductFilterInput {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  availableSizes?: string[];
  availableColors?: string[];
  isActive?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// Blog types
export interface BlogPost {
  id: string;
  title: string;
  description: string;
  content: string;
  category: string;
  thumbnailUrl?: string;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface BlogFilterInput {
  search?: string;
  category?: string;
  isPublished?: boolean;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
  limit?: number;
  offset?: number;
}

// FAQ types
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  displayOrder: number;
  createdAt: string;
}

// About types
export interface About {
  id: string;
  philosophy: string;
  vision: string;
  offerings: string; // JSON string
  updatedAt: string;
}

// Promotion types
export interface Promotion {
  id: string;
  title: string;
  description: string;
  discountPercentage: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
}

export interface PromotionFilterInput {
  isActive?: boolean;
  isCurrentlyActive?: boolean;
  search?: string;
}

// Store types
export interface Store {
  id: string;
  name: string;
  slug: string;
  subdomain: string;
  settings: any; // JSON object
  customDomain?: string;
  customDomainVerified?: boolean;
  createdAt: string;
}

// Order types
export interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  size?: string;
  color?: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  stateRegion: string;
  postcode: string;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt?: string;
  items: OrderItem[];
}

export interface CreateOrderInput {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  deliveryAddress: string;
  city: string;
  stateRegion: string;
  postcode: string;
  items: OrderItemInput[];
}

export interface OrderItemInput {
  productId: string;
  quantity: number;
  size?: string;
  color?: string;
}

export interface UpdateOrderInput {
  status?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  deliveryAddress?: string;
  city?: string;
  stateRegion?: string;
  postcode?: string;
}

// Review input types
export interface CreateReviewInput {
  productId: string;
  customerName: string;
  rating: number;
  comment: string;
}

// Contact types
export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  isRead: boolean;
  createdAt: string;
}

export interface CreateContactInput {
  name: string;
  email: string;
  subject: string;
  message: string;
}

// Auth input types
export interface SignUpInput {
  email: string;
  password: string;
  name: string;
}

export interface SignInInput {
  email: string;
  password: string;
}

// File upload types
export interface UploadResult {
  url: string;
  filename: string;
  originalName: string;
  mimetype: string;
  size: number;
}
