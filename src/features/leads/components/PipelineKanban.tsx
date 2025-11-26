import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { PipelineColumn, Lead, PipelineStage } from '../types';
import { getPipeline, updateLeadStage } from '../api';
import { LeadCard } from './LeadCard';
import { TrendingUp } from 'lucide-react';

interface PipelineKanbanProps {
  businessType: 'entrenador' | 'gimnasio';
  userId?: string;
  onLeadUpdate?: (id: string, updates: Partial<Lead>) => void;
}

export const PipelineKanban: React.FC<PipelineKanbanProps> = ({
  businessType,
  userId,
  onLeadUpdate,
}) => {
  const [columns, setColumns] = useState<PipelineColumn[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPipeline();
  }, [businessType, userId]);

  const loadPipeline = async () => {
    setLoading(true);
    try {
      const data = await getPipeline(businessType, userId);
      setColumns(data);
    } catch (error) {
      console.error('Error cargando pipeline:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDragEnd = async (leadId: string, newStage: PipelineStage) => {
    try {
      await updateLeadStage(leadId, newStage);
      await loadPipeline();
      if (onLeadUpdate) {
        const lead = columns
          .flatMap(col => col.leads)
          .find(l => l.id === leadId);
        if (lead) {
          onLeadUpdate(leadId, { stage: newStage });
        }
      }
    } catch (error) {
      console.error('Error actualizando etapa:', error);
    }
  };

  const stageLabels: Record<PipelineStage, string> = {
    captacion: 'Captación',
    interes: 'Interés',
    calificacion: 'Calificación',
    oportunidad: 'Oportunidad',
    cierre: 'Cierre',
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className={`animate-spin ${ds.radius.full} h-8 w-8 border-b-2 ${ds.color.primaryBg}`}></div>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {columns.map((column) => (
          <div
            key={column.stage}
            className="flex-shrink-0 w-80"
          >
            <Card variant="hover" padding="md">
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-[#F1F5F9]">
                    {stageLabels[column.stage]}
                  </h3>
                  <span className={`${ds.typography.bodySmall} ${ds.badge.base} ${ds.badge.primary}`}>
                    {column.leads.length}
                  </span>
                </div>
              </div>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {column.leads.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-[#64748B]">
                    <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No hay leads en esta etapa</p>
                  </div>
                ) : (
                  column.leads.map((lead) => (
                    <LeadCard
                      key={lead.id}
                      lead={lead}
                      onUpdate={(updates) => {
                        if (onLeadUpdate) {
                          onLeadUpdate(lead.id, updates);
                        }
                        loadPipeline();
                      }}
                      onStageChange={(newStage) => handleDragEnd(lead.id, newStage)}
                    />
                  ))
                )}
              </div>
            </Card>
          </div>
        ))}
      </div>
    </div>
  );
};

