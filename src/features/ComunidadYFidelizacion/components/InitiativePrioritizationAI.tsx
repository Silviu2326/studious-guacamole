import { useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Users,
  DollarSign,
  Target,
  Sparkles,
  Award,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  RefreshCw,
  Lightbulb,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { Card, Badge, Button, Tabs, Modal, Select } from '../../../components/componentsreutilizables';
import {
  InitiativePrioritization,
  CommunityActivityType,
  ActivityCorrelation,
} from '../types';

interface InitiativePrioritizationAIProps {
  prioritization?: InitiativePrioritization;
  loading?: boolean;
  onRefresh?: () => void;
  onGenerateReport?: (period: '30d' | '90d' | '12m') => void;
}

const PERIOD_OPTIONS: { value: '30d' | '90d' | '12m'; label: string }[] = [
  { value: '30d', label: 'Últimos 30 días' },
  { value: '90d', label: 'Últimos 90 días' },
  { value: '12m', label: 'Últimos 12 meses' },
];

const ACTIVITY_TYPE_LABELS: Record<CommunityActivityType, string> = {
  programa: 'Programa',
  evento: 'Evento',
  reto: 'Reto',
  workshop: 'Workshop',
  webinar: 'Webinar',
  competencia: 'Competencia',
  networking: 'Networking',
  celebracion: 'Celebración',
};

const RECOMMENDATION_LABELS: Record<'increase' | 'maintain' | 'reduce' | 'discontinue' | 'replicate', string> = {
  increase: 'Aumentar inversión',
  maintain: 'Mantener inversión',
  reduce: 'Reducir inversión',
  discontinue: 'Descontinuar',
  replicate: 'Replicar modelo',
};

const RECOMMENDATION_COLORS: Record<'increase' | 'maintain' | 'reduce' | 'discontinue' | 'replicate', string> = {
  increase: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-200',
  maintain: 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-200',
  reduce: 'bg-amber-100 text-amber-700 dark:bg-amber-900/20 dark:text-amber-200',
  discontinue: 'bg-rose-100 text-rose-700 dark:bg-rose-900/20 dark:text-rose-200',
  replicate: 'bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-200',
};

const PRIORITY_COLORS: Record<number, string> = {
  1: 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white',
  2: 'bg-gradient-to-r from-orange-400 to-orange-600 text-white',
  3: 'bg-gradient-to-r from-pink-400 to-pink-600 text-white',
};

export function InitiativePrioritizationAI({
  prioritization,
  loading = false,
  onRefresh,
  onGenerateReport,
}: InitiativePrioritizationAIProps) {
  const [activeTab, setActiveTab] = useState<'prioritized' | 'insights' | 'patterns'>('prioritized');
  const [selectedInitiative, setSelectedInitiative] = useState<any>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState<'30d' | '90d' | '12m'>('30d');

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercentage = (value: number) => {
    return `${value > 0 ? '+' : ''}${value.toFixed(1)}%`;
  };

  const getPriorityBadge = (rank: number) => {
    if (rank <= 3) {
      return (
        <Badge className={PRIORITY_COLORS[rank] || 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'}>
          #{rank} Prioridad
        </Badge>
      );
    }
    return (
      <Badge variant="secondary">
        #{rank} Prioridad
      </Badge>
    );
  };

  const handleGenerateReport = () => {
    if (onGenerateReport) {
      onGenerateReport(selectedPeriod);
    }
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <p className="mt-4 text-gray-600 dark:text-slate-400">Analizando iniciativas...</p>
        </div>
      </Card>
    );
  }

  if (!prioritization) {
    return (
      <Card className="p-6">
        <div className="text-center py-12">
          <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-2">
            Análisis de Priorización de Iniciativas
          </h3>
          <p className="text-gray-600 dark:text-slate-400 mb-6">
            La IA analiza qué iniciativas generan mayor retención y referidos para priorizar las más efectivas
          </p>
          <div className="flex items-center justify-center gap-4">
            <Select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value as '30d' | '90d' | '12m')}
              className="w-48"
            >
              {PERIOD_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </Select>
            <Button onClick={handleGenerateReport}>
              <Sparkles className="w-4 h-4 mr-2" />
              Generar análisis
            </Button>
          </div>
        </div>
      </Card>
    );
  }

  const topInitiatives = prioritization.prioritizedInitiatives.slice(0, 10);

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-slate-100">
            Priorización IA de Iniciativas
          </h2>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
            La IA aprende qué iniciativas generan mayor retención y referidos para priorizar las más efectivas
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={selectedPeriod}
            onChange={(e) => {
              setSelectedPeriod(e.target.value as '30d' | '90d' | '12m');
              if (onGenerateReport) {
                onGenerateReport(e.target.value as '30d' | '90d' | '12m');
              }
            }}
            className="w-48"
          >
            {PERIOD_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </Select>
          <Button variant="secondary" onClick={onRefresh}>
            <RefreshCw className="w-4 h-4 mr-2" />
            Actualizar
          </Button>
        </div>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-900/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <span className="text-sm font-medium text-indigo-700 dark:text-indigo-300">Total Iniciativas</span>
          </div>
          <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-100">
            {prioritization.summary.totalInitiatives}
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-900/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Alta Prioridad</span>
          </div>
          <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
            {prioritization.summary.highPriorityCount}
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-900/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-medium text-blue-700 dark:text-blue-300">Referidos</span>
          </div>
          <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">
            {prioritization.summary.totalReferralsAttributed}
          </p>
        </div>
        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-900/10 rounded-lg">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Retención</span>
          </div>
          <p className="text-2xl font-bold text-purple-900 dark:text-purple-100">
            {formatPercentage(prioritization.summary.totalRetentionLift)}
          </p>
        </div>
      </div>

      <Tabs
        items={[
          {
            id: 'prioritized',
            label: 'Iniciativas Priorizadas',
            icon: <BarChart3 className="w-4 h-4" />,
          },
          {
            id: 'insights',
            label: 'Insights IA',
            icon: <Lightbulb className="w-4 h-4" />,
          },
          {
            id: 'patterns',
            label: 'Patrones Detectados',
            icon: <Sparkles className="w-4 h-4" />,
          },
        ]}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as 'prioritized' | 'insights' | 'patterns')}
        variant="pills"
      />

      {activeTab === 'prioritized' && (
        <div className="space-y-4">
          {topInitiatives.map((item) => (
            <div
              key={item.initiative.id}
              className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
              onClick={() => {
                setSelectedInitiative(item);
                setIsDetailModalOpen(true);
              }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start gap-4 flex-1">
                  <div className="p-3 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg">
                    <Target className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getPriorityBadge(item.priorityRank)}
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                        {item.initiative.name}
                      </h3>
                      <Badge variant="secondary">
                        {ACTIVITY_TYPE_LABELS[item.initiative.type]}
                      </Badge>
                      <Badge className={RECOMMENDATION_COLORS[item.recommendation]}>
                        {RECOMMENDATION_LABELS[item.recommendation]}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">{item.reasoning}</p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-gray-500 dark:text-slate-500 mb-1">Score Prioridad</p>
                        <p className="text-lg font-bold text-gray-900 dark:text-slate-100">
                          {item.priorityScore.toFixed(1)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-slate-500 mb-1">Referidos</p>
                        <p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                          {item.referralImpact.referralsGenerated}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-slate-500 mb-1">Retención</p>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {formatPercentage(item.retentionImpact.retentionLift)}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 dark:text-slate-500 mb-1">ROI</p>
                        <p className="text-lg font-bold text-purple-600 dark:text-purple-400">
                          {formatPercentage(item.revenueImpact.roi)}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <ArrowUpRight className="w-5 h-5 text-gray-400" />
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'insights' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
              Top Performers
            </h3>
            <div className="space-y-2">
              {prioritization.aiInsights.topPerformers.map((id, index) => {
                const initiative = prioritization.prioritizedInitiatives.find(
                  (item) => item.initiative.id === id,
                );
                if (!initiative) return null;
                return (
                  <div
                    key={id}
                    className="p-3 bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-200 dark:border-emerald-800 rounded-lg flex items-center gap-3"
                  >
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 dark:text-slate-100">
                        {initiative.initiative.name}
                      </p>
                      <p className="text-sm text-gray-600 dark:text-slate-400">
                        {initiative.referralImpact.referralsGenerated} referidos,{' '}
                        {formatPercentage(initiative.retentionImpact.retentionLift)} retención
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-4">
              Recomendaciones
            </h3>
            <div className="space-y-3">
              {prioritization.aiInsights.recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                >
                  <div className="flex items-start gap-3">
                    <Lightbulb
                      className={`w-5 h-5 mt-0.5 ${
                        rec.priority === 'high'
                          ? 'text-amber-500'
                          : rec.priority === 'medium'
                            ? 'text-blue-500'
                            : 'text-gray-400'
                      }`}
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-gray-900 dark:text-slate-100">{rec.action}</p>
                        <Badge
                          variant={rec.priority === 'high' ? 'amber' : rec.priority === 'medium' ? 'blue' : 'secondary'}
                        >
                          {rec.priority === 'high' ? 'Alta' : rec.priority === 'medium' ? 'Media' : 'Baja'}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-slate-400 mb-2">{rec.reasoning}</p>
                      <p className="text-xs text-gray-500 dark:text-slate-500">
                        Impacto esperado: {rec.expectedImpact}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'patterns' && (
        <div className="space-y-4">
          {prioritization.aiInsights.patterns.map((pattern, index) => (
            <div
              key={index}
              className="p-5 border border-gray-200 dark:border-gray-700 rounded-lg"
            >
              <div className="flex items-start gap-3 mb-3">
                <Sparkles className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-slate-100 mb-1">{pattern.pattern}</h3>
                  <p className="text-sm text-gray-600 dark:text-slate-400 mb-3">{pattern.description}</p>
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-gray-700 dark:text-slate-300">Evidencia:</p>
                    <ul className="list-disc list-inside space-y-1 text-xs text-gray-600 dark:text-slate-400">
                      {pattern.evidence.map((ev, i) => (
                        <li key={i}>{ev}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-3">
                    <Badge variant="secondary">Confianza: {pattern.confidence}%</Badge>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal de detalle */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        title={selectedInitiative ? selectedInitiative.initiative.name : 'Detalle'}
        size="lg"
      >
        {selectedInitiative && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-500 mb-1">Ranking</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-slate-100">
                  #{selectedInitiative.priorityRank}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-500 mb-1">Score de Prioridad</p>
                <p className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">
                  {selectedInitiative.priorityScore.toFixed(1)}
                </p>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-3">Métricas de Referidos</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-emerald-50 dark:bg-emerald-900/10 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-slate-500 mb-1">Referidos Generados</p>
                  <p className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                    {selectedInitiative.referralImpact.referralsGenerated}
                  </p>
                </div>
                <div className="p-3 bg-blue-50 dark:bg-blue-900/10 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-slate-500 mb-1">Tasa de Conversión</p>
                  <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                    {formatPercentage(selectedInitiative.referralImpact.referralConversionRate)}
                  </p>
                </div>
                <div className="p-3 bg-purple-50 dark:bg-purple-900/10 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-slate-500 mb-1">Ingresos de Referidos</p>
                  <p className="text-xl font-bold text-purple-600 dark:text-purple-400">
                    {formatCurrency(selectedInitiative.referralImpact.referralRevenue)}
                  </p>
                </div>
                <div className="p-3 bg-orange-50 dark:bg-orange-900/10 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-slate-500 mb-1">ROI de Referidos</p>
                  <p className="text-xl font-bold text-orange-600 dark:text-orange-400">
                    {formatPercentage(selectedInitiative.referralImpact.referralROI)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-3">Métricas de Retención</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-indigo-50 dark:bg-indigo-900/10 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-slate-500 mb-1">Tasa de Retención</p>
                  <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
                    {formatPercentage(selectedInitiative.retentionImpact.retentionRate)}
                  </p>
                </div>
                <div className="p-3 bg-teal-50 dark:bg-teal-900/10 rounded-lg">
                  <p className="text-xs text-gray-500 dark:text-slate-500 mb-1">Incremento en Retención</p>
                  <p className="text-xl font-bold text-teal-600 dark:text-teal-400">
                    {formatPercentage(selectedInitiative.retentionImpact.retentionLift)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-2">Recomendación</h4>
              <Badge className={RECOMMENDATION_COLORS[selectedInitiative.recommendation]}>
                {RECOMMENDATION_LABELS[selectedInitiative.recommendation]}
              </Badge>
              <p className="text-sm text-gray-600 dark:text-slate-400 mt-2">{selectedInitiative.reasoning}</p>
            </div>

            {selectedInitiative.learningData.aiPatterns && (
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-slate-100 mb-3">Patrones IA Detectados</h4>
                {selectedInitiative.learningData.aiPatterns.bestAudience && (
                  <div className="mb-3">
                    <p className="text-xs text-gray-500 dark:text-slate-500 mb-1">Mejor Audiencia</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedInitiative.learningData.aiPatterns.bestAudience.map((seg) => (
                        <Badge key={seg} variant="secondary">{seg}</Badge>
                      ))}
                    </div>
                  </div>
                )}
                {selectedInitiative.learningData.aiPatterns.keySuccessFactors && (
                  <div>
                    <p className="text-xs text-gray-500 dark:text-slate-500 mb-1">Factores Clave de Éxito</p>
                    <ul className="list-disc list-inside text-sm text-gray-600 dark:text-slate-400">
                      {selectedInitiative.learningData.aiPatterns.keySuccessFactors.map((factor, i) => (
                        <li key={i}>{factor}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </Modal>
    </Card>
  );
}

