import React, { useState, useEffect } from 'react';
import { Card, Button, Input } from '../../../components/componentsreutilizables';
import { X, SlidersHorizontal, ChefHat, Clock, Filter, Bookmark, DollarSign, Leaf, CheckCircle2 } from 'lucide-react';
import { FiltrosBiblioteca, EstiloCulinario, TipoRecurso } from '../types';
import { GestionFiltrosPersonalizados } from './GestionFiltrosPersonalizados';

interface FiltrosAvanzadosBibliotecaProps {
  filtros: FiltrosBiblioteca;
  onFiltrosChange: (filtros: FiltrosBiblioteca) => void;
  onClose?: () => void;
}

const estilosCulinariosDisponibles: EstiloCulinario[] = [
  'mediterraneo',
  'asiatico',
  'mexicano',
  'italiano',
  'vegetariano',
  'vegano',
  'keto',
  'paleo',
  'low-carb',
  'alto-proteina',
  'sin-gluten',
  'sin-lactosa',
  'otro',
];

const restriccionesDisponibles = [
  'sin-gluten',
  'sin-lactosa',
  'sin-nueces',
  'sin-huevos',
  'sin-pescado',
  'sin-mariscos',
  'sin-soja',
  'sin-azucar',
  'sin-sal',
];

const tiposRecursoDisponibles: TipoRecurso[] = ['receta', 'plantilla', 'alimento', 'bloque'];

const estiloLabels: Record<EstiloCulinario, string> = {
  mediterraneo: 'Mediterráneo',
  asiatico: 'Asiático',
  mexicano: 'Mexicano',
  italiano: 'Italiano',
  vegetariano: 'Vegetariano',
  vegano: 'Vegano',
  keto: 'Keto',
  paleo: 'Paleo',
  'low-carb': 'Low Carb',
  'alto-proteina': 'Alto en Proteína',
  'sin-gluten': 'Sin Gluten',
  'sin-lactosa': 'Sin Lactosa',
  otro: 'Otro',
};

