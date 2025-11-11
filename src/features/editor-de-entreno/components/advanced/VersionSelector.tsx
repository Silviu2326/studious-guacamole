import React, { useState } from 'react';
import { Modal } from '../../../../components/componentsreutilizables';
import { AutosaveVersioning, Version } from './AutosaveVersioning';
import { Clock, RotateCcw, Trash2 } from 'lucide-react';
import { PlanificacionSemana } from '../../types/advanced';

interface VersionSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onRestore: (planificacion: PlanificacionSemana) => void;
}

export const VersionSelector: React.FC<VersionSelectorProps> = ({
  isOpen,
  onClose,
  onRestore,
}) => {
  const [versions] = useState<Version[]>(() => AutosaveVersioning.getRecentVersions(20));

  const handleRestore = (version: Version) => {
    if (window.confirm(`¿Restaurar versión "${version.label}"?`)) {
      const restored = AutosaveVersioning.restoreVersion(version.id);
      if (restored) {
        onRestore(restored);
        onClose();
      }
    }
  };

  const handleDelete = (versionId: string) => {
    if (window.confirm('¿Eliminar esta versión?')) {
      AutosaveVersioning.deleteVersion(versionId);
      // Force re-render
      window.location.reload();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Versiones Guardadas" size="lg">
      <div className="space-y-2 max-h-96 overflow-y-auto">
        {versions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No hay versiones guardadas</p>
          </div>
        ) : (
          versions.map((version) => (
            <div
              key={version.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <Clock className="w-4 h-4 text-gray-400" />
                <div className="flex-1">
                  <div className="font-medium text-gray-900">{version.label}</div>
                  <div className="text-xs text-gray-500">
                    {version.timestamp.toLocaleString('es-ES', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  {version.metadata?.action && (
                    <div className="text-xs text-gray-400 mt-1">
                      Acción: {version.metadata.action}
                      {version.metadata.usuario && ` por ${version.metadata.usuario}`}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleRestore(version)}
                  className="p-2 hover:bg-blue-100 rounded-lg text-blue-600 transition-colors"
                  title="Restaurar versión"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(version.id)}
                  className="p-2 hover:bg-red-100 rounded-lg text-red-600 transition-colors"
                  title="Eliminar versión"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </Modal>
  );
};











