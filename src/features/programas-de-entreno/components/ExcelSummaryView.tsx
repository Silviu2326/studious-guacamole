import { useCallback, useMemo, useState, useEffect } from 'react';
import {
  AlertCircle,
  BarChart3,
  Calculator,
  Calendar,
  Check,
  CheckCircle2,
  Columns,
  Dumbbell,
  Filter,
  FileSpreadsheet,
  LineChart,
  MoreHorizontal,
  PieChart,
  Plus,
  Redo,
  Rows,
  Search,
  Settings,
  SortAsc,
  Sparkles,
  Table2,
  TrendingDown,
  TrendingUp,
  Trash2,
  Undo,
  User,
  X,
  XCircle,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Button, Input } from '../../../components/componentsreutilizables';
import type { DayPlan, PreferenciasCoachExcel, GrupoMuscular, ContextoCliente, ResumenObjetivosProgreso } from '../types';
import { obtenerPreferenciasCoach, tienePreferenciasGuardadas } from '../api/coach-preferences';
import { useAuth } from '../../../context/AuthContext';
import { CoachPreferencesQuestionnaire } from './CoachPreferencesQuestionnaire';
import { AIAnalysisPanel } from './AIAnalysisPanel';
import {
  FormulaPersonalizada,
  calcularFormulasPlanSemanal,
  cargarFormulasPersonalizadas,
} from '../utils/formulasPersonalizadas';

type ExcelCell = {
  value: string | number;
  bold?: boolean;
  backgroundColor?: string;
  italic?: boolean;
  underline?: boolean;
};

type ExcelRow = Record<string, ExcelCell>;

type ExcelSheet = {
  name: string;
  columns: string[];
  data: ExcelRow[];
};

type ExcelSummaryViewProps = {
  weekDays: readonly string[];
  weeklyPlan: Record<string, DayPlan>;
  onUpdateDayPlan?: (day: string, updates: Partial<DayPlan>) => void;
  weeklyTargets?: {
    duration: number;
    calories: number;
  };
  formulasPersonalizadas?: FormulaPersonalizada[];
  columnasPersonalizadas?: string[];
  contextoCliente?: ContextoCliente;
  objetivosProgreso?: ResumenObjetivosProgreso;
};

const EXCEL_ROW_OFFSET = 2;

const SHEET_DESCRIPTIONS: Record<string, string> = {
  'Resumen semanal': 'Indicadores globales de volumen, intensidad y calorías por día.',
  'Detalle sesiones': 'Listado granular de sesiones, bloques y notas por jornada.',
  'Volumen · grupos': 'Análisis automático de volumen y minutos por grupo muscular.',
  'Intensidad · día': 'Distribución de RPE, RIR estimado y tonelaje diario.',
  'Fatiga · IA': 'Panel de sobrecarga con recomendaciones IA para ajustar el microciclo.',
};

const parseFirstNumber = (value: string) => {
  const match = value.match(/\d+(?:[.,]\d+)?/);
  return match ? Number(match[0].replace(',', '.')) : null;
};

