// US-17: Modal para enviar precios

import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../../../components/componentsreutilizables';
import { Sale, ServiceType } from '../types';
import { PriceTemplateService, PriceTemplate } from '../services/priceTemplates';
import { Mail, Send, Copy, Edit3 } from 'lucide-react';

interface SendPriceModalProps {
  sale: Sale;
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string, sentAt: Date) => void;
}

export const SendPriceModal: React.FC<SendPriceModalProps> = ({
  sale,
  isOpen,
  onClose,
  onSend,
}) => {
  const [template, setTemplate] = useState<PriceTemplate | null>(null);
  const [customMessage, setCustomMessage] = useState('');
  const [variables, setVariables] = useState<Record<string, string | number>>({});
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const serviceType = sale.serviceType || '1-1';
      const serviceTemplate = PriceTemplateService.getTemplateByServiceType(serviceType);
      if (serviceTemplate) {
        setTemplate(serviceTemplate);
        const defaultVars: Record<string, string | number> = {};
        serviceTemplate.variables.forEach(v => {
          if (v.name === 'leadName') {
            defaultVars[v.name] = sale.leadName.split(' ')[0];
          } else {
            defaultVars[v.name] = v.default;
          }
        });
        setVariables(defaultVars);
        setCustomMessage(PriceTemplateService.replaceVariables(serviceTemplate, defaultVars));
      }
    }
  }, [isOpen, sale]);

  const handleVariableChange = (name: string, value: string | number) => {
    const newVariables = { ...variables, [name]: value };
    setVariables(newVariables);
    if (template) {
      setCustomMessage(PriceTemplateService.replaceVariables(template, newVariables));
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(customMessage);
    alert('Mensaje copiado al portapapeles');
  };

  const handleSend = () => {
    if (customMessage.trim()) {
      onSend(customMessage, new Date());
      onClose();
      setCustomMessage('');
      setIsEditing(false);
    }
  };

  if (!isOpen || !template) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Enviar precios - ${sale.leadName}`}
      size="lg"
    >
      <div className="space-y-6">
        {/* Información del lead */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900">
            <span className="font-semibold">Lead:</span> {sale.leadName}
          </p>
          <p className="text-sm text-blue-900 mt-1">
            <span className="font-semibold">Servicio:</span> {template.title}
          </p>
        </div>

        {/* Variables editables */}
        {!isEditing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Personalizar mensaje</h3>
              <button
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                <Edit3 className="w-4 h-4" />
                Editar variables
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {template.variables.filter(v => v.name !== 'leadName').slice(0, 4).map(variable => (
                <div key={variable.name}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {variable.description}
                  </label>
                  <input
                    type={typeof variable.default === 'number' ? 'number' : 'text'}
                    value={variables[variable.name] || ''}
                    onChange={(e) => handleVariableChange(
                      variable.name,
                      typeof variable.default === 'number' 
                        ? parseFloat(e.target.value) || 0 
                        : e.target.value
                    )}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Variables completas (modo edición) */}
        {isEditing && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-700">Editar variables</h3>
              <button
                onClick={() => setIsEditing(false)}
                className="text-sm text-gray-600 hover:text-gray-700"
              >
                Ocultar
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto">
              {template.variables.map(variable => (
                <div key={variable.name}>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    {variable.description}
                  </label>
                  <input
                    type={typeof variable.default === 'number' ? 'number' : 'text'}
                    value={variables[variable.name] || ''}
                    onChange={(e) => handleVariableChange(
                      variable.name,
                      typeof variable.default === 'number' 
                        ? parseFloat(e.target.value) || 0 
                        : e.target.value
                    )}
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Vista previa del mensaje */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-medium text-gray-700">
              Vista previa del mensaje
            </label>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-700"
            >
              <Copy className="w-4 h-4" />
              Copiar
            </button>
          </div>
          <textarea
            value={customMessage}
            onChange={(e) => setCustomMessage(e.target.value)}
            rows={12}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          />
        </div>

        {/* Botones */}
        <div className="flex gap-3 justify-end">
          <Button
            variant="ghost"
            onClick={onClose}
          >
            Cancelar
          </Button>
          <Button
            variant="primary"
            onClick={handleSend}
            leftIcon={<Send className="w-4 h-4" />}
          >
            Enviar precios
          </Button>
        </div>
      </div>
    </Modal>
  );
};

