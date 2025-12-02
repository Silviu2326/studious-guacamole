import React, { useState } from 'react';
import { Badge, Card, Button } from '../../../components/componentsreutilizables';
import {
  AlertTriangle,
  CheckCircle,
  Clock,
  Sparkles,
  TrendingUp,
  Users,
  X,
  Zap,
  MessageSquare,
  ArrowRight,
  Filter,
} from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { JourneyGapDetectorDashboard, JourneyGap, JourneyGapSeverity, JourneyGapType } from '../types';
import { CampanasAutomatizacionService } from '../services/campanasAutomatizacionService';

interface JourneyGapDetectorProps {
  dashboard: JourneyGapDetectorDashboard;
  loading?: boolean;
  className?: string;
  onGapAccept?: (gapId: string) => void;
  onGapReject?: (gapId: string) => void;
  onGapAutoFill?: (gapId: string) => void;
  onGapDismiss?: (gapId: string) => void;
  onViewGap?: (gap: JourneyGap) => void;
  onSettingsEdit?: () => void;
}

const severityColors: Record<JourneyGapSeverity, { bg: string; text: string; border: string }> = {
  critical: {
    bg: 'bg-red-50 dark:bg-red-900/20',
    text: 'text-red-600 dark:text-red-400',
    border: 'border-red-200 dark:border-red-800',
  },
  high: {
    bg: 'bg-orange-50 dark:bg-orange-900/20',
    text: 'text-orange-600 dark:text-orange-400',
    border: 'border-orange-200 dark:border-orange-800',
  },
  medium: {
    bg: 'bg-amber-50 dark:bg-amber-900/20',
    text: 'text-amber-600 dark:text-amber-400',
    border: 'border-amber-200 dark:border-amber-800',
  },
  low: {
    bg: 'bg-blue-50 dark:bg-blue-900/20',
    text: 'text-blue-600 dark:text-blue-400',
    border: 'border-blue-200 dark:border-blue-800',
  },
};

const gapTypeLabels: Record<JourneyGapType, string> = {
  'post-purchase': 'Post-compra',
  'post-signup': 'Post-registro',
  'post-booking': 'Post-reserva',
  'post-payment': 'Post-pago',
  'follow-up': 'Seguimiento',
  reactivation: 'Reactivación',
  milestone: 'Hito',
  abandonment: 'Abandono',
};

