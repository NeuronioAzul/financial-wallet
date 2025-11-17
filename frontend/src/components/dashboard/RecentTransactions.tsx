import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { ArrowUpRight, ArrowDownLeft, Plus, RotateCcw, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserTooltip } from '@/components/ui/UserTooltip';
import { transactionService, authService } from '@/services';
import { Transaction } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import { formatShortDate } from '@/utils/date';
import { clsx } from 'clsx';
import toast from 'react-hot-toast';

export interface RecentTransactionsRef {
  refresh: () => void;
}

export const RecentTransactions = forwardRef<RecentTransactionsRef, Record<string, never>>((_, ref) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [reversingId, setReversingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');

  useEffect(() => {
    loadTransactions();
    loadUserId();
  }, []);

  const loadUserId = async () => {
    try {
      const user = await authService.getProfile();
      setUserId(user.id);
    } catch (error) {
      console.error('Error loading user:', error);
    }
  };

  useImperativeHandle(ref, () => ({
    refresh: loadTransactions,
  }));

  const loadTransactions = async () => {
    try {
      const response = await transactionService.getTransactions(1, 5);
      console.log('Transactions loaded:', response.data);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
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
      return isReceived ? <ArrowDownLeft size={20} /> : <ArrowUpRight size={20} />;
    }
    
    const icons = {
      deposit: <Plus size={20} />,
      reversal: <RotateCcw size={20} />,
    };
    return icons[typeStr as keyof typeof icons] || <Clock size={20} />;
  };

  const getTransactionColor = (transaction: Transaction) => {
    const type = transaction.type;
    const typeMap: Record<number, string> = {
      1: 'deposit',
      2: 'transfer',
      3: 'reversal',
    };
    
    const typeStr = typeof type === 'number' ? typeMap[type] : type;
    
    // Para transferências, usa cor verde se recebida, azul se enviada
    if (typeStr === 'transfer') {
      const isReceived = transaction.receiver_user_id === userId;
      return isReceived ? 'text-mint-green bg-mint-green/10' : 'text-royal-blue bg-royal-blue/10';
    }
    
    const colors = {
      deposit: 'text-mint-green bg-mint-green/10',
      reversal: 'text-golden-sand bg-golden-sand/10',
    };
    return colors[typeStr as keyof typeof colors] || 'text-charcoal-gray bg-silver-gray/20';
  };

  const getStatusBadge = (status: string) => {
    const badges = {
      completed: { text: 'Concluída', color: 'bg-forest-green/10 text-forest-green' },
      pending: { text: 'Pendente', color: 'bg-golden-sand/20 text-golden-sand-dark' },
      failed: { text: 'Falhou', color: 'bg-burgundy-red/10 text-burgundy-red' },
      reversed: { text: 'Estornada', color: 'bg-silver-gray text-charcoal-gray' },
    };
    return badges[status as keyof typeof badges] || badges.completed;
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

  const getShortName = (fullName: string): string => {
    const parts = fullName.trim().split(' ');
    if (parts.length === 1) return parts[0];
    return `${parts[0]} ${parts[parts.length - 1][0]}.`;
  };

  const canReverse = (transaction: Transaction): boolean => {
    // Pode estornar transferências recebidas (tipo transfer que aumentaram o saldo)
    // Verifica se é transferência e se está concluída e não foi estornada
    const isTransfer = transaction.type === 'transfer' || transaction.type === 2;
    const isCompleted = transaction.status === 'completed';
    const notReversed = transaction.status !== 'reversed';
    
    return isTransfer && isCompleted && notReversed;
  };

  const handleReverse = async (transactionId: string) => {
    if (!confirm('Tem certeza que deseja estornar esta transação? Esta ação não pode ser desfeita.')) {
      return;
    }

    setReversingId(transactionId);
    try {
      await transactionService.reverse(transactionId);
      toast.success('Transação estornada com sucesso!');
      loadTransactions();
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao estornar transação');
    } finally {
      setReversingId(null);
    }
  };

  if (loading) {
    return (
      <Card title="Últimas Transações">
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-4 animate-pulse">
              <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/4"></div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-20"></div>
            </div>
          ))}
        </div>
      </Card>
    );
  }

  if (transactions.length === 0) {
    return (
      <Card title="Últimas Transações">
        <div className="text-center py-12">
          <Clock size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 mb-2">Nenhuma transação ainda</p>
          <p className="text-sm text-gray-500">
            Suas transações aparecerão aqui
          </p>
        </div>
      </Card>
    );
  }

  return (
    // list of last transactions
    <Card title="Últimas Transações" subtitle="5 transações mais recentes">
      <div className="space-y-3">
        {transactions.map((transaction) => {
          const badge = getStatusBadge(transaction.status);
          const isPositive = isPositiveTransaction(transaction);

          return (
            <div
              key={transaction.id}
              className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className={clsx('w-12 h-12 rounded-full flex items-center justify-center', getTransactionColor(transaction))}>
                {getTransactionIcon(transaction)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <div className="font-semibold text-gray-900 truncate">
                    {getTransactionLabel(transaction.type)}
                    {(transaction.type === 'transfer' || transaction.type === 2) && (() => {
                      const isReceived = transaction.receiver_user_id === userId;
                      const person = isReceived 
                        ? transaction.sender_user
                        : transaction.receiver_user;
                      
                      console.log('Transaction:', transaction.id, {
                        type: transaction.type,
                        isReceived,
                        userId,
                        receiver_user_id: transaction.receiver_user_id,
                        sender_user_id: transaction.sender_user_id,
                        sender_user: transaction.sender_user,
                        receiver_user: transaction.receiver_user,
                        person
                      });
                      
                      if (!person) {
                        return <span className="font-normal text-sm text-red-500"> [sem dados do usuário]</span>;
                      }
                      
                      return (
                        <span className="font-normal text-sm">
                          {isReceived ? ' de ' : ' para '}
                          <UserTooltip name={person.name} email={person.email}>
                            <span className="text-blue-600 hover:underline cursor-pointer">
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
                <p className="text-sm text-gray-600 truncate">
                  {transaction.description || 'Sem descrição'}
                </p>
                <p className="text-xs text-gray-500">
                  {formatShortDate(transaction.created_at)}
                </p>
              </div>

              <div className="text-right flex-shrink-0">
                <p className={clsx('text-lg font-bold mb-2', isPositive ? 'text-green-600' : 'text-red-600')}>
                  {isPositive ? '+' : '-'} {formatCurrency(transaction.amount)}
                </p>
                
                {canReverse(transaction) && (
                  <Button
                    variant="outline"
                    onClick={() => handleReverse(transaction.id)}
                    isLoading={reversingId === transaction.id}
                    className="text-xs px-3 py-1.5"
                  >
                    <RotateCcw size={14} />
                    Estornar
                  </Button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
});
