import React from 'react';
import { Button, Card, Badge } from '../../../components/componentsreutilizables';
import { Brain, Sparkles, Wand2 } from 'lucide-react';

interface IntelligenceHeaderProps {
  onCreatePlaybook?: () => void;
  onLaunchExperiment?: () => void;
}

export const IntelligenceHeader: React.FC<IntelligenceHeaderProps> = ({
  onCreatePlaybook,
  onLaunchExperiment,
}) => {
  return (
    <Card className="p-8 bg-white/90 backdrop-blur shadow-sm border border-slate-200/70">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-100 to-sky-100 text-indigo-600">
            <Brain size={28} />
          </div>
          <div>
            <Badge className="mb-3 inline-flex items-center gap-2 bg-indigo-50 text-indigo-700">
              <Sparkles size={16} />
              Engagement Hub
            </Badge>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-slate-900">
              Inteligencia, IA & Experimentación
            </h1>
            <p className="mt-3 text-base text-slate-600 max-w-2xl">
              Coordina un hub inteligente para decidir el siguiente mejor paso. Orquesta playbooks,
              personalización avanzada y experimentos de alto impacto con una sola vista.
            </p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button onClick={onCreatePlaybook} leftIcon={<Wand2 size={18} />} variant="secondary">
            Nuevo Playbook IA
          </Button>
          <Button onClick={onLaunchExperiment} leftIcon={<Sparkles size={18} />}>
            Lanzar Experimento
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default IntelligenceHeader;








