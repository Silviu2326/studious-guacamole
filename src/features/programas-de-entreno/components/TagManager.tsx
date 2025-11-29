import { useState, useMemo, useCallback, useEffect, useRef } from 'react';
import { X, Plus, Tag, Check, Search, Filter, Layers, Zap, CheckSquare, Square, BarChart3, Sparkles } from 'lucide-react';
import { Button, Input, Modal, Badge, Tabs } from '../../../components/componentsreutilizables';
import type { DayPlan } from '../types';

type TagManagerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weeklyPlan: Record<string, DayPlan>;
  weekDays: readonly string[];
  onUpdatePlan: (updatedPlan: Record<string, DayPlan>) => void;
};

// Tags predefinidos organizados por categorías
const TAG_CATEGORIES = {
  intensidad: ['heavy lower', 'heavy upper', 'ligero', 'moderado', 'intenso'],
  modalidad: ['fuerza', 'cardio', 'hipertrofia', 'metcon corto', 'metcon largo', 'movilidad', 'recuperación'],
  grupo_muscular: ['full body', 'upper body', 'lower body', 'push', 'pull', 'legs', 'core'],
  equipamiento: ['sin equipamiento', 'barra', 'mancuernas', 'kettlebell', 'bandas', 'máquinas'],
  objetivo: ['pérdida grasa', 'ganancia masa', 'fuerza máxima', 'resistencia', 'potencia'],
};

const PREDEFINED_TAGS = Object.values(TAG_CATEGORIES).flat();

type TagTarget = {
  type: 'day' | 'session';
  dayKey: string;
  sessionId?: string;
};

type TagStats = {
  tag: string;
  count: number;
  days: number;
  sessions: number;
  category?: string;
};

