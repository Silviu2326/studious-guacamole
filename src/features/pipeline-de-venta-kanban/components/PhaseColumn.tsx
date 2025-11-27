import React from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { PhaseColumn as PhaseColumnType, Sale, PipelinePhase } from '../types';
import { SaleCard } from './SaleCard';
import { Inbox } from 'lucide-react';

interface PhaseColumnProps {
  column: PhaseColumnType;
  onSaleUpdate: (saleId: string, updates: Partial<Sale>) => void;
  onSalePhaseChange: (saleId: string, newPhase: PipelinePhase) => void;
  selectedLeadId?: string | null;
  selectedSaleRef?: React.MutableRefObject<HTMLDivElement | null>;
}

export const PhaseColumn: React.FC<PhaseColumnProps> = ({
  column,
  onSaleUpdate,
  onSalePhaseChange,
  selectedLeadId,
  selectedSaleRef,
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const saleId = e.dataTransfer.getData('saleId');
    if (saleId) {
      // Verificar si la venta ya está en esta fase o no
      const saleInThisColumn = column.sales.find(s => s.id === saleId);
      // Si no está en esta columna, moverla aquí
      if (!saleInThisColumn) {
        onSalePhaseChange(saleId, column.phase.key as PipelinePhase);
      }
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="flex-shrink-0 w-80"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      onDragEnter={handleDragEnter}
    >
      <Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden bg-white shadow-sm">
        {/* Header de la fase */}
        <div className="mb-4 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: column.phase.color || '#3B82F6' }}
              />
              <h3 className="text-lg font-semibold text-gray-900">
                {column.phase.name}
              </h3>
            </div>
            <span
              className="text-sm px-2 py-1 rounded-full text-white font-medium"
              style={{ backgroundColor: column.phase.color || '#3B82F6' }}
            >
              {column.sales.length}
            </span>
          </div>
          
          {/* Métricas de la fase */}
          <div className="flex items-center gap-4 text-sm text-slate-600">
            {column.metrics.value > 0 && (
              <span>{column.metrics.value.toLocaleString('es-ES')}€</span>
            )}
            <span>{Math.round(column.metrics.averageProbability)}% prob.</span>
          </div>
        </div>

        {/* Lista de ventas - US-14: Ordenar por días sin contacto */}
        <div className="space-y-3 max-h-[600px] overflow-y-auto px-4 pb-4">
          {column.sales.length === 0 ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Inbox size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-sm text-gray-600">No hay ventas en esta fase</p>
            </Card>
          ) : (
            // US-14: Ordenar por días sin contacto (mayor primero)
            [...column.sales]
              .sort((a, b) => {
                const getDaysWithoutContact = (sale: typeof a) => {
                  const lastContact = sale.lastContact || sale.lastActivity || sale.updatedAt;
                  if (!lastContact) return 0;
                  const now = new Date();
                  const lastContactDate = new Date(lastContact);
                  const diffTime = now.getTime() - lastContactDate.getTime();
                  return Math.floor(diffTime / (1000 * 60 * 60 * 24));
                };
                return getDaysWithoutContact(b) - getDaysWithoutContact(a);
              })
              .map((sale) => {
                const isSelected = selectedLeadId && sale.leadId === selectedLeadId;
                return (
                  <div
                    key={sale.id}
                    ref={isSelected ? selectedSaleRef : null}
                    className={isSelected ? 'ring-2 ring-blue-500 rounded-lg' : ''}
                  >
                    <SaleCard
                      sale={sale}
                      onUpdate={(updates) => onSaleUpdate(sale.id, updates)}
                      onPhaseChange={(newPhase) => onSalePhaseChange(sale.id, newPhase)}
                      isHighlighted={isSelected}
                    />
                  </div>
                );
              })
          )}
        </div>
      </Card>
    </div>
  );
};

