import React, { useState } from 'react';
import { ArrowUpRight, BrainCircuit, Sparkles, BookOpen, Save, X, Filter, Megaphone, Check, XCircle } from 'lucide-react';
import { Badge, Button, Card, Input, Modal } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { AISuggestion, MarketingOverviewPeriod, InsightSource } from '../types';
import { MarketingOverviewService } from '../services/marketingOverviewService';
import { CreateFunnelCampaignModal } from './CreateFunnelCampaignModal';

interface AISuggestionsProps {
  suggestions: AISuggestion[];
  loading?: boolean;
  className?: string;
  period?: MarketingOverviewPeriod;
  onSuggestionAction?: (suggestionId: string, action: 'accept' | 'reject') => void;
}

const impactLabel: Record<AISuggestion['impact'], { label: string; variant: 'success' | 'warning' | 'secondary' }> = {
  high: { label: 'Alto impacto', variant: 'success' },
  medium: { label: 'Impacto medio', variant: 'warning' },
  low: { label: 'Impacto ligero', variant: 'secondary' },
};

export const AISuggestions: React.FC<AISuggestionsProps> = ({
  suggestions,
  loading = false,
  className = '',
  period = '30d',
  onSuggestionAction,
}) => {
  const [showPlaybookModal, setShowPlaybookModal] = useState(false);
  const [selectedSuggestions, setSelectedSuggestions] = useState<AISuggestion[]>([]);
  const [playbookName, setPlaybookName] = useState('');
  const [playbookDescription, setPlaybookDescription] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [savedSuccessfully, setSavedSuccessfully] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<InsightSource | null>(null);
  const [processingActions, setProcessingActions] = useState<Set<string>>(new Set());

  const placeholders = Array.from({ length: 3 }).map((_, index) => (
    <div key={`ai-skeleton-${index}`} className={`${ds.shimmer} h-20`} />
  ));

  const handleSaveAsPlaybook = (suggestionIds?: string[]) => {
    const suggestionsToSave = suggestionIds
      ? suggestions.filter((s) => suggestionIds.includes(s.id))
      : suggestions;
    
    if (suggestionsToSave.length === 0) return;
    
    setSelectedSuggestions(suggestionsToSave);
    setPlaybookName(`Playbook ${new Date().toLocaleDateString('es-ES')}`);
    setPlaybookDescription('');
    setShowPlaybookModal(true);
  };

  const handleSavePlaybook = async () => {
    if (!playbookName.trim() || selectedSuggestions.length === 0) return;

    setIsSaving(true);
    try {
      await MarketingOverviewService.createPlaybook(
        playbookName.trim(),
        selectedSuggestions,
        period,
        true,
        playbookDescription.trim() || undefined
      );
      setSavedSuccessfully(true);
      setTimeout(() => {
        setShowPlaybookModal(false);
        setSavedSuccessfully(false);
        setPlaybookName('');
        setPlaybookDescription('');
        setSelectedSuggestions([]);
      }, 1500);
    } catch (error) {
      console.error('Error guardando playbook:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleAccept = async (suggestion: AISuggestion) => {
    setProcessingActions(prev => new Set(prev).add(suggestion.id));
    try {
      await MarketingOverviewService.submitFeedback(
        suggestion.id,
        'ai_suggestion',
        'accept',
        undefined,
        suggestion,
        { period }
      );
      onSuggestionAction?.(suggestion.id, 'accept');
    } catch (error) {
      console.error('Error aceptando sugerencia:', error);
    } finally {
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(suggestion.id);
        return newSet;
      });
    }
  };

  const handleReject = async (suggestion: AISuggestion) => {
    setProcessingActions(prev => new Set(prev).add(suggestion.id));
    try {
      await MarketingOverviewService.submitFeedback(
        suggestion.id,
        'ai_suggestion',
        'reject',
        'Rechazado por el usuario',
        undefined,
        { period }
      );
      onSuggestionAction?.(suggestion.id, 'reject');
    } catch (error) {
      console.error('Error rechazando sugerencia:', error);
    } finally {
      setProcessingActions(prev => {
        const newSet = new Set(prev);
        newSet.delete(suggestion.id);
        return newSet;
      });
    }
  };

  return (
    <Card className={`col-span-2 ${className}`.trim()}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Sugerencias inteligentes
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Acciones priorizadas por IA para mover métricas hoy mismo.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="secondary"
            onClick={() => handleSaveAsPlaybook()}
            className="hidden sm:inline-flex items-center gap-2"
          >
            <BookOpen className="w-4 h-4" />
            Guardar como playbook
          </Button>
          <Button variant="secondary" className="hidden sm:inline-flex items-center gap-2">
            <BrainCircuit className="w-4 h-4" />
            Ver playbook IA
          </Button>
        </div>
      </div>

      <div className="space-y-4">
        {loading && suggestions.length === 0
          ? placeholders
          : suggestions.map((suggestion) => {
              const impact = impactLabel[suggestion.impact];
              return (
                <div
                  key={suggestion.id}
                  className="rounded-2xl border border-gray-100 dark:border-gray-900 p-4 bg-white/80 dark:bg-[#111827]/80 backdrop-blur"
                >
                  <div className="flex flex-wrap items-start justify-between gap-3 mb-2">
                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {suggestion.title}
                        </h3>
                        <Badge variant={impact.variant}>{impact.label}</Badge>
                      </div>
                      <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                        {suggestion.description}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSaveAsPlaybook([suggestion.id])}
                        className="inline-flex items-center gap-1"
                        title="Guardar esta sugerencia como playbook"
                      >
                        <Save className="w-3 h-3" />
                      </Button>
                      <div className="flex gap-2">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => {
                            setSelectedInsight({
                              type: 'suggestion',
                              id: suggestion.id,
                              title: suggestion.title,
                              description: suggestion.description,
                              data: suggestion,
                            });
                            setShowCreateModal(true);
                          }}
                          className="inline-flex items-center gap-1"
                          title="Crear funnel o campaña desde este insight"
                        >
                          <Filter className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleReject(suggestion)}
                          disabled={processingActions.has(suggestion.id)}
                          className="inline-flex items-center gap-1 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                          title="Rechazar esta sugerencia"
                        >
                          <XCircle className="w-3 h-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleAccept(suggestion)}
                          disabled={processingActions.has(suggestion.id)}
                          className="inline-flex items-center gap-1 text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300"
                          title="Aceptar esta sugerencia"
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                        <Button variant="primary" size="md" className="inline-flex items-center gap-2">
                          {suggestion.cta}
                          <ArrowUpRight className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    {suggestion.rationale}
                  </p>
                </div>
              );
            })}
      </div>

      {/* Modal para guardar playbook */}
      {showPlaybookModal && (
        <Modal
          isOpen={showPlaybookModal}
          onClose={() => {
            setShowPlaybookModal(false);
            setPlaybookName('');
            setPlaybookDescription('');
            setSelectedSuggestions([]);
          }}
          title="Guardar sugerencias como playbook"
        >
          <div className="space-y-4">
            <div>
              <label className={`block ${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                Nombre del playbook *
              </label>
              <Input
                value={playbookName}
                onChange={(e) => setPlaybookName(e.target.value)}
                placeholder="Ej: Estrategia de retargeting Q4"
                disabled={isSaving}
              />
            </div>
            <div>
              <label className={`block ${ds.typography.label} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                Descripción (opcional)
              </label>
              <textarea
                value={playbookDescription}
                onChange={(e) => setPlaybookDescription(e.target.value)}
                placeholder="Describe el propósito de este playbook..."
                className={`w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 ${ds.color.textPrimary} ${ds.color.textPrimaryDark} focus:outline-none focus:ring-2 focus:ring-indigo-500`}
                rows={3}
                disabled={isSaving}
              />
            </div>
            <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-900/50">
              <p className={`text-sm ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                Sugerencias incluidas:
              </p>
              <ul className="space-y-1">
                {selectedSuggestions.map((s) => (
                  <li key={s.id} className={`text-sm ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                    • {s.title}
                  </li>
                ))}
              </ul>
            </div>
            {savedSuccessfully && (
              <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                <p className={`text-sm text-green-700 dark:text-green-300`}>
                  ✓ Playbook guardado exitosamente
                </p>
              </div>
            )}
            <div className="flex justify-end gap-2 pt-4 border-t border-gray-200 dark:border-gray-800">
              <Button
                variant="secondary"
                onClick={() => {
                  setShowPlaybookModal(false);
                  setPlaybookName('');
                  setPlaybookDescription('');
                  setSelectedSuggestions([]);
                }}
                disabled={isSaving}
              >
                <X className="w-4 h-4" />
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleSavePlaybook}
                disabled={!playbookName.trim() || isSaving || savedSuccessfully}
                className="inline-flex items-center gap-2"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Guardando...' : savedSuccessfully ? 'Guardado' : 'Guardar playbook'}
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal para crear funnel/campaña */}
      <CreateFunnelCampaignModal
        isOpen={showCreateModal}
        onClose={() => {
          setShowCreateModal(false);
          setSelectedInsight(null);
        }}
        insight={selectedInsight}
        onSuccess={(draft) => {
          console.log('Funnel/Campaña creado:', draft);
        }}
      />
    </Card>
  );
};


