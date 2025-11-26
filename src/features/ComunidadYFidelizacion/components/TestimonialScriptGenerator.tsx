import { useState, useEffect } from 'react';
import { FileText, Sparkles, Download, Copy, Play, Plus, X } from 'lucide-react';
import { Card, Button, Modal, Select, Badge, Textarea, Input } from '../../../components/componentsreutilizables';
import { TestimonialScript, TestimonialScriptObjective, TestimonialScriptFormat } from '../types';
import { CommunityFidelizacionService } from '../services/communityFidelizacionService';
import { useAuth } from '../../../context/AuthContext';

interface TestimonialScriptGeneratorProps {
  testimonialScripts?: TestimonialScript[];
  loading?: boolean;
  onScriptGenerated?: () => void;
}

const OBJECTIVE_OPTIONS: { value: TestimonialScriptObjective; label: string }[] = [
  { value: 'ventas-premium', label: 'Ventas Premium' },
  { value: 'programa-grupal', label: 'Programa Grupal' },
  { value: 'transformacion', label: 'Transformación' },
  { value: 'fidelizacion', label: 'Fidelización' },
  { value: 'referidos', label: 'Referidos' },
  { value: 'personalizado', label: 'Personalizado' },
];

const FORMAT_OPTIONS: { value: TestimonialScriptFormat; label: string }[] = [
  { value: 'video', label: 'Video' },
  { value: 'audio', label: 'Audio' },
  { value: 'texto', label: 'Texto' },
  { value: 'live', label: 'En Vivo' },
];

