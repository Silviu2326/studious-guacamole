import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { PlaybookCard } from './PlaybookCard';
import { PlaybookDetailModal } from './PlaybookDetailModal';
import { getPlaybookTemplates, getPlaybookStats, PlaybookSummary } from '../api/playbooks';
import { Filter, Target, TrendingUp, AlertCircle } from 'lucide-react';

export const PlaybookLibraryContainer: React.FC = () => {
  const [playbooks, setPlaybooks] = useState<PlaybookSummary[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [filters, setFilters] = useState({
    objective: 'all',
    tags: [] as string[]
  });
  
  const [selectedPlaybookId, setSelectedPlaybookId] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [filters]);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [playbooksData, statsData] = await Promise.all([
        getPlaybookTemplates(1, 20, {
          objective: filters.objective !== 'all' ? filters.objective : undefined
        }),
        getPlaybookStats()
      ]);

      setPlaybooks(playbooksData.data);
      setStats(statsData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los playbooks');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreview = (id: string) => {
    setSelectedPlaybookId(id);
  };

  const handleActivate = (id: string) => {
    setSelectedPlaybookId(id);
  };

  const handleActivated = (campaignId: string) => {
    setSelectedPlaybookId(null);
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Playbooks</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalPlaybooks}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-green-100 rounded-lg">
                <TrendingUp className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Activaciones</h3>
            <p className="text-3xl font-bold text-gray-900">{stats.totalActivations.toLocaleString()}</p>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Tasa Conversión</h3>
            <p className="text-3xl font-bold text-gray-900">{(stats.avgConversionRate * 100).toFixed(0)}%</p>
          </Card>
        </div>
      )}

      {/* Filters */}
      <div className="flex items-center gap-4">
        <Filter className="w-4 h-4 text-gray-500" />
        <select
          value={filters.objective}
          onChange={(e) => setFilters(prev => ({ ...prev, objective: e.target.value }))}
          className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
        >
          <option value="all">Todos los objetivos</option>
          <option value="lead_generation">Captación</option>
          <option value="retention">Retención</option>
          <option value="monetization">Monetización</option>
        </select>
      </div>

      {/* Playbooks Grid */}
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
              <div className="h-40 bg-gray-200"></div>
              <div className="p-6 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : playbooks.length === 0 ? (
        <Card className="p-12 text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Target className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay playbooks disponibles
            </h3>
            <p className="text-gray-600">
              Ajusta los filtros para ver más resultados
            </p>
          </div>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {playbooks.map((playbook) => (
            <PlaybookCard
              key={playbook.id}
              playbook={playbook}
              onPreview={handlePreview}
              onActivate={handleActivate}
            />
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <PlaybookDetailModal
        playbookId={selectedPlaybookId}
        onClose={() => setSelectedPlaybookId(null)}
        onActivated={handleActivated}
      />
    </div>
  );
};

