import { useState } from 'react';
import { Star, MessageCircle } from 'lucide-react';
import { Card, Badge, Button, Modal, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { Testimonial } from '../types';

interface TestimonialsShowcaseProps {
  testimonials: Testimonial[];
  loading?: boolean;
}

export function TestimonialsShowcase({ testimonials, loading }: TestimonialsShowcaseProps) {
  const [isRequestModalOpen, setIsRequestModalOpen] = useState(false);
  const [showAdvancedOptions, setShowAdvancedOptions] = useState(false);
  const [notifyTeam, setNotifyTeam] = useState(true);
  const [includeInPlaybook, setIncludeInPlaybook] = useState(false);

  return (
    <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
            Motor de reseñas y testimonios
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-2xl">
            Centraliza la voz del cliente y activa testimonios verificados en landing pages, campañas y
            automatizaciones.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" className="inline-flex items-center gap-2" onClick={() => setIsRequestModalOpen(true)}>
            <MessageCircle className="w-4 h-4" />
            Pedir nuevo testimonio
          </Button>
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800">
          <thead className="bg-slate-50/70 dark:bg-slate-800/60">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Cliente
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Canal
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Testimonio
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Puntuación
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Etiqueta
              </th>
              <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Fecha
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-sm">
            {loading
              ? Array.from({ length: 4 }).map((_, index) => (
                  <tr key={`skeleton-${index}`} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <SkeletonRow />
                  </tr>
                ))
              : testimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="px-4 py-4 align-top">
                      <div className="space-y-1">
                        <p className="font-semibold text-slate-900 dark:text-slate-100">{testimonial.customerName}</p>
                        <p className="text-xs uppercase tracking-wide text-slate-400">{testimonial.role}</p>
                      </div>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <Badge variant="blue" size="sm">
                        {testimonial.channel}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <p className="text-slate-600 dark:text-slate-300 leading-relaxed line-clamp-3">
                        “{testimonial.quote}”
                      </p>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className="inline-flex items-center gap-1.5 text-amber-500 dark:text-amber-300 font-medium">
                        <Star className="w-4 h-4 fill-current" />
                        {testimonial.score.toFixed(1)}
                      </span>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <Badge variant="secondary" size="sm">
                        {testimonial.impactTag}
                      </Badge>
                    </td>
                    <td className="px-4 py-4 align-top">
                      <span className="text-slate-500 dark:text-slate-400">
                        {new Date(testimonial.createdAt).toLocaleDateString('es-ES', {
                          day: '2-digit',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isRequestModalOpen}
        onClose={() => setIsRequestModalOpen(false)}
        title="Solicitar nuevo testimonio"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsRequestModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={() => setIsRequestModalOpen(false)}>Enviar solicitud</Button>
          </>
        }
      >
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="space-y-1">
              <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
                Brief operativo
              </h4>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Completa los datos clave para activar la solicitud con tu equipo y el cliente.
              </p>
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Input label="Nombre del cliente" placeholder="Ej. María Fernández" />
              <Input label="Responsable interno" placeholder="Ej. Ana Ruiz · Customer Marketing" />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <Select
                label="Canal objetivo"
                placeholder="Selecciona un canal"
                options={[
                  { label: 'Email', value: 'email' },
                  { label: 'Video Testimonial', value: 'video' },
                  { label: 'Social Media', value: 'social' },
                  { label: 'Evento en vivo', value: 'event' },
                ]}
              />
              <Input label="Formato preferido" placeholder="Ej. Caso de éxito en video · 2 minutos" />
            </div>
          </div>

          <div className="space-y-4">
            <Textarea
              label="Mensaje personalizado al cliente"
              rows={4}
              placeholder="Comparte contexto, prompts sugeridos y el tipo de resultado que necesitas."
              showCount
              maxLength={600}
            />
            <Textarea
              label="Prompts sugeridos"
              rows={3}
              placeholder="Ej. ¿Qué resultados concretos obtuviste? · ¿Qué momento marcó la diferencia trabajando con nosotros?"
            />
            <div className="flex flex-wrap gap-2">
              {['Impacto en ROI', 'Velocidad de implementación', 'Experiencia del equipo', 'Resultados medibles'].map(
                (tag) => (
                  <Badge key={tag} variant="blue" size="sm">
                    #{tag}
                  </Badge>
                ),
              )}
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-200/70 pt-4 dark:border-slate-800/70">
            <h4 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-400">
              Coordinación interna
            </h4>
            <div className="flex flex-col gap-3">
              <label className="inline-flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900"
                  checked={notifyTeam}
                  onChange={(event) => setNotifyTeam(event.target.checked)}
                />
                Notificar automáticamente al equipo de Customer Success
              </label>
              <label className="inline-flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500 dark:border-slate-600 dark:bg-slate-900"
                  checked={includeInPlaybook}
                  onChange={(event) => setIncludeInPlaybook(event.target.checked)}
                />
                Incluir esta solicitud en el playbook de testimonios
              </label>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
              <span>Estado sugerido:</span>
              <Badge variant="green" size="sm">
                Brief listo
              </Badge>
            </div>
          </div>

          <div className="space-y-3 border-t border-slate-200/70 pt-4 dark:border-slate-800/70">
            <Button
              variant="ghost"
              size="sm"
              className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-300 dark:hover:text-indigo-200"
              onClick={() => setShowAdvancedOptions((prev) => !prev)}
            >
              {showAdvancedOptions ? 'Ocultar opciones avanzadas' : 'Mostrar opciones avanzadas'}
            </Button>

            {showAdvancedOptions && (
              <div className="space-y-4 rounded-2xl border border-slate-200/70 bg-slate-50/70 p-4 dark:border-slate-800/60 dark:bg-slate-900/40">
                <div className="grid gap-4 md:grid-cols-2">
                  <Input label="Fecha objetivo de entrega" type="date" />
                  <Input label="Hora preferida de contacto" type="time" />
                </div>
                <Input
                  label="Link a briefing o assets de referencia"
                  type="url"
                  placeholder="https://tuworkspace.com/brief-testimonio"
                />
                <Textarea
                  label="Notas internas"
                  rows={3}
                  placeholder="Checklist de preparativos, stakeholders involucrados, riesgos y soporte necesario."
                />
              </div>
            )}
          </div>
        </div>
      </Modal>
    </Card>
  );
}

function SkeletonRow() {
  return (
    <>
      {[...Array(6)].map((_, cellIndex) => (
        <td key={cellIndex} className="px-4 py-4">
          <div className="animate-pulse space-y-2">
            <div className="h-3 w-full rounded bg-slate-200/80 dark:bg-slate-800/60" />
            <div className="h-3 w-3/4 rounded bg-slate-200/60 dark:bg-slate-800/50" />
          </div>
        </td>
      ))}
    </>
  );
}



