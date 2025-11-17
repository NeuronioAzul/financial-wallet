import React, { useState } from "react";
import { X } from "lucide-react";

interface ReverseTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  transaction: {
    id: string;
    code?: string;
    amount: string | number;
    type: string;
    isSender?: boolean;
  };
  isLoading?: boolean;
}

const ReverseTransactionModal: React.FC<ReverseTransactionModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  transaction,
  isLoading = false,
}) => {
  const [reason, setReason] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onConfirm(reason);
  };

  const handleClose = () => {
    if (!isLoading) {
      setReason("");
      onClose();
    }
  };

  const actionLabel = transaction.isSender ? "Estornar" : "Devolver";
  const actionColor = transaction.isSender
    ? "bg-amber-600 hover:bg-amber-700"
    : "bg-blue-600 hover:bg-blue-700";
  const title = transaction.isSender
    ? "Estornar Transferência"
    : "Devolver Transferência";
  const description = transaction.isSender
    ? "Você está prestes a estornar uma transferência que você enviou. O valor será devolvido para sua carteira."
    : "Você está prestes a devolver uma transferência que recebeu. O valor será devolvido para o remetente.";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-gray-200 p-6 pb-4">
          <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
          <button
            onClick={handleClose}
            disabled={isLoading}
            className="rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            {/* Alert Box */}
            <div
              className={`rounded-lg p-4 ${
                transaction.isSender
                  ? "bg-amber-50 border border-amber-200"
                  : "bg-blue-50 border border-blue-200"
              }`}
            >
              <p className="text-sm text-gray-700">{description}</p>
            </div>

            {/* Transaction Info */}
            <div className="rounded-lg bg-gray-50 p-4 space-y-2">
              {transaction.code && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Código:</span>
                  <span className="font-mono font-medium text-gray-900">
                    {transaction.code}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">ID:</span>
                <span className="font-mono text-xs font-medium text-gray-900">
                  {transaction.id}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Valor:</span>
                <span className="font-semibold text-gray-900">
                  {new Intl.NumberFormat("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  }).format(
                    typeof transaction.amount === "string"
                      ? parseFloat(transaction.amount)
                      : transaction.amount
                  )}
                </span>
              </div>
            </div>

            {/* Reason Input */}
            <div>
              <label
                htmlFor="reason"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Motivo {transaction.isSender ? "do estorno" : "da devolução"}{" "}
                (opcional)
              </label>
              <textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                disabled={isLoading}
                rows={3}
                placeholder={
                  transaction.isSender
                    ? "Ex: Transferência realizada por engano"
                    : "Ex: Não reconheço esta transferência"
                }
                className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-ocean-blue focus:outline-none focus:ring-2 focus:ring-ocean-blue/20 disabled:bg-gray-50 disabled:text-gray-500"
                maxLength={255}
              />
              <p className="mt-1 text-xs text-gray-500">
                {reason.length}/255 caracteres
              </p>
            </div>

            {/* Warning */}
            <div className="rounded-lg bg-red-50 border border-red-200 p-3">
              <p className="text-xs text-red-800">
                <strong>Atenção:</strong> Esta ação não pode ser desfeita.
                {transaction.isSender
                  ? " O destinatário será notificado sobre o estorno."
                  : " O remetente receberá o valor de volta."}
              </p>
            </div>
          </div>

          {/* Footer */}
          <div className="flex gap-3 border-t border-gray-200 p-6 pt-4">
            <button
              type="button"
              onClick={handleClose}
              disabled={isLoading}
              className="flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`flex-1 rounded-lg px-4 py-2.5 text-sm font-medium text-white transition-colors disabled:opacity-50 ${actionColor}`}
            >
              {isLoading ? "Processando..." : actionLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReverseTransactionModal;
