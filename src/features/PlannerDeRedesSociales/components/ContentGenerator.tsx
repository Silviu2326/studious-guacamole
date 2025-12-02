import React, { useState, useEffect } from 'react';
import {
  ContentTemplate,
  GeneratedContent,
  ContentVariable,
  generateContentFromTemplate,
  getContentTemplates,
  SocialPlatform,
  getPlatformIcon
} from '../api/social';
import { ClientTransformation, getClientTransformations } from '../api/social';
import { Card, Button, Modal, Select } from '../../../components/componentsreutilizables';
import {
  Sparkles,
  Plus,
  RefreshCw,
  Eye,
  Save,
  Calendar,
  X,
  CheckCircle2
} from 'lucide-react';

interface ContentGeneratorProps {
  onContentGenerated?: (content: GeneratedContent) => void;
}

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({
  onContentGenerated
}) => {
  const [templates, setTemplates] = useState<ContentTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<ContentTemplate | null>(null);
  const [variables, setVariables] = useState<Record<string, string>>({});
  const [selectedPlatform, setSelectedPlatform] = useState<SocialPlatform>('instagram');
  const [generatedContent, setGeneratedContent] = useState<GeneratedContent | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [clientTransformations, setClientTransformations] = useState<ClientTransformation[]>([]);
  const [selectedClient, setSelectedClient] = useState<string>('');

  useEffect(() => {
    loadTemplates();
    loadClientTransformations();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      // Inicializar variables con valores por defecto
      const initialVars: Record<string, string> = {};
      selectedTemplate.variables.forEach(variable => {
        if (variable.defaultValue) {
          initialVars[variable.key] = variable.defaultValue;
        } else {
          initialVars[variable.key] = '';
        }
      });
      setVariables(initialVars);
      setGeneratedContent(null);
    }
  }, [selectedTemplate]);

  useEffect(() => {
    if (selectedClient && selectedTemplate) {
      const client = clientTransformations.find(c => c.id === selectedClient);
      if (client) {
        setVariables(prev => ({
          ...prev,
          cliente: client.clientName,
          tiempo: client.duration,
          resultados: client.results.join('\n• '),
          testimonial: client.testimonial || ''
        }));
      }
    }
  }, [selectedClient, selectedTemplate, clientTransformations]);

  const loadTemplates = async () => {
    try {
      const data = await getContentTemplates();
      setTemplates(data);
    } catch (err) {
      console.error('Error loading templates:', err);
    }
  };

  const loadClientTransformations = async () => {
    try {
      const data = await getClientTransformations();
      setClientTransformations(data);
    } catch (err) {
      console.error('Error loading transformations:', err);
    }
  };

  const handleGenerate = async () => {
    if (!selectedTemplate) return;
    
    setIsGenerating(true);
    try {
      const generated = await generateContentFromTemplate(
        selectedTemplate.id,
        variables,
        selectedPlatform
      );
      setGeneratedContent(generated);
    } catch (err: any) {
      alert('Error al generar contenido: ' + err.message);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (generatedContent) {
      onContentGenerated?.(generatedContent);
      // Reset
      setSelectedTemplate(null);
      setVariables({});
      setGeneratedContent(null);
      setIsPreviewOpen(false);
    }
  };

  const renderVariableInput = (variable: ContentVariable) => {
    if (variable.type === 'client' && variable.key === 'cliente') {
      return (
        <Select
          label={variable.label}
          value={selectedClient}
          onChange={(e) => {
            setSelectedClient(e.target.value);
            const client = clientTransformations.find(c => c.id === e.target.value);
            if (client) {
              setVariables(prev => ({ ...prev, [variable.key]: client.clientName }));
            }
          }}
          options={[
            { value: '', label: 'Seleccionar cliente...' },
            ...clientTransformations.map(c => ({
              value: c.id,
              label: c.clientName
            }))
          ]}
        />
      );
    }

    if (variable.type === 'date') {
      return (
        <input
          type="date"
          value={variables[variable.key] || ''}
          onChange={(e) => setVariables(prev => ({ ...prev, [variable.key]: e.target.value }))}
          className="w-full rounded-xl bg-white text-gray-900 placeholder-gray-400 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
        />
      );
    }

    if (variable.options) {
      return (
        <Select
          label={variable.label}
          value={variables[variable.key] || ''}
          onChange={(e) => setVariables(prev => ({ ...prev, [variable.key]: e.target.value }))}
          options={[
            { value: '', label: 'Seleccionar...' },
            ...variable.options.map(opt => ({ value: opt, label: opt }))
          ]}
        />
      );
    }

    return (
      <textarea
        value={variables[variable.key] || ''}
        onChange={(e) => setVariables(prev => ({ ...prev, [variable.key]: e.target.value }))}
        placeholder={`Ingresa ${variable.label.toLowerCase()}`}
        rows={variable.key === 'resultados' || variable.key === 'explicacion' ? 4 : 2}
        className="w-full rounded-xl bg-white text-gray-900 placeholder-gray-400 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
      />
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sparkles size={24} className="text-purple-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Generador Automático de Contenido</h3>
            <p className="text-sm text-gray-600">Genera contenido desde plantillas con variables dinámicas</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Selección de Plantilla */}
        <Card className="p-6 bg-white shadow-sm ring-1 ring-gray-200">
          <h4 className="font-semibold text-gray-900 mb-4">1. Selecciona una Plantilla</h4>
          <div className="space-y-3">
            {templates.map((template) => (
              <Card
                key={template.id}
                variant="hover"
                className={`p-4 cursor-pointer transition-all ${
                  selectedTemplate?.id === template.id
                    ? 'ring-2 ring-blue-500 bg-blue-50'
                    : 'ring-1 ring-gray-200 hover:ring-blue-400'
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900 mb-1">{template.name}</h5>
                    <p className="text-sm text-gray-600 mb-2">{template.description}</p>
                    <div className="flex flex-wrap gap-1">
                      {template.platforms.map(platform => (
                        <span key={platform} className="text-lg">
                          {getPlatformIcon(platform)}
                        </span>
                      ))}
                    </div>
                  </div>
                  {selectedTemplate?.id === template.id && (
                    <CheckCircle2 size={20} className="text-blue-600" />
                  )}
                </div>
              </Card>
            ))}
          </div>
        </Card>

        {/* Variables y Generación */}
        {selectedTemplate && (
          <Card className="p-6 bg-white shadow-sm ring-1 ring-gray-200">
            <h4 className="font-semibold text-gray-900 mb-4">2. Completa las Variables</h4>
            
            <div className="space-y-4 mb-4">
              {selectedTemplate.variables.map((variable) => (
                <div key={variable.key}>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {variable.label}
                  </label>
                  {renderVariableInput(variable)}
                </div>
              ))}
            </div>

            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Plataforma
              </label>
              <div className="flex gap-2">
                {selectedTemplate.platforms.map((platform) => (
                  <button
                    key={platform}
                    onClick={() => setSelectedPlatform(platform)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                      selectedPlatform === platform
                        ? 'bg-blue-100 text-blue-700 ring-1 ring-blue-200'
                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                    }`}
                  >
                    <span className="text-lg">{getPlatformIcon(platform)}</span>
                    <span className="capitalize">{platform}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                onClick={handleGenerate}
                loading={isGenerating}
                leftIcon={<Sparkles size={18} />}
                className="flex-1"
                disabled={!Object.values(variables).some(v => v.trim() !== '')}
              >
                Generar Contenido
              </Button>
              {generatedContent && (
                <Button
                  onClick={() => setIsPreviewOpen(true)}
                  variant="secondary"
                  leftIcon={<Eye size={18} />}
                >
                  Vista Previa
                </Button>
              )}
            </div>
          </Card>
        )}
      </div>

      {/* Contenido Generado */}
      {generatedContent && (
        <Card className="p-6 bg-white shadow-sm ring-1 ring-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h4 className="font-semibold text-gray-900">Contenido Generado</h4>
            <div className="flex items-center gap-2">
              <span className="text-lg">{getPlatformIcon(generatedContent.platform)}</span>
              <span className="text-sm text-gray-600 capitalize">{generatedContent.platform}</span>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <pre className="whitespace-pre-wrap text-sm text-gray-900 font-sans">
              {generatedContent.content}
            </pre>
          </div>

          {generatedContent.hashtags.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Hashtags sugeridos:</p>
              <div className="flex flex-wrap gap-2">
                {generatedContent.hashtags.map((tag, idx) => (
                  <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleSave}
              leftIcon={<Save size={18} />}
              className="flex-1"
            >
              Guardar como Borrador
            </Button>
            <Button
              onClick={() => {
                setGeneratedContent({ ...generatedContent, status: 'scheduled' });
                handleSave();
              }}
              variant="secondary"
              leftIcon={<Calendar size={18} />}
            >
              Programar Publicación
            </Button>
          </div>
        </Card>
      )}

      {/* Modal de Vista Previa */}
      {isPreviewOpen && generatedContent && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title="Vista Previa del Contenido"
          size="lg"
        >
          <div className="space-y-4">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{getPlatformIcon(generatedContent.platform)}</span>
              <span className="font-semibold text-gray-900 capitalize">{generatedContent.platform}</span>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <pre className="whitespace-pre-wrap text-sm text-gray-900 font-sans">
                {generatedContent.content}
              </pre>
            </div>

            {generatedContent.hashtags.length > 0 && (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-2">Hashtags:</p>
                <div className="flex flex-wrap gap-2">
                  {generatedContent.hashtags.map((tag, idx) => (
                    <span key={idx} className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button variant="secondary" onClick={() => setIsPreviewOpen(false)}>
                Cerrar
              </Button>
              <Button onClick={handleSave} leftIcon={<Save size={18} />}>
                Guardar
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {!selectedTemplate && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Sparkles size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Selecciona una plantilla</h3>
          <p className="text-gray-600">Elige una plantilla para comenzar a generar contenido</p>
        </Card>
      )}
    </div>
  );
};

