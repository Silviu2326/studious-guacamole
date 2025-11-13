import React, { useState, useEffect } from 'react';
import { Card, Button, Badge, Tabs } from '../../../components/componentsreutilizables';
import {
  NegativeFeedbackMicroPlan,
  CustomerFeedbackData,
  GenerateNegativeFeedbackMicroPlanRequest,
} from '../types';
import {
  generateNegativeFeedbackMicroPlanService,
  getNegativeFeedbackMicroPlansService,
} from '../services/intelligenceService';
import { AlertCircle, MessageSquare, CheckCircle, Clock, Sparkles, Send, Phone, Mail } from 'lucide-react';

interface NegativeFeedbackMicroPlansProps {
  trainerId?: string;
}

const priorityColors: Record<NegativeFeedbackMicroPlan['priority'], string> = {
  urgent: 'bg-red-100 text-red-700 border-red-200',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

const statusColors: Record<NegativeFeedbackMicroPlan['status'], string> = {
  pending: 'bg-slate-100 text-slate-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  completed: 'bg-green-100 text-green-700',
  cancelled: 'bg-red-100 text-red-700',
};

const channelIcons: Record<string, React.ReactNode> = {
  phone: <Phone size={16} />,
  email: <Mail size={16} />,
  whatsapp: <MessageSquare size={16} />,
  sms: <Send size={16} />,
  'in-app': <MessageSquare size={16} />,
};

export const NegativeFeedbackMicroPlans: React.FC<NegativeFeedbackMicroPlansProps> = ({ trainerId }) => {
  const [microPlans, setMicroPlans] = useState<NegativeFeedbackMicroPlan[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all');

  useEffect(() => {
    loadMicroPlans();
  }, [activeTab]);

  const loadMicroPlans = async () => {
    setLoading(true);
    try {
      const response = await getNegativeFeedbackMicroPlansService({
        status: activeTab !== 'all' ? activeTab : undefined,
        trainerId,
        limit: 20,
      });
      setMicroPlans(response.microPlans);
    } catch (error) {
      console.error('Error cargando micro planes:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateMicroPlan = async () => {
    setGenerating(true);
    try {
      // Ejemplo de feedback negativo simulado
      const negativeFeedback: CustomerFeedbackData = {
        feedbackId: `feedback-${Date.now()}`,
        customerId: 'customer-001',
        customerName: 'Cliente Ejemplo',
        feedbackType: 'survey',
        content: 'No estoy satisfecho con el servicio recibido. Las sesiones no cumplen mis expectativas.',
        sentiment: 'negative',
        sentimentScore: 25,
        topics: ['servicio', 'expectativas'],
        rating: 2,
        date: new Date().toISOString(),
        source: 'Encuesta NPS',
      };

      const request: GenerateNegativeFeedbackMicroPlanRequest = {
        feedback: negativeFeedback,
        customerHistory: {
          totalSessions: 5,
          lastSessionDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
          averageRating: 3,
        },
        trainerId,
      };

      const response = await generateNegativeFeedbackMicroPlanService(request);
      setMicroPlans([response.microPlan, ...microPlans]);
    } catch (error) {
      console.error('Error generando micro plan:', error);
    } finally {
      setGenerating(false);
    }
  };

  const filteredPlans = activeTab === 'all' 
    ? microPlans 
    : microPlans.filter((mp) => mp.status === activeTab);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Micro Planes IA para Feedback Negativo</h3>
          <p className="text-sm text-slate-600 mt-1">
            Cada feedback negativo genera automáticamente un micro plan (mensaje, acción, seguimiento) para resolver rápidamente.
          </p>
        </div>
        <Button
          onClick={handleGenerateMicroPlan}
          disabled={generating}
          leftIcon={<Sparkles size={16} />}
          size="sm"
        >
          {generating ? 'Generando...' : 'Generar micro plan de ejemplo'}
        </Button>
      </div>

      <Tabs
        items={[
          { id: 'all', label: 'Todos' },
          { id: 'pending', label: 'Pendientes' },
          { id: 'in-progress', label: 'En progreso' },
          { id: 'completed', label: 'Completados' },
        ]}
        activeTab={activeTab}
        onTabChange={(tabId) => setActiveTab(tabId as typeof activeTab)}
        variant="underline"
      />

      {loading ? (
        <div className="text-center py-8 text-slate-500">Cargando micro planes...</div>
      ) : filteredPlans.length === 0 ? (
        <Card className="p-8 text-center bg-slate-50 border border-slate-200">
          <AlertCircle className="mx-auto text-slate-400 mb-4" size={32} />
          <p className="text-sm text-slate-600">
            No hay micro planes {activeTab !== 'all' ? `con status "${activeTab}"` : ''}. 
            {activeTab === 'all' && ' Genera uno para comenzar.'}
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredPlans.map((plan) => (
            <Card key={plan.id} className="p-6 border border-slate-200 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="text-base font-semibold text-slate-900">{plan.customerName}</h4>
                    <Badge variant={priorityColors[plan.priority].includes('red') ? 'danger' : 'warning'} size="sm">
                      {plan.priority}
                    </Badge>
                    <Badge variant={statusColors[plan.status].includes('green') ? 'success' : 'secondary'} size="sm">
                      {plan.status}
                    </Badge>
                  </div>
                  <p className="text-sm text-slate-600">{plan.reasoning}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-slate-500">Confianza: {plan.confidenceScore}%</p>
                  {plan.estimatedResolutionTime && (
                    <p className="text-xs text-slate-500 mt-1">
                      Resolución: {plan.estimatedResolutionTime}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {/* Mensaje */}
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center gap-2 mb-2">
                    {channelIcons[plan.message.channel] || <MessageSquare size={16} />}
                    <span className="text-sm font-semibold text-slate-900">Mensaje</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    Canal: {plan.message.channel} • Tono: {plan.message.tone} • Timing: {plan.message.suggestedTiming}
                  </p>
                  <p className="text-sm text-slate-700 line-clamp-3">{plan.message.content}</p>
                </div>

                {/* Acción */}
                <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
                  <div className="flex items-center gap-2 mb-2">
                    <CheckCircle size={16} />
                    <span className="text-sm font-semibold text-slate-900">Acción</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    Tipo: {plan.action.type} • Timing: {plan.action.suggestedTiming}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 mb-1">{plan.action.title}</p>
                  <p className="text-sm text-slate-700 line-clamp-2">{plan.action.description}</p>
                  <p className="text-xs text-slate-600 mt-2">
                    Resultado esperado: {plan.action.expectedOutcome}
                  </p>
                </div>

                {/* Seguimiento */}
                <div className="p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock size={16} />
                    <span className="text-sm font-semibold text-slate-900">Seguimiento</span>
                  </div>
                  <p className="text-xs text-slate-600 mb-2">
                    Tipo: {plan.followUp.type} • Timing: {plan.followUp.suggestedTiming}
                  </p>
                  <p className="text-sm font-semibold text-slate-900 mb-1">{plan.followUp.title}</p>
                  <p className="text-sm text-slate-700 line-clamp-2">{plan.followUp.description}</p>
                  {plan.followUp.questions && plan.followUp.questions.length > 0 && (
                    <p className="text-xs text-slate-600 mt-2">
                      {plan.followUp.questions.length} pregunta(s)
                    </p>
                  )}
                </div>
              </div>

              {plan.successMetrics && plan.successMetrics.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-xs font-semibold text-slate-700 mb-2">Métricas de éxito:</p>
                  <div className="flex gap-4">
                    {plan.successMetrics.map((metric, index) => (
                      <div key={index} className="text-xs">
                        <span className="text-slate-600">{metric.metric}:</span>
                        <span className="ml-1 font-semibold text-slate-900">
                          {metric.current !== undefined ? `${metric.current} → ` : ''}
                          {metric.target}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default NegativeFeedbackMicroPlans;

