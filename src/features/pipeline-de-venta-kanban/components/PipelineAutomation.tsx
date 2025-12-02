import React from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { AutomationRule } from '../types';
import { Settings, Play, Pause, Trash2 } from 'lucide-react';

interface PipelineAutomationProps {
  businessType: 'entrenador' | 'gimnasio';
}

export const PipelineAutomation: React.FC<PipelineAutomationProps> = ({ businessType }) => {
  // Mock de reglas de automatización
  const [rules, setRules] = React.useState<AutomationRule[]>([
    {
      id: '1',
      name: 'Notificar después de 3 días sin actividad',
      trigger: 'no_activity_days',
      actions: [
        {
          type: 'notification',
          config: { message: 'Venta sin actividad reciente' },
        },
      ],
      enabled: true,
    },
    {
      id: '2',
      name: 'Enviar email al entrar en fase de oferta',
      trigger: 'phase_entry',
      actions: [
        {
          type: 'email',
          config: { template: 'offer_email' },
        },
      ],
      enabled: false,
    },
  ]);

  const toggleRule = (id: string) => {
    setRules(rules.map(rule =>
      rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
    ));
  };

  const deleteRule = (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta regla?')) {
      setRules(rules.filter(rule => rule.id !== id));
    }
  };

  return (
    <Card className="p-4 bg-white shadow-sm">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Automatizaciones
            </h3>
          </div>
          <Button variant="primary" size="sm">
            <Settings size={18} className="mr-2" />
            Nueva Regla
          </Button>
        </div>

        <div className="space-y-3">
          {rules.map((rule) => (
            <div
              key={rule.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="text-base font-semibold text-gray-900">
                    {rule.name}
                  </h4>
                  <Badge variant={rule.enabled ? 'success' : 'secondary'}>
                    {rule.enabled ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
                <p className="text-sm text-slate-600">
                  Trigger: {rule.trigger} | Acciones: {rule.actions.length}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => toggleRule(rule.id)}
                >
                  {rule.enabled ? (
                    <Pause size={18} />
                  ) : (
                    <Play size={18} />
                  )}
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => deleteRule(rule.id)}
                >
                  <Trash2 size={18} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
};

