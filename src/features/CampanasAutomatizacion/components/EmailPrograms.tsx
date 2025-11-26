import React, { useState } from 'react';
import { Badge, Button, Card, Modal } from '../../../components/componentsreutilizables';
import { Mail, Flame, Inbox, Wand2 } from 'lucide-react';
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
  const [isEmailMarketingModalOpen, setIsEmailMarketingModalOpen] = useState(false);
  const [isNewsletterModalOpen, setIsNewsletterModalOpen] = useState(false);
  const newsletterPrograms = programs.filter((program) => program.type === 'newsletter');
  const emailMarketingPrograms = programs.filter((program) => program.type !== 'newsletter');

  const renderTable = (
    title: string,
    description: string,
    items: EmailProgram[],
    emptyState: string,
    onCreate: () => void,
    createLabel: string
  ) => {
    return (
      <Card>
        <div className="flex items-start justify-between mb-5">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-100 to-sky-200 flex items-center justify-center">
                <Mail className="w-5 h-5 text-blue-600" />
              </span>
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {title}
              </h2>
            </div>
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              {description}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge variant="blue" size="md">
              {items.length} programas
            </Badge>
            <Button variant="primary" size="sm" onClick={onCreate}>
              {createLabel}
            </Button>
          </div>
        </div>

        {items.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-6 text-center">
            <p className={`${ds.typography.bodySmall} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
              {emptyState}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-left">
              <thead className="bg-slate-50/80 dark:bg-slate-900/40">
                <tr className={`${ds.typography.caption} uppercase tracking-wide text-slate-500 dark:text-slate-400`}>
                  <th className="px-4 py-3 font-medium">Programa</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Cadencia · Audiencia</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Open rate</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">CTR</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Revenue atribuido</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">Mejor asunto</th>
                  <th className="px-4 py-3 font-medium whitespace-nowrap">IA</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {items.map((program) => {
                  const badge = typeBadge[program.type];
                  return (
                    <tr key={program.id} className="bg-white/80 dark:bg-[#0f172a]/70">
                      <td className="px-4 py-4 align-top">
                        <div className="flex flex-col gap-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                              {program.name}
                            </span>
                            <Badge variant={badge.variant}>{badge.label}</Badge>
                            <Badge
                              variant={
                                program.status === 'running'
                                  ? 'green'
                                  : program.status === 'completed'
                                  ? 'gray'
                                  : 'yellow'
                              }
                            >
                              {program.status === 'running'
                                ? 'Activo'
                                : program.status === 'completed'
                                ? 'Completado'
                                : 'Pendiente'}
                            </Badge>
                          </div>
                          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                            ID #{program.id}
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="space-y-1">
                          <p className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                            {program.cadence}
                          </p>
                          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                            {program.audienceSize.toLocaleString('es-ES')} contactos
                          </p>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex items-center gap-2">
                          <Inbox className="w-4 h-4 text-indigo-500" />
                          <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                            {CampanasAutomatizacionService.formatPercentage(program.openRate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className="flex items-center gap-2">
                          <Flame className="w-4 h-4 text-rose-500" />
                          <span className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                            {CampanasAutomatizacionService.formatPercentage(program.clickRate)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <div className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimaryDark}`}>
                          {CampanasAutomatizacionService.formatCurrency(program.revenueAttributed)}
                        </div>
                      </td>
                      <td className="px-4 py-4 align-top">
                        <p className={`${ds.typography.caption} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                          {program.bestSubject ?? 'Recopilando datos'}
                        </p>
                      </td>
                      <td className="px-4 py-4 align-top">
                        {program.aiRecommendation ? (
                          <div className="flex flex-col gap-2">
                            <Badge
                              variant="purple"
                              className="uppercase tracking-wider font-semibold"
                              leftIcon={<Wand2 className="w-3.5 h-3.5" />}
                            >
                              Sugerencia IA
                            </Badge>
                            <p className={`${ds.typography.caption} ${ds.color.textPrimaryDark}`}>
                              {program.aiRecommendation}
                            </p>
                          </div>
                        ) : (
                          <p className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                            Sin sugerencias
                          </p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </Card>
    );
  };

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
    <div className={`space-y-8 ${className}`}>
      {renderTable(
        'Email marketing',
        'Rendimiento de programas de nutring, activación y retención.',
        emailMarketingPrograms,
        'No hay programas de email marketing todavía.',
        () => setIsEmailMarketingModalOpen(true),
        'Nuevo programa'
      )}
      {renderTable(
        'Newsletters',
        'Monitoriza tus publicaciones periódicas y recomendaciones IA.',
        newsletterPrograms,
        'No hay newsletters activas todavía.',
        () => setIsNewsletterModalOpen(true),
        'Nueva edición'
      )}

      <Modal
        isOpen={isEmailMarketingModalOpen}
        onClose={() => setIsEmailMarketingModalOpen(false)}
        title="Crear programa de email marketing"
        size="md"
      >
        <div className="space-y-6">
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Define un nuevo flujo de email marketing para nutrir, activar y fidelizar audiencias en distintas etapas.
          </p>
          <form className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-300">
                Datos principales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Nombre del programa
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="Ej. Activación leads trial"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Responsable
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="Nombre del owner"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Objetivo principal
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="Ej. Convertir leads trial en pago"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Fase del funnel
                  </label>
                  <select className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100">
                    <option value="awareness">Awareness</option>
                    <option value="consideration">Consideración</option>
                    <option value="activation">Activación</option>
                    <option value="retention">Retención</option>
                    <option value="loyalty">Fidelización</option>
                  </select>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-300">
                Cadencia & segmentación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Cadencia inicial
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="Ej. 3 emails · 14 días"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Segmentos objetivo
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="Ej. Leads trial · Clientes nuevos 0-30 días"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Fecha de inicio
                  </label>
                  <input
                    type="date"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Presupuesto estimado
                  </label>
                  <input
                    type="number"
                    min={0}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="Ej. 1200"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                  Notas internas
                </label>
                <textarea
                  rows={3}
                  className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  placeholder="Checklist de automatizaciones, validaciones legales, etc."
                />
              </div>
            </section>

            <section className="space-y-3">
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
                <input
                  id="email-ai-assisted"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900"
                />
                <label htmlFor="email-ai-assisted" className="text-sm text-slate-600 dark:text-slate-300">
                  Activar optimizaciones automáticas por IA (mejor asuntos, predicción de cadencia)
                </label>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
                <input
                  id="email-a-b-test"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900"
                />
                <label htmlFor="email-a-b-test" className="text-sm text-slate-600 dark:text-slate-300">
                  Configurar test A/B inicial (asunto, contenido o CTA)
                </label>
              </div>
            </section>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" type="button" onClick={() => setIsEmailMarketingModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="button">
                Guardar borrador
              </Button>
            </div>
          </form>
        </div>
      </Modal>

      <Modal
        isOpen={isNewsletterModalOpen}
        onClose={() => setIsNewsletterModalOpen(false)}
        title="Crear nueva newsletter"
        size="md"
      >
        <div className="space-y-6">
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Publica una nueva edición para tu audiencia de newsletter, define CTA y programa su envío.
          </p>
          <form className="space-y-6">
            <section className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-300">
                Contenido & envío
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Título de la edición
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="Ej. Tendencias Q3 · SaaS Growth"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Asunto
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="Asunto atractivo para la audiencia"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Preheader
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="Añade contexto breve (opcional)"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Fecha de envío
                  </label>
                  <input
                    type="datetime-local"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                  />
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h3 className="text-xs font-semibold uppercase tracking-[0.2em] text-indigo-500 dark:text-indigo-300">
                Segmentación & CTA
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Resumen de contenidos
                  </label>
                  <textarea
                    rows={3}
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="Incluye highlights, secciones principales y recursos recomendados"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    Segmento objetivo
                  </label>
                  <input
                    type="text"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="Ej. Comunidad premium · Leads inbound"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                    CTA principal
                  </label>
                  <input
                    type="url"
                    className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
                    placeholder="https://tu-landing.com"
                  />
                </div>
              </div>
              <div className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-2 dark:border-slate-700">
                <input
                  id="newsletter-ai-assisted"
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900"
                />
                <label htmlFor="newsletter-ai-assisted" className="text-sm text-slate-600 dark:text-slate-300">
                  Activar sugerencias IA para subject line, mejores horarios y snippets sociales
                </label>
              </div>
            </section>

            <div className="flex justify-end gap-3">
              <Button variant="ghost" type="button" onClick={() => setIsNewsletterModalOpen(false)}>
                Cancelar
              </Button>
              <Button variant="primary" type="button">
                Programar envío
              </Button>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
};




