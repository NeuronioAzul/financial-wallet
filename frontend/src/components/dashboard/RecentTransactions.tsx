import { useEffect, useState, useImperativeHandle, forwardRef } from 'react';
import { ArrowUpRight, Plus, RotateCcw, Clock } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { transactionService } from '@/services';
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

  useEffect(() => {
    loadTransactions();
  }, []);

  useImperativeHandle(ref, () => ({
    refresh: loadTransactions,
  }));

  const loadTransactions = async () => {
    try {
      const response = await transactionService.getTransactions(1, 5);
      setTransactions(response.data);
    } catch (error) {
      console.error('Error loading transactions:', error);
      toast.error('Erro ao carregar transações');
    } finally {
      setLoading(false);
    }
  };

  const getTransactionIcon = (type: string) => {
    const icons = {
      transfer: <ArrowUpRight size={20} />,
      deposit: <Plus size={20} />,
      reversal: <RotateCcw size={20} />,
    };
    return icons[type as keyof typeof icons] || <Clock size={20} />;
  };

  const getTransactionColor = (type: string) => {
    const colors = {
      transfer: 'text-blue-600 bg-blue-50',
      deposit: 'text-green-600 bg-green-50',
      reversal: 'text-orange-600 bg-orange-50',
    };
    return colors[type as keyof typeof colors] || 'text-gray-600 bg-gray-50';
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

  const getTransactionLabel = (type: string) => {
    const labels = {
      transfer: 'Transferência',
      deposit: 'Depósito',
      reversal: 'Estorno',
    };
    return labels[type as keyof typeof labels] || type;
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
    <Card title="Últimas Transações" subtitle="5 transações mais recentes">
      <div className="space-y-3">
        {transactions.map((transaction) => {
          const badge = getStatusBadge(transaction.status);
          const isPositive = transaction.type === 'deposit' || transaction.type === 'reversal';

          return (
            <div
              key={transaction.id}
              className="flex items-center gap-4 p-3 hover:bg-gray-50 rounded-lg transition-colors"
            >
              <div className={clsx('w-12 h-12 rounded-full flex items-center justify-center', getTransactionColor(transaction.type))}>
                {getTransactionIcon(transaction.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="font-semibold text-gray-900 truncate">
                    {getTransactionLabel(transaction.type)}
                  </p>
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

              <div className="text-right">
                <p className={clsx('text-lg font-bold', isPositive ? 'text-green-600' : 'text-red-600')}>
                  {isPositive ? '+' : '-'} {formatCurrency(transaction.amount)}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
});
