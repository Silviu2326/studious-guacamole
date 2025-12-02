// Componente DocumentViewer - Visualizador de documentos
import React from 'react';
import { Document } from '../types';
import { Card, Button } from '../../../components/componentsreutilizables';
import { 
  CheckCircle2, 
  Download, 
  Clock, 
  User, 
  FileText as FileTextIcon,
  AlertTriangle,
  Eye
} from 'lucide-react';

interface DocumentViewerProps {
  document: Document | null;
  onAcknowledge: (docId: string, versionId: string) => void;
  hasAcknowledged: boolean;
}

export const DocumentViewer: React.FC<DocumentViewerProps> = ({
  document,
  onAcknowledge,
  hasAcknowledged
}) => {
  if (!document) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Eye size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona un documento</h3>
        <p className="text-gray-600 mb-4">Selecciona un documento de la lista para ver su contenido</p>
      </Card>
    );
  }

  const handleView = () => {
    // En producción, aquí se abriría el documento
    if (document.fileUrl) {
      window.open(document.fileUrl, '_blank');
    }
  };

  const handleDownload = () => {
    if (document.fileUrl) {
      const link = window.document.createElement('a');
      link.href = document.fileUrl;
      link.download = document.title;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
  };

  const handleAcknowledge = () => {
    onAcknowledge(document.docId, `v${document.version}`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-blue-100 rounded-xl ring-1 ring-blue-200/70">
                <FileTextIcon size={20} className="text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {document.title}
                </h2>
                <p className="text-sm text-gray-600">
                  Categoría: {document.category.name}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-sm text-gray-600">
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Versión {document.version}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="w-4 h-4" />
                Actualizado {new Date(document.lastUpdatedAt).toLocaleDateString('es-ES')}
              </span>
              {document.createdBy && (
                <span className="flex items-center gap-1">
                  <User className="w-4 h-4" />
                  {document.createdBy.name}
                </span>
              )}
            </div>
          </div>

          {document.version > 1 && (
            <div className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-semibold">
              v{document.version}
            </div>
          )}
        </div>
      </Card>

      {/* Actions */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex flex-col gap-4">
          {document.fileUrl ? (
            <div className="flex items-center gap-2">
              <Button
                variant="primary"
                onClick={handleView}
                leftIcon={<Eye size={20} />}
              >
                Ver Documento
              </Button>
              <Button
                variant="secondary"
                onClick={handleDownload}
                leftIcon={<Download size={20} />}
              >
                Descargar
              </Button>
            </div>
          ) : (
            <div className="px-4 py-3 bg-blue-50 rounded-lg flex items-center gap-2">
              <FileTextIcon className="w-5 h-5 text-blue-600" />
              <span className="text-blue-700 font-medium">
                Documento en formato {document.documentType?.toUpperCase()}
              </span>
            </div>
          )}

          {document.isRequired && !hasAcknowledged && (
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 pt-3 border-t border-gray-100">
              <div className="flex items-center gap-2 px-4 py-2 bg-yellow-100 rounded-lg">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <span className="text-yellow-700 text-sm font-semibold">
                  Lectura Obligatoria
                </span>
              </div>
              <Button
                variant="primary"
                onClick={handleAcknowledge}
                leftIcon={<CheckCircle2 size={20} />}
              >
                Confirmar Lectura
              </Button>
            </div>
          )}

          {hasAcknowledged && (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-100 rounded-lg">
              <CheckCircle2 className="w-5 h-5 text-green-600" />
              <span className="text-green-700 font-semibold">
                Confirmado
              </span>
            </div>
          )}
        </div>
      </Card>

      {/* Content Preview */}
      {document.content && (
        <Card className="p-4 bg-white shadow-sm">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Vista Previa
          </h3>
          <div className="prose max-w-none">
            <div dangerouslySetInnerHTML={{ __html: document.content }} />
          </div>
        </Card>
      )}

      {/* Requirements */}
      {document.requiredFor && document.requiredFor.length > 0 && (
        <Card className="p-4 bg-blue-50 ring-1 ring-blue-200">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-blue-600 mt-0.5" />
            <div>
              <h4 className="text-blue-900 font-semibold mb-1">
                Documento Obligatorio Para:
              </h4>
              <div className="flex flex-wrap gap-2">
                {document.requiredFor.map((role) => (
                  <span
                    key={role}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium"
                  >
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};
