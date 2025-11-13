import { useMemo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, FileText, Layers, Megaphone, Sparkles, Users, CheckCircle, Clock, TrendingUp } from 'lucide-react';
import { Badge, Button, Card, Input, Select, Tabs, Textarea } from '../../../components/componentsreutilizables';
import { BuyerPersona, LeadMagnetFormatSuggestion, AvatarBasedFormatSuggestions } from '../types';
import { getLeadMagnetFormatSuggestions, getFunnelPersonalization } from '../api';
import { NurturingRecommendations } from '../components/NurturingRecommendations';

type LeadMagnetTabId = 'concepto' | 'contenido' | 'distribucion';

export default function FunnelsLeadMagnetFactoryPage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<LeadMagnetTabId>('concepto');
  const [personas, setPersonas] = useState<BuyerPersona[]>([]);
  const [selectedPersonaId, setSelectedPersonaId] = useState<string | null>(null);
  const [formatSuggestions, setFormatSuggestions] = useState<AvatarBasedFormatSuggestions | null>(null);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [showNurturingRecommendations, setShowNurturingRecommendations] = useState(false);
  const [formSubmissionData, setFormSubmissionData] = useState<{
    formSubmissionId: string;
    leadMagnetId: string;
    responses: Record<string, any>;
  } | null>(null);

  const editorTabs = useMemo(
    () => [
      { id: 'concepto' as LeadMagnetTabId, label: 'Concepto & promesa', icon: <Layers className="h-4 w-4" /> },
      { id: 'contenido' as LeadMagnetTabId, label: 'Contenido', icon: <FileText className="h-4 w-4" /> },
      { id: 'distribucion' as LeadMagnetTabId, label: 'Distribución', icon: <Megaphone className="h-4 w-4" /> },
    ],
    [],
  );

  const formatOptions = useMemo(
    () => [
      { value: 'pdf', label: 'PDF interactivo' },
      { value: 'notion', label: 'Plantilla Notion' },
      { value: 'email-series', label: 'Secuencia Email' },
      { value: 'video', label: 'Mini-curso vídeo' },
    ],
    [],
  );

  const channelOptions = useMemo(
    () => [
      { value: 'meta', label: 'Ads Meta' },
      { value: 'google', label: 'Ads Google' },
      { value: 'email', label: 'Email marketing' },
      { value: 'whatsapp', label: 'WhatsApp automation' },
      { value: 'partners', label: 'Partners & afiliados' },
    ],
    [],
  );

  useEffect(() => {
    loadPersonas();
  }, []);

  useEffect(() => {
    if (selectedPersonaId && personas.length > 0) {
      loadFormatSuggestions(selectedPersonaId);
    } else {
      setFormatSuggestions(null);
    }
  }, [selectedPersonaId, personas]);

  const loadPersonas = async () => {
    try {
      const personalization = await getFunnelPersonalization('current-funnel');
      if (personalization && personalization.buyerPersonas.length > 0) {
        setPersonas(personalization.buyerPersonas);
        if (personalization.buyerPersonas.length === 1) {
          setSelectedPersonaId(personalization.buyerPersonas[0].id);
        }
      }
    } catch (error) {
      console.error('Error cargando personas:', error);
    }
  };

  const loadFormatSuggestions = async (personaId: string) => {
    setLoadingSuggestions(true);
    try {
      const suggestions = await getLeadMagnetFormatSuggestions(personaId, personas);
      setFormatSuggestions(suggestions);
    } catch (error) {
      console.error('Error cargando sugerencias:', error);
    } finally {
      setLoadingSuggestions(false);
    }
  };

  const getFormatLabel = (format: string) => {
    const labels: Record<string, string> = {
      guia_nutricional: 'Guía Nutricional',
      checklist_hiit: 'Checklist HIIT',
      mini_curso: 'Mini-Curso',
      calculadora: 'Calculadora',
      quiz: 'Quiz',
      plantilla: 'Plantilla',
      ebook: 'E-book',
      video_serie: 'Serie de Videos',
      workshop_grabado: 'Workshop Grabado',
      challenge: 'Challenge',
    };
    return labels[format] || format;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'facil':
        return 'bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-200';
      case 'medio':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-500/20 dark:text-amber-200';
      case 'avanzado':
        return 'bg-red-100 text-red-700 dark:bg-red-500/20 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50/60 dark:from-[#0d0b1d] dark:via-[#111936] dark:to-[#07101f]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-500 dark:text-indigo-300 dark:hover:text-indigo-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver
            </Button>
            <Badge variant="purple" size="md" className="uppercase tracking-[0.2em]">
              Lead Magnet Lab
            </Badge>
          </div>
          <div className="flex items-center gap-2 text-sm text-indigo-600 dark:text-indigo-300">
            <Sparkles className="h-4 w-4" />
            <span>Generador asistido por IA listo para sincronizar con funnels.</span>
          </div>
        </div>

        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-slate-100">
            Crea tu lead magnet irresistible
          </h1>
          <p className="mt-2 max-w-2xl text-base text-slate-600 dark:text-slate-400">
            Conceptualiza la promesa, desarrolla el contenido y activa la distribución multicanal en un solo
            espacio.
          </p>
        </div>

        <Card className="bg-white/90 shadow-xl dark:bg-slate-900/60">
          <Tabs
            items={editorTabs}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as LeadMagnetTabId)}
            variant="pills"
            size="sm"
            className="mb-6"
          />

          {activeTab === 'concepto' && (
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-6">
                {/* US-FA-04: Selector de Avatar para Sugerencias */}
                {personas.length > 0 && (
                  <div className="rounded-xl border border-indigo-200/70 bg-indigo-50/70 p-4 dark:border-indigo-500/30 dark:bg-indigo-500/10">
                    <div className="flex items-center gap-2 mb-3">
                      <Users className="h-4 w-4 text-indigo-600 dark:text-indigo-300" />
                      <label className="text-sm font-semibold text-indigo-700 dark:text-indigo-100">
                        Selecciona un avatar para sugerencias personalizadas
                      </label>
                    </div>
                    <Select
                      options={personas.map((p) => ({ value: p.id, label: p.name }))}
                      value={selectedPersonaId || ''}
                      onChange={(e) => setSelectedPersonaId(e.target.value)}
                      placeholder="Selecciona un buyer persona..."
                    />
                    {formatSuggestions && formatSuggestions.suggestions.length > 0 && (
                      <div className="mt-4 space-y-3">
                        <p className="text-xs font-medium text-indigo-700 dark:text-indigo-200">
                          {formatSuggestions.personalizedMessage}
                        </p>
                        <div className="space-y-2">
                          {formatSuggestions.suggestions.map((suggestion) => (
                            <div
                              key={suggestion.id}
                              className="rounded-lg border border-indigo-200/50 bg-white/80 p-3 dark:border-indigo-500/30 dark:bg-slate-900/50 cursor-pointer hover:border-indigo-400 transition-colors"
                              onClick={() => {
                                // Aquí podrías pre-llenar el formulario con la sugerencia
                                console.log('Sugerencia seleccionada:', suggestion);
                              }}
                            >
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 mb-1">
                                    <h4 className="text-sm font-semibold text-indigo-900 dark:text-indigo-100">
                                      {suggestion.title}
                                    </h4>
                                    <Badge size="sm" className={getDifficultyColor(suggestion.difficulty)}>
                                      {suggestion.difficulty}
                                    </Badge>
                                  </div>
                                  <p className="text-xs text-indigo-700/80 dark:text-indigo-200/80 mb-2">
                                    {suggestion.description}
                                  </p>
                                  <div className="flex items-center gap-4 text-xs text-indigo-600 dark:text-indigo-300">
                                    <span className="flex items-center gap-1">
                                      <TrendingUp className="h-3 w-3" />
                                      {suggestion.estimatedConversion}% conv.
                                    </span>
                                    <span className="flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {suggestion.timeToCreate}
                                    </span>
                                  </div>
                                </div>
                                <CheckCircle className="h-4 w-4 text-indigo-500 flex-shrink-0 mt-1" />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    {loadingSuggestions && (
                      <div className="mt-4 text-sm text-indigo-600 dark:text-indigo-300">
                        Cargando sugerencias...
                      </div>
                    )}
                  </div>
                )}

                <Input label="Nombre del recurso" placeholder="Toolkit de automatización 2025" />
                <Select
                  label="Formato"
                  options={formatOptions}
                  placeholder="Selecciona formato"
                  defaultValue=""
                />
                <Textarea
                  label="Promesa central"
                  placeholder="Ej. Acelera tu adquisición con campañas automatizadas listas para lanzar."
                  rows={4}
                />
                <Textarea
                  label="Resultados que obtendrá el lead"
                  rows={4}
                  placeholder="Describe quick wins, frameworks, plantillas incluidas..."
                />
                <div className="flex flex-wrap gap-3">
                  <Button variant="secondary">Guardar idea</Button>
                  <Button variant="primary" className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Generar guion IA
                  </Button>
                </div>
              </div>

              <div className="rounded-2xl border border-indigo-200/70 bg-indigo-50/70 p-6 dark:border-indigo-500/30 dark:bg-indigo-500/10">
                <p className="text-sm font-semibold text-indigo-700 dark:text-indigo-100">
                  Sugerencia IA
                </p>
                <p className="mt-3 text-sm text-indigo-900/80 dark:text-indigo-100/80">
                  Conecta este recurso al funnel Evergreen y activa nurtures que alternen insight, caso real y
                  CTA de demo. Incluye versión express (1 página) para mobile-first.
                </p>
                {formatSuggestions && formatSuggestions.suggestions.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-indigo-200/50 dark:border-indigo-500/30">
                    <p className="text-xs font-medium text-indigo-700 dark:text-indigo-200 mb-2">
                      Formatos recomendados para "{formatSuggestions.personaName}":
                    </p>
                    <div className="space-y-2">
                      {formatSuggestions.suggestions.slice(0, 3).map((s) => (
                        <div key={s.id} className="text-xs text-indigo-600 dark:text-indigo-300">
                          • {getFormatLabel(s.format)} - {s.estimatedConversion}% conv. estimada
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'contenido' && (
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-6">
                <Textarea
                  label="Outline del recurso"
                  placeholder="1. Introducción\n2. Framework paso a paso\n3. Checklist operativo..."
                  rows={6}
                />
                <Textarea
                  label="Call to action final"
                  placeholder="Reserva una sesión estratégica de 15 minutos..."
                  rows={3}
                />
                <Textarea
                  label="Mensajes de seguimiento (email/SMS)"
                  helperText="Escribe variantes. La IA ajustará tono y timing."
                  rows={4}
                />
              </div>

              <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-slate-50/80 p-6 dark:border-slate-800/70 dark:bg-slate-900/40">
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Recursos incluidos
                </p>
                <ul className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                  <li>• Guía PDF 18 páginas con checklists accionables.</li>
                  <li>• Plantilla Notion clonable.</li>
                  <li>• Google Sheets con métricas y fórmulas preconfiguradas.</li>
                  <li>• Slides para webinar + script IA.</li>
                </ul>
              </div>
            </div>
          )}

          {activeTab === 'distribucion' && (
            <div className="grid gap-6 lg:grid-cols-[2fr,1fr]">
              <div className="space-y-6">
                <Select
                  label="Canales de distribución"
                  options={channelOptions}
                  multiple
                  placeholder="Selecciona canales claves"
                  defaultValue=""
                />
                <Textarea
                  label="Secuencia de lanzamiento"
                  placeholder="Día 0: Email lista principal...\nDía 1: Ads remarketing..."
                  rows={5}
                />
                <Textarea
                  label="KPIs a monitorear"
                  rows={3}
                  placeholder="CPL, tasa de descarga, tasa de demo agendada..."
                />
                <div className="flex flex-wrap gap-3">
                  <Button variant="ghost">Exportar en Notion</Button>
                  <Button variant="primary" className="inline-flex items-center gap-2">
                    <Sparkles className="h-4 w-4" />
                    Activar en funnels
                  </Button>
                </div>
              </div>

              <div className="space-y-4 rounded-2xl border border-emerald-200/70 bg-emerald-50/70 p-6 dark:border-emerald-500/30 dark:bg-emerald-500/10">
                <p className="text-sm font-semibold text-emerald-700 dark:text-emerald-100">
                  Playbook IA listo
                </p>
                <ul className="space-y-3 text-sm text-emerald-700/80 dark:text-emerald-100/80">
                  <li>• Activar nurture 3 emails + 1 WhatsApp tras descarga.</li>
                  <li>• Enviar oferta limitada 48h después sin abrir / sin clic.</li>
                  <li>• Sincronizar con audiencias lookalike 3% en Meta.</li>
                  <li>• Medir SQLs generadas a los 7 y 14 días.</li>
                </ul>
              </div>
            </div>
          )}
        </Card>

        {/* US-FA-016: Recomendaciones de nurturing según respuestas del lead magnet */}
        {showNurturingRecommendations && formSubmissionData && (
          <div className="mt-8">
            <NurturingRecommendations
              formSubmissionId={formSubmissionData.formSubmissionId}
              leadMagnetId={formSubmissionData.leadMagnetId}
              responses={formSubmissionData.responses}
              buyerPersonaId={selectedPersonaId || undefined}
            />
          </div>
        )}
      </div>
    </div>
  );
}

