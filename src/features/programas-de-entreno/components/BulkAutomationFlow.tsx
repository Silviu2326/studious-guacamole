import { useState, useMemo } from 'react';
import {
  Plus,
  Edit2,
  Move,
  Copy,
  Trash2,
  CheckSquare,
  Square,
  ArrowRight,
  X,
  Save,
  AlertCircle,
} from 'lucide-react';
import { Button, Modal, Input, Select, Badge, Card } from '../../../components/componentsreutilizables';
import type { DayPlan, DaySession } from '../types';
import { 
  crearLogBulkAutomation, 
  compararPlanes, 
  type CambioDetallado 
} from '../utils/automationLog';
import { useAuth } from '../../../context/AuthContext';

type BulkAutomationFlowProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weeklyPlan: Record<string, DayPlan>;
  weekDays: readonly string[];
  onUpdatePlan: (updatedPlan: Record<string, DayPlan>) => void;
  programaId?: string;
  clienteId?: string;
};

type OperationType = 'add' | 'edit' | 'move' | 'duplicate' | 'delete';

type BulkOperation = {
  id: string;
  type: OperationType;
  enabled: boolean;
  description: string;
  config: {
    // Para add
    targetDays?: string[];
    sessionTemplate?: Partial<DaySession>;
    position?: 'start' | 'end' | number;
    // Para edit
    filterDays?: string[];
    filterSessions?: {
      modality?: string;
      intensity?: string;
      tags?: string[];
    };
    modifications?: Partial<DaySession>;
    // Para move
    fromDay?: string;
    toDay?: string;
    sessionIds?: string[];
    // Para duplicate
    sourceDay?: string;
    targetDays?: string[];
    sessionIds?: string[];
    // Para delete
    filterDays?: string[];
    filterSessions?: {
      modality?: string;
      intensity?: string;
      tags?: string[];
    };
  };
};

const INITIAL_OPERATIONS: Omit<BulkOperation, 'id'>[] = [
  {
    type: 'add',
    enabled: false,
    description: 'Añadir sesión a días seleccionados',
    config: {
      targetDays: [],
      sessionTemplate: {
        time: '09:00',
        block: 'Nueva sesión',
        duration: '30 min',
        modality: 'Strength',
        intensity: 'RPE 7',
        notes: '',
      },
      position: 'end',
    },
  },
  {
    type: 'edit',
    enabled: false,
    description: 'Editar sesiones que cumplan condiciones',
    config: {
      filterDays: [],
      filterSessions: {},
      modifications: {},
    },
  },
  {
    type: 'move',
    enabled: false,
    description: 'Mover sesiones entre días',
    config: {
      fromDay: '',
      toDay: '',
      sessionIds: [],
    },
  },
  {
    type: 'duplicate',
    enabled: false,
    description: 'Duplicar sesiones a otros días',
    config: {
      sourceDay: '',
      targetDays: [],
      sessionIds: [],
    },
  },
  {
    type: 'delete',
    enabled: false,
    description: 'Eliminar sesiones que cumplan condiciones',
    config: {
      filterDays: [],
      filterSessions: {},
    },
  },
];

