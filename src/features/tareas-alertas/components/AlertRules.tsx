import React, { useState } from 'react';
import { Card, Button, Select } from '../../../components/componentsreutilizables';
import { AlertType, TaskPriority, UserRole } from '../types';
import { Bell, Settings, Save, ChevronDown, ChevronUp } from 'lucide-react';

interface AlertRulesProps {
  role: UserRole;
}

interface AlertRule {
  id: string;
  type: AlertType;
  enabled: boolean;
  priority: TaskPriority;
  threshold?: number;
  notificationChannels: string[];
}

export const AlertRules: React.FC<AlertRulesProps> = ({ role }) => {
  const [rules, setRules] = useState<AlertRule[]>([]);
  const [activeTab, setActiveTab] = useState<'general' | 'personalizadas'>('general');

  const alertTypesForRole: AlertType[] = role === 'entrenador'
    ? ['check-in-faltante', 'lead-sin-seguimiento', 'pago-pendiente', 'recordatorio']
    : ['factura-vencida', 'equipo-roto', 'aforo-superado', 'mantenimiento'];

  const getAlertTypeLabel = (type: AlertType): string => {
    const labels: Record<AlertType, string> = {
      'pago-pendiente': 'Pago Pendiente',
      'check-in-faltante': 'Check-in Faltante',
      'lead-sin-seguimiento': 'Lead Sin Seguimiento',
      'factura-vencida': 'Factura Vencida',
      'equipo-roto': 'Equipo Roto',
      'aforo-superado': 'Aforo Superado',
      'mantenimiento': 'Mantenimiento',
      'tarea-critica': 'Tarea Crítica',
      'recordatorio': 'Recordatorio',
    };
    return labels[type] || type;
  };

  const priorityOptions = [
    { value: 'alta', label: 'Alta' },
    { value: 'media', label: 'Media' },
    { value: 'baja', label: 'Baja' },
  ];

  return (
    <Card className="bg-white shadow-sm">
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <Settings className="w-5 h-5 text-gray-600" />
          <h2 className="text-xl font-bold text-gray-900">
            Configuración de Alertas
          </h2>
        </div>
        <p className="text-gray-600">
          Configura las reglas de alertas automáticas según tus necesidades
        </p>
      </div>

      {/* Sistema de Tabs */}
      <Card className="p-0 bg-white shadow-sm mb-6">
        <div className="px-4 py-3">
          <div
            role="tablist"
            aria-label="Secciones"
            className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
          >
            <button
              onClick={() => setActiveTab('general')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                activeTab === 'general'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
              role="tab"
              aria-selected={activeTab === 'general'}
            >
              <Settings size={18} className={activeTab === 'general' ? 'opacity-100' : 'opacity-70'} />
              <span>Reglas Generales</span>
            </button>
            <button
              onClick={() => setActiveTab('personalizadas')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                activeTab === 'personalizadas'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
              role="tab"
              aria-selected={activeTab === 'personalizadas'}
            >
              <Settings size={18} className={activeTab === 'personalizadas' ? 'opacity-100' : 'opacity-70'} />
              <span>Reglas Personalizadas</span>
            </button>
          </div>
        </div>
      </Card>

      <div className="space-y-4">
        {alertTypesForRole.map((type) => (
          <Card
            key={type}
            className="p-4 bg-white shadow-sm border border-gray-200"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-gray-600" />
                <div>
                  <h4 className="font-semibold text-gray-900">
                    {getAlertTypeLabel(type)}
                  </h4>
                  <p className="text-sm text-gray-600">
                    Alertas automáticas cuando ocurre este evento
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Select
                  value="alta"
                  onChange={() => {}}
                  options={priorityOptions}
                  className="w-32"
                />
                <Button variant="primary" size="sm">
                  <Save size={16} className="mr-1" />
                  Guardar
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
        <p className="text-sm text-gray-700">
          <strong>Nota:</strong> Las reglas de alertas se aplican automáticamente cuando ocurren eventos
          en el sistema. Puedes personalizar la prioridad y los canales de notificación para cada tipo de alerta.
        </p>
      </Card>
    </Card>
  );
};

