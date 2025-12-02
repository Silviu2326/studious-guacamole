import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Tabs, MetricCards } from '../../../components/componentsreutilizables';
import { Dumbbell, Target, Search, Heart } from 'lucide-react';
import { BibliotecaEjercicios } from '../components';
import { getCategorias } from '../api/categorias';
import { getFavoritos } from '../api/favoritos';
import { getAnalyticsEjercicios } from '../api/ejercicios';
import { Categoria } from '../types';

export default function BibliotecaEjerciciosPage() {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const [tabActiva, setTabActiva] = useState<string>('biblioteca');
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState<string | null>(null);
  const [metricas, setMetricas] = useState([
    {
      id: 'total-ejercicios',
      title: 'Total Ejercicios',
      value: '0',
      color: 'info' as const,
    },
    {
      id: 'favoritos',
      title: 'Favoritos',
      value: '0',
      color: 'danger' as const,
    },
    {
      id: 'categorias',
      title: 'Categorías',
      value: '0',
      color: 'success' as const,
    },
    {
      id: 'ejercicios-usados',
      title: 'Ejercicios Usados',
      value: '0',
      color: 'info' as const,
    },
  ]);

  useEffect(() => {
    cargarCategorias();
    cargarMetricas();
    
    // Escuchar cambios en favoritos para actualizar métricas
    const handleFavoritosCambiados = () => {
      cargarMetricas();
    };
    
    window.addEventListener('favoritos-cambiados', handleFavoritosCambiados);
    return () => window.removeEventListener('favoritos-cambiados', handleFavoritosCambiados);
  }, []);

  const cargarCategorias = async () => {
    const cats = await getCategorias();
    setCategorias(cats);
  };

  const cargarMetricas = async () => {
    try {
      const analytics = await getAnalyticsEjercicios();
      const favoritos = await getFavoritos();
      const cats = await getCategorias();
      
      setMetricas([
        {
          id: 'total-ejercicios',
          title: 'Total Ejercicios',
          value: analytics.totalEjercicios.toString(),
          color: 'info' as const,
        },
        {
          id: 'favoritos',
          title: 'Favoritos',
          value: favoritos.length.toString(),
          color: 'danger' as const,
        },
        {
          id: 'categorias',
          title: 'Categorías',
          value: cats.length > 0 ? cats.length.toString() : '9',
          color: 'success' as const,
        },
        {
          id: 'ejercicios-usados',
          title: 'Ejercicios Usados',
          value: analytics.ejerciciosMasUsados.length.toString(),
          color: 'info' as const,
        },
      ]);
    } catch (error) {
      console.error('Error cargando métricas:', error);
    }
  };

  // Configuración de pestañas - igual para entrenadores y gimnasio
  const tabs = useMemo(
    () => [
      {
        id: 'biblioteca',
        label: 'Biblioteca',
        icon: <Dumbbell size={18} />,
      },
      {
        id: 'favoritos',
        label: 'Favoritos',
        icon: <Heart size={18} />,
      },
      {
        id: 'categorias',
        label: 'Categorías',
        icon: <Target size={18} />,
      },
      {
        id: 'busqueda',
        label: 'Búsqueda Avanzada',
        icon: <Search size={18} />,
      },
    ],
    []
  );

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'biblioteca':
        return <BibliotecaEjercicios mostrarFiltros={true} mostrarFavoritos={true} categoriaSeleccionada={categoriaSeleccionada || undefined} />;
      case 'favoritos':
        return (
          <BibliotecaEjercicios
            mostrarFiltros={false}
            mostrarFavoritos={true}
            soloFavoritos={true}
          />
        );
      case 'categorias':
        if (categoriaSeleccionada) {
          return <BibliotecaEjercicios mostrarFiltros={true} mostrarFavoritos={true} categoriaSeleccionada={categoriaSeleccionada} />;
        }
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-white shadow-sm">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Selecciona una Categoría</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categorias.map((categoria) => (
                  <Card
                    key={categoria.id}
                    variant="hover"
                    className="p-6 cursor-pointer transition-all hover:shadow-md"
                    onClick={() => setCategoriaSeleccionada(categoria.grupoMuscular || '')}
                  >
                    <div className="flex items-start gap-4">
                      <div className="text-4xl">{categoria.icono}</div>
                      <div className="flex-1">
                        <h4 className="text-lg font-semibold text-gray-900 mb-1">
                          {categoria.nombre}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {categoria.descripcion}
                        </p>
                        <div className="text-sm font-medium text-blue-600">
                          {categoria.cantidadEjercicios || 0} ejercicios
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
              {categoriaSeleccionada && (
                <div className="mt-4">
                  <button
                    onClick={() => setCategoriaSeleccionada(null)}
                    className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                  >
                    ← Volver a categorías
                  </button>
                </div>
              )}
            </Card>
          </div>
        );
      case 'busqueda':
        return <BibliotecaEjercicios mostrarFiltros={true} mostrarFavoritos={true} />;
      default:
        return <BibliotecaEjercicios mostrarFiltros={true} mostrarFavoritos={true} />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Dumbbell size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Biblioteca de Ejercicios
                </h1>
                <p className="text-gray-600">
                  {esEntrenador
                    ? 'Catálogo completo de ejercicios para crear programas de entrenamiento personalizados'
                    : 'Biblioteca completa de ejercicios estandarizados para instructores y clases grupales'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <div className="space-y-6">
          {/* KPIs y Estadísticas Mejoradas */}
          <div className="space-y-4">
            <MetricCards data={metricas} />
            
            {/* Estadísticas Adicionales */}
            {metricas[0]?.value !== '0' && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-blue-700 font-medium mb-1">Ejercicios Disponibles</p>
                      <p className="text-2xl font-bold text-blue-900">{metricas[0]?.value}</p>
                    </div>
                    <Dumbbell className="w-10 h-10 text-blue-600 opacity-50" />
                  </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-red-50 to-red-100 border-red-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-red-700 font-medium mb-1">En Favoritos</p>
                      <p className="text-2xl font-bold text-red-900">{metricas[1]?.value}</p>
                    </div>
                    <Heart className="w-10 h-10 text-red-600 opacity-50" />
                  </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-green-700 font-medium mb-1">Categorías</p>
                      <p className="text-2xl font-bold text-green-900">{metricas[2]?.value}</p>
                    </div>
                    <Target className="w-10 h-10 text-green-600 opacity-50" />
                  </div>
                </Card>
                <Card className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-purple-700 font-medium mb-1">Más Usados</p>
                      <p className="text-2xl font-bold text-purple-900">{metricas[3]?.value}</p>
                    </div>
                    <Search className="w-10 h-10 text-purple-600 opacity-50" />
                  </div>
                </Card>
              </div>
            )}
          </div>

          {/* Botón para volver cuando hay categoría seleccionada */}
          {categoriaSeleccionada && tabActiva === 'categorias' && (
            <Card className="p-4 bg-blue-50 border-blue-200">
              <button
                onClick={() => setCategoriaSeleccionada(null)}
                className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-2"
              >
                ← Volver a todas las categorías
              </button>
            </Card>
          )}

          {/* Sistema de Tabs */}
          <Card className="p-0 bg-white shadow-sm">
            <div className="px-4 py-3">
              <div
                role="tablist"
                aria-label="Secciones"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
              >
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setTabActiva(tab.id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      tabActiva === tab.id
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <span className={tabActiva === tab.id ? 'opacity-100' : 'opacity-70'}>
                      {tab.icon}
                    </span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </Card>

          {/* Contenido de la pestaña activa */}
          <div className="mt-6">
            {renderTabContent()}
          </div>

          {/* Información adicional */}
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-start space-x-3">
              <Dumbbell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2 text-lg">
                  Catálogo Completo de Ejercicios
                </h4>
                <div className="text-sm text-blue-700 space-y-1">
                  <p>• <strong>Vídeos de Ejecución:</strong> Visualiza la técnica correcta de cada ejercicio</p>
                  <p>• <strong>Instrucciones Detalladas:</strong> Guía paso a paso para una ejecución segura</p>
                  <p>• <strong>Advertencias de Lesión:</strong> Precauciones y contraindicaciones específicas</p>
                  <p>• <strong>Búsqueda Avanzada:</strong> Filtros por grupos musculares, equipamiento y dificultad</p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}

