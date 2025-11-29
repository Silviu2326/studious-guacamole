import { useState, useEffect } from 'react';
import { Zap, Settings, RefreshCw, CheckCircle2, TrendingUp, Filter, Globe, Mail, Share2 } from 'lucide-react';
import { Card, Badge, Button, Modal, Select, Input, Switch, Tabs } from '../../../components/componentsreutilizables';
import { CommunityFidelizacionService } from '../services/communityFidelizacionService';
import {
  BestReviewConfig,
  AutoPublishedReview,
  Testimonial,
  AutoPublishTarget,
  BestReviewCriteria,
} from '../types';

interface BestReviewsAutoPublishProps {
  testimonials: Testimonial[];
  loading?: boolean;
}

const CRITERIA_OPTIONS: { value: BestReviewCriteria; label: string; description: string }[] = [
  { value: 'composite', label: 'Compuesto', description: 'Combina score, recencia y completitud' },
  { value: 'score', label: 'Por puntuación', description: 'Solo por calificación (estrellas)' },
  { value: 'recency', label: 'Por recencia', description: 'Las más recientes primero' },
  { value: 'completeness', label: 'Por completitud', description: 'Con más información (tags, media)' },
];

const TARGET_OPTIONS: { value: AutoPublishTarget; label: string; icon: React.ReactNode }[] = [
  { value: 'funnel', label: 'Funnels', icon: <Filter className="w-4 h-4" /> },
  { value: 'landing-page', label: 'Landing Pages', icon: <Globe className="w-4 h-4" /> },
  { value: 'social-content', label: 'Contenido Social', icon: <Share2 className="w-4 h-4" /> },
  { value: 'email-sequence', label: 'Secuencias Email', icon: <Mail className="w-4 h-4" /> },
  { value: 'all', label: 'Todos', icon: <Zap className="w-4 h-4" /> },
];

