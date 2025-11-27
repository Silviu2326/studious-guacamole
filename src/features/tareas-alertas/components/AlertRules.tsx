import React, { useState } from 'react';
import { Card, Button, Select, Switch, Tooltip } from '../../../components/componentsreutilizables';
import { AlertType, TaskPriority, UserRole, AlertRulesMode } from '../types';
import { Bell, Settings, Save, Info } from 'lucide-react';

interface AlertRulesProps {
  role: UserRole;
}

interface AlertRule {
  id: string;
  type: AlertType;
  enabled: boolean;
  priority: TaskPriority;
  threshold?: number; // Días para el umbral
  notificationChannels: string[];
}

export const AlertRules: React.FC<AlertRulesProps> = ({ role }) => {
  const [mode, setMode] = useState<AlertRulesMode>('simple');
  const [rules, setRules] = useState<AlertRule[]>(() => {
    // Inicializar con valores por defecto: todas las alertas activadas
    const alertTypesForRole: AlertType[] = role === 'entrenador'
      ? ['check-in-faltante', 'lead-sin-seguimiento', 'pago-pendiente', 'recordatorio']
      : ['factura-vencida', 'equipo-roto', 'aforo-superado', 'mantenimiento'];
    
    return alertTypesForRole.map((type) => ({
      id: `rule-${type}`,
      type,
      enabled: true,
      priority: 'media' as TaskPriority,
      threshold: getDefaultThreshold(type),
      notificationChannels: ['push'],
    }));
  });

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

  const getDefaultThreshold = (type: AlertType): number => {
    const thresholds: Record<AlertType, number> = {
      'check-in-faltante': 5,
      'lead-sin-seguimiento': 3,
      'pago-pendiente': 2,
      'factura-vencida': 1,
      'equipo-roto': 0,
      'aforo-superado': 0,
      'mantenimiento': 7,
      'tarea-critica': 1,
      'recordatorio': 0,
    };
    return thresholds[type] || 0;
  };

  const getAlertTooltip = (type: AlertType): string => {
    const tooltips: Record<AlertType, string> = {
      'check-in-faltante': 'Se crea una alerta si el cliente no registra ningún check-in en 5 días seguidos. Ejemplo: Si un cliente no hace check-in desde el lunes, recibirás una alerta el sábado.',
      'lead-sin-seguimiento': 'Se crea una alerta si un lead no ha recibido seguimiento en 3 días. Ejemplo: Un lead que ingresó el lunes y no ha sido contactado recibirá una alerta el jueves.',
      'pago-pendiente': 'Se crea una alerta si un pago está pendiente por más de 2 días. Ejemplo: Un pago que vence el lunes generará una alerta el miércoles si no se ha registrado.',
      'factura-vencida': 'Se crea una alerta cuando una factura vence. Ejemplo: Una factura con vencimiento el 15 generará una alerta el día 16 si no está pagada.',
      'equipo-roto': 'Se crea una alerta inmediatamente cuando se reporta un equipo roto. Ejemplo: Si un entrenador marca una máquina como defectuosa, recibirás una alerta al instante.',
      'aforo-superado': 'Se crea una alerta cuando el aforo de una clase supera el límite permitido. Ejemplo: Si una clase tiene 20 personas y el límite es 15, se generará una alerta.',
      'mantenimiento': 'Se crea una alerta cuando un equipo necesita mantenimiento programado (cada 7 días). Ejemplo: Si un equipo requiere mantenimiento mensual, recibirás una alerta cada 30 días.',
      'tarea-critica': 'Se crea una alerta para tareas marcadas como críticas que están próximas a vencer. Ejemplo: Una tarea crítica que vence mañana generará una alerta hoy.',
      'recordatorio': 'Se crea una alerta para recordatorios programados. Ejemplo: Un recordatorio de cita con un cliente se activará según la configuración de tiempo.',
    };
    return tooltips[type] || 'Configura las reglas de alertas para este tipo de evento.';
  };

  const priorityOptions = [
    { value: 'alta', label: 'Alta' },
    { value: 'media', label: 'Media' },
    { value: 'baja', label: 'Baja' },
  ];

  const handleToggleEnabled = (type: AlertType) => {
    setRules((prevRules) =>
      prevRules.map((rule) =>
        rule.type === type ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  const handlePriorityChange = (type: AlertType, priority: TaskPriority) => {
    setRules((prevRules) =>
      prevRules.map((rule) =>
        rule.type === type ? { ...rule, priority } : rule
      )
    );
  };

  const handleThresholdChange = (type: AlertType, threshold: number) => {
    setRules((prevRules) =>
      prevRules.map((rule) =>
        rule.type === type ? { ...rule, threshold } : rule
      )
    );
  };

  const handleSave = () => {
    // Aquí se implementaría la lógica para guardar las reglas
    console.log('Guardando reglas:', rules);
    // TODO: Implementar llamada a API para guardar reglas
  };

  const getRule = (type: AlertType): AlertRule | undefined => {
    return rules.find((r) => r.type === type);
  };

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

      {/* Toggle Modo Simple/Avanzado */}
      <Card className="p-4 bg-white shadow-sm mb-6 border border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-700">Modo de configuración:</span>
            <div className="flex items-center gap-2 bg-slate-100 rounded-lg p-1">
              <button
                onClick={() => setMode('simple')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  mode === 'simple'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Modo Simple
              </button>
              <button
                onClick={() => setMode('advanced')}
                className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${
                  mode === 'advanced'
                    ? 'bg-white text-slate-900 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Modo Avanzado
              </button>
            </div>
          </div>
          {mode === 'advanced' && (
            <Button variant="primary" size="sm" onClick={handleSave}>
              <Save size={16} className="mr-1" />
              Guardar Cambios
            </Button>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          {mode === 'simple'
            ? 'Activa o desactiva tipos de alertas con un simple toggle'
            : 'Configura prioridades y umbrales de días para cada tipo de alerta'}
        </p>
      </Card>

      {/* Contenido según el modo */}
      <div className="space-y-4">
        {alertTypesForRole.map((type) => {
          const rule = getRule(type);
          if (!rule) return null;

          return (
            <Card
              key={type}
              className="p-4 bg-white shadow-sm border border-gray-200"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-gray-900">
                        {getAlertTypeLabel(type)}
                      </h4>
                      <Tooltip content={getAlertTooltip(type)} position="right">
                        <Info className="w-4 h-4 text-gray-400 hover:text-gray-600 cursor-help" />
                      </Tooltip>
                    </div>
                  </div>

                  {mode === 'simple' ? (
                    <div className="flex items-center gap-3">
                      <Switch
                        checked={rule.enabled}
                        onChange={() => handleToggleEnabled(type)}
                        label={rule.enabled ? 'Activada' : 'Desactivada'}
                        size="md"
                      />
                      <span className="text-sm text-gray-600">
                        {rule.enabled
                          ? 'Recibirás alertas automáticas para este tipo de evento'
                          : 'Las alertas de este tipo están desactivadas'}
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-4 mt-3">
                      <div className="flex items-center gap-3">
                        <Switch
                          checked={rule.enabled}
                          onChange={() => handleToggleEnabled(type)}
                          label={rule.enabled ? 'Activada' : 'Desactivada'}
                          size="md"
                        />
                      </div>

                      {rule.enabled && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4 pl-8 border-l-2 border-gray-200">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Prioridad
                            </label>
                            <Select
                              value={rule.priority}
                              onChange={(e) => handlePriorityChange(type, e.target.value as TaskPriority)}
                              options={priorityOptions}
                              className="w-full"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Días de umbral
                              <Tooltip
                                content={`Número de días que deben pasar antes de generar la alerta. Ejemplo: Si configuras 5 días, la alerta se creará después de 5 días sin actividad.`}
                                position="right"
                              >
                                <Info className="w-3 h-3 text-gray-400 hover:text-gray-600 cursor-help inline-block ml-1" />
                              </Tooltip>
                            </label>
                            <input
                              type="number"
                              min="0"
                              max="30"
                              value={rule.threshold || 0}
                              onChange={(e) => handleThresholdChange(type, parseInt(e.target.value) || 0)}
                              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Card className="mt-6 p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">
              {mode === 'simple' ? 'Modo Simple' : 'Modo Avanzado'}
            </p>
            <p className="text-sm text-gray-700">
              {mode === 'simple'
                ? 'En modo simple, todas las alertas activadas usan valores por defecto razonables. Cambia a modo avanzado para personalizar prioridades y umbrales de días para cada tipo de alerta.'
                : 'En modo avanzado puedes configurar la prioridad y el número de días de umbral para cada tipo de alerta. Los cambios se guardan automáticamente cuando haces clic en "Guardar Cambios".'}
            </p>
          </div>
        </div>
      </Card>
    </Card>
  );
};