export function ExcelSummaryView({ weekDays, weeklyPlan, onUpdateDayPlan, weeklyTargets, contextoCliente, objetivosProgreso }: ExcelSummaryViewProps) {
  const { user } = useAuth();
  const [activeSheet, setActiveSheet] = useState(0);
  const [selectedCell, setSelectedCell] = useState<string | null>(null);
  const [editingCell, setEditingCell] = useState<string | null>(null);
  const [cellValue, setCellValue] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [showAddRow, setShowAddRow] = useState(false);
  const [showAddColumn, setShowAddColumn] = useState(false);
  const [showFormulaBar, setShowFormulaBar] = useState(false);
  const [formulaValue, setFormulaValue] = useState('');
  const [showCharts, setShowCharts] = useState(false);
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [selectedRange, setSelectedRange] = useState<{ start: string; end: string } | null>(null);
  const [isSelectingRange, setIsSelectingRange] = useState(false);
  const [rangeStart, setRangeStart] = useState<string | null>(null);
  const [showRightPanel, setShowRightPanel] = useState(false);
  const [sortColumn, setSortColumn] = useState<string>('A');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showContextMenu, setShowContextMenu] = useState<{ x: number; y: number; row?: number } | null>(null);
  const [preferencias, setPreferencias] = useState<PreferenciasCoachExcel | null>(null);
  const [showQuestionnaire, setShowQuestionnaire] = useState(false);
  const [hasCheckedPreferences, setHasCheckedPreferences] = useState(false);
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showEmbeddedCharts, setShowEmbeddedCharts] = useState(true);

  // Cargar preferencias del coach
  useEffect(() => {
    const loadPreferences = async () => {
      if (!user?.id) return;
      
      const hasPreferences = await tienePreferenciasGuardadas(user.id);
      if (!hasPreferences) {
        // Mostrar cuestionario si no hay preferencias
        setShowQuestionnaire(true);
        setHasCheckedPreferences(true);
        return;
      }

      const prefs = await obtenerPreferenciasCoach(user.id);
      setPreferencias(prefs);
      setHasCheckedPreferences(true);
    };

    loadPreferences();
  }, [user?.id]);

  const muscleGroupSummary = useMemo(() => {
    const summary: Record<string, { volume: number; duration: number }> = {};
    weekDays.forEach((day) => {
      const plan = weeklyPlan[day];
      plan?.sessions.forEach((session) => {
        const grupos = session.gruposMusculares?.length ? session.gruposMusculares : ['full-body'];
        const duration = parseFirstNumber(session.duration ?? '') ?? 0;
        const volume = session.series ?? 1;
        grupos.forEach((grupo) => {
          if (!summary[grupo]) {
            summary[grupo] = { volume: 0, duration: 0 };
          }
          summary[grupo].volume += volume;
          summary[grupo].duration += duration;
        });
      });
    });
    return Object.entries(summary)
      .map(([grupo, data]) => ({ grupo, volume: data.volume, duration: data.duration }))
      .sort((a, b) => b.volume - a.volume);
  }, [weekDays, weeklyPlan]);

  const intensityDistribution = useMemo(() => {
    return weekDays.map((day) => {
      const plan = weeklyPlan[day];
      let totalRpe = 0;
      let rpeCount = 0;
      let tonnage = 0;
      plan?.sessions.forEach((session) => {
        const rpeMatch = session.intensity?.match(/(\d+(?:\.\d+)?)/);
        if (rpeMatch) {
          totalRpe += parseFloat(rpeMatch[1]);
          rpeCount += 1;
        }
        const series = session.series ?? 0;
        const reps = parseFirstNumber(session.repeticiones ?? '') ?? 0;
        tonnage += series * reps;
      });
      const averageRpe = rpeCount > 0 ? Number((totalRpe / rpeCount).toFixed(1)) : null;
      const rir = averageRpe !== null ? Math.max(0, Number((10 - averageRpe).toFixed(1))) : null;
      return {
        day,
        rpe: averageRpe,
        rir,
        tonnage,
      };
    });
  }, [weekDays, weeklyPlan]);

  const fatigueInsights = useMemo(() => {
    return weekDays.map((day) => {
      const plan = weeklyPlan[day];
      const totalMinutes = plan?.sessions.reduce((total, session) => total + (parseFirstNumber(session.duration) ?? 0), 0) ?? 0;
      const reference = weeklyTargets?.duration ?? 60;
      const overloadPercentage = reference > 0 ? Math.round(((totalMinutes - reference) / reference) * 100) : 0;
      let recommendation = 'OK';
      if (overloadPercentage >= 25) {
        recommendation = 'Sugiere día de descarga';
      } else if (overloadPercentage >= 15) {
        recommendation = 'Reducir volumen accesorios';
      } else if (overloadPercentage <= -10) {
        recommendation = 'Aumentar estímulo progresivo';
      }
      return {
        day,
        overload: overloadPercentage,
        recommendation,
      };
    });
  }, [weekDays, weeklyPlan, weeklyTargets]);

  const weeklyAnalytics = useMemo(() => {
    const totalMinutes = weekDays.reduce((acc, day) => {
      const plan = weeklyPlan[day];
      return acc + (plan?.sessions.reduce((total, session) => total + (parseFirstNumber(session.duration) ?? 0), 0) ?? 0);
    }, 0);
    const avgRpe =
      intensityDistribution.filter((item) => item.rpe !== null).reduce((acc, item) => acc + (item.rpe ?? 0), 0) /
      (intensityDistribution.filter((item) => item.rpe !== null).length || 1);
    const topMuscle = muscleGroupSummary[0];
    const fatigueCritical =
      fatigueInsights.find((item) => item.overload >= 15) ??
      fatigueInsights.sort((a, b) => b.overload - a.overload)[0];
    return {
      totalMinutes,
      avgRpe: Number(avgRpe.toFixed(1)),
      topMuscle,
      fatigueCritical,
    };
  }, [weekDays, weeklyPlan, intensityDistribution, muscleGroupSummary, fatigueInsights]);

  const handlePreferencesSaved = async () => {
    if (!user?.id) return;
    const prefs = await obtenerPreferenciasCoach(user.id);
    setPreferencias(prefs);
    setShowQuestionnaire(false);
  };

  const sheets = useMemo<ExcelSheet[]>(() => {
    const summaryHeader: ExcelRow = {
      A: { value: 'DÍA', bold: true, backgroundColor: '#f3f4f6' },
      B: { value: 'SESIÓN', bold: true, backgroundColor: '#f3f4f6' },
      C: { value: 'EJERCICIOS', bold: true, backgroundColor: '#f3f4f6' },
      D: { value: 'VOLUMEN', bold: true, backgroundColor: '#f3f4f6' },
      E: { value: 'INTENSIDAD', bold: true, backgroundColor: '#f3f4f6' },
      F: { value: 'DURACIÓN', bold: true, backgroundColor: '#f3f4f6' },
      G: { value: 'CALORÍAS', bold: true, backgroundColor: '#f3f4f6' },
      H: { value: 'OBJ. DURACIÓN', bold: true, backgroundColor: '#e0f2fe' },
      I: { value: 'OBJ. CALORÍAS', bold: true, backgroundColor: '#e0f2fe' },
    };

    const summaryRows: ExcelRow[] = [summaryHeader];
    let intensityAccumulator = 0;
    let intensityCount = 0;

    weekDays.forEach((day) => {
      const plan = weeklyPlan[day];
      const sessions = plan?.sessions ?? [];
      const totalExercises = sessions.length * 3;
      const totalVolume = parseFirstNumber(plan?.volume ?? '') ?? totalExercises;
      const intensityValue = parseFirstNumber(plan?.intensity ?? '');
      if (intensityValue !== null) {
        intensityAccumulator += intensityValue;
        intensityCount += 1;
      }
      const totalMinutes = sessions.reduce((total, session) => total + (parseFirstNumber(session.duration) ?? 0), 0);
      const calories = Math.round(totalMinutes * 8);
      
      // Verificar si excede objetivos semanales
      const exceedsDuration = weeklyTargets && totalMinutes > weeklyTargets.duration;
      const exceedsCalories = weeklyTargets && calories > weeklyTargets.calories;
      const dayBackgroundColor = (exceedsDuration || exceedsCalories) ? '#fee2e2' : undefined;

      summaryRows.push({
        A: { value: day, bold: true, backgroundColor: dayBackgroundColor },
        B: { value: sessions.length, backgroundColor: dayBackgroundColor },
        C: { value: totalExercises, backgroundColor: dayBackgroundColor },
        D: { value: totalVolume, backgroundColor: dayBackgroundColor },
        E: { value: intensityValue ?? '—', backgroundColor: dayBackgroundColor },
        F: { value: totalMinutes, backgroundColor: dayBackgroundColor },
        G: { value: calories, backgroundColor: dayBackgroundColor },
        H: { value: plan?.targetDuration ?? '—', backgroundColor: dayBackgroundColor },
        I: { value: plan?.targetCalories ?? '—', backgroundColor: dayBackgroundColor },
      });
    });

    const totals = summaryRows.slice(1).reduce(
      (acc, row) => {
        acc.sessions += Number(row.B?.value ?? 0);
        acc.exercises += Number(row.C?.value ?? 0);
        acc.volume += Number(row.D?.value ?? 0);
        acc.duration += Number(row.F?.value ?? 0);
        acc.calories += Number(row.G?.value ?? 0);
        return acc;
      },
      { sessions: 0, exercises: 0, volume: 0, duration: 0, calories: 0 },
    );

    const totalTargetDuration = weekDays.reduce((sum, day) => sum + (weeklyPlan[day]?.targetDuration ?? 0), 0);
    const totalTargetCalories = weekDays.reduce((sum, day) => sum + (weeklyPlan[day]?.targetCalories ?? 0), 0);

    summaryRows.push({
      A: { value: 'TOTAL', bold: true, backgroundColor: '#dbeafe' },
      B: { value: totals.sessions, bold: true, backgroundColor: '#dbeafe' },
      C: { value: totals.exercises, bold: true, backgroundColor: '#dbeafe' },
      D: { value: totals.volume, bold: true, backgroundColor: '#dbeafe' },
      E: {
        value: intensityCount > 0 ? Number((intensityAccumulator / intensityCount).toFixed(1)) : '—',
        bold: true,
        backgroundColor: '#dbeafe',
      },
      F: { value: totals.duration, bold: true, backgroundColor: '#dbeafe' },
      G: { value: totals.calories, bold: true, backgroundColor: '#dbeafe' },
      H: { value: totalTargetDuration || '—', bold: true, backgroundColor: '#dbeafe' },
      I: { value: totalTargetCalories || '—', bold: true, backgroundColor: '#dbeafe' },
    });

    const detailHeader: ExcelRow = {
      A: { value: 'DÍA', bold: true, backgroundColor: '#f3f4f6' },
      B: { value: 'BLOQUE', bold: true, backgroundColor: '#f3f4f6' },
      C: { value: 'MODALIDAD', bold: true, backgroundColor: '#f3f4f6' },
      D: { value: 'DURACIÓN', bold: true, backgroundColor: '#f3f4f6' },
      E: { value: 'INTENSIDAD', bold: true, backgroundColor: '#f3f4f6' },
      F: { value: 'NOTAS', bold: true, backgroundColor: '#f3f4f6' },
    };

    const detailRows: ExcelRow[] = [detailHeader];

    weekDays.forEach((day) => {
      const plan = weeklyPlan[day];
      plan?.sessions.forEach((session) => {
        detailRows.push({
          A: { value: day },
          B: { value: session.block },
          C: { value: session.modality },
          D: { value: session.duration },
          E: { value: session.intensity },
          F: { value: session.notes || '—' },
        });
      });
    });

    const muscleHeader: ExcelRow = {
      A: { value: 'GRUPO', bold: true, backgroundColor: '#f3f4f6' },
      B: { value: 'SERIES', bold: true, backgroundColor: '#f3f4f6' },
      C: { value: 'MINUTOS', bold: true, backgroundColor: '#f3f4f6' },
    };

    const muscleRows: ExcelRow[] = [
      muscleHeader,
      ...muscleGroupSummary.map((item) => ({
        A: { value: item.grupo },
        B: { value: item.volume },
        C: { value: item.duration },
      })),
    ];

    const intensityHeader: ExcelRow = {
      A: { value: 'DÍA', bold: true, backgroundColor: '#f3f4f6' },
      B: { value: 'RPE MEDIO', bold: true, backgroundColor: '#f3f4f6' },
      C: { value: 'RIR EST.', bold: true, backgroundColor: '#f3f4f6' },
      D: { value: 'TONELAJE EST.', bold: true, backgroundColor: '#f3f4f6' },
    };

    const intensityRows: ExcelRow[] = [
      intensityHeader,
      ...intensityDistribution.map((item) => ({
        A: { value: item.day },
        B: { value: item.rpe ?? '—' },
        C: { value: item.rir ?? '—' },
        D: { value: item.tonnage },
      })),
    ];

    const fatigueHeader: ExcelRow = {
      A: { value: 'DÍA', bold: true, backgroundColor: '#f3f4f6' },
      B: { value: 'SOBRECARGA %', bold: true, backgroundColor: '#f3f4f6' },
      C: { value: 'RECOMENDACIÓN IA', bold: true, backgroundColor: '#f3f4f6' },
    };

    const fatigueRows: ExcelRow[] = [
      fatigueHeader,
      ...fatigueInsights.map((item) => ({
        A: { value: item.day },
        B: {
          value: `${item.overload}%`,
          backgroundColor:
            item.overload >= 20 ? '#fee2e2' : item.overload <= -10 ? '#dbeafe' : undefined,
        },
        C: { value: item.recommendation },
      })),
    ];

    return [
      {
        name: 'Resumen semanal',
        columns: ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I'],
        data: summaryRows,
      },
      {
        name: 'Detalle sesiones',
        columns: ['A', 'B', 'C', 'D', 'E', 'F'],
        data: detailRows,
      },
      {
        name: 'Volumen · grupos',
        columns: ['A', 'B', 'C'],
        data: muscleRows,
      },
      {
        name: 'Intensidad · día',
        columns: ['A', 'B', 'C', 'D'],
        data: intensityRows,
      },
      {
        name: 'Fatiga · IA',
        columns: ['A', 'B', 'C'],
        data: fatigueRows,
      },
    ];
  }, [weekDays, weeklyPlan, weeklyTargets, muscleGroupSummary, intensityDistribution, fatigueInsights]);

  const currentSheet = sheets[activeSheet] ?? sheets[0];

  const selectedFormula = useMemo(() => {
    if (!selectedCell || !currentSheet) {
      return '';
    }

    const [rowIndexRaw, column] = selectedCell.split('-');
    const rowIndex = Number(rowIndexRaw);
    const cell = currentSheet.data[rowIndex]?.[column];

    return cell?.value?.toString() ?? '';
  }, [selectedCell, currentSheet]);

  // Función para verificar si una celda está en el rango seleccionado
  const isCellInRange = useCallback((cellId: string, range: { start: string; end: string } | null) => {
    if (!range) return false;
    const [startRow, startCol] = range.start.split('-').map((v, i) => i === 0 ? Number(v) : v);
    const [endRow, endCol] = range.end.split('-').map((v, i) => i === 0 ? Number(v) : v);
    const [cellRow, cellCol] = cellId.split('-').map((v, i) => i === 0 ? Number(v) : v);
    
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = startCol < endCol ? startCol : endCol;
    const maxCol = startCol > endCol ? startCol : endCol;
    
    return cellRow >= minRow && cellRow <= maxRow && cellCol >= minCol && cellCol <= maxCol;
  }, []);

  // Función para calcular estadísticas del rango seleccionado
  const calculateRangeStatistics = useMemo(() => {
    if (!selectedRange || !currentSheet) return null;

    const [startRow, startCol] = selectedRange.start.split('-').map((v, i) => i === 0 ? Number(v) : v);
    const [endRow, endCol] = selectedRange.end.split('-').map((v, i) => i === 0 ? Number(v) : v);
    
    const minRow = Math.min(startRow, endRow);
    const maxRow = Math.max(startRow, endRow);
    const minCol = startCol < endCol ? startCol : endCol;
    const maxCol = startCol > endCol ? startCol : endCol;

    // Obtener datos del rango
    const rangeData: Array<{ row: number; column: string; value: any; day?: string }> = [];
    for (let row = minRow; row <= maxRow; row++) {
      for (let col = minCol.charCodeAt(0); col <= maxCol.charCodeAt(0); col++) {
        const column = String.fromCharCode(col);
        const cell = currentSheet.data[row]?.[column];
        if (cell && row > 0 && row <= weekDays.length) {
          const day = weekDays[row - 1];
          rangeData.push({ row, column, value: cell.value, day });
        }
      }
    }

    // Calcular estadísticas
    const stats = {
      totalCells: rangeData.length,
      volumeByMuscleGroup: {} as Record<string, number>,
      averageRPE: 0,
      totalVolume: 0,
      totalDuration: 0,
      totalCalories: 0,
      sessionsByDay: {} as Record<string, number>,
      intensityValues: [] as number[],
    };

    // Procesar datos del rango
    rangeData.forEach(({ row, column, value, day }) => {
      if (day) {
        const plan = weeklyPlan[day];
        if (plan) {
          // Calcular volumen por grupo muscular
          plan.sessions.forEach(session => {
            if (session.gruposMusculares) {
              session.gruposMusculares.forEach(grupo => {
                stats.volumeByMuscleGroup[grupo] = (stats.volumeByMuscleGroup[grupo] || 0) + 1;
              });
            }
          });

          // Extraer RPE de intensidad
          plan.sessions.forEach(session => {
            const rpeMatch = session.intensity?.match(/RPE\s*(\d+(?:\.\d+)?)/i);
            if (rpeMatch) {
              stats.intensityValues.push(parseFloat(rpeMatch[1]));
            }
          });

          // Calcular totales
          const totalMinutes = plan.sessions.reduce((total, session) => 
            total + (parseFirstNumber(session.duration) ?? 0), 0);
          stats.totalDuration += totalMinutes;
          stats.totalCalories += Math.round(totalMinutes * 8);
          stats.totalVolume += parseFirstNumber(plan.volume ?? '') ?? 0;
          stats.sessionsByDay[day] = plan.sessions.length;
        }
      }
    });

    // Calcular promedio de RPE
    if (stats.intensityValues.length > 0) {
      stats.averageRPE = stats.intensityValues.reduce((sum, val) => sum + val, 0) / stats.intensityValues.length;
    }

    return stats;
  }, [selectedRange, currentSheet, weekDays, weeklyPlan]);

  const handleCellClick = (cellId: string, event?: React.MouseEvent) => {
    if (event?.shiftKey && rangeStart) {
      // Selección de rango con Shift
      setSelectedRange({ start: rangeStart, end: cellId });
      setShowRightPanel(true);
    } else if (event?.ctrlKey || event?.metaKey) {
      // Selección múltiple con Ctrl/Cmd
      if (!selectedRange) {
        setRangeStart(cellId);
        setSelectedRange({ start: cellId, end: cellId });
      } else {
        setSelectedRange({ ...selectedRange, end: cellId });
      }
      setShowRightPanel(true);
    } else {
      // Selección simple
      setSelectedCell(cellId);
      setRangeStart(cellId);
      const newRange = { start: cellId, end: cellId };
      setSelectedRange(newRange);
      
      // Si hay un rango previo y la celda clickeada está dentro de él, mantener el panel abierto
      if (selectedRange && isCellInRange(cellId, selectedRange) && selectedRange.start !== selectedRange.end) {
        setShowRightPanel(true);
      } else {
        setShowRightPanel(false);
      }
    }
    setEditingCell(null);
    const [rowIndexRaw, column] = cellId.split('-');
    const rowIndex = Number(rowIndexRaw);
    const nextValue = currentSheet?.data[rowIndex]?.[column]?.value?.toString() ?? '';
    setCellValue(nextValue);
  };

  const handleCellEdit = (cellId: string) => {
    setEditingCell(cellId);
  };

  const handleCellSave = () => {
    if (editingCell && onUpdateDayPlan) {
      const [rowIndexRaw, column] = editingCell.split('-');
      const rowIndex = Number(rowIndexRaw);
      
      // Solo procesar si estamos en la hoja de resumen y no es la fila de encabezado o total
      if (activeSheet === 0 && rowIndex > 0 && rowIndex <= weekDays.length) {
        const day = weekDays[rowIndex - 1];
        const trimmedValue = cellValue.trim();
        
        // Permitir valores vacíos para limpiar el objetivo
        if (trimmedValue === '' || trimmedValue === '—') {
          if (column === 'H') {
            onUpdateDayPlan(day, { targetDuration: undefined });
          } else if (column === 'I') {
            onUpdateDayPlan(day, { targetCalories: undefined });
          }
        } else {
          // Intentar parsear como número
          const numericValue = parseFirstNumber(trimmedValue);
          if (numericValue !== null && numericValue >= 0) {
            if (column === 'H') {
              // Actualizar objetivo de duración
              onUpdateDayPlan(day, { targetDuration: numericValue });
            } else if (column === 'I') {
              // Actualizar objetivo de calorías
              onUpdateDayPlan(day, { targetCalories: numericValue });
            }
          }
        }
      }
    }
    
    setEditingCell(null);
    setCellValue('');
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      handleCellSave();
    }

    if (event.key === 'Escape') {
      setEditingCell(null);
      setCellValue('');
    }
  };

  const handleToggleAllRows = useCallback(() => {
    setSelectedRows((prev) => {
      if (currentSheet) {
        if (prev.length === currentSheet.data.length) {
          return [];
        }

        return currentSheet.data.map((_, index) => index);
      }

      return prev;
    });
  }, [currentSheet]);

  const handleRowSelect = (rowIndex: number, multiSelect = false) => {
    setSelectedRows((prev) => {
      if (multiSelect) {
        return prev.includes(rowIndex) ? prev.filter((row) => row !== rowIndex) : [...prev, rowIndex];
      }

      return [rowIndex];
    });
  };

  const handleAddRow = (position: 'top' | 'bottom') => {
    console.log(`Añadir fila (${position})`);
  };

  const handleAddColumn = (position: 'left' | 'right') => {
    console.log(`Añadir columna (${position})`);
  };

  const handleDeleteRow = (row: number) => {
    console.log(`Eliminar fila ${row}`);
  };

  const handleAddSession = (identifier: string) => {
    console.log('Añadir sesión', identifier);
  };

  const handleAddExercise = (identifier: string) => {
    console.log('Añadir ejercicio', identifier);
  };

  if (!currentSheet) {
    return null;
  }

  return (
    <div className="space-y-6 font-sans text-slate-700 dark:text-slate-700 relative">
      <div className="rounded-3xl border border-slate-200 bg-white px-6 py-5 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Vista Excel · Editor IA</p>
            <h2 className="text-2xl font-semibold text-slate-900">Planificación semanal</h2>
            <p className="text-sm text-slate-500">
              Analiza el programa como una hoja de cálculo dinámica: selecciona rangos, aplica IA y exporta insights.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Button variant="ghost" size="sm" leftIcon={<Undo className="h-4 w-4" />}>
              Deshacer
            </Button>
            <Button variant="ghost" size="sm" leftIcon={<Redo className="h-4 w-4" />}>
              Rehacer
            </Button>
            <Button
              variant="secondary"
              size="sm"
              leftIcon={<FileSpreadsheet className="h-4 w-4" />}
            >
              Exportar .xlsx
            </Button>
            <Button
              variant="ghost"
              size="sm"
              leftIcon={<Settings className="h-4 w-4" />}
              onClick={() => setShowQuestionnaire(true)}
            >
              Preferencias
            </Button>
            <div className="relative">
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<MoreHorizontal className="h-4 w-4" />}
                onClick={() => setShowMoreActions((prev) => !prev)}
              >
                Más
              </Button>
              {showMoreActions && (
                <div className="absolute right-0 z-30 mt-2 w-56 rounded-2xl border border-slate-200 bg-white p-2 text-xs shadow-xl">
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-slate-600 transition hover:bg-slate-50"
                    onClick={() => {
                      setShowAddRow(true);
                      setShowMoreActions(false);
                    }}
                  >
                    <Rows className="h-4 w-4" />
                    Añadir filas
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-slate-600 transition hover:bg-slate-50"
                    onClick={() => {
                      setShowAddColumn(true);
                      setShowMoreActions(false);
                    }}
                  >
                    <Columns className="h-4 w-4" />
                    Añadir columnas
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-slate-600 transition hover:bg-slate-50"
                    onClick={() => {
                      setShowCharts(true);
                      setShowMoreActions(false);
                    }}
                  >
                    <BarChart3 className="h-4 w-4" />
                    Insertar gráfico
                  </button>
                  <button
                    type="button"
                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-rose-500 transition hover:bg-rose-50"
                    onClick={() => {
                      setShowAddRow(false);
                      setShowAddColumn(false);
                      setShowCharts(false);
                      setShowMoreActions(false);
                    }}
                  >
                    <X className="h-4 w-4" />
                    Limpiar acciones
                  </button>
                </div>
              )}
            </div>
          </div>
      {showEmbeddedCharts && (
        <div className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 xl:grid-cols-4">
          <div className="rounded-2xl bg-gradient-to-br from-sky-500 to-indigo-500 p-4 text-white shadow">
            <p className="text-xs uppercase tracking-wide text-white/70">Carga semanal</p>
            <p className="mt-2 text-3xl font-semibold">{weeklyAnalytics.totalMinutes} min</p>
            <p className="text-xs text-white/80">Duración total planificada</p>
          </div>
          <div className="rounded-2xl border border-slate-100 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Grupo con más volumen</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {weeklyAnalytics.topMuscle?.grupo ?? '—'}
            </p>
            <p className="text-sm text-slate-500">
              {weeklyAnalytics.topMuscle
                ? `${weeklyAnalytics.topMuscle.volume} series · ${weeklyAnalytics.topMuscle.duration} min`
                : 'Sin datos registrados'}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-100 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Intensidad media</p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">{weeklyAnalytics.avgRpe}/10 RPE</p>
            <p className="text-sm text-slate-500">Estimación basada en los bloques del plan</p>
          </div>
          <div className="rounded-2xl border border-slate-100 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Fatiga IA</p>
            {weeklyAnalytics.fatigueCritical ? (
              <>
                <p className="mt-2 text-2xl font-semibold text-slate-900">
                  {weeklyAnalytics.fatigueCritical.day}
                </p>
                <p className="text-sm text-slate-500">
                  Sobrecarga {weeklyAnalytics.fatigueCritical.overload}% ·{' '}
                  {weeklyAnalytics.fatigueCritical.recommendation}
                </p>
              </>
            ) : (
              <p className="mt-2 text-sm text-slate-500">Sin alertas esta semana</p>
            )}
          </div>
        </div>
      )}
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex flex-1 min-w-[220px] items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              className="w-full bg-transparent focus:outline-none"
              placeholder="Buscar días, bloques o ejercicios..."
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
            />
          </div>
          <Button
            variant={showFilters ? 'secondary' : 'ghost'}
            size="sm"
            leftIcon={<Filter className="h-4 w-4" />}
            onClick={() => setShowFilters((prev) => !prev)}
          >
            Filtros
          </Button>
          <Button
            variant={showAddColumn || showAddRow ? 'secondary' : 'ghost'}
            size="sm"
            leftIcon={<Columns className="h-4 w-4" />}
            onClick={() => {
              setShowAddColumn((prev) => !prev);
              setShowAddRow(false);
            }}
          >
            Columnas
          </Button>
          <Button
            variant={showFormulaBar ? 'secondary' : 'ghost'}
            size="sm"
            leftIcon={<Calculator className="h-4 w-4" />}
            onClick={() => setShowFormulaBar((prev) => !prev)}
          >
            Fórmulas
          </Button>
          <Button
            variant={showEmbeddedCharts ? 'secondary' : 'ghost'}
            size="sm"
            leftIcon={<BarChart3 className="h-4 w-4" />}
            onClick={() => setShowEmbeddedCharts((prev) => !prev)}
          >
            Analytics
          </Button>
          <Button
            variant="primary"
            size="sm"
            leftIcon={<Sparkles className="h-4 w-4" />}
            onClick={() => {
              if (!selectedRange && currentSheet?.data?.[1]) {
                setSelectedCell('1-A');
                setRangeStart('1-A');
                setSelectedRange({ start: '1-A', end: '1-A' });
              }
              setShowRightPanel(true);
            }}
          >
            IA Insight
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-white px-6 py-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-wide text-slate-400">Hoja activa</p>
              <h3 className="text-lg font-semibold text-slate-900">{currentSheet.name}</h3>
              <p className="text-xs text-slate-500">{SHEET_DESCRIPTIONS[currentSheet.name] ?? 'Análisis específico del programa.'}</p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button variant="ghost" size="sm" leftIcon={<Calculator className="h-4 w-4" />} onClick={() => setShowFormulaBar((prev) => !prev)}>
                Fórmula
              </Button>
              <Button variant="ghost" size="sm" leftIcon={<BarChart3 className="h-4 w-4" />} onClick={() => setShowCharts((prev) => !prev)}>
                Insertar gráfico
              </Button>
              <Button
                variant="ghost"
                size="sm"
                leftIcon={<SortAsc className="h-4 w-4" />}
                onClick={() => {
                  setSortColumn('A');
                  setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                }}
              >
                Orden {sortDirection === 'asc' ? 'ASC' : 'DESC'}
              </Button>
            </div>
          </div>
        </div>

        {showFormulaBar && (
          <div className="border-b border-slate-200 bg-sky-50 px-4 py-3 text-xs text-sky-700">
            <div className="flex items-center gap-3">
              <span className="font-medium">Fórmula</span>
              <input
                className="flex-1 rounded border border-sky-200 bg-white px-3 py-1 text-xs focus:border-sky-400 focus:outline-none"
                placeholder="=SUM(A1:A10)"
                value={formulaValue}
                onChange={(event) => setFormulaValue(event.target.value)}
              />
              <button className="rounded bg-sky-600 px-3 py-1 text-white transition hover:bg-sky-700" type="button" onClick={handleCellSave}>
                <Check className="h-4 w-4" />
              </button>
              <button className="rounded bg-slate-500 px-3 py-1 text-white transition hover:bg-slate-600" type="button" onClick={() => setShowFormulaBar(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {(showAddRow || showAddColumn) && (
          <div className="border-b border-slate-200 bg-emerald-50 px-4 py-3 text-xs text-emerald-700">
            <div className="flex flex-wrap items-center gap-4">
              {showAddRow && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Añadir fila</span>
                  <button className="rounded bg-emerald-600 px-3 py-1 text-white transition hover:bg-emerald-700" type="button" onClick={() => handleAddRow('top')}>
                    Arriba
                  </button>
                  <button className="rounded bg-emerald-600 px-3 py-1 text-white transition hover:bg-emerald-700" type="button" onClick={() => handleAddRow('bottom')}>
                    Abajo
                  </button>
                </div>
              )}
              {showAddColumn && (
                <div className="flex items-center gap-2">
                  <span className="font-medium">Añadir columna</span>
                  <button className="rounded bg-emerald-600 px-3 py-1 text-white transition hover:bg-emerald-700" type="button" onClick={() => handleAddColumn('left')}>
                    Izquierda
                  </button>
                  <button className="rounded bg-emerald-600 px-3 py-1 text-white transition hover:bg-emerald-700" type="button" onClick={() => handleAddColumn('right')}>
                    Derecha
                  </button>
                </div>
              )}
              <button
                className="rounded bg-slate-500 px-3 py-1 text-white transition hover:bg-slate-600"
                type="button"
                onClick={() => {
                  setShowAddRow(false);
                  setShowAddColumn(false);
                }}
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        {showCharts && (
          <div className="border-b border-slate-200 bg-purple-50 px-4 py-3 text-xs text-purple-700">
            <div className="flex flex-wrap items-center gap-3">
              <span className="font-medium">Crear gráfico</span>
              <button className="flex items-center gap-2 rounded bg-purple-600 px-3 py-1 text-white transition hover:bg-purple-700" type="button">
                <BarChart3 className="h-4 w-4" />
                Barras
              </button>
              <button className="flex items-center gap-2 rounded bg-purple-600 px-3 py-1 text-white transition hover:bg-purple-700" type="button">
                <PieChart className="h-4 w-4" />
                Circular
              </button>
              <button className="flex items-center gap-2 rounded bg-purple-600 px-3 py-1 text-white transition hover:bg-purple-700" type="button">
                <LineChart className="h-4 w-4" />
                Líneas
              </button>
              <button className="rounded bg-slate-500 px-3 py-1 text-white transition hover:bg-slate-600" type="button" onClick={() => setShowCharts(false)}>
                <X className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}

        <div className="border-b border-slate-200 bg-slate-100">
          <div className="flex">
            {sheets.map((sheet, index) => (
              <button
                key={sheet.name}
                className={`px-4 py-2 text-xs font-semibold transition-colors ${
                  activeSheet === index ? 'border-b-2 border-emerald-600 bg-white text-emerald-600' : 'border-b-2 border-transparent text-slate-500 hover:bg-slate-50'
                }`}
                type="button"
                onClick={() => setActiveSheet(index)}
              >
                {sheet.name}
              </button>
            ))}
            <button className="px-3 py-2 text-xs text-slate-500 transition hover:bg-slate-50" type="button">
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="max-h-[520px] overflow-auto bg-white">
          <div className="p-4">
            <div className="overflow-hidden rounded-lg border border-slate-300">
              <div className="flex bg-slate-100">
                <div className="flex w-12 items-center justify-center border-r border-slate-300 bg-slate-200 text-xs font-medium text-slate-600">#</div>
                {currentSheet.columns.map((column) => (
                  <div key={column} className="min-w-[96px] border-r border-slate-300 px-3 py-2 text-xs font-medium text-slate-600">
                    {column}
                  </div>
                ))}
              </div>

              {currentSheet.data.map((row, rowIndex) => {
                const isHeaderRow = rowIndex === 0;
                const isSelectedRow = selectedRows.includes(rowIndex);

                return (
                  <div
                    key={rowIndex}
                    className={`flex border-b border-slate-200 ${isSelectedRow ? 'bg-sky-50' : 'bg-white'} ${isHeaderRow ? 'bg-slate-100 font-semibold' : ''}`}
                    onContextMenu={(event) => {
                      event.preventDefault();
                      setShowContextMenu({ x: event.clientX, y: event.clientY, row: rowIndex });
                    }}
                  >
                    <div className="relative flex w-12 items-center justify-center border-r border-slate-300 bg-slate-50 text-xs text-slate-500">
                      <input
                       checked={isSelectedRow}
                        className="h-3 w-3 text-sky-600"
                        onChange={(event) => {
                          event.stopPropagation();
                          handleRowSelect(rowIndex, true);
                        }}
                        type="checkbox"
                      />
                      <span className="ml-1">{rowIndex + 1}</span>
                    </div>
                    {currentSheet.columns.map((column) => {
                      const cellId = `${rowIndex}-${column}`;
                      const cell = row[column] ?? { value: '' };
                      const isSelected = selectedCell === cellId;
                      const isEditing = editingCell === cellId;
                      
                      // Verificar si esta celda es editable (objetivos en columnas H o I)
                      const isEditableGoal = !isHeaderRow && rowIndex > 0 && rowIndex <= weekDays.length && (column === 'H' || column === 'I');
                      
                      // Verificar si el día excede objetivos semanales
                      const dayIndex = rowIndex - 1;
                      const day = dayIndex >= 0 && dayIndex < weekDays.length ? weekDays[dayIndex] : null;
                      const plan = day ? weeklyPlan[day] : null;
                      const totalMinutes = plan ? plan.sessions.reduce((total, session) => total + (parseFirstNumber(session.duration) ?? 0), 0) : 0;
                      const calories = Math.round(totalMinutes * 8);
                      const targetDuration = plan?.targetDuration;
                      const targetCalories = plan?.targetCalories;
                      
                      // Formato condicional mejorado: verificar cumplimiento de objetivos
                      let objectiveStatus: 'fulfilled' | 'exceeded' | 'below' | null = null;
                      if (column === 'F' && targetDuration !== undefined && targetDuration > 0) {
                        if (totalMinutes >= targetDuration * 0.95 && totalMinutes <= targetDuration * 1.05) {
                          objectiveStatus = 'fulfilled';
                        } else if (totalMinutes > targetDuration * 1.05) {
                          objectiveStatus = 'exceeded';
                        } else if (totalMinutes < targetDuration * 0.95) {
                          objectiveStatus = 'below';
                        }
                      } else if (column === 'G' && targetCalories !== undefined && targetCalories > 0) {
                        if (calories >= targetCalories * 0.95 && calories <= targetCalories * 1.05) {
                          objectiveStatus = 'fulfilled';
                        } else if (calories > targetCalories * 1.05) {
                          objectiveStatus = 'exceeded';
                        } else if (calories < targetCalories * 0.95) {
                          objectiveStatus = 'below';
                        }
                      }
                      
                      const exceedsDuration = weeklyTargets && day && totalMinutes > weeklyTargets.duration;
                      const exceedsCalories = weeklyTargets && day && calories > weeklyTargets.calories;
                      const showWarning = day && ((column === 'F' && exceedsDuration) || (column === 'G' && exceedsCalories));
                      
                      // Verificar si la celda está en el rango seleccionado
                      const isInRange = selectedRange && isCellInRange(cellId, selectedRange);
                      let cellTooltip: string | undefined;
                      if (!isHeaderRow) {
                        if (column === 'F') {
                          cellTooltip = 'Duración incluye descansos estimados según tus configuraciones.';
                        } else if (column === 'G') {
                          cellTooltip = 'Calorías aproximadas calculadas sobre la carga de trabajo.';
                        } else if (column === 'D') {
                          cellTooltip = 'Volumen estimado a partir del número de series efectivas.';
                        } else if (column === 'E') {
                          cellTooltip = 'Intensidad declarada (RPE) o notas cualitativas.';
                        }
                      }

                      return (
                        <div
                          key={column}
                          className={`group relative min-w-[96px] flex-1 cursor-pointer border-r border-slate-200 px-3 py-2 text-sm transition ${
                            isHeaderRow ? 'bg-slate-100 font-semibold' : 'bg-white'
                          } ${isSelected ? 'bg-sky-100 ring-1 ring-sky-300' : ''} ${
                            showWarning ? 'ring-2 ring-red-400 bg-red-50' : ''
                          } ${isEditableGoal ? 'bg-blue-50/50 hover:bg-blue-100/50' : ''} ${
                            isInRange ? 'ring-2 ring-blue-400 bg-blue-50' : ''
                          }`}
                          title={cellTooltip}
                          onClick={(e) => handleCellClick(cellId, e)}
                          onDoubleClick={() => {
                            if (isEditableGoal) {
                              handleCellEdit(cellId);
                            }
                          }}
                        >
                          {isEditing ? (
                            <input
                              autoFocus
                              className="w-full border-none bg-transparent text-sm focus:outline-none"
                              onBlur={handleCellSave}
                              onChange={(event) => setCellValue(event.target.value)}
                              onKeyDown={handleKeyDown}
                              value={cellValue}
                              type={column === 'H' || column === 'I' ? 'number' : 'text'}
                            />
                          ) : (
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-1 flex-1 min-w-0">
                                {objectiveStatus === 'fulfilled' && (
                                  <CheckCircle2 className="h-4 w-4 text-green-600 flex-shrink-0" />
                                )}
                                {objectiveStatus === 'exceeded' && (
                                  <XCircle className="h-4 w-4 text-red-600 flex-shrink-0" />
                                )}
                                {objectiveStatus === 'below' && (
                                  <TrendingDown className="h-4 w-4 text-yellow-600 flex-shrink-0" />
                                )}
                                {showWarning && !objectiveStatus && (
                                  <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                                )}
                                <span
                                  className={`truncate ${cell.bold ? 'font-semibold' : ''} ${
                                    objectiveStatus === 'exceeded' || showWarning ? 'text-red-700 font-semibold' : ''
                                  } ${objectiveStatus === 'fulfilled' ? 'text-green-700 font-semibold' : ''} ${
                                    objectiveStatus === 'below' ? 'text-yellow-700' : ''
                                  }`}
                                  style={{
                                    backgroundColor: cell.backgroundColor,
                                    fontStyle: cell.italic ? 'italic' : 'normal',
                                    textDecoration: cell.underline ? 'underline' : 'none',
                                  }}
                                >
                                  {cell.value}
                                </span>
                              </div>
                              {!isHeaderRow && !isEditableGoal && (
                                <div className="flex items-center gap-1 opacity-0 transition group-hover:opacity-100">
                                  <button
                                    className="rounded p-1 text-sky-600 transition hover:bg-sky-100"
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleAddSession(column);
                                    }}
                                  >
                                    <Plus className="h-3 w-3" />
                                  </button>
                                  <button
                                    className="rounded p-1 text-emerald-600 transition hover:bg-emerald-100"
                                    type="button"
                                    onClick={(event) => {
                                      event.stopPropagation();
                                      handleAddExercise(cellId);
                                    }}
                                  >
                                    <Dumbbell className="h-3 w-3" />
                                  </button>
                                </div>
                              )}
                              {isEditableGoal && (
                                <span className="text-xs text-blue-600 opacity-0 transition group-hover:opacity-100">
                                  Doble clic para editar
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex items-center justify-between text-xs text-slate-500">
              <div className="flex flex-wrap items-center gap-4">
                <span>Filas: {currentSheet.data.length}</span>
                <span>Columnas: {currentSheet.columns.length}</span>
                {selectedCell && <span>Celda: {selectedCell}</span>}
                {selectedRows.length > 0 && <span>Seleccionadas: {selectedRows.length}</span>}
                {sortColumn && <span>Ordenado por: {sortColumn.toUpperCase()} ({sortDirection})</span>}
                {calculateRangeStatistics && (
                  <span>
                    Selección: {calculateRangeStatistics.totalCells} celdas · Volumen {calculateRangeStatistics.totalVolume} · Duración {calculateRangeStatistics.totalDuration} min · RPE{' '}
                    {calculateRangeStatistics.averageRPE ? calculateRangeStatistics.averageRPE.toFixed(1) : '—'}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <span>Zoom 100%</span>
                  <button className="rounded p-1 transition hover:bg-slate-200" type="button">
                    <ZoomIn className="h-3 w-3" />
                  </button>
                  <button className="rounded p-1 transition hover:bg-slate-200" type="button">
                    <ZoomOut className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex items-center gap-1">
                  <span>Estado: listo</span>
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {showContextMenu && (
          <div
            className="fixed z-50 w-48 rounded-lg border border-slate-200 bg-white py-2 text-xs shadow-lg"
            style={{ left: showContextMenu.x, top: showContextMenu.y }}
            onClick={() => setShowContextMenu(null)}
          >
            <div className="px-3 py-2 font-semibold text-slate-600">Acciones</div>
            <div className="border-t border-slate-100" />
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-left transition hover:bg-slate-100"
              type="button"
              onClick={() => {
                if (showContextMenu.row !== undefined) {
                  handleAddRow('bottom');
                }
                setShowContextMenu(null);
              }}
            >
              <Rows className="h-4 w-4" /> Añadir fila abajo
            </button>
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-left transition hover:bg-slate-100"
              type="button"
              onClick={() => {
                if (showContextMenu.row !== undefined) {
                  handleAddRow('top');
                }
                setShowContextMenu(null);
              }}
            >
              <Rows className="h-4 w-4" /> Añadir fila arriba
            </button>
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-left transition hover:bg-slate-100"
              type="button"
              onClick={() => {
                handleAddColumn('right');
                setShowContextMenu(null);
              }}
            >
              <Columns className="h-4 w-4" /> Añadir columna
            </button>
            <div className="border-t border-slate-100" />
            <button
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-red-600 transition hover:bg-red-50"
              type="button"
              onClick={() => {
                if (showContextMenu.row !== undefined) {
                  handleDeleteRow(showContextMenu.row);
                }
                setShowContextMenu(null);
              }}
            >
              <Trash2 className="h-4 w-4" /> Eliminar fila
            </button>
          </div>
        )}
      </div>

      {/* Modal de cuestionario de preferencias */}
      <CoachPreferencesQuestionnaire
        isOpen={showQuestionnaire}
        onClose={() => setShowQuestionnaire(false)}
        onSave={handlePreferencesSaved}
      />

      {/* Panel derecho con tablas dinámicas y resúmenes */}
      {showRightPanel && selectedRange && calculateRangeStatistics && (
        <div className="fixed right-0 top-0 h-full w-96 bg-white border-l border-slate-200 shadow-xl z-50 overflow-y-auto">
          <div className="p-4 border-b border-slate-200 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Table2 className="h-5 w-5" />
                <h3 className="text-lg font-bold">Resumen del Rango</h3>
              </div>
              <button
                onClick={() => setShowRightPanel(false)}
                className="rounded p-1 hover:bg-white/20 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <p className="text-sm text-blue-100 mt-1">
              Rango: {selectedRange.start} - {selectedRange.end}
            </p>
          </div>

          <div className="p-4 space-y-6">
            {/* Estadísticas generales */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Estadísticas Generales
              </h4>
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-600">Total Celdas</div>
                  <div className="text-2xl font-bold text-slate-900">{calculateRangeStatistics.totalCells}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-600">Volumen Total</div>
                  <div className="text-2xl font-bold text-slate-900">{calculateRangeStatistics.totalVolume}</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-600">Duración Total</div>
                  <div className="text-2xl font-bold text-slate-900">{calculateRangeStatistics.totalDuration} min</div>
                </div>
                <div className="bg-slate-50 rounded-lg p-3">
                  <div className="text-xs text-slate-600">Calorías Totales</div>
                  <div className="text-2xl font-bold text-slate-900">{calculateRangeStatistics.totalCalories}</div>
                </div>
              </div>
            </div>

            {/* RPE Promedio */}
            {calculateRangeStatistics.averageRPE > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                  <TrendingUp className="h-4 w-4" />
                  Intensidad
                </h4>
                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <div className="text-sm text-slate-600 mb-1">RPE Promedio</div>
                  <div className="text-3xl font-bold text-purple-700">
                    {calculateRangeStatistics.averageRPE.toFixed(1)}
                    <span className="text-lg text-slate-500">/10</span>
                  </div>
                  <div className="text-xs text-slate-500 mt-2">
                    Basado en {calculateRangeStatistics.intensityValues.length} sesiones
                  </div>
                </div>
              </div>
            )}

            {/* Volumen por Grupo Muscular */}
            {Object.keys(calculateRangeStatistics.volumeByMuscleGroup).length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Dumbbell className="h-4 w-4" />
                  Volumen por Grupo Muscular
                </h4>
                <div className="space-y-2">
                  {Object.entries(calculateRangeStatistics.volumeByMuscleGroup)
                    .sort(([, a], [, b]) => b - a)
                    .map(([grupo, volumen]) => (
                      <div key={grupo} className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                        <span className="text-sm font-medium text-slate-700 capitalize">{grupo}</span>
                        <span className="text-sm font-bold text-slate-900">{volumen} sesiones</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Sesiones por Día */}
            {Object.keys(calculateRangeStatistics.sessionsByDay).length > 0 && (
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Sesiones por Día
                </h4>
                <div className="space-y-2">
                  {Object.entries(calculateRangeStatistics.sessionsByDay)
                    .sort(([a], [b]) => weekDays.indexOf(a as any) - weekDays.indexOf(b as any))
                    .map(([dia, sesiones]) => (
                      <div key={dia} className="flex items-center justify-between bg-slate-50 rounded-lg p-3">
                        <span className="text-sm font-medium text-slate-700">{dia}</span>
                        <span className="text-sm font-bold text-slate-900">{sesiones} sesiones</span>
                      </div>
                    ))}
                </div>
              </div>
            )}

            {/* Tabla Pivote - Resumen por Modalidad */}
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                <PieChart className="h-4 w-4" />
                Resumen por Modalidad
              </h4>
              <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                {Object.entries(
                  weekDays.reduce((acc, day) => {
                    const plan = weeklyPlan[day];
                    plan?.sessions.forEach(session => {
                      acc[session.modality] = (acc[session.modality] || 0) + 1;
                    });
                    return acc;
                  }, {} as Record<string, number>)
                )
                  .sort(([, a], [, b]) => b - a)
                  .map(([modalidad, count]) => (
                    <div key={modalidad} className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">{modalidad}</span>
                      <span className="text-sm font-bold text-slate-900">{count}</span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Panel de Análisis de IA */}
            {selectedRange && (() => {
              // Convertir rango seleccionado a formato SelectedCell
              const [startRow, startCol] = selectedRange.start.split('-').map((v, i) => i === 0 ? Number(v) : v);
              const [endRow, endCol] = selectedRange.end.split('-').map((v, i) => i === 0 ? Number(v) : v);
              const minRow = Math.min(startRow, endRow);
              const maxRow = Math.max(startRow, endRow);
              const minCol = startCol < endCol ? startCol : endCol;
              const maxCol = startCol > endCol ? startCol : endCol;

              const selectedCells: Array<{
                cellId: string;
                column: string;
                row: number;
                value: string | number;
                day?: string;
                sessionId?: string;
                metadata?: {
                  type: 'volume' | 'intensity' | 'duration' | 'series' | 'repetitions' | 'calories' | 'other';
                  grupoMuscular?: string;
                  ejercicio?: string;
                };
              }> = [];

              for (let row = minRow; row <= maxRow; row++) {
                for (let col = minCol.charCodeAt(0); col <= maxCol.charCodeAt(0); col++) {
                  const column = String.fromCharCode(col);
                  const cellId = `${row}-${column}`;
                  const cell = currentSheet?.data[row]?.[column];
                  
                  if (cell && row > 0 && row <= weekDays.length) {
                    const day = weekDays[row - 1];
                    const dayPlan = weeklyPlan[day];
                    
                    // Determinar tipo de celda según columna
                    let metadataType: 'volume' | 'intensity' | 'duration' | 'series' | 'repetitions' | 'calories' | 'other' = 'other';
                    if (column === 'D') metadataType = 'volume';
                    else if (column === 'E') metadataType = 'intensity';
                    else if (column === 'F') metadataType = 'duration';
                    else if (column === 'G') metadataType = 'calories';

                    // Obtener grupos musculares de las sesiones del día
                    const gruposMusculares = new Set<string>();
                    dayPlan?.sessions.forEach(session => {
                      if (session.gruposMusculares) {
                        session.gruposMusculares.forEach(grupo => gruposMusculares.add(grupo));
                      }
                    });

                    selectedCells.push({
                      cellId,
                      column,
                      row,
                      value: cell.value,
                      day,
                      metadata: {
                        type: metadataType,
                        grupoMuscular: gruposMusculares.size > 0 ? Array.from(gruposMusculares)[0] : undefined,
                      },
                    });
                  }
                }
              }

              return (
                <div className="mt-6">
                  <AIAnalysisPanel
                    selectedCells={selectedCells}
                    weeklyPlan={weeklyPlan}
                    weekDays={weekDays}
                    contextoCliente={contextoCliente}
                    objetivosProgreso={objetivosProgreso}
                    onApplySuggestion={(suggestionId, action) => {
                      console.log('Aplicar sugerencia:', suggestionId, action);
                      // Aquí se implementaría la lógica para aplicar la sugerencia
                    }}
                  />
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