export function BestReviewsAutoPublish({ testimonials, loading: externalLoading }: BestReviewsAutoPublishProps) {
  const [config, setConfig] = useState<BestReviewConfig | null>(null);
  const [publishedReviews, setPublishedReviews] = useState<AutoPublishedReview[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isConfigModalOpen, setIsConfigModalOpen] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<'config' | 'published'>('published');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [configData, publishedData] = await Promise.all([
        CommunityFidelizacionService.getBestReviewConfig(),
        CommunityFidelizacionService.getAutoPublishedReviews(),
      ]);
      setConfig(configData);
      setPublishedReviews(publishedData);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveConfig = async () => {
    if (!config) return;
    setSaving(true);
    try {
      const updated = await CommunityFidelizacionService.saveBestReviewConfig(config);
      setConfig(updated);
      setIsConfigModalOpen(false);
    } catch (error) {
      console.error('Error guardando configuración:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleRefresh = async () => {
    if (!config) return;
    setIsRefreshing(true);
    try {
      const result = await CommunityFidelizacionService.refreshAutoPublish(config, testimonials);
      setConfig(result.config);
      setPublishedReviews(result.published);
    } catch (error) {
      console.error('Error refrescando publicaciones:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getTargetIcon = (target: AutoPublishTarget) => {
    const option = TARGET_OPTIONS.find((opt) => opt.value === target);
    return option?.icon || <Zap className="w-4 h-4" />;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading || externalLoading) {
    return (
      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-64 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-4 w-96 bg-slate-200 dark:bg-slate-800 rounded" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded" />
        </div>
      </Card>
    );
  }

  if (!config) return null;

  return (
    <>
      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                Publicación automática de mejores reseñas
              </h3>
              {config.enabled && (
                <Badge variant="green" size="sm">
                  Activo
                </Badge>
              )}
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
              Las mejores reseñas se publican automáticamente en tus funnels y contenido para maximizar conversión.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleRefresh}
              disabled={isRefreshing}
              leftIcon={<RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />}
            >
              Refrescar
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setIsConfigModalOpen(true)}
              leftIcon={<Settings className="w-4 h-4" />}
            >
              Configurar
            </Button>
          </div>
        </div>

        <Tabs
          items={[
            { id: 'published', label: 'Reseñas publicadas', icon: <CheckCircle2 className="w-4 h-4" /> },
            { id: 'config', label: 'Configuración', icon: <Settings className="w-4 h-4" /> },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as 'config' | 'published')}
          variant="pills"
          size="sm"
          className="mt-6"
        />

        {activeTab === 'published' && (
          <div className="mt-6">
            {publishedReviews.length === 0 ? (
              <div className="py-12 text-center">
                <Zap className="w-12 h-12 mx-auto text-slate-300 dark:text-slate-600 mb-3" />
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  No hay reseñas publicadas automáticamente aún.
                </p>
                <Button
                  variant="secondary"
                  size="sm"
                  className="mt-4"
                  onClick={handleRefresh}
                  disabled={isRefreshing}
                >
                  Publicar ahora
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {publishedReviews.map((published) => (
                  <div
                    key={published.id}
                    className="rounded-lg border border-slate-200 dark:border-slate-700 p-4 bg-slate-50/50 dark:bg-slate-800/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-semibold text-slate-900 dark:text-slate-100">
                            {published.testimonial.customerName}
                          </h4>
                          <Badge variant="blue" size="sm">
                            {published.testimonial.score.toFixed(1)} ⭐
                          </Badge>
                          <Badge variant="green" size="sm">
                            {published.publishedBy === 'system' ? 'Automático' : 'Manual'}
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">
                          "{published.testimonial.quote}"
                        </p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs text-slate-500 dark:text-slate-400">Publicado en:</span>
                          {published.publishedTo.map((target) => (
                            <Badge key={target} variant="secondary" size="sm" className="flex items-center gap-1">
                              {getTargetIcon(target)}
                              {TARGET_OPTIONS.find((opt) => opt.value === target)?.label || target}
                            </Badge>
                          ))}
                        </div>
                        {published.performance && (
                          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <TrendingUp className="w-3.5 h-3.5" />
                              {published.performance.views || 0} vistas
                            </span>
                            <span>{published.performance.conversions || 0} conversiones</span>
                            <span>
                              {published.performance.engagementRate
                                ? `${published.performance.engagementRate.toFixed(1)}% engagement`
                                : ''}
                            </span>
                          </div>
                        )}
                        <p className="text-xs text-slate-400 dark:text-slate-500">
                          Publicado: {formatDate(published.publishedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'config' && (
          <div className="mt-6 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Estado</span>
                  <Switch
                    checked={config.enabled}
                    onChange={(checked) => setConfig({ ...config, enabled: checked })}
                  />
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {config.enabled ? 'La publicación automática está activa' : 'La publicación automática está pausada'}
                </p>
              </div>
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Criterio de selección</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {CRITERIA_OPTIONS.find((opt) => opt.value === config.criteria)?.label}
                </p>
              </div>
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Puntuación mínima</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{config.minScore} ⭐</p>
              </div>
              <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
                <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Frecuencia</span>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                  {config.refreshFrequency === 'daily'
                    ? 'Diaria'
                    : config.refreshFrequency === 'weekly'
                      ? 'Semanal'
                      : 'Manual'}
                </p>
              </div>
            </div>
            <div className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/30">
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block">
                Destinos de publicación
              </span>
              <div className="flex flex-wrap gap-2">
                {config.autoPublishTargets.map((target) => (
                  <Badge key={target} variant="blue" size="sm" className="flex items-center gap-1">
                    {getTargetIcon(target)}
                    {TARGET_OPTIONS.find((opt) => opt.value === target)?.label || target}
                  </Badge>
                ))}
              </div>
            </div>
            {config.lastRefreshAt && (
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Última actualización: {formatDate(config.lastRefreshAt)}
              </p>
            )}
          </div>
        )}
      </Card>

      <Modal
        isOpen={isConfigModalOpen}
        onClose={() => setIsConfigModalOpen(false)}
        title="Configurar publicación automática"
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setIsConfigModalOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSaveConfig} disabled={saving}>
              {saving ? 'Guardando...' : 'Guardar configuración'}
            </Button>
          </>
        }
      >
        {config && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Activar publicación automática
                </label>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Las mejores reseñas se publicarán automáticamente según la configuración
                </p>
              </div>
              <Switch
                checked={config.enabled}
                onChange={(checked) => setConfig({ ...config, enabled: checked })}
              />
            </div>

            <Select
              label="Criterio de selección"
              value={config.criteria}
              onChange={(e) => setConfig({ ...config, criteria: e.target.value as BestReviewCriteria })}
              options={CRITERIA_OPTIONS.map((opt) => ({
                label: `${opt.label} - ${opt.description}`,
                value: opt.value,
              }))}
            />

            <div className="grid gap-4 md:grid-cols-2">
              <Input
                label="Puntuación mínima"
                type="number"
                min="1"
                max="5"
                step="0.1"
                value={config.minScore.toString()}
                onChange={(e) => setConfig({ ...config, minScore: parseFloat(e.target.value) })}
              />
              <Input
                label="Recencia máxima (días)"
                type="number"
                min="1"
                max="365"
                value={config.minRecencyDays.toString()}
                onChange={(e) => setConfig({ ...config, minRecencyDays: parseInt(e.target.value) })}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                Destinos de publicación
              </label>
              <div className="space-y-2">
                {TARGET_OPTIONS.filter((opt) => opt.value !== 'all').map((option) => (
                  <label
                    key={option.value}
                    className="flex items-center gap-2 p-2 rounded border border-slate-200 dark:border-slate-700 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50"
                  >
                    <input
                      type="checkbox"
                      checked={config.autoPublishTargets.includes(option.value)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setConfig({
                            ...config,
                            autoPublishTargets: [...config.autoPublishTargets, option.value],
                          });
                        } else {
                          setConfig({
                            ...config,
                            autoPublishTargets: config.autoPublishTargets.filter((t) => t !== option.value),
                          });
                        }
                      }}
                      className="rounded"
                    />
                    <span className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                      {option.icon}
                      {option.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <Input
              label="Máximo de reseñas por funnel"
              type="number"
              min="1"
              max="20"
              value={config.maxReviewsPerFunnel?.toString() || '5'}
              onChange={(e) => setConfig({ ...config, maxReviewsPerFunnel: parseInt(e.target.value) })}
            />

            <Select
              label="Frecuencia de actualización"
              value={config.refreshFrequency}
              onChange={(e) =>
                setConfig({ ...config, refreshFrequency: e.target.value as BestReviewConfig['refreshFrequency'] })
              }
              options={[
                { label: 'Diaria', value: 'daily' },
                { label: 'Semanal', value: 'weekly' },
                { label: 'Manual', value: 'manual' },
              ]}
            />
          </div>
        )}
      </Modal>
    </>
  );
}

