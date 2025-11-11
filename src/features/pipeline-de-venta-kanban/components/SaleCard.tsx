import React, { useState } from 'react';
import { Card, Modal, Badge, Button } from '../../../components/componentsreutilizables';
import { Sale, PipelinePhase, SERVICE_LABELS, SERVICE_COLORS } from '../types';
import { ServiceTypeSelector } from './ServiceTypeSelector';
import { ScheduleCallModal } from './ScheduleCallModal';
import { SendPriceModal } from './SendPriceModal';
import { PriceCalculatorModal } from './PriceCalculatorModal';
import { FollowUpService } from '../services/followUpService';
import { 
  Mail, 
  Phone, 
  TrendingUp,
  Calendar,
  DollarSign,
  Package,
  ArrowRight,
  Clock,
  AlertCircle,
  Send,
  Calculator,
  CheckCircle
} from 'lucide-react';

interface SaleCardProps {
  sale: Sale;
  onUpdate: (updates: Partial<Sale>) => void;
  onPhaseChange?: (newPhase: PipelinePhase) => void;
}

export const SaleCard: React.FC<SaleCardProps> = ({ sale, onUpdate, onPhaseChange }) => {
  const [showDetails, setShowDetails] = useState(false);
  const [showScheduleCall, setShowScheduleCall] = useState(false);
  const [showSendPrice, setShowSendPrice] = useState(false);
  const [showPriceCalculator, setShowPriceCalculator] = useState(false);

  // US-14: Calcular días sin contacto
  const daysWithoutContact = FollowUpService.getDaysWithoutContact(sale);
  const contactColor = FollowUpService.getFollowUpColor(daysWithoutContact);

  const getProbabilityColor = (probability: number) => {
    if (probability >= 70) return 'text-green-600';
    if (probability >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('saleId', sale.id);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleScheduleCall = (scheduledCall: Omit<Sale['scheduledCall'], 'id' | 'createdAt'>) => {
    onUpdate({
      scheduledCall: {
        ...scheduledCall,
        id: `call-${Date.now()}`,
        createdAt: new Date(),
      } as Sale['scheduledCall'],
    });
    setShowScheduleCall(false);
  };

  const handleMarkAsContacted = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({
      lastContact: new Date(),
      lastActivity: new Date(),
    });
  };

  // US-17: Enviar precios
  const handleSendPrice = (message: string, sentAt: Date) => {
    onUpdate({
      priceSentAt: sentAt,
      priceSentMessage: message,
      lastContact: sentAt,
      lastActivity: sentAt,
      phase: sale.phase === 'contacto_nuevo' || sale.phase === 'primera_charla' 
        ? 'enviado_precio' as PipelinePhase 
        : sale.phase,
    });
  };

  // US-18: Enviar precio calculado
  const handleSendCalculatedPrice = (price: number, message: string) => {
    onUpdate({
      value: price,
      priceSentAt: new Date(),
      priceSentMessage: message,
      lastContact: new Date(),
      lastActivity: new Date(),
      phase: sale.phase === 'contacto_nuevo' || sale.phase === 'primera_charla' 
        ? 'enviado_precio' as PipelinePhase 
        : sale.phase,
    });
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
              <div className="flex items-center gap-2 flex-wrap">
                {sale.value && (
                  <div className="flex items-center gap-1 text-sm font-medium text-slate-700">
                    <DollarSign className="w-3 h-3" />
                    <span>{sale.value.toLocaleString('es-ES')}€</span>
                  </div>
                )}
                {/* US-13: Badge de servicio */}
                {sale.serviceType && (
                  <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium border ${
                    SERVICE_COLORS[sale.serviceType].bg
                  } ${SERVICE_COLORS[sale.serviceType].text} ${SERVICE_COLORS[sale.serviceType].border}`}>
                    <Package className="w-3 h-3" />
                    {SERVICE_LABELS[sale.serviceType]}
                  </div>
                )}
              </div>
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

          {/* US-14: Días sin contacto */}
          <div className={`flex items-center gap-2 px-2 py-1 rounded-md text-xs font-medium border ${contactColor.bg} ${contactColor.text} ${contactColor.border}`}>
            <Clock className="w-3 h-3" />
            <span>
              {daysWithoutContact === 0 
                ? 'Contactado hoy' 
                : daysWithoutContact === 1 
                ? 'Hace 1 día' 
                : `Hace ${daysWithoutContact} días`}
            </span>
            {daysWithoutContact >= 3 && (
              <AlertCircle className="w-3 h-3 ml-1" />
            )}
          </div>

          {/* US-16: Llamada agendada */}
          {sale.scheduledCall && !sale.scheduledCall.completed && (
            <div className="flex items-center gap-2 px-2 py-1 bg-purple-50 border border-purple-200 rounded-md text-xs text-purple-700">
              <Calendar className="w-3 h-3" />
              <span>
                Llamada: {new Date(sale.scheduledCall.scheduledDate).toLocaleDateString('es-ES', {
                  day: '2-digit',
                  month: 'short',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          )}

          {/* US-17: Precios enviados */}
          {sale.priceSentAt && (
            <div className="flex items-center gap-2 px-2 py-1 bg-green-50 border border-green-200 rounded-md text-xs text-green-700">
              <CheckCircle className="w-3 h-3" />
              <span>Precios enviados {new Date(sale.priceSentAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short' })}</span>
            </div>
          )}

          {/* US-16, US-17, US-18: Botones de acción */}
          {sale.phase !== 'descartado' && sale.phase !== 'cliente' && (
            <div className="flex gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowSendPrice(true);
                }}
                className="flex-1 flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-blue-600 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors"
              >
                <Send className="w-3 h-3" />
                Enviar precios
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowPriceCalculator(true);
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-purple-600 bg-purple-50 border border-purple-200 rounded-lg hover:bg-purple-100 transition-colors"
                title="Calculadora de precios"
              >
                <Calculator className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowScheduleCall(true);
                }}
                className="flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium text-indigo-600 bg-indigo-50 border border-indigo-200 rounded-lg hover:bg-indigo-100 transition-colors"
                title="Agendar llamada"
              >
                <Calendar className="w-3 h-3" />
              </button>
            </div>
          )}
        </div>
      </Card>
      </div>

      {/* US-16: Modal de agendar llamada */}
      <ScheduleCallModal
        sale={sale}
        isOpen={showScheduleCall}
        onClose={() => setShowScheduleCall(false)}
        onSchedule={handleScheduleCall}
      />

      {/* US-17: Modal de enviar precios */}
      <SendPriceModal
        sale={sale}
        isOpen={showSendPrice}
        onClose={() => setShowSendPrice(false)}
        onSend={handleSendPrice}
      />

      {/* US-18: Modal de calculadora de precios */}
      <PriceCalculatorModal
        sale={sale}
        isOpen={showPriceCalculator}
        onClose={() => setShowPriceCalculator(false)}
        onSendPrice={handleSendCalculatedPrice}
      />

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

          {/* US-13: Tipo de servicio */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Tipo de Servicio
            </h3>
            <ServiceTypeSelector
              value={sale.serviceType}
              onChange={(serviceType) => onUpdate({ serviceType })}
            />
            {sale.serviceType && (
              <p className="text-sm text-gray-600 mt-2">
                El lead está interesado en: {SERVICE_LABELS[sale.serviceType]}
              </p>
            )}
          </div>

          {/* US-14: Días sin contacto - Detalle */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Clock className="w-5 h-5" />
              Seguimiento
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium text-gray-700">Días sin contacto</p>
                  <p className="text-xs text-gray-500 mt-1">
                    Último contacto: {sale.lastContact 
                      ? new Date(sale.lastContact).toLocaleDateString('es-ES')
                      : sale.lastActivity 
                      ? new Date(sale.lastActivity).toLocaleDateString('es-ES')
                      : 'Nunca'}
                  </p>
                </div>
                <div className={`px-3 py-1 rounded-full text-sm font-medium ${contactColor.bg} ${contactColor.text}`}>
                  {daysWithoutContact} días
                </div>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleMarkAsContacted}
                fullWidth
              >
                Marcar como contactado hoy
              </Button>
            </div>
          </div>

          {/* US-16: Llamada agendada - Detalle */}
          {sale.scheduledCall && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Llamada Agendada
              </h3>
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-sm font-medium text-purple-900">
                  {new Date(sale.scheduledCall.scheduledDate).toLocaleString('es-ES', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </p>
                {sale.scheduledCall.notes && (
                  <p className="text-sm text-purple-700 mt-2">{sale.scheduledCall.notes}</p>
                )}
                <div className="flex gap-2 mt-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onUpdate({
                        scheduledCall: {
                          ...sale.scheduledCall!,
                          completed: true,
                        },
                        lastContact: new Date(),
                        lastActivity: new Date(),
                      });
                    }}
                  >
                    Marcar como completada
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      onUpdate({ scheduledCall: undefined });
                    }}
                    className="text-red-600 hover:text-red-700"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* US-17: Historial de precios enviados */}
          {sale.priceSentAt && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Send className="w-5 h-5" />
                Precios Enviados
              </h3>
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm font-medium text-green-900">
                  Enviado el {new Date(sale.priceSentAt).toLocaleString('es-ES')}
                </p>
                {sale.priceSentMessage && (
                  <div className="mt-3 p-3 bg-white rounded-lg border border-green-100">
                    <p className="text-xs text-gray-700 whitespace-pre-wrap">
                      {sale.priceSentMessage.substring(0, 200)}
                      {sale.priceSentMessage.length > 200 && '...'}
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* US-12: Historial de movimientos */}
          {sale.phaseHistory && sale.phaseHistory.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <ArrowRight className="w-5 h-5" />
                Historial de Movimientos
              </h3>
              <div className="space-y-2">
                {sale.phaseHistory.map((entry) => (
                  <div
                    key={entry.id}
                    className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg text-sm"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {entry.fromPhase ? `${entry.fromPhase} → ${entry.toPhase}` : `Creado en ${entry.toPhase}`}
                      </p>
                      <p className="text-gray-600 text-xs mt-1">
                        {new Date(entry.movedAt).toLocaleString('es-ES')}
                      </p>
                      {entry.reason && (
                        <p className="text-gray-500 text-xs mt-1 italic">{entry.reason}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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

