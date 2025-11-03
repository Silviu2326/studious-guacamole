import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { 
  getExperiments, 
  Experiment, 
  ExperimentStatus,
  ExperimentFilters 
} from '../api/experiments';
import { ExperimentResultCard } from './ExperimentResultCard';
import { Filter, Plus } from 'lucide-react';

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

  const filters: { label: string; value: ExperimentStatus | 'all' }[] = [
    { label: 'Todos', value: 'all' },
    { label: 'Activos', value: 'ACTIVE' },
    { label: 'Pausados', value: 'PAUSED' },
    { label: 'Finalizados', value: 'FINISHED' },
    { label: 'Borradores', value: 'DRAFT' }
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Cargando experimentos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-600">{error}</div>
        <Button 
          variant="primary" 
          onClick={loadExperiments}
          className="mt-4"
        >
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex gap-2">
            {filters.map(filter => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === filter.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        <Button variant="primary" onClick={() => {/* TODO: Abrir modal de creación */}}>
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Experimento
        </Button>
      </div>

      {/* Lista de experimentos */}
      {experiments.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500 mb-4">
            No hay experimentos {activeFilter !== 'all' ? `con estado "${filters.find(f => f.value === activeFilter)?.label}"` : ''}
          </div>
          <Button variant="primary" onClick={() => {/* TODO: Abrir modal de creación */}}>
            <Plus className="w-4 h-4 mr-2" />
            Crear Primer Experimento
          </Button>
        </Card>
      ) : (
        <div className="grid gap-4">
          {experiments.map(experiment => (
            <ExperimentResultCard key={experiment.id} experiment={experiment} />
          ))}
        </div>
      )}
    </div>
  );
};


