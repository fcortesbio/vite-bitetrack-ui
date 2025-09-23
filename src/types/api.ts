// API Types
export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  statusCode?: number;
  details?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
}

export interface Seller {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  role: 'user' | 'admin' | 'superadmin';
  createdBy?: string;
  activatedAt?: string;
  updatedAt: string;
}

export interface Customer {
  id: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email?: string;
  createdAt: string;
  updatedAt: string;
  lastTransaction?: string;
}

export interface Product {
  id: string;
  productName: string;
  description?: string;
  count: number;
  price: number;
  createdAt: string;
  updatedAt: string;
}

export interface SaleProduct {
  productId: string;
  quantity: number;
  priceAtSale: number;
}

export interface Sale {
  id: string;
  customerId: string;
  sellerId: string;
  products: SaleProduct[];
  totalAmount: number;
  amountPaid: number;
  settled: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  token: string;
  seller: Seller;
}

export interface SellerStatusResponse {
  email: string;
  status: 'active' | 'pending';
}

export interface CreateSaleRequest {
  customerId: string;
  products: Array<{
    productId: string;
    quantity: number;
  }>;
  amountPaid: number;
}