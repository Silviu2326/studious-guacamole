import { useState, useEffect } from 'react';
import { Trophy, Award, Sparkles, Users, Target, Zap, Settings, Plus, Check, X } from 'lucide-react';
import { Card, Button, Badge, Tabs, Modal, Input, Textarea, Select } from '../../../components/componentsreutilizables';
import {
  CommunityGamificationConfig,
  CommunityBadge,
  ClientBadge,
  CommunityChallenge,
  Recognition,
  BadgeCategory,
  BadgeRarity,
  ChallengeStatus,
  ChallengeDifficulty,
} from '../types';
import { CommunityGamificationAPI } from '../api/communityGamification';

interface CommunityGamificationProps {
  config?: CommunityGamificationConfig;
  badges?: CommunityBadge[];
  clientBadges?: ClientBadge[];
  challenges?: CommunityChallenge[];
  recognitions?: Recognition[];
  loading?: boolean;
  onRefresh?: () => void;
}

const BADGE_CATEGORIES: { value: BadgeCategory; label: string; color: string }[] = [
  { value: 'consistencia', label: 'Consistencia', color: 'blue' },
  { value: 'logros', label: 'Logros', color: 'green' },
  { value: 'hitos', label: 'Hitos', color: 'purple' },
  { value: 'comunidad', label: 'Comunidad', color: 'orange' },
  { value: 'especial', label: 'Especial', color: 'purple' },
  { value: 'valores', label: 'Valores', color: 'purple' },
];

const BADGE_RARITIES: { value: BadgeRarity; label: string; color: string }[] = [
  { value: 'comun', label: 'Común', color: 'gray' },
  { value: 'raro', label: 'Raro', color: 'blue' },
  { value: 'epico', label: 'Épico', color: 'purple' },
  { value: 'legendario', label: 'Legendario', color: 'yellow' },
];

const CHALLENGE_STATUSES: { value: ChallengeStatus; label: string; color: string }[] = [
  { value: 'draft', label: 'Borrador', color: 'gray' },
  { value: 'active', label: 'Activo', color: 'green' },
  { value: 'completed', label: 'Completado', color: 'blue' },
  { value: 'paused', label: 'Pausado', color: 'yellow' },
  { value: 'archived', label: 'Archivado', color: 'gray' },
];

