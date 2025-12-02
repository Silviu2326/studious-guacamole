import React, { useState } from 'react';
import {
  Mail,
  Sparkles,
  Plus,
  Edit,
  Trash2,
  Send,
  Eye,
  Calendar,
  TrendingUp,
  Users,
  Award,
  Lightbulb,
  Heart,
  Target,
  Settings,
  CheckCircle2,
  Clock,
  FileText,
} from 'lucide-react';
import { Card, Button, Badge, Modal } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import {
  WeeklyHighlightsNewsletterGenerator as WeeklyHighlightsNewsletterGeneratorType,
  AIGeneratedNewsletter,
  WeeklyHighlight,
} from '../types';

interface WeeklyHighlightsNewsletterGeneratorProps {
  generator?: WeeklyHighlightsNewsletterGeneratorType;
  loading?: boolean;
  className?: string;
  onGenerateNewsletter?: (highlights: WeeklyHighlight[]) => void;
  onEditNewsletter?: (newsletter: AIGeneratedNewsletter) => void;
  onDeleteNewsletter?: (newsletterId: string) => void;
  onSendNewsletter?: (newsletterId: string) => void;
  onViewNewsletter?: (newsletter: AIGeneratedNewsletter) => void;
  onSettingsEdit?: () => void;
}

const categoryIcons: Record<string, React.ReactNode> = {
  'client-success': <Award className="w-4 h-4" />,
  'training-tip': <Lightbulb className="w-4 h-4" />,
  'nutrition-advice': <Heart className="w-4 h-4" />,
  motivation: <TrendingUp className="w-4 h-4" />,
  achievement: <Target className="w-4 h-4" />,
  community: <Users className="w-4 h-4" />,
  other: <FileText className="w-4 h-4" />,
};

const categoryColors: Record<string, string> = {
  'client-success': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  'training-tip': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'nutrition-advice': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  motivation: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  achievement: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  community: 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-300',
  other: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
};

const statusColors: Record<AIGeneratedNewsletter['status'], string> = {
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
  reviewed: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  approved: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  sent: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
};

const statusLabels: Record<AIGeneratedNewsletter['status'], string> = {
  draft: 'Borrador',
  reviewed: 'Revisado',
  approved: 'Aprobado',
  sent: 'Enviado',
};

