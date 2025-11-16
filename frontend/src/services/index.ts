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
