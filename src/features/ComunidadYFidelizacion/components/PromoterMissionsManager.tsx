import { useState } from 'react';
import {
  Target,
  Video,
  Star,
  MessageSquare,
  Image,
  FileText,
  Plus,
  Check,
  Clock,
  X,
  TrendingUp,
  Award,
  Edit,
  Send,
  Eye,
  Heart,
  Share2,
  MessageCircle,
  Users,
} from 'lucide-react';
import { Card, Badge, Button, Tabs } from '../../../components/componentsreutilizables';
import {
  PromoterMission,
  PromoterBranding,
  MissionType,
  MissionStatus,
  MissionPriority,
  SocialPlatform,
  RewardType,
} from '../types';

interface PromoterMissionsManagerProps {
  promoterBrandings?: PromoterBranding[];
  missions?: PromoterMission[];
  loading?: boolean;
  onCreateMission?: (promoterId: string, missionType: MissionType) => void;
  onAssignMission?: (missionId: string, promoterId: string) => void;
  onUpdateMissionStatus?: (missionId: string, status: MissionStatus) => void;
  onReviewMission?: (missionId: string, approved: boolean, feedback?: string) => void;
  onBrandPromoter?: (promoterId: string) => void;
  onViewMission?: (missionId: string) => void;
}

const MISSION_TYPE_LABELS: Record<MissionType, string> = {
  reel: 'Reel',
  review: 'Reseña',
  testimonial: 'Testimonio',
  story: 'Story',
  post: 'Post',
};

const MISSION_TYPE_ICONS: Record<MissionType, React.ReactNode> = {
  reel: <Video className="w-4 h-4" />,
  review: <Star className="w-4 h-4" />,
  testimonial: <MessageSquare className="w-4 h-4" />,
  story: <Image className="w-4 h-4" />,
  post: <FileText className="w-4 h-4" />,
};

const MISSION_STATUS_LABELS: Record<MissionStatus, string> = {
  pending: 'Pendiente',
  assigned: 'Asignada',
  'in-progress': 'En Progreso',
  completed: 'Completada',
  rejected: 'Rechazada',
  expired: 'Expirada',
};

const MISSION_STATUS_COLORS: Record<MissionStatus, string> = {
  pending: 'bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
  assigned: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  'in-progress': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  completed: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  rejected: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
  expired: 'bg-gray-100 text-gray-700 dark:bg-gray-800/60 dark:text-gray-300',
};

const MISSION_PRIORITY_COLORS: Record<MissionPriority, string> = {
  low: 'bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
  medium: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  high: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  urgent: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
};

const PLATFORM_LABELS: Record<SocialPlatform, string> = {
  'google-my-business': 'Google',
  facebook: 'Facebook',
  instagram: 'Instagram',
};

const REWARD_TYPE_LABELS: Record<RewardType, string> = {
  descuento: 'Descuento',
  'sesion-gratis': 'Sesión Gratis',
  bono: 'Bono',
  producto: 'Producto',
  personalizado: 'Personalizado',
};