export function TestimonialScriptGenerator({
  testimonialScripts = [],
  loading,
  onScriptGenerated,
}: TestimonialScriptGeneratorProps) {
  const { user } = useAuth();
  const [isGenerateModalOpen, setIsGenerateModalOpen] = useState(false);
  const [selectedScript, setSelectedScript] = useState<TestimonialScript | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [voiceConfig, setVoiceConfig] = useState<any>(null);

  // Form state
  const [formData, setFormData] = useState({
    objective: 'ventas-premium' as TestimonialScriptObjective,
    format: 'video' as TestimonialScriptFormat,
    clientId: '',
    clientName: '',
    clientObjective: '',
    clientProgress: '',
  });

  useEffect(() => {
    // Cargar configuración de voz
    CommunityFidelizacionService.getCommunityVoiceConfig(user?.id).then(setVoiceConfig).catch(console.error);
  }, [user]);

  const handleGenerateScript = async () => {
    setIsGenerating(true);
    try {
      await CommunityFidelizacionService.generateTestimonialScript({
        objective: formData.objective,
        format: formData.format,
        voiceConfig: voiceConfig || undefined,
        clientContext:
          formData.clientId || formData.clientName
            ? {
                clientId: formData.clientId || undefined,
                clientName: formData.clientName || undefined,
                objective: formData.clientObjective || undefined,
                progress: formData.clientProgress || undefined,
              }
            : undefined,
      });

      // Reset form
      setFormData({
        objective: 'ventas-premium',
        format: 'video',
        clientId: '',
        clientName: '',
        clientObjective: '',
        clientProgress: '',
      });
      setIsGenerateModalOpen(false);
      onScriptGenerated?.();
    } catch (error) {
      console.error('Error generando guión:', error);
      alert('Error al generar el guión. Intenta nuevamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleExportToTeleprompter = async (script: TestimonialScript) => {
    try {
      const teleprompterText = await CommunityFidelizacionService.exportTestimonialScriptToTeleprompter(script.id);
      
      // Crear archivo de texto y descargarlo
      const blob = new Blob([teleprompterText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `guion-testimonio-${script.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exportando guión:', error);
      alert('Error al exportar el guión. Intenta nuevamente.');
    }
  };

  const handleCopyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      alert('Texto copiado al portapapeles');
    } catch (error) {
      console.error('Error copiando texto:', error);
      alert('Error al copiar el texto. Intenta nuevamente.');
    }
  };

  return (
    <>
      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-blue-100 to-cyan-200 dark:from-blue-900/40 dark:to-cyan-900/30 rounded-xl">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Guiones IA para Testimonios
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Genera guiones personalizados con IA para solicitar testimonios en vivo o video, usando tu tono personal
              </p>
            </div>
          </div>
          <Button onClick={() => setIsGenerateModalOpen(true)} className="inline-flex items-center gap-2">
            <Sparkles className="w-4 h-4" />
            Generar guión
          </Button>
        </div>

        {loading ? (
          <div className="space-y-4">
            {Array.from({ length: 2 }).map((_, i) => (
              <div key={i} className="h-32 bg-slate-200/70 dark:bg-slate-700/60 rounded-lg animate-pulse" />
            ))}
          </div>
        ) : testimonialScripts.length === 0 ? (
          <div className="text-center py-12 text-slate-500 dark:text-slate-400">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>No hay guiones generados aún.</p>
            <p className="text-sm mt-2">Genera tu primer guión personalizado con IA.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {testimonialScripts.map((script) => (
              <div
                key={script.id}
                className="rounded-lg border border-slate-200/60 dark:border-slate-800/60 p-5 bg-gradient-to-br from-white via-white to-slate-50 dark:from-slate-900 dark:via-slate-900/95 dark:to-slate-950"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">{script.name}</h4>
                      <Badge variant="blue" size="sm">
                        {OBJECTIVE_OPTIONS.find((o) => o.value === script.objective)?.label}
                      </Badge>
                      <Badge variant="secondary" size="sm">
                        {FORMAT_OPTIONS.find((f) => f.value === script.format)?.label}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">
                      Duración estimada: ~{script.estimatedDuration} min · {new Date(script.createdAt).toLocaleDateString()}
                    </p>
                    {script.keywords.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {script.keywords.slice(0, 3).map((keyword) => (
                          <Badge key={keyword} variant="secondary" size="sm">
                            {keyword}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="mt-4 p-4 rounded-lg bg-blue-50/50 dark:bg-blue-900/20 border border-blue-200/50 dark:border-blue-800/50">
                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Apertura:</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic mb-4">{script.storyArc.opening}</p>

                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2">Preguntas ({script.storyArc.questions.length}):</p>
                  <div className="space-y-2">
                    {script.storyArc.questions.map((question, index) => (
                      <div key={question.id} className="text-sm">
                        <p className="font-medium text-slate-700 dark:text-slate-300">
                          {index + 1}. {question.question}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                          {question.purpose} · ~{question.expectedDuration}s
                        </p>
                      </div>
                    ))}
                  </div>

                  <p className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-2 mt-4">Cierre:</p>
                  <p className="text-sm text-slate-700 dark:text-slate-300 italic">{script.storyArc.closing}</p>
                </div>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => setSelectedScript(script)}
                    className="inline-flex items-center gap-2"
                  >
                    <Play className="w-4 h-4" />
                    Ver completo
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleExportToTeleprompter(script)}
                    className="inline-flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    Exportar
                  </Button>
                  {script.teleprompterText && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleCopyToClipboard(script.teleprompterText!)}
                      className="inline-flex items-center gap-2"
                    >
                      <Copy className="w-4 h-4" />
                      Copiar
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal para generar guión */}
      <Modal
        isOpen={isGenerateModalOpen}
        onClose={() => setIsGenerateModalOpen(false)}
        title="Generar Guión IA para Testimonio"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsGenerateModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleGenerateScript} disabled={isGenerating} className="inline-flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {isGenerating ? 'Generando...' : 'Generar guión'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="p-4 rounded-lg bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-200/50 dark:border-indigo-800/50">
            <p className="text-sm text-indigo-900 dark:text-indigo-100">
              La IA generará un guión personalizado usando tu configuración de voz de comunidad (tono, palabras clave, emojis).
            </p>
          </div>
          <Select
            label="Objetivo del testimonio *"
            value={formData.objective}
            onChange={(value) => setFormData({ ...formData, objective: value as TestimonialScriptObjective })}
            options={OBJECTIVE_OPTIONS}
          />
          <Select
            label="Formato *"
            value={formData.format}
            onChange={(value) => setFormData({ ...formData, format: value as TestimonialScriptFormat })}
            options={FORMAT_OPTIONS}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Nombre del cliente (opcional)"
              value={formData.clientName}
              onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
              placeholder="Ej: María Fernández"
            />
            <Input
              label="ID del cliente (opcional)"
              value={formData.clientId}
              onChange={(e) => setFormData({ ...formData, clientId: e.target.value })}
              placeholder="cliente_001"
            />
          </div>
          <Textarea
            label="Objetivo del cliente (opcional)"
            value={formData.clientObjective}
            onChange={(e) => setFormData({ ...formData, clientObjective: e.target.value })}
            placeholder="Ej: Perder 10kg en 3 meses"
            rows={2}
          />
          <Textarea
            label="Progreso del cliente (opcional)"
            value={formData.clientProgress}
            onChange={(e) => setFormData({ ...formData, clientProgress: e.target.value })}
            placeholder="Ej: Ha perdido 8kg en 2 meses"
            rows={2}
          />
        </div>
      </Modal>

      {/* Modal para ver guión completo */}
      {selectedScript && (
        <ScriptDetailsModal script={selectedScript} onClose={() => setSelectedScript(null)} />
      )}
    </>
  );
}

function ScriptDetailsModal({ script, onClose }: { script: TestimonialScript; onClose: () => void }) {
  const handleExportToTeleprompter = async () => {
    try {
      const teleprompterText = await CommunityFidelizacionService.exportTestimonialScriptToTeleprompter(script.id);
      
      const blob = new Blob([teleprompterText], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `guion-testimonio-${script.name.replace(/\s+/g, '-').toLowerCase()}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exportando guión:', error);
      alert('Error al exportar el guión. Intenta nuevamente.');
    }
  };

  const handleCopyToClipboard = async () => {
    const text = script.teleprompterText || 
      `${script.storyArc.opening}\n\n${script.storyArc.questions.map((q, i) => `${i + 1}. ${q.question}`).join('\n')}\n\n${script.storyArc.closing}`;
    try {
      await navigator.clipboard.writeText(text);
      alert('Guión copiado al portapapeles');
    } catch (error) {
      console.error('Error copiando texto:', error);
      alert('Error al copiar el guión. Intenta nuevamente.');
    }
  };

  return (
    <Modal
      isOpen={!!script}
      onClose={onClose}
      title={script.name}
      size="lg"
      footer={
        <div className="flex gap-2">
          <Button variant="secondary" onClick={handleCopyToClipboard} className="inline-flex items-center gap-2">
            <Copy className="w-4 h-4" />
            Copiar
          </Button>
          <Button onClick={handleExportToTeleprompter} className="inline-flex items-center gap-2">
            <Download className="w-4 h-4" />
            Exportar a teleprompter
          </Button>
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Apertura</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 italic p-3 bg-slate-50 dark:bg-slate-800/50 rounded">
            {script.storyArc.opening}
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
            Preguntas ({script.storyArc.questions.length})
          </p>
          <div className="space-y-4">
            {script.storyArc.questions.map((question, index) => (
              <div key={question.id} className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded">
                <div className="flex items-start justify-between mb-2">
                  <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {index + 1}. {question.question}
                  </p>
                  <Badge variant="secondary" size="sm">
                    ~{question.expectedDuration}s
                  </Badge>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 italic">{question.purpose}</p>
                {question.suggestedFollowUp && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2">
                    <strong>Seguimiento:</strong> {question.suggestedFollowUp}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div>
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Cierre</p>
          <p className="text-sm text-slate-600 dark:text-slate-400 italic p-3 bg-slate-50 dark:bg-slate-800/50 rounded">
            {script.storyArc.closing}
          </p>
        </div>

        {script.teleprompterText && (
          <div>
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Versión Teleprompter</p>
            <Textarea
              value={script.teleprompterText}
              readOnly
              rows={10}
              className="font-mono text-xs"
            />
          </div>
        )}
      </div>
    </Modal>
  );
}

