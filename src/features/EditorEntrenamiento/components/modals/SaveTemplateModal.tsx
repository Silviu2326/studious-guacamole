import React, { useState } from 'react';
import { Modal } from '../../../../components/componentsreutilizables/Modal';
import { Button } from '../../../../components/componentsreutilizables/Button';
import { Eraser, Save } from 'lucide-react';

interface SaveTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (name: string, sanitize: boolean) => void;
}

export const SaveTemplateModal: React.FC<SaveTemplateModalProps> = ({ isOpen, onClose, onSave }) => {
  const [name, setName] = useState('');
  const [sanitize, setSanitize] = useState(true);

  const handleSave = () => {
    if (!name.trim()) return;
    onSave(name, sanitize);
    setName(''); // Reset
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Guardar como Plantilla"
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSave} 
            disabled={!name.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Save size={16} className="mr-2" />
            Guardar Plantilla
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Plantilla
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Ej: Semana de Hipertrofia - Fase 1"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            autoFocus
          />
        </div>

        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
          <label className="flex items-start gap-3 cursor-pointer">
            <div className="mt-1">
              <input
                type="checkbox"
                checked={sanitize}
                onChange={(e) => setSanitize(e.target.checked)}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
            </div>
            <div>
              <span className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <Eraser size={16} className="text-gray-500" />
                Sanitizar datos (Recomendado)
              </span>
              <p className="text-sm text-gray-500 mt-1">
                Elimina las cargas específicas (kg) pero mantiene los esquemas de series, repeticiones, RPE y descansos. Ideal para reutilizar la estructura con diferentes clientes.
              </p>
            </div>
          </label>
        </div>
      </div>
    </Modal>
  );
};
