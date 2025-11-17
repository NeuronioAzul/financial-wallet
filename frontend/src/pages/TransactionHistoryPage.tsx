import { useState, useEffect } from 'react';
import { ArrowLeft, Search, Filter, ArrowUpRight, ArrowDownLeft, Plus, RotateCcw, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { Card } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { UserTooltip } from '@/components/ui/UserTooltip';
import ReverseTransactionModal from '@/components/modals/ReverseTransactionModal';
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
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [reversingId, setReversingId] = useState<string | null>(null);

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
      console.log('History - Transactions loaded:', response.data);
      
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
      setTotalPages(response.meta.last_page || 1);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  };

  const isPositiveTransaction = (transaction: Transaction): boolean => {
    const type = transaction.type;
    
    // Depósitos são sempre positivos
    if (type === 'deposit' || type === 1) {
      return true;
    }
    
    // Estornos são sempre negativos (saída)
    if (type === 'reversal' || type === 3) {
      return false;
    }
    
    // Para transferências, verifica se o usuário é o destinatário
    if ((type === 'transfer' || type === 2) && userId) {
      return transaction.receiver_user_id === userId;
    }
    
    return false;
  };

  const getShortName = (fullName: string): string => {
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[parts.length - 1][0]}.`;
  };

  const getTransactionIcon = (transaction: Transaction) => {
    const type = transaction.type;
    const typeMap: Record<number, string> = {
      1: 'deposit',
      2: 'transfer',
      3: 'reversal',
    };
    
    const typeStr = typeof type === 'number' ? typeMap[type] : type;
    
    // Para transferências, usa ícone diferente se for recebida ou enviada
    if (typeStr === 'transfer') {
      const isReceived = transaction.receiver_user_id === userId;
      return isReceived 
        ? <ArrowDownLeft size={24} className="text-mint-green" /> 
        : <ArrowUpRight size={24} className="text-royal-blue" />;
    }
    
    const icons = {
      deposit: <Plus size={24} className="text-mint-green" />,
      reversal: <RotateCcw size={24} className="text-golden-sand" />,
    };
    return icons[typeStr as keyof typeof icons] || <Plus size={24} className="text-mint-green" />;
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

  const getStatusBadge = (status: string | number) => {
    // Mapeia números para strings (1=pending, 2=failed, 3=completed, 4=reversed)
    const statusMap: Record<number, string> = {
      1: 'pending',
      2: 'failed',
      3: 'completed',
      4: 'reversed',
    };
    
    const statusStr = typeof status === 'number' ? statusMap[status] : status;
    
    const badges = {
      completed: { text: 'Concluída', color: 'bg-forest-green/10 text-forest-green' },
      pending: { text: 'Pendente', color: 'bg-golden-sand/20 text-golden-sand-dark' },
      failed: { text: 'Falhou', color: 'bg-burgundy-red/10 text-burgundy-red' },
      reversed: { text: 'Estornada', color: 'bg-silver-gray text-charcoal-gray' },
    };
    return badges[statusStr as keyof typeof badges] || badges.completed;
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

  const canReverse = (transaction: Transaction): boolean => {
    const isTransfer = transaction.type === 'transfer' || transaction.type === 2;
    const isCompleted = transaction.status === 'completed' || transaction.status === 3;
    const notReversed = transaction.status !== 'reversed' && transaction.status !== 4;
    const isParticipant = transaction.sender_user_id === userId || transaction.receiver_user_id === userId;
    
    return isTransfer && isCompleted && notReversed && isParticipant && userId !== '';
  };

  const openReverseModal = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const closeReverseModal = () => {
    setModalOpen(false);
    setSelectedTransaction(null);
  };

  const handleReverseConfirm = async (reason: string) => {
    if (!selectedTransaction) return;

    setReversingId(selectedTransaction.id);
    try {
      await transactionService.reverse(selectedTransaction.id, reason);

      const isSender = selectedTransaction.sender_user_id === userId;
      toast.success(
        isSender
          ? 'Transferência estornada com sucesso!'
          : 'Transferência devolvida com sucesso!'
      );

      closeReverseModal();
      loadTransactions();
    } catch (error: any) {
      toast.error(
        error.response?.data?.message || 'Erro ao processar solicitação'
      );
    } finally {
      setReversingId(null);
    }
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
                        {getTransactionIcon(transaction)}
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <div className="font-semibold text-gray-900">
                            {getTransactionLabel(transaction.type)}
                            {(transaction.type === 'transfer' || transaction.type === 2) && (() => {
                              const isReceived = transaction.receiver_user_id === userId;
                              const person = isReceived 
                                ? transaction.sender_user
                                : transaction.receiver_user;
                              
                              if (!person) return null;
                              
                              return (
                                <span className="font-normal text-sm ml-1">
                                  {isReceived ? 'de ' : 'para '}
                                  <UserTooltip name={person.name} email={person.email}>
                                    <span className="text-royal-blue hover:underline cursor-pointer">
                                      {getShortName(person.name)}
                                    </span>
                                  </UserTooltip>
                                </span>
                              );
                            })()}
                          </div>
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
                        <p className={clsx('text-xl font-bold mb-2', isPositive ? 'text-green-600' : 'text-red-600')}>
                          {isPositive ? '+' : '-'} {formatCurrency(transaction.amount)}
                        </p>
                        
                        {canReverse(transaction) && (
                          <div className="flex gap-2 justify-end">
                            {/* Botão de Estornar (para quem enviou) */}
                            {transaction.sender_user_id === userId && (
                              <Button
                                variant="outline"
                                onClick={() => openReverseModal(transaction)}
                                isLoading={reversingId === transaction.id}
                                className="text-xs px-3 py-1.5 border-amber-600 text-amber-600 hover:bg-amber-50"
                              >
                                <RotateCcw size={14} />
                                Estornar
                              </Button>
                            )}

                            {/* Botão de Devolver (para quem recebeu) */}
                            {transaction.receiver_user_id === userId && (
                              <Button
                                variant="outline"
                                onClick={() => openReverseModal(transaction)}
                                isLoading={reversingId === transaction.id}
                                className="text-xs px-3 py-1.5 border-blue-600 text-blue-600 hover:bg-blue-50"
                              >
                                <RotateCcw size={14} />
                                Devolver
                              </Button>
                            )}
                          </div>
                        )}
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

        {/* Modal de Confirmação */}
        {selectedTransaction && (
          <ReverseTransactionModal
            isOpen={modalOpen}
            onClose={closeReverseModal}
            onConfirm={handleReverseConfirm}
            transaction={{
              id: selectedTransaction.id,
              amount: selectedTransaction.amount,
              type: String(selectedTransaction.type),
              isSender: selectedTransaction.sender_user_id === userId,
            }}
            isLoading={reversingId === selectedTransaction.id}
          />
        )}
      </main>
    </div>
  );
};
