import { useEffect, useState } from 'react';
import {
  Calendar,
  CalendarDays,
  ChevronRight,
  Loader2,
  Plus,
  Rocket,
  Target,
  TrendingUp,
  X,
} from 'lucide-react';
import {
  Badge,
  Button,
  Card,
  Input,
  Modal,
  Select,
  Tabs,
  Textarea,
} from '../../../components/componentsreutilizables';
import type {
  LaunchOrchestration,
  LaunchPhase,
  LaunchPhaseContent,
  FunnelOption,
  CampaignOption,
} from '../types';
import {
  getLaunchOrchestrations,
  getLaunchOrchestration,
  createLaunchOrchestration,
  updateLaunchOrchestration,
  addContentToPhase,
  getFunnelOptions,
  getCampaignOptions,
} from '../api/launchOrchestration';

interface LaunchOrchestratorProps {
  loading?: boolean;
}

const phaseLabels: Record<LaunchPhase, { label: string; description: string; color: string }> = {
  teasing: {
    label: 'Teasing',
    description: 'Genera expectativa antes del lanzamiento',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
  apertura: {
    label: 'Apertura',
    description: 'Anuncio oficial del lanzamiento',
    color: 'bg-blue-100 text-blue-700 border-blue-200',
  },
  cierre: {
    label: 'Cierre',
    description: 'Urgencia y llamada final a la acción',
    color: 'bg-rose-100 text-rose-700 border-rose-200',
  },
};

const statusStyles: Record<LaunchOrchestration['status'], string> = {
  draft: 'bg-slate-100 text-slate-700',
  scheduled: 'bg-blue-100 text-blue-700',
  active: 'bg-emerald-100 text-emerald-700',
  completed: 'bg-gray-100 text-gray-700',
  paused: 'bg-amber-100 text-amber-700',
};

export function LaunchOrchestrator({ loading: externalLoading }: LaunchOrchestratorProps) {
  const [launches, setLaunches] = useState<LaunchOrchestration[]>([]);
  const [loading, setLoading] = useState(true);
  const [funnels, setFunnels] = useState<FunnelOption[]>([]);
  const [campaigns, setCampaigns] = useState<CampaignOption[]>([]);
  const [selectedLaunch, setSelectedLaunch] = useState<LaunchOrchestration | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showContentModal, setShowContentModal] = useState(false);
  const [selectedPhase, setSelectedPhase] = useState<LaunchPhase | null>(null);
  const [activeTab, setActiveTab] = useState<'list' | 'timeline'>('list');

  // Form state for new launch
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    funnelId: '',
    campaignId: '',
    startDate: '',
    endDate: '',
  });

  // Form state for new content
  const [contentFormData, setContentFormData] = useState({
    title: '',
    description: '',
    scheduledDate: '',
    scheduledTime: '',
    platform: 'instagram' as const,
    contentType: 'post' as const,
    caption: '',
    hashtags: '',
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [launchesData, funnelsData, campaignsData] = await Promise.all([
        getLaunchOrchestrations(),
        getFunnelOptions(),
        getCampaignOptions(),
      ]);
      setLaunches(launchesData);
      setFunnels(funnelsData);
      setCampaigns(campaignsData);
    } catch (error) {
      console.error('Error loading launch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateLaunch = async () => {
    if (!formData.name || !formData.startDate || !formData.endDate) {
      return;
    }

    try {
      const startDate = new Date(formData.startDate);
      const endDate = new Date(formData.endDate);
      const teasingEnd = new Date(startDate.getTime() + 3 * 24 * 60 * 60 * 1000);
      const aperturaStart = new Date(startDate.getTime() + 4 * 24 * 60 * 60 * 1000);
      const aperturaEnd = new Date(startDate.getTime() + 10 * 24 * 60 * 60 * 1000);
      const cierreStart = new Date(startDate.getTime() + 11 * 24 * 60 * 60 * 1000);

      const newLaunch = await createLaunchOrchestration({
        name: formData.name,
        description: formData.description,
        funnelId: formData.funnelId || undefined,
        campaignId: formData.campaignId || undefined,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        phases: {
          teasing: {
            startDate: startDate.toISOString(),
            endDate: teasingEnd.toISOString(),
            content: [],
            status: 'pending',
          },
          apertura: {
            startDate: aperturaStart.toISOString(),
            endDate: aperturaEnd.toISOString(),
            content: [],
            status: 'pending',
          },
          cierre: {
            startDate: cierreStart.toISOString(),
            endDate: endDate.toISOString(),
            content: [],
            status: 'pending',
          },
        },
        status: 'draft',
      });

      setLaunches([...launches, newLaunch]);
      setShowCreateModal(false);
      setFormData({
        name: '',
        description: '',
        funnelId: '',
        campaignId: '',
        startDate: '',
        endDate: '',
      });
    } catch (error) {
      console.error('Error creating launch:', error);
    }
  };

  const handleAddContent = async () => {
    if (!selectedLaunch || !selectedPhase || !contentFormData.title) {
      return;
    }

    try {
      const newContent = await addContentToPhase(selectedLaunch.id, selectedPhase, {
        phase: selectedPhase,
        title: contentFormData.title,
        description: contentFormData.description,
        scheduledDate: contentFormData.scheduledDate,
        scheduledTime: contentFormData.scheduledTime,
        platform: contentFormData.platform,
        contentType: contentFormData.contentType,
        content: {
          caption: contentFormData.caption,
          hashtags: contentFormData.hashtags.split(',').map((h) => h.trim()).filter(Boolean),
        },
        status: 'draft',
        funnelId: selectedLaunch.funnelId,
        campaignId: selectedLaunch.campaignId,
      });

      // Update local state
      const updatedLaunch = await getLaunchOrchestration(selectedLaunch.id);
      if (updatedLaunch) {
        setSelectedLaunch(updatedLaunch);
        setLaunches(launches.map((l) => (l.id === updatedLaunch.id ? updatedLaunch : l)));
      }

      setShowContentModal(false);
      setContentFormData({
        title: '',
        description: '',
        scheduledDate: '',
        scheduledTime: '',
        platform: 'instagram',
        contentType: 'post',
        caption: '',
        hashtags: '',
      });
    } catch (error) {
      console.error('Error adding content:', error);
    }
  };

  const formatDate = (iso: string) => {
    return new Date(iso).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (externalLoading || loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-violet-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            Orquestación de Lanzamientos
          </h2>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
            Coordina lanzamientos completos (teasing, apertura, cierre) con funnels y campañas
          </p>
        </div>
        <Button
          variant="primary"
          onClick={() => setShowCreateModal(true)}
          className="inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nuevo Lanzamiento
        </Button>
      </div>

      <Tabs
        items={[
          { id: 'list', label: 'Lista' },
          { id: 'timeline', label: 'Línea de Tiempo' },
        ]}
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab as 'list' | 'timeline')}
      />

      {activeTab === 'list' ? (
        <div className="grid grid-cols-1 gap-4">
          {launches.map((launch) => (
            <Card key={launch.id} className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <Rocket className="w-5 h-5 text-violet-600" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                      {launch.name}
                    </h3>
                    <Badge className={statusStyles[launch.status]}>
                      {launch.status === 'draft' && 'Borrador'}
                      {launch.status === 'scheduled' && 'Programado'}
                      {launch.status === 'active' && 'Activo'}
                      {launch.status === 'completed' && 'Completado'}
                      {launch.status === 'paused' && 'Pausado'}
                    </Badge>
                  </div>
                  {launch.description && (
                    <p className="text-gray-600 dark:text-slate-400 text-sm mb-3">
                      {launch.description}
                    </p>
                  )}
                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-slate-500">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="w-4 h-4" />
                      {formatDate(launch.startDate)} - {formatDate(launch.endDate)}
                    </span>
                    {launch.funnelId && (
                      <span className="flex items-center gap-1">
                        <Target className="w-4 h-4" />
                        Funnel: {funnels.find((f) => f.id === launch.funnelId)?.name || launch.funnelId}
                      </span>
                    )}
                    {launch.campaignId && (
                      <span className="flex items-center gap-1">
                        <TrendingUp className="w-4 h-4" />
                        Campaña: {campaigns.find((c) => c.id === launch.campaignId)?.name || launch.campaignId}
                      </span>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedLaunch(launch)}
                >
                  Ver Detalles
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                {(['teasing', 'apertura', 'cierre'] as LaunchPhase[]).map((phase) => {
                  const phaseData = launch.phases[phase];
                  const phaseInfo = phaseLabels[phase];
                  return (
                    <div
                      key={phase}
                      className={`p-4 rounded-lg border-2 ${phaseInfo.color} dark:bg-opacity-20`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{phaseInfo.label}</h4>
                        <Badge className="bg-white/50 text-xs">
                          {phaseData.content.length} contenido
                        </Badge>
                      </div>
                      <p className="text-xs mb-2 opacity-80">{phaseInfo.description}</p>
                      <div className="text-xs">
                        <div>{formatDate(phaseData.startDate)}</div>
                        <div className="opacity-70">→ {formatDate(phaseData.endDate)}</div>
                      </div>
                      <Badge className={`mt-2 text-xs ${
                        phaseData.status === 'active' ? 'bg-emerald-200 text-emerald-800' :
                        phaseData.status === 'completed' ? 'bg-gray-200 text-gray-800' :
                        'bg-slate-200 text-slate-800'
                      }`}>
                        {phaseData.status === 'active' ? 'Activo' :
                         phaseData.status === 'completed' ? 'Completado' : 'Pendiente'}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-6">
          <div className="space-y-6">
            {launches.map((launch) => (
              <div key={launch.id} className="border-l-4 border-violet-500 pl-4">
                <h3 className="font-semibold text-lg mb-4">{launch.name}</h3>
                <div className="space-y-4">
                  {(['teasing', 'apertura', 'cierre'] as LaunchPhase[]).map((phase) => {
                    const phaseData = launch.phases[phase];
                    const phaseInfo = phaseLabels[phase];
                    return (
                      <div key={phase} className="ml-4">
                        <div className="flex items-center gap-2 mb-2">
                          <div className={`w-3 h-3 rounded-full ${phaseInfo.color.split(' ')[0]}`} />
                          <span className="font-medium">{phaseInfo.label}</span>
                          <span className="text-sm text-gray-500">
                            ({formatDate(phaseData.startDate)} - {formatDate(phaseData.endDate)})
                          </span>
                        </div>
                        <div className="ml-5 space-y-2">
                          {phaseData.content.map((content) => (
                            <div
                              key={content.id}
                              className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg text-sm"
                            >
                              <div className="font-medium">{content.title}</div>
                              <div className="text-gray-600 dark:text-slate-400 text-xs mt-1">
                                {content.scheduledDate} {content.scheduledTime} - {content.platform}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* Create Launch Modal */}
      <Modal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        title="Crear Nuevo Lanzamiento"
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Nombre del Lanzamiento"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Lanzamiento Programa Verano 2024"
            required
          />
          <Textarea
            label="Descripción"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe el objetivo del lanzamiento..."
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fecha de Inicio"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
              required
            />
            <Input
              label="Fecha de Fin"
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
              required
            />
          </div>
          <Select
            label="Funnel (Opcional)"
            value={formData.funnelId}
            onChange={(e) => setFormData({ ...formData, funnelId: e.target.value })}
            options={[
              { value: '', label: 'Sin funnel' },
              ...funnels.map((f) => ({ value: f.id, label: f.name })),
            ]}
          />
          <Select
            label="Campaña (Opcional)"
            value={formData.campaignId}
            onChange={(e) => setFormData({ ...formData, campaignId: e.target.value })}
            options={[
              { value: '', label: 'Sin campaña' },
              ...campaigns.map((c) => ({ value: c.id, label: c.name })),
            ]}
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="ghost" onClick={() => setShowCreateModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateLaunch}>
              Crear Lanzamiento
            </Button>
          </div>
        </div>
      </Modal>

      {/* Add Content Modal */}
      <Modal
        isOpen={showContentModal && selectedLaunch !== null && selectedPhase !== null}
        onClose={() => {
          setShowContentModal(false);
          setSelectedPhase(null);
        }}
        title={`Agregar Contenido - ${selectedPhase ? phaseLabels[selectedPhase].label : ''}`}
        size="lg"
      >
        <div className="space-y-4">
          <Input
            label="Título"
            value={contentFormData.title}
            onChange={(e) => setContentFormData({ ...contentFormData, title: e.target.value })}
            placeholder="Ej: Teaser 1: ¿Listo para el verano?"
            required
          />
          <Textarea
            label="Descripción"
            value={contentFormData.description}
            onChange={(e) => setContentFormData({ ...contentFormData, description: e.target.value })}
            placeholder="Descripción del contenido..."
            rows={2}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Fecha"
              type="date"
              value={contentFormData.scheduledDate}
              onChange={(e) => setContentFormData({ ...contentFormData, scheduledDate: e.target.value })}
              required
            />
            <Input
              label="Hora"
              type="time"
              value={contentFormData.scheduledTime}
              onChange={(e) => setContentFormData({ ...contentFormData, scheduledTime: e.target.value })}
              required
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Plataforma"
              value={contentFormData.platform}
              onChange={(e) => setContentFormData({ ...contentFormData, platform: e.target.value as any })}
              options={[
                { value: 'instagram', label: 'Instagram' },
                { value: 'facebook', label: 'Facebook' },
                { value: 'tiktok', label: 'TikTok' },
                { value: 'linkedin', label: 'LinkedIn' },
              ]}
            />
            <Select
              label="Tipo de Contenido"
              value={contentFormData.contentType}
              onChange={(e) => setContentFormData({ ...contentFormData, contentType: e.target.value as any })}
              options={[
                { value: 'post', label: 'Post' },
                { value: 'reel', label: 'Reel' },
                { value: 'carousel', label: 'Carrusel' },
                { value: 'story', label: 'Story' },
              ]}
            />
          </div>
          <Textarea
            label="Caption"
            value={contentFormData.caption}
            onChange={(e) => setContentFormData({ ...contentFormData, caption: e.target.value })}
            placeholder="Escribe el caption del contenido..."
            rows={4}
            required
          />
          <Input
            label="Hashtags (separados por comas)"
            value={contentFormData.hashtags}
            onChange={(e) => setContentFormData({ ...contentFormData, hashtags: e.target.value })}
            placeholder="#fitness #entrenamiento #salud"
          />
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="ghost"
              onClick={() => {
                setShowContentModal(false);
                setSelectedPhase(null);
              }}
            >
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleAddContent}>
              Agregar Contenido
            </Button>
          </div>
        </div>
      </Modal>

      {/* Launch Detail Modal */}
      {selectedLaunch && (
        <Modal
          isOpen={selectedLaunch !== null}
          onClose={() => setSelectedLaunch(null)}
          title={selectedLaunch.name}
          size="xl"
        >
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              {(['teasing', 'apertura', 'cierre'] as LaunchPhase[]).map((phase) => {
                const phaseData = selectedLaunch.phases[phase];
                const phaseInfo = phaseLabels[phase];
                return (
                  <Card key={phase} className={`p-4 border-2 ${phaseInfo.color}`}>
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-semibold">{phaseInfo.label}</h4>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedPhase(phase);
                          setShowContentModal(true);
                        }}
                      >
                        <Plus className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="space-y-2">
                      {phaseData.content.map((content) => (
                        <div
                          key={content.id}
                          className="p-2 bg-white/50 dark:bg-gray-800/50 rounded text-sm"
                        >
                          <div className="font-medium">{content.title}</div>
                          <div className="text-xs opacity-70">
                            {content.scheduledDate} {content.scheduledTime}
                          </div>
                        </div>
                      ))}
                      {phaseData.content.length === 0 && (
                        <p className="text-sm opacity-70">No hay contenido aún</p>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

