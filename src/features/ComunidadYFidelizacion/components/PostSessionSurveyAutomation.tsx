import { useState } from 'react';
import { MessageSquare, AlertTriangle, Star, Mail, MessageCircle, Settings, CheckCircle2, Clock } from 'lucide-react';
import { Card, Badge, Button, Modal, Select, Input, Textarea, Switch } from '../../../components/componentsreutilizables';
import { PostSessionSurvey, PostSessionSurveyConfig } from '../types';

interface PostSessionSurveyAutomationProps {
  surveys: PostSessionSurvey[];
  config?: PostSessionSurveyConfig;
  loading?: boolean;
  onUpdateConfig?: (config: Partial<PostSessionSurveyConfig>) => void;
  onViewSurvey?: (surveyId: string) => void;
}

export function PostSessionSurveyAutomation({
  surveys,
  config,
  loading,
  onUpdateConfig,
  onViewSurvey,
}: PostSessionSurveyAutomationProps) {
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isViewingSurvey, setIsViewingSurvey] = useState<PostSessionSurvey | null>(null);

  const negativeFeedbackSurveys = surveys.filter((s) => s.hasNegativeFeedback && s.status === 'responded');
  const recentSurveys = surveys.slice(0, 10);
  const pendingSurveys = surveys.filter((s) => s.status === 'pending' || s.status === 'sent');
  const respondedSurveys = surveys.filter((s) => s.status === 'responded');

  const averageScore =
    respondedSurveys.length > 0
      ? respondedSurveys.reduce((acc, s) => acc + (s.satisfactionScore || 0), 0) / respondedSurveys.length
      : 0;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderStars = (score?: number) => {
    if (!score) return null;
    return (
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`w-4 h-4 ${
              star <= score
                ? 'fill-amber-400 text-amber-400'
                : 'fill-slate-200 text-slate-300 dark:fill-slate-700 dark:text-slate-600'
            }`}
          />
        ))}
        <span className="ml-1 text-sm font-semibold text-slate-700 dark:text-slate-300">{score.toFixed(1)}</span>
      </div>
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-6">
          {/* Alertas de feedback negativo */}
          {negativeFeedbackSurveys.length > 0 && (
            <Card className="bg-rose-50/80 dark:bg-rose-900/20 border-rose-200 dark:border-rose-900/40">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-rose-600 dark:text-rose-400 flex-shrink-0 mt-0.5" />
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-rose-900 dark:text-rose-100">
                    Alertas: Feedback negativo detectado
                  </h3>
                  <p className="text-sm text-rose-700 dark:text-rose-300 mt-1">
                    {negativeFeedbackSurveys.length} cliente{negativeFeedbackSurveys.length !== 1 ? 's' : ''} ha{' '}
                    {negativeFeedbackSurveys.length !== 1 ? 'n' : ''} dado feedback negativo recientemente.
                  </p>
                  <div className="mt-4 space-y-2">
                    {negativeFeedbackSurveys.slice(0, 3).map((survey) => (
                      <div
                        key={survey.id}
                        className="rounded-lg border border-rose-200 dark:border-rose-900/60 bg-white dark:bg-slate-800/50 p-3 cursor-pointer hover:shadow-sm transition-shadow"
                        onClick={() => {
                          setIsViewingSurvey(survey);
                          if (onViewSurvey) onViewSurvey(survey.id);
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-semibold text-slate-900 dark:text-slate-100">{survey.clientName}</p>
                            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
                              Sesión: {formatDate(survey.sessionDate)}
                            </p>
                          </div>
                          {renderStars(survey.satisfactionScore)}
                        </div>
                        {survey.comment && (
                          <p className="text-sm text-rose-700 dark:text-rose-300 mt-2 line-clamp-2">
                            "{survey.comment}"
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Lista de encuestas */}
          <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                  Encuestas post-sesión automáticas
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Encuestas que se envían automáticamente 2-4 horas después de cada sesión por WhatsApp o email.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  leftIcon={<Settings className="w-4 h-4" />}
                  onClick={() => setIsConfigModalOpen(true)}
                >
                  Configurar
                </Button>
              </div>
            </div>

            {/* Estadísticas rápidas */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Puntuación promedio</p>
                <div className="mt-2 flex items-center gap-2">
                  {renderStars(averageScore)}
                </div>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Respondidas</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {respondedSurveys.length}
                </p>
              </div>
              <div className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50 dark:bg-slate-800/50">
                <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400">Pendientes</p>
                <p className="mt-2 text-2xl font-semibold text-slate-900 dark:text-slate-100">
                  {pendingSurveys.length}
                </p>
              </div>
            </div>

            <div className="mt-6">
              {loading ? (
                <div className="space-y-3">
                  {[...Array(5)].map((_, i) => (
                    <div key={i} className="h-20 animate-pulse rounded-lg bg-slate-200 dark:bg-slate-800" />
                  ))}
                </div>
              ) : recentSurveys.length === 0 ? (
                <div className="py-12 text-center">
                  <MessageSquare className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    No hay encuestas post-sesión registradas.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {recentSurveys.map((survey) => (
                    <div
                      key={survey.id}
                      className={`rounded-lg border p-4 transition-all cursor-pointer hover:shadow-sm ${
                        survey.hasNegativeFeedback
                          ? 'border-rose-200 bg-rose-50/50 dark:border-rose-900/40 dark:bg-rose-900/10'
                          : 'border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800/50'
                      }`}
                      onClick={() => {
                        setIsViewingSurvey(survey);
                        if (onViewSurvey) onViewSurvey(survey.id);
                      }}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-semibold text-slate-900 dark:text-slate-100">{survey.clientName}</h4>
                            <Badge
                              variant={survey.status === 'responded' ? 'green' : survey.status === 'sent' ? 'blue' : 'secondary'}
                              size="sm"
                            >
                              {survey.status === 'responded'
                                ? 'Respondida'
                                : survey.status === 'sent'
                                ? 'Enviada'
                                : survey.status === 'expired'
                                ? 'Expirada'
                                : 'Pendiente'}
                            </Badge>
                            {survey.hasNegativeFeedback && (
                              <Badge variant="destructive" size="sm">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Negativo
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <span>Sesión: {formatDate(survey.sessionDate)}</span>
                            {survey.surveySentAt && <span>Enviada: {formatDate(survey.surveySentAt)}</span>}
                            {survey.responseReceivedAt && (
                              <span>Respondida: {formatDate(survey.responseReceivedAt)}</span>
                            )}
                          </div>
                          {survey.satisfactionScore && (
                            <div className="flex items-center gap-2">
                              {renderStars(survey.satisfactionScore)}
                            </div>
                          )}
                          {survey.comment && (
                            <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                              "{survey.comment}"
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          {survey.surveyChannel === 'whatsapp' ? (
                            <MessageCircle className="w-4 h-4 text-slate-400" />
                          ) : (
                            <Mail className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Panel de configuración */}
        <div>
          <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Estado de automatización</h3>
            </div>
            <div className="mt-6 space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-300">Automatización activa</span>
                <Badge variant={config?.enabled ? 'green' : 'secondary'} size="sm">
                  {config?.enabled ? (
                    <span className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Activa
                    </span>
                  ) : (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      Inactiva
                    </span>
                  )}
                </Badge>
              </div>
              {config && (
                <>
                  <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
                    <p className="text-xs uppercase tracking-wide text-slate-500 dark:text-slate-400 mb-2">
                      Configuración actual
                    </p>
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Retraso:</span>{' '}
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {config.delayHours} horas
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Canal:</span>{' '}
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {config.channel === 'both' ? 'WhatsApp y Email' : config.channel === 'whatsapp' ? 'WhatsApp' : 'Email'}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Umbral negativo:</span>{' '}
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          ≤ {config.negativeThreshold} estrellas
                        </span>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <Button
                variant="secondary"
                className="w-full"
                leftIcon={<Settings className="w-4 h-4" />}
                onClick={() => setIsConfigModalOpen(true)}
              >
                Configurar automatización
              </Button>
            </div>
          </Card>
        </div>
      </div>

      {/* Modal de configuración */}
      <Modal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        title="Configurar encuesta automática post-sesión"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsConfigModalOpen(false)}>
              Cancelar
            </Button>
            <Button
              onClick={() => {
                if (onUpdateConfig && config) {
                  onUpdateConfig(config);
                }
                setIsConfigModalOpen(false);
              }}
            >
              Guardar configuración
            </Button>
          </>
        }
      >
        {config && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  Activar automatización
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Las encuestas se enviarán automáticamente después de cada sesión
                </p>
              </div>
              <Switch
                checked={config.enabled}
                onChange={(checked) => onUpdateConfig?.({ ...config, enabled: checked })}
              />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Retraso (horas)"
                type="number"
                min="2"
                max="4"
                value={config.delayHours.toString()}
                onChange={(e) =>
                  onUpdateConfig?.({ ...config, delayHours: parseInt(e.target.value) || 2 })
                }
                placeholder="2-4 horas"
              />
              <Select
                label="Canal de envío"
                value={config.channel}
                onChange={(e) =>
                  onUpdateConfig?.({
                    ...config,
                    channel: e.target.value as 'whatsapp' | 'email' | 'both',
                  })
                }
                options={[
                  { label: 'WhatsApp', value: 'whatsapp' },
                  { label: 'Email', value: 'email' },
                  { label: 'Ambos', value: 'both' },
                ]}
              />
            </div>

            <Textarea
              label="Pregunta de satisfacción"
              value={config.question}
              onChange={(e) => onUpdateConfig?.({ ...config, question: e.target.value })}
              rows={2}
              placeholder="Ej: ¿Cómo calificarías tu sesión de hoy? (1-5 estrellas)"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Permitir comentarios
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Los clientes pueden agregar un comentario opcional
                  </p>
                </div>
                <Switch
                  checked={config.allowComment}
                  onChange={(checked) => onUpdateConfig?.({ ...config, allowComment: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                    Alerta en feedback negativo
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Recibir alerta cuando haya feedback negativo
                  </p>
                </div>
                <Switch
                  checked={config.autoAlertOnNegative}
                  onChange={(checked) => onUpdateConfig?.({ ...config, autoAlertOnNegative: checked })}
                />
              </div>
            </div>

            {config.autoAlertOnNegative && (
              <Input
                label="Umbral de feedback negativo"
                type="number"
                min="1"
                max="5"
                value={config.negativeThreshold.toString()}
                onChange={(e) =>
                  onUpdateConfig?.({ ...config, negativeThreshold: parseInt(e.target.value) || 3 })
                }
                placeholder="Puntuación ≤ X se considera negativo"
                helperText="Las encuestas con puntuación igual o menor a este valor generarán una alerta"
              />
            )}
          </div>
        )}
      </Modal>

      {/* Modal de vista de encuesta */}
      <Modal
        isOpen={isViewingSurvey !== null}
        onClose={() => setIsViewingSurvey(null)}
        title="Detalles de encuesta post-sesión"
        size="md"
        footer={
          <Button variant="secondary" onClick={() => setIsViewingSurvey(null)}>
            Cerrar
          </Button>
        }
      >
        {isViewingSurvey && (
          <div className="space-y-4">
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Cliente</p>
              <p className="text-base text-slate-700 dark:text-slate-300">{isViewingSurvey.clientName}</p>
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">Fecha de sesión</p>
              <p className="text-base text-slate-700 dark:text-slate-300">
                {formatDate(isViewingSurvey.sessionDate)}
              </p>
            </div>
            {isViewingSurvey.satisfactionScore && (
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">
                  Puntuación de satisfacción
                </p>
                {renderStars(isViewingSurvey.satisfactionScore)}
              </div>
            )}
            {isViewingSurvey.comment && (
              <div>
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2">Comentario</p>
                <p className="text-base text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-lg">
                  "{isViewingSurvey.comment}"
                </p>
              </div>
            )}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Canal</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 mt-1">
                    {isViewingSurvey.surveyChannel === 'whatsapp' ? 'WhatsApp' : 'Email'}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500 dark:text-slate-400">Estado</p>
                  <p className="font-semibold text-slate-900 dark:text-slate-100 mt-1">
                    {isViewingSurvey.status === 'responded'
                      ? 'Respondida'
                      : isViewingSurvey.status === 'sent'
                      ? 'Enviada'
                      : isViewingSurvey.status === 'expired'
                      ? 'Expirada'
                      : 'Pendiente'}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}

