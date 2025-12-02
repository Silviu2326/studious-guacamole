// US-15: Modal de alertas de seguimiento

import React, { useState } from 'react';
import { Modal, Button } from '../../../components/componentsreutilizables';
import { FollowUpAlert } from '../services/followUpService';
import { AlertCircle, X, Clock, Send, Calendar } from 'lucide-react';

interface FollowUpAlertModalProps {
  alerts: FollowUpAlert[];
  isOpen: boolean;
  onClose: () => void;
  onMarkAsContacted: (saleId: string) => void;
  onPostpone: (saleId: string, days: number) => void;
  onDiscard: (saleId: string) => void;
  onScheduleCall?: (saleId: string) => void;
}

export const FollowUpAlertModal: React.FC<FollowUpAlertModalProps> = ({
  alerts,
  isOpen,
  onClose,
  onMarkAsContacted,
  onPostpone,
  onDiscard,
  onScheduleCall,
}) => {
  const [selectedAlert, setSelectedAlert] = useState<FollowUpAlert | null>(
    alerts.length > 0 ? alerts[0] : null
  );
  const [postponeDays, setPostponeDays] = useState(3);

  if (!isOpen || alerts.length === 0) return null;

  const handlePostpone = () => {
    if (selectedAlert) {
      onPostpone(selectedAlert.saleId, postponeDays);
      setSelectedAlert(null);
    }
  };

  const handleDiscard = () => {
    if (selectedAlert && window.confirm('¿Estás seguro de que quieres descartar este lead?')) {
      onDiscard(selectedAlert.saleId);
      setSelectedAlert(null);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Leads que requieren seguimiento (${alerts.length})`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Lista de alertas */}
        <div className="border border-gray-200 rounded-lg divide-y divide-gray-200 max-h-96 overflow-y-auto">
          {alerts.map((alert) => {
            const isSelected = selectedAlert?.saleId === alert.saleId;
            return (
              <div
                key={alert.saleId}
                onClick={() => setSelectedAlert(alert)}
                className={`p-4 cursor-pointer transition-colors ${
                  isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : 'hover:bg-gray-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <AlertCircle className={`w-5 h-5 ${isSelected ? 'text-blue-600' : 'text-red-500'}`} />
                      <h4 className="font-semibold text-gray-900">{alert.leadName}</h4>
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs font-medium rounded-full">
                        {alert.daysWithoutContact} días
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">Fase: {alert.phase}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Detalle de alerta seleccionada */}
        {selectedAlert && (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-100 rounded-full">
                <Clock className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">{selectedAlert.leadName}</h3>
                <p className="text-sm text-gray-600">
                  Sin contacto por <span className="font-semibold text-red-600">{selectedAlert.daysWithoutContact} días</span>
                </p>
              </div>
            </div>

            {/* Mensaje sugerido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje de seguimiento sugerido:
              </label>
              <div className="bg-white border border-gray-300 rounded-lg p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {selectedAlert.suggestedMessage}
                </p>
              </div>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(selectedAlert.suggestedMessage);
                  alert('Mensaje copiado al portapapeles');
                }}
                className="mt-2 inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <Send className="w-4 h-4" />
                Copiar mensaje
              </button>
            </div>

            {/* Acciones */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="primary"
                onClick={() => onMarkAsContacted(selectedAlert.saleId)}
                fullWidth
              >
                Marcar como contactado
              </Button>
              {onScheduleCall && (
                <Button
                  variant="secondary"
                  onClick={() => {
                    onScheduleCall(selectedAlert.saleId);
                    onClose();
                  }}
                  fullWidth
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Agendar llamada
                </Button>
              )}
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Posponer (días)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min="1"
                    max="30"
                    value={postponeDays}
                    onChange={(e) => setPostponeDays(parseInt(e.target.value) || 3)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                  <Button
                    variant="ghost"
                    onClick={handlePostpone}
                  >
                    Posponer
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                onClick={handleDiscard}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Descartar lead
              </Button>
            </div>
          </div>
        )}

        {/* Botón cerrar */}
        <div className="flex justify-end">
          <Button variant="ghost" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      </div>
    </Modal>
  );
};

