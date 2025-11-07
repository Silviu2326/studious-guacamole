import React, { useState } from 'react';
import { Card, Button, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Survey, SurveyType, SurveyArea } from '../types';
import { Plus, X } from 'lucide-react';

interface SurveyBuilderProps {
  survey?: Survey;
  onSave: (survey: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onCancel: () => void;
}

export const SurveyBuilder: React.FC<SurveyBuilderProps> = ({ survey, onSave, onCancel }) => {
  const [title, setTitle] = useState(survey?.title || '');
  const [type, setType] = useState<SurveyType>(survey?.type || 'nps');
  const [area, setArea] = useState<SurveyArea | ''>(survey?.area || '');
  const [description, setDescription] = useState(survey?.description || '');
  const [status, setStatus] = useState<'draft' | 'active' | 'paused' | 'archived'>(
    survey?.status || 'draft'
  );
  const [automationEnabled, setAutomationEnabled] = useState(!!survey?.automation?.enabled);
  const [automationTrigger, setAutomationTrigger] = useState<'class_attendance' | 'service_use' | 'manual' | 'periodic'>(
    survey?.automation?.trigger || 'manual'
  );
  const [automationDelay, setAutomationDelay] = useState(survey?.automation?.delay || 24);

  const areaOptions = [
    { value: '', label: 'General' },
    { value: 'servicio_general', label: 'Servicio General' },
    { value: 'clases', label: 'Clases' },
    { value: 'instalaciones', label: 'Instalaciones' },
    { value: 'atencion_recepcion', label: 'Atención Recepción' },
    { value: 'equipamiento', label: 'Equipamiento' },
  ];

  const typeOptions = [
    { value: 'nps', label: 'NPS (0-10)' },
    { value: 'csat', label: 'CSAT (1-5)' },
  ];

  const statusOptions = [
    { value: 'draft', label: 'Borrador' },
    { value: 'active', label: 'Activa' },
    { value: 'paused', label: 'Pausada' },
    { value: 'archived', label: 'Archivada' },
  ];

  const triggerOptions = [
    { value: 'manual', label: 'Manual' },
    { value: 'class_attendance', label: 'Después de asistir a clase' },
    { value: 'service_use', label: 'Después de usar servicio' },
    { value: 'periodic', label: 'Periódica' },
  ];

  const handleSave = () => {
    if (!title.trim()) {
      alert('El título es requerido');
      return;
    }

    const surveyData: Omit<Survey, 'id' | 'createdAt' | 'updatedAt'> = {
      title,
      type,
      area: area || undefined,
      description: description || undefined,
      status,
      automation: automationEnabled
        ? {
            id: survey?.automation?.id || '',
            surveyId: survey?.id || '',
            trigger: automationTrigger,
            delay: automationDelay,
            enabled: true,
          }
        : undefined,
    };

    onSave(surveyData);
  };

  return (
    <Card padding="lg">
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            {survey ? 'Editar Encuesta' : 'Nueva Encuesta'}
          </h3>
          <button
            onClick={onCancel}
            className="w-8 h-8 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Input
              label="Título *"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej: Encuesta de satisfacción general"
            />
          </div>

          <div>
            <Select
              label="Tipo de Encuesta *"
              value={type}
              onChange={(e) => setType(e.target.value as SurveyType)}
              options={typeOptions}
            />
          </div>

          <div>
            <Select
              label="Área"
              value={area}
              onChange={(e) => setArea(e.target.value as SurveyArea | '')}
              options={areaOptions}
            />
          </div>

          <div>
            <Select
              label="Estado"
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              options={statusOptions}
            />
          </div>
        </div>

        <div>
          <Textarea
            label="Descripción"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Describe el propósito de esta encuesta..."
            rows={4}
          />
        </div>

        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h4 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Automatización
              </h4>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Configura el envío automático de esta encuesta
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={automationEnabled}
                onChange={(e) => setAutomationEnabled(e.target.checked)}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-purple-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
            </label>
          </div>

          {automationEnabled && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Select
                  label="Trigger"
                  value={automationTrigger}
                  onChange={(e) => setAutomationTrigger(e.target.value as typeof automationTrigger)}
                  options={triggerOptions}
                />
              </div>

              <div>
                <Input
                  label="Retraso (horas)"
                  type="number"
                  value={automationDelay.toString()}
                  onChange={(e) => setAutomationDelay(parseInt(e.target.value) || 0)}
                  min={0}
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onCancel}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {survey ? 'Actualizar' : 'Crear'} Encuesta
          </Button>
        </div>
      </div>
    </Card>
  );
};

