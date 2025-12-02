import { UsersRound } from 'lucide-react';
import { Badge, Card } from '../../../components/componentsreutilizables';
import { Segment } from '../api';

interface SegmentsSelectorProps {
  segments: Segment[];
  selectedSegmentId?: string;
  onSelectSegment: (segmentId: string) => void;
}

export function SegmentsSelector({ segments, selectedSegmentId, onSelectSegment }: SegmentsSelectorProps) {
  return (
    <Card padding="none" className="bg-white shadow-sm ring-1 ring-slate-200">
      <div className="px-6 py-5">
        <header className="mb-6 flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">Segmentos simples</h2>
            <p className="text-sm text-slate-600">
              Lanza campañas predefinidas a nuevos miembros, inactivos o clientes en riesgo.
            </p>
          </div>
          <Badge variant="blue" size="sm" leftIcon={<UsersRound size={14} />}>
            {segments.length} segmentos disponibles
          </Badge>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {segments.map(segment => {
            const isSelected = selectedSegmentId === segment.id;

            return (
              <button
                key={segment.id}
                onClick={() => onSelectSegment(segment.id)}
                className={`group flex h-full flex-col justify-between rounded-2xl border text-left transition-all ring-1 ring-slate-200 ${
                  isSelected
                    ? 'border-blue-400 bg-blue-50 shadow-md'
                    : 'border-transparent bg-slate-50 hover:-translate-y-0.5 hover:shadow-md'
                }`}
              >
                <div className="space-y-3 rounded-2xl p-5">
                  <h3 className="text-lg font-semibold text-slate-900">{segment.name}</h3>
                  <p className="text-sm text-slate-600">{segment.description}</p>
                </div>
                <div
                  className={`flex items-center justify-between rounded-b-2xl px-5 py-3 text-xs font-semibold uppercase tracking-wide transition-colors ${
                    isSelected ? 'bg-white text-blue-600' : 'bg-white text-slate-400 group-hover:text-blue-600'
                  }`}
                >
                  <span>{segment.size} contactos</span>
                  <span>{isSelected ? 'Segmento activo' : 'Seleccionar'}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </Card>
  );
}

