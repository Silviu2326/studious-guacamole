import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { 
  getExperiments, 
  Experiment, 
  ExperimentStatus,
  ExperimentFilters 
} from '../api/experiments';
import { ExperimentResultCard } from './ExperimentResultCard';
import { Filter, Plus, Loader2, AlertCircle, Package } from 'lucide-react';

interface ExperimentDashboardProps {
  trainerId: string;
}

export const ExperimentDashboard: React.FC<ExperimentDashboardProps> = ({ trainerId }) => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<ExperimentStatus | 'all'>('all');

  useEffect(() => {
    loadExperiments();
  }, [trainerId, activeFilter]);

  const loadExperiments = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters: ExperimentFilters = activeFilter !== 'all' 
        ? { status: [activeFilter as ExperimentStatus] }
        : {};
      const data = await getExperiments(filters);
      setExperiments(data);
    } catch (err) {
      setError('Error al cargar los experimentos');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filters: { label: string; value: ExperimentStatus | 'all'; icon?: React.ReactNode }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Activos', value: 'ACTIVE' },
    { label: 'Pausados', value: 'PAUSED' },
    { label: 'Finalizados', value: 'FINISHED' },
    { label: 'Borradores', value: 'DRAFT' }
  ];

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button 
          variant="primary" 
          onClick={loadExperiments}
        >
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sistema de Tabs */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div
            role="tablist"
            aria-label="Filtros de experimentos"
            className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
          >
            {filters.map(filter => {
              const isActive = activeFilter === filter.value;
              return (
                <button
                  key={filter.value}
                  role="tab"
                  aria-selected={isActive}
                  onClick={() => setActiveFilter(filter.value)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  {filter.icon && (
                    <span className={isActive ? 'opacity-100' : 'opacity-70'}>
                      {filter.icon}
                    </span>
                  )}
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Lista de experimentos */}
      <div className="mt-6">
        {experiments.length === 0 ? (
          <Card className="p-8 text-center bg-white shadow-sm">
            <Package size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No hay experimentos
            </h3>
            <p className="text-gray-600 mb-4">
              {activeFilter !== 'all' 
                ? `No se encontraron experimentos con estado "${filters.find(f => f.value === activeFilter)?.label}"`
                : 'Aún no has creado ningún experimento. Crea tu primer experimento A/B para empezar a optimizar tus estrategias de marketing.'
              }
            </p>
            <Button variant="primary" onClick={() => {/* TODO: Abrir modal de creación */}}>
              <Plus size={20} className="mr-2" />
              Crear Primer Experimento
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {experiments.map(experiment => (
              <ExperimentResultCard key={experiment.id} experiment={experiment} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};


