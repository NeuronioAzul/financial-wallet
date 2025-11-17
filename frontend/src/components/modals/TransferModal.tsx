import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Check } from 'lucide-react';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { transferSchema } from '@/utils/validations';
import { transactionService } from '@/services';
import { formatCurrency } from '@/utils/formatters';
import toast from 'react-hot-toast';
import { z } from 'zod';

type TransferFormData = z.infer<typeof transferSchema>;

interface TransferModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  currentBalance: number;
}

export const TransferModal: React.FC<TransferModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  currentBalance,
}) => {
  const [step, setStep] = useState<'form' | 'confirm' | 'success'>('form');
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<TransferFormData>({
    resolver: zodResolver(transferSchema),
  });

  const formData = watch();

  const handleClose = () => {
    setStep('form');
    reset();
    onClose();
  };

  const handleFormSubmit = (data: TransferFormData) => {
    if (data.amount > currentBalance) {
      toast.error('Saldo insuficiente');
      return;
    }
    setStep('confirm');
  };

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await transactionService.transfer({
        receiver_email: formData.receiver_email,
        amount: formData.amount,
        description: formData.description,
      });
      setStep('success');
      toast.success('Transferência realizada com sucesso!');
      setTimeout(() => {
        handleClose();
        onSuccess?.();
      }, 2000);
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Erro ao realizar transferência');
      setStep('form');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={handleClose} title="Nova Transferência">
      <div className="relative">
        {step === 'form' && (
          <>
            <p className="text-gray-600 mb-6">
              Saldo disponível: {formatCurrency(currentBalance)}
            </p>

            <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
              <Input
                label="E-mail do destinatário"
                type="email"
                placeholder="destinatario@exemplo.com"
                error={errors.receiver_email?.message}
                {...register('receiver_email')}
              />

              <Input
                label="Valor"
                type="number"
                step="0.01"
                placeholder="0,00"
                error={errors.amount?.message}
                {...register('amount', { valueAsNumber: true })}
              />

              <Input
                label="Descrição (opcional)"
                placeholder="Ex: Pagamento do almoço"
                error={errors.description?.message}
                {...register('description')}
              />

              <div className="flex gap-3 pt-4">
                <Button type="button" variant="outline" onClick={handleClose} className="flex-1">
                  Cancelar
                </Button>
                <Button type="submit" className="flex-1">
                  Continuar
                  <ArrowRight size={20} />
                </Button>
              </div>
            </form>
          </>
        )}

        {step === 'confirm' && (
          <>
            <h2 className="text-2xl font-bold gradient-text mb-2">
              Confirmar Transferência
            </h2>
            <p className="text-gray-600 mb-6">
              Revise os dados antes de confirmar
            </p>

            <div className="space-y-4 mb-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Destinatário</p>
                <p className="font-semibold text-gray-900">{formData.receiver_email}</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Valor</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(formData.amount)}
                </p>
              </div>

              {formData.description && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Descrição</p>
                  <p className="font-semibold text-gray-900">{formData.description}</p>
                </div>
              )}

              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  Saldo após transferência:{' '}
                  <span className="font-bold">
                    {formatCurrency(currentBalance - formData.amount)}
                  </span>
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setStep('form')}
                disabled={loading}
                className="flex-1"
              >
                Voltar
              </Button>
              <Button
                onClick={handleConfirm}
                isLoading={loading}
                className="flex-1"
              >
                Confirmar Transferência
              </Button>
            </div>
          </>
        )}

        {step === 'success' && (
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check size={32} className="text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Transferência Realizada!
            </h2>
            <p className="text-gray-600 mb-4">
              {formatCurrency(formData.amount)} enviado para {formData.receiver_email}
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
