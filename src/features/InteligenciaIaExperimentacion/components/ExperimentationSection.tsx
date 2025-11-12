import React from 'react';
import { Card, Button, Table, Badge } from '../../../components/componentsreutilizables';
import { ExperimentRecord } from '../types';
import { FlaskConical, Plus, ActivitySquare } from 'lucide-react';

interface ExperimentationSectionProps {
  experiments: ExperimentRecord[];
}

const statusConfig: Record<ExperimentRecord['status'], { label: string; variant: 'success' | 'secondary' | 'yellow' | 'purple' }> = {
  running: { label: 'En ejecución', variant: 'success' },
  planned: { label: 'Planificado', variant: 'yellow' },
  completed: { label: 'Completado', variant: 'purple' },
  paused: { label: 'Pausado', variant: 'secondary' },
};

export const ExperimentationSection: React.FC<ExperimentationSectionProps> = ({ experiments }) => (
  <Card className="p-0 bg-white shadow-sm border border-slate-200/70">
    <div className="p-6 border-b border-slate-200/60">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-rose-100 text-rose-600">
            <FlaskConical size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Test de Estrategias</h2>
            <p className="text-sm text-slate-600">
              Prueba mensajes y estrategias: envía dos versiones diferentes a tu audiencia y descubre cuál genera más respuestas o conversiones. Compara resultados en tiempo real y activa automáticamente la versión ganadora.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" leftIcon={<ActivitySquare size={16} />}>
            Plantillas de experimentos
          </Button>
          <Button size="sm" leftIcon={<Plus size={16} />}>
            Nuevo experimento
          </Button>
        </div>
      </div>
    </div>

    <div className="p-6">
      <Table<ExperimentRecord>
        data={experiments}
        emptyMessage="Aún no tienes experimentos configurados. Crea el primero para empezar a optimizar experiencias."
        columns={[
          {
            key: 'name',
            label: 'Test de Estrategias',
            render: (_, row) => (
              <div>
                <p className="font-semibold text-slate-900">{row.name}</p>
                <p className="text-sm text-slate-500">{row.hypothesis}</p>
              </div>
            ),
          },
          {
            key: 'primaryMetric',
            label: 'Métrica principal',
          },
          {
            key: 'status',
            label: 'Estado',
            render: (value: ExperimentRecord['status']) => (
              <Badge variant={statusConfig[value].variant} size="sm">
                {statusConfig[value].label}
              </Badge>
            ),
          },
          {
            key: 'uplift',
            label: 'Uplift',
            align: 'right',
            render: (value: ExperimentRecord['uplift']) => (
              <span className="font-semibold text-slate-900">
                {value !== null ? `${value}%` : 'Pendiente'}
              </span>
            ),
          },
        ]}
      />
    </div>
  </Card>
);

export default ExperimentationSection;