export function CommunityGamification({
  config,
  badges = [],
  clientBadges = [],
  challenges = [],
  recognitions = [],
  loading: externalLoading = false,
  onRefresh,
}: CommunityGamificationProps) {
  const [activeTab, setActiveTab] = useState<'badges' | 'challenges' | 'recognitions' | 'config'>('badges');
  const [loading, setLoading] = useState(false);
  const [isBadgeModalOpen, setIsBadgeModalOpen] = useState(false);
  const [isChallengeModalOpen, setIsChallengeModalOpen] = useState(false);
  const [selectedBadge, setSelectedBadge] = useState<CommunityBadge | null>(null);
  const [selectedChallenge, setSelectedChallenge] = useState<CommunityChallenge | null>(null);

  const handleGenerateAIBadges = async () => {
    setLoading(true);
    try {
      const generatedBadges = await CommunityGamificationAPI.generateAIBadges(3);
      console.log('Badges generados:', generatedBadges);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error generando badges:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateAIChallenges = async () => {
    setLoading(true);
    try {
      const generatedChallenges = await CommunityGamificationAPI.generateAIChallenges(2);
      console.log('Retos generados:', generatedChallenges);
      if (onRefresh) onRefresh();
    } catch (error) {
      console.error('Error generando retos:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRarityColor = (rarity: BadgeRarity): string => {
    const rarityConfig = BADGE_RARITIES.find((r) => r.value === rarity);
    return rarityConfig?.color || 'gray';
  };

  const getCategoryColor = (category: BadgeCategory): string => {
    const categoryConfig = BADGE_CATEGORIES.find((c) => c.value === category);
    return categoryConfig?.color || 'blue';
  };

  const getStatusColor = (status: ChallengeStatus): string => {
    const statusConfig = CHALLENGE_STATUSES.find((s) => s.value === status);
    return statusConfig?.color || 'gray';
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-yellow-100 to-orange-200 dark:from-yellow-900/40 dark:to-orange-900/30 rounded-xl">
              <Trophy className="w-6 h-6 text-yellow-600 dark:text-yellow-300" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                Gamificación de la Comunidad con IA
              </h2>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Badges, retos y reconocimientos adaptados a tus valores para aumentar engagement
              </p>
            </div>
          </div>
          {config && (
            <Badge
              variant={config.enabled ? 'green' : 'gray'}
              size="md"
            >
              {config.enabled ? 'Activo' : 'Inactivo'}
            </Badge>
          )}
        </div>

        {config && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-5 h-5 text-blue-600 dark:text-blue-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Badges Otorgados</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {config.stats?.totalBadgesAwarded || 0}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Target className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Retos Creados</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {config.stats?.totalChallengesCreated || 0}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-green-600 dark:text-green-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Reconocimientos</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                {config.stats?.totalRecognitionsSent || 0}
              </p>
            </div>
            <div className="p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Zap className="w-5 h-5 text-orange-600 dark:text-orange-300" />
                <span className="text-sm font-medium text-gray-700 dark:text-slate-300">Aumento Engagement</span>
              </div>
              <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                +{config.stats?.engagementIncrease || 0}%
              </p>
            </div>
          </div>
        )}

        <Tabs
          items={[
            { id: 'badges', label: 'Badges', icon: <Award className="w-4 h-4" /> },
            { id: 'challenges', label: 'Retos', icon: <Target className="w-4 h-4" /> },
            { id: 'recognitions', label: 'Reconocimientos', icon: <Sparkles className="w-4 h-4" /> },
            { id: 'config', label: 'Configuración', icon: <Settings className="w-4 h-4" /> },
          ]}
          activeTab={activeTab}
          onTabChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
          variant="pills"
          size="sm"
        />

        {activeTab === 'badges' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Badges de la Comunidad</h3>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleGenerateAIBadges}
                  disabled={loading}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generar con IA
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsBadgeModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Badge
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {badges.map((badge) => (
                <Card
                  key={badge.id}
                  className="p-4 hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => {
                    setSelectedBadge(badge);
                    setIsBadgeModalOpen(true);
                  }}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 bg-${getCategoryColor(badge.category)}-100 dark:bg-${getCategoryColor(badge.category)}-900/30 rounded-lg`}>
                        <Trophy className={`w-5 h-5 text-${getCategoryColor(badge.category)}-600 dark:text-${getCategoryColor(badge.category)}-300`} />
                      </div>
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-slate-100">{badge.name}</h4>
                        <p className="text-sm text-gray-600 dark:text-slate-400">{badge.description}</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant={getRarityColor(badge.rarity) as any} size="sm">
                      {badge.rarity}
                    </Badge>
                    <Badge variant={getCategoryColor(badge.category) as any} size="sm">
                      {badge.category}
                    </Badge>
                    {badge.aiGenerated && (
                      <Badge variant="purple" size="sm">
                        <Sparkles className="w-3 h-3 mr-1" />
                        IA
                      </Badge>
                    )}
                  </div>
                  {badge.adaptedToValues && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <p className="text-xs text-gray-600 dark:text-slate-400 mb-2">
                        Alineado con valores: {badge.adaptedToValues.trainerValues.join(', ')}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full"
                            style={{ width: `${badge.adaptedToValues.alignmentScore}%` }}
                          />
                        </div>
                        <span className="text-xs text-gray-600 dark:text-slate-400">
                          {badge.adaptedToValues.alignmentScore}%
                        </span>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>

            {clientBadges.length > 0 && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
                  Badges Otorgados a Clientes
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {clientBadges.map((clientBadge) => (
                    <Card key={clientBadge.id} className="p-4">
                      <div className="flex items-center gap-3 mb-2">
                        <Users className="w-5 h-5 text-gray-600 dark:text-slate-400" />
                        <div>
                          <p className="font-semibold text-gray-900 dark:text-slate-100">{clientBadge.clientName}</p>
                          <p className="text-sm text-gray-600 dark:text-slate-400">
                            {new Date(clientBadge.earnedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Trophy className={`w-4 h-4 text-${getCategoryColor(clientBadge.badge.category)}-600`} />
                        <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                          {clientBadge.badge.name}
                        </span>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'challenges' && (
          <div className="mt-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Retos de la Comunidad</h3>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={handleGenerateAIChallenges}
                  disabled={loading}
                >
                  <Sparkles className="w-4 h-4 mr-2" />
                  Generar con IA
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => setIsChallengeModalOpen(true)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Reto
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {challenges.map((challenge) => (
                <Card key={challenge.id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-1">{challenge.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">{challenge.description}</p>
                    </div>
                    <Badge variant={getStatusColor(challenge.status) as any} size="sm">
                      {challenge.status}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mb-3">
                    <Badge variant="blue" size="sm">
                      {challenge.type}
                    </Badge>
                    <Badge variant="purple" size="sm">
                      {challenge.difficulty}
                    </Badge>
                    {challenge.aiGenerated && (
                      <Badge variant="purple" size="sm">
                        <Sparkles className="w-3 h-3 mr-1" />
                        IA
                      </Badge>
                    )}
                  </div>
                  {challenge.metrics && (
                    <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 dark:text-slate-400">Participantes</span>
                        <span className="font-semibold text-gray-900 dark:text-slate-100">
                          {challenge.metrics.totalParticipants}
                        </span>
                      </div>
                      <div className="flex items-center justify-between text-sm mt-2">
                        <span className="text-gray-600 dark:text-slate-400">Progreso Promedio</span>
                        <span className="font-semibold text-gray-900 dark:text-slate-100">
                          {challenge.metrics.averageProgress}%
                        </span>
                      </div>
                    </div>
                  )}
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'recognitions' && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Reconocimientos</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recognitions.map((recognition) => (
                <Card key={recognition.id} className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-300" />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-1">{recognition.title}</h4>
                      <p className="text-sm text-gray-600 dark:text-slate-400">{recognition.message}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-500 mt-2">
                        Para: {recognition.clientName}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {recognition.channels.map((channel) => (
                      <Badge key={channel} variant="blue" size="sm">
                        {channel}
                      </Badge>
                    ))}
                    <Badge variant={recognition.status === 'published' ? 'green' : 'gray'} size="sm">
                      {recognition.status}
                    </Badge>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'config' && config && (
          <div className="mt-6 space-y-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">Configuración</h3>
            <Card className="p-4">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Badges
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.badges?.enabled}
                        readOnly
                        className="rounded"
                      />
                      <span className="text-sm text-gray-600 dark:text-slate-400">Habilitar badges</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.badges?.autoAward}
                        readOnly
                        className="rounded"
                      />
                      <span className="text-sm text-gray-600 dark:text-slate-400">Otorgar automáticamente</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Retos
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.challenges?.enabled}
                        readOnly
                        className="rounded"
                      />
                      <span className="text-sm text-gray-600 dark:text-slate-400">Habilitar retos</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.challenges?.autoCreate}
                        readOnly
                        className="rounded"
                      />
                      <span className="text-sm text-gray-600 dark:text-slate-400">Crear automáticamente con IA</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                    Reconocimientos
                  </label>
                  <div className="space-y-2">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.recognitions?.enabled}
                        readOnly
                        className="rounded"
                      />
                      <span className="text-sm text-gray-600 dark:text-slate-400">Habilitar reconocimientos</span>
                    </label>
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={config.recognitions?.autoGenerate}
                        readOnly
                        className="rounded"
                      />
                      <span className="text-sm text-gray-600 dark:text-slate-400">Generar automáticamente</span>
                    </label>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        )}
      </Card>
    </div>
  );
}

