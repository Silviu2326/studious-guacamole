import React from 'react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { Mail, Flame, Inbox, MessageSquare, Wand2 } from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { CampanasAutomatizacionService } from '../services/campanasAutomatizacionService';
import { EmailProgram } from '../types';

const typeBadge: Record<EmailProgram['type'], { label: string; variant: React.ComponentProps<typeof Badge>['variant'] }> = {
  newsletter: { label: 'Newsletter', variant: 'blue' },
  'product-update': { label: 'Lanzamiento', variant: 'purple' },
  promotion: { label: 'Promoción', variant: 'orange' },
  onboarding: { label: 'Onboarding', variant: 'green' },
  retention: { label: 'Retención', variant: 'yellow' },
};

interface EmailProgramsProps {
  programs: EmailProgram[];
  loading?: boolean;
  className?: string;
}

export const EmailPrograms: React.FC<EmailProgramsProps> = ({ programs, loading = false, className = '' }) => {
  if (loading && programs.length === 0) {
    return (
      <Card className={className}>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`${ds.shimmer} h-28`} />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-5">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-sky-200 flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Email marketing & newsletters
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Monitoriza rendimiento por programa, cadencias y recomendaciones IA.
          </p>
        </div>
        <Badge variant="blue" size="md">
          {programs.length} programas
        </Badge>
      </div>

      <div className="space-y-4">
        {programs.map((program) => {
          const badge = typeBadge[program.type];
          return (
            <div
              key={program.id}
              className="rounded-2xl border border-slate-100 dark:border-slate-800 p-4 bg-white dark:bg-[#0f1828]"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                      {program.name}
                    </h3>
                    <Badge variant={badge.variant}>{badge.label}</Badge>
                    <Badge variant={program.status === 'running' ? 'green' : program.status === 'completed' ? 'gray' : 'yellow'}>
                      {program.status === 'running'
                        ? 'Activo'
                        : program.status === 'completed'
                        ? 'Completado'
                        : 'Pendiente'}
                    </Badge>
                  </div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                    Cadencia: {program.cadence} · Audiencia: {program.audienceSize.toLocaleString('es-ES')} contactos
                  </p>
                </div>
                {program.aiRecommendation && (
                  <Badge
                    variant="purple"
                    className="uppercase tracking-wider font-semibold"
                    leftIcon={<Wand2 className="w-3.5 h-3.5" />}
                  >
                    Sugerencia IA
                  </Badge>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mt-4">
                <div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Open rate</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Inbox className="w-4 h-4 text-indigo-500" />
                    <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                      {CampanasAutomatizacionService.formatPercentage(program.openRate)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>CTR</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Flame className="w-4 h-4 text-rose-500" />
                    <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                      {CampanasAutomatizacionService.formatPercentage(program.clickRate)}
                    </span>
                  </div>
                </div>
                <div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Revenue atribuido</p>
                  <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                    {CampanasAutomatizacionService.formatCurrency(program.revenueAttributed)}
                  </p>
                </div>
                <div>
                  <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>Mejor asunto</p>
                  <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                    {program.bestSubject ?? 'Recopilando datos'}
                  </p>
                </div>
              </div>

              {program.aiRecommendation && (
                <div className="mt-4 flex items-start gap-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/30 p-3">
                  <MessageSquare className="w-4 h-4 mt-0.5 text-indigo-600 dark:text-indigo-300" />
                  <div>
                    <p className={`${ds.typography.caption} uppercase text-indigo-600 dark:text-indigo-300 tracking-[0.2em]`}>
                      Próxima optimización sugerida
                    </p>
                    <p className={`${ds.typography.bodySmall} ${ds.color.textPrimaryDark}`}>{program.aiRecommendation}</p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
};



