import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button, Modal, Tabs, MetricCards } from '../../../components/componentsreutilizables';
import {
  BookOpen,
  Plus,
  Eye,
  Edit,
  Heart,
  ShoppingCart,
  FolderOpen,
  Calculator,
} from 'lucide-react';
import {
  RecetarioList,
  VisorReceta,
  BuscadorRecetas,
  FavoritosComida,
  CreadorReceta,
  CategorizadorRecetas,
  GeneradorListaCompra,
} from '../components';
import {
  getRecetas,
  eliminarReceta,
  compartirReceta,
  crearReceta,
  actualizarReceta,
} from '../api/recetas';
import { toggleFavorito } from '../api/favoritos';
import { Receta, FiltrosRecetas } from '../types';
import { ds } from '../../adherencia/ui/ds';

export default function RecetarioComidasGuardadasPage() {
  const { user } = useAuth();
  const [recetas, setRecetas] = useState<Receta[]>([]);
  const [recetaSeleccionada, setRecetaSeleccionada] = useState<Receta | null>(null);
  const [filtros, setFiltros] = useState<FiltrosRecetas>({});
  const [cargando, setCargando] = useState(false);
  const [tabActiva, setTabActiva] = useState<string>('catalogo');
  const [mostrarCrear, setMostrarCrear] = useState(false);
  const [mostrarVer, setMostrarVer] = useState(false);
  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [recetasSeleccionadasLista, setRecetasSeleccionadasLista] = useState<Receta[]>([]);

  useEffect(() => {
    cargarRecetas();
  }, [filtros]);

  const cargarRecetas = async () => {
    setCargando(true);
    try {
      const data = await getRecetas(filtros);
      setRecetas(data);
    } catch (error) {
      console.error('Error cargando recetas:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleEliminar = async (receta: Receta) => {
    if (confirm(`¿Eliminar la receta "${receta.nombre}"?`)) {
      const eliminada = await eliminarReceta(receta.id);
      if (eliminada) {
        cargarRecetas();
      }
    }
  };

  const handleToggleFavorito = async (receta: Receta) => {
    await toggleFavorito(receta.id);
    await cargarRecetas();
    if (recetaSeleccionada?.id === receta.id) {
      const actualizada = await getRecetas({});
      const encontrada = actualizada.find(r => r.id === receta.id);
      if (encontrada) {
        setRecetaSeleccionada(encontrada);
      }
    }
  };

  const handleCompartir = async (receta: Receta) => {
    const usuariosIds: string[] = [];
    const compartida = await compartirReceta(receta.id, usuariosIds);
    if (compartida) {
      alert('Receta compartida exitosamente');
    }
  };

  const handleGuardar = async (receta: Omit<Receta, 'id' | 'creadoEn' | 'actualizadoEn' | 'usoCount'>) => {
    try {
      if (recetaSeleccionada) {
        await actualizarReceta(recetaSeleccionada.id, receta);
      } else {
        await crearReceta(receta);
      }
      setMostrarCrear(false);
      setMostrarEditar(false);
      setRecetaSeleccionada(null);
      cargarRecetas();
    } catch (error) {
      console.error('Error guardando receta:', error);
    }
  };

  const handleCategoriaSeleccionada = (categoria: string) => {
    setFiltros({ ...filtros, categoria: categoria as any });
    setTabActiva('catalogo');
  };

  const tabs = [
    {
      id: 'catalogo',
      label: 'Catálogo',
      icon: <BookOpen className="w-4 h-4" />,
    },
    {
      id: 'favoritos',
      label: 'Favoritas',
      icon: <Heart className="w-4 h-4" />,
    },
    {
      id: 'categorias',
      label: 'Categorías',
      icon: <FolderOpen className="w-4 h-4" />,
    },
    {
      id: 'lista-compra',
      label: 'Lista de Compra',
      icon: <ShoppingCart className="w-4 h-4" />,
    },
  ];

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'catalogo':
        return (
          <div className="space-y-6">
            <BuscadorRecetas filtros={filtros} onFiltrosChange={setFiltros} />
            <div className="flex justify-between items-center">
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                {recetas.length} recetas encontradas
              </h3>
              <Button onClick={() => { setRecetaSeleccionada(null); setMostrarCrear(true); }}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Receta
              </Button>
            </div>
            <RecetarioList
              recetas={recetas}
              cargando={cargando}
              onVer={(receta) => {
                setRecetaSeleccionada(receta);
                setMostrarVer(true);
              }}
              onEditar={(receta) => {
                setRecetaSeleccionada(receta);
                setMostrarEditar(true);
              }}
              onEliminar={handleEliminar}
              onToggleFavorito={handleToggleFavorito}
            />
          </div>
        );
      case 'favoritos':
        return (
          <FavoritosComida
            onVerReceta={(receta) => {
              setRecetaSeleccionada(receta);
              setMostrarVer(true);
            }}
            onEditarReceta={(receta) => {
              setRecetaSeleccionada(receta);
              setMostrarEditar(true);
            }}
            onEliminarReceta={handleEliminar}
            onToggleFavorito={handleToggleFavorito}
          />
        );
      case 'categorias':
        return <CategorizadorRecetas onCategoriaSeleccionada={handleCategoriaSeleccionada} />;
      case 'lista-compra':
        return (
          <div className="space-y-6">
            <div>
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-2`}>
                Seleccionar Recetas
              </h3>
              <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-4`}>
                Haz clic en las recetas para agregarlas a tu lista de compra
              </p>
            </div>
            <RecetarioList
              recetas={recetas}
              cargando={cargando}
              onVer={(receta) => {
                setRecetaSeleccionada(receta);
                setMostrarVer(true);
              }}
              onToggleFavorito={(receta) => {
                // Alternar selección en lista de compra
                if (recetasSeleccionadasLista.some(r => r.id === receta.id)) {
                  setRecetasSeleccionadasLista(recetasSeleccionadasLista.filter(r => r.id !== receta.id));
                } else {
                  setRecetasSeleccionadasLista([...recetasSeleccionadasLista, receta]);
                }
              }}
            />
            {recetasSeleccionadasLista.length > 0 && (
              <Card variant="hover" padding="md">
                <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark} mb-4`}>
                  Recetas Seleccionadas ({recetasSeleccionadasLista.length})
                </h3>
                <div className="space-y-2 mb-4">
                  {recetasSeleccionadasLista.map((receta) => (
                    <div
                      key={receta.id}
                      className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                    >
                      <span className={ds.typography.body}>{receta.nombre}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          setRecetasSeleccionadasLista(
                            recetasSeleccionadasLista.filter((r) => r.id !== receta.id)
                          )
                        }
                      >
                        Quitar
                      </Button>
                    </div>
                  ))}
                </div>
              </Card>
            )}
            <GeneradorListaCompra
              recetasSeleccionadas={recetasSeleccionadasLista}
              onGenerar={() => {
                alert('Lista de compra generada exitosamente');
              }}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const recetasFavoritas = recetas.filter(r => r.esFavorita).length;
  const metricas = [
    {
      title: 'Total Recetas',
      value: recetas.length.toString(),
      icon: <BookOpen className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '+0%',
      color: 'blue' as const,
    },
    {
      title: 'Recetas Favoritas',
      value: recetasFavoritas.toString(),
      icon: <Heart className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '+0%',
      color: 'red' as const,
    },
    {
      title: 'Tiempo Promedio',
      value: recetas.length > 0
        ? Math.round(recetas.reduce((acc, r) => acc + r.tiempoPreparacion, 0) / recetas.length).toString()
        : '0',
      icon: <Calculator className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '+0%',
      color: 'purple' as const,
    },
    {
      title: 'Calorías Promedio',
      value: recetas.length > 0
        ? Math.round(recetas.reduce((acc, r) => acc + r.caloriasPorPorcion, 0) / recetas.length).toString()
        : '0',
      icon: <Calculator className="w-5 h-5" />,
      trend: 'up' as const,
      trendValue: '+0%',
      color: 'green' as const,
    },
  ];

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`${ds.typography.h1} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
            Recetario de Comidas
          </h1>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mt-2`}>
            Catálogo reutilizable de recetas y comidas guardadas con valor nutricional completo
          </p>
        </div>
      </div>

      <MetricCards data={metricas} />

      <Card variant="hover" padding="md">
        <Tabs items={tabs} activeTab={tabActiva} onTabChange={setTabActiva} variant="pills" />
      </Card>

      <div>{renderTabContent()}</div>

      <Modal
        isOpen={mostrarCrear}
        onClose={() => {
          setMostrarCrear(false);
          setRecetaSeleccionada(null);
        }}
        title="Nueva Receta"
        size="xl"
      >
        <CreadorReceta
          onGuardar={handleGuardar}
          onCancelar={() => {
            setMostrarCrear(false);
            setRecetaSeleccionada(null);
          }}
        />
      </Modal>

      <Modal
        isOpen={mostrarEditar}
        onClose={() => {
          setMostrarEditar(false);
          setRecetaSeleccionada(null);
        }}
        title="Editar Receta"
        size="xl"
      >
        {recetaSeleccionada && (
          <CreadorReceta
            receta={recetaSeleccionada}
            onGuardar={handleGuardar}
            onCancelar={() => {
              setMostrarEditar(false);
              setRecetaSeleccionada(null);
            }}
          />
        )}
      </Modal>

      <Modal
        isOpen={mostrarVer}
        onClose={() => {
          setMostrarVer(false);
          setRecetaSeleccionada(null);
        }}
        title={recetaSeleccionada?.nombre || 'Ver Receta'}
        size="xl"
      >
        {recetaSeleccionada && (
          <VisorReceta
            receta={recetaSeleccionada}
            onEditar={() => {
              setMostrarVer(false);
              setMostrarEditar(true);
            }}
            onCompartir={() => handleCompartir(recetaSeleccionada)}
            onToggleFavorito={() => handleToggleFavorito(recetaSeleccionada)}
          />
        )}
      </Modal>
    </div>
  );
}

