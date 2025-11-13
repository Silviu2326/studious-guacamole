import { useState, useEffect } from 'react';
import { Badge, Button, Card, Select, Textarea, Input } from '../../../components/componentsreutilizables';
import type { VideoScriptPrompt, GeneratedVideoScript, VideoStyle } from '../types';
import {
  getVideoScriptPrompts,
  generateVideoScript,
  getAvailableVideoStyles,
} from '../api/videoScripts';
import { ICON_MAP } from './iconMap';
import { Video, Sparkles, Copy, Clock, Zap, Wind, BookOpen, Heart, Apple, Dumbbell, Sun } from 'lucide-react';

interface VideoScriptGeneratorProps {
  loading?: boolean;
}

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  tip: Zap,
  tutorial: BookOpen,
  motivacion: Heart,
  transformacion: Sparkles,
  nutricion: Apple,
  ejercicio: Dumbbell,
  bienestar: Sun,
};

const styleColors: Record<VideoStyle, string> = {
  energetico: 'bg-orange-100 text-orange-700 border-orange-200',
  calmado: 'bg-blue-100 text-blue-700 border-blue-200',
  motivacional: 'bg-purple-100 text-purple-700 border-purple-200',
  educativo: 'bg-green-100 text-green-700 border-green-200',
  personalizado: 'bg-indigo-100 text-indigo-700 border-indigo-200',
};

