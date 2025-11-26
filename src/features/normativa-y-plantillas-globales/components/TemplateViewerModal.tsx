// TemplateViewerModal - Presentational
import React from 'react';
import { GlobalTemplate, TemplateType } from '../types';
import { Modal, Badge } from '../../../components/componentsreutilizables';
import { FileText, CheckCircle2, AlertCircle, User } from 'lucide-react';

interface TemplateViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
  template: GlobalTemplate | null;
}

export const TemplateViewerModal: React.FC<TemplateViewerModalProps> = ({
  isOpen,
  onClose,
  template
}) => {
  if (!template) return null;

  const getTypeLabel = (type: TemplateType): string => {
    const labels: Record<TemplateType, string> = {
      'CONTRACT': 'Contrato',
      'POLICY': 'Política',
      'WORKOUT_PLAN': 'Plan Entrenamiento',
      'NUTRITION_GUIDE': 'Guía Nutricional',
      'EMAIL': 'Email',
      'PROTOCOL': 'Protocolo',
      'REGULATION': 'Reglamento'
    };
    return labels[type];
  };

  const renderContent = () => {
    if (typeof template.content === 'string') {
      return <pre className="whitespace-pre-wrap text-sm text-slate-700">{template.content}</pre>;
    }
    
    return (
      <pre className="bg-slate-50 p-4 rounded-xl overflow-auto ring-1 ring-slate-200 text-slate-700">
        {JSON.stringify(template.content, null, 2)}
      </pre>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={template.name}
      size="xl"
    >
      <div className="space-y-4">
        {/* Metadata */}
        <div className="grid grid-cols-2 gap-4 p-4 bg-slate-50 rounded-xl ring-1 ring-slate-200">
          <div>
            <p className="text-xs text-slate-500 mb-1">Tipo</p>
            <p className="font-medium text-slate-900">{getTypeLabel(template.type)}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Versión</p>
            <p className="font-medium text-slate-900">v{template.version}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Estado</p>
            <Badge variant={
              template.status === 'PUBLISHED' ? 'green' :
              template.status === 'DRAFT' ? 'gray' :
              'red'
            }>
              {template.status}
            </Badge>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Obligatoria</p>
            {template.isMandatory ? (
              <CheckCircle2 className="w-5 h-5 text-green-600" />
            ) : (
              <span className="text-slate-400">—</span>
            )}
          </div>
        </div>

        {/* Description */}
        {template.description && (
          <div>
            <p className="text-xs text-slate-500 mb-1">Descripción</p>
            <p className="text-sm text-slate-700">{template.description}</p>
          </div>
        )}

        {/* Author */}
        <div className="flex items-center gap-2">
          <User className="w-4 h-4 text-slate-400" />
          <p className="text-sm text-slate-600">
            Creado por <span className="font-medium text-slate-900">{template.createdBy.name}</span>
          </p>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-slate-500 mb-1">Creada</p>
            <p className="text-slate-700">{new Date(template.createdAt).toLocaleString('es-ES')}</p>
          </div>
          <div>
            <p className="text-xs text-slate-500 mb-1">Última Modificación</p>
            <p className="text-slate-700">{new Date(template.lastModified).toLocaleString('es-ES')}</p>
          </div>
        </div>

        {/* Content */}
        <div className="mt-6 pt-6 border-t border-slate-200">
          <div className="flex items-center gap-2 mb-3">
            <FileText className="w-5 h-5 text-slate-600" />
            <p className="font-medium text-slate-900">Contenido</p>
          </div>
          <div className="max-h-96 overflow-auto">
            {renderContent()}
          </div>
        </div>

        {/* Categories */}
        {template.categories && template.categories.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {template.categories.map(cat => (
              <Badge key={cat} variant="gray">
                {cat}
              </Badge>
            ))}
          </div>
        )}
      </div>
    </Modal>
  );
};

