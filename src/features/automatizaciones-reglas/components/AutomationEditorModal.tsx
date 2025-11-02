import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { Automation, TriggerType, ActionType, TriggerConfig, ActionConfig } from '../types';
import { 
  Zap, 
  Settings, 
  AlertCircle,
  Save
} from 'lucide-react';

interface AutomationEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  automation?: Automation | null;
  mode: 'crear' | 'editar' | 'ver';
  onSave: (datos: any) => Promise<void>;
}

const triggerOptions: Array<{ value: TriggerType; label: string }> = [
  { value: 'MEMBER_CREATED', label: 'Miembro Creado' },
  { value: 'MEMBER_INACTIVITY', label: 'Inactividad de Miembro' },
  { value: 'PAYMENT_FAILED', label: 'Pago Fallido' },
  { value: 'PAYMENT_SUCCESS', label: 'Pago Exitoso' },
  { value: 'CLASS_BOOKING', label: 'Reserva de Clase' },
  { value: 'MEMBERSHIP_EXPIRING', label: 'Membresía Por Vencer' },
  { value: 'CHECK_IN', label: 'Check-in' },
  { value: 'LEAD_CREATED', label: 'Lead Creado' },
  { value: 'GOAL_ACHIEVED', label: 'Objetivo Alcanzado' },
  { value: 'SESSION_COMPLETED', label: 'Sesión Completada' }
];

const actionOptions: Array<{ value: ActionType; label: string }> = [
  { value: 'SEND_EMAIL', label: 'Enviar Email' },
  { value: 'SEND_WHATSAPP', label: 'Enviar WhatsApp' },
  { value: 'SEND_SMS', label: 'Enviar SMS' },
  { value: 'CREATE_TASK', label: 'Crear Tarea' },
  { value: 'ASSIGN_TAG', label: 'Asignar Etiqueta' },
  { value: 'ADD_SEGMENT', label: 'Añadir a Segmento' },
  { value: 'SEND_PUSH_NOTIFICATION', label: 'Notificación Push' },
  { value: 'APPLY_DISCOUNT', label: 'Aplicar Descuento' },
  { value: 'SEND_REMINDER', label: 'Enviar Recordatorio' }
];

