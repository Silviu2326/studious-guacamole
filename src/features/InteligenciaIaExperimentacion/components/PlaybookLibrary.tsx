import React from 'react';
import {
  TableWithActions,
  Badge,
  Tooltip,
  Button,
} from '../../../components/componentsreutilizables';
import { PlaybookRecord } from '../types';
import { BookOpenCheck, Eye, CopyPlus, PauseCircle } from 'lucide-react';

interface PlaybookLibraryProps {
  playbooks: PlaybookRecord[];
}

const statusVariant: Record<PlaybookRecord['status'], 'success' | 'secondary' | 'yellow' | 'red'> = {
  active: 'success',
  draft: 'secondary',
  paused: 'yellow',
  archived: 'red',
};

export const PlaybookLibrary: React.FC<PlaybookLibraryProps> = ({ playbooks }) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-slate-900/5 text-slate-700">
            <BookOpenCheck size={20} />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Librería de Campañas (Playbooks)</h2>
            <p className="text-sm text-slate-600">
              Diseña, evalúa y recicla playbooks multicanal impulsados por IA.
            </p>
          </div>
        </div>
        <Button variant="ghost" size="sm" leftIcon={<CopyPlus size={16} />}>
          Importar playbook
        </Button>
      </div>

      <TableWithActions<PlaybookRecord>
        data={playbooks}
        emptyMessage="Crea tu primer playbook para empezar a orquestar campañas inteligentes."
        columns={[
          {
            key: 'name',
            label: 'Playbook',
            render: (_, row) => (
              <div>
                <p className="font-semibold text-slate-900">{row.name}</p>
                <p className="text-sm text-slate-500">{row.objective}</p>
              </div>
            ),
          },
          {
            key: 'channels',
            label: 'Canales',
            render: (value: string[]) => (
              <div className="flex flex-wrap gap-2">
                {value.map((channel) => (
                  <Badge key={channel} variant="secondary" size="sm">
                    {channel}
                  </Badge>
                ))}
              </div>
            ),
          },
          {
            key: 'owner',
            label: 'Propietario',
          },
          {
            key: 'status',
            label: 'Estado',
            render: (value: PlaybookRecord['status']) => (
              <Badge variant={statusVariant[value]} size="sm">
                {value === 'active' && 'Activo'}
                {value === 'draft' && 'Borrador'}
                {value === 'paused' && 'Pausado'}
                {value === 'archived' && 'Archivado'}
              </Badge>
            ),
          },
          {
            key: 'impact',
            label: 'Impacto',
            render: (value: PlaybookRecord['impact']) => (
              <Badge variant={value === 'Alto' ? 'purple' : value === 'Medio' ? 'blue' : 'secondary'} size="sm">
                {value}
              </Badge>
            ),
          },
        ]}
        actions={[
          {
            label: 'Ver detalle',
            icon: <Eye size={16} />,
            onClick: () => undefined,
          },
          {
            label: 'Duplicar',
            icon: <CopyPlus size={16} />,
            onClick: () => undefined,
          },
          {
            label: 'Pausar',
            icon: <PauseCircle size={16} />,
            onClick: () => undefined,
            disabled: (row) => row.status !== 'active',
          },
        ]}
      />

      <div className="rounded-2xl border border-dashed border-slate-200 p-6 bg-slate-50/70">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-900">¿Buscas inspiración?</p>
            <p className="text-sm text-slate-600">
              Conecta con la base de Playbooks IA recomendados según tus objetivos del mes.
            </p>
          </div>
          <Tooltip content="Disponible en la próxima actualización de la plataforma.">
            <span>
              <Button variant="secondary" size="sm" disabled>
                Explorar biblioteca global
              </Button>
            </span>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};

export default PlaybookLibrary;


