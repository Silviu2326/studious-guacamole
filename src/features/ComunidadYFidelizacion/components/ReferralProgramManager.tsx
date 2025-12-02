import { useState } from 'react';
import {
  Gift,
  Link2,
  TrendingUp,
  Users,
  Award,
  Plus,
  Edit,
  Copy,
  Check,
  BarChart3,
  Calendar,
  UserPlus,
  Settings,
} from 'lucide-react';
import { Card, Badge, Button, Tabs } from '../../../components/componentsreutilizables';
import {
  ReferralProgram,
  Referral,
  ReferralStats,
  ReferralStatus,
  RewardType,
} from '../types';

interface ReferralProgramManagerProps {
  program?: ReferralProgram;
  referrals?: Referral[];
  stats?: ReferralStats;
  loading?: boolean;
  onCreateProgram?: () => void;
  onEditProgram?: (programId: string) => void;
  onGenerateLink?: (clientId: string) => void;
  onManageReward?: (referralId: string) => void;
  onViewReferral?: (referralId: string) => void;
}

export function ReferralProgramManager({
  program,
  referrals = [],
  stats,
  loading,
  onCreateProgram,
  onEditProgram,
  onGenerateLink,
  onManageReward,
  onViewReferral,
}: ReferralProgramManagerProps) {
  const [copiedLink, setCopiedLink] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'referrals' | 'stats'>('overview');

  const getRewardTypeLabel = (type: RewardType): string => {
    const labels = {
      descuento: 'Descuento',
      'sesion-gratis': 'Sesión gratis',
      bono: 'Bono',
      producto: 'Producto',
      personalizado: 'Personalizado',
    };
    return labels[type];
  };

  const getStatusLabel = (status: ReferralStatus): string => {
    const labels = {
      pendiente: 'Pendiente',
      'en-proceso': 'En proceso',
      convertido: 'Convertido',
      recompensado: 'Recompensado',
      expirado: 'Expirado',
    };
    return labels[status];
  };

  const getStatusColor = (status: ReferralStatus): string => {
    const colors = {
      pendiente: 'bg-slate-100 text-slate-700 dark:bg-slate-800/60 dark:text-slate-300',
      'en-proceso': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
      convertido: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
      recompensado: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
      expirado: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300',
    };
    return colors[status];
  };

  const handleCopyLink = (link: string) => {
    navigator.clipboard.writeText(link);
    setCopiedLink(link);
    setTimeout(() => setCopiedLink(null), 2000);
  };

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

  if (!program) {
    return (
      <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
        <div className="text-center py-12">
          <Gift className="w-12 h-12 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-2">
            Programa de Referidos
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-md mx-auto">
            Crea un programa de referidos para recompensar a tus clientes por traer nuevos clientes. Define recompensas,
            genera links únicos y trackea referidos.
          </p>
          <Button variant="primary" onClick={onCreateProgram} className="inline-flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Crear programa de referidos
          </Button>
        </div>
      </Card>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Resumen', icon: <BarChart3 className="w-4 h-4" /> },
    { id: 'referrals', label: 'Referidos', icon: <Users className="w-4 h-4" /> },
    { id: 'stats', label: 'Estadísticas', icon: <TrendingUp className="w-4 h-4" /> },
  ];

  return (
    <Card className="bg-white/90 dark:bg-slate-900/80 shadow-sm border border-slate-200/60 dark:border-slate-800/60">
      <header className="flex items-start justify-between gap-4 mb-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <Gift className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
              {program.name}
            </h3>
            <Badge variant={program.isActive ? 'blue' : 'secondary'} size="sm">
              {program.isActive ? 'Activo' : 'Inactivo'}
            </Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{program.description}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => onEditProgram?.(program.id)}>
          <Edit className="w-4 h-4" />
        </Button>
      </header>

      <div className="mb-6">
        <Tabs items={tabs} activeTab={activeTab} onTabChange={setActiveTab} variant="pills" size="sm" />
      </div>

      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Link2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Referidos</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{program.totalReferrals}</p>
            </div>
            <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-4">
              <div className="flex items-center gap-2 mb-2">
                <UserPlus className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Convertidos</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {program.convertedReferrals}
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Recompensas</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {program.totalRewardsGiven}
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-5">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3 flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Recompensa del Programa
            </h4>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Tipo:</span>
                <Badge size="sm" variant="blue">
                  {getRewardTypeLabel(program.reward.type)}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Valor:</span>
                <span className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                  {formatRewardValue(program.reward.type, program.reward.value, program.reward.currency)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-slate-600 dark:text-slate-400">Descripción:</span>
                <span className="text-sm text-slate-600 dark:text-slate-400 text-right">
                  {program.reward.description}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-indigo-200/50 dark:border-indigo-800/50 bg-indigo-50/50 dark:bg-indigo-900/20 p-5">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-2">
              <Link2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Generar Link de Referido
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 mb-4">
              Genera un link único para cada cliente que puedan compartir con sus referidos.
            </p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => onGenerateLink?.('client-id')}
              className="inline-flex items-center gap-2"
            >
              <Link2 className="w-4 h-4" />
              Generar link único
            </Button>
          </div>
        </div>
      )}

      {activeTab === 'referrals' && (
        <div className="space-y-4">
          {referrals.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-10 h-10 text-slate-300 dark:text-slate-700 mx-auto mb-3" />
              <p className="text-sm text-slate-500 dark:text-slate-400">No hay referidos registrados aún.</p>
            </div>
          ) : (
            referrals.map((referral) => (
              <div
                key={referral.id}
                className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">
                          {referral.referredName || referral.referredEmail}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          Referido por: {referral.referrerClientName}
                        </p>
                      </div>
                      <Badge size="sm" className={getStatusColor(referral.status)}>
                        {getStatusLabel(referral.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(referral.createdAt).toLocaleDateString('es-ES')}
                      </span>
                      {referral.convertedAt && (
                        <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">
                          <Check className="w-3.5 h-3.5" />
                          Convertido: {new Date(referral.convertedAt).toLocaleDateString('es-ES')}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded font-mono text-slate-600 dark:text-slate-400">
                        {referral.referralLink}
                      </code>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleCopyLink(referral.referralLink)}
                        className="h-6 w-6 p-0"
                      >
                        {copiedLink === referral.referralLink ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => onViewReferral?.(referral.id)}
                      className="inline-flex items-center gap-2"
                    >
                      Ver detalles
                    </Button>
                    {referral.status === 'convertido' && (
                      <Button
                        variant="primary"
                        size="sm"
                        onClick={() => onManageReward?.(referral.id)}
                        className="inline-flex items-center gap-2"
                      >
                        <Award className="w-4 h-4" />
                        Gestionar recompensa
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {activeTab === 'stats' && stats && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-4">
              <div className="flex items-center gap-2 mb-2">
                <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Tasa de Conversión</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {stats.conversionRate.toFixed(1)}%
              </p>
            </div>
            <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-4">
              <div className="flex items-center gap-2 mb-2">
                <Award className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Recompensas</span>
              </div>
              <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">{stats.totalRewardsGiven}</p>
            </div>
          </div>

          {stats.topReferrers.length > 0 && (
            <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-5">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4 flex items-center gap-2">
                <Award className="w-4 h-4" />
                Top Referidores
              </h4>
              <div className="space-y-3">
                {stats.topReferrers.map((referrer, index) => (
                  <div
                    key={referrer.clientId}
                    className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                        {index + 1}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-slate-900 dark:text-slate-100">
                          {referrer.clientName}
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400">
                          {referrer.convertedCount} convertido{referrer.convertedCount !== 1 ? 's' : ''} de{' '}
                          {referrer.referralCount} referido{referrer.referralCount !== 1 ? 's' : ''}
                        </p>
                      </div>
                    </div>
                    <Badge variant="blue" size="sm">
                      {referrer.referralCount} referidos
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}

          {stats.referralsByStatus.length > 0 && (
            <div className="rounded-xl border border-slate-200/60 dark:border-slate-800/60 bg-gradient-to-br from-white to-slate-50 dark:from-slate-900 dark:to-slate-950 p-5">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-4">Referidos por Estado</h4>
              <div className="space-y-2">
                {stats.referralsByStatus.map((item) => (
                  <div key={item.status} className="flex items-center justify-between">
                    <span className="text-sm text-slate-600 dark:text-slate-400">
                      {getStatusLabel(item.status)}
                    </span>
                    <Badge size="sm" className={getStatusColor(item.status)}>
                      {item.count}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}

