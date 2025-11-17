import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import {
  Users,
  Wallet,
  TrendingUp,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  BarChart3,
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { isAdmin } from '@/types';
import { adminDashboardService, DashboardOverview, WalletStats, TransactionStats } from '@/services/adminDashboard';
import toast from 'react-hot-toast';

export const AdminDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [walletStats, setWalletStats] = useState<WalletStats | null>(null);
  const [transactionStats, setTransactionStats] = useState<TransactionStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isAdmin(user)) {
      toast.error('Acesso negado. Apenas administradores podem acessar esta página.');
      navigate('/dashboard');
      return;
    }
    loadDashboardData();
  }, [user, navigate]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [overviewData, walletData, transactionData] = await Promise.all([
        adminDashboardService.getOverview(),
        adminDashboardService.getWalletStats(),
        adminDashboardService.getTransactionStats(),
      ]);
      setOverview(overviewData);
      setWalletStats(walletData);
      setTransactionStats(transactionData);
    } catch (error: any) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast.error(error.response?.data?.message || 'Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(numValue);
  };

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('pt-BR').format(value);
  };

  const getTransactionTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      '1': 'Depósito',
      '2': 'Transferência',
      '3': 'Saque',
      'deposit': 'Depósito',
      'transfer': 'Transferência',
      'withdrawal': 'Saque',
    };
    return labels[type] || type;
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      '1': 'Pendente',
      '2': 'Processando',
      '3': 'Completado',
      '4': 'Falhou',
      '5': 'Cancelado',
      'pending': 'Pendente',
      'processing': 'Processando',
      'completed': 'Completado',
      'failed': 'Falhou',
      'cancelled': 'Cancelado',
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <DashboardHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003161]"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <DashboardHeader />
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#003161]">Painel Administrativo</h1>
          <p className="text-gray-600 mt-2">Visão geral do sistema e métricas principais</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* Total Users */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-blue-50 rounded-lg">
                <Users className="text-[#003161]" size={24} />
              </div>
              {overview && (
                <span className="text-xs text-green-600 flex items-center">
                  <ArrowUpRight size={16} />
                  {overview.users.new_last_7_days} novos (7d)
                </span>
              )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Total de Usuários</h3>
            <p className="text-3xl font-bold text-[#003161] mt-2">
              {overview ? formatNumber(overview.users.total) : '-'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {overview ? formatNumber(overview.users.active) : '-'} ativos
            </p>
          </div>

          {/* Total Wallets */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-green-50 rounded-lg">
                <Wallet className="text-[#00610D]" size={24} />
              </div>
              {walletStats && (
                <span className="text-xs text-blue-600">
                  {walletStats.stats.active_wallets} ativas
                </span>
              )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Carteiras</h3>
            <p className="text-3xl font-bold text-[#003161] mt-2">
              {walletStats ? formatNumber(walletStats.stats.total_wallets) : '-'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Saldo total: {walletStats ? formatCurrency(walletStats.stats.total_balance) : '-'}
            </p>
          </div>

          {/* Total Transactions */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-purple-50 rounded-lg">
                <Activity className="text-purple-600" size={24} />
              </div>
              {overview && (
                <span className="text-xs text-green-600 flex items-center">
                  {overview.transactions.recent_7_days} (7d)
                </span>
              )}
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Transações</h3>
            <p className="text-3xl font-bold text-[#003161] mt-2">
              {overview ? formatNumber(overview.transactions.total) : '-'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              {transactionStats ? `${transactionStats.success_rate}%` : '-'} sucesso
            </p>
          </div>

          {/* Total Volume */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-3 bg-yellow-50 rounded-lg">
                <DollarSign className="text-[#DAB655]" size={24} />
              </div>
              <span className="text-xs text-gray-600">
                <TrendingUp size={16} className="inline" />
              </span>
            </div>
            <h3 className="text-gray-600 text-sm font-medium">Volume Total</h3>
            <p className="text-3xl font-bold text-[#003161] mt-2">
              {overview ? formatCurrency(overview.transactions.total_value) : '-'}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Média: {transactionStats ? formatCurrency(transactionStats.average_amount) : '-'}
            </p>
          </div>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Transactions by Type */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <BarChart3 className="text-[#003161]" size={24} />
              <h2 className="text-xl font-bold text-[#003161]">Transações por Tipo</h2>
            </div>
            {overview && overview.transactions.by_type && (
              <div className="space-y-4">
                {Object.entries(overview.transactions.by_type).map(([type, data]) => (
                  <div key={type} className="border-b border-gray-100 pb-4 last:border-0">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-semibold text-gray-700">
                        {getTransactionTypeLabel(type)}
                      </span>
                      <span className="text-sm text-gray-600">{formatNumber(data.count)} transações</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <div className="flex-1 bg-gray-200 rounded-full h-2 mr-4">
                        <div
                          className="bg-[#003161] h-2 rounded-full"
                          style={{
                            width: `${(data.count / overview.transactions.total) * 100}%`,
                          }}
                        ></div>
                      </div>
                      <span className="font-bold text-[#003161]">{formatCurrency(data.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Transaction Status */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <div className="flex items-center gap-2 mb-6">
              <Activity className="text-[#003161]" size={24} />
              <h2 className="text-xl font-bold text-[#003161]">Status das Transações</h2>
            </div>
            {transactionStats && transactionStats.by_status && (
              <div className="space-y-4">
                {Object.entries(transactionStats.by_status).map(([status, data]) => (
                  <div key={status} className="flex justify-between items-center border-b border-gray-100 pb-3 last:border-0">
                    <div>
                      <p className="font-semibold text-gray-700">{getStatusLabel(status)}</p>
                      <p className="text-sm text-gray-500">{formatNumber(data.count)} transações</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-[#003161]">{formatCurrency(data.total)}</p>
                      <p className="text-xs text-gray-500">
                        {((data.count / transactionStats.total_transactions) * 100).toFixed(1)}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Wallet Distribution */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center gap-2 mb-6">
            <Wallet className="text-[#003161]" size={24} />
            <h2 className="text-xl font-bold text-[#003161]">Distribuição de Saldos</h2>
          </div>
          {walletStats && walletStats.distribution && (
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {Object.entries(walletStats.distribution).map(([range, count]) => (
                <div key={range} className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-600 mb-2">R$ {range}</p>
                  <p className="text-2xl font-bold text-[#003161]">{formatNumber(count)}</p>
                  <p className="text-xs text-gray-500 mt-1">carteiras</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Wallet Stats Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-lg text-[#003161] mb-4">Estatísticas de Carteiras</h3>
            {walletStats && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Saldo Médio:</span>
                  <span className="font-semibold">{formatCurrency(walletStats.stats.average_balance)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Maior Saldo:</span>
                  <span className="font-semibold text-green-600">
                    {formatCurrency(walletStats.stats.max_balance)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Menor Saldo:</span>
                  <span className="font-semibold text-gray-500">
                    {formatCurrency(walletStats.stats.min_balance)}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Transaction Stats Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-lg text-[#003161] mb-4">Métricas de Transações</h3>
            {transactionStats && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Completadas:</span>
                  <span className="font-semibold text-green-600">
                    {formatNumber(transactionStats.completed_transactions)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taxa de Sucesso:</span>
                  <span className="font-semibold">{transactionStats.success_rate}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Valor Médio:</span>
                  <span className="font-semibold">{formatCurrency(transactionStats.average_amount)}</span>
                </div>
              </div>
            )}
          </div>

          {/* User Stats Card */}
          <div className="bg-white rounded-2xl shadow-lg p-6">
            <h3 className="font-bold text-lg text-[#003161] mb-4">Usuários</h3>
            {overview && (
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total:</span>
                  <span className="font-semibold">{formatNumber(overview.users.total)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Ativos:</span>
                  <span className="font-semibold text-green-600">
                    {formatNumber(overview.users.active)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Novos (7 dias):</span>
                  <span className="font-semibold text-blue-600">
                    +{formatNumber(overview.users.new_last_7_days)}
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
