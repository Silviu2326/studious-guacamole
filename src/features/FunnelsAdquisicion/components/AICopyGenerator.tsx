import { useState } from 'react';
import { Sparkles, Copy, CheckCircle2, AlertCircle } from 'lucide-react';
import { Button, Card, Input, Textarea, Select } from '../../../components/componentsreutilizables';
import { FunnelsAdquisicionService } from '../services/funnelsAdquisicionService';
import {
  LandingPageCopyGenerationRequest,
  LandingPageCopyGenerationResponse,
  LandingPageCopySection,
  ToneOfVoice,
} from '../types';

interface AICopyGeneratorProps {
  landingPageId?: string;
  onCopyGenerated?: (copy: LandingPageCopyGenerationResponse) => void;
}

const TONE_OPTIONS: { value: ToneOfVoice; label: string }[] = [
  { value: 'motivacional', label: 'Motivacional' },
  { value: 'educativo', label: 'Educativo' },
  { value: 'enérgico', label: 'Enérgico' },
  { value: 'empático', label: 'Empático' },
  { value: 'profesional', label: 'Profesional' },
  { value: 'directo', label: 'Directo' },
  { value: 'inspirador', label: 'Inspirador' },
  { value: 'cercano', label: 'Cercano' },
];

const SECTION_OPTIONS: { value: LandingPageCopySection['sectionType']; label: string }[] = [
  { value: 'hero', label: 'Hero (Título principal)' },
  { value: 'benefits', label: 'Beneficios' },
  { value: 'features', label: 'Características' },
  { value: 'social_proof', label: 'Prueba social' },
  { value: 'testimonials', label: 'Testimonios' },
  { value: 'faq', label: 'FAQ' },
  { value: 'cta', label: 'Llamado a la acción' },
];