export function TagManager({ open, onOpenChange, weeklyPlan, weekDays, onUpdatePlan }: TagManagerProps) {
  const [selectedTargets, setSelectedTargets] = useState<Set<string>>(new Set());
  const [newTag, setNewTag] = useState('');
  const [searchTag, setSearchTag] = useState('');
  const [filterByTag, setFilterByTag] = useState<string | null>(null);
  const [bulkTags, setBulkTags] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const [activeTab, setActiveTab] = useState<'targets' | 'tags' | 'bulk'>('targets');

  // Calcular estadísticas de tags
  const tagStats = useMemo((): TagStats[] => {
    const statsMap = new Map<string, TagStats>();

    weekDays.forEach((day) => {
      const dayPlan = weeklyPlan[day];
      if (!dayPlan) return;

      // Tags de día
      (dayPlan.tags || []).forEach((tag) => {
        if (!statsMap.has(tag)) {
          const category = Object.entries(TAG_CATEGORIES).find(([_, tags]) => tags.includes(tag))?.[0];
          statsMap.set(tag, {
            tag,
            count: 0,
            days: 0,
            sessions: 0,
            category,
          });
        }
        const stat = statsMap.get(tag)!;
        stat.count += 1;
        stat.days += 1;
      });

      // Tags de sesiones
      dayPlan.sessions.forEach((session) => {
        (session.tags || []).forEach((tag) => {
          if (!statsMap.has(tag)) {
            const category = Object.entries(TAG_CATEGORIES).find(([_, tags]) => tags.includes(tag))?.[0];
            statsMap.set(tag, {
              tag,
              count: 0,
              days: 0,
              sessions: 0,
              category,
            });
          }
          const stat = statsMap.get(tag)!;
          stat.count += 1;
          stat.sessions += 1;
        });
      });
    });

    return Array.from(statsMap.values()).sort((a, b) => b.count - a.count);
  }, [weeklyPlan, weekDays]);

  // Todos los tags únicos
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

  // Sugerencias inteligentes basadas en búsqueda
  const tagSuggestions = useMemo(() => {
    if (!newTag.trim()) return [];
    const query = newTag.toLowerCase();
    const suggestions: string[] = [];

    // Buscar en tags predefinidos
    PREDEFINED_TAGS.forEach((tag) => {
      if (tag.toLowerCase().includes(query) && !suggestions.includes(tag)) {
        suggestions.push(tag);
      }
    });

    // Buscar en tags existentes
    allTags.forEach((tag) => {
      if (tag.toLowerCase().includes(query) && !suggestions.includes(tag)) {
        suggestions.push(tag);
      }
    });

    return suggestions.slice(0, 8);
  }, [newTag, allTags]);

  // Filtrar tags por búsqueda
  const filteredTags = useMemo(() => {
    if (!searchTag) return tagStats;
    const query = searchTag.toLowerCase();
    return tagStats.filter((stat) => stat.tag.toLowerCase().includes(query));
  }, [tagStats, searchTag]);

  // Obtener targets filtrados por tag
  const filteredTargets = useMemo(() => {
    if (!filterByTag) return null;

    const targets: TagTarget[] = [];

    weekDays.forEach((day) => {
      const dayPlan = weeklyPlan[day];
      if (!dayPlan) return;

      // Verificar si el día tiene el tag
      if ((dayPlan.tags || []).includes(filterByTag)) {
        targets.push({ type: 'day', dayKey: day });
      }

      // Verificar sesiones
      dayPlan.sessions.forEach((session) => {
        if ((session.tags || []).includes(filterByTag)) {
          targets.push({ type: 'session', dayKey: day, sessionId: session.id });
        }
      });
    });

    return targets;
  }, [weeklyPlan, weekDays, filterByTag]);

  // Generar ID único para target
  const getTargetId = useCallback((target: TagTarget): string => {
    if (target.type === 'day') {
      return `day-${target.dayKey}`;
    }
    return `session-${target.dayKey}-${target.sessionId}`;
  }, []);

  // Parsear ID de target
  const parseTargetId = useCallback((id: string): TagTarget | null => {
    if (id.startsWith('day-')) {
      return { type: 'day', dayKey: id.replace('day-', '') };
    }
    if (id.startsWith('session-')) {
      const parts = id.replace('session-', '').split('-');
      const sessionId = parts.slice(1).join('-');
      return { type: 'session', dayKey: parts[0], sessionId };
    }
    return null;
  }, []);

  // Obtener tags de un target
  const getTargetTags = useCallback(
    (target: TagTarget): string[] => {
      if (target.type === 'day') {
        return weeklyPlan[target.dayKey]?.tags || [];
      }
      if (target.type === 'session' && target.sessionId) {
        const session = weeklyPlan[target.dayKey]?.sessions.find((s) => s.id === target.sessionId);
        return session?.tags || [];
      }
      return [];
    },
    [weeklyPlan],
  );

  // Añadir tag a targets seleccionados
  const addTagToTargets = useCallback(
    (tag: string, targets?: Set<string>) => {
      const targetsToUpdate = targets || selectedTargets;
      if (targetsToUpdate.size === 0 || !tag.trim()) return;

      const updatedPlan = { ...weeklyPlan };

      targetsToUpdate.forEach((targetId) => {
        const target = parseTargetId(targetId);
        if (!target) return;

        if (target.type === 'day') {
          const dayPlan = updatedPlan[target.dayKey];
          if (!dayPlan) return;
          const currentTags = dayPlan.tags || [];
          if (!currentTags.includes(tag)) {
            updatedPlan[target.dayKey] = {
              ...dayPlan,
              tags: [...currentTags, tag],
            };
          }
        } else if (target.type === 'session' && target.sessionId) {
          const dayPlan = updatedPlan[target.dayKey];
          if (!dayPlan) return;
          updatedPlan[target.dayKey] = {
            ...dayPlan,
            sessions: dayPlan.sessions.map((session) => {
              if (session.id === target.sessionId) {
                const currentTags = session.tags || [];
                if (!currentTags.includes(tag)) {
                  return { ...session, tags: [...currentTags, tag] };
                }
              }
              return session;
            }),
          };
        }
      });

      onUpdatePlan(updatedPlan);
      setNewTag('');
      setShowSuggestions(false);
    },
    [selectedTargets, weeklyPlan, onUpdatePlan, parseTargetId],
  );

  // Eliminar tag de targets seleccionados
  const removeTagFromTargets = useCallback(
    (tag: string, targets?: Set<string>) => {
      const targetsToUpdate = targets || selectedTargets;
      if (targetsToUpdate.size === 0) return;

      const updatedPlan = { ...weeklyPlan };

      targetsToUpdate.forEach((targetId) => {
        const target = parseTargetId(targetId);
        if (!target) return;

        if (target.type === 'day') {
          const dayPlan = updatedPlan[target.dayKey];
          if (!dayPlan) return;
          updatedPlan[target.dayKey] = {
            ...dayPlan,
            tags: (dayPlan.tags || []).filter((t) => t !== tag),
          };
        } else if (target.type === 'session' && target.sessionId) {
          const dayPlan = updatedPlan[target.dayKey];
          if (!dayPlan) return;
          updatedPlan[target.dayKey] = {
            ...dayPlan,
            sessions: dayPlan.sessions.map((session) => {
              if (session.id === target.sessionId) {
                return {
                  ...session,
                  tags: (session.tags || []).filter((t) => t !== tag),
                };
              }
              return session;
            }),
          };
        }
      });

      onUpdatePlan(updatedPlan);
    },
    [selectedTargets, weeklyPlan, onUpdatePlan, parseTargetId],
  );

  // Toggle selección de target
  const toggleTargetSelection = useCallback((target: TagTarget) => {
    const targetId = getTargetId(target);
    setSelectedTargets((prev) => {
      const next = new Set(prev);
      if (next.has(targetId)) {
        next.delete(targetId);
      } else {
        next.add(targetId);
      }
      return next;
    });
  }, [getTargetId]);

  // Seleccionar todos los targets de un tipo
  const selectAllTargets = useCallback((type: 'day' | 'session') => {
    const allTargetIds = new Set<string>();

    if (type === 'day') {
      weekDays.forEach((day) => {
        allTargetIds.add(getTargetId({ type: 'day', dayKey: day }));
      });
    } else {
      weekDays.forEach((day) => {
        const dayPlan = weeklyPlan[day];
        dayPlan?.sessions.forEach((session) => {
          allTargetIds.add(getTargetId({ type: 'session', dayKey: day, sessionId: session.id }));
        });
      });
    }

    setSelectedTargets((prev) => {
      const allSelected = allTargetIds.size > 0 && Array.from(allTargetIds).every((id) => prev.has(id));
      return allSelected ? new Set() : allTargetIds;
    });
  }, [weekDays, weeklyPlan, getTargetId]);

  // Aplicar tags en lote
  const applyBulkTags = useCallback(() => {
    if (bulkTags.length === 0 || selectedTargets.size === 0) return;

    const updatedPlan = { ...weeklyPlan };

    selectedTargets.forEach((targetId) => {
      const target = parseTargetId(targetId);
      if (!target) return;

      bulkTags.forEach((tag) => {
        if (target.type === 'day') {
          const dayPlan = updatedPlan[target.dayKey];
          if (!dayPlan) return;
          const currentTags = dayPlan.tags || [];
          if (!currentTags.includes(tag)) {
            updatedPlan[target.dayKey] = {
              ...dayPlan,
              tags: [...currentTags, tag],
            };
          }
        } else if (target.type === 'session' && target.sessionId) {
          const dayPlan = updatedPlan[target.dayKey];
          if (!dayPlan) return;
          updatedPlan[target.dayKey] = {
            ...dayPlan,
            sessions: dayPlan.sessions.map((session) => {
              if (session.id === target.sessionId) {
                const currentTags = session.tags || [];
                if (!currentTags.includes(tag)) {
                  return { ...session, tags: [...currentTags, tag] };
                }
              }
              return session;
            }),
          };
        }
      });
    });

    onUpdatePlan(updatedPlan);
    setBulkTags([]);
    setSelectedTargets(new Set());
    setActiveTab('targets');
  }, [bulkTags, selectedTargets, weeklyPlan, onUpdatePlan, parseTargetId]);

  // Tags comunes a todos los targets seleccionados
  const commonTags = useMemo(() => {
    if (selectedTargets.size === 0) return [];

    const tagSets = Array.from(selectedTargets).map((targetId) => {
      const target = parseTargetId(targetId);
      return target ? new Set(getTargetTags(target)) : new Set<string>();
    });

    if (tagSets.length === 0) return [];
    const firstSet = tagSets[0];
    return Array.from(firstSet).filter((tag) => tagSets.every((set) => set.has(tag)));
  }, [selectedTargets, parseTargetId, getTargetTags]);

  // Reset al cerrar
  useEffect(() => {
    if (!open) {
      setSelectedTargets(new Set());
      setNewTag('');
      setSearchTag('');
      setFilterByTag(null);
      setBulkTags([]);
      setActiveTab('targets');
      setShowSuggestions(false);
    }
  }, [open]);

  // Atajos de teclado
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'Escape') {
        setShowSuggestions(false);
        setFilterByTag(null);
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'a' && activeTab === 'targets') {
        e.preventDefault();
        selectAllTargets('day');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, activeTab, selectAllTargets]);

  const allTargets: TagTarget[] = useMemo(() => {
    const targets: TagTarget[] = [];
    weekDays.forEach((day) => {
      targets.push({ type: 'day', dayKey: day });
      const dayPlan = weeklyPlan[day];
      dayPlan?.sessions.forEach((session) => {
        targets.push({ type: 'session', dayKey: day, sessionId: session.id });
      });
    });
    return targets;
  }, [weekDays, weeklyPlan]);

  return (
    <Modal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Gestión de Tags"
      size="xl"
    >
      <div className="space-y-4">
        {/* Tabs principales */}
        <Tabs
          items={[
            { id: 'targets', label: 'Objetivos', icon: <Layers className="h-4 w-4" /> },
            { id: 'tags', label: 'Tags', icon: <Tag className="h-4 w-4" /> },
            { id: 'bulk', label: 'Operaciones en lote', icon: <Zap className="h-4 w-4" /> },
          ]}
          activeTab={activeTab}
          onTabChange={(tab) => setActiveTab(tab as typeof activeTab)}
          variant="pills"
          size="sm"
        />

        {/* Tab: Objetivos */}
        {activeTab === 'targets' && (
          <div className="space-y-4">
            {/* Búsqueda y filtros */}
            <div className="flex gap-2">
              <div className="flex-1">
                <Input
                  placeholder="Buscar días o sesiones..."
                  leftIcon={<Search className="h-4 w-4" />}
                  value={searchTag}
                  onChange={(e) => setSearchTag(e.target.value)}
                />
              </div>
              {filterByTag && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFilterByTag(null)}
                  leftIcon={<X className="h-4 w-4" />}
                >
                  Limpiar filtro
                </Button>
              )}
            </div>

            {filterByTag && (
              <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3 text-sm text-indigo-700">
                <span className="font-medium">Filtrando por tag:</span> <Badge variant="secondary">{filterByTag}</Badge>
                <span className="ml-2 text-slate-600">
                  ({filteredTargets?.length || 0} objetivo(s) encontrado(s))
                </span>
              </div>
            )}

            {/* Selección múltiple */}
            {selectedTargets.size > 0 && (
              <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-emerald-600" />
                    <span className="text-sm font-medium text-emerald-900">
                      {selectedTargets.size} objetivo(s) seleccionado(s)
                    </span>
                    {commonTags.length > 0 && (
                      <span className="text-xs text-emerald-700">
                        · {commonTags.length} tag(s) común(es)
                      </span>
                    )}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedTargets(new Set())}
                    className="text-xs"
                  >
                    Deseleccionar todos
                  </Button>
                </div>
                {commonTags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {commonTags.map((tag) => (
                      <Badge key={tag} variant="secondary" size="sm">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Lista de días */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700">Días</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => selectAllTargets('day')}
                  className="text-xs"
                >
                  {Array.from(selectedTargets).some((id) => id.startsWith('day-')) &&
                  weekDays.every((day) => selectedTargets.has(getTargetId({ type: 'day', dayKey: day })))
                    ? 'Deseleccionar todos'
                    : 'Seleccionar todos'}
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {(filteredTargets || weekDays.map((day) => ({ type: 'day' as const, dayKey: day }))).map((target) => {
                  if (target.type !== 'day') return null;
                  const targetId = getTargetId(target);
                  const isSelected = selectedTargets.has(targetId);
                  const tags = getTargetTags(target);
                  const dayPlan = weeklyPlan[target.dayKey];

                  return (
                    <button
                      key={targetId}
                      type="button"
                      onClick={() => toggleTargetSelection(target)}
                      className={`flex items-center gap-2 rounded-lg border px-3 py-2 text-sm transition ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      {isSelected ? (
                        <CheckSquare className="h-4 w-4 text-indigo-600" />
                      ) : (
                        <Square className="h-4 w-4 text-slate-400" />
                      )}
                      <Tag className="h-4 w-4" />
                      <span className="font-medium">{target.dayKey}</span>
                      {tags.length > 0 && (
                        <Badge size="sm" variant="secondary">
                          {tags.length}
                        </Badge>
                      )}
                      {dayPlan?.sessions.length && (
                        <span className="text-xs text-slate-500">
                          {dayPlan.sessions.length} sesión(es)
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Lista de sesiones */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <h3 className="text-sm font-semibold text-slate-700">Sesiones</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => selectAllTargets('session')}
                  className="text-xs"
                >
                  Seleccionar todas
                </Button>
              </div>
              <div className="max-h-64 space-y-2 overflow-y-auto">
                {(filteredTargets ||
                  allTargets.filter((t) => t.type === 'session')).map((target) => {
                  if (target.type !== 'session') return null;
                  const targetId = getTargetId(target);
                  const isSelected = selectedTargets.has(targetId);
                  const tags = getTargetTags(target);
                  const session = weeklyPlan[target.dayKey]?.sessions.find((s) => s.id === target.sessionId);

                  return (
                    <button
                      key={targetId}
                      type="button"
                      onClick={() => toggleTargetSelection(target)}
                      className={`flex w-full items-center justify-between rounded-lg border px-3 py-2 text-sm transition ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm'
                          : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        {isSelected ? (
                          <CheckSquare className="h-4 w-4 text-indigo-600" />
                        ) : (
                          <Square className="h-4 w-4 text-slate-400" />
                        )}
                        <Tag className="h-4 w-4" />
                        <span className="font-medium">{target.dayKey}</span>
                        <span className="text-slate-500">·</span>
                        <span className="truncate">{session?.block || 'Sesión'}</span>
                      </div>
                      {tags.length > 0 && (
                        <Badge size="sm" variant="secondary">{tags.length}</Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Gestión de tags para selección */}
            {selectedTargets.size > 0 && (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
                <h3 className="mb-3 text-sm font-semibold text-slate-700">
                  Gestionar tags ({selectedTargets.size} objetivo(s))
                </h3>

                {/* Tags comunes */}
                {commonTags.length > 0 && (
                  <div className="mb-3">
                    <p className="mb-2 text-xs font-medium text-slate-600">Tags comunes (en todos los seleccionados):</p>
                    <div className="flex flex-wrap gap-2">
                      {commonTags.map((tag) => (
                        <Badge
                          key={tag}
                          variant="secondary"
                          className="flex items-center gap-1 bg-indigo-100 text-indigo-700"
                        >
                          {tag}
                          <button
                            type="button"
                            onClick={() => removeTagFromTargets(tag)}
                            className="ml-1 rounded-full hover:bg-indigo-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Añadir tag */}
                <div className="relative">
                  <label className="mb-2 block text-xs font-medium text-slate-700">Añadir tag</label>
                  <div className="flex gap-2">
                    <div className="flex-1 relative">
                      <Input
                        ref={inputRef}
                        placeholder="Escribe o selecciona un tag..."
                        value={newTag}
                        onChange={(e) => {
                          setNewTag(e.target.value);
                          setShowSuggestions(true);
                        }}
                        onFocus={() => setShowSuggestions(true)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newTag.trim()) {
                            e.preventDefault();
                            addTagToTargets(newTag.trim());
                          }
                          if (e.key === 'Escape') {
                            setShowSuggestions(false);
                          }
                        }}
                      />
                      {showSuggestions && tagSuggestions.length > 0 && (
                        <div className="absolute z-20 mt-1 w-full rounded-lg border border-slate-200 bg-white shadow-lg">
                          {tagSuggestions.map((suggestion) => (
                            <button
                              key={suggestion}
                              type="button"
                              onClick={() => {
                                addTagToTargets(suggestion);
                                setShowSuggestions(false);
                              }}
                              className="w-full px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50 first:rounded-t-lg last:rounded-b-lg"
                            >
                              {suggestion}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                    <Button
                      variant="primary"
                      size="sm"
                      leftIcon={<Plus className="h-4 w-4" />}
                      onClick={() => {
                        if (newTag.trim()) {
                          addTagToTargets(newTag.trim());
                        }
                      }}
                    >
                      Añadir
                    </Button>
                  </div>
                </div>

                {/* Tags rápidos */}
                <div className="mt-3">
                  <p className="mb-2 text-xs font-medium text-slate-600">Tags rápidos:</p>
                  <div className="flex flex-wrap gap-2">
                    {PREDEFINED_TAGS.slice(0, 12).map((tag) => {
                      const hasTag = commonTags.includes(tag);
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => {
                            if (hasTag) {
                              removeTagFromTargets(tag);
                            } else {
                              addTagToTargets(tag);
                            }
                          }}
                          className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs transition ${
                            hasTag
                              ? 'border-indigo-500 bg-indigo-100 text-indigo-700'
                              : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                          }`}
                        >
                          {hasTag && <Check className="h-3 w-3" />}
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab: Tags */}
        {activeTab === 'tags' && (
          <div className="space-y-4">
            {/* Búsqueda */}
            <Input
              placeholder="Buscar tags..."
              leftIcon={<Search className="h-4 w-4" />}
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
            />

            {/* Estadísticas generales */}
            <div className="grid grid-cols-3 gap-3">
              <div className="rounded-lg border border-slate-200 bg-white p-3 text-center">
                <p className="text-2xl font-bold text-indigo-600">{tagStats.length}</p>
                <p className="text-xs text-slate-600">Tags únicos</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3 text-center">
                <p className="text-2xl font-bold text-emerald-600">
                  {tagStats.reduce((sum, stat) => sum + stat.count, 0)}
                </p>
                <p className="text-xs text-slate-600">Total usos</p>
              </div>
              <div className="rounded-lg border border-slate-200 bg-white p-3 text-center">
                <p className="text-2xl font-bold text-amber-600">
                  {weekDays.filter((day) => (weeklyPlan[day]?.tags || []).length > 0).length +
                    allTargets.filter((t) => t.type === 'session' && getTargetTags(t).length > 0).length}
                </p>
                <p className="text-xs text-slate-600">Objetivos etiquetados</p>
              </div>
            </div>

            {/* Lista de tags con estadísticas */}
            <div className="max-h-96 space-y-2 overflow-y-auto">
              {filteredTags.length === 0 ? (
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
                  <Tag className="mx-auto h-12 w-12 text-slate-400" />
                  <p className="mt-4 text-sm text-slate-600">No se encontraron tags</p>
                </div>
              ) : (
                filteredTags.map((stat) => (
                  <div
                    key={stat.tag}
                    className="flex items-center justify-between rounded-lg border border-slate-200 bg-white p-3 hover:border-slate-300"
                  >
                    <div className="flex items-center gap-3">
                      <Badge
                        variant="secondary"
                        className={`${
                          stat.category
                            ? 'bg-indigo-100 text-indigo-700'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {stat.tag}
                      </Badge>
                      <div className="flex items-center gap-4 text-xs text-slate-600">
                        <span className="flex items-center gap-1">
                          <BarChart3 className="h-3 w-3" />
                          {stat.count} uso(s)
                        </span>
                        <span>{stat.days} día(s)</span>
                        <span>{stat.sessions} sesión(es)</span>
                        {stat.category && (
                          <Badge size="sm" variant="outline" className="text-[10px]">
                            {stat.category}
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setFilterByTag(stat.tag);
                        setActiveTab('targets');
                      }}
                      leftIcon={<Filter className="h-4 w-4" />}
                    >
                      Filtrar
                    </Button>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* Tab: Operaciones en lote */}
        {activeTab === 'bulk' && (
          <div className="space-y-4">
            <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
              <div className="flex items-start gap-2">
                <Sparkles className="h-5 w-5 text-amber-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-amber-900">
                    Operaciones en lote
                  </p>
                  <p className="mt-1 text-xs text-amber-700">
                    Selecciona múltiples objetivos y aplica tags a todos a la vez. Primero selecciona los objetivos en la pestaña "Objetivos".
                  </p>
                </div>
              </div>
            </div>

            {selectedTargets.size === 0 ? (
              <div className="rounded-lg border border-slate-200 bg-slate-50 p-8 text-center">
                <Layers className="mx-auto h-12 w-12 text-slate-400" />
                <p className="mt-4 text-sm text-slate-600">
                  Ve a la pestaña "Objetivos" y selecciona los días o sesiones a los que quieres aplicar tags
                </p>
              </div>
            ) : (
              <>
                <div className="rounded-lg border border-indigo-200 bg-indigo-50 p-3">
                  <p className="text-sm font-medium text-indigo-900">
                    {selectedTargets.size} objetivo(s) seleccionado(s)
                  </p>
                </div>

                {/* Añadir múltiples tags */}
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Tags a aplicar (se añadirán a todos los seleccionados)
                  </label>
                  <div className="space-y-2">
                    {bulkTags.map((tag, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="secondary" className="flex-1 justify-between bg-indigo-100 text-indigo-700">
                          {tag}
                          <button
                            type="button"
                            onClick={() => setBulkTags((prev) => prev.filter((_, i) => i !== index))}
                            className="ml-2 rounded-full hover:bg-indigo-200"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </Badge>
                      </div>
                    ))}
                    <div className="flex gap-2">
                      <Input
                        placeholder="Añadir tag..."
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' && newTag.trim() && !bulkTags.includes(newTag.trim())) {
                            e.preventDefault();
                            setBulkTags((prev) => [...prev, newTag.trim()]);
                            setNewTag('');
                          }
                        }}
                      />
                      <Button
                        variant="secondary"
                        size="sm"
                        leftIcon={<Plus className="h-4 w-4" />}
                        onClick={() => {
                          if (newTag.trim() && !bulkTags.includes(newTag.trim())) {
                            setBulkTags((prev) => [...prev, newTag.trim()]);
                            setNewTag('');
                          }
                        }}
                      >
                        Añadir
                      </Button>
                    </div>
                  </div>

                  {/* Tags rápidos para lote */}
                  <div className="mt-3">
                    <p className="mb-2 text-xs font-medium text-slate-600">Tags rápidos:</p>
                    <div className="flex flex-wrap gap-2">
                      {PREDEFINED_TAGS.map((tag) => {
                        const isAdded = bulkTags.includes(tag);
                        return (
                          <button
                            key={tag}
                            type="button"
                            onClick={() => {
                              if (isAdded) {
                                setBulkTags((prev) => prev.filter((t) => t !== tag));
                              } else {
                                setBulkTags((prev) => [...prev, tag]);
                              }
                            }}
                            className={`flex items-center gap-1 rounded-lg border px-2.5 py-1 text-xs transition ${
                              isAdded
                                ? 'border-indigo-500 bg-indigo-100 text-indigo-700'
                                : 'border-slate-200 bg-white text-slate-600 hover:border-slate-300'
                            }`}
                          >
                            {isAdded && <Check className="h-3 w-3" />}
                            {tag}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Botón aplicar */}
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    onClick={() => {
                      setBulkTags([]);
                      setSelectedTargets(new Set());
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    variant="primary"
                    onClick={applyBulkTags}
                    disabled={bulkTags.length === 0}
                    leftIcon={<Zap className="h-4 w-4" />}
                  >
                    Aplicar {bulkTags.length} tag(s) a {selectedTargets.size} objetivo(s)
                  </Button>
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}
