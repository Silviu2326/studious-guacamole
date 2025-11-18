import { useState, useEffect, useMemo } from 'react';
import { Card } from '../../../components/componentsreutilizables/Card';
import { Button } from '../../../components/componentsreutilizables/Button';
import { Input } from '../../../components/componentsreutilizables/Input';
import { Textarea } from '../../../components/componentsreutilizables/Textarea';
import { Select } from '../../../components/componentsreutilizables/Select';
import { Badge, Modal } from '../../../components/componentsreutilizables';
import {
  Plus,
  Save,
  User,
  Calendar,
  Tag as TagIcon,
  X,
  Check,
  Search,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import * as programasApi from '../api/programas';
import * as categoriasApi from '../api/categorias';
import { useAuth } from '../../../context/AuthContext';
import { ClientFileModal } from './ClientFileModal';

type MonthPlan = {
  month: number; // 1-12
  year: number;
  tags?: string[]; // Tags para todo el mes
  weeks: WeekPlan[];
};

type WeekPlan = {
  weekNumber: number; // 1-4 o 5
  startDate: string; // Fecha de inicio de la semana
  endDate: string; // Fecha de fin de la semana
  tags?: string[]; // Tags para esta semana específica
};

const PREDEFINED_TAGS = [
  'fuerza',
  'cardio',
  'hipertrofia',
  'metcon',
  'movilidad',
  'recuperación',
  'full body',
  'upper body',
  'lower body',
  'push',
  'pull',
  'legs',
  'core',
  'heavy',
  'ligero',
  'intenso',
];

export function EditorPrograma() {
  const { user } = useAuth();
  const isEntrenador = user?.role === 'entrenador';
  const [programa, setPrograma] = useState<Partial<programasApi.Programa>>({
    nombre: '',
    descripcion: '',
    tipo: isEntrenador ? 'personalizado' : 'grupal',
    categoria: '',
    activo: true,
    creadoPor: user?.id || '',
  });
  const [categorias, setCategorias] = useState<categoriasApi.Categoria[]>([]);
  const [loading, setLoading] = useState(false);
  const [isClientFileModalOpen, setIsClientFileModalOpen] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const [selectedClientName, setSelectedClientName] = useState<string>('');
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [monthPlan, setMonthPlan] = useState<MonthPlan>(() => {
    const now = new Date();
    return generateMonthPlan(now.getMonth() + 1, now.getFullYear());
  });
  const [isTagModalOpen, setIsTagModalOpen] = useState(false);
  const [tagTarget, setTagTarget] = useState<{ type: 'month' | 'week'; weekNumber?: number } | null>(null);
  const [newTag, setNewTag] = useState('');
  const [searchTag, setSearchTag] = useState('');

  // Generar plan del mes con semanas
  function generateMonthPlan(month: number, year: number): MonthPlan {
    const firstDay = new Date(year, month - 1, 1);
    const lastDay = new Date(year, month, 0);
    const weeks: WeekPlan[] = [];
    
    let currentWeekStart = new Date(firstDay);
    // Ajustar al lunes de la semana
    const dayOfWeek = currentWeekStart.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    currentWeekStart.setDate(currentWeekStart.getDate() + diff);
    
    let weekNumber = 1;
    while (currentWeekStart <= lastDay) {
      const weekEnd = new Date(currentWeekStart);
      weekEnd.setDate(weekEnd.getDate() + 6);
      
      weeks.push({
        weekNumber,
        startDate: currentWeekStart.toISOString().split('T')[0],
        endDate: weekEnd.toISOString().split('T')[0],
        tags: [],
      });
      
      currentWeekStart.setDate(currentWeekStart.getDate() + 7);
      weekNumber++;
    }
    
    return {
      month,
      year,
      tags: [],
      weeks,
    };
  }

  // Actualizar plan cuando cambia el mes
  useEffect(() => {
    const newPlan = generateMonthPlan(currentDate.getMonth() + 1, currentDate.getFullYear());
    // Preservar tags existentes si es posible
    setMonthPlan((prev) => {
      const updatedWeeks = newPlan.weeks.map((week, index) => {
        const prevWeek = prev.weeks[index];
        return prevWeek ? { ...week, tags: prevWeek.tags || [] } : week;
      });
      return {
        ...newPlan,
        tags: prev.tags || [],
        weeks: updatedWeeks,
      };
    });
  }, [currentDate]);

  useEffect(() => {
    loadCategorias();
  }, []);

  const loadCategorias = async () => {
    try {
      const cats = await categoriasApi.getCategorias(programa.tipo);
      setCategorias(cats);
    } catch (error) {
      console.error('Error loading categorias:', error);
    }
  };

  // Calcular todos los tags únicos del plan
  const allTags = useMemo(() => {
    const tagsSet = new Set<string>();
    if (monthPlan.tags) {
      monthPlan.tags.forEach((tag) => tagsSet.add(tag));
    }
    monthPlan.weeks.forEach((week) => {
      if (week.tags) {
        week.tags.forEach((tag) => tagsSet.add(tag));
      }
    });
    return Array.from(tagsSet).sort();
  }, [monthPlan]);

  // Filtrar tags por búsqueda
  const filteredTags = useMemo(() => {
    const all = [...PREDEFINED_TAGS, ...allTags];
    if (!searchTag) return all;
    return all.filter((tag) => tag.toLowerCase().includes(searchTag.toLowerCase()));
  }, [searchTag, allTags]);

  const handleGuardar = async () => {
    if (!programa.nombre || !programa.descripcion) {
      alert('Por favor completa todos los campos obligatorios');
      return;
    }

    setLoading(true);
    try {
      const data = {
        ...programa,
        planSemanal: monthPlan,
      } as any;

      let result;
      if (programa.id) {
        result = await programasApi.actualizarPrograma(programa.id, data);
        if (result) {
          alert('Programa actualizado correctamente');
        }
      } else {
        result = await programasApi.crearPrograma(data);
        if (result) {
          alert('Programa creado correctamente');
          setPrograma({ ...programa, id: result.id });
        }
      }
    } catch (error) {
      console.error('Error saving programa:', error);
      alert('Error al guardar el programa');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenTagModal = (type: 'month' | 'week', weekNumber?: number) => {
    setTagTarget({ type, weekNumber });
    setIsTagModalOpen(true);
    setNewTag('');
    setSearchTag('');
  };

  const getCurrentTags = (): string[] => {
    if (!tagTarget) return [];
    if (tagTarget.type === 'month') {
      return monthPlan.tags || [];
    }
    if (tagTarget.type === 'week' && tagTarget.weekNumber !== undefined) {
      const week = monthPlan.weeks[tagTarget.weekNumber - 1];
      return week?.tags || [];
    }
    return [];
  };

  const handleAddTag = (tag: string) => {
    if (!tagTarget || !tag.trim()) return;

    const tagValue = tag.trim();

    if (tagTarget.type === 'month') {
      const currentTags = monthPlan.tags || [];
      if (!currentTags.includes(tagValue)) {
        setMonthPlan((prev) => ({
          ...prev,
          tags: [...currentTags, tagValue],
        }));
      }
    } else if (tagTarget.type === 'week' && tagTarget.weekNumber !== undefined) {
      const weekIndex = tagTarget.weekNumber - 1;
      const week = monthPlan.weeks[weekIndex];
      if (week) {
        const currentTags = week.tags || [];
        if (!currentTags.includes(tagValue)) {
          setMonthPlan((prev) => ({
            ...prev,
            weeks: prev.weeks.map((w, index) =>
              index === weekIndex ? { ...w, tags: [...currentTags, tagValue] } : w
            ),
          }));
        }
      }
    }

    setNewTag('');
  };

  const handleRemoveTag = (tag: string) => {
    if (!tagTarget) return;

    if (tagTarget.type === 'month') {
      const currentTags = monthPlan.tags || [];
      setMonthPlan((prev) => ({
        ...prev,
        tags: currentTags.filter((t) => t !== tag),
      }));
    } else if (tagTarget.type === 'week' && tagTarget.weekNumber !== undefined) {
      const weekIndex = tagTarget.weekNumber - 1;
      setMonthPlan((prev) => ({
        ...prev,
        weeks: prev.weeks.map((w, index) => {
          if (index === weekIndex) {
            return { ...w, tags: (w.tags || []).filter((t) => t !== tag) };
          }
          return w;
        }),
      }));
    }
  };

  const formatDateRange = (startDate: string, endDate: string): string => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startDay = start.getDate();
    const endDay = end.getDate();
    const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const month = monthNames[start.getMonth()];
    return `${startDay}-${endDay} ${month}`;
  };

  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ];

  const handlePreviousMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  const handleNextMonth = () => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  const handleOpenClientFile = (clientId?: string, clientName?: string) => {
    setSelectedClientId(clientId || '1');
    setSelectedClientName(clientName || 'Cliente');
    setIsClientFileModalOpen(true);
  };

  const currentTags = getCurrentTags();

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-between">
        <Button onClick={() => handleOpenClientFile()} leftIcon={<User className="h-4 w-4" />} variant="secondary">
          Ver Ficha del Cliente
        </Button>
        <Button onClick={handleGuardar} leftIcon={<Save className="h-4 w-4" />} loading={loading}>
          Guardar Programa
        </Button>
      </div>

      {/* Información básica */}
      <Card className="bg-white shadow-sm">
        <div className="space-y-4 p-4">
          <Input
            label="Nombre del Programa"
            value={programa.nombre || ''}
            onChange={(e) => setPrograma({ ...programa, nombre: e.target.value })}
            placeholder="Ej: Rutina de fuerza para Carla"
            required
          />

          <Textarea
            label="Descripción"
            value={programa.descripcion || ''}
            onChange={(e) => setPrograma({ ...programa, descripcion: e.target.value })}
            placeholder="Describe los objetivos y características del programa"
            rows={3}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select
              label="Categoría"
              value={programa.categoria || ''}
              onChange={(e) => setPrograma({ ...programa, categoria: e.target.value })}
              options={[
                { label: 'Selecciona una categoría', value: '' },
                ...categorias.map((c) => ({ label: c.nombre, value: c.id })),
              ]}
            />

            <Input
              label="Duración (semanas)"
              type="number"
              value={programa.duracionSemanas?.toString() || ''}
              onChange={(e) =>
                setPrograma({ ...programa, duracionSemanas: parseInt(e.target.value) || undefined })
              }
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="activo"
              checked={programa.activo}
              onChange={(e) => setPrograma({ ...programa, activo: e.target.checked })}
            />
            <label htmlFor="activo" className="text-sm text-gray-700">
              Programa activo
            </label>
          </div>
        </div>
      </Card>

      {/* Calendario mensual */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-600" />
              <h3 className="text-xl font-bold text-gray-900">Calendario</h3>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="flex items-center gap-1">
                <TagIcon className="h-3 w-3" />
                {allTags.length} tags
              </Badge>
            </div>
          </div>

          {/* Navegación del mes */}
          <div className="mb-6 flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={handlePreviousMonth}
              leftIcon={<ChevronLeft className="h-4 w-4" />}
            >
              Mes anterior
            </Button>
            <h4 className="text-lg font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h4>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleNextMonth}
              leftIcon={<ChevronRight className="h-4 w-4" />}
            >
              Mes siguiente
            </Button>
          </div>

          {/* Tags del mes completo */}
          <div className="mb-6 rounded-lg border border-indigo-200 bg-indigo-50 p-4">
            <div className="flex items-center justify-between">
              <div>
                <h5 className="text-sm font-semibold text-indigo-900">Tags del mes completo</h5>
                <p className="text-xs text-indigo-700">
                  Estos tags se aplican a todo el mes de {monthNames[monthPlan.month - 1]}
                </p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={() => handleOpenTagModal('month')}
                leftIcon={<TagIcon className="h-4 w-4" />}
              >
                Gestionar Tags
              </Button>
            </div>
            {monthPlan.tags && monthPlan.tags.length > 0 ? (
              <div className="mt-3 flex flex-wrap gap-2">
                {monthPlan.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="bg-indigo-100 text-indigo-700">
                    {tag}
                  </Badge>
                ))}
              </div>
            ) : (
              <p className="mt-2 text-sm text-indigo-600">No hay tags asignados al mes</p>
            )}
          </div>

          {/* Semanas del mes */}
          <div className="space-y-3">
            <h5 className="text-sm font-semibold text-gray-700">Semanas del mes</h5>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
              {monthPlan.weeks.map((week) => (
                <div
                  key={week.weekNumber}
                  className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition hover:border-indigo-300 hover:shadow-md"
                >
                  <div className="mb-3 flex items-center justify-between">
                    <div>
                      <h6 className="text-sm font-semibold text-gray-900">
                        Semana {week.weekNumber}
                      </h6>
                      <p className="text-xs text-slate-500">
                        {formatDateRange(week.startDate, week.endDate)}
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenTagModal('week', week.weekNumber)}
                      leftIcon={<TagIcon className="h-4 w-4" />}
                    >
                      Tags
                    </Button>
                  </div>
                  {week.tags && week.tags.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {week.tags.map((tag) => (
                        <Badge key={tag} variant="secondary" className="bg-emerald-100 text-emerald-700">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400">Sin tags asignados</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Modal de gestión de tags */}
      <Modal
        isOpen={isTagModalOpen}
        onClose={() => {
          setIsTagModalOpen(false);
          setTagTarget(null);
        }}
        title={`Gestionar Tags - ${tagTarget?.type === 'month' ? 'Mes completo' : `Semana ${tagTarget?.weekNumber}`}`}
        size="md"
      >
        <div className="space-y-4">
          {/* Tags actuales */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Tags actuales</label>
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
                      onClick={() => handleRemoveTag(tag)}
                      className="ml-1 rounded-full hover:bg-indigo-200"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                ))
              )}
            </div>
          </div>

          {/* Añadir tag */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Añadir tag</label>
            <div className="flex gap-2">
              <Input
                placeholder="Escribe o selecciona un tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && newTag.trim()) {
                    e.preventDefault();
                    handleAddTag(newTag.trim());
                  }
                }}
              />
              <Button
                variant="primary"
                size="sm"
                leftIcon={<Plus className="h-4 w-4" />}
                onClick={() => {
                  if (newTag.trim()) {
                    handleAddTag(newTag.trim());
                  }
                }}
              >
                Añadir
              </Button>
            </div>
          </div>

          {/* Búsqueda */}
          <div>
            <Input
              placeholder="Buscar tags..."
              leftIcon={<Search className="h-4 w-4" />}
              value={searchTag}
              onChange={(e) => setSearchTag(e.target.value)}
            />
          </div>

          {/* Tags predefinidos y usados */}
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-700">Tags disponibles</label>
            <div className="max-h-48 space-y-2 overflow-y-auto">
              <div className="flex flex-wrap gap-2">
                {filteredTags.map((tag) => {
                  const isSelected = currentTags.includes(tag);
                  return (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => {
                        if (isSelected) {
                          handleRemoveTag(tag);
                        } else {
                          handleAddTag(tag);
                        }
                      }}
                      className={`flex items-center gap-1 rounded-lg border px-3 py-1.5 text-sm transition ${
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
          </div>
        </div>
      </Modal>

      {/* Modal de Ficha del Cliente */}
      <ClientFileModal
        open={isClientFileModalOpen}
        onOpenChange={setIsClientFileModalOpen}
        clientId={selectedClientId}
        clientName={selectedClientName}
      />
    </div>
  );
}
