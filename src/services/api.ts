import { API_CONFIG, ENDPOINTS } from '../config/api';
import type { ApiResponse } from '../types/api';

// Generate unique request ID for idempotency
const generateRequestId = (): string => {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

class ApiService {
  private baseUrl: string;
  private timeout: number;

  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.timeout = API_CONFIG.TIMEOUT;
  }

  private async makeRequest<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<T> {
    const requestId = generateRequestId();
    const token = localStorage.getItem('authToken');
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'X-Request-ID': requestId,
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.timeout);

    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        ...options,
        headers,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.message || `HTTP ${response.status}`);
      }

      // Handle 204 No Content responses
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error('Request timeout');
        }
        throw error;
      }
      
      throw new Error('Unknown error occurred');
    }
  }

  // Authentication
  async checkSellerStatus(email: string) {
    return this.makeRequest<{ email: string; status: 'active' | 'pending' }>(
      `${ENDPOINTS.SELLER_STATUS}?email=${encodeURIComponent(email)}`
    );
  }

  async login(email: string, password: string) {
    return this.makeRequest<{ token: string; seller: any }>(
      ENDPOINTS.LOGIN,
      {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      }
    );
  }

  async activate(data: {
    email: string;
    dateOfBirth: string;
    lastName: string;
    password: string;
  }) {
    return this.makeRequest<any>(ENDPOINTS.ACTIVATE, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async recover(sellerId: string) {
    return this.makeRequest<any>(ENDPOINTS.RECOVER, {
      method: 'POST',
      body: JSON.stringify({ sellerId }),
    });
  }

  // Sellers
  async getSellers() {
    return this.makeRequest<any[]>(ENDPOINTS.SELLERS);
  }

  async createPendingSeller(data: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string;
  }) {
    return this.makeRequest<any>(ENDPOINTS.SELLERS_PENDING, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Customers
  async getCustomers() {
    return this.makeRequest<any[]>(ENDPOINTS.CUSTOMERS);
  }

  async createCustomer(data: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    email?: string;
  }) {
    return this.makeRequest<any>(ENDPOINTS.CUSTOMERS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateCustomer(id: string, data: Partial<any>) {
    return this.makeRequest<any>(`${ENDPOINTS.CUSTOMERS}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteCustomer(id: string) {
    return this.makeRequest<any>(`${ENDPOINTS.CUSTOMERS}/${id}`, {
      method: 'DELETE',
    });
  }

  // Products
  async getProducts() {
    return this.makeRequest<any[]>(ENDPOINTS.PRODUCTS);
  }

  async createProduct(data: {
    productName: string;
    description?: string;
    count: number;
    price: number;
  }) {
    return this.makeRequest<any>(ENDPOINTS.PRODUCTS, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async updateProduct(id: string, data: Partial<any>) {
    return this.makeRequest<any>(`${ENDPOINTS.PRODUCTS}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async deleteProduct(id: string) {
    return this.makeRequest<any>(`${ENDPOINTS.PRODUCTS}/${id}`, {
      method: 'DELETE',
    });
  }

  // Sales
  async getSales(filters?: { customerId?: string; sellerId?: string; settled?: boolean }) {
    const params = new URLSearchParams();
    if (filters?.customerId) params.append('customerId', filters.customerId);
    if (filters?.sellerId) params.append('sellerId', filters.sellerId);
    if (filters?.settled !== undefined) params.append('settled', String(filters.settled));
    
    const query = params.toString();
    return this.makeRequest<any[]>(`${ENDPOINTS.SALES}${query ? `?${query}` : ''}`);
  }

  async createSale(data: {
    customerId: string;
    products: Array<{ productId: string; quantity: number }>;
    amountPaid: number;
  }) {
    return this.makeRequest<any>(ENDPOINTS.SALES, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async settleSale(id: string, amountPaid: number) {
    return this.makeRequest<any>(`/sales/${id}/settle`, {
      method: 'PATCH',
      body: JSON.stringify({ amountPaid }),
    });
  }
}

export const apiService = new ApiService();