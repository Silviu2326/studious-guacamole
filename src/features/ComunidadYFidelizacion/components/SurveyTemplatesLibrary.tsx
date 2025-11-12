import { useState } from 'react';
import { FileText, Users, Send, Edit2, Check, X, Star, TrendingUp, Calendar, Award } from 'lucide-react';
import { Card, Badge, Button, Modal, Select, Input, Textarea } from '../../../components/componentsreutilizables';
import { SurveyTemplate, SurveyTemplateType } from '../types';

interface SurveyTemplatesLibraryProps {
  templates: SurveyTemplate[];
  clients: Client[];
  loading?: boolean;
  onSendSurvey?: (survey: SurveyToSend) => void;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
}

export interface SurveyToSend {
  templateId: string;
  clientIds: string[];
  customQuestions?: string[];
  channel: 'whatsapp' | 'email' | 'both';
}

export function SurveyTemplatesLibrary({
  templates,
  clients,
  loading,
  onSendSurvey,
}: SurveyTemplatesLibraryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<SurveyTemplate | null>(null);
  const [selectedClients, setSelectedClients] = useState<string[]>([]);
  const [customQuestions, setCustomQuestions] = useState<string[]>([]);
  const [channel, setChannel] = useState<'whatsapp' | 'email' | 'both'>('both');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCustomizing, setIsCustomizing] = useState(false);

  const handleSelectTemplate = (template: SurveyTemplate) => {
    setSelectedTemplate(template);
    setCustomQuestions(template.defaultQuestions || []);
    setIsModalOpen(true);
  };

  const handleToggleClient = (clientId: string) => {
    setSelectedClients((prev) =>
      prev.includes(clientId) ? prev.filter((id) => id !== clientId) : [...prev, clientId],
    );
  };

  const handleSelectAllClients = () => {
    if (selectedClients.length === clients.length) {
      setSelectedClients([]);
    } else {
      setSelectedClients(clients.map((c) => c.id));
    }
  };

  const handleAddCustomQuestion = () => {
    setCustomQuestions([...customQuestions, '']);
  };

  const handleUpdateCustomQuestion = (index: number, value: string) => {
    const updated = [...customQuestions];
    updated[index] = value;
    setCustomQuestions(updated);
  };

  const handleRemoveCustomQuestion = (index: number) => {
    setCustomQuestions(customQuestions.filter((_, i) => i !== index));
  };

  const handleSend = () => {
    if (!selectedTemplate || selectedClients.length === 0) return;

    const survey: SurveyToSend = {
      templateId: selectedTemplate.id,
      clientIds: selectedClients,
      customQuestions: isCustomizing && customQuestions.length > 0 ? customQuestions : undefined,
      channel,
    };

    if (onSendSurvey) {
      onSendSurvey(survey);
    }

    // Reset state
    setIsModalOpen(false);
    setSelectedTemplate(null);
    setSelectedClients([]);
    setCustomQuestions([]);
    setIsCustomizing(false);
  };

  const getTemplateIcon = (type: SurveyTemplateType) => {
    switch (type) {
      case 'post-session':
        return <Star className="w-5 h-5" />;
      case 'monthly-progress':
        return <TrendingUp className="w-5 h-5" />;
      case 'program-satisfaction':
        return <Award className="w-5 h-5" />;
      case 'quarterly-nps':
        return <Calendar className="w-5 h-5" />;
      default:
        return <FileText className="w-5 h-5" />;
    }
  };

  const getTemplateColor = (type: SurveyTemplateType) => {
    switch (type) {
      case 'post-session':
        return 'bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-300';
      case 'monthly-progress':
        return 'bg-purple-100 text-purple-600 dark:bg-purple-900/30 dark:text-purple-300';
      case 'program-satisfaction':
        return 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-300';
      case 'quarterly-nps':
        return 'bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-300';
      default:
        return 'bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300';
    }
  };

  return (
    <>
      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Plantillas de Encuestas Listas para Usar
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
              Selecciona una plantilla, elige los clientes y envía. Personaliza las preguntas opcionalmente.
            </p>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            <>
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
              ))}
            </>
          ) : templates.length === 0 ? (
            <div className="col-span-2 py-12 text-center">
              <FileText className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No hay plantillas disponibles.</p>
            </div>
          ) : (
            templates.map((template) => (
              <div
                key={template.id}
                className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-gradient-to-br from-white to-slate-50 dark:from-slate-800 dark:to-slate-900 hover:shadow-md transition-all cursor-pointer"
                onClick={() => handleSelectTemplate(template)}
              >
                <div className="flex items-start gap-3">
                  <div className={`p-2 rounded-lg ${getTemplateColor(template.type)}`}>
                    {getTemplateIcon(template.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-slate-900 dark:text-slate-100">{template.name}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                      {template.description}
                    </p>
                    <div className="mt-3 flex items-center gap-2 flex-wrap">
                      <Badge variant="secondary" size="sm">
                        {template.defaultQuestions?.length || 0} preguntas
                      </Badge>
                      <Badge variant="blue" size="sm">
                        {template.estimatedTime} min
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </Card>

      {/* Modal de envío de encuesta */}
      <Modal
        isOpen={isModalOpen && selectedTemplate !== null}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedTemplate(null);
          setSelectedClients([]);
          setCustomQuestions([]);
          setIsCustomizing(false);
        }}
        title={`Enviar encuesta: ${selectedTemplate?.name}`}
        size="lg"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => {
                setIsModalOpen(false);
                setSelectedTemplate(null);
                setSelectedClients([]);
                setCustomQuestions([]);
                setIsCustomizing(false);
              }}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSend}
              disabled={selectedClients.length === 0}
              leftIcon={<Send className="w-4 h-4" />}
            >
              Enviar a {selectedClients.length} cliente{selectedClients.length !== 1 ? 's' : ''}
            </Button>
          </>
        }
      >
        {selectedTemplate && (
          <div className="space-y-6">
            {/* Información de la plantilla */}
            <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg ${getTemplateColor(selectedTemplate.type)}`}>
                  {getTemplateIcon(selectedTemplate.type)}
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-slate-900 dark:text-slate-100">{selectedTemplate.name}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{selectedTemplate.description}</p>
                </div>
              </div>
            </div>

            {/* Selección de clientes */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Seleccionar clientes
                </label>
                <Button variant="ghost" size="sm" onClick={handleSelectAllClients}>
                  {selectedClients.length === clients.length ? 'Deseleccionar todos' : 'Seleccionar todos'}
                </Button>
              </div>
              <div className="max-h-64 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-700 divide-y divide-slate-200 dark:divide-slate-700">
                {clients.map((client) => (
                  <label
                    key={client.id}
                    className="flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={selectedClients.includes(client.id)}
                      onChange={() => handleToggleClient(client.id)}
                      className="w-4 h-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-800"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900 dark:text-slate-100">{client.name}</p>
                      {client.email && (
                        <p className="text-xs text-slate-500 dark:text-slate-400">{client.email}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
              {selectedClients.length > 0 && (
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                  {selectedClients.length} cliente{selectedClients.length !== 1 ? 's' : ''} seleccionado
                  {selectedClients.length !== 1 ? 's' : ''}
                </p>
              )}
            </div>

            {/* Canal de envío */}
            <div>
              <label className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 block">
                Canal de envío
              </label>
              <Select
                value={channel}
                onChange={(e) => setChannel(e.target.value as 'whatsapp' | 'email' | 'both')}
                options={[
                  { label: 'WhatsApp y Email', value: 'both' },
                  { label: 'WhatsApp', value: 'whatsapp' },
                  { label: 'Email', value: 'email' },
                ]}
              />
            </div>

            {/* Personalización opcional */}
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <label className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Personalizar preguntas
                  </label>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Opcional: Modifica o añade preguntas personalizadas
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  leftIcon={isCustomizing ? <X className="w-4 h-4" /> : <Edit2 className="w-4 h-4" />}
                  onClick={() => {
                    setIsCustomizing(!isCustomizing);
                    if (!isCustomizing && selectedTemplate.defaultQuestions) {
                      setCustomQuestions([...selectedTemplate.defaultQuestions]);
                    }
                  }}
                >
                  {isCustomizing ? 'Cancelar' : 'Personalizar'}
                </Button>
              </div>

              {isCustomizing && (
                <div className="space-y-3">
                  {customQuestions.map((question, index) => (
                    <div key={index} className="flex items-start gap-2">
                      <Textarea
                        value={question}
                        onChange={(e) => handleUpdateCustomQuestion(index, e.target.value)}
                        rows={2}
                        placeholder={`Pregunta ${index + 1}`}
                        className="flex-1"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveCustomQuestion(index)}
                        className="text-rose-500 hover:text-rose-600"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={handleAddCustomQuestion}
                    leftIcon={<Check className="w-4 h-4" />}
                  >
                    Añadir pregunta
                  </Button>
                </div>
              )}

              {!isCustomizing && selectedTemplate.defaultQuestions && (
                <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-3 bg-slate-50 dark:bg-slate-800/50">
                  <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 mb-2">
                    Preguntas por defecto:
                  </p>
                  <ul className="space-y-1">
                    {selectedTemplate.defaultQuestions.map((question, index) => (
                      <li key={index} className="text-sm text-slate-600 dark:text-slate-300">
                        {index + 1}. {question}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

