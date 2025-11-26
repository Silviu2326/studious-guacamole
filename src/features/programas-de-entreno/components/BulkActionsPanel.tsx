import { useState } from 'react';
import { Copy, Move, TrendingDown, X, Filter } from 'lucide-react';
import { Button, Select, Modal } from '../../../components/componentsreutilizables';
import type { DaySession, DayPlan } from '../types';

type BulkActionsPanelProps = {
  selectedSessions: Set<string>;
  weeklyPlan: Record<string, DayPlan>;
  weekDays: readonly string[];
  onDuplicate: (sessionIds: string[]) => void;
  onMove: (sessionIds: string[], targetDay: string) => void;
  onReduceVolume: (sessionIds: string[], percentage: number) => void;
  onClearSelection: () => void;
  onApplyFilter?: (filter: { type: 'modality' | 'day' | 'tag'; value: string }) => void;
};

type SelectionFilter = {
  type: 'modality' | 'day' | 'tag';
  value: string;
};

export function BulkActionsPanel({
  selectedSessions,
  weeklyPlan,
  weekDays,
  onDuplicate,
  onMove,
  onReduceVolume,
  onClearSelection,
  onApplyFilter,
}: BulkActionsPanelProps) {
  const [showMoveModal, setShowMoveModal] = useState(false);
  const [showReduceModal, setShowReduceModal] = useState(false);
  const [targetDay, setTargetDay] = useState<string>('');
  const [reducePercentage, setReducePercentage] = useState<number>(10);

  // Get all unique modalities, days, and tags from the plan
  const allModalities = new Set<string>();
  const allTags = new Set<string>();
  
  weekDays.forEach((day) => {
    const plan = weeklyPlan[day];
    plan?.sessions.forEach((session) => {
      if (session.modality) allModalities.add(session.modality);
      if (session.tags) {
        session.tags.forEach((tag) => allTags.add(tag));
      }
    });
  });

  // Apply filter to select sessions
  const applyFilter = (filter: { type: 'modality' | 'day' | 'tag'; value: string }) => {
    onApplyFilter?.(filter);
  };

  const handleDuplicate = () => {
    onDuplicate(Array.from(selectedSessions));
    onClearSelection();
  };

  const handleMove = () => {
    if (targetDay) {
      onMove(Array.from(selectedSessions), targetDay);
      setShowMoveModal(false);
      setTargetDay('');
      onClearSelection();
    }
  };

  const handleReduceVolume = () => {
    onReduceVolume(Array.from(selectedSessions), reducePercentage);
    setShowReduceModal(false);
    setReducePercentage(10);
    onClearSelection();
  };

  if (selectedSessions.size === 0) {
    return (
      <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500" />
            <span className="text-sm font-medium text-slate-700">Seleccionar por:</span>
          </div>
          <div className="flex gap-2">
            <Select
              value=""
              onChange={(e) => {
                if (e.target.value) {
                  const [type, value] = e.target.value.split(':');
                  applyFilter({ type: type as 'modality' | 'day' | 'tag', value });
                }
              }}
              className="text-sm"
            >
              <option value="">Seleccionar filtro...</option>
              <optgroup label="Por Modalidad">
                {Array.from(allModalities).map((modality) => (
                  <option key={modality} value={`modality:${modality}`}>
                    {modality}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Por Día">
                {weekDays.map((day) => (
                  <option key={day} value={`day:${day}`}>
                    {day}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Por Tag">
                {Array.from(allTags).map((tag) => (
                  <option key={tag} value={`tag:${tag}`}>
                    {tag}
                  </option>
                ))}
              </optgroup>
            </Select>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border-2 border-indigo-500 bg-indigo-50 p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-sm font-semibold text-indigo-900">
            {selectedSessions.size} bloque{selectedSessions.size !== 1 ? 's' : ''} seleccionado{selectedSessions.size !== 1 ? 's' : ''}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Copy className="h-4 w-4" />}
            onClick={handleDuplicate}
            className="text-indigo-700 hover:bg-indigo-100"
          >
            Duplicar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<Move className="h-4 w-4" />}
            onClick={() => setShowMoveModal(true)}
            className="text-indigo-700 hover:bg-indigo-100"
          >
            Desplazar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<TrendingDown className="h-4 w-4" />}
            onClick={() => setShowReduceModal(true)}
            className="text-indigo-700 hover:bg-indigo-100"
          >
            Reducir volumen
          </Button>
          <Button
            variant="ghost"
            size="sm"
            leftIcon={<X className="h-4 w-4" />}
            onClick={onClearSelection}
            className="text-indigo-700 hover:bg-indigo-100"
          >
            Limpiar
          </Button>
        </div>
      </div>

      {/* Move Modal */}
      <Modal
        open={showMoveModal}
        onOpenChange={setShowMoveModal}
        title="Desplazar bloques"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Selecciona el día destino para mover {selectedSessions.size} bloque{selectedSessions.size !== 1 ? 's' : ''}:
          </p>
          <Select
            value={targetDay}
            onChange={(e) => setTargetDay(e.target.value)}
            className="w-full"
          >
            <option value="">Seleccionar día...</option>
            {weekDays.map((day) => (
              <option key={day} value={day}>
                {day}
              </option>
            ))}
          </Select>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowMoveModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleMove} disabled={!targetDay}>
              Mover
            </Button>
          </div>
        </div>
      </Modal>

      {/* Reduce Volume Modal */}
      <Modal
        open={showReduceModal}
        onOpenChange={setShowReduceModal}
        title="Reducir volumen"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-600">
            Reduce el volumen de {selectedSessions.size} bloque{selectedSessions.size !== 1 ? 's' : ''} seleccionado{selectedSessions.size !== 1 ? 's' : ''}:
          </p>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">
              Porcentaje de reducción: {reducePercentage}%
            </label>
            <input
              type="range"
              min="5"
              max="50"
              step="5"
              value={reducePercentage}
              onChange={(e) => setReducePercentage(Number(e.target.value))}
              className="w-full"
            />
            <div className="mt-2 flex justify-between text-xs text-slate-500">
              <span>5%</span>
              <span>50%</span>
            </div>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setShowReduceModal(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleReduceVolume}>
              Reducir
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}

