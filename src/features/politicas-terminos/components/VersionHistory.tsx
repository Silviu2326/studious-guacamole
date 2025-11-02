import React from 'react';
import { PolicyVersion } from '../types';
import { Card, Modal, Button } from '../../../components/componentsreutilizables';
import { Eye } from 'lucide-react';

interface VersionHistoryProps {
  versions: PolicyVersion[];
  isOpen: boolean;
  onClose: () => void;
  policyTitle?: string;
}

const VersionHistory: React.FC<VersionHistoryProps> = ({
  versions,
  isOpen,
  onClose,
  policyTitle,
}) => {
  const [selectedVersion, setSelectedVersion] = React.useState<PolicyVersion | null>(null);

  const handleViewVersion = (version: PolicyVersion) => {
    setSelectedVersion(version);
  };

  const handleCloseVersion = () => {
    setSelectedVersion(null);
  };

  const formattedDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={`Historial de Versiones${policyTitle ? ` - ${policyTitle}` : ''}`}
        size="xl"
      >
        <div className="space-y-3 max-h-[600px] overflow-y-auto">
          {versions.map((version) => (
            <Card key={version.id} variant="hover" className="cursor-pointer bg-white shadow-sm" onClick={() => handleViewVersion(version)}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="px-3 py-1 rounded-lg bg-blue-100 text-blue-600 font-bold text-sm">
                    v{version.versionNumber}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {formattedDate(version.effectiveDate)}
                    </div>
                    {version.author && (
                      <div className="text-xs text-gray-600">
                        Por: {version.author}
                      </div>
                    )}
                  </div>
                </div>
                <Eye className="w-5 h-5 text-slate-600" />
              </div>
            </Card>
          ))}
        </div>
      </Modal>

      {/* Version Detail Modal */}
      <Modal
        isOpen={selectedVersion !== null}
        onClose={handleCloseVersion}
        title={`Versión ${selectedVersion?.versionNumber}`}
        size="xl"
        footer={
          <Button variant="secondary" onClick={handleCloseVersion}>
            Cerrar
          </Button>
        }
      >
        {selectedVersion && (
          <div>
            <div className="mb-4 space-y-2">
              <p className="text-sm text-gray-600">
                Fecha de publicación: {formattedDate(selectedVersion.effectiveDate)}
              </p>
              {selectedVersion.author && (
                <p className="text-sm text-gray-600">
                  Autor: {selectedVersion.author}
                </p>
              )}
            </div>
            <div
              className="prose max-w-none p-4 ring-1 ring-slate-200 rounded-xl bg-white max-h-[500px] overflow-y-auto"
              dangerouslySetInnerHTML={{ __html: selectedVersion.content }}
            />
          </div>
        )}
      </Modal>
    </>
  );
};

export default VersionHistory;

