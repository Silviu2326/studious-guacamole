import { useCallback, useMemo, useState } from 'react';
import {
  BarChart3,
  Calculator,
  Check,
  Clipboard,
  Columns,
  Copy,
  Download,
  Dumbbell,
  Filter,
  FileSpreadsheet,
  LineChart,
  PieChart,
  Plus,
  Redo,
  Rows,
  Save,
  Scissors,
  Search,
  Settings,
  SortAsc,
  SortDesc,
  Trash2,
  Undo,
  X,
  ZoomIn,
  ZoomOut,
} from 'lucide-react';
import { Button, Input } from '../../../components/componentsreutilizables';
import type { DayPlan } from '../types';

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
};

const EXCEL_ROW_OFFSET = 2;

const parseFirstNumber = (value: string) => {
  const match = value.match(/\d+(?:[.,]\d+)?/);
  return match ? Number(match[0].replace(',', '.')) : null;
};

export function ExcelSummaryView({ weekDays, weeklyPlan }: ExcelSummaryViewProps) {
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
  const [sortColumn, setSortColumn] = useState<string>('A');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [showContextMenu, setShowContextMenu] = useState<{ x: number; y: number; row?: number } | null>(null);

  const sheets = useMemo<ExcelSheet[]>(() => {
    const summaryHeader: ExcelRow = {
      A: { value: 'DÍA', bold: true, backgroundColor: '#f3f4f6' },
      B: { value: 'SESIÓN', bold: true, backgroundColor: '#f3f4f6' },
      C: { value: 'EJERCICIOS', bold: true, backgroundColor: '#f3f4f6' },
      D: { value: 'VOLUMEN', bold: true, backgroundColor: '#f3f4f6' },
      E: { value: 'INTENSIDAD', bold: true, backgroundColor: '#f3f4f6' },
      F: { value: 'DURACIÓN', bold: true, backgroundColor: '#f3f4f6' },
      G: { value: 'CALORÍAS', bold: true, backgroundColor: '#f3f4f6' },
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

      summaryRows.push({
        A: { value: day, bold: true },
        B: { value: sessions.length },
        C: { value: totalExercises },
        D: { value: totalVolume },
        E: { value: intensityValue ?? '—' },
        F: { value: totalMinutes },
        G: { value: calories },
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

    return [
      {
        name: 'Resumen semanal',
        columns: ['A', 'B', 'C', 'D', 'E', 'F', 'G'],
        data: summaryRows,
      },
      {
        name: 'Detalle sesiones',
        columns: ['A', 'B', 'C', 'D', 'E', 'F'],
        data: detailRows,
      },
    ];
  }, [weekDays, weeklyPlan]);

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

  const handleCellClick = (cellId: string) => {
    setSelectedCell(cellId);
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
    <div className="space-y-6 font-sans text-slate-700 dark:text-slate-200">
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div>
          <h3 className="text-base font-semibold text-slate-900 dark:text-slate-100">Resumen semanal · Vista Excel</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Replica el formato de una hoja de cálculo: selecciona filas, revisa totales y exporta los datos.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="primary" size="sm" leftIcon={<FileSpreadsheet className="h-4 w-4" />}>
            Exportar .xlsx
          </Button>
          <Button variant="secondary" size="sm">
            Importar
          </Button>
          <Button variant="ghost" size="sm">
            Compartir vista
          </Button>
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="border-b border-slate-200 bg-gradient-to-r from-emerald-600 to-sky-600 px-6 py-4 text-white">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <FileSpreadsheet className="h-6 w-6 text-white" />
              <div>
                <h2 className="text-lg font-bold">Planificación semanal</h2>
                <p className="text-sm text-emerald-100">Vista estilo Excel para controlar sesiones y cargas</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button className="rounded-lg bg-white/20 px-3 py-2 text-white transition hover:bg-white/30" type="button">
                <Save className="h-4 w-4" />
              </button>
              <button className="rounded-lg bg-white/20 px-3 py-2 text-white transition hover:bg-white/30" type="button">
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-b border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1">
              <button className="rounded p-2 transition hover:bg-slate-200" type="button">
                <Undo className="h-4 w-4" />
              </button>
              <button className="rounded p-2 transition hover:bg-slate-200" type="button">
                <Redo className="h-4 w-4" />
              </button>
            </div>
            <div className="h-6 w-px bg-slate-300" />
            <div className="flex items-center gap-1">
              <button className="rounded p-2 transition hover:bg-slate-200" type="button">
                <Scissors className="h-4 w-4" />
              </button>
              <button className="rounded p-2 transition hover:bg-slate-200" type="button">
                <Copy className="h-4 w-4" />
              </button>
              <button className="rounded p-2 transition hover:bg-slate-200" type="button">
                <Clipboard className="h-4 w-4" />
              </button>
            </div>
            <div className="h-6 w-px bg-slate-300" />
            <div className="flex items-center gap-1">
              <button
                className={`rounded p-2 transition ${showAddRow ? 'bg-emerald-200 text-emerald-700' : 'hover:bg-slate-200'}`}
                type="button"
                onClick={() => setShowAddRow((prev) => !prev)}
              >
                <Rows className="h-4 w-4" />
              </button>
              <button
                className={`rounded p-2 transition ${showAddColumn ? 'bg-emerald-200 text-emerald-700' : 'hover:bg-slate-200'}`}
                type="button"
                onClick={() => setShowAddColumn((prev) => !prev)}
              >
                <Columns className="h-4 w-4" />
              </button>
              <button className="rounded p-2 transition hover:bg-slate-200" type="button">
                <Trash2 className="h-4 w-4 text-red-600" />
              </button>
            </div>
            <div className="h-6 w-px bg-slate-300" />
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 rounded border border-slate-300 bg-white px-2">
                <Search className="h-4 w-4 text-slate-500" />
                <input
                  className="h-7 bg-transparent text-xs focus:outline-none"
                  placeholder="Buscar..."
                  value={searchTerm}
                  onChange={(event) => setSearchTerm(event.target.value)}
                />
              </div>
              <button
                className={`rounded p-2 transition ${showFilters ? 'bg-emerald-200 text-emerald-700' : 'hover:bg-slate-200'}`}
                type="button"
                onClick={() => setShowFilters((prev) => !prev)}
              >
                <Filter className="h-4 w-4" />
              </button>
            </div>
            <div className="h-6 w-px bg-slate-300" />
            <div className="flex items-center gap-1">
              <button className="rounded p-2 transition hover:bg-slate-200" type="button" onClick={() => setSortColumn('A')}>
                <SortAsc className="h-4 w-4" />
              </button>
              <button
                className="rounded p-2 transition hover:bg-slate-200"
                type="button"
                onClick={() => {
                  setSortColumn('A');
                  setSortDirection((prev) => (prev === 'asc' ? 'desc' : 'asc'));
                }}
              >
                <SortDesc className="h-4 w-4" />
              </button>
            </div>
            <div className="h-6 w-px bg-slate-300" />
            <div className="flex items-center gap-1">
              <button
                className={`rounded p-2 transition ${showFormulaBar ? 'bg-sky-200 text-sky-700' : 'hover:bg-slate-200'}`}
                type="button"
                onClick={() => setShowFormulaBar((prev) => !prev)}
              >
                <Calculator className="h-4 w-4" />
              </button>
              <button
                className={`rounded p-2 transition ${showCharts ? 'bg-purple-200 text-purple-700' : 'hover:bg-slate-200'}`}
                type="button"
                onClick={() => setShowCharts((prev) => !prev)}
              >
                <BarChart3 className="h-4 w-4" />
              </button>
            </div>
            <div className="h-6 w-px bg-slate-300" />
            <div className="flex items-center gap-1">
              <button className="rounded p-2 transition hover:bg-slate-200" type="button">
                <ZoomIn className="h-4 w-4" />
              </button>
              <button className="rounded p-2 transition hover:bg-slate-200" type="button">
                <ZoomOut className="h-4 w-4" />
              </button>
              <button className="rounded p-2 transition hover:bg-slate-200" type="button">
                <Settings className="h-4 w-4" />
              </button>
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

                      return (
                        <div
                          key={column}
                          className={`group relative min-w-[96px] flex-1 cursor-pointer border-r border-slate-200 px-3 py-2 text-sm transition ${
                            isHeaderRow ? 'bg-slate-100 font-semibold' : 'bg-white'
                          } ${isSelected ? 'bg-sky-100 ring-1 ring-sky-300' : ''}`}
                          onClick={() => handleCellClick(cellId)}
                          onDoubleClick={() => handleCellEdit(cellId)}
                        >
                          {isEditing ? (
                            <input
                              autoFocus
                              className="w-full border-none bg-transparent text-sm focus:outline-none"
                              onBlur={handleCellSave}
                              onChange={(event) => setCellValue(event.target.value)}
                              onKeyDown={handleKeyDown}
                              value={cellValue}
                            />
                          ) : (
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`truncate ${cell.bold ? 'font-semibold' : ''}`}
                                style={{
                                  backgroundColor: cell.backgroundColor,
                                  fontStyle: cell.italic ? 'italic' : 'normal',
                                  textDecoration: cell.underline ? 'underline' : 'none',
                                }}
                              >
                                {cell.value}
                              </span>
                              {!isHeaderRow && (
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
    </div>
  );
}

