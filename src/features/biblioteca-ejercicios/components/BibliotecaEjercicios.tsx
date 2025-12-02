import React, { useState, useMemo } from 'react';
import { 
  Card, 
  Button
} from '../../../components/componentsreutilizables';
import { 
  Ejercicio, 
  FiltrosEjercicio, 
  BibliotecaEjerciciosProps, 
  Dificultad 
} from '../types';
import { ejerciciosMock, gruposMusculares, equipamientos, favoritosMock } from '../data/mockData';
import { VisorEjercicio } from './VisorEjercicio';
import {
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp,
  Heart,
  Target,
  Package
} from 'lucide-react';

export const BibliotecaEjercicios: React.FC<BibliotecaEjerciciosProps> = ({
  modo = 'visualizacion',
  onSeleccionarEjercicio,
  ejerciciosSeleccionados = [],
  mostrarFavoritos = true
}) => {
  const [ejercicios] = useState<Ejercicio[]>(ejerciciosMock);
  const [favoritos, setFavoritos] = useState<string[]>(favoritosMock);
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState<Ejercicio | null>(null);
  const [filtros, setFiltros] = useState<FiltrosEjercicio>({
    busqueda: '',
    gruposMusculares: [],
    equipamiento: [],
    dificultad: [],
    soloFavoritos: false
  });
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);

  // Opciones para los selects
  const opcionesGruposMusculares = gruposMusculares.map(grupo => ({
    value: grupo.id,
    label: grupo.nombre
  }));

  const opcionesEquipamiento = equipamientos.map(equipo => ({
    value: equipo.id,
    label: equipo.nombre
  }));

  const opcionesDificultad = [
    { value: Dificultad.PRINCIPIANTE, label: 'Principiante' },
    { value: Dificultad.INTERMEDIO, label: 'Intermedio' },
    { value: Dificultad.AVANZADO, label: 'Avanzado' },
    { value: Dificultad.EXPERTO, label: 'Experto' }
  ];

  const contarFiltrosActivos = () => {
    let count = 0;
    if (filtros.busqueda) count++;
    if (filtros.gruposMusculares && filtros.gruposMusculares.length > 0) count++;
    if (filtros.equipamiento && filtros.equipamiento.length > 0) count++;
    if (filtros.dificultad && filtros.dificultad.length > 0) count++;
    if (filtros.soloFavoritos) count++;
    return count;
  };

  const handleLimpiarFiltros = () => {
    setFiltros({
      busqueda: '',
      gruposMusculares: [],
      equipamiento: [],
      dificultad: [],
      soloFavoritos: false
    });
    setMostrarFiltrosAvanzados(false);
  };

  // Light Input Component
  type LightInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
    leftIcon?: React.ReactNode;
    rightIcon?: React.ReactNode;
  };

  const LightInput: React.FC<LightInputProps> = ({ leftIcon, rightIcon, className = '', ...props }) => (
    <div className={`relative ${className}`}>
      {leftIcon && (
        <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          <span className="text-slate-400">{leftIcon}</span>
        </span>
      )}
      <input
        {...props}
        className={[
          'w-full rounded-xl bg-white text-slate-900 placeholder-slate-400',
          'ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400',
          leftIcon ? 'pl-10' : 'pl-3',
          rightIcon ? 'pr-10' : 'pr-3',
          'py-2.5'
        ].join(' ')}
      />
      {rightIcon && (
        <span className="absolute inset-y-0 right-0 flex items-center pr-3">
          {rightIcon}
        </span>
      )}
    </div>
  );

  type Option = { value: string; label: string };

  const LightSelect: React.FC<{
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    className?: string;
  }> = ({ options, value, onChange, placeholder, className = '' }) => (
    <div className={`relative ${className}`}>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={[
          'w-full appearance-none rounded-xl bg-white text-slate-900',
          'ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400',
          'py-2.5 pl-3 pr-9'
        ].join(' ')}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
    </div>
  );

  // Filtrar ejercicios
  const ejerciciosFiltrados = useMemo(() => {
    return ejercicios.filter(ejercicio => {
      // Filtro por búsqueda
      if (filtros.busqueda) {
        const busqueda = filtros.busqueda.toLowerCase();
        const coincide = 
          ejercicio.nombre.toLowerCase().includes(busqueda) ||
          ejercicio.descripcion.toLowerCase().includes(busqueda) ||
          ejercicio.tags.some(tag => tag.toLowerCase().includes(busqueda));
        if (!coincide) return false;
      }

      // Filtro por grupos musculares
      if (filtros.gruposMusculares && filtros.gruposMusculares.length > 0) {
        const tieneGrupo = ejercicio.grupoMuscular.some(grupo => 
          filtros.gruposMusculares!.includes(grupo.id)
        );
        if (!tieneGrupo) return false;
      }

      // Filtro por equipamiento
      if (filtros.equipamiento && filtros.equipamiento.length > 0) {
        const tieneEquipamiento = ejercicio.equipamiento.some(equipo => 
          filtros.equipamiento!.includes(equipo.id)
        );
        if (!tieneEquipamiento) return false;
      }

      // Filtro por dificultad
      if (filtros.dificultad && filtros.dificultad.length > 0) {
        if (!filtros.dificultad.includes(ejercicio.dificultad)) return false;
      }

      // Filtro por favoritos
      if (filtros.soloFavoritos) {
        if (!favoritos.includes(ejercicio.id)) return false;
      }

      return true;
    });
  }, [ejercicios, filtros, favoritos]);

  const handleAgregarFavorito = (ejercicioId: string) => {
    setFavoritos(prev => [...prev, ejercicioId]);
  };

  const handleRemoverFavorito = (ejercicioId: string) => {
    setFavoritos(prev => prev.filter(id => id !== ejercicioId));
  };

  const handleSeleccionarEjercicio = (ejercicio: Ejercicio) => {
    if (modo === 'seleccion' && onSeleccionarEjercicio) {
      onSeleccionarEjercicio(ejercicio);
    } else {
      setEjercicioSeleccionado(ejercicio);
    }
  };

  const getDificultadColor = (dificultad: Dificultad) => {
    switch (dificultad) {
      case Dificultad.PRINCIPIANTE:
        return 'bg-green-100 text-green-800';
      case Dificultad.INTERMEDIO:
        return 'bg-yellow-100 text-yellow-800';
      case Dificultad.AVANZADO:
        return 'bg-orange-100 text-orange-800';
      case Dificultad.EXPERTO:
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const filtrosActivos = contarFiltrosActivos();

  return (
    <div className="space-y-6">
      {/* Sistema de Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1">
                <LightInput
                  placeholder="Buscar ejercicios por nombre, descripción o tags..."
                  value={filtros.busqueda || ''}
                  onChange={(e) => setFiltros(prev => ({ ...prev, busqueda: e.target.value }))}
                  leftIcon={<Search size={20} />}
                  rightIcon={
                    filtros.busqueda ? (
                      <button
                        onClick={() => setFiltros(prev => ({ ...prev, busqueda: '' }))}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X size={16} />
                      </button>
                    ) : undefined
                  }
                />
              </div>

              <Button
                variant="secondary"
                onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
                className="flex items-center gap-2 bg-white text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50 shadow-sm"
              >
                <Filter size={16} />
                Filtros
                {filtrosActivos > 0 && (
                  <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center shadow-sm">
                    {filtrosActivos}
                  </span>
                )}
                {mostrarFiltrosAvanzados ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </Button>

              {filtrosActivos > 0 && (
                <Button
                  onClick={handleLimpiarFiltros}
                  className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  variant="ghost"
                >
                  <X size={16} className="mr-1" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Panel de filtros avanzados */}
          {mostrarFiltrosAvanzados && (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Target size={16} className="inline mr-1" />
                    Grupo muscular
                  </label>
                  <LightSelect
                    options={[{ value: '', label: 'Todos los grupos' }, ...opcionesGruposMusculares]}
                    value={filtros.gruposMusculares?.[0] || ''}
                    onChange={(valor) => {
                      setFiltros(prev => ({ 
                        ...prev, 
                        gruposMusculares: valor ? [valor] : [] 
                      }));
                    }}
                    placeholder="Seleccionar grupo muscular"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    <Package size={16} className="inline mr-1" />
                    Equipamiento
                  </label>
                  <LightSelect
                    options={[{ value: '', label: 'Todo el equipamiento' }, ...opcionesEquipamiento]}
                    value={filtros.equipamiento?.[0] || ''}
                    onChange={(valor) => {
                      setFiltros(prev => ({ 
                        ...prev, 
                        equipamiento: valor ? [valor] : [] 
                      }));
                    }}
                    placeholder="Seleccionar equipamiento"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Dificultad
                  </label>
                  <LightSelect
                    options={[{ value: '', label: 'Todas las dificultades' }, ...opcionesDificultad]}
                    value={filtros.dificultad?.[0] || ''}
                    onChange={(valor) => {
                      setFiltros(prev => ({ 
                        ...prev, 
                        dificultad: valor ? [valor as Dificultad] : [] 
                      }));
                    }}
                    placeholder="Seleccionar dificultad"
                  />
                </div>
              </div>

              {mostrarFavoritos && (
                <div className="flex items-center gap-4">
                  <Button
                    variant={filtros.soloFavoritos ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => setFiltros(prev => ({ ...prev, soloFavoritos: !prev.soloFavoritos }))}
                  >
                    <Heart size={16} className="mr-2" fill={filtros.soloFavoritos ? "currentColor" : "none"} />
                    Solo favoritos
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>
              {ejerciciosFiltrados.length === 1 ? '1 ejercicio encontrado' : `${ejerciciosFiltrados.length} ejercicios encontrados`}
            </span>
            {filtrosActivos > 0 && (
              <span>{filtrosActivos === 1 ? '1 filtro aplicado' : `${filtrosActivos} filtros aplicados`}</span>
            )}
          </div>
        </div>
      </Card>

      {/* Grid de ejercicios */}
      {ejerciciosFiltrados.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ejerciciosFiltrados.map((ejercicio) => (
            <Card 
              key={ejercicio.id} 
              variant="hover" 
              className="h-full flex flex-col transition-shadow overflow-hidden cursor-pointer relative"
              onClick={() => handleSeleccionarEjercicio(ejercicio)}
            >
              {/* Imagen/Video placeholder */}
              <div className="h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                <Target className="w-12 h-12 text-gray-400" />
              </div>

              {/* Información del ejercicio */}
              <div className="p-4 space-y-2 flex-1 flex flex-col">
                <div className="flex items-start justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {ejercicio.nombre}
                  </h3>
                  {mostrarFavoritos && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        if (favoritos.includes(ejercicio.id)) {
                          handleRemoverFavorito(ejercicio.id);
                        } else {
                          handleAgregarFavorito(ejercicio.id);
                        }
                      }}
                      className="p-1 hover:bg-gray-100 rounded transition-all"
                    >
                      <Heart 
                        size={20}
                        className={favoritos.includes(ejercicio.id) ? 'text-red-500 fill-current' : 'text-gray-400'}
                        fill={favoritos.includes(ejercicio.id) ? "currentColor" : "none"}
                      />
                    </button>
                  )}
                </div>

                <p className="text-sm text-gray-600 line-clamp-2">
                  {ejercicio.descripcion}
                </p>

                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <span className={`px-2 py-1 rounded-lg text-xs font-medium ${getDificultadColor(ejercicio.dificultad)}`}>
                    {ejercicio.dificultad}
                  </span>
                  {ejercicio.duracion && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-lg text-xs font-medium">
                      {ejercicio.duracion} min
                    </span>
                  )}
                  {ejercicio.calorias && (
                    <span className="px-2 py-1 bg-orange-100 text-orange-800 rounded-lg text-xs font-medium">
                      {ejercicio.calorias} cal
                    </span>
                  )}
                </div>

                {/* Grupos musculares */}
                <div className="flex flex-wrap gap-1 mt-2">
                  {ejercicio.grupoMuscular.slice(0, 2).map((grupo) => (
                    <span 
                      key={grupo.id}
                      className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs"
                    >
                      {grupo.nombre}
                    </span>
                  ))}
                  {ejercicio.grupoMuscular.length > 2 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
                      +{ejercicio.grupoMuscular.length - 2}
                    </span>
                  )}
                </div>

                {/* Indicador de selección para modo selección */}
                {modo === 'seleccion' && ejerciciosSeleccionados.includes(ejercicio.id) && (
                  <div className="absolute top-2 right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center shadow-sm">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron ejercicios</h3>
          <p className="text-gray-600 mb-4">Intenta ajustar los filtros para encontrar más ejercicios</p>
          {filtrosActivos > 0 && (
            <Button onClick={handleLimpiarFiltros} variant="ghost">
              Limpiar filtros
            </Button>
          )}
        </Card>
      )}


      {/* Modal del visor de ejercicio */}
      {ejercicioSeleccionado && (
        <VisorEjercicio
          ejercicio={ejercicioSeleccionado}
          onCerrar={() => setEjercicioSeleccionado(null)}
          onAgregarFavorito={handleAgregarFavorito}
          onRemoverFavorito={handleRemoverFavorito}
          esFavorito={favoritos.includes(ejercicioSeleccionado.id)}
        />
      )}
    </div>
  );
};