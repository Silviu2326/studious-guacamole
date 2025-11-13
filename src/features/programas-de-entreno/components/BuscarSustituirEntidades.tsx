import { useState, useMemo } from 'react';
import { Modal } from '../../../components/componentsreutilizables/Modal';
import { Button } from '../../../components/componentsreutilizables/Button';
import { Input } from '../../../components/componentsreutilizables/Input';
import { Card } from '../../../components/componentsreutilizables/Card';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import {
  Search,
  Replace,
  Dumbbell,
  Layers,
  Calendar,
  Tag,
  FileText,
  Check,
  X,
  AlertCircle,
} from 'lucide-react';
import type { DayPlan, DaySession } from '../types';

type DayKey = 'Lunes' | 'Martes' | 'Miércoles' | 'Jueves' | 'Viernes' | 'Sábado' | 'Domingo';

interface BuscarSustituirEntidadesProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  weeklyPlan: Record<DayKey, DayPlan>;
  weekDays: DayKey[];
  onReplace: (replacements: Replacement[]) => void;
}

type TipoEntidad = 'ejercicio' | 'bloque' | 'sesion' | 'tag' | 'nota';

interface EntidadEncontrada {
  id: string;
  tipo: TipoEntidad;
  dia: DayKey;
  sessionId?: string;
  ejercicioId?: string;
  valorOriginal: string;
  contexto: string;
  ubicacion: string;
}

interface Replacement {
  id: string;
  tipo: TipoEntidad;
  dia: DayKey;
  sessionId?: string;
  ejercicioId?: string;
  valorNuevo: string;
}

