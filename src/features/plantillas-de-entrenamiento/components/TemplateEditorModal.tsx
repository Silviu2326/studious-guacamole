import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/componentsreutilizables/Modal';
import { Button } from '../../../components/componentsreutilizables/Button';
import { Input } from '../../../components/componentsreutilizables/Input';
import { Textarea } from '../../../components/componentsreutilizables/Textarea';
import { Template, Phase, Week, Day, Exercise } from '../types';
import { Plus, Trash2, ChevronDown, ChevronUp, X } from 'lucide-react';

interface TemplateEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: Template | null;
  onSave: (template: Omit<Template, 'id' | 'assignmentCount' | 'createdAt' | 'updatedAt'>) => void;
}

export const TemplateEditorModal: React.FC<TemplateEditorModalProps> = ({
  isOpen,
  onClose,
  initialData,
  onSave,
}) => {
  const [formData, setFormData] = useState<Omit<Template, 'id' | 'assignmentCount' | 'createdAt' | 'updatedAt'>>({
    name: '',
    description: '',
    durationWeeks: 4,
    tags: [],
    structure: {
      phases: [],
    },
  });

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const availableTags = ['hipertrofia', 'fuerza', 'resistencia', 'principiante', 'avanzado', 'pérdida de peso', 'full-body'];

  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name,
        description: initialData.description || '',
        durationWeeks: initialData.durationWeeks,
        tags: initialData.tags || [],
        structure: initialData.structure || { phases: [] },
      });
      setSelectedTags(initialData.tags || []);
    } else {
      setFormData({
        name: '',
        description: '',
        durationWeeks: 4,
        tags: [],
        structure: {
          phases: [],
        },
      });
      setSelectedTags([]);
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...formData,
      tags: selectedTags,
    });
  };

  const handleAddPhase = () => {
    const newPhase: Phase = {
      name: `Fase ${formData.structure!.phases.length + 1}`,
      weeks: [],
    };
    setFormData({
      ...formData,
      structure: {
        phases: [...formData.structure!.phases, newPhase],
      },
    });
  };

  const handleRemovePhase = (phaseIndex: number) => {
    setFormData({
      ...formData,
      structure: {
        phases: formData.structure!.phases.filter((_, i) => i !== phaseIndex),
      },
    });
  };

  const handleAddWeek = (phaseIndex: number) => {
    const phase = formData.structure!.phases[phaseIndex];
    const newWeek: Week = {
      weekNumber: phase.weeks.length + 1,
      days: [],
    };
    const updatedPhases = [...formData.structure!.phases];
    updatedPhases[phaseIndex] = {
      ...phase,
      weeks: [...phase.weeks, newWeek],
    };
    setFormData({
      ...formData,
      structure: { phases: updatedPhases },
    });
  };

  const handleAddDay = (phaseIndex: number, weekIndex: number) => {
    const phase = formData.structure!.phases[phaseIndex];
    const week = phase.weeks[weekIndex];
    const newDay: Day = {
      dayNumber: week.days.length + 1,
      name: `Día ${week.days.length + 1}`,
      exercises: [],
    };
    const updatedPhases = [...formData.structure!.phases];
    const updatedWeeks = [...phase.weeks];
    updatedWeeks[weekIndex] = {
      ...week,
      days: [...week.days, newDay],
    };
    updatedPhases[phaseIndex] = {
      ...phase,
      weeks: updatedWeeks,
    };
    setFormData({
      ...formData,
      structure: { phases: updatedPhases },
    });
  };

  const handleRemoveDay = (phaseIndex: number, weekIndex: number, dayIndex: number) => {
    const phase = formData.structure!.phases[phaseIndex];
    const week = phase.weeks[weekIndex];
    const updatedDays = week.days.filter((_, i) => i !== dayIndex);
    const updatedPhases = [...formData.structure!.phases];
    const updatedWeeks = [...phase.weeks];
    updatedWeeks[weekIndex] = {
      ...week,
      days: updatedDays.map((d, i) => ({ ...d, dayNumber: i + 1 })),
    };
    updatedPhases[phaseIndex] = {
      ...phase,
      weeks: updatedWeeks,
    };
    setFormData({
      ...formData,
      structure: { phases: updatedPhases },
    });
  };

  const handleAddExercise = (phaseIndex: number, weekIndex: number, dayIndex: number) => {
    const phase = formData.structure!.phases[phaseIndex];
    const week = phase.weeks[weekIndex];
    const day = week.days[dayIndex];
    const newExercise: Exercise = {
      id: `ex-${Date.now()}`,
      name: 'Nuevo Ejercicio',
      sets: 3,
      reps: '10-12',
      restSeconds: 60,
      order: day.exercises.length + 1,
    };
    const updatedPhases = [...formData.structure!.phases];
    const updatedWeeks = [...phase.weeks];
    const updatedDays = [...week.days];
    updatedDays[dayIndex] = {
      ...day,
      exercises: [...day.exercises, newExercise],
    };
    updatedWeeks[weekIndex] = {
      ...week,
      days: updatedDays,
    };
    updatedPhases[phaseIndex] = {
      ...phase,
      weeks: updatedWeeks,
    };
    setFormData({
      ...formData,
      structure: { phases: updatedPhases },
    });
  };

  const handleRemoveExercise = (phaseIndex: number, weekIndex: number, dayIndex: number, exerciseIndex: number) => {
    const phase = formData.structure!.phases[phaseIndex];
    const week = phase.weeks[weekIndex];
    const day = week.days[dayIndex];
    const updatedExercises = day.exercises.filter((_, i) => i !== exerciseIndex);
    const updatedPhases = [...formData.structure!.phases];
    const updatedWeeks = [...phase.weeks];
    const updatedDays = [...week.days];
    updatedDays[dayIndex] = {
      ...day,
      exercises: updatedExercises.map((e, i) => ({ ...e, order: i + 1 })),
    };
    updatedWeeks[weekIndex] = {
      ...week,
      days: updatedDays,
    };
    updatedPhases[phaseIndex] = {
      ...phase,
      weeks: updatedWeeks,
    };
    setFormData({
      ...formData,
      structure: { phases: updatedPhases },
    });
  };

  const handleUpdateExercise = (
    phaseIndex: number,
    weekIndex: number,
    dayIndex: number,
    exerciseIndex: number,
    field: keyof Exercise,
    value: any
  ) => {
    const phase = formData.structure!.phases[phaseIndex];
    const week = phase.weeks[weekIndex];
    const day = week.days[dayIndex];
    const updatedExercises = [...day.exercises];
    updatedExercises[exerciseIndex] = {
      ...updatedExercises[exerciseIndex],
      [field]: value,
    };
    const updatedPhases = [...formData.structure!.phases];
    const updatedWeeks = [...phase.weeks];
    const updatedDays = [...week.days];
    updatedDays[dayIndex] = {
      ...day,
      exercises: updatedExercises,
    };
    updatedWeeks[weekIndex] = {
      ...week,
      days: updatedDays,
    };
    updatedPhases[phaseIndex] = {
      ...phase,
      weeks: updatedWeeks,
    };
    setFormData({
      ...formData,
      structure: { phases: updatedPhases },
    });
  };

  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});

  const toggleDayExpansion = (dayKey: string) => {
    setExpandedDays(prev => ({
      ...prev,
      [dayKey]: !prev[dayKey],
    }));
  };

  const handleTagToggle = (tag: string) => {
    const newTags = selectedTags.includes(tag)
      ? selectedTags.filter(t => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(newTags);
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Plantilla' : 'Nueva Plantilla'}
      size="xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información Básica */}
        <div className="space-y-4">
          <Input
            label="Nombre de la Plantilla"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Textarea
            label="Descripción"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            rows={3}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Duración (semanas)"
              type="number"
              min="1"
              value={formData.durationWeeks}
              onChange={(e) => setFormData({ ...formData, durationWeeks: parseInt(e.target.value) || 4 })}
              required
            />
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Etiquetas
            </label>
            <div className="flex flex-wrap gap-2">
              {availableTags.map(tag => (
                <button
                  key={tag}
                  type="button"
                  onClick={() => handleTagToggle(tag)}
                  className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                    selectedTags.includes(tag)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Estructura del Programa */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Estructura del Programa
            </h3>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleAddPhase}
            >
              <Plus className="w-4 h-4 mr-2" />
              Añadir Fase
            </Button>
          </div>

          {formData.structure!.phases.length === 0 && (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <p className="text-gray-600">
                No hay fases definidas. Añade una fase para comenzar.
              </p>
            </div>
          )}

          {formData.structure!.phases.map((phase, phaseIndex) => (
            <div key={phaseIndex} className="border border-gray-200 rounded-lg p-4 space-y-4">
              <div className="flex items-center justify-between">
                <Input
                  value={phase.name}
                  onChange={(e) => {
                    const updatedPhases = [...formData.structure!.phases];
                    updatedPhases[phaseIndex] = { ...phase, name: e.target.value };
                    setFormData({ ...formData, structure: { phases: updatedPhases } });
                  }}
                  className="flex-1"
                  placeholder="Nombre de la fase"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => handleRemovePhase(phaseIndex)}
                  className="text-red-600 hover:text-red-700 ml-2"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Semanas</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddWeek(phaseIndex)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Añadir Semana
                  </Button>
                </div>

                {phase.weeks.map((week, weekIndex) => (
                  <div key={weekIndex} className="ml-4 border-l-2 border-gray-300 pl-4 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-900">
                        Semana {week.weekNumber}
                      </span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleAddDay(phaseIndex, weekIndex)}
                      >
                        <Plus className="w-3 h-3 mr-1" />
                        Añadir Día
                      </Button>
                    </div>

                    {week.days.map((day, dayIndex) => {
                      const dayKey = `${phaseIndex}-${weekIndex}-${dayIndex}`;
                      const isExpanded = expandedDays[dayKey];
                      
                      return (
                        <div key={dayIndex} className="ml-4 border border-gray-200 rounded-lg p-3 mb-2 bg-white">
                          <div className="flex items-center justify-between mb-2">
                            <Input
                              value={day.name || `Día ${day.dayNumber}`}
                              onChange={(e) => {
                                const updatedPhases = [...formData.structure!.phases];
                                const updatedWeeks = [...phase.weeks];
                                const updatedDays = [...week.days];
                                updatedDays[dayIndex] = { ...day, name: e.target.value };
                                updatedWeeks[weekIndex] = { ...week, days: updatedDays };
                                updatedPhases[phaseIndex] = { ...phase, weeks: updatedWeeks };
                                setFormData({ ...formData, structure: { phases: updatedPhases } });
                              }}
                              placeholder="Nombre del día"
                              className="flex-1 mr-2 text-sm"
                            />
                            <div className="flex items-center gap-1">
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleDayExpansion(dayKey)}
                              >
                                {isExpanded ? (
                                  <ChevronUp className="w-4 h-4" />
                                ) : (
                                  <ChevronDown className="w-4 h-4" />
                                )}
                              </Button>
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => handleRemoveDay(phaseIndex, weekIndex, dayIndex)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                          
                          {isExpanded && (
                            <div className="mt-3 space-y-3">
                              <div className="flex items-center justify-between">
                                <span className="text-xs font-medium text-gray-700">
                                  Ejercicios ({day.exercises.length})
                                </span>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleAddExercise(phaseIndex, weekIndex, dayIndex)}
                                >
                                  <Plus className="w-3 h-3 mr-1" />
                                  Añadir Ejercicio
                                </Button>
                              </div>
                              
                              {day.exercises.length === 0 ? (
                                <p className="text-xs text-gray-500 text-center py-4">
                                  No hay ejercicios. Añade uno para comenzar.
                                </p>
                              ) : (
                                <div className="space-y-2">
                                  {day.exercises.map((exercise, exerciseIndex) => (
                                    <div
                                      key={exercise.id || exerciseIndex}
                                      className="p-3 bg-gray-50 rounded-lg border border-gray-200"
                                    >
                                      <div className="flex items-center justify-between mb-2">
                                        <Input
                                          value={exercise.name}
                                          onChange={(e) => handleUpdateExercise(
                                            phaseIndex,
                                            weekIndex,
                                            dayIndex,
                                            exerciseIndex,
                                            'name',
                                            e.target.value
                                          )}
                                          placeholder="Nombre del ejercicio"
                                          className="flex-1 mr-2 text-sm font-medium"
                                        />
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => handleRemoveExercise(phaseIndex, weekIndex, dayIndex, exerciseIndex)}
                                          className="text-red-600 hover:text-red-700"
                                        >
                                          <X className="w-4 h-4" />
                                        </Button>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                                        <div>
                                          <label className="text-xs text-gray-600 mb-1 block">Series</label>
                                          <Input
                                            type="number"
                                            min="1"
                                            value={exercise.sets}
                                            onChange={(e) => handleUpdateExercise(
                                              phaseIndex,
                                              weekIndex,
                                              dayIndex,
                                              exerciseIndex,
                                              'sets',
                                              parseInt(e.target.value) || 1
                                            )}
                                            className="text-sm"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-gray-600 mb-1 block">Reps</label>
                                          <Input
                                            value={exercise.reps}
                                            onChange={(e) => handleUpdateExercise(
                                              phaseIndex,
                                              weekIndex,
                                              dayIndex,
                                              exerciseIndex,
                                              'reps',
                                              e.target.value
                                            )}
                                            placeholder="10-12"
                                            className="text-sm"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-gray-600 mb-1 block">Descanso (s)</label>
                                          <Input
                                            type="number"
                                            min="0"
                                            value={exercise.restSeconds || ''}
                                            onChange={(e) => handleUpdateExercise(
                                              phaseIndex,
                                              weekIndex,
                                              dayIndex,
                                              exerciseIndex,
                                              'restSeconds',
                                              parseInt(e.target.value) || 0
                                            )}
                                            className="text-sm"
                                          />
                                        </div>
                                        <div>
                                          <label className="text-xs text-gray-600 mb-1 block">Peso</label>
                                          <Input
                                            value={exercise.weight || ''}
                                            onChange={(e) => handleUpdateExercise(
                                              phaseIndex,
                                              weekIndex,
                                              dayIndex,
                                              exerciseIndex,
                                              'weight',
                                              e.target.value
                                            )}
                                            placeholder="60-70%"
                                            className="text-sm"
                                          />
                                        </div>
                                      </div>
                                      
                                      <div className="grid grid-cols-2 gap-2 mt-2">
                                        <div>
                                          <label className="text-xs text-gray-600 mb-1 block">Tempo</label>
                                          <Input
                                            value={exercise.tempo || ''}
                                            onChange={(e) => handleUpdateExercise(
                                              phaseIndex,
                                              weekIndex,
                                              dayIndex,
                                              exerciseIndex,
                                              'tempo',
                                              e.target.value
                                            )}
                                            placeholder="2-1-2"
                                            className="text-sm"
                                          />
                                        </div>
                                        <div className="col-span-2">
                                          <label className="text-xs text-gray-600 mb-1 block">Notas</label>
                                          <Textarea
                                            value={exercise.notes || ''}
                                            onChange={(e) => handleUpdateExercise(
                                              phaseIndex,
                                              weekIndex,
                                              dayIndex,
                                              exerciseIndex,
                                              'notes',
                                              e.target.value
                                            )}
                                            placeholder="Notas adicionales..."
                                            rows={2}
                                            className="text-sm"
                                          />
                                        </div>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? 'Guardar Cambios' : 'Crear Plantilla'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

