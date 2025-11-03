import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { DealCard } from './DealCard';
import { 
  getPipelineStages, 
  getDeals, 
  updateDealStage,
  PipelineStage,
  Deal 
} from '../api/abm';
import { Plus, RefreshCw } from 'lucide-react';

interface ABMPipelineViewProps {
  userId: string;
}

export const ABMPipelineView: React.FC<ABMPipelineViewProps> = ({ userId }) => {
  const [stages, setStages] = useState<PipelineStage[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [draggedDeal, setDraggedDeal] = useState<Deal | null>(null);
  const [draggedFromStage, setDraggedFromStage] = useState<string | null>(null);

  useEffect(() => {
    loadPipeline();
  }, [userId]);

  const loadPipeline = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPipelineStages();
      setStages(data);
    } catch (err) {
      setError('Error al cargar el pipeline');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDragStart = (deal: Deal, fromStageId: string) => {
    setDraggedDeal(deal);
    setDraggedFromStage(fromStageId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.currentTarget.classList.add('bg-blue-50');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-blue-50');
  };

  const handleDrop = async (targetStageId: string) => {
    if (!draggedDeal || !draggedFromStage) return;

    try {
      // Optimistic update
      const updatedStages = stages.map(stage => {
        if (stage.id === draggedFromStage) {
          return {
            ...stage,
            deals: stage.deals.filter(d => d.id !== draggedDeal.id)
          };
        }
        if (stage.id === targetStageId) {
          return {
            ...stage,
            deals: [...stage.deals, { ...draggedDeal, stageId: targetStageId }]
          };
        }
        return stage;
      });
      setStages(updatedStages);

      // Actualizar en el backend
      await updateDealStage(draggedDeal.id, targetStageId);
    } catch (err) {
      console.error('Error al actualizar la etapa del deal:', err);
      // Revertir cambios
      loadPipeline();
    } finally {
      setDraggedDeal(null);
      setDraggedFromStage(null);
      document.querySelectorAll('.pipeline-column').forEach(col => {
        col.classList.remove('bg-blue-50');
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Cargando pipeline...</div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="text-red-600 mb-4">{error}</div>
        <Button variant="primary" onClick={loadPipeline}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Pipeline de Ventas B2B</h2>
        <Button variant="primary" onClick={() => {/* TODO: Abrir modal de creación */}}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Oportunidad
        </Button>
      </div>

      {/* Pipeline Kanban */}
      <div className="flex gap-4 overflow-x-auto pb-4">
        {stages.map(stage => (
          <div
            key={stage.id}
            className="pipeline-column flex-shrink-0 w-80 bg-gray-50 rounded-lg p-4 min-h-[500px]"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={() => handleDrop(stage.id)}
          >
            {/* Header de la columna */}
            <div className="mb-4">
              <h3 className="font-semibold text-gray-900 mb-1">{stage.name}</h3>
              <div className="text-xs text-gray-500">
                {stage.deals.length} {stage.deals.length === 1 ? 'oportunidad' : 'oportunidades'}
                {stage.deals.length > 0 && (
                  <span className="ml-2 font-medium text-gray-700">
                    {new Intl.NumberFormat('es-ES', {
                      style: 'currency',
                      currency: 'EUR',
                      minimumFractionDigits: 0
                    }).format(stage.deals.reduce((sum, d) => sum + d.value, 0))}
                  </span>
                )}
              </div>
            </div>

            {/* Cards de deals */}
            <div className="space-y-3">
              {stage.deals.map(deal => (
                <div
                  key={deal.id}
                  draggable
                  onDragStart={() => handleDragStart(deal, stage.id)}
                  className="cursor-move"
                >
                  <DealCard 
                    deal={deal}
                    onClick={() => {/* TODO: Abrir detalles del deal */}}
                  />
                </div>
              ))}
              {stage.deals.length === 0 && (
                <div className="text-center py-8 text-gray-400 text-sm">
                  Arrastra oportunidades aquí
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


