import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Phase, BusinessType } from '../types';
import { getPhases, createPhase, updatePhase, deletePhase } from '../api/phases';
import { Plus, Edit, Trash2, Save, X } from 'lucide-react';

interface PhaseConfiguratorProps {
  businessType: BusinessType;
  isOpen: boolean;
  onClose: () => void;
}

export const PhaseConfigurator: React.FC<PhaseConfiguratorProps> = ({
  businessType,
  isOpen,
  onClose,
}) => {
  const [phases, setPhases] = useState<Phase[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPhase, setEditingPhase] = useState<Phase | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    if (isOpen) {
      loadPhases();
    }
  }, [isOpen, businessType]);

  const loadPhases = async () => {
    setLoading(true);
    try {
      const data = await getPhases(businessType);
      setPhases(data);
    } catch (error) {
      console.error('Error cargando fases:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (phaseData: Omit<Phase, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      await createPhase(phaseData);
      setShowCreateModal(false);
      loadPhases();
    } catch (error) {
      console.error('Error creando fase:', error);
    }
  };

  const handleUpdate = async (id: string, updates: Partial<Phase>) => {
    try {
      await updatePhase(id, updates);
      setEditingPhase(null);
      loadPhases();
    } catch (error) {
      console.error('Error actualizando fase:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('¿Estás seguro de eliminar esta fase?')) {
      try {
        await deletePhase(id);
        loadPhases();
      } catch (error) {
        console.error('Error eliminando fase:', error);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configurar Fases del Pipeline"
      size="xl"
    >
      <div className="space-y-4">
        <div className="flex items-center justify-between mb-4">
          <p className={`${ds.typography.body} ${ds.color.textSecondary}`}>
            Personaliza las fases del pipeline según tu proceso de ventas
          </p>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowCreateModal(true)}
          >
            <Plus className="w-4 h-4 mr-1" />
            Nueva Fase
          </Button>
        </div>

        {loading ? (
          <div className="text-center py-8">Cargando...</div>
        ) : (
          <div className="space-y-2">
            {phases.map((phase) => (
              <div
                key={phase.id}
                className="flex items-center gap-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg"
              >
                <div
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: phase.color || '#3B82F6' }}
                />
                <div className="flex-1">
                  <h4 className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    {phase.name}
                  </h4>
                  {phase.description && (
                    <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary}`}>
                      {phase.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setEditingPhase(phase)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  {!phase.isDefault && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleDelete(phase.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

