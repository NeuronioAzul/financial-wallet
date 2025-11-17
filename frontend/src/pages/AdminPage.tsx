import React, { useState, useEffect } from 'react';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Users, TrendingUp, Shield, Search, Filter, Download, UserCheck, UserX, Lock } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { isAdmin } from '@/types';
import api from '@/services/api';
import toast from 'react-hot-toast';

interface UserStats {
  total_users: number;
  active_users: number;
  suspended_users: number;
  total_transactions: number;
  total_volume: string;
}

interface UserData {
  id: string;
  name: string;
  email: string;
  document: string;
  roles: string[];
  status: 'active' | 'inactive' | 'suspended';
  wallet?: {
    balance: string;
    status: string;
  };
  created_at: string;
}

interface TransactionData {
  id: string;
  amount: string;
  type: string;
  status: string;
  created_at: string;
  sender?: {
    name: string;
    email: string;
  };
  receiver?: {
    name: string;
    email: string;
  };
}

export const AdminPage: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'users' | 'transactions' | 'audit'>('users');
  const [stats, setStats] = useState<UserStats | null>(null);
  const [users, setUsers] = useState<UserData[]>([]);
  const [transactions, setTransactions] = useState<TransactionData[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  useEffect(() => {
    if (!isAdmin(user)) {
      toast.error('Acesso negado. Apenas administradores podem acessar esta página.');
      navigate('/dashboard');
      return;
    }
    loadStats();
    loadUsers();
  }, [user, navigate]);

  const loadStats = async () => {
    try {
      // Simulated stats - replace with actual API call when endpoint is available
      setStats({
        total_users: 150,
        active_users: 142,
        suspended_users: 8,
        total_transactions: 1247,
        total_volume: '125487.50'
      });
    } catch (error) {
      console.error('Error loading stats:', error);
    }
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      // Simulated data - replace with actual API call
      const mockUsers: UserData[] = [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@example.com',
          document: '123.456.789-00',
          roles: ['customer'],
          status: 'active',
          wallet: { balance: '1000.00', status: 'active' },
          created_at: '2025-01-15T10:00:00Z'
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria@example.com',
          document: '987.654.321-00',
          roles: ['customer'],
          status: 'active',
          wallet: { balance: '500.00', status: 'active' },
          created_at: '2025-01-20T14:30:00Z'
        }
      ];
      setUsers(mockUsers);
    } catch (error) {
      toast.error('Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  };

  const loadTransactions = async () => {
    setLoading(true);
    try {
      // Simulated data - replace with actual API call
      const mockTransactions: TransactionData[] = [];
      setTransactions(mockTransactions);
    } catch (error) {
      toast.error('Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  };

  const handleSuspendUser = async (userId: string) => {
    try {
      // API call to suspend user
      toast.success('Usuário suspenso com sucesso');
      loadUsers();
    } catch (error) {
      toast.error('Erro ao suspender usuário');
    }
  };

  const handleActivateUser = async (userId: string) => {
    try {
      // API call to activate user
      toast.success('Usuário ativado com sucesso');
      loadUsers();
    } catch (error) {
      toast.error('Erro ao ativar usuário');
    }
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.document.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const formatCurrency = (value: string) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(parseFloat(value));
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
          <p className="text-gray-600 mt-2">Gerencie usuários, transações e auditoria do sistema</p>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Total de Usuários</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total_users}</p>
                </div>
                <div className="p-3 bg-ocean-blue/10 rounded-xl">
                  <Users className="h-8 w-8 text-ocean-blue" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Usuários Ativos</p>
                  <p className="text-3xl font-bold text-forest-green">{stats.active_users}</p>
                </div>
                <div className="p-3 bg-forest-green/10 rounded-xl">
                  <UserCheck className="h-8 w-8 text-forest-green" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Suspensos</p>
                  <p className="text-3xl font-bold text-danger">{stats.suspended_users}</p>
                </div>
                <div className="p-3 bg-danger/10 rounded-xl">
                  <UserX className="h-8 w-8 text-danger" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Volume Total</p>
                  <p className="text-3xl font-bold text-royal-blue">{formatCurrency(stats.total_volume)}</p>
                </div>
                <div className="p-3 bg-royal-blue/10 rounded-xl">
                  <TrendingUp className="h-8 w-8 text-royal-blue" />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="border-b border-gray-200">
            <nav className="flex -mb-px">
              <button
                onClick={() => setActiveTab('users')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'users'
                    ? 'border-ocean-blue text-ocean-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Usuários
                </div>
              </button>
              <button
                onClick={() => {
                  setActiveTab('transactions');
                  if (transactions.length === 0) loadTransactions();
                }}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'transactions'
                    ? 'border-ocean-blue text-ocean-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Transações
                </div>
              </button>
              <button
                onClick={() => setActiveTab('audit')}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === 'audit'
                    ? 'border-ocean-blue text-ocean-blue'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Auditoria
                </div>
              </button>
            </nav>
          </div>

          <div className="p-6">
            {/* Users Tab */}
            {activeTab === 'users' && (
              <div>
                {/* Filters */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Buscar por nome, email ou CPF..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                    />
                  </div>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-ocean-blue focus:border-transparent"
                  >
                    <option value="all">Todos os status</option>
                    <option value="active">Ativos</option>
                    <option value="inactive">Inativos</option>
                    <option value="suspended">Suspensos</option>
                  </select>
                  <button className="px-4 py-2 bg-ocean-blue text-white rounded-lg hover:bg-ocean-blue-dark transition-colors flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    Exportar
                  </button>
                </div>

                {/* Users Table */}
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200">
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Usuário</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">CPF</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Saldo</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Cadastro</th>
                        <th className="text-right py-3 px-4 text-sm font-semibold text-gray-700">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {loading ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-gray-500">
                            Carregando...
                          </td>
                        </tr>
                      ) : filteredUsers.length === 0 ? (
                        <tr>
                          <td colSpan={6} className="text-center py-8 text-gray-500">
                            Nenhum usuário encontrado
                          </td>
                        </tr>
                      ) : (
                        filteredUsers.map((user) => (
                          <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="py-4 px-4">
                              <div>
                                <p className="font-medium text-gray-900">{user.name}</p>
                                <p className="text-sm text-gray-500">{user.email}</p>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700">{user.document}</td>
                            <td className="py-4 px-4">
                              <span className="font-semibold text-gray-900">
                                {user.wallet ? formatCurrency(user.wallet.balance) : '-'}
                              </span>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                user.status === 'active'
                                  ? 'bg-forest-green/10 text-forest-green'
                                  : user.status === 'suspended'
                                  ? 'bg-danger/10 text-danger'
                                  : 'bg-gray-100 text-gray-600'
                              }`}>
                                {user.status === 'active' ? 'Ativo' : user.status === 'suspended' ? 'Suspenso' : 'Inativo'}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600">
                              {formatDate(user.created_at)}
                            </td>
                            <td className="py-4 px-4">
                              <div className="flex items-center justify-end gap-2">
                                {user.status === 'active' ? (
                                  <button
                                    onClick={() => handleSuspendUser(user.id)}
                                    className="p-2 text-danger hover:bg-danger/10 rounded-lg transition-colors"
                                    title="Suspender usuário"
                                  >
                                    <Lock className="h-4 w-4" />
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleActivateUser(user.id)}
                                    className="p-2 text-forest-green hover:bg-forest-green/10 rounded-lg transition-colors"
                                    title="Ativar usuário"
                                  >
                                    <UserCheck className="h-4 w-4" />
                                  </button>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Transactions Tab */}
            {activeTab === 'transactions' && (
              <div className="text-center py-12 text-gray-500">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Visualização de transações em desenvolvimento</p>
              </div>
            )}

            {/* Audit Tab */}
            {activeTab === 'audit' && (
              <div className="text-center py-12 text-gray-500">
                <Shield className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                <p>Logs de auditoria em desenvolvimento</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};
