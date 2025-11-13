import { useCallback, useEffect, useState } from 'react';
import {
  Sparkles,
  Share2,
  Copy,
  Download,
  Users,
  CheckCircle2,
  Clock,
  FileText,
  MessageSquare,
  TrendingUp,
  Target,
  Calendar,
  X,
  Mail,
  Link as LinkIcon,
} from 'lucide-react';
import { Card } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables';
import { FunnelsAdquisicionService } from '../services/funnelsAdquisicionService';
import {
  FunnelAISummary as FunnelAISummaryType,
  GenerateFunnelAISummaryRequest,
  ShareFunnelAISummaryRequest,
  AcquisitionFunnelPerformance,
} from '../types';

interface FunnelAISummaryProps {
  funnel: AcquisitionFunnelPerformance;
  onClose?: () => void;
}

export function FunnelAISummary({ funnel, onClose }: FunnelAISummaryProps) {
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [summary, setSummary] = useState<FunnelAISummaryType | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareEmails, setShareEmails] = useState<string>('');
  const [shareLoading, setShareLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [publicLink, setPublicLink] = useState<string | null>(null);

  const generateSummary = useCallback(async () => {
    setGenerating(true);
    try {
      const request: GenerateFunnelAISummaryRequest = {
        funnelId: funnel.id,
        format: 'text',
        language: 'es',
        includeContentSuggestions: true,
        includeAdSuggestions: true,
        includeSocialMediaPosts: true,
      };
      const response = await FunnelsAdquisicionService.generateFunnelAISummary(request);
      setSummary(response.summary);
    } catch (error) {
      console.error('[FunnelAISummary] Error generando resumen:', error);
    } finally {
      setGenerating(false);
    }
  }, [funnel.id]);

  useEffect(() => {
    generateSummary();
  }, [generateSummary]);

  const handleShare = async () => {
    if (!summary) return;

    setShareLoading(true);
    try {
      const emails = shareEmails
        .split(',')
        .map((e) => e.trim())
        .filter((e) => e.length > 0);

      const request: ShareFunnelAISummaryRequest = {
        summaryId: summary.id,
        emails: emails.length > 0 ? emails : undefined,
        generatePublicLink: true,
        expiresInDays: 30,
        accessLevel: 'view',
      };

      const response = await FunnelsAdquisicionService.shareFunnelAISummary(request);
      if (response.publicLink) {
        setPublicLink(response.publicLink);
      }
      setShowShareModal(false);
      setShareEmails('');
    } catch (error) {
      console.error('[FunnelAISummary] Error compartiendo resumen:', error);
    } finally {
      setShareLoading(false);
    }
  };

  const copyToClipboard = async () => {
    if (!summary) return;

    const text = formatSummaryAsText(summary);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatSummaryAsText = (summary: FunnelAISummaryType): string => {
    const s = summary.summary;
    let text = `RESUMEN IA DEL FUNNEL: ${summary.funnelName}\n\n`;
    text += `Generado el: ${new Date(summary.generatedAt).toLocaleDateString('es-ES')}\n\n`;
    text += `=== VISIÓN GENERAL ===\n${s.overview}\n\n`;
    text += `=== OBJETIVOS ===\n${s.objectives.map((o, i) => `${i + 1}. ${o}`).join('\n')}\n\n`;
    text += `=== AUDIENCIA OBJETIVO ===\n${s.targetAudience}\n\n`;
    text += `=== MENSAJES CLAVE ===\n${s.keyMessages.map((m, i) => `${i + 1}. ${m}`).join('\n')}\n\n`;
    text += `=== MÉTRICAS ACTUALES ===\n`;
    text += `Leads: ${s.metrics.currentMetrics.leads}\n`;
    text += `Conversiones: ${s.metrics.currentMetrics.conversions}\n`;
    text += `Revenue: €${s.metrics.currentMetrics.revenue.toLocaleString()}\n`;
    text += `Tasa de conversión: ${s.metrics.currentMetrics.conversionRate.toFixed(2)}%\n\n`;
    text += `=== PRÓXIMOS PASOS ===\n${s.nextSteps.map((s, i) => `${i + 1}. ${s}`).join('\n')}\n`;
    return text;
  };

  const downloadAsText = () => {
    if (!summary) return;
    const text = formatSummaryAsText(summary);
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `resumen-funnel-${funnel.name}-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (generating) {
    return (
      <Card className="p-6 bg-white shadow-sm dark:bg-slate-900/60">
        <div className="flex flex-col items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mb-4"></div>
          <p className="text-gray-600 dark:text-slate-400">Generando resumen IA del funnel...</p>
        </div>
      </Card>
    );
  }

  if (!summary) {
    return (
      <Card className="p-6 bg-white shadow-sm dark:bg-slate-900/60">
        <div className="text-center py-12">
          <p className="text-gray-600 dark:text-slate-400 mb-4">No se pudo generar el resumen</p>
          <Button variant="primary" onClick={generateSummary}>
            Reintentar
          </Button>
        </div>
      </Card>
    );
  }

  const s = summary.summary;

  return (
    <>
      <Card className="p-6 bg-white shadow-sm dark:bg-slate-900/60">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-indigo-900/40 dark:to-purple-900/30 rounded-xl ring-1 ring-indigo-200/70">
              <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                Resumen IA del Funnel
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                {funnel.name} • Generado el {new Date(summary.generatedAt).toLocaleDateString('es-ES')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={copyToClipboard}
              className="inline-flex items-center gap-2"
            >
              <Copy className="w-4 h-4" />
              {copied ? 'Copiado' : 'Copiar'}
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={downloadAsText}
              className="inline-flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Descargar
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setShowShareModal(true)}
              className="inline-flex items-center gap-2"
            >
              <Share2 className="w-4 h-4" />
              Compartir
            </Button>
            {onClose && (
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-6">
          {/* Visión General */}
          <section>
            <h4 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <FileText className="w-5 h-5 text-indigo-600" />
              Visión General
            </h4>
            <p className="text-gray-700 dark:text-slate-300 leading-relaxed">{s.overview}</p>
          </section>

          {/* Objetivos */}
          <section>
            <h4 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Target className="w-5 h-5 text-indigo-600" />
              Objetivos
            </h4>
            <ul className="space-y-2">
              {s.objectives.map((objective, index) => (
                <li key={index} className="flex items-start gap-2 text-gray-700 dark:text-slate-300">
                  <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>{objective}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* Audiencia Objetivo */}
          <section>
            <h4 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Users className="w-5 h-5 text-indigo-600" />
              Audiencia Objetivo
            </h4>
            <p className="text-gray-700 dark:text-slate-300 leading-relaxed">{s.targetAudience}</p>
          </section>

          {/* Mensajes Clave */}
          <section>
            <h4 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              Mensajes Clave
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {s.keyMessages.map((message, index) => (
                <div
                  key={index}
                  className="p-3 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg border border-indigo-100 dark:border-indigo-800"
                >
                  <p className="text-sm text-gray-700 dark:text-slate-300">{message}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Métricas */}
          <section>
            <h4 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-indigo-600" />
              Métricas
            </h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Leads Actuales</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  {s.metrics.currentMetrics.leads}
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Conversiones</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  {s.metrics.currentMetrics.conversions}
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Revenue</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  €{s.metrics.currentMetrics.revenue.toLocaleString()}
                </div>
              </div>
              <div className="p-4 bg-gray-50 dark:bg-slate-800 rounded-lg">
                <div className="text-sm text-gray-600 dark:text-slate-400 mb-1">Tasa Conversión</div>
                <div className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  {s.metrics.currentMetrics.conversionRate.toFixed(2)}%
                </div>
              </div>
            </div>
          </section>

          {/* Sugerencias de Contenido */}
          {s.contentSuggestions.length > 0 && (
            <section>
              <h4 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-3">
                Sugerencias de Contenido
              </h4>
              <div className="space-y-3">
                {s.contentSuggestions.map((suggestion) => (
                  <div
                    key={suggestion.id}
                    className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={suggestion.priority === 'high' ? 'red' : suggestion.priority === 'medium' ? 'yellow' : 'blue'}
                          size="sm"
                        >
                          {suggestion.type}
                        </Badge>
                        <span className="font-medium text-gray-900 dark:text-slate-100">{suggestion.title}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">{suggestion.description}</p>
                    {suggestion.cta && (
                      <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                        CTA: {suggestion.cta}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Sugerencias de Anuncios */}
          {s.adSuggestions.length > 0 && (
            <section>
              <h4 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-3">
                Sugerencias de Anuncios
              </h4>
              <div className="space-y-3">
                {s.adSuggestions.map((ad) => (
                  <div
                    key={ad.id}
                    className="p-4 border border-gray-200 dark:border-slate-700 rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Badge variant="blue" size="sm">
                          {ad.platform}
                        </Badge>
                        <span className="font-medium text-gray-900 dark:text-slate-100">{ad.headline}</span>
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">{ad.description}</p>
                    <div className="text-sm text-indigo-600 dark:text-indigo-400 font-medium">
                      CTA: {ad.cta}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Próximos Pasos */}
          <section>
            <h4 className="text-base font-semibold text-gray-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-indigo-600" />
              Próximos Pasos
            </h4>
            <ol className="space-y-2 list-decimal list-inside">
              {s.nextSteps.map((step, index) => (
                <li key={index} className="text-gray-700 dark:text-slate-300">
                  {step}
                </li>
              ))}
            </ol>
          </section>
        </div>
      </Card>

      {/* Modal de Compartir */}
      {showShareModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-900 rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Compartir Resumen</h3>
              <button
                onClick={() => setShowShareModal(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Emails (separados por comas)
                </label>
                <textarea
                  value={shareEmails}
                  onChange={(e) => setShareEmails(e.target.value)}
                  placeholder="email1@ejemplo.com, email2@ejemplo.com"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
                  rows={3}
                />
              </div>
              {publicLink && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Enlace Público
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      value={publicLink}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-800 text-gray-900 dark:text-slate-100 text-sm"
                    />
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        navigator.clipboard.writeText(publicLink);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                    >
                      <Copy className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Button
                  variant="primary"
                  onClick={handleShare}
                  disabled={shareLoading}
                  className="flex-1"
                >
                  {shareLoading ? 'Compartiendo...' : 'Compartir'}
                </Button>
                <Button variant="secondary" onClick={() => setShowShareModal(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

