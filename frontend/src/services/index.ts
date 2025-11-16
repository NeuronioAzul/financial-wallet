import api from './api';
import {
  LoginRequest,
  RegisterRequest,
  LoginResponse,
  User,
  Wallet,
  Transaction,
  TransferRequest,
  DepositRequest,
  PaginatedResponse,
} from '@/types';

export const authService = {
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<{ message: string; data: LoginResponse }>('/v1/login', data);
    return response.data.data;
  },

  register: async (data: RegisterRequest): Promise<LoginResponse> => {
    const response = await api.post<{ message: string; data: LoginResponse }>('/v1/register', data);
    return response.data.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/v1/logout');
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get<{ data: User }>('/v1/me');
    return response.data.data;
  },
};

export const walletService = {
  getWallet: async (): Promise<Wallet> => {
    const response = await api.get<{ data: Wallet }>('/v1/wallet');
    return response.data.data;
  },
};

export const transactionService = {
  getTransactions: async (
    page = 1,
    limit = 10
  ): Promise<PaginatedResponse<Transaction>> => {
    const response = await api.get<PaginatedResponse<Transaction>>(
      `/v1/transactions?page=${page}&limit=${limit}`
    );
    return response.data;
  },

  transfer: async (data: TransferRequest): Promise<Transaction> => {
    const response = await api.post<{ data: Transaction }>('/v1/transactions/transfer', data);
    return response.data.data;
  },

  deposit: async (data: DepositRequest): Promise<Transaction> => {
    const response = await api.post<{ data: Transaction }>('/v1/transactions/deposit', data);
    return response.data.data;
  },

  reverse: async (transactionId: string): Promise<Transaction> => {
    const response = await api.post<{ data: Transaction }>(
      `/v1/transactions/${transactionId}/reverse`
    );
    return response.data.data;
  },
};

export const profileService = {
  updateProfile: async (data: { name: string; email: string }): Promise<User> => {
    const response = await api.put<{ data: User }>('/v1/profile', data);
    return response.data.data;
  },

  getAddress: async (): Promise<any> => {
    const response = await api.get<{ data: any }>('/v1/address');
    return response.data.data;
  },

  createAddress: async (data: any): Promise<any> => {
    const response = await api.post<{ data: any }>('/v1/address', data);
    return response.data.data;
  },

  updateAddress: async (data: any): Promise<any> => {
    const response = await api.put<{ data: any }>('/v1/address', data);
    return response.data.data;
  },

  changePassword: async (data: {
    current_password: string;
    new_password: string;
    new_password_confirmation: string;
  }): Promise<void> => {
    await api.put('/v1/profile/password', data);
  },

  updateThemeSettings: async (data: {
    theme_mode?: 'light' | 'dark';
    contrast_mode?: 'normal' | 'high';
  }): Promise<{ theme_mode: string; contrast_mode: string }> => {
    const response = await api.patch<{ data: { theme_mode: string; contrast_mode: string } }>(
      '/v1/profile/theme-settings',
      data
    );
    return response.data.data;
  },
};
