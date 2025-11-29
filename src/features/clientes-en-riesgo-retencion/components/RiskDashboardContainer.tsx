import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, MetricCards, Button, Badge } from '../../../components/componentsreutilizables';
import { ClientRiskTable } from './ClientRiskTable';
import { RiskFilterPanel } from './RiskFilterPanel';
import { ClientRetentionModal } from './ClientRetentionModal';
import { MetricCardData } from '../../../components/componentsreutilizables';
import {
  ClientRisk,
  RiskFilters,
  UserRole,
  RetentionAnalytics,
  PaginationMeta,
} from '../types';
import { riskClientsApi } from '../api/riskClientsApi';
import { ds } from '../../adherencia/ui/ds';
import {
  Users,
  TrendingDown,
  TrendingUp,
  AlertTriangle,
  DollarSign,
  Mail,
  Download,
  Plus,
  UserCheck,
} from 'lucide-react';

interface RiskDashboardContainerProps {
  userType: UserRole;
}

export const RiskDashboardContainer: React.FC<RiskDashboardContainerProps> = ({
  userType,
}) => {
  const navigate = useNavigate();
  const [clients, setClients] = useState<ClientRisk[]>([]);
  const [analytics, setAnalytics] = useState<RetentionAnalytics | null>(null);
  const [filters, setFilters] = useState<RiskFilters>({});
  const [pagination, setPagination] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: 20,
    totalPages: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingAnalytics, setIsLoadingAnalytics] = useState(true);
  const [selectedClient, setSelectedClient] = useState<{ id: string; name: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchClients = async (page: number = 1) => {
    setIsLoading(true);
    try {
      const response = await riskClientsApi.getRiskClients(userType, filters, page, 20);
      setClients(response.data);
      setPagination(response.pagination);
    } catch (error) {
      console.error('Error fetching clients:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchAnalytics = async () => {
    setIsLoadingAnalytics(true);
    try {
      const data = await riskClientsApi.getAnalytics(userType);
      setAnalytics(data);
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setIsLoadingAnalytics(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, [filters, userType]);

  useEffect(() => {
    fetchAnalytics();
  }, [userType]);

  const handleFilterChange = (newFilters: RiskFilters) => {
    setFilters(newFilters);
  };

  const handleActionClick = (clientId: string, action: 'email' | 'log_activity' | 'view_details') => {
    const client = clients.find(c => c.id === clientId);
    if (action === 'log_activity' && client) {
      setSelectedClient({ id: client.id, name: client.name });
      setIsModalOpen(true);
    } else if (action === 'email') {
      // Implementar envío de email
      console.log('Enviar email a cliente:', clientId);
    } else if (action === 'view_details') {
      // Navegar a la página de perfil del cliente
      navigate(`/crm/cliente-360/${clientId}`);
    }
  };

  const handleRetentionActionSubmit = async (data: {
    actionType: any;
    notes: string;
    outcome?: any;
  }) => {
    if (!selectedClient) return;
    await riskClientsApi.createRetentionAction(selectedClient.id, data);
    // Refrescar datos si es necesario
    fetchClients(pagination.page);
  };

  const handleExport = () => {
    // Implementar exportación CSV
    console.log('Exportar a CSV');
  };

  const handleBatchAction = async () => {
    // Implementar acciones en lote
    console.log('Acción en lote');
  };

  const getRiskLevelColor = (level: 'low' | 'medium' | 'high') => {
    switch (level) {
      case 'low':
        return 'info';
      case 'medium':
        return 'warning';
      case 'high':
        return 'error';
    }
  };

  const metrics: MetricCardData[] = analytics
    ? [
        {
          id: 'total-at-risk',
          title: 'Clientes en Riesgo',
          value: analytics.totalAtRisk,
          color: 'error',
          icon: <Users className="w-6 h-6" />,
          loading: isLoadingAnalytics,
        },
        {
          id: 'churn-rate',
          title: 'Tasa de Abandono',
          value: `${analytics.churnRateMonthly.toFixed(1)}%`,
          subtitle: 'Mensual',
          color: 'error',
          icon: <TrendingDown className="w-6 h-6" />,
          loading: isLoadingAnalytics,
          trend: {
            value: -2.5,
            direction: 'down',
            label: 'vs mes anterior',
          },
        },
        {
          id: 'retention-success',
          title: 'Tasa de Éxito',
          value: `${analytics.retentionSuccessRate.toFixed(1)}%`,
          subtitle: 'Retención',
          color: 'success',
          icon: <UserCheck className="w-6 h-6" />,
          loading: isLoadingAnalytics,
          trend: {
            value: 5.2,
            direction: 'up',
            label: 'vs mes anterior',
          },
        },
        {
          id: 'avg-days',
          title: userType === 'gym' ? 'Promedio Días sin Visita' : 'Promedio Días sin Comunicación',
          value: `${analytics.avgDaysSinceLastVisit}`,
          subtitle: 'días',
          color: 'warning',
          icon: <AlertTriangle className="w-6 h-6" />,
          loading: isLoadingAnalytics,
        },
        ...(userType === 'gym' && analytics.mrrAtRisk
          ? [
              {
                id: 'mrr-at-risk',
                title: 'MRR en Riesgo',
                value: `€${analytics.mrrAtRisk.toLocaleString('es-ES')}`,
                subtitle: 'Ingresos mensuales',
                color: 'error',
                icon: <DollarSign className="w-6 h-6" />,
                loading: isLoadingAnalytics,
              } as MetricCardData,
            ]
          : []),
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end gap-2">
        <Button variant="secondary" onClick={handleExport}>
          <Download size={20} className="mr-2" />
          Exportar CSV
        </Button>
        <Button variant="primary" onClick={handleBatchAction}>
          <Mail size={20} className="mr-2" />
          Acción en Lote
        </Button>
      </div>

      {/* KPIs */}
      <MetricCards data={metrics} columns={userType === 'gym' ? 5 : 4} />

      {/* Distribución de Riesgo */}
      {analytics && (
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Distribución por Nivel de Riesgo
            </h3>
            <div className="grid grid-cols-3 gap-4">
              {(['low', 'medium', 'high'] as const).map((level) => {
                const count = analytics.riskDistribution[level];
                const percentage = (count / analytics.totalAtRisk) * 100;
                return (
                  <div key={level} className="text-center">
                    <Badge variant={getRiskLevelColor(level)} size="md" className="mb-2">
                      {level === 'low' ? 'Bajo' : level === 'medium' ? 'Medio' : 'Alto'}
                    </Badge>
                    <div className="text-xl font-bold text-gray-900 mt-2">
                      {count}
                    </div>
                    <div className="text-sm text-gray-600">
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Filtros */}
      <RiskFilterPanel userType={userType} onFilterChange={handleFilterChange} />

      {/* Tabla de Clientes */}
      <ClientRiskTable
        clients={clients}
        userType={userType}
        onActionClick={handleActionClick}
        loading={isLoading}
      />

      {/* Paginación */}
      {pagination.totalPages > 1 && (
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              disabled={pagination.page === 1}
              onClick={() => fetchClients(pagination.page - 1)}
            >
              Anterior
            </Button>
            <span className="text-sm text-gray-600 px-4">
              Página {pagination.page} de {pagination.totalPages}
            </span>
            <Button
              variant="ghost"
              size="sm"
              disabled={pagination.page === pagination.totalPages}
              onClick={() => fetchClients(pagination.page + 1)}
            >
              Siguiente
            </Button>
          </div>
        </Card>
      )}

      {/* Modal de Retención */}
      {selectedClient && (
        <ClientRetentionModal
          isOpen={isModalOpen}
          clientId={selectedClient.id}
          clientName={selectedClient.name}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedClient(null);
          }}
          onSubmit={handleRetentionActionSubmit}
          onSuccess={() => {
            fetchClients(pagination.page);
          }}
        />
      )}
    </div>
  );
};