export function PromoterMissionsManager({
  promoterBrandings = [],
  missions = [],
  loading,
  onCreateMission,
  onAssignMission,
  onUpdateMissionStatus,
  onReviewMission,
  onBrandPromoter,
  onViewMission,
}: PromoterMissionsManagerProps) {
  const [activeTab, setActiveTab] = useState<'missions' | 'promoters' | 'branding'>('missions');
  const [selectedStatus, setSelectedStatus] = useState<MissionStatus | 'all'>('all');
  const [selectedType, setSelectedType] = useState<MissionType | 'all'>('all');

  const filteredMissions = missions.filter((mission) => {
    if (selectedStatus !== 'all' && mission.status !== selectedStatus) return false;
    if (selectedType !== 'all' && mission.type !== selectedType) return false;
    return true;
  });

  const formatRewardValue = (type: RewardType, value: number, currency?: string): string => {
    switch (type) {
      case 'descuento':
        return `${value}%`;
      case 'sesion-gratis':
        return `${value} sesión${value > 1 ? 'es' : ''}`;
      case 'bono':
        return `${currency || '$'}${value}`;
      default:
        return String(value);
    }
  };

  if (loading) {
    return (
      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded-md bg-slate-200/70 dark:bg-slate-800/70" />
          <div className="h-32 rounded-lg bg-slate-200/60 dark:bg-slate-800/60" />
        </div>
      </Card>
    );
  }

  const tabs = [
    { id: 'missions', label: 'Misiones', icon: <Target className="w-4 h-4" /> },
    { id: 'promoters', label: 'Promotores', icon: <Users className="w-4 h-4" /> },
    { id: 'branding', label: 'Branding', icon: <Award className="w-4 h-4" /> },
  ];

  return (
    <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
      <header className="flex items-start justify-between gap-4 mb-6">
        <div>
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Misiones de Promotores
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-2xl">
            Asigna misiones personalizadas a tus promotores (reels, reseñas, testimonios) para amplificar tu marca.
          </p>
        </div>
        <Badge variant="blue" size="sm" className="inline-flex items-center gap-1.5">
          <Target className="w-3.5 h-3.5" />
          {missions.length} misiones
        </Badge>
      </header>

      <div className="mb-6">
        <Tabs items={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="pills" size="sm" />
      </div>

      {activeTab === 'missions' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value as MissionStatus | 'all')}
                className="text-sm rounded-lg border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 px-3 py-1.5"
              >
                <option value="all">Todos los estados</option>
                {Object.entries(MISSION_STATUS_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value as MissionType | 'all')}
                className="text-sm rounded-lg border border-slate-200/60 dark:border-slate-800/60 bg-white dark:bg-slate-900 px-3 py-1.5"
              >
                <option value="all">Todos los tipos</option>
                {Object.entries(MISSION_TYPE_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onCreateMission?.('', 'reel')}
              className="inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Crear Misión
            </Button>
          </div>

          {filteredMissions.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30">
              <Target className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No hay misiones que coincidan con los filtros seleccionados.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredMissions.map((mission) => (
                <div
                  key={mission.id}
                  className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                          {MISSION_TYPE_ICONS[mission.type]}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                              {mission.title}
                            </h4>
                            <Badge size="sm" className={MISSION_STATUS_COLORS[mission.status]}>
                              {MISSION_STATUS_LABELS[mission.status]}
                            </Badge>
                            <Badge size="sm" className={MISSION_PRIORITY_COLORS[mission.priority]}>
                              {mission.priority}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                            {mission.description}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Users className="w-3.5 h-3.5" />
                              {mission.promoterName}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3.5 h-3.5" />
                              Vence: {new Date(mission.dueDate).toLocaleDateString('es-ES')}
                            </span>
                            {mission.completedAt && (
                              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                                <Check className="w-3.5 h-3.5" />
                                Completada: {new Date(mission.completedAt).toLocaleDateString('es-ES')}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      {mission.personalizedMessage && (
                        <div className="rounded-lg bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-200/50 dark:border-indigo-800/50 p-3">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                            Mensaje Personalizado:
                          </p>
                          <p className="text-sm text-slate-700 dark:text-slate-300">
                            {mission.personalizedMessage}
                          </p>
                        </div>
                      )}

                      {mission.instructions && (
                        <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 border border-slate-200/60 dark:border-slate-800/60">
                          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">
                            Instrucciones:
                          </p>
                          <p className="text-sm text-slate-600 dark:text-slate-400">{mission.instructions}</p>
                        </div>
                      )}

                      {mission.submittedContent && (
                        <div className="rounded-lg bg-emerald-50/50 dark:bg-emerald-900/20 border border-emerald-200/50 dark:border-emerald-800/50 p-3">
                          <p className="text-xs font-medium text-emerald-700 dark:text-emerald-300 mb-2">
                            Contenido Entregado:
                          </p>
                          {mission.submittedContent.url && (
                            <a
                              href={mission.submittedContent.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-sm text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1"
                            >
                              Ver contenido <Eye className="w-3.5 h-3.5" />
                            </a>
                          )}
                          {mission.submittedContent.text && (
                            <p className="text-sm text-slate-700 dark:text-slate-300 mt-2">
                              {mission.submittedContent.text}
                            </p>
                          )}
                          {mission.submittedContent.platform && (
                            <Badge size="sm" variant="blue" className="mt-2">
                              {PLATFORM_LABELS[mission.submittedContent.platform]}
                            </Badge>
                          )}
                        </div>
                      )}

                      {mission.performance && (
                        <div className="grid grid-cols-5 gap-3 pt-3 border-t border-slate-200/60 dark:border-slate-800/60">
                          {mission.performance.views !== undefined && (
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Vistas</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                                <Eye className="w-3.5 h-3.5" />
                                {mission.performance.views.toLocaleString()}
                              </p>
                            </div>
                          )}
                          {mission.performance.likes !== undefined && (
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Me gusta</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                                <Heart className="w-3.5 h-3.5" />
                                {mission.performance.likes.toLocaleString()}
                              </p>
                            </div>
                          )}
                          {mission.performance.comments !== undefined && (
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Comentarios</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                                <MessageCircle className="w-3.5 h-3.5" />
                                {mission.performance.comments.toLocaleString()}
                              </p>
                            </div>
                          )}
                          {mission.performance.shares !== undefined && (
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Compartidos</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                                <Share2 className="w-3.5 h-3.5" />
                                {mission.performance.shares.toLocaleString()}
                              </p>
                            </div>
                          )}
                          {mission.performance.reach !== undefined && (
                            <div>
                              <p className="text-xs text-slate-500 dark:text-slate-400">Alcance</p>
                              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1">
                                <TrendingUp className="w-3.5 h-3.5" />
                                {mission.performance.reach.toLocaleString()}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {mission.reward && (
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-200/60 dark:border-slate-800/60">
                          <Award className="w-4 h-4 text-amber-500" />
                          <span className="text-sm text-slate-600 dark:text-slate-400">
                            Recompensa:{' '}
                            <span className="font-semibold text-slate-900 dark:text-slate-100">
                              {formatRewardValue(mission.reward.type, mission.reward.value)}
                            </span>
                            {' - '}
                            {mission.reward.description}
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => onViewMission?.(mission.id)}
                        className="inline-flex items-center gap-2"
                      >
                        <Eye className="w-4 h-4" />
                        Ver
                      </Button>
                      {mission.status === 'completed' && !mission.trainerFeedback && (
                        <>
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => onReviewMission?.(mission.id, true)}
                            className="inline-flex items-center gap-2"
                          >
                            <Check className="w-4 h-4" />
                            Aprobar
                          </Button>
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => onReviewMission?.(mission.id, false)}
                            className="inline-flex items-center gap-2"
                          >
                            <X className="w-4 h-4" />
                            Rechazar
                          </Button>
                        </>
                      )}
                      {mission.status === 'assigned' && (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => onUpdateMissionStatus?.(mission.id, 'in-progress')}
                          className="inline-flex items-center gap-2"
                        >
                          <Send className="w-4 h-4" />
                          Marcar en progreso
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {activeTab === 'promoters' && (
        <div className="space-y-4">
          {promoterBrandings.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30">
              <Users className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-sm text-slate-500 dark:text-slate-400">
                No hay promotores con branding configurado aún.
              </p>
            </div>
          ) : (
            promoterBrandings.map((branding) => (
              <div
                key={branding.promoterId}
                className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div>
                    <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100 mb-1">
                      {branding.promoterName}
                    </h4>
                    <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400">
                      <span>
                        {branding.totalMissionsCompleted}/{branding.totalMissionsAssigned} misiones completadas
                      </span>
                      <span>•</span>
                      <span>Score: {branding.averagePerformanceScore}/100</span>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onBrandPromoter?.(branding.promoterId)}
                    className="inline-flex items-center gap-2"
                  >
                    <Award className="w-4 h-4" />
                    Configurar Branding
                  </Button>
                </div>

                {branding.personalizedBio && (
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">{branding.personalizedBio}</p>
                )}

                {branding.preferredMissionTypes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-3">
                    {branding.preferredMissionTypes.map((type) => (
                      <Badge key={type} size="sm" variant="blue" className="inline-flex items-center gap-1">
                        {MISSION_TYPE_ICONS[type]}
                        {MISSION_TYPE_LABELS[type]}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => onCreateMission?.(branding.promoterId, branding.preferredMissionTypes[0] || 'reel')}
                    className="inline-flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" />
                    Asignar Misión
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'branding' && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Configura el branding personalizado para cada promotor, incluyendo kit de marca, biografía y handles de
            redes sociales.
          </p>
          {promoterBrandings.length === 0 ? (
            <div className="text-center py-12 rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-slate-50/50 dark:bg-slate-800/30">
              <Award className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                No hay promotores con branding configurado aún.
              </p>
              <Button variant="primary" size="sm" className="inline-flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Configurar Primer Branding
              </Button>
            </div>
          ) : (
            promoterBrandings.map((branding) => (
              <div
                key={branding.promoterId}
                className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-5"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h4 className="text-base font-semibold text-slate-900 dark:text-slate-100">
                    {branding.promoterName}
                  </h4>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onBrandPromoter?.(branding.promoterId)}
                    className="inline-flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Editar
                  </Button>
                </div>

                {branding.brandKit && (
                  <div className="space-y-3 mb-4">
                    {branding.brandKit.logoUrl && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Logo:</p>
                        <img
                          src={branding.brandKit.logoUrl}
                          alt="Logo"
                          className="h-16 w-16 object-contain rounded-lg border border-slate-200/60 dark:border-slate-800/60"
                        />
                      </div>
                    )}
                    {branding.brandKit.colorPalette && branding.brandKit.colorPalette.length > 0 && (
                      <div>
                        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">
                          Paleta de Colores:
                        </p>
                        <div className="flex gap-2">
                          {branding.brandKit.colorPalette.map((color, index) => (
                            <div
                              key={index}
                              className="w-12 h-12 rounded-lg border border-slate-200/60 dark:border-slate-800/60"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {branding.socialHandles && branding.socialHandles.length > 0 && (
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-2">Redes Sociales:</p>
                    <div className="flex flex-wrap gap-2">
                      {branding.socialHandles.map((handle, index) => (
                        <Badge key={index} size="sm" variant="blue">
                          {PLATFORM_LABELS[handle.platform]}: @{handle.handle}
                          {handle.verified && ' ✓'}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </Card>
  );
}

