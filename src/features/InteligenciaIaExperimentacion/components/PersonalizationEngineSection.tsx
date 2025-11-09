import React, { useState } from 'react';
import { Card, Tabs, Badge, Button } from '../../../components/componentsreutilizables';
import { Sparkles, Target, Users, LayoutTemplate } from 'lucide-react';

const personalizationTabs = [
  { id: 'segments', label: 'Segmentos dinámicos', icon: <Users size={16} /> },
  { id: 'journeys', label: 'Journeys personalizados', icon: <Target size={16} /> },
  { id: 'templates', label: 'Templates generativos', icon: <LayoutTemplate size={16} /> },
];

export const PersonalizationEngineSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('segments');

  return (
    <Card className="p-0 bg-white shadow-sm border border-slate-200/70">
      <div className="p-6 border-b border-slate-200/60">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-indigo-100 text-indigo-600">
            <Sparkles size={20} />
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-slate-900">Personalization Engine (IA avanzada)</h2>
            <p className="text-sm text-slate-600">
              Configura experiencias 1:1 combinando señales de comportamiento, predicciones y contenido generado por IA.
            </p>
          </div>
        </div>
        <div className="mt-6">
          <Tabs
            items={personalizationTabs.map((tab) => ({ id: tab.id, label: tab.label, icon: tab.icon }))}
            activeTab={activeTab}
            onTabChange={(tabId) => setActiveTab(tabId)}
            variant="pills"
          />
        </div>
      </div>

      <div className="p-6">
        {activeTab === 'segments' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Combina scores de propensión, afinidad de contenidos y etapa del funnel para generar segmentos actualizados en tiempo real.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {([
                {
                  title: 'Champions',
                  desc: 'Clientes con engagement alto y alta propensión a upgrades',
                  variant: 'green' as const,
                },
                {
                  title: 'Riesgo silencioso',
                  desc: 'Usuarios activos pero con señales tempranas de abandono',
                  variant: 'yellow' as const,
                },
                {
                  title: 'Exploradores IA',
                  desc: 'Segmento con alta interacción con contenido AI-first',
                  variant: 'blue' as const,
                },
              ]).map((segment) => (
                <div key={segment.title} className="rounded-2xl border border-slate-200 p-4 bg-slate-50/60">
                  <Badge variant={segment.variant} size="sm" className="mb-2">
                    {segment.title}
                  </Badge>
                  <p className="text-sm text-slate-600">{segment.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'journeys' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Orquesta journeys que reaccionan al comportamiento del cliente. Define qué mensaje, canal y oferta aparece en cada micro-momento.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/60">
                <p className="font-semibold text-slate-900">Journey onboarding inteligente</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc list-inside">
                  <li>Evaluación del estilo de vida y objetivos vía IA conversacional.</li>
                  <li>Activación automática de playbooks según motivación dominante.</li>
                  <li>Alertas a entrenadores cuando detectamos baja interacción.</li>
                </ul>
              </div>
              <div className="rounded-2xl border border-slate-200 p-4 bg-slate-50/60">
                <p className="font-semibold text-slate-900">Nurturing personalizado continuo</p>
                <ul className="mt-3 space-y-2 text-sm text-slate-600 list-disc list-inside">
                  <li>Contenido generado con IA adaptado al progreso semanal.</li>
                  <li>Recomendaciones dinámicas según afinidad y objetivos.</li>
                  <li>Activación de ofertas y promociones basadas en señales de conversión.</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'templates' && (
          <div className="space-y-4">
            <p className="text-sm text-slate-600">
              Crea prompts y plantillas generativas aprobadas por tu marca para escalar contenido personalizado a cualquier canal.
            </p>
            <div className="rounded-2xl border border-dashed border-indigo-200 p-6 bg-indigo-50/50">
              <p className="font-semibold text-indigo-900">Generador de Estrategias de Marketing con IA</p>
              <p className="text-sm text-indigo-800 mt-2">
                Conecta con el módulo dedicado para generar propuestas completas: objetivos, audiencias, mensajes clave y playbooks recomendados.
              </p>
              <Button className="mt-4" variant="secondary" leftIcon={<Sparkles size={16} />}>
                Abrir generador IA
              </Button>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PersonalizationEngineSection;

