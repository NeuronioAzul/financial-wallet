import api from './api';

// ========== Types ==========

export interface DashboardOverview {
  users: {
    total: number;
    active: number;
    new_last_7_days: number;
  };
  wallets: {
    total: number;
    total_balance: string;
  };
  transactions: {
    total: number;
    total_value: string;
    recent_7_days: number;
    by_type: Record<string, { count: number; total: string }>;
  };
}

export interface TransactionChartData {
  date: string;
  count: number;
  total: string;
}

export interface TransactionsByType {
  type: string;
  label: string;
  count: number;
  total: string;
}

export interface UserGrowthData {
  date: string;
  new_users: number;
  total_users: number;
}

export interface TopUser {
  id: string;
  name: string;
  email: string;
  transaction_count: number;
  total_volume: string;
}

export interface ActivityItem {
  type: 'transaction' | 'user';
  id: string;
  created_at: string;
  // Transaction fields
  transaction_code?: string;
  transaction_type?: string;
  amount?: string;
  status?: string;
  sender?: {
    id: string;
    name: string;
    email: string;
  };
  receiver?: {
    id: string;
    name: string;
    email: string;
  };
  // User fields
  name?: string;
  email?: string;
}

export interface WalletStats {
  stats: {
    total_wallets: number;
    active_wallets: number;
    total_balance: string;
    average_balance: string;
    max_balance: string;
    min_balance: string;
  };
  distribution: Record<string, number>;
}

export interface TransactionStats {
  by_status: Record<string, { count: number; total: string }>;
  by_type: Record<string, { count: number; total: string }>;
  average_amount: string;
  success_rate: number;
  total_transactions: number;
  completed_transactions: number;
}

// ========== Service ==========

export const adminDashboardService = {
  /**
   * Get dashboard overview statistics
   */
  async getOverview(): Promise<DashboardOverview> {
    const response = await api.get('/v1/admin/dashboard/overview');
    return response.data.data;
  },

  /**
   * Get transactions chart data
   */
  async getTransactionsChart(days: number = 30): Promise<TransactionChartData[]> {
    const response = await api.get('/v1/admin/dashboard/transactions-chart', {
      params: { days },
    });
    return response.data.data;
  },

  /**
   * Get transactions by type
   */
  async getTransactionsByType(): Promise<TransactionsByType[]> {
    const response = await api.get('/v1/admin/dashboard/transactions-by-type');
    return response.data.data;
  },

  /**
   * Get user growth data
   */
  async getUserGrowth(days: number = 30): Promise<UserGrowthData[]> {
    const response = await api.get('/v1/admin/dashboard/user-growth', {
      params: { days },
    });
    return response.data.data;
  },

  /**
   * Get top users by transaction volume
   */
  async getTopUsers(limit: number = 10): Promise<TopUser[]> {
    const response = await api.get('/v1/admin/dashboard/top-users', {
      params: { limit },
    });
    return response.data.data;
  },

  /**
   * Get recent activity
   */
  async getRecentActivity(limit: number = 20): Promise<ActivityItem[]> {
    const response = await api.get('/v1/admin/dashboard/recent-activity', {
      params: { limit },
    });
    return response.data.data;
  },

  /**
   * Get wallet statistics
   */
  async getWalletStats(): Promise<WalletStats> {
    const response = await api.get('/v1/admin/dashboard/wallet-stats');
    return response.data.data;
  },

  /**
   * Get transaction statistics
   */
  async getTransactionStats(): Promise<TransactionStats> {
    const response = await api.get('/v1/admin/dashboard/transaction-stats');
    return response.data.data;
  },
};
