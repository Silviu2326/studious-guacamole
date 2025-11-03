import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
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
  Filter
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

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <FileText className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Total Lead Magnets
            </h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalLeadMagnets}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Eye className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Total Visualizaciones
            </h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalViews.toLocaleString()}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Leads Generados
            </h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalLeads.toLocaleString()}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 bg-orange-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">
              Tasa Conversión
            </h3>
            <p className="text-3xl font-bold text-gray-900">{(stats.avgConversionRate * 100).toFixed(1)}%</p>
          </Card>
        </div>
      )}

      {/* Actions Bar */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Tus Lead Magnets</h2>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
            <Plus className="w-4 h-4" />
            Crear Lead Magnet
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Filter className="w-4 h-4 text-gray-500" />
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">Todos</option>
          <option value="DRAFT">Borradores</option>
          <option value="PUBLISHED">Publicados</option>
          <option value="ARCHIVED">Archivados</option>
        </select>
      </div>

      {/* Lead Magnets Grid */}
      {error ? (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-medium">{error}</p>
          </div>
        </div>
      ) : isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
              <div className="h-32 bg-gray-200"></div>
              <div className="p-5 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          ))}
        </div>
      ) : leadMagnets.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay lead magnets aún
            </h3>
            <p className="text-gray-600 mb-6">
              Crea tu primer lead magnet para empezar a captar clientes potenciales
            </p>
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition">
              Crear Lead Magnet
            </button>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

