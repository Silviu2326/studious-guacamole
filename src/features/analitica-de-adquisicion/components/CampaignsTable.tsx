import React from 'react';
import { Table } from '../../../components/componentsreutilizables';
import { CampaignData } from '../types';
import { Badge } from '../../../components/componentsreutilizables';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

interface CampaignsTableProps {
  data: CampaignData[];
  loading?: boolean;
  onSort?: (column: string, direction: 'asc' | 'desc') => void;
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
}

export const CampaignsTable: React.FC<CampaignsTableProps> = ({
  data,
  loading = false,
  onSort,
  sortColumn,
  sortDirection = 'asc',
}) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
    }).format(value);
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const getStatusBadge = (status?: string) => {
    switch (status) {
      case 'active':
        return <Badge variant="green">Activa</Badge>;
      case 'paused':
        return <Badge variant="yellow">Pausada</Badge>;
      case 'completed':
        return <Badge variant="gray">Completada</Badge>;
      default:
        return <Badge variant="gray">-</Badge>;
    }
  };

  const getConversionRate = (campaign: CampaignData) => {
    if (campaign.leads === 0) return '0%';
    return `${((campaign.conversions / campaign.leads) * 100).toFixed(1)}%`;
  };

  const columns = [
    {
      key: 'name',
      label: 'Campaña',
      sortable: true,
      render: (value: string, row: CampaignData) => (
        <div>
          <div className="font-semibold text-gray-900">
            {value}
          </div>
          <div className="text-sm text-gray-600">
            {row.channel}
          </div>
        </div>
      ),
    },
    {
      key: 'cost',
      label: 'Inversión',
      sortable: true,
      align: 'right' as const,
      render: (value: number) => (
        <span className="font-semibold">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'leads',
      label: 'Leads',
      sortable: true,
      align: 'right' as const,
      render: (value: number) => <span>{value}</span>,
    },
    {
      key: 'conversions',
      label: 'Conversiones',
      sortable: true,
      align: 'right' as const,
      render: (value: number, row: CampaignData) => (
        <div className="text-right">
          <span className="font-semibold">{value}</span>
          <span className="text-xs ml-2 text-gray-600">
            ({getConversionRate(row)})
          </span>
        </div>
      ),
    },
    {
      key: 'cpa',
      label: 'CPA',
      sortable: true,
      align: 'right' as const,
      render: (value: number) => (
        <span className="font-semibold">{formatCurrency(value)}</span>
      ),
    },
    {
      key: 'revenue',
      label: 'Ingresos',
      sortable: true,
      align: 'right' as const,
      render: (value: number | undefined) => (
        <span className="font-semibold">{value ? formatCurrency(value) : '-'}</span>
      ),
    },
    {
      key: 'roas',
      label: 'ROAS',
      sortable: true,
      align: 'right' as const,
      render: (value: number | undefined, row: CampaignData) => {
        if (!value && value !== 0) return '-';
        const roasValue = row.revenue && row.cost > 0 ? row.revenue / row.cost : 0;
        return (
          <div className="flex items-center justify-end gap-1">
            {roasValue > 3 ? (
              <TrendingUp className="w-4 h-4 text-green-500" />
            ) : roasValue < 2 ? (
              <TrendingDown className="w-4 h-4 text-red-500" />
            ) : (
              <Minus className="w-4 h-4 text-gray-500" />
            )}
            <span className="font-semibold">{roasValue.toFixed(2)}x</span>
          </div>
        );
      },
    },
    {
      key: 'status',
      label: 'Estado',
      sortable: false,
      render: (_value: any, row: CampaignData) => getStatusBadge(row.status),
    },
    {
      key: 'dates',
      label: 'Período',
      sortable: false,
      render: (_value: any, row: CampaignData) => (
        <div className="text-sm text-gray-600">
          {formatDate(row.startDate)} - {formatDate(row.endDate) || 'Actual'}
        </div>
      ),
    },
  ];

  return (
    <Table
      data={data}
      columns={columns}
      loading={loading}
      onSort={onSort}
      sortColumn={sortColumn}
      sortDirection={sortDirection}
      emptyMessage="No hay campañas disponibles"
    />
  );
};

