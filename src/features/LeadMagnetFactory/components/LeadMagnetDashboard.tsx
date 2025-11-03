import React, { useState, useEffect } from 'react';
import { Card, Button, MetricCards, type MetricCardData } from '../../../components/componentsreutilizables';
import { LeadMagnetCard } from './LeadMagnetCard';
import {
  getLeadMagnets,
  getGlobalStats,
  deleteLeadMagnet,
  LeadMagnet
} from '../api/leadMagnets';
import {
  Plus,
  FileText,
  BarChart3,
  Eye,
  Users,
  TrendingUp,
  AlertCircle,
  Filter,
  Loader2,
  Package
} from 'lucide-react';

interface LeadMagnetDashboardProps {
  trainerId: string;
}

export const LeadMagnetDashboard: React.FC<LeadMagnetDashboardProps> = ({ trainerId }) => {
  const [leadMagnets, setLeadMagnets] = useState<LeadMagnet[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    loadData();
  }, [selectedStatus]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [magnetsData, statsData] = await Promise.all([
        getLeadMagnets(selectedStatus === 'all' ? undefined : selectedStatus),
        getGlobalStats()
      ]);

      setLeadMagnets(magnetsData);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('¿Estás seguro de que quieres eliminar este lead magnet?')) {
      return;
    }

    try {
      await deleteLeadMagnet(id);
      setLeadMagnets(prev => prev.filter(m => m.id !== id));
    } catch (err: any) {
      alert('Error al eliminar: ' + err.message);
    }
  };

  const handleEdit = (id: string) => {
    // TODO: Implementar edición
    alert('Funcionalidad de edición en desarrollo');
  };

  const handleViewStats = (id: string) => {
    // TODO: Implementar vista de estadísticas
    alert('Funcionalidad de estadísticas en desarrollo');
  };

  const metricCardsData: MetricCardData[] = stats ? [
    {
      id: 'total-lead-magnets',
      title: 'Total Lead Magnets',
      value: stats.totalLeadMagnets.toString(),
      icon: <FileText className="w-5 h-5" />,
      color: 'info'
    },
    {
      id: 'total-views',
      title: 'Total Visualizaciones',
      value: stats.totalViews.toLocaleString(),
      icon: <Eye className="w-5 h-5" />,
      color: 'info'
    },
    {
      id: 'total-leads',
      title: 'Leads Generados',
      value: stats.totalLeads.toLocaleString(),
      icon: <Users className="w-5 h-5" />,
      color: 'success'
    },
    {
      id: 'avg-conversion',
      title: 'Tasa Conversión',
      value: `${(stats.avgConversionRate * 100).toFixed(1)}%`,
      icon: <TrendingUp className="w-5 h-5" />,
      color: 'warning'
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button 
          onClick={() => {/* TODO: Implementar creación */}}
          leftIcon={<Plus size={20} />}
        >
          Crear Lead Magnet
        </Button>
      </div>

      {/* Métricas */}
      {stats && (
        <MetricCards 
          data={metricCardsData} 
          columns={4} 
        />
      )}

      {/* Sistema de Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  placeholder="Buscar lead magnets..."
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5 text-sm"
                />
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </div>
              <div className="flex items-center gap-2">
                <label className="block text-sm font-medium text-slate-700">
                  Estado:
                </label>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value)}
                  className="rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-3 py-2.5 text-sm"
                >
                  <option value="all">Todos</option>
                  <option value="DRAFT">Borradores</option>
                  <option value="PUBLISHED">Publicados</option>
                  <option value="ARCHIVED">Archivados</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{leadMagnets.length} resultados encontrados</span>
            <span>{selectedStatus !== 'all' ? '1 filtro aplicado' : 'Sin filtros'}</span>
          </div>
        </div>
      </Card>

      {/* Lead Magnets Grid */}
      {error ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadData}>Reintentar</Button>
        </Card>
      ) : isLoading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando...</p>
        </Card>
      ) : leadMagnets.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay lead magnets aún
          </h3>
          <p className="text-gray-600 mb-4">
            Crea tu primer lead magnet para empezar a captar clientes potenciales
          </p>
          <Button onClick={() => {/* TODO: Implementar creación */}}>
            Crear Lead Magnet
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {leadMagnets.map((magnet) => (
            <LeadMagnetCard
              key={magnet.id}
              magnet={magnet}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onViewStats={handleViewStats}
            />
          ))}
        </div>
      )}
    </div>
  );
};

