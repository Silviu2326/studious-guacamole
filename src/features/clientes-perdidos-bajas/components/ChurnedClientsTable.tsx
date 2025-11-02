import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { Table, Button, Card } from '../../../components/componentsreutilizables';
import { getChurnedClients, exportChurnedClients, getCancellationReasons } from '../api';
import { ChurnedClient, ChurnedClientsFilters, CancellationReason, UserType } from '../types';
import { Download, Search, Eye, FileText } from 'lucide-react';

interface ChurnedClientsTableProps {
  userType: UserType;
  onViewDetails?: (clientId: string) => void;
}

export const ChurnedClientsTable: React.FC<ChurnedClientsTableProps> = ({ 
  userType,
  onViewDetails 
}) => {
  const [clients, setClients] = useState<ChurnedClient[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<ChurnedClientsFilters>({
    page: 1,
    limit: 10,
  });
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });
  const [sortColumn, setSortColumn] = useState<string>('cancellationDate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [reasons, setReasons] = useState<CancellationReason[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const loadClients = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getChurnedClients(filters);
      setClients(response.data);
      setPagination(response.pagination);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar clientes');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  const loadReasons = useCallback(async () => {
    try {
      const reasonsData = await getCancellationReasons();
      setReasons(reasonsData);
    } catch (err) {
      console.error('Error loading reasons:', err);
    }
  }, []);

  useEffect(() => {
    loadReasons();
  }, [loadReasons]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const handleSort = useCallback((column: string, direction: 'asc' | 'desc') => {
    setSortColumn(column);
    setSortDirection(direction);
    // En una implementación real, esto se enviaría al backend
    // Por ahora solo actualizamos localmente
    const sorted = [...clients].sort((a, b) => {
      const aVal = a[column as keyof ChurnedClient];
      const bVal = b[column as keyof ChurnedClient];
      if (!aVal || !bVal) return 0;
      if (direction === 'asc') {
        return aVal > bVal ? 1 : -1;
      }
      return aVal < bVal ? 1 : -1;
    });
    setClients(sorted);
  }, [clients]);

  const handleFilterChange = useCallback((key: keyof ChurnedClientsFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  }, []);

  const handleExport = useCallback(async () => {
    try {
      const blob = await exportChurnedClients(filters);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `clientes-perdidos-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert('Error al exportar datos');
      console.error('Export error:', err);
    }
  }, [filters]);

  const filteredClients = useMemo(() => {
    if (!searchTerm) return clients;
    const term = searchTerm.toLowerCase();
    return clients.filter(client => 
      client.name.toLowerCase().includes(term) ||
      client.email.toLowerCase().includes(term) ||
      client.reason.toLowerCase().includes(term)
    );
  }, [clients, searchTerm]);

  const columns = useMemo(() => [
    {
      key: 'name',
      label: 'Nombre',
      sortable: true,
      render: (value: string, row: ChurnedClient) => (
        <div>
          <div className="text-sm font-semibold text-gray-900">
            {value}
          </div>
          <div className="text-xs text-gray-500">
            {row.email}
          </div>
        </div>
      ),
    },
    {
      key: 'cancellationDate',
      label: 'Fecha de Baja',
      sortable: true,
      render: (value: string) => {
        const date = new Date(value);
        const months = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];
        const day = date.getDate().toString().padStart(2, '0');
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return (
          <span className="text-sm text-gray-900">
            {day} {month} {year}
          </span>
        );
      },
    },
    {
      key: 'reason',
      label: 'Motivo',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-gray-900">{value}</span>
      ),
    },
    {
      key: 'plan',
      label: userType === 'gym' ? 'Plan/Membresía' : 'Plan',
      sortable: true,
      render: (value: string) => (
        <span className="text-sm text-gray-900">{value}</span>
      ),
    },
    ...(userType === 'gym' ? [{
      key: 'trainerName',
      label: 'Entrenador',
      sortable: false,
      render: (value: string) => (
        <span className="text-sm text-gray-900">{value || 'N/A'}</span>
      ),
    }] : []),
    {
      key: 'actions',
      label: 'Acciones',
      sortable: false,
      render: (_: any, row: ChurnedClient) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onViewDetails?.(row.id)}
          >
            <Eye size={16} />
          </Button>
          {userType === 'gym' && row.documentUrl && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open(row.documentUrl, '_blank')}
            >
              <FileText size={16} />
            </Button>
          )}
        </div>
      ),
    },
  ], [userType, onViewDetails]);

  return (
    <Card className="mb-6 bg-white shadow-sm">
      <div className="space-y-4">
        {/* Filtros */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, email o motivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
              />
            </div>
            {reasons.length > 0 && (
              <div className="w-full md:w-64">
                <select
                  value={filters.reasonId || ''}
                  onChange={(e) => handleFilterChange('reasonId', e.target.value || undefined)}
                  className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                >
                  <option value="">Todos los motivos</option>
                  {reasons.map(r => (
                    <option key={r.id} value={r.id}>{r.label}</option>
                  ))}
                </select>
              </div>
            )}
            <Button
              variant="secondary"
              onClick={handleExport}
              disabled={loading}
            >
              <Download size={20} className="mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Tabla */}
        {error ? (
          <Card className="p-8 text-center bg-white shadow-sm">
            <p className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</p>
            <p className="text-gray-600">{error}</p>
          </Card>
        ) : (
          <>
            <Table
              data={filteredClients}
              columns={columns}
              loading={loading}
              emptyMessage="No hay clientes dados de baja en el período seleccionado"
              onSort={handleSort}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
            />

            {/* Paginación */}
            {pagination.totalPages > 1 && (
              <Card className="p-4 bg-white shadow-sm">
                <div className="flex justify-center items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFilterChange('page', pagination.page - 1)}
                    disabled={pagination.page === 1 || loading}
                  >
                    Anterior
                  </Button>
                  <span className="text-sm text-gray-600 px-4">
                    Página {pagination.page} de {pagination.totalPages}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleFilterChange('page', pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages || loading}
                  >
                    Siguiente
                  </Button>
                </div>
                <div className="text-center mt-2">
                  <span className="text-sm text-gray-600">
                    Mostrando {((pagination.page - 1) * pagination.limit) + 1} - {Math.min(pagination.page * pagination.limit, pagination.total)} de {pagination.total}
                  </span>
                </div>
              </Card>
            )}
          </>
        )}
      </div>
    </Card>
  );
};