export const AutomationEditorModal: React.FC<AutomationEditorModalProps> = ({
  isOpen,
  onClose,
  automation,
  mode,
  onSave
}) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    is_active: true,
    trigger_type: 'MEMBER_CREATED' as TriggerType,
    trigger_config: {} as TriggerConfig,
    action_type: 'SEND_EMAIL' as ActionType,
    action_config: {} as ActionConfig
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (automation && (mode === 'editar' || mode === 'ver')) {
      setFormData({
        name: automation.name,
        description: automation.description || '',
        is_active: automation.is_active,
        trigger_type: automation.trigger_type,
        trigger_config: { ...automation.trigger_config },
        action_type: automation.action_type,
        action_config: { ...automation.action_config }
      });
    } else {
      setFormData({
        name: '',
        description: '',
        is_active: true,
        trigger_type: 'MEMBER_CREATED',
        trigger_config: {},
        action_type: 'SEND_EMAIL',
        action_config: {}
      });
    }
    setErrors({});
  }, [automation, mode, isOpen]);

  const handleInputChange = (campo: string, valor: any) => {
    setFormData(prev => ({ ...prev, [campo]: valor }));
    if (errors[campo]) {
      setErrors(prev => ({ ...prev, [campo]: '' }));
    }
  };

  const handleConfigChange = (tipo: 'trigger' | 'action', clave: string, valor: any) => {
    setFormData(prev => ({
      ...prev,
      [`${tipo}_config`]: {
        ...prev[`${tipo}_config`],
        [clave]: valor
      }
    }));
  };

  const validateForm = (): boolean => {
    const nuevosErrores: Record<string, string> = {};

    if (!formData.name.trim()) {
      nuevosErrores.name = 'El nombre es obligatorio';
    }

    if (!formData.trigger_type) {
      nuevosErrores.trigger_type = 'Debe seleccionar un trigger';
    }

    if (!formData.action_type) {
      nuevosErrores.action_type = 'Debe seleccionar una acción';
    }

    setErrors(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'ver') {
      onClose();
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error('Error al guardar:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTriggerConfig = () => {
    const trigger = formData.trigger_type;
    
    return (
      <div className="space-y-4">
        {trigger === 'MEMBER_INACTIVITY' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Días de inactividad
            </label>
            <Input
              type="number"
              value={formData.trigger_config.days || ''}
              onChange={(e) => handleConfigChange('trigger', 'days', parseInt(e.target.value) || 0)}
              disabled={mode === 'ver'}
              placeholder="Ej: 30"
            />
          </div>
        )}
        
        {(trigger === 'MEMBERSHIP_EXPIRING') && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Días antes de vencer
            </label>
            <Input
              type="number"
              value={formData.trigger_config.days || ''}
              onChange={(e) => handleConfigChange('trigger', 'days', parseInt(e.target.value) || 0)}
              disabled={mode === 'ver'}
              placeholder="Ej: 7"
            />
          </div>
        )}

        {trigger === 'GOAL_ACHIEVED' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipos de objetivo (opcional)
            </label>
            <Input
              type="text"
              value={(formData.trigger_config.categories || []).join(', ') || ''}
              onChange={(e) => handleConfigChange('trigger', 'categories', e.target.value.split(',').map(s => s.trim()))}
              disabled={mode === 'ver'}
              placeholder="Ej: peso, cardio, fuerza"
            />
          </div>
        )}
      </div>
    );
  };

  const renderActionConfig = () => {
    const action = formData.action_type;
    
    return (
      <div className="space-y-4">
        {(action === 'SEND_EMAIL' || action === 'SEND_SMS' || action === 'SEND_WHATSAPP') && (
          <>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Template ID (opcional)
              </label>
              <Input
                type="text"
                value={formData.action_config.template_id || ''}
                onChange={(e) => handleConfigChange('action', 'template_id', e.target.value)}
                disabled={mode === 'ver'}
                placeholder="ID del template"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Asunto / Título
              </label>
              <Input
                type="text"
                value={formData.action_config.subject || formData.action_config.message || ''}
                onChange={(e) => handleConfigChange('action', action === 'SEND_EMAIL' ? 'subject' : 'message', e.target.value)}
                disabled={mode === 'ver'}
                placeholder="Asunto o mensaje"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Mensaje
              </label>
              <Textarea
                value={formData.action_config.message || ''}
                onChange={(e) => handleConfigChange('action', 'message', e.target.value)}
                disabled={mode === 'ver'}
                placeholder="Contenido del mensaje"
                rows={4}
              />
            </div>
          </>
        )}

        {action === 'CREATE_TASK' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Asignar a (ID de usuario, opcional)
            </label>
            <Input
              type="text"
              value={formData.action_config.assign_to || ''}
              onChange={(e) => handleConfigChange('action', 'assign_to', e.target.value)}
              disabled={mode === 'ver'}
              placeholder="ID del usuario"
            />
          </div>
        )}

        {(action === 'ASSIGN_TAG' || action === 'ADD_SEGMENT') && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              {action === 'ASSIGN_TAG' ? 'ID de Etiqueta' : 'ID de Segmento'}
            </label>
            <Input
              type="text"
              value={formData.action_config[action === 'ASSIGN_TAG' ? 'tag_id' : 'segment_id'] || ''}
              onChange={(e) => handleConfigChange('action', action === 'ASSIGN_TAG' ? 'tag_id' : 'segment_id', e.target.value)}
              disabled={mode === 'ver'}
              placeholder={`ID del ${action === 'ASSIGN_TAG' ? 'tag' : 'segmento'}`}
            />
          </div>
        )}

        {action === 'APPLY_DISCOUNT' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              ID de Descuento
            </label>
            <Input
              type="text"
              value={formData.action_config.discount_id || ''}
              onChange={(e) => handleConfigChange('action', 'discount_id', e.target.value)}
              disabled={mode === 'ver'}
              placeholder="ID del descuento"
            />
          </div>
        )}
      </div>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-blue-100 rounded-lg">
            <Zap size={20} className="text-blue-600" />
          </div>
          <span>
            {mode === 'crear' && 'Nueva Automatización'}
            {mode === 'editar' && 'Editar Automatización'}
            {mode === 'ver' && 'Ver Automatización'}
          </span>
        </div>
      }
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Nombre */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Nombre <span className="text-red-500">*</span>
          </label>
          <Input
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            disabled={mode === 'ver'}
            placeholder="Ej: Email de bienvenida a nuevos miembros"
            className={errors.name ? 'ring-red-300' : ''}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
              <AlertCircle size={14} />
              {errors.name}
            </p>
          )}
        </div>

        {/* Descripción */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Descripción
          </label>
          <Textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            disabled={mode === 'ver'}
            placeholder="Describe qué hace esta automatización"
            rows={3}
          />
        </div>

        {/* Estado */}
        {mode !== 'ver' && (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_active"
              checked={formData.is_active}
              onChange={(e) => handleInputChange('is_active', e.target.checked)}
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="is_active" className="text-sm font-medium text-slate-700">
              Activar automáticamente al guardar
            </label>
          </div>
        )}

        {/* Trigger */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2 mb-4">
            <Settings size={18} className="text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-900">Trigger (Activador)</h3>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo de Trigger <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.trigger_type}
              onChange={(e) => handleInputChange('trigger_type', e.target.value)}
              disabled={mode === 'ver'}
              options={triggerOptions.map(opt => ({ value: opt.value, label: opt.label }))}
              className={errors.trigger_type ? 'ring-red-300' : ''}
            />
            {errors.trigger_type && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.trigger_type}
              </p>
            )}
          </div>

          {renderTriggerConfig()}
        </div>

        {/* Action */}
        <div className="border-t border-gray-200 pt-4">
          <div className="flex items-center gap-2 mb-4">
            <Zap size={18} className="text-green-500" />
            <h3 className="text-lg font-semibold text-gray-900">Acción</h3>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tipo de Acción <span className="text-red-500">*</span>
            </label>
            <Select
              value={formData.action_type}
              onChange={(e) => handleInputChange('action_type', e.target.value)}
              disabled={mode === 'ver'}
              options={actionOptions.map(opt => ({ value: opt.value, label: opt.label }))}
              className={errors.action_type ? 'ring-red-300' : ''}
            />
            {errors.action_type && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle size={14} />
                {errors.action_type}
              </p>
            )}
          </div>

          {renderActionConfig()}
        </div>

        {/* Botones */}
        <div className="flex justify-end gap-3 border-t border-gray-200 pt-4">
          <Button
            type="button"
            variant="ghost"
            onClick={onClose}
            disabled={loading}
          >
            {mode === 'ver' ? 'Cerrar' : 'Cancelar'}
          </Button>
          {mode !== 'ver' && (
            <Button
              type="submit"
              variant="primary"
              disabled={loading}
            >
              <Save size={16} className="mr-2" />
              {loading ? 'Guardando...' : mode === 'crear' ? 'Crear' : 'Guardar'}
            </Button>
          )}
        </div>
      </form>
    </Modal>
  );
};
