import React, { useEffect, useState, useRef } from 'react';
import { Clock, Eye, RotateCcw, AlertCircle, Check } from 'lucide-react';
import { Modal } from '../../../../components/componentsreutilizables/Modal';
import { Button } from '../../../../components/componentsreutilizables/Button';
import { VersioningService, Version } from '../../services/VersioningService';
import { useProgramContext } from '../../context/ProgramContext';
import { useUIContext } from '../../context/UIContext';
import { Day } from '../../types/training';

export const VersionHistoryModal: React.FC = () => {
  const { isVersionHistoryOpen, setVersionHistoryOpen } = useUIContext();
  const { daysData, setProgramData, saveCurrentVersion } = useProgramContext();
  const [versions, setVersions] = useState<Version[]>([]);
  const [previewingId, setPreviewingId] = useState<string | null>(null);
  const originalDataRef = useRef<Day[] | null>(null);

  useEffect(() => {
    if (isVersionHistoryOpen) {
      // Load versions
      setVersions(VersioningService.getVersions());
      // Backup current state
      originalDataRef.current = JSON.parse(JSON.stringify(daysData));
      setPreviewingId(null);
    } else {
      // Reset when closed (cleanup if needed)
      originalDataRef.current = null;
    }
  }, [isVersionHistoryOpen]);

  const handlePreview = (version: Version) => {
    setProgramData(version.data);
    setPreviewingId(version.id);
  };

  const handleRestore = (version: Version) => {
    // 1. Set the data
    setProgramData(version.data);
    // 2. Save as a new version
    saveCurrentVersion(`Restaurado desde ${version.label}`);
    // 3. Close modal
    setVersionHistoryOpen(false);
  };

  const handleClose = () => {
    // If we were previewing, revert to original state
    if (previewingId && originalDataRef.current) {
      setProgramData(originalDataRef.current);
    }
    setVersionHistoryOpen(false);
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <Modal
      isOpen={isVersionHistoryOpen}
      onClose={handleClose}
      title="Historial de Versiones"
      size="lg"
      footer={
        <Button variant="secondary" onClick={handleClose}>
          Cerrar
        </Button>
      }
    >
      <div className="p-4 max-h-[60vh] overflow-y-auto">
        {versions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Clock className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>No hay versiones guardadas aún.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {versions.map((version) => (
              <div 
                key={version.id} 
                className={`
                  flex items-center justify-between p-4 rounded-lg border transition-all
                  ${previewingId === version.id 
                    ? 'bg-blue-50 border-blue-300 ring-1 ring-blue-200' 
                    : 'bg-white border-gray-200 hover:border-gray-300'
                  }
                `}
              >
                <div className="flex items-start gap-3">
                  <div className={`mt-1 p-2 rounded-full ${previewingId === version.id ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>
                    <Clock size={18} />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{version.label}</h4>
                    <p className="text-sm text-gray-500 flex items-center gap-2">
                      {formatDate(version.timestamp)}
                      {version.metadata?.author && (
                        <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600">
                          {version.metadata.author}
                        </span>
                      )}
                    </p>
                    {version.metadata?.changes && (
                      <p className="text-xs text-gray-400 mt-1">
                        {version.metadata.changes.join(', ')}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {previewingId === version.id ? (
                     <span className="flex items-center gap-1 text-xs font-medium text-blue-600 bg-blue-100 px-2 py-1 rounded mr-2">
                       <Eye size={12} /> Visualizando
                     </span>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handlePreview(version)}
                      className="text-gray-600 hover:text-blue-600"
                    >
                      <Eye size={16} className="mr-1" />
                      Previsualizar
                    </Button>
                  )}
                  
                  <Button 
                    variant={previewingId === version.id ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => handleRestore(version)}
                  >
                    <RotateCcw size={16} className="mr-1" />
                    Restaurar
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};
