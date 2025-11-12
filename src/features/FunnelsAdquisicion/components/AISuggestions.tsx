import React from 'react';
import { ArrowUpRight, BrainCircuit, Rocket, Sparkles } from 'lucide-react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { AcquisitionAISuggestion } from '../types';

interface AISuggestionsProps {
  suggestions: AcquisitionAISuggestion[];
  loading?: boolean;
  className?: string;
}

const impactLabel: Record<
  AcquisitionAISuggestion['impact'],
  { label: string; variant: 'success' | 'warning' | 'secondary' }
> = {
  high: { label: 'Alto impacto', variant: 'success' },
  medium: { label: 'Impacto medio', variant: 'warning' },
  low: { label: 'Impacto ligero', variant: 'secondary' },
};

export const AISuggestions: React.FC<AISuggestionsProps> = ({
  suggestions,
  loading = false,
  className = '',
}) => {
  const placeholders = Array.from({ length: 3 }).map((_, index) => (
    <div key={`acquisition-ai-skeleton-${index}`} className={`${ds.shimmer} h-20`} />
  ));

  return (
    <Card className={`col-span-2 ${className}`.trim()}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-purple-200 flex items-center justify-center">
              <Sparkles className="w-5 h-5 text-purple-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Sugerencias IA · lanza esto hoy
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Prioriza las acciones de captación y cualificación con mayor impacto inmediato.
          </p>
        </div>
        <Button variant="secondary" className="hidden sm:inline-flex items-center gap-2">
          <BrainCircuit className="w-4 h-4" />
          Ver panel IA
        </Button>
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
                    <Button variant="primary" size="md" className="inline-flex items-center gap-2">
                      {suggestion.cta}
                      <ArrowUpRight className="w-4 h-4" />
                    </Button>
                  </div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    <Rocket className="inline-block w-4 h-4 mr-1 text-indigo-500" />
                    {suggestion.rationale}
                  </p>
                </div>
              );
            })}
      </div>
    </Card>
  );
};