export const FiltrosAvanzadosBiblioteca: React.FC<FiltrosAvanzadosBibliotecaProps> = ({
  filtros,
  onFiltrosChange,
  onClose,
}) => {
  const [filtrosLocales, setFiltrosLocales] = useState<FiltrosBiblioteca>(filtros);
  const [mostrarFiltrosNutricionales, setMostrarFiltrosNutricionales] = useState(true);
  const [mostrarFiltrosEstilo, setMostrarFiltrosEstilo] = useState(true);
  const [mostrarFiltrosRestricciones, setMostrarFiltrosRestricciones] = useState(true);
  const [mostrarFiltrosTiempo, setMostrarFiltrosTiempo] = useState(true);
  const [mostrarFiltrosSostenibilidad, setMostrarFiltrosSostenibilidad] = useState(true);
  const [mostrarFiltrosPersonalizados, setMostrarFiltrosPersonalizados] = useState(false);

  useEffect(() => {
    setFiltrosLocales(filtros);
  }, [filtros]);

  const actualizarFiltro = <K extends keyof FiltrosBiblioteca>(
    clave: K,
    valor: FiltrosBiblioteca[K]
  ) => {
    const nuevosFiltros = { ...filtrosLocales, [clave]: valor };
    setFiltrosLocales(nuevosFiltros);
    onFiltrosChange(nuevosFiltros);
  };

  const toggleEstiloCulinario = (estilo: EstiloCulinario) => {
    const estilosActuales = filtrosLocales.estilosCulinarios || [];
    const nuevosEstilos = estilosActuales.includes(estilo)
      ? estilosActuales.filter((e) => e !== estilo)
      : [...estilosActuales, estilo];
    actualizarFiltro('estilosCulinarios', nuevosEstilos);
  };

  const toggleRestriccion = (restriccion: string) => {
    const restriccionesActuales = filtrosLocales.restricciones || [];
    const nuevasRestricciones = restriccionesActuales.includes(restriccion)
      ? restriccionesActuales.filter((r) => r !== restriccion)
      : [...restriccionesActuales, restriccion];
    actualizarFiltro('restricciones', nuevasRestricciones);
  };

  const toggleTipoRecurso = (tipo: TipoRecurso) => {
    const tiposActuales = filtrosLocales.tiposRecurso || [];
    const nuevosTipos = tiposActuales.includes(tipo)
      ? tiposActuales.filter((t) => t !== tipo)
      : [...tiposActuales, tipo];
    actualizarFiltro('tiposRecurso', nuevosTipos);
  };

  const limpiarFiltros = () => {
    const filtrosVacios: FiltrosBiblioteca = {};
    setFiltrosLocales(filtrosVacios);
    onFiltrosChange(filtrosVacios);
  };

  const contarFiltrosActivos = (): number => {
    let count = 0;
    if (filtrosLocales.caloriasMin || filtrosLocales.caloriasMax) count++;
    if (filtrosLocales.proteinasMin || filtrosLocales.proteinasMax) count++;
    if (filtrosLocales.carbohidratosMin || filtrosLocales.carbohidratosMax) count++;
    if (filtrosLocales.grasasMin || filtrosLocales.grasasMax) count++;
    if (filtrosLocales.fibraMin || filtrosLocales.fibraMax) count++;
    if (filtrosLocales.sodioMin || filtrosLocales.sodioMax) count++;
    if (filtrosLocales.estilosCulinarios && filtrosLocales.estilosCulinarios.length > 0) count++;
    if (filtrosLocales.restricciones && filtrosLocales.restricciones.length > 0) count++;
    if (filtrosLocales.tiempoPreparacionMax) count++;
    if (filtrosLocales.tiposRecurso && filtrosLocales.tiposRecurso.length > 0) count++;
    if (filtrosLocales.favoritos) count++;
    if (filtrosLocales.busqueda) count++;
    if (filtrosLocales.costeMin || filtrosLocales.costeMax) count++;
    if (filtrosLocales.huellaCarbonoMax) count++;
    if (filtrosLocales.soloCertificados) count++;
    if (filtrosLocales.soloTemporada) count++;
    return count;
  };

  const filtrosActivos = contarFiltrosActivos();

  return (
    <Card className="border border-slate-200/70 bg-white/95 p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-5 w-5 text-indigo-500" />
          <h3 className="text-sm font-semibold text-slate-900">Filtros avanzados</h3>
          {filtrosActivos > 0 && (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-indigo-100 text-xs font-semibold text-indigo-600">
              {filtrosActivos}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMostrarFiltrosPersonalizados(!mostrarFiltrosPersonalizados)}
            className="text-xs"
            leftIcon={<Bookmark className="h-3 w-3" />}
          >
            Filtros guardados
          </Button>
          {filtrosActivos > 0 && (
            <Button variant="ghost" size="sm" onClick={limpiarFiltros} className="text-xs">
              Limpiar
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="flex h-6 w-6 items-center justify-center p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Panel de filtros personalizados */}
      {mostrarFiltrosPersonalizados && (
        <div className="mb-4 pb-4 border-b border-slate-200">
          <GestionFiltrosPersonalizados
            filtrosActuales={filtros}
            onAplicarFiltros={onFiltrosChange}
          />
        </div>
      )}

      <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
        {/* Búsqueda por texto */}
        <div>
          <label className="mb-2 block text-xs font-medium text-slate-700">Búsqueda</label>
          <Input
            type="text"
            placeholder="Buscar por nombre..."
            value={filtrosLocales.busqueda || ''}
            onChange={(e) => actualizarFiltro('busqueda', e.target.value || undefined)}
            className="text-sm"
          />
        </div>

        {/* Tipos de recurso */}
        <div>
          <label className="mb-2 block text-xs font-medium text-slate-700">Tipo de recurso</label>
          <div className="flex flex-wrap gap-2">
            {tiposRecursoDisponibles.map((tipo) => {
              const activo = filtrosLocales.tiposRecurso?.includes(tipo);
              return (
                <button
                  key={tipo}
                  onClick={() => toggleTipoRecurso(tipo)}
                  className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                    activo
                      ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {tipo.charAt(0).toUpperCase() + tipo.slice(1)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Valores nutricionales */}
        <div>
          <button
            onClick={() => setMostrarFiltrosNutricionales(!mostrarFiltrosNutricionales)}
            className="mb-2 flex w-full items-center justify-between text-xs font-medium text-slate-700"
          >
            <span>Valores nutricionales</span>
            <span className={mostrarFiltrosNutricionales ? 'rotate-180' : ''}>▼</span>
          </button>
          {mostrarFiltrosNutricionales && (
            <div className="space-y-3 rounded-lg bg-slate-50 p-3">
              {/* Calorías */}
              <div>
                <label className="mb-1 block text-xs text-slate-600">Calorías (kcal)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filtrosLocales.caloriasMin || ''}
                    onChange={(e) =>
                      actualizarFiltro('caloriasMin', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="text-sm"
                  />
                  <span className="text-xs text-slate-500">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filtrosLocales.caloriasMax || ''}
                    onChange={(e) =>
                      actualizarFiltro('caloriasMax', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Proteínas */}
              <div>
                <label className="mb-1 block text-xs text-slate-600">Proteínas (g)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filtrosLocales.proteinasMin || ''}
                    onChange={(e) =>
                      actualizarFiltro('proteinasMin', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="text-sm"
                  />
                  <span className="text-xs text-slate-500">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filtrosLocales.proteinasMax || ''}
                    onChange={(e) =>
                      actualizarFiltro('proteinasMax', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Carbohidratos */}
              <div>
                <label className="mb-1 block text-xs text-slate-600">Carbohidratos (g)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filtrosLocales.carbohidratosMin || ''}
                    onChange={(e) =>
                      actualizarFiltro('carbohidratosMin', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="text-sm"
                  />
                  <span className="text-xs text-slate-500">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filtrosLocales.carbohidratosMax || ''}
                    onChange={(e) =>
                      actualizarFiltro('carbohidratosMax', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Grasas */}
              <div>
                <label className="mb-1 block text-xs text-slate-600">Grasas (g)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filtrosLocales.grasasMin || ''}
                    onChange={(e) =>
                      actualizarFiltro('grasasMin', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="text-sm"
                  />
                  <span className="text-xs text-slate-500">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filtrosLocales.grasasMax || ''}
                    onChange={(e) =>
                      actualizarFiltro('grasasMax', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Fibra */}
              <div>
                <label className="mb-1 block text-xs text-slate-600">Fibra (g)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filtrosLocales.fibraMin || ''}
                    onChange={(e) =>
                      actualizarFiltro('fibraMin', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="text-sm"
                  />
                  <span className="text-xs text-slate-500">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filtrosLocales.fibraMax || ''}
                    onChange={(e) =>
                      actualizarFiltro('fibraMax', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Sodio */}
              <div>
                <label className="mb-1 block text-xs text-slate-600">Sodio (mg)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    placeholder="Min"
                    value={filtrosLocales.sodioMin || ''}
                    onChange={(e) =>
                      actualizarFiltro('sodioMin', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="text-sm"
                  />
                  <span className="text-xs text-slate-500">-</span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={filtrosLocales.sodioMax || ''}
                    onChange={(e) =>
                      actualizarFiltro('sodioMax', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="text-sm"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Estilo culinario */}
        <div>
          <button
            onClick={() => setMostrarFiltrosEstilo(!mostrarFiltrosEstilo)}
            className="mb-2 flex w-full items-center justify-between text-xs font-medium text-slate-700"
          >
            <div className="flex items-center gap-2">
              <ChefHat className="h-4 w-4" />
              <span>Estilo culinario</span>
            </div>
            <span className={mostrarFiltrosEstilo ? 'rotate-180' : ''}>▼</span>
          </button>
          {mostrarFiltrosEstilo && (
            <div className="flex flex-wrap gap-2">
              {estilosCulinariosDisponibles.map((estilo) => {
                const activo = filtrosLocales.estilosCulinarios?.includes(estilo);
                return (
                  <button
                    key={estilo}
                    onClick={() => toggleEstiloCulinario(estilo)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      activo
                        ? 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {estiloLabels[estilo]}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Restricciones */}
        <div>
          <button
            onClick={() => setMostrarFiltrosRestricciones(!mostrarFiltrosRestricciones)}
            className="mb-2 flex w-full items-center justify-between text-xs font-medium text-slate-700"
          >
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Restricciones</span>
            </div>
            <span className={mostrarFiltrosRestricciones ? 'rotate-180' : ''}>▼</span>
          </button>
          {mostrarFiltrosRestricciones && (
            <div className="flex flex-wrap gap-2">
              {restriccionesDisponibles.map((restriccion) => {
                const activo = filtrosLocales.restricciones?.includes(restriccion);
                return (
                  <button
                    key={restriccion}
                    onClick={() => toggleRestriccion(restriccion)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                      activo
                        ? 'bg-amber-100 text-amber-700 ring-1 ring-amber-200'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {restriccion.replace('-', ' ').replace(/\b\w/g, (l) => l.toUpperCase())}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* Tiempo de preparación */}
        <div>
          <button
            onClick={() => setMostrarFiltrosTiempo(!mostrarFiltrosTiempo)}
            className="mb-2 flex w-full items-center justify-between text-xs font-medium text-slate-700"
          >
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              <span>Tiempo de preparación</span>
            </div>
            <span className={mostrarFiltrosTiempo ? 'rotate-180' : ''}>▼</span>
          </button>
          {mostrarFiltrosTiempo && (
            <div>
              <label className="mb-1 block text-xs text-slate-600">Máximo (minutos)</label>
              <Input
                type="number"
                placeholder="Ej: 30"
                value={filtrosLocales.tiempoPreparacionMax || ''}
                onChange={(e) =>
                  actualizarFiltro('tiempoPreparacionMax', e.target.value ? Number(e.target.value) : undefined)
                }
                className="text-sm"
              />
            </div>
          )}
        </div>

        {/* Favoritos */}
        <div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={filtrosLocales.favoritos || false}
              onChange={(e) => actualizarFiltro('favoritos', e.target.checked || undefined)}
              className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-xs font-medium text-slate-700">Solo favoritos</span>
          </label>
        </div>

        {/* Sostenibilidad y Presupuesto */}
        <div>
          <button
            onClick={() => setMostrarFiltrosSostenibilidad(!mostrarFiltrosSostenibilidad)}
            className="mb-2 flex w-full items-center justify-between text-xs font-medium text-slate-700"
          >
            <div className="flex items-center gap-2">
              <Leaf className="h-4 w-4" />
              <span>Sostenibilidad y Presupuesto</span>
            </div>
            <span className={mostrarFiltrosSostenibilidad ? 'rotate-180' : ''}>▼</span>
          </button>
          {mostrarFiltrosSostenibilidad && (
            <div className="space-y-3 rounded-lg bg-slate-50 p-3">
              {/* Coste */}
              <div>
                <label className="mb-1 block text-xs text-slate-600 flex items-center gap-1">
                  <DollarSign className="h-3 w-3" />
                  Coste (€)
                </label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Min"
                    value={filtrosLocales.costeMin || ''}
                    onChange={(e) =>
                      actualizarFiltro('costeMin', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="text-sm"
                  />
                  <span className="text-xs text-slate-500">-</span>
                  <Input
                    type="number"
                    step="0.01"
                    placeholder="Max"
                    value={filtrosLocales.costeMax || ''}
                    onChange={(e) =>
                      actualizarFiltro('costeMax', e.target.value ? Number(e.target.value) : undefined)
                    }
                    className="text-sm"
                  />
                </div>
              </div>

              {/* Huella de carbono */}
              <div>
                <label className="mb-1 block text-xs text-slate-600 flex items-center gap-1">
                  <Leaf className="h-3 w-3" />
                  Huella de Carbono Máxima (kg CO₂)
                </label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="Ej: 1.5"
                  value={filtrosLocales.huellaCarbonoMax || ''}
                  onChange={(e) =>
                    actualizarFiltro('huellaCarbonoMax', e.target.value ? Number(e.target.value) : undefined)
                  }
                  className="text-sm"
                />
              </div>

              {/* Solo certificados */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filtrosLocales.soloCertificados || false}
                    onChange={(e) => actualizarFiltro('soloCertificados', e.target.checked || undefined)}
                    className="h-4 w-4 rounded border-slate-300 text-green-600 focus:ring-green-500"
                  />
                  <CheckCircle2 className="h-3 w-3 text-green-600" />
                  <span className="text-xs font-medium text-slate-700">Solo recursos certificados</span>
                </label>
              </div>

              {/* Solo temporada */}
              <div>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={filtrosLocales.soloTemporada || false}
                    onChange={(e) => actualizarFiltro('soloTemporada', e.target.checked || undefined)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <Leaf className="h-3 w-3 text-blue-600" />
                  <span className="text-xs font-medium text-slate-700">Solo ingredientes de temporada</span>
                </label>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