export function AICopyGenerator({ landingPageId, onCopyGenerated }: AICopyGeneratorProps) {
  const [objective, setObjective] = useState('');
  const [targetAudience, setTargetAudience] = useState('');
  const [toneOfVoice, setToneOfVoice] = useState<ToneOfVoice>('motivacional');
  const [customToneDescription, setCustomToneDescription] = useState('');
  const [selectedSections, setSelectedSections] = useState<LandingPageCopySection['sectionType'][]>(['hero', 'benefits', 'cta']);
  const [keyMessages, setKeyMessages] = useState<string[]>(['', '', '']);
  const [ctaText, setCtaText] = useState('');
  const [includeTestimonials, setIncludeTestimonials] = useState(false);
  const [includeFAQ, setIncludeFAQ] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCopy, setGeneratedCopy] = useState<LandingPageCopyGenerationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSectionToggle = (section: LandingPageCopySection['sectionType']) => {
    setSelectedSections((prev) =>
      prev.includes(section) ? prev.filter((s) => s !== section) : [...prev, section]
    );
  };

  const handleKeyMessageChange = (index: number, value: string) => {
    const newMessages = [...keyMessages];
    newMessages[index] = value;
    setKeyMessages(newMessages);
  };

  const handleGenerate = async () => {
    if (!objective.trim()) {
      setError('Por favor, indica el objetivo de la landing page');
      return;
    }

    if (selectedSections.length === 0) {
      setError('Selecciona al menos una sección para generar');
      return;
    }

    setIsGenerating(true);
    setError(null);
    setGeneratedCopy(null);

    try {
      const request: LandingPageCopyGenerationRequest = {
        landingPageId,
        objective: objective.trim(),
        targetAudience: targetAudience.trim() || undefined,
        toneOfVoice,
        customToneDescription: customToneDescription.trim() || undefined,
        sections: selectedSections,
        keyMessages: keyMessages.filter((m) => m.trim()).length > 0 ? keyMessages.filter((m) => m.trim()) : undefined,
        ctaText: ctaText.trim() || undefined,
        includeTestimonials,
        includeFAQ,
      };

      const response = await FunnelsAdquisicionService.generateLandingPageCopyWithAI(request);
      setGeneratedCopy(response);
      onCopyGenerated?.(response);
    } catch (err) {
      setError('Error al generar el copy. Por favor, intenta de nuevo.');
      console.error('[AICopyGenerator] Error:', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-2xl border border-indigo-200/70 bg-gradient-to-br from-indigo-50/80 to-white p-6 shadow-sm dark:border-indigo-500/30 dark:from-indigo-900/20 dark:to-slate-900/60">
        <div className="flex items-center gap-3 mb-4">
          <Sparkles className="h-5 w-5 text-indigo-600 dark:text-indigo-300" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Generar Copy Completo con IA
          </h3>
        </div>
        <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
          La IA generará el copy completo de tu landing page en tu tono personalizado, optimizado para conversión.
        </p>

        <div className="space-y-5">
          <Input
            label="Objetivo de la landing page *"
            placeholder="Ej: Captar leads para consulta gratuita, Vender plan mensual, Registro a webinar..."
            value={objective}
            onChange={(e) => setObjective(e.target.value)}
            helperText="Describe el objetivo principal de esta landing page"
          />

          <Input
            label="Audiencia objetivo"
            placeholder="Ej: Personas de 30-45 años interesadas en pérdida de peso"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            helperText="Opcional: Describe tu audiencia para personalizar el copy"
          />

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Tono de voz *
            </label>
            <select
              value={toneOfVoice}
              onChange={(e) => setToneOfVoice(e.target.value as ToneOfVoice)}
              className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-400 pl-4 pr-3 py-2.5 dark:bg-slate-800 dark:text-slate-100 dark:ring-slate-700"
            >
              {TONE_OPTIONS.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              El copy se generará en este tono para mantener consistencia con tu marca
            </p>
          </div>

          {toneOfVoice === 'cercano' && (
            <Textarea
              label="Descripción del tono personalizado"
              placeholder="Describe cómo quieres que suene el copy (ej: cercano pero profesional, usando lenguaje coloquial...)"
              value={customToneDescription}
              onChange={(e) => setCustomToneDescription(e.target.value)}
              rows={3}
            />
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-3">
              Secciones a generar *
            </label>
            <div className="grid gap-3 md:grid-cols-2">
              {SECTION_OPTIONS.map((section) => (
                <label
                  key={section.value}
                  className="flex items-center gap-3 rounded-xl border border-slate-200/70 bg-white p-3 cursor-pointer hover:border-indigo-300 hover:bg-indigo-50/50 transition dark:border-slate-700/60 dark:bg-slate-800/60 dark:hover:border-indigo-500/50 dark:hover:bg-indigo-500/10"
                >
                  <input
                    type="checkbox"
                    checked={selectedSections.includes(section.value)}
                    onChange={() => handleSectionToggle(section.value)}
                    className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600"
                  />
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    {section.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
              Mensajes clave (opcional)
            </label>
            <div className="space-y-2">
              {keyMessages.map((message, index) => (
                <Input
                  key={index}
                  placeholder={`Mensaje clave ${index + 1} (ej: Resultados en 8 semanas, Enfoque personalizado...)`}
                  value={message}
                  onChange={(e) => handleKeyMessageChange(index, e.target.value)}
                />
              ))}
            </div>
            <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
              Estos mensajes se integrarán en el copy generado
            </p>
          </div>

          <Input
            label="Texto del CTA (opcional)"
            placeholder="Ej: Reserva tu consulta gratuita, Comienza ahora..."
            value={ctaText}
            onChange={(e) => setCtaText(e.target.value)}
            helperText="Si no especificas, la IA sugerirá opciones"
          />

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeTestimonials}
                onChange={(e) => setIncludeTestimonials(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-200">Incluir testimonios</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={includeFAQ}
                onChange={(e) => setIncludeFAQ(e.target.checked)}
                className="rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm text-slate-700 dark:text-slate-200">Incluir FAQ</span>
            </label>
          </div>

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 flex items-start gap-3 dark:border-red-500/40 dark:bg-red-500/10">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
            </div>
          )}

          <Button
            variant="primary"
            onClick={handleGenerate}
            disabled={isGenerating || !objective.trim() || selectedSections.length === 0}
            className="w-full inline-flex items-center justify-center gap-2"
          >
            {isGenerating ? (
              <>
                <Sparkles className="h-4 w-4 animate-spin" />
                Generando copy...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generar Copy Completo
              </>
            )}
          </Button>
        </div>
      </div>

      {generatedCopy && (
        <Card className="p-6 bg-white dark:bg-slate-900/60">
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              Copy Generado
            </h4>
          </div>

          {generatedCopy.reasoning && (
            <div className="mb-6 rounded-xl border border-indigo-200 bg-indigo-50/60 p-4 dark:border-indigo-500/40 dark:bg-indigo-500/10">
              <p className="text-sm text-indigo-800 dark:text-indigo-200">{generatedCopy.reasoning}</p>
              {generatedCopy.estimatedConversion && (
                <p className="mt-2 text-sm font-medium text-indigo-900 dark:text-indigo-100">
                  Conversión estimada: {generatedCopy.estimatedConversion}%
                </p>
              )}
            </div>
          )}

          <div className="space-y-6">
            {generatedCopy.sections.map((section) => (
              <div
                key={section.id}
                className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-5 dark:border-slate-700/60 dark:bg-slate-800/40"
              >
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-semibold text-slate-900 dark:text-slate-100">
                    {section.title || section.sectionType}
                  </h5>
                  <span className="text-xs font-medium uppercase tracking-wider text-indigo-600 dark:text-indigo-300">
                    {section.sectionType}
                  </span>
                </div>
                <div className="prose prose-sm max-w-none dark:prose-invert">
                  <pre className="whitespace-pre-wrap text-sm text-slate-700 dark:text-slate-200 font-sans">
                    {section.content}
                  </pre>
                </div>
                {section.suggestedLength && (
                  <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                    Longitud sugerida: ~{section.suggestedLength} caracteres
                  </p>
                )}
              </div>
            ))}

            {generatedCopy.metaTitle && (
              <div className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-5 dark:border-slate-700/60 dark:bg-slate-800/40">
                <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">SEO</h5>
                <p className="text-sm text-slate-700 dark:text-slate-200">
                  <strong>Meta Title:</strong> {generatedCopy.metaTitle}
                </p>
                {generatedCopy.metaDescription && (
                  <p className="text-sm text-slate-700 dark:text-slate-200 mt-2">
                    <strong>Meta Description:</strong> {generatedCopy.metaDescription}
                  </p>
                )}
              </div>
            )}

            {generatedCopy.suggestedHeadlines && generatedCopy.suggestedHeadlines.length > 0 && (
              <div className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-5 dark:border-slate-700/60 dark:bg-slate-800/40">
                <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  Headlines Alternativos
                </h5>
                <ul className="space-y-2">
                  {generatedCopy.suggestedHeadlines.map((headline, index) => (
                    <li key={index} className="text-sm text-slate-700 dark:text-slate-200">
                      • {headline}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {generatedCopy.suggestedCTAs && generatedCopy.suggestedCTAs.length > 0 && (
              <div className="rounded-xl border border-slate-200/70 bg-slate-50/60 p-5 dark:border-slate-700/60 dark:bg-slate-800/40">
                <h5 className="font-semibold text-slate-900 dark:text-slate-100 mb-3">
                  CTAs Sugeridos
                </h5>
                <div className="flex flex-wrap gap-2">
                  {generatedCopy.suggestedCTAs.map((cta, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center rounded-lg bg-indigo-100 px-3 py-1.5 text-sm font-medium text-indigo-700 dark:bg-indigo-500/20 dark:text-indigo-200"
                    >
                      {cta}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6 flex gap-3">
            <Button
              variant="secondary"
              onClick={() => {
                const copyText = generatedCopy.sections
                  .map((s) => `${s.title || s.sectionType}\n\n${s.content}`)
                  .join('\n\n---\n\n');
                navigator.clipboard.writeText(copyText);
              }}
              className="inline-flex items-center gap-2"
            >
              <Copy className="h-4 w-4" />
              Copiar Todo
            </Button>
            <Button
              variant="primary"
              onClick={() => {
                // Aquí se podría implementar la funcionalidad de aplicar el copy al editor
                alert('Funcionalidad de aplicar al editor próximamente');
              }}
            >
              Aplicar al Editor
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}

