import { useState, useEffect, forwardRef, useImperativeHandle } from 'react';
import { Eye, EyeOff, Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, History } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { walletService } from '@/services';
import { Wallet } from '@/types';
import { formatCurrency } from '@/utils/formatters';
import toast from 'react-hot-toast';

interface WalletCardProps {
  onDeposit: () => void;
  onTransfer: () => void;
  onHistory: () => void;
  onBalanceUpdate?: (balance: number) => void;
}

export interface WalletCardRef {
  refresh: () => void;
}

export const WalletCard = forwardRef<WalletCardRef, WalletCardProps>(
  ({ onDeposit, onTransfer, onHistory, onBalanceUpdate }, ref) => {
    const [wallet, setWallet] = useState<Wallet | null>(null);
    const [loading, setLoading] = useState(true);
    const [showBalance, setShowBalance] = useState(true);

    useEffect(() => {
      loadWallet();
    }, []);

    useImperativeHandle(ref, () => ({
      refresh: loadWallet,
    }));

    const loadWallet = async () => {
      try {
        const data = await walletService.getWallet();
        setWallet(data);
        onBalanceUpdate?.(parseFloat(data.balance));
      } catch (error) {
        console.error('Error loading wallet:', error);
        toast.error('Erro ao carregar carteira');
      } finally {
        setLoading(false);
      }
    };

  if (loading) {
    return (
      <Card className="animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-12 bg-gray-200 rounded w-1/2 mb-6"></div>
        <div className="flex gap-3">
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
        </div>
      </Card>
    );
  }

  return (
    <Card className="bg-gradient-to-br from-primary to-primary-light text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <WalletIcon size={24} className="text-accent" />
          <h2 className="text-lg font-semibold">Saldo Disponível</h2>
        </div>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          {showBalance ? <Eye size={20} /> : <EyeOff size={20} />}
        </button>
      </div>

      <div className="mb-8">
        <p className="text-sm text-accent mb-1">Saldo atual</p>
        <h3 className="text-4xl font-bold">
          {showBalance ? formatCurrency(wallet?.balance || '0') : 'R$ ••••••'}
        </h3>
        <p className="text-xs text-white/70 mt-2">
          Status: <span className="text-accent font-semibold">{wallet?.status === 'active' ? 'Ativa' : 'Inativa'}</span>
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <Button
          onClick={onDeposit}
          variant="primary"
          className="bg-green-500 hover:bg-green-600 text-white border-0"
        >
          <ArrowDownLeft size={18} />
          Depositar
        </Button>
        <Button
          onClick={onTransfer}
          variant="secondary"
          className="bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0"
        >
          <ArrowUpRight size={18} />
          Transferir
        </Button>
        <Button
          onClick={onHistory}
          variant="outline"
          className="border-white/30 text-white hover:bg-white/10"
        >
          <History size={18} />
          Histórico
        </Button>
      </div>
    </Card>
  );
});
