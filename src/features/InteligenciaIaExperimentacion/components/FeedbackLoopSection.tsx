import React, { useMemo, useState } from 'react';
import { Card, Tabs, Badge, Button, Tooltip } from '../../../components/componentsreutilizables';
import { FeedbackLoopRecord } from '../types';
import { MessageSquareHeart, Sparkles, Send, BarChart } from 'lucide-react';

interface FeedbackLoopSectionProps {
  feedbackLoops: FeedbackLoopRecord[];
}

const statusCopy: Record<FeedbackLoopRecord['status'], { label: string; variant: 'success' | 'yellow' | 'secondary' }> = {
  active: { label: 'Activo', variant: 'success' },
  scheduled: { label: 'Programado', variant: 'yellow' },
  paused: { label: 'Pausado', variant: 'secondary' },
};

export const FeedbackLoopSection: React.FC<FeedbackLoopSectionProps> = ({ feedbackLoops }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'surveys' | 'insights'>('overview');

  const surveyStats = useMemo(() => {
    const totalResponses = feedbackLoops.reduce((acc, item) => acc + item.responseRate, 0);
    const activeCount = feedbackLoops.filter((item) => item.status === 'active').length;
    return {
      avgResponseRate: feedbackLoops.length ? Math.round(totalResponses / feedbackLoops.length) : 0,
      activeCount,
      nextSurvey: feedbackLoops
        .filter((item) => item.status === 'scheduled')
        .sort((a, b) => (a.lastRun < b.lastRun ? -1 : 1))[0],
    };
  }, [feedbackLoops]);

  return (
    <Card className="p-0 bg-white shadow-sm border border-slate-200/70">
      <div className="p-6 border-b border-slate-200/60">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-emerald-100 text-emerald-600">
              <MessageSquareHeart size={20} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-slate-900">Feedback Loop & Encuestas Inteligentes</h2>
              <p className="text-sm text-slate-600">
                Captura señales de clientes en tiempo real y sincroniza insights con tus playbooks.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" leftIcon={<BarChart size={16} />}>
              Panel de resultados
            </Button>
            <Button size="sm" leftIcon={<Send size={16} />}>
              Lanzar nueva encuesta
            </Button>
          </div>
        </div>

        <div className="mt-4">
          <Tabs
            items={[
              { id: 'overview', label: 'Resumen' },
              { id: 'surveys', label: 'Encuestas activas' },
              { id: 'insights', label: 'Hallazgos inteligentes' },
            ]}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
            variant="underline"
          />
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/60">
              <p className="text-sm text-slate-500">Encuestas activas</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">{surveyStats.activeCount}</p>
              <p className="text-xs text-slate-500 mt-2">
                Se actualiza automáticamente según engagement de clientes clave.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/60">
              <p className="text-sm text-slate-500">Tasa de respuesta promedio</p>
              <p className="mt-2 text-3xl font-semibold text-slate-900">
                {surveyStats.avgResponseRate}
                <span className="text-base text-slate-500 ml-1">%</span>
              </p>
              <p className="text-xs text-slate-500 mt-2">Comparado vs benchmark de la industria.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 p-5 bg-slate-50/60">
              <p className="text-sm text-slate-500">Próxima escucha</p>
              {surveyStats.nextSurvey ? (
                <div className="mt-2">
                  <p className="text-base font-semibold text-slate-900">
                    {surveyStats.nextSurvey.title}
                  </p>
                  <p className="text-xs text-slate-500 mt-2">
                    Próxima ejecución: {new Date(surveyStats.nextSurvey.lastRun).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <p className="mt-2 text-3xl font-semibold text-slate-900">—</p>
              )}
            </div>
          </div>
        )}

        {activeTab === 'surveys' && (
          <div className="space-y-4">
            {feedbackLoops.map((loop) => (
              <div
                key={loop.id}
                className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border border-slate-200 rounded-2xl p-4"
              >
                <div>
                  <p className="text-base font-semibold text-slate-900">{loop.title}</p>
                  <p className="text-sm text-slate-500">Audiencia: {loop.audience}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant={statusCopy[loop.status].variant} size="sm">
                    {statusCopy[loop.status].label}
                  </Badge>
                  <Badge variant="blue" size="sm">
                    Respuesta {loop.responseRate}%
                  </Badge>
                  <Tooltip content={`Última ejecución el ${new Date(loop.lastRun).toLocaleDateString()}`}>
                    <span className="text-xs text-slate-500">
                      Última ejecución: {new Date(loop.lastRun).toLocaleDateString()}
                    </span>
                  </Tooltip>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'insights' && (
          <div className="rounded-2xl border border-slate-200 p-6 bg-gradient-to-br from-purple-50 to-indigo-50">
            <div className="flex items-start gap-4">
              <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
                <Sparkles size={20} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">
                  Automatiza decisiones con IA generativa
                </h3>
                <p className="text-sm text-slate-600 mt-1">
                  Descubre insights accionables basados en sentimientos predominantes, NPS y temas emergentes en tus
                  encuestas. Conecta hallazgos con playbooks de fidelización, cross-selling y nurturing avanzado.
                </p>
                <Button className="mt-4" leftIcon={<Sparkles size={16} />} variant="secondary">
                  Activar resumen inteligente
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default FeedbackLoopSection;








