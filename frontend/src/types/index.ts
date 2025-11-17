export interface User {
  id: string;
  name: string;
  email: string;
  document: string;
  roles: string[];
  status: 'active' | 'inactive' | 'suspended';
  theme_mode?: 'light' | 'dark';
  created_at: string;
  updated_at: string;
}

export const isAdmin = (user: User | null): boolean => {
  return user?.roles?.includes('admin') ?? false;
};

export const isCustomer = (user: User | null): boolean => {
  return user?.roles?.includes('customer') ?? false;
};

export interface Wallet {
  id: string;
  user_id: string;
  balance: string;
  currency: string;
  status: 'active' | 'inactive' | 'suspended';
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: string;
  wallet_id: string;
  type: 'transfer' | 'deposit' | 'reversal' | 1 | 2 | 3; // Backend pode retornar string ou number
  amount: string;
  description: string | null;
  status: 'pending' | 'completed' | 'failed' | 'reversed';
  sender_user_id?: string;
  receiver_user_id?: string;
  recipient_wallet_id?: string;
  original_transaction_id?: string;
  created_at: string;
  updated_at: string;
  sender_user?: {
    id: string;
    name: string;
    email: string;
  };
  receiver_user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
  document: string;
}

export interface LoginResponse {
  token: string;
  user: User;
}

export interface TransferRequest {
  receiver_email: string;
  amount: number;
  description?: string;
}

export interface DepositRequest {
  amount: number;
  description?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
  };
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}
