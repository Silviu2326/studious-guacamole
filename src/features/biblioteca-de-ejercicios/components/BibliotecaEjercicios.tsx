import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Search, Play, Target, Dumbbell, Heart, Filter, X, ChevronDown, ChevronUp, ArrowUpDown, ArrowUp, ArrowDown, Grid3x3, List } from 'lucide-react';
import { Ejercicio, FiltrosEjercicios } from '../types';
import { getEjercicios } from '../api/ejercicios';
import { BuscadorEjercicios } from './BuscadorEjercicios';
import { FiltrosCategoria } from './FiltrosCategoria';
import { VisorEjercicio } from './VisorEjercicio';
import { getFavoritos } from '../api/favoritos';

interface BibliotecaEjerciciosProps {
  mostrarFiltros?: boolean;
  mostrarFavoritos?: boolean;
  onEjercicioSeleccionado?: (ejercicio: Ejercicio) => void;
  soloFavoritos?: boolean;
  categoriaSeleccionada?: string;
}

export const BibliotecaEjercicios: React.FC<BibliotecaEjerciciosProps> = ({
  mostrarFiltros = true,
  mostrarFavoritos = true,
  onEjercicioSeleccionado,
  soloFavoritos = false,
  categoriaSeleccionada,
}) => {
  const [ejercicios, setEjercicios] = useState<Ejercicio[]>([]);
  const [ejercicioSeleccionado, setEjercicioSeleccionado] = useState<Ejercicio | null>(null);
  const [mostrarVisor, setMostrarVisor] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [filtros, setFiltros] = useState<FiltrosEjercicios>({});
  const [cargando, setCargando] = useState(false);
  const [mostrarFiltrosPanel, setMostrarFiltrosPanel] = useState(false);
  const [ordenarPor, setOrdenarPor] = useState<'nombre' | 'popularidad' | 'fecha' | 'grupo'>('popularidad');
  const [orden, setOrden] = useState<'asc' | 'desc'>('desc');

  useEffect(() => {
    cargarEjercicios();
  }, [filtros, busqueda, soloFavoritos, categoriaSeleccionada, ordenarPor, orden]);

  // Escuchar cambios en favoritos
  useEffect(() => {
    const handleFavoritosCambiados = () => {
      cargarEjercicios();
    };
    
    window.addEventListener('favoritos-cambiados', handleFavoritosCambiados);
    return () => window.removeEventListener('favoritos-cambiados', handleFavoritosCambiados);
  }, []);

  const cargarEjercicios = async () => {
    setCargando(true);
    try {
      // Si solo queremos favoritos y no hay filtros, usar getFavoritos directamente
      if (soloFavoritos && !mostrarFiltros) {
        const favoritos = await getFavoritos();
        setEjercicios(favoritos);
        return;
      }

      const filtrosCompletos: FiltrosEjercicios = {
        ...filtros,
        busqueda: busqueda || undefined,
        soloFavoritos: soloFavoritos || filtros.soloFavoritos,
        ordenarPor: ordenarPor,
        orden: orden,
      };

      // Si hay una categoría seleccionada, filtrar por grupo muscular
      if (categoriaSeleccionada) {
        filtrosCompletos.gruposMusculares = [categoriaSeleccionada as any];
      }

      const datos = await getEjercicios(filtrosCompletos);
      setEjercicios(datos);
    } catch (error) {
      console.error('Error al cargar ejercicios:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleEjercicioClick = (ejercicio: Ejercicio) => {
    setEjercicioSeleccionado(ejercicio);
    setMostrarVisor(true);
    onEjercicioSeleccionado?.(ejercicio);
  };

  const handleLimpiarFiltros = () => {
    setFiltros({});
    setBusqueda('');
  };

  const getDificultadColor = (dificultad: string) => {
    switch (dificultad) {
      case 'principiante':
        return 'green';
      case 'intermedio':
        return 'yellow';
      case 'avanzado':
        return 'red';
      default:
        return 'gray';
    }
  };

  const contarFiltrosActivos = () => {
    let count = 0;
    if (busqueda.length > 0) count++;
    count += Object.values(filtros).reduce((acc, val) => acc + (Array.isArray(val) ? val.length : val ? 1 : 0), 0);
    return count;
  };

  const filtrosActivos = contarFiltrosActivos();

  return (
    <div className="space-y-6">
      {/* Sistema de Filtros */}
      {mostrarFiltros && (
        <Card className="mb-6 bg-white shadow-sm">
          <div className="space-y-4">
            {/* Barra de búsqueda */}
            <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
              <div className="flex gap-4">
                <div className="flex-1">
                  <BuscadorEjercicios
                    valor={busqueda}
                    onChange={setBusqueda}
                    onLimpiar={() => setBusqueda('')}
                  />
                </div>
                <div className="flex items-end gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => setMostrarFiltrosPanel(!mostrarFiltrosPanel)}
                    className="flex items-center gap-2 bg-white text-slate-900 ring-1 ring-slate-300 hover:bg-slate-50 shadow-sm"
                  >
                    <Filter size={16} />
                    Filtros
                    {filtrosActivos > 0 && (
                      <span className="bg-blue-600 text-white text-xs rounded-full px-2 py-1 min-w-[20px] h-5 flex items-center justify-center shadow-sm">
                        {filtrosActivos}
                      </span>
                    )}
                    {mostrarFiltrosPanel ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </Button>

                  {filtrosActivos > 0 && (
                    <Button
                      variant="ghost"
                      onClick={handleLimpiarFiltros}
                      className="text-slate-600 hover:text-slate-900"
                    >
                      <X size={16} className="mr-1" />
                      Limpiar
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* Panel de filtros avanzados */}
            {mostrarFiltrosPanel && (
              <FiltrosCategoria
                filtros={filtros}
                onChange={setFiltros}
                onLimpiar={handleLimpiarFiltros}
              />
            )}

            {/* Opciones de ordenamiento */}
            <div className="flex items-center gap-3 border-t border-slate-200 pt-4">
              <div className="flex items-center gap-2 text-sm text-slate-600">
                <ArrowUpDown size={16} />
                <span className="font-medium">Ordenar por:</span>
              </div>
              <select
                value={ordenarPor}
                onChange={(e) => setOrdenarPor(e.target.value as any)}
                className="text-sm rounded-lg bg-white border border-slate-300 px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-blue-400"
              >
                <option value="popularidad">Popularidad</option>
                <option value="nombre">Nombre</option>
                <option value="fecha">Fecha</option>
                <option value="grupo">Grupo Muscular</option>
              </select>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setOrden(orden === 'asc' ? 'desc' : 'asc')}
                className="flex items-center gap-1"
              >
                {orden === 'asc' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
                {orden === 'asc' ? 'Asc' : 'Desc'}
              </Button>
            </div>

            {/* Resumen de resultados */}
            <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
              <span>{ejercicios.length} resultado{ejercicios.length !== 1 ? 's' : ''} encontrado{ejercicios.length !== 1 ? 's' : ''}</span>
              <span>
                {filtrosActivos > 0 && (
                  `${filtrosActivos} filtro${filtrosActivos !== 1 ? 's' : ''} aplicado${filtrosActivos !== 1 ? 's' : ''}`
                )}
              </span>
            </div>
          </div>
        </Card>
      )}

      {/* Resultados */}
      {cargando ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">Cargando ejercicios...</p>
          </div>
        </Card>
      ) : ejercicios.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No se encontraron ejercicios</h3>
          <p className="text-gray-600 mb-4">
            No hay ejercicios con los filtros seleccionados
          </p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {ejercicios.map((ejercicio) => (
            <Card
              key={ejercicio.id}
              variant="hover"
              className="h-full flex flex-col transition-shadow overflow-hidden cursor-pointer group"
              onClick={() => handleEjercicioClick(ejercicio)}
            >
              <div className="space-y-2 p-4">
                {/* Imagen o placeholder */}
                <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                  {ejercicio.imagenUrl ? (
                    <img
                      src={ejercicio.imagenUrl}
                      alt={ejercicio.nombre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Dumbbell className="w-16 h-16 text-gray-400" />
                  )}
                </div>

                {/* Información */}
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                      {ejercicio.nombre}
                    </h3>
                    {ejercicio.esFavorito && (
                      <Heart className="w-5 h-5 text-red-500 fill-current flex-shrink-0 ml-2" />
                    )}
                  </div>

                  <p className="text-sm text-gray-600 line-clamp-2">
                    {ejercicio.descripcion}
                  </p>

                  {/* Badges */}
                  <div className="flex flex-wrap gap-2">
                    <Badge variant={getDificultadColor(ejercicio.dificultad) as any}>
                      {ejercicio.dificultad}
                    </Badge>
                    {ejercicio.grupoMuscular.slice(0, 2).map((grupo) => (
                      <Badge key={grupo} variant="blue" size="sm">
                        <Target className="w-3 h-3 mr-1" />
                        {grupo}
                      </Badge>
                    ))}
                    {ejercicio.grupoMuscular.length > 2 && (
                      <Badge variant="blue" size="sm">
                        +{ejercicio.grupoMuscular.length - 2}
                      </Badge>
                    )}
                  </div>

                  {/* Equipamiento */}
                  {ejercicio.equipamiento.length > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Dumbbell className="w-3 h-3" />
                      <span>{ejercicio.equipamiento.slice(0, 2).join(', ')}</span>
                      {ejercicio.equipamiento.length > 2 && (
                        <span> +{ejercicio.equipamiento.length - 2}</span>
                      )}
                    </div>
                  )}

                  {/* Estadísticas */}
                  {ejercicio.vecesUsado !== undefined && ejercicio.vecesUsado > 0 && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Play className="w-3 h-3" />
                      <span>Usado {ejercicio.vecesUsado} veces</span>
                    </div>
                  )}

                  {/* Acción */}
                  <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
                    <Button
                      variant="ghost"
                      size="sm"
                      fullWidth
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEjercicioClick(ejercicio);
                      }}
                    >
                      <Play className="w-4 h-4 mr-2" />
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Visor de ejercicio */}
      <VisorEjercicio
        ejercicio={ejercicioSeleccionado}
        isOpen={mostrarVisor}
        onClose={() => {
          setMostrarVisor(false);
          setEjercicioSeleccionado(null);
        }}
      />
    </div>
  );
};

