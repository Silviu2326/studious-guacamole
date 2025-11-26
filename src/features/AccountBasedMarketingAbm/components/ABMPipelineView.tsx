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
import { Plus, RefreshCw, Loader2, AlertCircle } from 'lucide-react';

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
    e.currentTarget.classList.add('bg-blue-50', 'ring-2', 'ring-blue-300');
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.currentTarget.classList.remove('bg-blue-50', 'ring-2', 'ring-blue-300');
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
        <Button onClick={loadPipeline}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="flex items-center justify-end">
        <Button onClick={() => {/* TODO: Abrir modal de creación */}}>
          <Plus size={20} className="mr-2" />
          Nueva Oportunidad
        </Button>
      </div>

      {/* Pipeline Kanban */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex gap-4 overflow-x-auto pb-4">
          {stages.map(stage => (
            <div
              key={stage.id}
              className="pipeline-column flex-shrink-0 w-80 bg-slate-50 rounded-xl p-4 min-h-[500px] ring-1 ring-slate-200"
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={() => handleDrop(stage.id)}
            >
              {/* Header de la columna */}
              <div className="mb-4">
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{stage.name}</h3>
                <div className="text-xs text-gray-600">
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
              <div className="space-y-4">
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
                  <div className="text-center py-8 text-slate-400 text-sm">
                    Arrastra oportunidades aquí
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};


