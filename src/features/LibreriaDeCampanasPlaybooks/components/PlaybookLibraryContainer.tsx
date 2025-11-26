import React, { useState, useEffect } from 'react';
import { Card, MetricCards, Select, Button, type MetricCardData } from '../../../components/componentsreutilizables';
import { PlaybookCard } from './PlaybookCard';
import { PlaybookDetailModal } from './PlaybookDetailModal';
import { getPlaybookTemplates, getPlaybookStats, PlaybookSummary } from '../api/playbooks';
import { Filter, Target, TrendingUp, AlertCircle, Package, Loader2, Search } from 'lucide-react';

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

  // Preparar datos para MetricCards
  const metricCardsData: MetricCardData[] = stats ? [
    {
      id: 'total-playbooks',
      title: 'Total Playbooks',
      value: stats.totalPlaybooks,
      color: 'info',
      icon: <Target size={20} />
    },
    {
      id: 'activations',
      title: 'Activaciones',
      value: stats.totalActivations.toLocaleString(),
      color: 'success',
      icon: <TrendingUp size={20} />
    },
    {
      id: 'conversion-rate',
      title: 'Tasa Conversión',
      value: `${(stats.avgConversionRate * 100).toFixed(0)}%`,
      color: 'info',
      icon: <Target size={20} />
    }
  ] : [];

  return (
    <div className="space-y-6">
      {/* Stats */}
      {stats && <MetricCards data={metricCardsData} columns={3} />}

      {/* Filters */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar playbooks..."
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
              <div className="w-64">
                <Select
                  value={filters.objective}
                  onChange={(e) => setFilters(prev => ({ ...prev, objective: e.target.value }))}
                  options={[
                    { value: 'all', label: 'Todos los objetivos' },
                    { value: 'lead_generation', label: 'Captación' },
                    { value: 'retention', label: 'Retención' },
                    { value: 'monetization', label: 'Monetización' }
                  ]}
                  fullWidth={false}
                />
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Playbooks Grid */}
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
      ) : playbooks.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay playbooks disponibles
          </h3>
          <p className="text-gray-600 mb-4">
            Ajusta los filtros para ver más resultados
          </p>
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

