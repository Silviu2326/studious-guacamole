import React, { useState, useEffect } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { PhaseColumn as PhaseColumnType, Sale, PipelinePhase, BusinessType } from '../types';
import { getPipeline, moveSale, updateSale } from '../api';
import { PhaseColumn } from './PhaseColumn';
import { Loader2 } from 'lucide-react';

interface PipelineKanbanProps {
  businessType: BusinessType;
  userId?: string;
  onSaleUpdate?: (saleId: string, updates: Partial<Sale>) => void;
}

export const PipelineKanban: React.FC<PipelineKanbanProps> = ({
  businessType,
  userId,
  onSaleUpdate,
}) => {
  const [columns, setColumns] = useState<PhaseColumnType[]>([]);
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

  const handleSalePhaseChange = async (saleId: string, newPhase: PipelinePhase) => {
    try {
      await moveSale(saleId, newPhase);
      await loadPipeline();
      if (onSaleUpdate) {
        const sale = columns
          .flatMap(col => col.sales)
          .find(s => s.id === saleId);
        if (sale) {
          onSaleUpdate(saleId, { phase: newPhase });
        }
      }
    } catch (error) {
      console.error('Error actualizando fase:', error);
    }
  };

  const handleSaleUpdate = async (saleId: string, updates: Partial<Sale>) => {
    try {
      await updateSale(saleId, updates);
      await loadPipeline();
      if (onSaleUpdate) {
        onSaleUpdate(saleId, updates);
      }
    } catch (error) {
      console.error('Error actualizando venta:', error);
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

  return (
    <div className="overflow-x-auto pb-4">
      <div className="flex gap-4 min-w-max">
        {columns.map((column) => (
          <PhaseColumn
            key={column.phase.id}
            column={column}
            onSaleUpdate={handleSaleUpdate}
            onSalePhaseChange={handleSalePhaseChange}
          />
        ))}
      </div>
    </div>
  );
};