export const WeeklyHighlightsNewsletterGenerator: React.FC<WeeklyHighlightsNewsletterGeneratorProps> = ({
  generator,
  loading = false,
  className = '',
  onGenerateNewsletter,
  onEditNewsletter,
  onDeleteNewsletter,
  onSendNewsletter,
  onViewNewsletter,
  onSettingsEdit,
}) => {
  const [selectedHighlights, setSelectedHighlights] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewNewsletter, setPreviewNewsletter] = useState<AIGeneratedNewsletter | null>(null);

  const highlights = generator?.currentWeekSummary?.highlights || [];
  const topHighlights = generator?.currentWeekSummary?.topHighlights || [];
  const previousNewsletters = generator?.previousNewsletters || [];

  const handleSelectHighlight = (highlightId: string) => {
    setSelectedHighlights((prev) =>
      prev.includes(highlightId) ? prev.filter((id) => id !== highlightId) : [...prev, highlightId],
    );
  };

  const handleSelectAllTopHighlights = () => {
    const topIds = topHighlights.map((h) => h.id);
    setSelectedHighlights(topIds);
  };

  const handleGenerate = async () => {
    if (selectedHighlights.length === 0) {
      alert('Por favor selecciona al menos un highlight para generar el newsletter');
      return;
    }

    setIsGenerating(true);
    const highlightsToUse = highlights.filter((h) => selectedHighlights.includes(h.id));
    try {
      await onGenerateNewsletter?.(highlightsToUse);
      setSelectedHighlights([]);
    } catch (error) {
      console.error('Error generando newsletter:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <Card className={className}>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto"></div>
          <p className={`${ds.typography.body} ${ds.color.textMuted} ${ds.color.textMutedDark} mt-4`}>
            Cargando generador de newsletters...
          </p>
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30">
              <Sparkles className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Newsletter IA con Highlights Semanales
              </h2>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                Genera newsletters personalizados basados en tus highlights semanales con IA
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" leftIcon={<Settings size={16} />} onClick={onSettingsEdit}>
              Configuración
            </Button>
          </div>
        </div>

        {/* Current Week Summary */}
        {generator?.currentWeekSummary && (
          <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 border border-purple-200 dark:border-purple-800">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                  Semana Actual
                </h3>
                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                  {new Date(generator.currentWeekSummary.weekStartDate).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                  })}{' '}
                  -{' '}
                  {new Date(generator.currentWeekSummary.weekEndDate).toLocaleDateString('es-ES', {
                    day: 'numeric',
                    month: 'short',
                  })}
                </p>
              </div>
              <Badge variant="purple" size="md">
                {generator.currentWeekSummary.totalHighlights} highlights
              </Badge>
            </div>

            {/* Top Highlights */}
            {topHighlights.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    Highlights Destacados
                  </p>
                  <Button variant="ghost" size="sm" onClick={handleSelectAllTopHighlights}>
                    Seleccionar todos
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {topHighlights.map((highlight) => (
                    <div
                      key={highlight.id}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedHighlights.includes(highlight.id)
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50'
                      }`}
                      onClick={() => handleSelectHighlight(highlight.id)}
                    >
                      <div className="flex items-start gap-2">
                        <div className={`p-1.5 rounded-lg ${categoryColors[highlight.category]}`}>
                          {categoryIcons[highlight.category]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                              {highlight.title}
                            </h4>
                            {highlight.importance === 'high' && (
                              <Badge variant="red" size="xs">
                                Importante
                              </Badge>
                            )}
                          </div>
                          <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} line-clamp-2`}>
                            {highlight.description}
                          </p>
                          {highlight.clientName && (
                            <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mt-1`}>
                              Cliente: {highlight.clientName}
                            </p>
                          )}
                        </div>
                        {selectedHighlights.includes(highlight.id) && (
                          <CheckCircle2 className="w-5 h-5 text-purple-500 flex-shrink-0" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* All Highlights */}
            {highlights.length > topHighlights.length && (
              <div>
                <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                  Todos los Highlights
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {highlights
                    .filter((h) => !topHighlights.some((th) => th.id === h.id))
                    .map((highlight) => (
                      <div
                        key={highlight.id}
                        className={`p-2 rounded-lg border cursor-pointer transition-all ${
                          selectedHighlights.includes(highlight.id)
                            ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50'
                        }`}
                        onClick={() => handleSelectHighlight(highlight.id)}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`p-1 rounded ${categoryColors[highlight.category]}`}>
                            {categoryIcons[highlight.category]}
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className={`${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                              {highlight.title}
                            </h4>
                          </div>
                          {selectedHighlights.includes(highlight.id) && (
                            <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0" />
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Generate Button */}
            {selectedHighlights.length > 0 && (
              <div className="mt-4 pt-4 border-t border-purple-200 dark:border-purple-800">
                <div className="flex items-center justify-between">
                  <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    {selectedHighlights.length} highlight{selectedHighlights.length !== 1 ? 's' : ''} seleccionado
                    {selectedHighlights.length !== 1 ? 's' : ''}
                  </p>
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Sparkles size={16} />}
                    onClick={handleGenerate}
                    disabled={isGenerating}
                  >
                    {isGenerating ? 'Generando con IA...' : 'Generar Newsletter con IA'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Previous Newsletters */}
        {previousNewsletters.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                Newsletters Generados
              </h3>
              <Badge variant="gray" size="sm">
                {previousNewsletters.length} newsletter{previousNewsletters.length !== 1 ? 's' : ''}
              </Badge>
            </div>
            <div className="space-y-3">
              {previousNewsletters.map((newsletter) => (
                <div
                  key={newsletter.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {newsletter.name}
                        </h4>
                        <Badge className={statusColors[newsletter.status]} size="sm">
                          {statusLabels[newsletter.status]}
                        </Badge>
                      </div>
                      <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                        {newsletter.subject}
                      </p>
                      <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(newsletter.generatedAt).toLocaleDateString('es-ES')}
                        </span>
                        <span className="flex items-center gap-1">
                          <Target className="w-3 h-3" />
                          {newsletter.highlightsUsed.length} highlights
                        </span>
                        <span className="flex items-center gap-1">
                          <TrendingUp className="w-3 h-3" />
                          {newsletter.estimatedValue}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Eye size={14} />}
                        onClick={() => onViewNewsletter?.(newsletter)}
                      >
                        Ver
                      </Button>
                      {newsletter.status !== 'sent' && (
                        <>
                          <Button
                            variant="ghost"
                            size="sm"
                            leftIcon={<Edit size={14} />}
                            onClick={() => onEditNewsletter?.(newsletter)}
                          >
                            Editar
                          </Button>
                          {newsletter.status === 'approved' && (
                            <Button
                              variant="primary"
                              size="sm"
                              leftIcon={<Send size={14} />}
                              onClick={() => onSendNewsletter?.(newsletter.id)}
                            >
                              Enviar
                            </Button>
                          )}
                        </>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Trash2 size={14} />}
                        onClick={() => onDeleteNewsletter?.(newsletter.id)}
                      >
                        Eliminar
                      </Button>
                    </div>
                  </div>
                  {newsletter.cta && (
                    <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                      <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
                        CTA:
                      </p>
                      <p className={`${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {newsletter.cta.text}
                      </p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!generator?.currentWeekSummary && previousNewsletters.length === 0 && (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-12 text-center">
            <Mail className="w-12 h-12 text-slate-400 mx-auto mb-4" />
            <p className={`${ds.typography.body} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-4`}>
              No hay highlights semanales disponibles aún
            </p>
            <p className={`${ds.typography.bodySmall} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
              Los highlights semanales aparecerán aquí cuando estén disponibles
            </p>
          </div>
        )}
      </div>
    </Card>
  );
};

