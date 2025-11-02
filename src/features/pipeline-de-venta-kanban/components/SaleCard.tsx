import React, { useState } from 'react';
import { Card, Modal, Badge } from '../../../components/componentsreutilizables';
import { Sale, PipelinePhase } from '../types';
import { 
  Mail, 
  Phone, 
  TrendingUp,
  Calendar,
  DollarSign
} from 'lucide-react';

interface SaleCardProps {
  sale: Sale;
  onUpdate: (updates: Partial<Sale>) => void;
  onPhaseChange?: (newPhase: PipelinePhase) => void;
}

export const SaleCard: React.FC<SaleCardProps> = ({ sale, onUpdate, onPhaseChange }) => {
  const [showDetails, setShowDetails] = useState(false);

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-green-600';
    if (probability >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('saleId', sale.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  return (
    <>
      <div
        draggable
        onDragStart={handleDragStart}
        className="cursor-move"
      >
      <Card
        variant="hover"
        className="h-full flex flex-col transition-shadow overflow-hidden cursor-pointer"
        onClick={() => setShowDetails(true)}
      >
        <div className="p-4 space-y-3">
          {/* Header */}
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="text-base font-semibold text-gray-900 mb-1 truncate">
                {sale.leadName}
              </h4>
              {sale.value && (
                <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
                  <DollarSign className="w-3 h-3" />
                  <span>{sale.value.toLocaleString('es-ES')}€</span>
                </div>
              )}
            </div>
          </div>

          {/* Probabilidad */}
          <div className="flex items-center justify-between">
            <div className={`text-sm flex items-center gap-1 font-semibold ${getProbabilityColor(sale.probability)}`}>
              <TrendingUp className="w-3 h-3" />
              <span>{sale.probability}%</span>
            </div>
            {sale.tags.length > 0 && (
              <div className="flex gap-1 flex-wrap">
                {sale.tags.slice(0, 2).map((tag, idx) => (
                  <Badge key={idx} variant="secondary" size="sm">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Contact info */}
          <div className="space-y-1">
            {sale.leadEmail && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Mail className="w-3 h-3" />
                <span className="truncate">{sale.leadEmail}</span>
              </div>
            )}
            {sale.leadPhone && (
              <div className="flex items-center gap-2 text-xs text-slate-600">
                <Phone className="w-3 h-3" />
                <span>{sale.leadPhone}</span>
              </div>
            )}
          </div>

          {/* Última actividad */}
          {sale.lastActivity && (
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Calendar className="w-3 h-3" />
              <span>
                {new Date(sale.lastActivity).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short'
                })}
              </span>
            </div>
          )}
        </div>
      </Card>
      </div>

      {/* Modal de detalles */}
      <Modal
        isOpen={showDetails}
        onClose={() => setShowDetails(false)}
        title={`Venta: ${sale.leadName}`}
        size="lg"
      >
        <div className="space-y-6">
          {/* Información básica */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Información del Lead
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nombre
                </label>
                <p className="text-base text-gray-900">{sale.leadName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Email
                </label>
                <p className="text-base text-gray-900">{sale.leadEmail || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Teléfono
                </label>
                <p className="text-base text-gray-900">{sale.leadPhone || 'N/A'}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Valor
                </label>
                <p className="text-base font-semibold text-gray-900">
                  {sale.value ? `${sale.value.toLocaleString('es-ES')}€` : 'N/A'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Probabilidad
                </label>
                <p className={`text-base font-semibold ${getProbabilityColor(sale.probability)}`}>
                  {sale.probability}%
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Fase
                </label>
                <p className="text-base text-gray-900">{sale.phase}</p>
              </div>
            </div>
          </div>

          {/* Notas */}
          {sale.notes.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Notas
              </h3>
              <div className="space-y-2">
                {sale.notes.map((note, index) => (
                  <p
                    key={index}
                    className="text-base text-gray-600 p-3 bg-gray-50 rounded-lg"
                  >
                    {note}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          {sale.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Etiquetas
              </h3>
              <div className="flex flex-wrap gap-2">
                {sale.tags.map((tag, index) => (
                  <Badge key={index} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </Modal>
    </>
  );
};

