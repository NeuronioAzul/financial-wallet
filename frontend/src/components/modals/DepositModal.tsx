import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { X, Plus, Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { depositSchema } from '@/utils/validations';
import { transactionService } from '@/services';
import { formatCurrency } from '@/utils/formatters';
import toast from 'react-hot-toast';
import { z } from 'zod';
import { clsx } from 'clsx';

type DepositFormData = z.infer<typeof depositSchema>;

interface DepositModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const QUICK_AMOUNTS = [50, 100, 500];

export const DepositModal: React.FC<DepositModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const [step, setStep] = useState<'form' | 'success'>('form');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<DepositFormData>({
    resolver: zodResolver(depositSchema),
  });

  const amount = watch('amount');

  const handleClose = () => {
    setStep('form');
    reset();
    onClose();
  };

  const handleQuickAmount = (value: number) => {
    setValue('amount', value, { shouldValidate: true });
  };

  const onSubmit = async (data: DepositFormData) => {
    setLoading(true);
    try {
      await transactionService.deposit({
        amount: data.amount,
        description: data.description,
      });
      setStep('success');
      toast.success('Depósito realizado com sucesso!');
      setTimeout(() => {
        handleClose();
        onSuccess?.();
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao realizar depósito');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="">
      <div className="relative">
        <button
          onClick={handleClose}
          className="absolute right-0 top-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        {step === 'form' && (
          <>
            <h2 className="text-2xl font-bold gradient-text mb-2">
              Novo Depósito
            </h2>
            <p className="text-gray-600 mb-6">
              Adicione saldo à sua carteira
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Valores rápidos
                </label>
                <div className="grid grid-cols-3 gap-3 mb-4">
                  {QUICK_AMOUNTS.map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => handleQuickAmount(value)}
                      className={clsx(
                        'py-3 px-4 rounded-lg font-semibold transition-all',
                        amount === value
                          ? 'bg-primary text-white shadow-lg'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      {formatCurrency(value)}
                    </button>
                  ))}
                </div>
              </div>

              <Input
                label="Valor personalizado"
                type="number"
                step="0.01"
                placeholder="0,00"
                error={errors.amount?.message}
                {...register('amount', { valueAsNumber: true })}
              />

              <Input
                label="Descrição (opcional)"
                placeholder="Ex: Recarga mensal"
                error={errors.description?.message}
                {...register('description')}
              />

              {amount > 0 && (
                <div className="bg-green-50 p-4 rounded-lg border border-green-200">
                  <p className="text-sm text-green-800">
                    Você irá adicionar:{' '}
                    <span className="font-bold text-lg">
                      {formatCurrency(amount)}
                    </span>
                  </p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" isLoading={loading} className="flex-1">
                  <Plus size={20} />
                  Confirmar Depósito
                </Button>
              </div>
            </form>
          </>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Depósito Realizado!
            </h2>
            <p className="text-gray-600 mb-4">
              {formatCurrency(amount)} adicionado à sua carteira
            </p>
            <p className="text-sm text-gray-500">
              Redirecionando...
            </p>
          </div>
        )}
      </div>
    </Modal>
  );
};
