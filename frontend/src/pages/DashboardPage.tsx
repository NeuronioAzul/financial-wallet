import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { WalletCard } from '@/components/dashboard/WalletCard';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { DepositModal } from '@/components/modals/DepositModal';
import { TransferModal } from '@/components/modals/TransferModal';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [currentBalance, setCurrentBalance] = useState(0);
  const walletRef = useRef<{ refresh: () => void }>(null);
  const transactionsRef = useRef<{ refresh: () => void }>(null);

  const handleBalanceUpdate = (balance: number) => {
    setCurrentBalance(balance);
  };

  const handleDeposit = () => {
    setShowDepositModal(true);
  };

  const handleTransfer = () => {
    setShowTransferModal(true);
  };

  const handleHistory = () => {
    navigate('/transactions');
  };

  const handleTransactionSuccess = () => {
    walletRef.current?.refresh();
    transactionsRef.current?.refresh();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardHeader />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Wallet Card */}
          <WalletCard 
            ref={walletRef}
            onDeposit={handleDeposit}
            onTransfer={handleTransfer}
            onHistory={handleHistory}
            onBalanceUpdate={handleBalanceUpdate}
          />

          {/* Recent Transactions */}
          <RecentTransactions ref={transactionsRef} />
        </div>
      </main>

      {/* Modals */}
      <DepositModal
        isOpen={showDepositModal}
        onClose={() => setShowDepositModal(false)}
        onSuccess={handleTransactionSuccess}
      />
      <TransferModal
        isOpen={showTransferModal}
        onClose={() => setShowTransferModal(false)}
        onSuccess={handleTransactionSuccess}
        currentBalance={currentBalance}
      />
    </div>
  );
};
