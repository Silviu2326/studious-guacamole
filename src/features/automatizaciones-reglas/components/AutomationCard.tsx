import React from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Automation } from '../types';
import { 
  Edit, 
  Trash2, 
  Eye, 
  Zap,
  ToggleLeft,
  ToggleRight,
  Play,
  Pause,
  TrendingUp,
  CheckCircle2,
  Clock
} from 'lucide-react';

interface AutomationCardProps {
  automation: Automation;
  onEdit: (automation: Automation) => void;
  onDelete: (automation: Automation) => void;
  onView: (automation: Automation) => void;
  onToggleActive: (automation: Automation) => void;
  variant?: 'grid' | 'list';
}

const getTriggerLabel = (trigger: string): string => {
  const labels: Record<string, string> = {
    MEMBER_CREATED: 'Miembro Creado',
    MEMBER_INACTIVITY: 'Inactividad',
    PAYMENT_FAILED: 'Pago Fallido',
    PAYMENT_SUCCESS: 'Pago Exitoso',
    CLASS_BOOKING: 'Reserva de Clase',
    MEMBERSHIP_EXPIRING: 'Membresía Por Vencer',
    CHECK_IN: 'Check-in',
    LEAD_CREATED: 'Lead Creado',
    GOAL_ACHIEVED: 'Objetivo Alcanzado',
    SESSION_COMPLETED: 'Sesión Completada'
  };
  return labels[trigger] || trigger;
};

const getActionLabel = (action: string): string => {
  const labels: Record<string, string> = {
    SEND_EMAIL: 'Enviar Email',
    SEND_WHATSAPP: 'Enviar WhatsApp',
    SEND_SMS: 'Enviar SMS',
    CREATE_TASK: 'Crear Tarea',
    ASSIGN_TAG: 'Asignar Etiqueta',
    ADD_SEGMENT: 'Añadir a Segmento',
    SEND_PUSH_NOTIFICATION: 'Notificación Push',
    APPLY_DISCOUNT: 'Aplicar Descuento',
    SEND_REMINDER: 'Enviar Recordatorio'
  };
  return labels[action] || action;
};

const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('es-ES', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).format(d);
};

export const AutomationCard: React.FC<AutomationCardProps> = ({
  automation,
  onEdit,
  onDelete,
  onView,
  onToggleActive,
  variant = 'grid'
}) => {
  if (variant === 'list') {
    return (
      <Card variant="hover" className="p-4 bg-white shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4 flex-1">
            <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
              <Zap size={20} className="text-blue-600" />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="font-semibold text-gray-900 truncate">
                  {automation.name}
                </h3>
                <Badge variant={automation.is_active ? 'green' : 'gray'}>
                  {automation.is_active ? 'Activa' : 'Inactiva'}
                </Badge>
              </div>
              
              <p className="text-sm text-gray-600 mb-2 line-clamp-1">
                {automation.description || 'Sin descripción'}
              </p>
              
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span className="flex items-center gap-1">
                  <Zap size={12} />
                  {getTriggerLabel(automation.trigger_type)}
                </span>
                <span className="flex items-center gap-1">
                  <Play size={12} />
                  {getActionLabel(automation.action_type)}
                </span>
                <span className="flex items-center gap-1">
                  <TrendingUp size={12} />
                  {automation.executions_last_30d} ejecuciones
                </span>
                <span className="flex items-center gap-1">
                  <CheckCircle2 size={12} />
                  {automation.success_rate.toFixed(1)}% éxito
                </span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 ml-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleActive(automation)}
              title={automation.is_active ? 'Desactivar' : 'Activar'}
            >
              {automation.is_active ? (
                <ToggleRight size={20} className="text-green-600" />
              ) : (
                <ToggleLeft size={20} className="text-gray-400" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onView(automation)}
            >
              <Eye size={16} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(automation)}
            >
              <Edit size={16} />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(automation)}
              className="text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
      {/* Header con icono y estado */}
      <div className="p-4 pb-3 border-b border-gray-100">
        <div className="flex items-start justify-between mb-2">
          <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
            <Zap size={20} className="text-blue-600" />
          </div>
          <Badge variant={automation.is_active ? 'green' : 'gray'}>
            {automation.is_active ? 'Activa' : 'Inactiva'}
          </Badge>
        </div>
        
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">
          {automation.name}
        </h3>
        
        <p className="text-sm text-gray-600 line-clamp-2">
          {automation.description || 'Sin descripción'}
        </p>
      </div>

      {/* Contenido */}
      <div className="flex-1 p-4 flex flex-col">
        {/* Información de trigger y acción */}
        <div className="space-y-3 mb-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Zap size={14} className="text-blue-500" />
              <span className="text-xs font-medium text-gray-500">Trigger:</span>
            </div>
            <span className="text-sm text-gray-900 font-medium">
              {getTriggerLabel(automation.trigger_type)}
            </span>
          </div>
          
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Play size={14} className="text-green-500" />
              <span className="text-xs font-medium text-gray-500">Acción:</span>
            </div>
            <span className="text-sm text-gray-900 font-medium">
              {getActionLabel(automation.action_type)}
            </span>
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-xl">
          <div>
            <div className="text-xs text-gray-500 mb-1">Ejecuciones (30d)</div>
            <div className="text-lg font-bold text-gray-900 flex items-center gap-1">
              <TrendingUp size={16} className="text-blue-500" />
              {automation.executions_last_30d}
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 mb-1">Tasa de éxito</div>
            <div className="text-lg font-bold text-gray-900 flex items-center gap-1">
              <CheckCircle2 size={16} className="text-green-500" />
              {automation.success_rate.toFixed(1)}%
            </div>
          </div>
        </div>

        {/* Última ejecución */}
        {automation.last_execution && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Clock size={12} />
            <span>Última ejecución: {formatDate(automation.last_execution)}</span>
          </div>
        )}

        {/* Fechas */}
        <div className="text-xs text-gray-500 mb-4">
          <div>Creado: {formatDate(automation.created_at)}</div>
          <div>Actualizado: {formatDate(automation.updated_at)}</div>
        </div>

        {/* Acciones */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onView(automation)}
            className="flex-1"
          >
            <Eye size={16} className="mr-1" />
            Ver
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(automation)}
            className="flex-1"
          >
            <Edit size={16} className="mr-1" />
            Editar
          </Button>

          <div className="flex gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onToggleActive(automation)}
              title={automation.is_active ? 'Desactivar' : 'Activar'}
              className="p-2"
            >
              {automation.is_active ? (
                <ToggleRight size={16} className="text-green-600" />
              ) : (
                <ToggleLeft size={16} className="text-gray-400" />
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onDelete(automation)}
              className="p-2 text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 size={16} />
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};
