import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, ArrowUpRight, Plus, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { transactionService, authService } from '@/services';
import { Transaction } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { formatFullDate } from '@/utils/date';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

export const TransactionHistoryPage = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [showFilters, setShowFilters] = useState(false);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    loadTransactions();
    loadUserId();
  }, [currentPage, filterType, filterStatus]);

  const loadUserId = async () => {
    try {
      const user = await authService.getProfile();
      setUserId(user.id);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  const loadTransactions = async () => {
    setLoading(true);
    try {
      const response = await transactionService.getTransactions(currentPage, 20);
      
      let filtered = response.data;
      
      // Apply type filter
      if (filterType !== 'all') {
        filtered = filtered.filter(t => t.type === filterType);
      }
      
      // Apply status filter
      if (filterStatus !== 'all') {
        filtered = filtered.filter(t => t.status === filterStatus);
      }
      
      // Apply search
      if (searchTerm) {
        filtered = filtered.filter(t => 
          t.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          t.id.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      
      setTransactions(filtered);
      setTotalPages(response.total_pages || 1);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  };

  const isPositiveTransaction = (transaction: Transaction): boolean => {
    const type = transaction.type;
    
    // Depósitos e estornos são sempre positivos
    if (type === 'deposit' || type === 1 || type === 'reversal' || type === 3) {
      return true;
    }
    
    // Para transferências, verifica se o usuário é o destinatário
    if ((type === 'transfer' || type === 2) && userId) {
      return transaction.receiver_user_id === userId;
    }
    
    return false;
  };

  const getTransactionIcon = (type: string | number) => {
    const typeMap: Record<number, string> = {
      1: 'deposit',
      2: 'transfer',
      3: 'reversal',
    };
    
    const typeStr = typeof type === 'number' ? typeMap[type] : type;
    
    const icons = {
      transfer: <ArrowUpRight size={24} className="text-blue-600" />,
      deposit: <Plus size={24} className="text-green-600" />,
      reversal: <RotateCcw size={24} className="text-orange-600" />,
    };
    return icons[typeStr as keyof typeof icons] || icons.deposit;
  };

  const getTransactionLabel = (type: string | number) => {
    const typeMap: Record<number, string> = {
      1: 'deposit',
      2: 'transfer',
      3: 'reversal',
    };
    
    const typeStr = typeof type === 'number' ? typeMap[type] : type;
    
    const labels = {
      transfer: 'Transferência',
      deposit: 'Depósito',
      reversal: 'Estorno',
    };
    return labels[typeStr as keyof typeof labels] || String(type);
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: { text: 'Concluída', color: 'bg-green-100 text-green-700' },
      pending: { text: 'Pendente', color: 'bg-yellow-100 text-yellow-700' },
      failed: { text: 'Falhou', color: 'bg-red-100 text-red-700' },
      reversed: { text: 'Estornada', color: 'bg-gray-100 text-gray-700' },
    };
    return badges[status as keyof typeof badges] || badges.completed;
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadTransactions();
  };

  const handleClearFilters = () => {
    setFilterType('all');
    setFilterStatus('all');
    setSearchTerm('');
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-4"
          >
            <ArrowLeft size={20} />
            Voltar ao Dashboard
          </button>
          <h1 className="text-3xl font-bold gradient-text">Histórico de Transações</h1>
        </div>

        <Card>
          {/* Search and Filters */}
          <div className="space-y-4 mb-6">
            <div className="flex gap-3">
              <div className="flex-1">
                <Input
                  placeholder="Buscar por descrição ou ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  icon={<Search size={20} />}
                />
              </div>
              <Button onClick={handleSearch}>
                <Search size={20} />
                Buscar
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
              >
                <Filter size={20} />
                Filtros
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo
                  </label>
                  <select
                    value={filterType}
                    onChange={(e) => setFilterType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Todos</option>
                    <option value="deposit">Depósitos</option>
                    <option value="transfer">Transferências</option>
                    <option value="reversal">Estornos</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="all">Todos</option>
                    <option value="completed">Concluídas</option>
                    <option value="pending">Pendentes</option>
                    <option value="failed">Falhadas</option>
                    <option value="reversed">Estornadas</option>
                  </select>
                </div>

                <div className="flex items-end">
                  <Button
                    variant="outline"
                    onClick={handleClearFilters}
                    className="w-full"
                  >
                    Limpar Filtros
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Transactions List */}
          {loading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="flex items-center gap-4 p-4 animate-pulse">
                  <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              ))}
            </div>
          ) : transactions.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search size={48} className="mx-auto" />
              </div>
              <p className="text-gray-600 mb-2">Nenhuma transação encontrada</p>
              <p className="text-sm text-gray-500">
                Tente ajustar os filtros ou fazer uma nova busca
              </p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                {transactions.map((transaction) => {
                  const badge = getStatusBadge(transaction.status);
                  const isPositive = isPositiveTransaction(transaction);

                  return (
                    <div
                      key={transaction.id}
                      className="flex items-center gap-4 p-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                    >
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                        {getTransactionIcon(transaction.type)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-semibold text-gray-900">
                            {getTransactionLabel(transaction.type)}
                            {(transaction.type === 'transfer' || transaction.type === 2) && (
                              <span className="font-normal text-sm ml-1">
                                {transaction.receiver_user_id === userId 
                                  ? ` de ${transaction.senderUser?.name || transaction.sender?.name || 'Usuário'}` 
                                  : ` para ${transaction.receiverUser?.name || transaction.recipient?.name || 'Usuário'}`}
                              </span>
                            )}
                          </p>
                          <span className={clsx('text-xs px-2 py-0.5 rounded-full', badge.color)}>
                            {badge.text}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 truncate mb-1">
                          {transaction.description || 'Sem descrição'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatFullDate(transaction.created_at)}
                        </p>
                        <p className="text-xs text-gray-400 font-mono">
                          ID: {transaction.id.substring(0, 8)}...
                        </p>
                      </div>

                      <div className="text-right flex-shrink-0">
                        <p className={clsx('text-xl font-bold', isPositive ? 'text-green-600' : 'text-red-600')}>
                          {isPositive ? '+' : '-'} {formatCurrency(transaction.amount)}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Página {currentPage} de {totalPages}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft size={20} />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Próxima
                      <ChevronRight size={20} />
                    </Button>
                  </div>
                </div>
              )}
            </>
          )}
        </Card>
      </main>
    </div>
  );
};
