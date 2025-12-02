import React, { useState, useEffect } from 'react';
import { Policy, PolicyVersion } from '../types';
import { Button, Textarea, Card } from '../../../components/componentsreutilizables';
import { Save, Eye } from 'lucide-react';

interface PolicyEditorProps {
  policy: Policy | null;
  currentVersion: PolicyVersion | null;
  onSave: (content: string, requireReAcceptance: boolean) => Promise<void>;
  loading?: boolean;
}

const PolicyEditor: React.FC<PolicyEditorProps> = ({
  policy,
  currentVersion,
  onSave,
  loading = false,
}) => {
  const [content, setContent] = useState('');
  const [requireReAcceptance, setRequireReAcceptance] = useState(false);
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    if (currentVersion?.content) {
      setContent(currentVersion.content);
    } else {
      setContent('');
    }
  }, [currentVersion]);

  const handleSave = async () => {
    try {
      await onSave(content, requireReAcceptance);
    } catch (error) {
      console.error('Error al guardar:', error);
    }
  };

  const handlePreview = () => {
    setPreview(!preview);
  };

  return (
    <div className="space-y-6">
      {/* Info header */}
      {policy && (
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              {policy.title}
            </h3>
            {currentVersion && (
              <p className="text-sm text-gray-600">
                Editando versión {currentVersion.versionNumber}
              </p>
            )}
          </div>
        </Card>
      )}

      {/* Editor */}
      <Card className="bg-white shadow-sm">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-slate-700">
              Contenido de la política
            </label>
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreview}
              leftIcon={<Eye size={18} />}
            >
              {preview ? 'Editar' : 'Vista previa'}
            </Button>
          </div>

          {preview ? (
            <div
              className="prose max-w-none p-4 ring-1 ring-slate-200 rounded-xl bg-white"
              dangerouslySetInnerHTML={{ __html: content || '<p class="text-gray-400">Sin contenido</p>' }}
            />
          ) : (
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={20}
              placeholder="Escribe el contenido de la política aquí. Puedes usar HTML básico para formatear el texto."
              className="font-mono text-sm"
            />
          )}
        </div>
      </Card>

      {/* Options */}
      <Card className="bg-white shadow-sm">
        <div className="space-y-4">
          <label className="flex items-start gap-3 cursor-pointer">
            <input
              type="checkbox"
              checked={requireReAcceptance}
              onChange={(e) => setRequireReAcceptance(e.target.checked)}
              className="mt-1 w-4 h-4 text-blue-600 border-slate-300 rounded focus:ring-2 focus:ring-blue-400 bg-white"
            />
            <div>
              <div className="text-sm font-semibold text-gray-900 mb-1">
                Requerir aceptación de todos los socios
              </div>
              <p className="text-sm text-gray-600">
                Los socios deberán aceptar esta nueva versión la próxima vez que inicien sesión
              </p>
            </div>
          </label>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex justify-end gap-3">
        <Button
          variant="primary"
          onClick={handleSave}
          loading={loading}
          disabled={!content.trim()}
          leftIcon={<Save size={20} className="mr-2" />}
        >
          Guardar y Publicar Nueva Versión
        </Button>
      </div>
    </div>
  );
};

export default PolicyEditor;