export function VideoScriptGenerator({ loading: externalLoading }: VideoScriptGeneratorProps) {
  const [prompts, setPrompts] = useState<VideoScriptPrompt[]>([]);
  const [selectedStyle, setSelectedStyle] = useState<VideoStyle | ''>('');
  const [selectedPromptId, setSelectedPromptId] = useState<string>('');
  const [customTopic, setCustomTopic] = useState<string>('');
  const [generatedScript, setGeneratedScript] = useState<GeneratedVideoScript | null>(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [styles] = useState(getAvailableVideoStyles());

  useEffect(() => {
    if (!externalLoading) {
      loadPrompts();
    }
  }, [externalLoading, selectedStyle]);

  const loadPrompts = async () => {
    setLoading(true);
    try {
      const promptsData = await getVideoScriptPrompts(selectedStyle || undefined);
      setPrompts(promptsData);
      if (promptsData.length > 0 && !selectedPromptId) {
        setSelectedPromptId(promptsData[0].id);
      }
    } catch (error) {
      console.error('Error cargando prompts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedPromptId) return;

    setGenerating(true);
    setGeneratedScript(null);
    try {
      const script = await generateVideoScript(
        selectedPromptId,
        customTopic || undefined,
        selectedStyle || undefined
      );
      setGeneratedScript(script);
    } catch (error) {
      console.error('Error generando script:', error);
      alert(error instanceof Error ? error.message : 'Error al generar el script. Intenta nuevamente.');
    } finally {
      setGenerating(false);
    }
  };

  const handleCopyScript = () => {
    if (!generatedScript) return;

    const scriptText = `
${generatedScript.script.hook.text} [${generatedScript.script.hook.timing}]
${generatedScript.script.hook.visualCue ? `Visual: ${generatedScript.script.hook.visualCue}` : ''}

${generatedScript.script.body.map((section) => 
  `${section.text} [${section.timing}]\n${section.visualCue ? `Visual: ${section.visualCue}` : ''}`
).join('\n\n')}

${generatedScript.script.cta.text} [${generatedScript.script.cta.timing}]
${generatedScript.script.cta.visualCue ? `Visual: ${generatedScript.script.cta.visualCue}` : ''}

Hashtags: ${generatedScript.hashtags.join(' ')}
    `.trim();

    navigator.clipboard.writeText(scriptText);
    alert('Script copiado al portapapeles');
  };

  const selectedPrompt = prompts.find((p) => p.id === selectedPromptId);

  if (externalLoading || loading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-slate-200 rounded" />
          <div className="h-24 bg-slate-100 rounded-2xl" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 shadow-sm border border-slate-100">
      <div className="px-6 py-5 border-b border-slate-100">
        <div className="flex items-center gap-2 mb-2">
          {ICON_MAP.film ? <ICON_MAP.film className="w-5 h-5 text-indigo-500" /> : <Video className="w-5 h-5 text-indigo-500" />}
          <h2 className="text-xl font-semibold text-slate-900">
            Generador de Scripts de Video
          </h2>
        </div>
        <p className="text-sm text-slate-500">
          Crea scripts de video rápidos alineados a tu estilo (energético vs calmado) para grabar sin improvisar
        </p>
      </div>

      <div className="px-6 py-5 space-y-6">
        {/* Selección de Estilo */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Estilo de Video
          </label>
          <Select
            value={selectedStyle}
            onChange={(e) => {
              setSelectedStyle(e.target.value as VideoStyle | '');
              setSelectedPromptId('');
              setGeneratedScript(null);
            }}
            options={[
              { value: '', label: 'Todos los estilos' },
              ...styles.map((style) => ({
                value: style.value,
                label: `${style.label} - ${style.description}`,
              })),
            ]}
            placeholder="Selecciona un estilo"
          />
        </div>

        {/* Selección de Prompt */}
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Prompt Rápido
          </label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {prompts.map((prompt) => {
              const CategoryIcon = categoryIcons[prompt.category] || Video;
              return (
                <div
                  key={prompt.id}
                  className={`border rounded-2xl p-4 cursor-pointer transition-all ${
                    selectedPromptId === prompt.id
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                  onClick={() => {
                    setSelectedPromptId(prompt.id);
                    setGeneratedScript(null);
                  }}
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Badge
                      variant="purple"
                      size="sm"
                      className={`${styleColors[prompt.style]}`}
                    >
                      {prompt.style.toUpperCase()}
                    </Badge>
                    <Badge variant="blue" size="sm" className="flex items-center gap-1">
                      <CategoryIcon className="w-3 h-3" />
                      {prompt.category}
                    </Badge>
                    <Badge variant="gray" size="sm" className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {prompt.estimatedDuration}
                    </Badge>
                  </div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-1">
                    {prompt.title}
                  </h4>
                  <p className="text-xs text-slate-600">{prompt.description}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tema Personalizado (Opcional) */}
        {selectedPrompt && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Tema Personalizado (Opcional)
            </label>
            <p className="text-xs text-slate-500 mb-2">
              Personaliza el tema del video. Si lo dejas vacío, se usará el prompt predeterminado.
            </p>
            <Input
              placeholder="Ej: Cómo hacer sentadillas correctamente"
              value={customTopic}
              onChange={(e) => setCustomTopic(e.target.value)}
            />
          </div>
        )}

        {/* Botón Generar */}
        <Button
          variant="primary"
          onClick={handleGenerate}
          disabled={!selectedPromptId || generating}
          className="w-full"
        >
          {generating ? (
            <>
              <Sparkles className="w-4 h-4 mr-2 animate-spin" />
              Generando script...
            </>
          ) : (
            <>
              <Video className="w-4 h-4 mr-2" />
              Generar Script
            </>
          )}
        </Button>

        {/* Script Generado */}
        {generatedScript && (
          <div className="bg-indigo-50 rounded-2xl p-5 border border-indigo-100">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-semibold text-slate-900">Script Generado</h3>
                <p className="text-xs text-slate-500 mt-1">
                  Estilo: {generatedScript.style} | Duración: {generatedScript.duration}
                </p>
              </div>
              <Button variant="secondary" size="sm" onClick={handleCopyScript}>
                <Copy className="w-4 h-4 mr-1" />
                Copiar Script
              </Button>
            </div>

            <div className="bg-white rounded-xl p-4 mb-4 border border-slate-200 space-y-4">
              {/* Hook */}
              <div className="border-l-4 border-indigo-500 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="purple" size="sm">HOOK</Badge>
                  <span className="text-xs text-slate-500">{generatedScript.script.hook.timing}</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 mb-1">
                  {generatedScript.script.hook.text}
                </p>
                {generatedScript.script.hook.visualCue && (
                  <p className="text-xs text-slate-500 italic">
                    📹 {generatedScript.script.hook.visualCue}
                  </p>
                )}
              </div>

              {/* Body */}
              <div className="space-y-3">
                {generatedScript.script.body.map((section, index) => (
                  <div key={index} className="border-l-4 border-slate-300 pl-4">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="blue" size="sm">PASO {index + 1}</Badge>
                      <span className="text-xs text-slate-500">{section.timing}</span>
                    </div>
                    <p className="text-sm text-slate-700 mb-1">{section.text}</p>
                    {section.visualCue && (
                      <p className="text-xs text-slate-500 italic">
                        📹 {section.visualCue}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="border-l-4 border-green-500 pl-4">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="green" size="sm">CTA</Badge>
                  <span className="text-xs text-slate-500">{generatedScript.script.cta.timing}</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 mb-1">
                  {generatedScript.script.cta.text}
                </p>
                {generatedScript.script.cta.visualCue && (
                  <p className="text-xs text-slate-500 italic">
                    📹 {generatedScript.script.cta.visualCue}
                  </p>
                )}
              </div>
            </div>

            {/* Hashtags */}
            <div className="mb-4">
              <p className="text-xs font-medium text-slate-700 mb-2">Hashtags sugeridos:</p>
              <div className="flex flex-wrap gap-2">
                {generatedScript.hashtags.map((tag, idx) => (
                  <span key={idx} className="text-xs text-indigo-600 bg-indigo-50 px-2 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Notas */}
            {generatedScript.notes && (
              <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                <p className="text-xs text-slate-600">
                  <strong>Notas:</strong> {generatedScript.notes}
                </p>
              </div>
            )}

            <div className="flex gap-2 mt-4">
              <Button variant="ghost" size="sm">
                Guardar Script
              </Button>
              <Button variant="secondary" size="sm">
                Agregar al Planner
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}

