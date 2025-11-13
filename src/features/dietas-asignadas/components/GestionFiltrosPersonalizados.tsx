import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal } from '../../../components/componentsreutilizables';
import {
  Filter,
  Save,
  X,
  Trash2,
  Edit2,
  Clock,
  Star,
} from 'lucide-react';
import {
  FiltroPersonalizado,
  FiltrosBiblioteca,
} from '../types';
import {
  getFiltrosPersonalizados,
  guardarFiltroPersonalizado,
  actualizarFiltroPersonalizado,
  eliminarFiltroPersonalizado,
  usarFiltroPersonalizado,
} from '../api/filtrosPersonalizados';

interface GestionFiltrosPersonalizadosProps {
  filtrosActuales: FiltrosBiblioteca;
  onAplicarFiltros: (filtros: FiltrosBiblioteca) => void;
  className?: string;
}

export const GestionFiltrosPersonalizados: React.FC<GestionFiltrosPersonalizadosProps> = ({
  filtrosActuales,
  onAplicarFiltros,
  className = '',
}) => {
  const [filtrosPersonalizados, setFiltrosPersonalizados] = useState<FiltroPersonalizado[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarModalGuardar, setMostrarModalGuardar] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [filtroEditando, setFiltroEditando] = useState<FiltroPersonalizado | null>(null);
  const [nombreNuevo, setNombreNuevo] = useState('');
  const [descripcionNueva, setDescripcionNueva] = useState('');

  useEffect(() => {
    cargarFiltrosPersonalizados();
  }, []);

  const cargarFiltrosPersonalizados = async () => {
    setCargando(true);
    try {
      const data = await getFiltrosPersonalizados();
      setFiltrosPersonalizados(data);
    } catch (error) {
      console.error('Error cargando filtros personalizados:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleGuardarFiltro = async () => {
    if (!nombreNuevo.trim()) return;

    try {
      await guardarFiltroPersonalizado(nombreNuevo, filtrosActuales, descripcionNueva || undefined);
      await cargarFiltrosPersonalizados();
      setMostrarModalGuardar(false);
      setNombreNuevo('');
      setDescripcionNueva('');
    } catch (error) {
      console.error('Error guardando filtro:', error);
    }
  };

  const handleAplicarFiltro = async (filtro: FiltroPersonalizado) => {
    try {
      await usarFiltroPersonalizado(filtro.id);
      onAplicarFiltros(filtro.filtros);
      await cargarFiltrosPersonalizados();
    } catch (error) {
      console.error('Error aplicando filtro:', error);
    }
  };

  const handleEditarFiltro = async () => {
    if (!filtroEditando || !nombreNuevo.trim()) return;

    try {
      await actualizarFiltroPersonalizado(filtroEditando.id, {
        nombre: nombreNuevo,
        descripcion: descripcionNueva || undefined,
      });
      await cargarFiltrosPersonalizados();
      setMostrarModalEditar(false);
      setFiltroEditando(null);
      setNombreNuevo('');
      setDescripcionNueva('');
    } catch (error) {
      console.error('Error editando filtro:', error);
    }
  };

  const handleEliminarFiltro = async (id: string) => {
    if (!confirm('¿Eliminar este filtro personalizado?')) return;

    try {
      await eliminarFiltroPersonalizado(id);
      await cargarFiltrosPersonalizados();
    } catch (error) {
      console.error('Error eliminando filtro:', error);
    }
  };

  const abrirModalEditar = (filtro: FiltroPersonalizado) => {
    setFiltroEditando(filtro);
    setNombreNuevo(filtro.nombre);
    setDescripcionNueva(filtro.descripcion || '');
    setMostrarModalEditar(true);
  };

  const obtenerResumenFiltros = (filtros: FiltrosBiblioteca): string => {
    const partes: string[] = [];
    
    if (filtros.tiposRecurso && filtros.tiposRecurso.length > 0) {
      partes.push(`Tipos: ${filtros.tiposRecurso.join(', ')}`);
    }
    if (filtros.proteinasMin) {
      partes.push(`P ≥ ${filtros.proteinasMin}g`);
    }
    if (filtros.tiempoPreparacionMax) {
      partes.push(`< ${filtros.tiempoPreparacionMax} min`);
    }
    if (filtros.estilosCulinarios && filtros.estilosCulinarios.length > 0) {
      partes.push(filtros.estilosCulinarios.join(', '));
    }
    if (filtros.restricciones && filtros.restricciones.length > 0) {
      partes.push(`Restricciones: ${filtros.restricciones.length}`);
    }
    if (filtros.caloriasMin || filtros.caloriasMax) {
      const min = filtros.caloriasMin || 0;
      const max = filtros.caloriasMax || '∞';
      partes.push(`${min}-${max} kcal`);
    }

    return partes.length > 0 ? partes.join(' • ') : 'Sin filtros específicos';
  };

  const tieneFiltrosActivos = (): boolean => {
    return Object.keys(filtrosActuales).length > 0 && 
           !(Object.keys(filtrosActuales).length === 1 && filtrosActuales.busqueda === '');
  };

  return (
    <div className={className}>
      {/* Botón para guardar filtros actuales */}
      <div className="mb-4">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setMostrarModalGuardar(true)}
          disabled={!tieneFiltrosActivos()}
          leftIcon={<Save className="h-4 w-4" />}
        >
          Guardar filtros actuales
        </Button>
      </div>

      {/* Lista de filtros personalizados */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Filter className="h-4 w-4" />
            Filtros Guardados
          </h3>
        </div>

        {cargando ? (
          <div className="text-center py-4 text-sm text-slate-500">Cargando...</div>
        ) : filtrosPersonalizados.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500">
            <Filter className="h-8 w-8 mx-auto mb-2 text-slate-400" />
            <p>No tienes filtros guardados</p>
            <p className="text-xs text-slate-400 mt-1">
              Configura filtros y guárdalos para reutilizarlos
            </p>
          </div>
        ) : (
          filtrosPersonalizados
            .sort((a, b) => b.usadoCount - a.usadoCount)
            .map(filtro => (
              <Card
                key={filtro.id}
                className="p-3 border border-slate-200 hover:border-slate-300 transition-colors cursor-pointer"
                onClick={() => handleAplicarFiltro(filtro)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-semibold text-slate-900 truncate">
                        {filtro.nombre}
                      </h4>
                      {filtro.usadoCount > 0 && (
                        <div className="flex items-center gap-1 text-xs text-slate-500">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span>{filtro.usadoCount}</span>
                        </div>
                      )}
                    </div>
                    {filtro.descripcion && (
                      <p className="text-xs text-slate-600 line-clamp-1 mb-2">
                        {filtro.descripcion}
                      </p>
                    )}
                    <div className="text-xs text-slate-500 mb-2">
                      {obtenerResumenFiltros(filtro.filtros)}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="h-3 w-3" />
                      <span>
                        Usado {filtro.usadoCount} {filtro.usadoCount === 1 ? 'vez' : 'veces'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        abrirModalEditar(filtro);
                      }}
                      className="text-xs"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEliminarFiltro(filtro.id);
                      }}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))
        )}
      </div>

      {/* Modal guardar filtro */}
      <Modal
        isOpen={mostrarModalGuardar}
        onClose={() => {
          setMostrarModalGuardar(false);
          setNombreNuevo('');
          setDescripcionNueva('');
        }}
        title="Guardar Filtros Personalizados"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre *
            </label>
            <Input
              value={nombreNuevo}
              onChange={(e) => setNombreNuevo(e.target.value)}
              placeholder="Ej: Recetas altas en proteína veganas < 20 min"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripción
            </label>
            <Input
              value={descripcionNueva}
              onChange={(e) => setDescripcionNueva(e.target.value)}
              placeholder="Descripción opcional"
            />
          </div>
          <div className="bg-slate-50 p-3 rounded-lg">
            <p className="text-xs font-medium text-slate-700 mb-1">Filtros que se guardarán:</p>
            <p className="text-xs text-slate-600">{obtenerResumenFiltros(filtrosActuales)}</p>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                setMostrarModalGuardar(false);
                setNombreNuevo('');
                setDescripcionNueva('');
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleGuardarFiltro} disabled={!nombreNuevo.trim()}>
              Guardar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal editar filtro */}
      <Modal
        isOpen={mostrarModalEditar}
        onClose={() => {
          setMostrarModalEditar(false);
          setFiltroEditando(null);
          setNombreNuevo('');
          setDescripcionNueva('');
        }}
        title="Editar Filtro Personalizado"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre *
            </label>
            <Input
              value={nombreNuevo}
              onChange={(e) => setNombreNuevo(e.target.value)}
              placeholder="Ej: Recetas altas en proteína veganas < 20 min"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Descripción
            </label>
            <Input
              value={descripcionNueva}
              onChange={(e) => setDescripcionNueva(e.target.value)}
              placeholder="Descripción opcional"
            />
          </div>
          {filtroEditando && (
            <div className="bg-slate-50 p-3 rounded-lg">
              <p className="text-xs font-medium text-slate-700 mb-1">Filtros guardados:</p>
              <p className="text-xs text-slate-600">{obtenerResumenFiltros(filtroEditando.filtros)}</p>
            </div>
          )}
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                setMostrarModalEditar(false);
                setFiltroEditando(null);
                setNombreNuevo('');
                setDescripcionNueva('');
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleEditarFiltro} disabled={!nombreNuevo.trim()}>
              Guardar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