export function BulkAutomationFlow({
  open,
  onOpenChange,
  weeklyPlan,
  weekDays,
  onUpdatePlan,
  programaId,
  clienteId,
}: BulkAutomationFlowProps) {
  const { user } = useAuth();
  const [operations, setOperations] = useState<BulkOperation[]>(() =>
    INITIAL_OPERATIONS.map((op, idx) => ({ ...op, id: `op-${idx}` }))
  );

  const [previewMode, setPreviewMode] = useState(false);
  const [previewResult, setPreviewResult] = useState<Record<string, DayPlan> | null>(null);

  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    weekDays.forEach((day) => {
      const dayPlan = weeklyPlan[day];
      dayPlan?.sessions.forEach((session) => {
        if (session.tags) {
          session.tags.forEach((tag) => tagsSet.add(tag));
        }
      });
    });
    return Array.from(tagsSet).sort();
  }, [weeklyPlan, weekDays]);

  const updateOperation = (id: string, updates: Partial<BulkOperation>) => {
    setOperations((prev) =>
      prev.map((op) => (op.id === id ? { ...op, ...updates } : op))
    );
  };

  const toggleOperation = (id: string) => {
    setOperations((prev) =>
      prev.map((op) => (op.id === id ? { ...op, enabled: !op.enabled } : op))
    );
  };

  const generateSessionId = (day: string, index: number) => {
    const dayPrefix = day.substring(0, 3).toLowerCase();
    return `${dayPrefix}-${Date.now()}-${index}`;
  };

  const applyOperations = (): Record<string, DayPlan> => {
    let result = JSON.parse(JSON.stringify(weeklyPlan)) as Record<string, DayPlan>;
    const enabledOps = operations.filter((op) => op.enabled);

    enabledOps.forEach((operation) => {
      switch (operation.type) {
        case 'add': {
          const { targetDays = [], sessionTemplate, position = 'end' } = operation.config;
          targetDays.forEach((day) => {
            if (!result[day]) return;
            const newSession: DaySession = {
              id: generateSessionId(day, result[day].sessions.length),
              time: sessionTemplate?.time || '09:00',
              block: sessionTemplate?.block || 'Nueva sesión',
              duration: sessionTemplate?.duration || '30 min',
              modality: sessionTemplate?.modality || 'Strength',
              intensity: sessionTemplate?.intensity || 'RPE 7',
              notes: sessionTemplate?.notes || '',
              tags: sessionTemplate?.tags || [],
            };

            if (position === 'start') {
              result[day].sessions.unshift(newSession);
            } else if (position === 'end') {
              result[day].sessions.push(newSession);
            } else if (typeof position === 'number') {
              result[day].sessions.splice(position, 0, newSession);
            }
          });
          break;
        }

        case 'edit': {
          const { filterDays = [], filterSessions = {}, modifications = {} } = operation.config;
          const daysToEdit = filterDays.length > 0 ? filterDays : weekDays;

          daysToEdit.forEach((day) => {
            if (!result[day]) return;
            result[day].sessions = result[day].sessions.map((session) => {
              // Verificar filtros
              const matchesModality =
                !filterSessions.modality || session.modality === filterSessions.modality;
              const matchesIntensity =
                !filterSessions.intensity || session.intensity.includes(filterSessions.intensity);
              const matchesTags =
                !filterSessions.tags ||
                filterSessions.tags.length === 0 ||
                filterSessions.tags.some((tag) => session.tags?.includes(tag));

              if (matchesModality && matchesIntensity && matchesTags) {
                return { ...session, ...modifications };
              }
              return session;
            });
          });
          break;
        }

        case 'move': {
          const { fromDay, toDay, sessionIds = [] } = operation.config;
          if (!fromDay || !toDay || !result[fromDay] || !result[toDay]) break;

          const sessionsToMove = result[fromDay].sessions.filter((s) =>
            sessionIds.includes(s.id)
          );
          result[fromDay].sessions = result[fromDay].sessions.filter(
            (s) => !sessionIds.includes(s.id)
          );
          result[toDay].sessions.push(...sessionsToMove);
          break;
        }

        case 'duplicate': {
          const { sourceDay, targetDays = [], sessionIds = [] } = operation.config;
          if (!sourceDay || !result[sourceDay]) break;

          const sessionsToDuplicate = result[sourceDay].sessions.filter((s) =>
            sessionIds.includes(s.id)
          );

          targetDays.forEach((day) => {
            if (!result[day] || day === sourceDay) return;
            sessionsToDuplicate.forEach((session, idx) => {
              result[day].sessions.push({
                ...session,
                id: generateSessionId(day, result[day].sessions.length + idx),
              });
            });
          });
          break;
        }

        case 'delete': {
          const { filterDays = [], filterSessions = {} } = operation.config;
          const daysToEdit = filterDays.length > 0 ? filterDays : weekDays;

          daysToEdit.forEach((day) => {
            if (!result[day]) return;
            result[day].sessions = result[day].sessions.filter((session) => {
              const matchesModality =
                !filterSessions.modality || session.modality === filterSessions.modality;
              const matchesIntensity =
                !filterSessions.intensity || session.intensity.includes(filterSessions.intensity);
              const matchesTags =
                !filterSessions.tags ||
                filterSessions.tags.length === 0 ||
                filterSessions.tags.some((tag) => session.tags?.includes(tag));

              // Mantener si NO cumple todas las condiciones
              return !(matchesModality && matchesIntensity && matchesTags);
            });
          });
          break;
        }
      }
    });

    return result;
  };

  const handlePreview = () => {
    const preview = applyOperations();
    setPreviewResult(preview);
    setPreviewMode(true);
  };

  const handleApply = () => {
    const planAnterior = weeklyPlan;
    const result = applyOperations();
    
    // Generar log de automatización
    const cambios = compararPlanes(planAnterior, result, weekDays);
    const enabledOps = operations.filter((op) => op.enabled);
    
    if (cambios.length > 0 && enabledOps.length > 0) {
      crearLogBulkAutomation(
        enabledOps.map(op => ({
          tipo: op.type,
          descripcion: op.description,
          config: op.config,
        })),
        cambios,
        programaId,
        clienteId,
        user?.id || 'usuario-actual'
      );
    }
    
    onUpdatePlan(result);
    onOpenChange(false);
    setPreviewMode(false);
    setPreviewResult(null);
  };

  const getOperationIcon = (type: OperationType) => {
    switch (type) {
      case 'add':
        return <Plus className="h-4 w-4" />;
      case 'edit':
        return <Edit2 className="h-4 w-4" />;
      case 'move':
        return <Move className="h-4 w-4" />;
      case 'duplicate':
        return <Copy className="h-4 w-4" />;
      case 'delete':
        return <Trash2 className="h-4 w-4" />;
    }
  };

  const renderOperationConfig = (operation: BulkOperation) => {
    switch (operation.type) {
      case 'add':
        return (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Días objetivo</label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => {
                  const isSelected = operation.config.targetDays?.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const current = operation.config.targetDays || [];
                        const updated = isSelected
                          ? current.filter((d) => d !== day)
                          : [...current, day];
                        updateOperation(operation.id, {
                          config: { ...operation.config, targetDays: updated },
                        });
                      }}
                      className={`rounded-lg border px-3 py-1 text-xs ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Hora</label>
                <Input
                  value={operation.config.sessionTemplate?.time || ''}
                  onChange={(e) =>
                    updateOperation(operation.id, {
                      config: {
                        ...operation.config,
                        sessionTemplate: {
                          ...operation.config.sessionTemplate,
                          time: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="09:00"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Duración</label>
                <Input
                  value={operation.config.sessionTemplate?.duration || ''}
                  onChange={(e) =>
                    updateOperation(operation.id, {
                      config: {
                        ...operation.config,
                        sessionTemplate: {
                          ...operation.config.sessionTemplate,
                          duration: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="30 min"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Nombre del bloque</label>
              <Input
                value={operation.config.sessionTemplate?.block || ''}
                onChange={(e) =>
                  updateOperation(operation.id, {
                    config: {
                      ...operation.config,
                      sessionTemplate: {
                        ...operation.config.sessionTemplate,
                        block: e.target.value,
                      },
                    },
                  })
                }
                placeholder="Nueva sesión"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Modalidad</label>
                <Input
                  value={operation.config.sessionTemplate?.modality || ''}
                  onChange={(e) =>
                    updateOperation(operation.id, {
                      config: {
                        ...operation.config,
                        sessionTemplate: {
                          ...operation.config.sessionTemplate,
                          modality: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="Strength"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Intensidad</label>
                <Input
                  value={operation.config.sessionTemplate?.intensity || ''}
                  onChange={(e) =>
                    updateOperation(operation.id, {
                      config: {
                        ...operation.config,
                        sessionTemplate: {
                          ...operation.config.sessionTemplate,
                          intensity: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="RPE 7"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Posición</label>
              <Select
                options={[
                  { label: 'Al inicio', value: 'start' },
                  { label: 'Al final', value: 'end' },
                ]}
                value={operation.config.position || 'end'}
                onChange={(e) =>
                  updateOperation(operation.id, {
                    config: { ...operation.config, position: e.target.value },
                  })
                }
              />
            </div>
          </div>
        );

      case 'edit':
        return (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Filtrar por días</label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => {
                  const isSelected = operation.config.filterDays?.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const current = operation.config.filterDays || [];
                        const updated = isSelected
                          ? current.filter((d) => d !== day)
                          : [...current, day];
                        updateOperation(operation.id, {
                          config: { ...operation.config, filterDays: updated },
                        });
                      }}
                      className={`rounded-lg border px-3 py-1 text-xs ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1 text-xs text-slate-500">Dejar vacío para aplicar a todos los días</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Filtrar por modalidad</label>
                <Input
                  value={operation.config.filterSessions?.modality || ''}
                  onChange={(e) =>
                    updateOperation(operation.id, {
                      config: {
                        ...operation.config,
                        filterSessions: {
                          ...operation.config.filterSessions,
                          modality: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="Strength (opcional)"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Filtrar por intensidad</label>
                <Input
                  value={operation.config.filterSessions?.intensity || ''}
                  onChange={(e) =>
                    updateOperation(operation.id, {
                      config: {
                        ...operation.config,
                        filterSessions: {
                          ...operation.config.filterSessions,
                          intensity: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="RPE 8 (opcional)"
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Modificaciones</label>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  placeholder="Nueva modalidad (opcional)"
                  value={operation.config.modifications?.modality || ''}
                  onChange={(e) =>
                    updateOperation(operation.id, {
                      config: {
                        ...operation.config,
                        modifications: {
                          ...operation.config.modifications,
                          modality: e.target.value,
                        },
                      },
                    })
                  }
                />
                <Input
                  placeholder="Nueva intensidad (opcional)"
                  value={operation.config.modifications?.intensity || ''}
                  onChange={(e) =>
                    updateOperation(operation.id, {
                      config: {
                        ...operation.config,
                        modifications: {
                          ...operation.config.modifications,
                          intensity: e.target.value,
                        },
                      },
                    })
                  }
                />
              </div>
            </div>
          </div>
        );

      case 'move':
        return (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Desde día</label>
              <Select
                options={weekDays.map((day) => ({ label: day, value: day }))}
                value={operation.config.fromDay || ''}
                onChange={(e) =>
                  updateOperation(operation.id, {
                    config: { ...operation.config, fromDay: e.target.value },
                  })
                }
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Hacia día</label>
              <Select
                options={weekDays.map((day) => ({ label: day, value: day }))}
                value={operation.config.toDay || ''}
                onChange={(e) =>
                  updateOperation(operation.id, {
                    config: { ...operation.config, toDay: e.target.value },
                  })
                }
              />
            </div>
            {operation.config.fromDay && (
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Sesiones a mover</label>
                <div className="max-h-32 space-y-1 overflow-y-auto">
                  {weeklyPlan[operation.config.fromDay]?.sessions.map((session) => {
                    const isSelected = operation.config.sessionIds?.includes(session.id);
                    return (
                      <button
                        key={session.id}
                        type="button"
                        onClick={() => {
                          const current = operation.config.sessionIds || [];
                          const updated = isSelected
                            ? current.filter((id) => id !== session.id)
                            : [...current, session.id];
                          updateOperation(operation.id, {
                            config: { ...operation.config, sessionIds: updated },
                          });
                        }}
                        className={`w-full rounded-lg border px-3 py-2 text-left text-xs ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                            : 'border-slate-200 bg-white text-slate-600'
                        }`}
                      >
                        {session.block}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        );

      case 'duplicate':
        return (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Día origen</label>
              <Select
                options={weekDays.map((day) => ({ label: day, value: day }))}
                value={operation.config.sourceDay || ''}
                onChange={(e) =>
                  updateOperation(operation.id, {
                    config: { ...operation.config, sourceDay: e.target.value },
                  })
                }
              />
            </div>
            {operation.config.sourceDay && (
              <>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Sesiones a duplicar</label>
                  <div className="max-h-32 space-y-1 overflow-y-auto">
                    {weeklyPlan[operation.config.sourceDay]?.sessions.map((session) => {
                      const isSelected = operation.config.sessionIds?.includes(session.id);
                      return (
                        <button
                          key={session.id}
                          type="button"
                          onClick={() => {
                            const current = operation.config.sessionIds || [];
                            const updated = isSelected
                              ? current.filter((id) => id !== session.id)
                              : [...current, session.id];
                            updateOperation(operation.id, {
                              config: { ...operation.config, sessionIds: updated },
                            });
                          }}
                          className={`w-full rounded-lg border px-3 py-2 text-left text-xs ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                              : 'border-slate-200 bg-white text-slate-600'
                          }`}
                        >
                          {session.block}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-700">Días destino</label>
                  <div className="flex flex-wrap gap-2">
                    {weekDays
                      .filter((day) => day !== operation.config.sourceDay)
                      .map((day) => {
                        const isSelected = operation.config.targetDays?.includes(day);
                        return (
                          <button
                            key={day}
                            type="button"
                            onClick={() => {
                              const current = operation.config.targetDays || [];
                              const updated = isSelected
                                ? current.filter((d) => d !== day)
                                : [...current, day];
                              updateOperation(operation.id, {
                                config: { ...operation.config, targetDays: updated },
                              });
                            }}
                            className={`rounded-lg border px-3 py-1 text-xs ${
                              isSelected
                                ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                                : 'border-slate-200 bg-white text-slate-600'
                            }`}
                          >
                            {day}
                          </button>
                        );
                      })}
                  </div>
                </div>
              </>
            )}
          </div>
        );

      case 'delete':
        return (
          <div className="space-y-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-slate-700">Filtrar por días</label>
              <div className="flex flex-wrap gap-2">
                {weekDays.map((day) => {
                  const isSelected = operation.config.filterDays?.includes(day);
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => {
                        const current = operation.config.filterDays || [];
                        const updated = isSelected
                          ? current.filter((d) => d !== day)
                          : [...current, day];
                        updateOperation(operation.id, {
                          config: { ...operation.config, filterDays: updated },
                        });
                      }}
                      className={`rounded-lg border px-3 py-1 text-xs ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50 text-indigo-700'
                          : 'border-slate-200 bg-white text-slate-600'
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
              <p className="mt-1 text-xs text-slate-500">Dejar vacío para aplicar a todos los días</p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Filtrar por modalidad</label>
                <Input
                  value={operation.config.filterSessions?.modality || ''}
                  onChange={(e) =>
                    updateOperation(operation.id, {
                      config: {
                        ...operation.config,
                        filterSessions: {
                          ...operation.config.filterSessions,
                          modality: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="Strength (opcional)"
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-700">Filtrar por intensidad</label>
                <Input
                  value={operation.config.filterSessions?.intensity || ''}
                  onChange={(e) =>
                    updateOperation(operation.id, {
                      config: {
                        ...operation.config,
                        filterSessions: {
                          ...operation.config.filterSessions,
                          intensity: e.target.value,
                        },
                      },
                    })
                  }
                  placeholder="RPE 8 (opcional)"
                />
              </div>
            </div>
            <div className="rounded-lg border border-red-200 bg-red-50 p-3">
              <div className="flex items-center gap-2 text-sm text-red-700">
                <AlertCircle className="h-4 w-4" />
                <span className="font-medium">Advertencia: Esta operación eliminará sesiones permanentemente</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (previewMode && previewResult) {
    return (
      <Modal
        isOpen={open}
        onClose={() => {
          setPreviewMode(false);
          setPreviewResult(null);
          onOpenChange(false);
        }}
        title="Vista previa de cambios"
        size="xl"
      >
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border border-amber-200 bg-amber-50 p-3">
            <div className="flex items-center gap-2 text-sm text-amber-700">
              <AlertCircle className="h-4 w-4" />
              <span>Esta es una vista previa. Los cambios no se aplicarán hasta que confirmes.</span>
            </div>
            <Button variant="ghost" size="sm" onClick={() => setPreviewMode(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="max-h-96 space-y-3 overflow-y-auto">
            {weekDays.map((day) => {
              const original = weeklyPlan[day];
              const preview = previewResult[day];
              const originalCount = original.sessions.length;
              const previewCount = preview.sessions.length;
              const hasChanges = originalCount !== previewCount;

              return (
                <Card key={day} className="p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-900">{day}</h3>
                    {hasChanges && (
                      <Badge variant={previewCount > originalCount ? 'green' : 'red'}>
                        {previewCount > originalCount ? '+' : ''}
                        {previewCount - originalCount} sesiones
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-2">
                    {preview.sessions.map((session, idx) => (
                      <div
                        key={session.id}
                        className="rounded-lg border border-slate-200 bg-white p-2 text-sm"
                      >
                        <div className="font-medium text-slate-900">{session.block}</div>
                        <div className="text-xs text-slate-500">
                          {session.time} · {session.duration} · {session.modality}
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="ghost" onClick={() => setPreviewMode(false)}>
              Cancelar
            </Button>
            <Button variant="primary" leftIcon={<Save className="h-4 w-4" />} onClick={handleApply}>
              Aplicar cambios
            </Button>
          </div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Flujos de Automatización Masiva"
      size="xl"
    >
      <div className="space-y-4">
        <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
          <p className="text-sm text-slate-600">
            Configura múltiples operaciones y aplícalas todas a la vez. Puedes añadir, editar, mover, duplicar o
            eliminar sesiones en masa.
          </p>
        </div>

        <div className="space-y-3">
          {operations.map((operation) => (
            <Card key={operation.id} className="p-4">
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => toggleOperation(operation.id)}
                    className="text-slate-600 hover:text-indigo-600"
                  >
                    {operation.enabled ? (
                      <CheckSquare className="h-5 w-5 text-indigo-600" />
                    ) : (
                      <Square className="h-5 w-5" />
                    )}
                  </button>
                  <div className="flex items-center gap-2">
                    {getOperationIcon(operation.type)}
                    <div>
                      <div className="font-semibold text-slate-900">{operation.description}</div>
                      <div className="text-xs text-slate-500">
                        {operation.type === 'add' && 'Añadir sesiones'}
                        {operation.type === 'edit' && 'Modificar sesiones existentes'}
                        {operation.type === 'move' && 'Mover sesiones entre días'}
                        {operation.type === 'duplicate' && 'Duplicar sesiones a otros días'}
                        {operation.type === 'delete' && 'Eliminar sesiones'}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {operation.enabled && (
                <div className="mt-4 rounded-lg border border-slate-200 bg-white p-4">
                  {renderOperationConfig(operation)}
                </div>
              )}
            </Card>
          ))}
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="secondary" onClick={handlePreview}>
            Vista previa
          </Button>
          <Button
            variant="primary"
            leftIcon={<Save className="h-4 w-4" />}
            onClick={handleApply}
            disabled={operations.filter((op) => op.enabled).length === 0}
          >
            Aplicar operaciones
          </Button>
        </div>
      </div>
    </Modal>
  );
}