export const JourneyGapDetector: React.FC<JourneyGapDetectorProps> = ({
  dashboard,
  loading = false,
  className = '',
  onGapAccept,
  onGapReject,
  onGapAutoFill,
  onGapDismiss,
  onViewGap,
  onSettingsEdit,
}) => {
  const [selectedSeverity, setSelectedSeverity] = useState<JourneyGapSeverity | 'all'>('all');
  const [selectedType, setSelectedType] = useState<JourneyGapType | 'all'>('all');
  const [expandedGaps, setExpandedGaps] = useState<Set<string>>(new Set());

  if (loading && dashboard.gaps.length === 0) {
    return (
      <Card className={className}>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`${ds.shimmer} h-32`} />
          ))}
        </div>
      </Card>
    );
  }

  const toggleGapExpansion = (gapId: string) => {
    setExpandedGaps((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(gapId)) {
        newSet.delete(gapId);
      } else {
        newSet.add(gapId);
      }
      return newSet;
    });
  };

  const filteredGaps = dashboard.gaps.filter((gap) => {
    if (selectedSeverity !== 'all' && gap.severity !== selectedSeverity) return false;
    if (selectedType !== 'all' && gap.gapType !== selectedType) return false;
    return true;
  });

  const formatDelay = (delay: { value: number; unit: 'hours' | 'days' }) => {
    if (delay.unit === 'hours') {
      return delay.value === 1 ? '1 hora' : `${delay.value} horas`;
    }
    return delay.value === 1 ? '1 día' : `${delay.value} días`;
  };

  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-200 dark:from-purple-900/50 dark:to-pink-900/40 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-200" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Detección de Gaps en Journeys
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            La IA detecta gaps en tus journeys (ej: falta mensaje post-compra) y los completa automáticamente.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="purple" size="md">
            {dashboard.totalGaps} gaps detectados
          </Badge>
          {onSettingsEdit && (
            <Button
              size="sm"
              variant="ghost"
              leftIcon={<Filter className="w-4 h-4" />}
              onClick={onSettingsEdit}
            >
              Configurar
            </Button>
          )}
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border border-red-200 dark:border-red-800 p-4">
          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
            Críticos
          </p>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <span className={`${ds.typography.h3} text-red-600 dark:text-red-400`}>
              {dashboard.bySeverity.critical}
            </span>
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 p-4">
          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
            Contactos afectados
          </p>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className={`${ds.typography.h3} text-blue-600 dark:text-blue-400`}>
              {dashboard.totalAffectedContacts.toLocaleString('es-ES')}
            </span>
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border border-green-200 dark:border-green-800 p-4">
          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
            Mejora estimada
          </p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            <span className={`${ds.typography.h3} text-green-600 dark:text-green-400`}>
              +{dashboard.estimatedConversionImprovement.toFixed(1)}%
            </span>
          </div>
        </div>
        <div className="rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 p-4">
          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
            Impacto en ingresos
          </p>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className={`${ds.typography.h3} text-purple-600 dark:text-purple-400`}>
              {CampanasAutomatizacionService.formatCurrency(dashboard.estimatedRevenueImpact)}
            </span>
          </div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-slate-500 dark:text-slate-400" />
          <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
            Severidad:
          </span>
          <select
            value={selectedSeverity}
            onChange={(e) => setSelectedSeverity(e.target.value as JourneyGapSeverity | 'all')}
            className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Todas</option>
            <option value="critical">Crítica</option>
            <option value="high">Alta</option>
            <option value="medium">Media</option>
            <option value="low">Baja</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
            Tipo:
          </span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as JourneyGapType | 'all')}
            className="px-3 py-1.5 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="all">Todos</option>
            {Object.entries(gapTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Lista de gaps */}
      {filteredGaps.length === 0 ? (
        <div className="text-center py-12">
          <CheckCircle className="w-16 h-16 text-green-500 dark:text-green-400 mx-auto mb-4" />
          <p className={`${ds.typography.body} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
            No hay gaps detectados
          </p>
          <p className={`${ds.typography.bodySmall} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
            Tus journeys están completos. La IA seguirá monitoreando y detectará cualquier gap nuevo.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredGaps.map((gap) => {
            const severityColor = severityColors[gap.severity];
            const isExpanded = expandedGaps.has(gap.id);
            return (
              <div
                key={gap.id}
                className={`rounded-2xl border ${severityColor.border} ${severityColor.bg} p-5 transition-all`}
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h3 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {gap.sequenceName}
                      </h3>
                      <Badge
                        variant={gap.severity === 'critical' ? 'red' : gap.severity === 'high' ? 'orange' : 'yellow'}
                        size="sm"
                      >
                        {gap.severity.toUpperCase()}
                      </Badge>
                      <Badge variant="blue" size="sm">
                        {gapTypeLabels[gap.gapType]}
                      </Badge>
                      {gap.autoFillEnabled && (
                        <Badge variant="purple" size="sm">
                          <Zap className="w-3 h-3 mr-1" />
                          Auto-fill disponible
                        </Badge>
                      )}
                      <Badge variant="gray" size="sm">
                        {gap.aiConfidence}% confianza IA
                      </Badge>
                    </div>
                    <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-3`}>
                      {gap.description}
                    </p>
                    <div className="flex items-center gap-4 flex-wrap text-sm">
                      <div className="flex items-center gap-1">
                        <Users className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                        <span className={ds.color.textSecondary + ' ' + ds.color.textSecondaryDark}>
                          {gap.impact.affectedContacts} contactos afectados
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4 text-green-500" />
                        <span className="text-green-600 dark:text-green-400 font-medium">
                          +{gap.impact.estimatedConversionImprovement.toFixed(1)}% mejora estimada
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => toggleGapExpansion(gap.id)}
                    className="flex-shrink-0 p-2 rounded-lg hover:bg-white/50 dark:hover:bg-slate-800/50 transition-colors"
                  >
                    {isExpanded ? (
                      <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    ) : (
                      <ArrowRight className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    )}
                  </button>
                </div>

                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 space-y-4">
                    {/* Paso sugerido */}
                    <div className="rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <MessageSquare className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                        <h4 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          Paso sugerido
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <div>
                          <p className={`${ds.typography.caption} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
                            {gap.expectedStep.name}
                          </p>
                          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                            {gap.expectedStep.description}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 flex-wrap text-sm">
                          <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                            <span className={ds.color.textSecondary + ' ' + ds.color.textSecondaryDark}>
                              Delay: {formatDelay(gap.expectedStep.suggestedDelay)}
                            </span>
                          </div>
                          <Badge variant="blue" size="sm">
                            {gap.expectedStep.suggestedChannel}
                          </Badge>
                          {gap.expectedStep.suggestedTiming && (
                            <span className={ds.color.textSecondary + ' ' + ds.color.textSecondaryDark}>
                              Hora: {gap.expectedStep.suggestedTiming}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Contenido sugerido */}
                    <div className="rounded-xl bg-white/70 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4">
                      <div className="flex items-center gap-2 mb-3">
                        <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
                        <h4 className={`${ds.typography.h4} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          Contenido sugerido por IA
                        </h4>
                      </div>
                      <div className="space-y-3">
                        {gap.suggestedContent.subject && (
                          <div>
                            <p className={`${ds.typography.caption} font-medium ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
                              Asunto:
                            </p>
                            <p className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                              {gap.suggestedContent.subject}
                            </p>
                          </div>
                        )}
                        <div>
                          <p className={`${ds.typography.caption} font-medium ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
                            Mensaje:
                          </p>
                          <p className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} whitespace-pre-wrap`}>
                            {gap.suggestedContent.message}
                          </p>
                        </div>
                        {gap.suggestedContent.cta && (
                          <div>
                            <p className={`${ds.typography.caption} font-medium ${ds.color.textMuted} ${ds.color.textMutedDark} mb-1`}>
                              CTA:
                            </p>
                            <p className={`${ds.typography.bodySmall} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                              {gap.suggestedContent.cta}
                            </p>
                          </div>
                        )}
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                            Variables:
                          </span>
                          {gap.suggestedContent.variables.map((variable, idx) => (
                            <Badge key={idx} variant="gray" size="sm">
                              {`{${variable}}`}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex items-center gap-2 pt-3 border-t border-slate-200 dark:border-slate-700 flex-wrap">
                      {gap.autoFillEnabled && onGapAutoFill && (
                        <Button
                          size="sm"
                          leftIcon={<Zap className="w-4 h-4" />}
                          onClick={() => onGapAutoFill(gap.id)}
                          className="bg-purple-600 hover:bg-purple-700 text-white"
                        >
                          Completar automáticamente
                        </Button>
                      )}
                      {onGapAccept && (
                        <Button
                          size="sm"
                          variant="secondary"
                          leftIcon={<CheckCircle className="w-4 h-4" />}
                          onClick={() => onGapAccept(gap.id)}
                        >
                          Aceptar
                        </Button>
                      )}
                      {onViewGap && (
                        <Button
                          size="sm"
                          variant="ghost"
                          leftIcon={<MessageSquare className="w-4 h-4" />}
                          onClick={() => onViewGap(gap)}
                        >
                          Ver detalles
                        </Button>
                      )}
                      {onGapReject && (
                        <Button
                          size="sm"
                          variant="ghost"
                          leftIcon={<X className="w-4 h-4" />}
                          onClick={() => onGapReject(gap.id)}
                          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
                        >
                          Rechazar
                        </Button>
                      )}
                      {onGapDismiss && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => onGapDismiss(gap.id)}
                        >
                          Descartar
                        </Button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Información adicional */}
      <div className="mt-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 border border-purple-200 dark:border-purple-800 p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
          <div>
            <p className={`${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-1`}>
              Análisis automático de gaps
            </p>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              La IA analiza tus journeys automáticamente y detecta gaps como mensajes faltantes post-compra, seguimientos
              pendientes, o oportunidades de reactivación. Última análisis: {new Date(dashboard.lastAnalysisDate).toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};

