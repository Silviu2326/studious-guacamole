import React, { useState } from 'react';
import { Modal } from '../../../../components/componentsreutilizables/Modal';
import { Button } from '../../../../components/componentsreutilizables/Button';
import { Restricciones } from '../../utils/SmartFill';

interface SmartFillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (restricciones: Restricciones) => void;
}

export const SmartFillModal: React.FC<SmartFillModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [tiempo, setTiempo] = useState<number | ''>('');
  const [material, setMaterial] = useState<string[]>([]);
  const [molestias, setMolestias] = useState<string[]>([]);

  // Lists of options
  const materiales = ['Mancuernas', 'Barra', 'Máquinas', 'Bodyweight', 'Kettlebell', 'Bandas'];
  const lesiones = ['Rodilla', 'Hombro', 'Espalda Baja', 'Muñeca', 'Tobillo'];

  const toggleMaterial = (m: string) => {
    setMaterial(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m]);
  };

  const toggleLesion = (l: string) => {
    setMolestias(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);
  };

  const handleConfirm = () => {
    const r: Restricciones = {};
    if (tiempo) r.tiempoDisponible = Number(tiempo);
    if (material.length > 0) r.materialDisponible = material;
    if (molestias.length > 0) r.molestias = molestias;
    onConfirm(r);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="⚡ Smart Fill - Ajuste Inteligente"
      size="md"
      footer={
        <>
          <Button variant="secondary" onClick={onClose}>Cancelar</Button>
          <Button variant="primary" onClick={handleConfirm}>Aplicar Smart Fill</Button>
        </>
      }
    >
      <div className="space-y-6 p-4">
        {/* Tiempo */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo Disponible (min)</label>
          <input
            type="number"
            value={tiempo}
            onChange={(e) => setTiempo(Number(e.target.value))}
            placeholder="Ej: 60"
            className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">Dejar vacío si no hay límite.</p>
        </div>

        {/* Material */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Material Disponible (Seleccionar solo lo disponible)</label>
          <div className="grid grid-cols-2 gap-2 bg-gray-50 p-3 rounded-md border border-gray-200">
            {materiales.map(m => (
              <label key={m} className="flex items-center space-x-2 cursor-pointer hover:bg-gray-100 p-1 rounded">
                <input
                  type="checkbox"
                  checked={material.includes(m)}
                  onChange={() => toggleMaterial(m)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-600">{m}</span>
              </label>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1">Si no seleccionas nada, se asume todo disponible.</p>
        </div>

        {/* Molestias */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Molestias / Lesiones (A evitar)</label>
          <div className="grid grid-cols-2 gap-2 bg-red-50 p-3 rounded-md border border-red-200">
            {lesiones.map(l => (
              <label key={l} className="flex items-center space-x-2 cursor-pointer hover:bg-red-100 p-1 rounded">
                <input
                  type="checkbox"
                  checked={molestias.includes(l)}
                  onChange={() => toggleLesion(l)}
                  className="rounded text-red-600 focus:ring-red-500"
                />
                <span className="text-sm text-gray-600">{l}</span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </Modal>
  );
};
