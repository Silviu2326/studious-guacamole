// Componente DocumentList - Lista de documentos
import React from 'react';
import { Document } from '../types';
import { Card } from '../../../components/componentsreutilizables';
import { FileText, CheckCircle2, AlertCircle, Archive, Loader2 } from 'lucide-react';

interface DocumentListProps {
  documents: Document[];
  onSelectDocument: (docId: string) => void;
  isLoading?: boolean;
}

export const DocumentList: React.FC<DocumentListProps> = ({
  documents,
  onSelectDocument,
  isLoading = false
}) => {
  if (isLoading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  if (documents.length === 0) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <FileText size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay documentos disponibles</h3>
        <p className="text-gray-600 mb-4">Comienza agregando tu primer documento</p>
      </Card>
    );
  }

  const getStatusIcon = (doc: Document) => {
    if (doc.status === 'archived') {
      return <Archive className="w-5 h-5 text-gray-400" />;
    }
    if (doc.hasAcknowledged) {
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
    }
    if (doc.isRequired) {
      return <AlertCircle className="w-5 h-5 text-orange-500" />;
    }
    return <FileText className="w-5 h-5 text-blue-500" />;
  };

  const getStatusBadge = (doc: Document) => {
    const classes = "px-2 py-1 rounded-lg text-xs font-semibold";
    if (doc.hasAcknowledged) {
      return <span className={`${classes} bg-green-100 text-green-700`}>Confirmado</span>;
    }
    if (doc.isRequired) {
      return <span className={`${classes} bg-orange-100 text-orange-700`}>Requerido</span>;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {documents.map((doc) => (
        <Card
          key={doc.docId}
          variant="hover"
          className="h-full flex flex-col transition-shadow overflow-hidden cursor-pointer"
          onClick={() => onSelectDocument(doc.docId)}
        >
          <div className="p-4 flex items-start gap-4">
            {/* Icon */}
            <div className="flex-shrink-0 mt-1">
              {getStatusIcon(doc)}
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4 mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {doc.title}
                </h3>
                <div className="flex items-center gap-2 flex-shrink-0">
                  {getStatusBadge(doc)}
                  {doc.version > 1 && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-lg text-xs font-semibold">
                      v{doc.version}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                <span className="flex items-center gap-1">
                  <span className="inline-block w-2 h-2 rounded-full bg-blue-600"></span>
                  {doc.category.name}
                </span>
                <span>
                  Última actualización: {new Date(doc.lastUpdatedAt).toLocaleDateString('es-ES')}
                </span>
              </div>

              {doc.createdBy && (
                <p className="text-xs text-gray-500">
                  Creado por {doc.createdBy.name}
                </p>
              )}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
