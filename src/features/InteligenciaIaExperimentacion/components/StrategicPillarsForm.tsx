import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Textarea, Badge } from '../../../components/componentsreutilizables';
import { StrategicPillars } from '../types';
import { Save, X, Plus, Target, Sparkles, Tool, DollarSign, AlertCircle } from 'lucide-react';

interface StrategicPillarsFormProps {
  initialData?: StrategicPillars;
  onSave: (data: StrategicPillars) => Promise<void>;
  isLoading?: boolean;
}

export const StrategicPillarsForm: React.FC<StrategicPillarsFormProps> = ({
  initialData,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<StrategicPillars>({
    mission: '',
    differentiators: [],
    availableResources: [],
    budget: '',
    tools: [],
    objectives: [],
    limitations: [],
  });

  const [newDifferentiator, setNewDifferentiator] = useState('');
  const [newResource, setNewResource] = useState('');
  const [newTool, setNewTool] = useState('');
  const [newObjective, setNewObjective] = useState('');
  const [newLimitation, setNewLimitation] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleAddDifferentiator = () => {
    if (newDifferentiator.trim() && !formData.differentiators.includes(newDifferentiator.trim())) {
      setFormData({
        ...formData,
        differentiators: [...formData.differentiators, newDifferentiator.trim()],
      });
      setNewDifferentiator('');
    }
  };

  const handleRemoveDifferentiator = (item: string) => {
    setFormData({
      ...formData,
      differentiators: formData.differentiators.filter((d) => d !== item),
    });
  };

  const handleAddResource = () => {
    if (newResource.trim() && !formData.availableResources.includes(newResource.trim())) {
      setFormData({
        ...formData,
        availableResources: [...formData.availableResources, newResource.trim()],
      });
      setNewResource('');
    }
  };

  const handleRemoveResource = (item: string) => {
    setFormData({
      ...formData,
      availableResources: formData.availableResources.filter((r) => r !== item),
    });
  };

  const handleAddTool = () => {
    if (newTool.trim() && !formData.tools?.includes(newTool.trim())) {
      setFormData({
        ...formData,
        tools: [...(formData.tools || []), newTool.trim()],
      });
      setNewTool('');
    }
  };

  const handleRemoveTool = (item: string) => {
    setFormData({
      ...formData,
      tools: formData.tools?.filter((t) => t !== item) || [],
    });
  };

  const handleAddObjective = () => {
    if (newObjective.trim() && !formData.objectives?.includes(newObjective.trim())) {
      setFormData({
        ...formData,
        objectives: [...(formData.objectives || []), newObjective.trim()],
      });
      setNewObjective('');
    }
  };

  const handleRemoveObjective = (item: string) => {
    setFormData({
      ...formData,
      objectives: formData.objectives?.filter((o) => o !== item) || [],
    });
  };

  const handleAddLimitation = () => {
    if (newLimitation.trim() && !formData.limitations?.includes(newLimitation.trim())) {
      setFormData({
        ...formData,
        limitations: [...(formData.limitations || []), newLimitation.trim()],
      });
      setNewLimitation('');
    }
  };

  const handleRemoveLimitation = (item: string) => {
    setFormData({
      ...formData,
      limitations: formData.limitations?.filter((l) => l !== item) || [],
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await onSave(formData);
    } catch (error) {
      console.error('Error guardando pilares estratégicos:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const ArrayInputSection = ({
    title,
    items,
    newValue,
    setNewValue,
    onAdd,
    onRemove,
    icon,
    placeholder,
  }: {
    title: string;
    items: string[];
    newValue: string;
    setNewValue: (value: string) => void;
    onAdd: () => void;
    onRemove: (item: string) => void;
    icon: React.ReactNode;
    placeholder: string;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center gap-2">
        {icon}
        <label className="text-sm font-semibold text-slate-900">{title}</label>
      </div>
      <div className="flex gap-2">
        <Input
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder={placeholder}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAdd();
            }
          }}
          className="flex-1"
        />
        <Button type="button" onClick={onAdd} leftIcon={<Plus size={16} />} variant="secondary" size="sm">
          Agregar
        </Button>
      </div>
      {items.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {items.map((item, index) => (
            <Badge key={index} variant="secondary" className="flex items-center gap-1">
              {item}
              <button
                type="button"
                onClick={() => onRemove(item)}
                className="ml-1 hover:text-red-600 transition-colors"
              >
                <X size={14} />
              </button>
            </Badge>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <Card className="p-6 bg-white border border-slate-200/80 shadow-sm">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
          <Target size={20} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900">Pilares Estratégicos</h2>
          <p className="text-sm text-slate-600 mt-1">
            Define tu misión, diferenciadores y recursos para que la IA proponga iniciativas alineadas a tu realidad
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Misión */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Sparkles size={16} className="text-indigo-600" />
            Misión
          </label>
          <Textarea
            value={formData.mission}
            onChange={(e) => setFormData({ ...formData, mission: e.target.value })}
            placeholder="Describe tu misión como entrenador personal. ¿Qué te mueve? ¿Cuál es tu propósito?"
            rows={4}
            showCount
            maxLength={500}
            helperText="Esta información ayudará a la IA a entender tu visión y proponer iniciativas alineadas"
          />
        </div>

        {/* Diferenciadores */}
        <ArrayInputSection
          title="Diferenciadores"
          items={formData.differentiators}
          newValue={newDifferentiator}
          setNewValue={setNewDifferentiator}
          onAdd={handleAddDifferentiator}
          onRemove={handleRemoveDifferentiator}
          icon={<Sparkles size={16} className="text-indigo-600" />}
          placeholder="Ej: Entrenamiento funcional, Nutrición personalizada..."
        />

        {/* Recursos Disponibles */}
        <ArrayInputSection
          title="Recursos Disponibles"
          items={formData.availableResources}
          newValue={newResource}
          setNewValue={setNewResource}
          onAdd={handleAddResource}
          onRemove={handleRemoveResource}
          icon={<Tool size={16} className="text-indigo-600" />}
          placeholder="Ej: Estudio propio, Equipo de video, Redes sociales activas..."
        />

        {/* Presupuesto (Opcional) */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <DollarSign size={16} className="text-indigo-600" />
            Presupuesto Mensual (Opcional)
          </label>
          <Input
            type="text"
            value={formData.budget || ''}
            onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            placeholder="Ej: €500-1000, Sin presupuesto específico..."
            helperText="Indica tu presupuesto aproximado para marketing y herramientas"
          />
        </div>

        {/* Herramientas (Opcional) */}
        <ArrayInputSection
          title="Herramientas y Stack Tecnológico (Opcional)"
          items={formData.tools || []}
          newValue={newTool}
          setNewValue={setNewTool}
          onAdd={handleAddTool}
          onRemove={handleRemoveTool}
          icon={<Tool size={16} className="text-slate-500" />}
          placeholder="Ej: Canva, Mailchimp, Instagram, WhatsApp Business..."
        />

        {/* Objetivos (Opcional) */}
        <ArrayInputSection
          title="Objetivos Específicos (Opcional)"
          items={formData.objectives || []}
          newValue={newObjective}
          setNewValue={setNewObjective}
          onAdd={handleAddObjective}
          onRemove={handleRemoveObjective}
          icon={<Target size={16} className="text-slate-500" />}
          placeholder="Ej: Aumentar clientes en 30%, Lanzar programa online..."
        />

        {/* Limitaciones (Opcional) */}
        <ArrayInputSection
          title="Limitaciones o Restricciones (Opcional)"
          items={formData.limitations || []}
          newValue={newLimitation}
          setNewValue={setNewLimitation}
          onAdd={handleAddLimitation}
          onRemove={handleRemoveLimitation}
          icon={<AlertCircle size={16} className="text-slate-500" />}
          placeholder="Ej: Tiempo limitado, Sin experiencia en redes sociales..."
        />

        {/* Botón Guardar */}
        <div className="flex justify-end pt-4 border-t border-slate-200">
          <Button
            type="submit"
            leftIcon={<Save size={18} />}
            loading={isSaving || isLoading}
            disabled={!formData.mission.trim()}
          >
            Guardar Perfil de Inteligencia
          </Button>
        </div>
      </form>
    </Card>
  );
};

export default StrategicPillarsForm;

