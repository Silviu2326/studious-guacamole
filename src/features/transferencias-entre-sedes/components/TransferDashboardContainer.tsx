import React, { useState } from 'react';
import { useTransferApi } from '../hooks/useTransferApi';
import { TransferListTable } from './TransferListTable';
import { TransferActionModal } from './TransferActionModal';
import { NuevaTransferenciaModal } from './NuevaTransferenciaModal';
import { Button, Select, Card, MetricCards } from '../../../components/componentsreutilizables';
import { TransferFilters, Transfer, CreateTransferRequest } from '../types';
import { Building2, Plus, RefreshCw, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

export const TransferDashboardContainer: React.FC = () => {
  const [filters, setFilters] = useState<TransferFilters>({
    status: undefined,
    originLocationId: undefined,
    destinationLocationId: undefined,
    page: 1,
    limit: 20,
  });
  
  const [selectedTransfer, setSelectedTransfer] = useState<Transfer | null>(null);
  const [showNewTransferModal, setShowNewTransferModal] = useState(false);
  
  const { transfers, kpis, loading, error, pagination, addTransfer, updateStatus, refetch } = useTransferApi(filters);

  const handleApprove = async (transferId: string) => {
    await updateStatus(transferId, { status: 'APPROVED' });
  };

  const handleReject = async (transferId: string, reason: string) => {
    await updateStatus(transferId, { status: 'REJECTED', rejectionReason: reason });
  };

  const handleSubmitNewTransfer = async (data: CreateTransferRequest) => {
    await addTransfer(data);
  };

  const handleStatusFilterChange = (status: string) => {
    setFilters({ ...filters, status: status === 'all' ? undefined : status as TransferFilters['status'] });
  };

  const metricCardsData = kpis ? [
    {
      id: 'pending',
      title: 'Transferencias Pendientes',
      value: kpis.pendingTransfers.toString(),
      icon: <Clock size={20} />,
      color: 'warning' as const,
    },
    {
      id: 'approval',
      title: 'Tasa de Aprobación',
      value: `${kpis.approvalRate.toFixed(1)}%`,
      icon: <CheckCircle size={20} />,
      color: 'success' as const,
    },
    {
      id: 'time',
      title: 'Tiempo Promedio',
      value: `${kpis.averageResolutionTime.toFixed(1)}h`,
      icon: <TrendingUp size={20} />,
      color: 'info' as const,
    },
    {
      id: 'completed',
      title: 'Transferencias Completadas',
      value: kpis.completedTransfers.toString(),
      icon: <Building2 size={20} />,
      color: 'success' as const,
    },
  ] : [];

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-end">
        <Button onClick={() => setShowNewTransferModal(true)} leftIcon={<Plus size={20} className="mr-2" />}>
          Nueva Transferencia
        </Button>
      </div>

      {/* KPIs Cards */}
      {kpis && metricCardsData.length > 0 && (
        <MetricCards data={metricCardsData} columns={4} />
      )}

      {/* Sistema de Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1">
                <select
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5"
                  value={filters.status || 'all'}
                  onChange={(e) => handleStatusFilterChange(e.target.value)}
                >
                  <option value="all">Todos los Estados</option>
                  <option value="PENDING">Pendiente</option>
                  <option value="APPROVED">Aprobada</option>
                  <option value="REJECTED">Rechazada</option>
                  <option value="COMPLETED">Completada</option>
                </select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="secondary"
                  onClick={refetch}
                  leftIcon={<RefreshCw size={18} className="mr-2" />}
                >
                  Actualizar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Mensaje de error */}
      {error && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={refetch} variant="secondary">
            Reintentar
          </Button>
        </Card>
      )}

      {/* Lista de Transferencias */}
      {!error && (
        <TransferListTable
          transfers={transfers}
          onViewDetails={(transferId) => {
            const transfer = transfers.find(t => t.id === transferId);
            setSelectedTransfer(transfer || null);
          }}
          isLoading={loading}
        />
      )}

      {/* Modal de Detalles/Acciones */}
      <TransferActionModal
        transfer={selectedTransfer}
        onClose={() => setSelectedTransfer(null)}
        onApprove={handleApprove}
        onReject={handleReject}
      />

      {/* Modal de Nueva Transferencia */}
      <NuevaTransferenciaModal
        isOpen={showNewTransferModal}
        onClose={() => setShowNewTransferModal(false)}
        onSubmit={handleSubmitNewTransfer}
      />
    </div>
  );
};