export function BuscarSustituirEntidades({
  open,
  onOpenChange,
  weeklyPlan,
  weekDays,
  onReplace,
}: BuscarSustituirEntidadesProps) {
  const [busqueda, setBusqueda] = useState('');
  const [reemplazo, setReemplazo] = useState('');
  const [tipoFiltro, setTipoFiltro] = useState<TipoEntidad | 'todos'>('todos');
  const [entidadesSeleccionadas, setEntidadesSeleccionadas] = useState<Set<string>>(new Set());
  const [modoVista, setModoVista] = useState<'buscar' | 'reemplazar'>('buscar');

  const entidadesEncontradas = useMemo(() => {
    if (!busqueda.trim()) return [];

    const busquedaLower = busqueda.toLowerCase();
    const entidades: EntidadEncontrada[] = [];

    weekDays.forEach((day) => {
      const dayPlan = weeklyPlan[day];
      dayPlan.sessions.forEach((session) => {
        // Buscar en nombre del bloque
        if (
          (tipoFiltro === 'todos' || tipoFiltro === 'bloque') &&
          session.block.toLowerCase().includes(busquedaLower)
        ) {
          entidades.push({
            id: `bloque-${day}-${session.id}`,
            tipo: 'bloque',
            dia: day,
            sessionId: session.id,
            valorOriginal: session.block,
            contexto: `${day} - ${session.modality} - ${session.duration}`,
            ubicacion: `Bloque: ${session.block}`,
          });
        }

        // Buscar en modalidad
        if (
          (tipoFiltro === 'todos' || tipoFiltro === 'tag') &&
          session.modality.toLowerCase().includes(busquedaLower)
        ) {
          entidades.push({
            id: `modality-${day}-${session.id}`,
            tipo: 'tag',
            dia: day,
            sessionId: session.id,
            valorOriginal: session.modality,
            contexto: `${day} - ${session.block} - ${session.duration}`,
            ubicacion: `Modalidad: ${session.modality}`,
          });
        }

        // Buscar en intensidad
        if (
          (tipoFiltro === 'todos' || tipoFiltro === 'tag') &&
          session.intensity.toLowerCase().includes(busquedaLower)
        ) {
          entidades.push({
            id: `intensity-${day}-${session.id}`,
            tipo: 'tag',
            dia: day,
            sessionId: session.id,
            valorOriginal: session.intensity,
            contexto: `${day} - ${session.block} - ${session.modality}`,
            ubicacion: `Intensidad: ${session.intensity}`,
          });
        }

        // Buscar en notas
        if (
          (tipoFiltro === 'todos' || tipoFiltro === 'nota') &&
          session.notes &&
          session.notes.toLowerCase().includes(busquedaLower)
        ) {
          entidades.push({
            id: `nota-${day}-${session.id}`,
            tipo: 'nota',
            dia: day,
            sessionId: session.id,
            valorOriginal: session.notes,
            contexto: `${day} - ${session.block}`,
            ubicacion: `Notas: ${session.notes.substring(0, 50)}${session.notes.length > 50 ? '...' : ''}`,
          });
        }

        // Buscar en tiempo
        if (
          (tipoFiltro === 'todos' || tipoFiltro === 'tag') &&
          session.time &&
          session.time.toLowerCase().includes(busquedaLower)
        ) {
          entidades.push({
            id: `time-${day}-${session.id}`,
            tipo: 'tag',
            dia: day,
            sessionId: session.id,
            valorOriginal: session.time,
            contexto: `${day} - ${session.block}`,
            ubicacion: `Hora: ${session.time}`,
          });
        }
      });

      // Buscar en focus del día
      if (
        (tipoFiltro === 'todos' || tipoFiltro === 'tag') &&
        dayPlan.focus.toLowerCase().includes(busquedaLower)
      ) {
        entidades.push({
          id: `focus-${day}`,
          tipo: 'tag',
          dia: day,
          valorOriginal: dayPlan.focus,
          contexto: `${day} - ${dayPlan.volume} - ${dayPlan.intensity}`,
          ubicacion: `Foco del día: ${dayPlan.focus}`,
        });
      }

      // Buscar en volumen
      if (
        (tipoFiltro === 'todos' || tipoFiltro === 'tag') &&
        dayPlan.volume.toLowerCase().includes(busquedaLower)
      ) {
        entidades.push({
          id: `volume-${day}`,
          tipo: 'tag',
          dia: day,
          valorOriginal: dayPlan.volume,
          contexto: `${day} - ${dayPlan.focus} - ${dayPlan.intensity}`,
          ubicacion: `Volumen: ${dayPlan.volume}`,
        });
      }

      // Buscar en intensidad del día
      if (
        (tipoFiltro === 'todos' || tipoFiltro === 'tag') &&
        dayPlan.intensity.toLowerCase().includes(busquedaLower)
      ) {
        entidades.push({
          id: `day-intensity-${day}`,
          tipo: 'tag',
          dia: day,
          valorOriginal: dayPlan.intensity,
          contexto: `${day} - ${dayPlan.focus} - ${dayPlan.volume}`,
          ubicacion: `Intensidad del día: ${dayPlan.intensity}`,
        });
      }

      // Buscar en microciclo
      if (
        (tipoFiltro === 'todos' || tipoFiltro === 'tag') &&
        dayPlan.microCycle.toLowerCase().includes(busquedaLower)
      ) {
        entidades.push({
          id: `microcycle-${day}`,
          tipo: 'tag',
          dia: day,
          valorOriginal: dayPlan.microCycle,
          contexto: `${day} - ${dayPlan.focus}`,
          ubicacion: `Microciclo: ${dayPlan.microCycle}`,
        });
      }

      // Buscar en summary
      if (tipoFiltro === 'todos' || tipoFiltro === 'nota') {
        dayPlan.summary.forEach((summaryItem, index) => {
          if (summaryItem.toLowerCase().includes(busquedaLower)) {
            entidades.push({
              id: `summary-${day}-${index}`,
              tipo: 'nota',
              dia: day,
              valorOriginal: summaryItem,
              contexto: `${day} - Resumen del día`,
              ubicacion: `Resumen: ${summaryItem.substring(0, 50)}${summaryItem.length > 50 ? '...' : ''}`,
            });
          }
        });
      }
    });

    return entidades;
  }, [busqueda, tipoFiltro, weeklyPlan, weekDays]);

  const toggleEntidad = (entidadId: string) => {
    const nuevos = new Set(entidadesSeleccionadas);
    if (nuevos.has(entidadId)) {
      nuevos.delete(entidadId);
    } else {
      nuevos.add(entidadId);
    }
    setEntidadesSeleccionadas(nuevos);
  };

  const seleccionarTodos = () => {
    if (entidadesSeleccionadas.size === entidadesEncontradas.length) {
      setEntidadesSeleccionadas(new Set());
    } else {
      setEntidadesSeleccionadas(new Set(entidadesEncontradas.map((e) => e.id)));
    }
  };

  const getTipoIcon = (tipo: TipoEntidad) => {
    switch (tipo) {
      case 'ejercicio':
        return <Dumbbell className="w-4 h-4" />;
      case 'bloque':
        return <Layers className="w-4 h-4" />;
      case 'sesion':
        return <Calendar className="w-4 h-4" />;
      case 'tag':
        return <Tag className="w-4 h-4" />;
      case 'nota':
        return <FileText className="w-4 h-4" />;
    }
  };

  const getTipoColor = (tipo: TipoEntidad) => {
    switch (tipo) {
      case 'ejercicio':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400';
      case 'bloque':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400';
      case 'sesion':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400';
      case 'tag':
        return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400';
      case 'nota':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
    }
  };

  const handleReemplazar = () => {
    if (!reemplazo.trim()) {
      alert('Por favor ingresa el valor de reemplazo');
      return;
    }

    if (entidadesSeleccionadas.size === 0) {
      alert('Por favor selecciona al menos una entidad para reemplazar');
      return;
    }

    const replacements: Replacement[] = entidadesEncontradas
      .filter((e) => entidadesSeleccionadas.has(e.id))
      .map((e) => ({
        id: e.id,
        tipo: e.tipo,
        dia: e.dia,
        sessionId: e.sessionId,
        ejercicioId: e.ejercicioId,
        valorNuevo: reemplazo,
      }));

    onReplace(replacements);
    alert(`Se reemplazarán ${replacements.length} entidad(es)`);
    onOpenChange(false);
  };

  const resaltarTexto = (texto: string, busqueda: string) => {
    if (!busqueda.trim()) return texto;

    const partes = texto.split(new RegExp(`(${busqueda})`, 'gi'));
    return partes.map((parte, index) =>
      parte.toLowerCase() === busqueda.toLowerCase() ? (
        <mark key={index} className="bg-yellow-200 dark:bg-yellow-900/50">
          {parte}
        </mark>
      ) : (
        parte
      )
    );
  };

  return (
    <Modal
      isOpen={open}
      onClose={() => onOpenChange(false)}
      title="Buscar y Sustituir Entidades"
      size="xl"
    >
      <div className="space-y-6">
        {/* Barra de búsqueda y reemplazo */}
        <Card className="p-4">
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                label="Buscar"
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
                placeholder="Buscar en ejercicios, bloques, sesiones, tags, notas..."
                leftIcon={<Search className="w-4 h-4" />}
                className="flex-1"
              />
              <Input
                label="Reemplazar con"
                value={reemplazo}
                onChange={(e) => setReemplazo(e.target.value)}
                placeholder="Nuevo valor..."
                leftIcon={<Replace className="w-4 h-4" />}
                className="flex-1"
              />
            </div>

            {/* Filtros de tipo */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setTipoFiltro('todos')}
                className={`px-3 py-1 rounded-lg text-sm transition ${
                  tipoFiltro === 'todos'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setTipoFiltro('ejercicio')}
                className={`px-3 py-1 rounded-lg text-sm transition flex items-center gap-1 ${
                  tipoFiltro === 'ejercicio'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Dumbbell className="w-3 h-3" />
                Ejercicios
              </button>
              <button
                onClick={() => setTipoFiltro('bloque')}
                className={`px-3 py-1 rounded-lg text-sm transition flex items-center gap-1 ${
                  tipoFiltro === 'bloque'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Layers className="w-3 h-3" />
                Bloques
              </button>
              <button
                onClick={() => setTipoFiltro('sesion')}
                className={`px-3 py-1 rounded-lg text-sm transition flex items-center gap-1 ${
                  tipoFiltro === 'sesion'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Calendar className="w-3 h-3" />
                Sesiones
              </button>
              <button
                onClick={() => setTipoFiltro('tag')}
                className={`px-3 py-1 rounded-lg text-sm transition flex items-center gap-1 ${
                  tipoFiltro === 'tag'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <Tag className="w-3 h-3" />
                Tags
              </button>
              <button
                onClick={() => setTipoFiltro('nota')}
                className={`px-3 py-1 rounded-lg text-sm transition flex items-center gap-1 ${
                  tipoFiltro === 'nota'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                <FileText className="w-3 h-3" />
                Notas
              </button>
            </div>
          </div>
        </Card>

        {/* Resultados */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
              Resultados ({entidadesEncontradas.length} encontradas, {entidadesSeleccionadas.size}{' '}
              seleccionadas)
            </h3>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" onClick={seleccionarTodos}>
                {entidadesSeleccionadas.size === entidadesEncontradas.length
                  ? 'Deseleccionar todos'
                  : 'Seleccionar todos'}
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleReemplazar}
                disabled={entidadesSeleccionadas.size === 0 || !reemplazo.trim()}
                iconLeft={Replace}
              >
                Reemplazar {entidadesSeleccionadas.size > 0 ? `${entidadesSeleccionadas.size} elemento(s)` : 'Seleccionadas'}
              </Button>
            </div>
          </div>

          {/* Resumen de selección por día */}
          {entidadesSeleccionadas.size > 0 && (
            <div className="mb-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 p-3">
              <p className="text-xs font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Selección actual:
              </p>
              <div className="flex flex-wrap gap-2">
                {Array.from(new Set(entidadesEncontradas.filter(e => entidadesSeleccionadas.has(e.id)).map(e => e.dia))).map((dia) => {
                  const count = entidadesEncontradas.filter(e => entidadesSeleccionadas.has(e.id) && e.dia === dia).length;
                  return (
                    <Badge key={dia} variant="outline" className="bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                      {dia}: {count}
                    </Badge>
                  );
                })}
              </div>
            </div>
          )}

          {!busqueda.trim() ? (
            <div className="text-center py-8 text-gray-500">
              <Search className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>Ingresa un término de búsqueda para comenzar</p>
            </div>
          ) : entidadesEncontradas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <AlertCircle className="w-12 h-12 mx-auto mb-2 text-gray-400" />
              <p>No se encontraron coincidencias</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {/* Agrupar por día para mejor visualización */}
              {Array.from(new Set(entidadesEncontradas.map(e => e.dia))).map((dia) => {
                const entidadesDelDia = entidadesEncontradas.filter(e => e.dia === dia);
                const seleccionadasDelDia = entidadesDelDia.filter(e => entidadesSeleccionadas.has(e.id)).length;
                
                return (
                  <div key={dia} className="space-y-2">
                    <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-1">
                      <h4 className="text-xs font-semibold uppercase tracking-wide text-gray-600 dark:text-gray-400">
                        {dia}
                      </h4>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">
                          {seleccionadasDelDia}/{entidadesDelDia.length} seleccionadas
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const todasSeleccionadas = entidadesDelDia.every(e => entidadesSeleccionadas.has(e.id));
                            const nuevas = new Set(entidadesSeleccionadas);
                            entidadesDelDia.forEach(e => {
                              if (todasSeleccionadas) {
                                nuevas.delete(e.id);
                              } else {
                                nuevas.add(e.id);
                              }
                            });
                            setEntidadesSeleccionadas(nuevas);
                          }}
                          className="text-xs text-blue-600 hover:text-blue-700 dark:text-blue-400 px-2 py-0.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/20"
                        >
                          {seleccionadasDelDia === entidadesDelDia.length ? 'Deseleccionar día' : 'Seleccionar día'}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2 pl-2">
                      {entidadesDelDia.map((entidad) => {
                        const seleccionada = entidadesSeleccionadas.has(entidad.id);
                        return (
                          <div
                            key={entidad.id}
                            onClick={() => toggleEntidad(entidad.id)}
                            className={`p-3 rounded-lg border cursor-pointer transition ${
                              seleccionada
                                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                            }`}
                          >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center mt-0.5 ${
                          seleccionada
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`}
                      >
                        {seleccionada && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge
                            variant="outline"
                            className={`${getTipoColor(entidad.tipo)} flex items-center gap-1`}
                          >
                            {getTipoIcon(entidad.tipo)}
                            {entidad.tipo}
                          </Badge>
                          <span className="text-xs font-medium text-gray-600 dark:text-gray-400">
                            {entidad.dia}
                          </span>
                        </div>
                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-1">
                          {resaltarTexto(entidad.ubicacion, busqueda)}
                        </div>
                        <div className="text-xs text-gray-600 dark:text-gray-400">
                          {entidad.contexto}
                        </div>
                        <div className="mt-2 text-sm">
                          <span className="text-gray-500 dark:text-gray-400">Valor: </span>
                          <span className="font-mono bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                            {resaltarTexto(entidad.valorOriginal, busqueda)}
                          </span>
                          {reemplazo && (
                            <>
                              <span className="mx-2 text-gray-400">→</span>
                              <span className="font-mono bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-0.5 rounded">
                                {reemplazo}
                              </span>
                            </>
                          )}
                          </div>
                        </div>
                      </div>
                    </div>
                      );
                    })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </Modal>
  );
}

