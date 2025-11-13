import { useState, useMemo } from 'react';
import { X, Plus, Tag, Check } from 'lucide-react';
import { Button, Input, Modal, Badge } from '../../../components/componentsreutilizables';
import type { DayPlan, DaySession } from '../types';

type TagManagerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weeklyPlan: Record<string, DayPlan>;
  weekDays: readonly string[];
  onUpdatePlan: (updatedPlan: Record<string, DayPlan>) => void;
};

// Tags predefinidos comunes
const PREDEFINED_TAGS = [
  'heavy lower',
  'heavy upper',
  'metcon corto',
  'metcon largo',
  'sin equipamiento',
  'cardio',
  'fuerza',
  'hipertrofia',
  'recuperación',
  'movilidad',
  'core',
  'full body',
  'push',
  'pull',
  'legs',
  'upper body',
  'lower body',
];

type TagTarget = {
  type: 'day' | 'session' | 'exercise';
  dayKey?: string;
  sessionId?: string;
  exerciseIndex?: number;
};

export function TagManager({ open, onOpenChange, weeklyPlan, weekDays, onUpdatePlan }: TagManagerProps) {
  const [selectedTarget, setSelectedTarget] = useState<TagTarget | null>(null);
  const [newTag, setNewTag] = useState('');
  const [searchTag, setSearchTag] = useState('');

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    weekDays.forEach((day) => {
      const dayPlan = weeklyPlan[day];
      if (dayPlan?.tags) {
        dayPlan.tags.forEach((tag) => tagsSet.add(tag));
      }
      dayPlan?.sessions.forEach((session) => {
        if (session.tags) {
          session.tags.forEach((tag) => tagsSet.add(tag));
        }
      });
    });
    return Array.from(tagsSet).sort();
  }, [weeklyPlan, weekDays]);

  const filteredPredefinedTags = useMemo(() => {
    if (!searchTag) return PREDEFINED_TAGS;
    return PREDEFINED_TAGS.filter((tag) =>
      tag.toLowerCase().includes(searchTag.toLowerCase())
    );
  }, [searchTag]);

  const getCurrentTags = (target: TagTarget): string[] => {
    if (target.type === 'day' && target.dayKey) {
      return weeklyPlan[target.dayKey]?.tags || [];
    }
    if (target.type === 'session' && target.dayKey && target.sessionId) {
      const session = weeklyPlan[target.dayKey]?.sessions.find((s) => s.id === target.sessionId);
      return session?.tags || [];
    }
    return [];
  };

  const addTag = (tag: string) => {
    if (!selectedTarget || !tag.trim()) return;

    const updatedPlan = { ...weeklyPlan };

    if (selectedTarget.type === 'day' && selectedTarget.dayKey) {
      const dayPlan = updatedPlan[selectedTarget.dayKey];
      const currentTags = dayPlan.tags || [];
      if (!currentTags.includes(tag)) {
        updatedPlan[selectedTarget.dayKey] = {
          ...dayPlan,
          tags: [...currentTags, tag],
        };
      }
    } else if (selectedTarget.type === 'session' && selectedTarget.dayKey && selectedTarget.sessionId) {
      const dayPlan = updatedPlan[selectedTarget.dayKey];
      const sessions = dayPlan.sessions.map((session) => {
        if (session.id === selectedTarget.sessionId) {
          const currentTags = session.tags || [];
          if (!currentTags.includes(tag)) {
            return { ...session, tags: [...currentTags, tag] };
          }
        }
        return session;
      });
      updatedPlan[selectedTarget.dayKey] = {
        ...dayPlan,
        sessions,
      };
    }

    onUpdatePlan(updatedPlan);
    setNewTag('');
  };

  const removeTag = (tag: string) => {
    if (!selectedTarget) return;

    const updatedPlan = { ...weeklyPlan };

    if (selectedTarget.type === 'day' && selectedTarget.dayKey) {
      const dayPlan = updatedPlan[selectedTarget.dayKey];
      updatedPlan[selectedTarget.dayKey] = {
        ...dayPlan,
        tags: (dayPlan.tags || []).filter((t) => t !== tag),
      };
    } else if (selectedTarget.type === 'session' && selectedTarget.dayKey && selectedTarget.sessionId) {
      const dayPlan = updatedPlan[selectedTarget.dayKey];
      const sessions = dayPlan.sessions.map((session) => {
        if (session.id === selectedTarget.sessionId) {
          return {
            ...session,
            tags: (session.tags || []).filter((t) => t !== tag),
          };
        }
        return session;
      });
      updatedPlan[selectedTarget.dayKey] = {
        ...dayPlan,
        sessions,
      };
    }

    onUpdatePlan(updatedPlan);
  };

  const handleSelectTarget = (target: TagTarget) => {
    setSelectedTarget(target);
  };

  const currentTags = selectedTarget ? getCurrentTags(selectedTarget) : [];

  return (
    <Modal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Gestión de Tags"
      size="lg"
    >
      <div className="space-y-6">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-600">
            Asigna tags a días, sesiones y ejercicios para activar reglas basadas en condiciones dinámicas
          </p>
        </div>
        {/* Selector de objetivo */}
        <div>
          <h3 className="mb-3 text-sm font-semibold text-slate-700">Selecciona el objetivo</h3>
          <div className="space-y-2">
            <div>
              <p className="mb-2 text-xs font-medium text-slate-500">Días:</p>
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => {
                  const isSelected = selectedTarget?.type === 'day' && selectedTarget.dayKey === day;
                  const dayTags = weeklyPlan[day]?.tags || [];
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => handleSelectTarget({ type: 'day', dayKey: day })}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <Tag className="h-4 w-4" />
                      {day}
                      {dayTags.length > 0 && (
                        <Badge size="sm" variant="secondary" className="ml-1">
                          {dayTags.length}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div>
              <p className="mb-2 text-xs font-medium text-slate-500">Sesiones:</p>
              <div className="max-h-48 space-y-2 overflow-y-auto">
                {weekDays.map((day) => {
                  const dayPlan = weeklyPlan[day];
                  return dayPlan?.sessions.map((session) => {
                    const isSelected =
                      selectedTarget?.type === 'session' &&
                      selectedTarget.dayKey === day &&
                      selectedTarget.sessionId === session.id;
                    const sessionTags = session.tags || [];
                    return (
                      <button
                        key={session.id}
                        type="button"
                        onClick={() =>
                          handleSelectTarget({
                            type: 'session',
                            dayKey: day,
                            sessionId: session.id,
                          })
                        }
                        className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <Tag className="h-4 w-4" />
                          <span className="font-medium">{day}</span>
                          <span className="text-slate-500">·</span>
                          <span>{session.block}</span>
                        </div>
                        {sessionTags.length > 0 && (
                          <Badge size="sm" variant="secondary">{sessionTags.length}</Badge>
                        )}
                      </button>
                    );
                  });
                })}
              </div>
            </div>
          </div>
        </div>

        {/* Gestión de tags del objetivo seleccionado */}
        {selectedTarget && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
            <div className="mb-4">
              <h3 className="mb-2 text-sm font-semibold text-slate-700">
                Tags actuales{' '}
                {selectedTarget.type === 'day' && selectedTarget.dayKey && `(${selectedTarget.dayKey})`}
                {selectedTarget.type === 'session' && selectedTarget.dayKey && `(${selectedTarget.dayKey})`}
              </h3>
              <div className="flex flex-wrap gap-2">
                {currentTags.length === 0 ? (
                  <p className="text-sm text-slate-500">No hay tags asignados</p>
                ) : (
                  currentTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="flex items-center gap-1 bg-indigo-100 text-indigo-700"
                    >
                      {tag}
                      <button
                        type="button"
                        onClick={() => removeTag(tag)}
                        className="ml-1 rounded-full hover:bg-indigo-200"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))
                )}
              </div>
            </div>

            {/* Añadir nuevo tag */}
            <div className="space-y-3">
              <div>
                <label className="mb-2 block text-xs font-medium text-slate-700">Añadir tag</label>
                <div className="flex gap-2">
                  <Input
                    placeholder="Escribe un tag o selecciona uno de abajo"
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && newTag.trim()) {
                        e.preventDefault();
                        addTag(newTag.trim());
                      }
                    }}
                  />
                  <Button
                    variant="primary"
                    size="sm"
                    leftIcon={<Plus className="h-4 w-4" />}
                    onClick={() => {
                      if (newTag.trim()) {
                        addTag(newTag.trim());
                      }
                    }}
                  >
                    Añadir
                  </Button>
                </div>
              </div>

              {/* Tags predefinidos */}
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label className="text-xs font-medium text-slate-700">Tags predefinidos</label>
                  <Input
                    placeholder="Buscar tag..."
                    value={searchTag}
                    onChange={(e) => setSearchTag(e.target.value)}
                    className="w-40"
                    size="sm"
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  {filteredPredefinedTags.map((tag) => {
                    const isSelected = currentTags.includes(tag);
                    return (
                      <button
                        key={tag}
                        type="button"
                        onClick={() => {
                          if (isSelected) {
                            removeTag(tag);
                          } else {
                            addTag(tag);
                          }
                        }}
                        className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs transition ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-100 text-indigo-700'
                            : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        {isSelected && <Check className="h-3 w-3" />}
                        {tag}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Tags usados en el plan */}
              {allTags.length > 0 && (
                <div>
                  <label className="mb-2 block text-xs font-medium text-slate-700">Tags usados en el plan</label>
                  <div className="flex flex-wrap gap-2">
                    {allTags.map((tag) => {
                      const isSelected = currentTags.includes(tag);
                      if (PREDEFINED_TAGS.includes(tag)) return null; // Ya está en predefinidos
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              removeTag(tag);
                            } else {
                              addTag(tag);
                            }
                          }}
                          className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-xs transition ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-100 text-indigo-700'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {isSelected && <Check className="h-3 w-3" />}
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {!selectedTarget && (
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
            <Tag className="mx-auto h-12 w-12 text-slate-400" />
            <p className="mt-4 text-sm text-slate-600">Selecciona un día o sesión para gestionar sus tags</p>
          </div>
        )}
      </div>
    </Modal>
  );
}

