import { useEffect, useState } from 'react';
import { auditService, AuditLog, AuditPaginationMeta } from '../services/audit';

export default function AuditLogs() {
  const [audits, setAudits] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [meta, setMeta] = useState<AuditPaginationMeta | null>(null);
  const [selectedAudit, setSelectedAudit] = useState<AuditLog | null>(null);
  const perPage = 15;

  useEffect(() => {
    loadAudits(currentPage);
  }, [currentPage]);

  const loadAudits = async (page: number) => {
    try {
      setLoading(true);
      setError('');
      const response = await auditService.getAuditLogs(page, perPage);
      setAudits(response.data);
      setMeta(response.meta);
    } catch (err: any) {
      console.error('Erro ao carregar audits:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Erro ao carregar logs de auditoria';
      setError(errorMessage);
      setAudits([]);
      setMeta(null);
    } finally {
      setLoading(false);
    }
  };

  const getEventLabel = (event: string): string => {
    const labels: Record<string, string> = {
      created: 'Criado',
      updated: 'Atualizado',
      deleted: 'Excluído',
      restored: 'Restaurado',
    };
    return labels[event] || event;
  };

  const getEventColor = (event: string): string => {
    const colors: Record<string, string> = {
      created: 'text-green-600 bg-green-50',
      updated: 'text-blue-600 bg-blue-50',
      deleted: 'text-red-600 bg-red-50',
      restored: 'text-purple-600 bg-purple-50',
    };
    return colors[event] || 'text-gray-600 bg-gray-50';
  };

  const getModelName = (type: string): string => {
    const parts = type.split('\\');
    return parts[parts.length - 1];
  };

  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && meta && page <= meta.last_page) {
      setCurrentPage(page);
    }
  };

  const renderPagination = () => {
    if (!meta || meta.last_page <= 1) return null;

    const pages: number[] = [];
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(meta.last_page, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return (
      <div className="flex items-center justify-between mt-6">
        <div className="text-sm text-gray-700">
          Mostrando {meta.from || 0} a {meta.to || 0} de {meta.total} registros
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Primeira
          </button>
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Anterior
          </button>
          {pages.map((page) => (
            <button
              key={page}
              onClick={() => handlePageChange(page)}
              className={`px-3 py-1 rounded border text-sm ${
                currentPage === page
                  ? 'bg-[#003161] text-white border-[#003161]'
                  : 'border-gray-300 hover:bg-gray-50'
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === meta.last_page}
            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Próxima
          </button>
          <button
            onClick={() => handlePageChange(meta.last_page)}
            disabled={currentPage === meta.last_page}
            className="px-3 py-1 rounded border border-gray-300 text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
          >
            Última
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#003161]">Logs de Auditoria</h1>
          <p className="text-gray-600 mt-2">
            Histórico completo de todas as ações realizadas na sua conta
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#003161] mx-auto"></div>
              <p className="mt-4 text-gray-600">Carregando logs...</p>
            </div>
          ) : audits.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Nenhum log de auditoria encontrado.
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Data/Hora
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Evento
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Modelo
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IP
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ações
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {audits.map((audit) => (
                      <tr key={audit.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatDate(audit.created_at)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 py-1 text-xs font-semibold rounded-full ${getEventColor(
                              audit.event
                            )}`}
                          >
                            {getEventLabel(audit.event)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getModelName(audit.auditable_type)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {audit.ip_address}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button
                            onClick={() => setSelectedAudit(audit)}
                            className="text-[#003161] hover:text-[#00610D] font-medium"
                          >
                            Ver Detalhes
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="px-6 py-4 bg-gray-50">
                {renderPagination()}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedAudit && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-[#003161]">Detalhes do Log</h2>
                <button
                  onClick={() => setSelectedAudit(null)}
                  className="text-gray-400 hover:text-gray-600 text-2xl"
                >
                  ×
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid gap-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Evento</h3>
                  <span
                    className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${getEventColor(
                      selectedAudit.event
                    )}`}
                  >
                    {getEventLabel(selectedAudit.event)}
                  </span>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Modelo</h3>
                  <p className="text-gray-900">{getModelName(selectedAudit.auditable_type)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">ID do Registro</h3>
                  <p className="text-gray-900 font-mono text-sm">{selectedAudit.auditable_id}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Data/Hora</h3>
                  <p className="text-gray-900">{formatDate(selectedAudit.created_at)}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">Endereço IP</h3>
                  <p className="text-gray-900">{selectedAudit.ip_address}</p>
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-700 mb-1">User Agent</h3>
                  <p className="text-gray-900 text-sm break-all">{selectedAudit.user_agent}</p>
                </div>
                {selectedAudit.url && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">URL</h3>
                    <p className="text-gray-900 text-sm break-all">{selectedAudit.url}</p>
                  </div>
                )}
                {Object.keys(selectedAudit.old_values || {}).length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Valores Anteriores</h3>
                    <pre className="bg-gray-50 p-3 rounded-lg text-sm overflow-x-auto">
                      {JSON.stringify(selectedAudit.old_values, null, 2)}
                    </pre>
                  </div>
                )}
                {Object.keys(selectedAudit.new_values || {}).length > 0 && (
                  <div>
                    <h3 className="text-sm font-semibold text-gray-700 mb-1">Novos Valores</h3>
                    <pre className="bg-gray-50 p-3 rounded-lg text-sm overflow-x-auto">
                      {JSON.stringify(selectedAudit.new_values, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
            <div className="p-6 bg-gray-50 border-t border-gray-200">
              <button
                onClick={() => setSelectedAudit(null)}
                className="w-full bg-[#003161] text-white py-3 rounded-lg font-semibold hover:bg-[#00610D] transition-colors"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
