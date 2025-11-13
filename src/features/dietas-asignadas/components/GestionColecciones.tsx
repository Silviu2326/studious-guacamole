import React, { useState, useEffect } from 'react';
import { Card, Button, Input, Modal } from '../../../components/componentsreutilizables';
import {
  FolderPlus,
  Folder,
  X,
  Plus,
  Trash2,
  Edit2,
  Pin,
  PinOff,
  Bookmark,
  BookmarkCheck,
} from 'lucide-react';
import {
  ColeccionRecursos,
  TipoRecurso,
} from '../types';
import {
  getColecciones,
  crearColeccion,
  actualizarColeccion,
  eliminarColeccion,
  agregarRecursoAColeccion,
  removerRecursoDeColeccion,
  toggleFavoritoRecurso,
} from '../api/colecciones';

interface GestionColeccionesProps {
  recursoId?: string;
  tipoRecurso?: TipoRecurso;
  onRecursoSeleccionado?: (recursoId: string, tipo: TipoRecurso) => void;
  className?: string;
}

const coloresDisponibles = [
  { nombre: 'Azul', valor: '#3B82F6' },
  { nombre: 'Verde', valor: '#10B981' },
  { nombre: 'Rojo', valor: '#EF4444' },
  { nombre: 'Amarillo', valor: '#F59E0B' },
  { nombre: 'Púrpura', valor: '#8B5CF6' },
  { nombre: 'Rosa', valor: '#EC4899' },
  { nombre: 'Indigo', valor: '#6366F1' },
  { nombre: 'Cian', valor: '#06B6D4' },
];

export const GestionColecciones: React.FC<GestionColeccionesProps> = ({
  recursoId,
  tipoRecurso,
  onRecursoSeleccionado,
  className = '',
}) => {
  const [colecciones, setColecciones] = useState<ColeccionRecursos[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarModalCrear, setMostrarModalCrear] = useState(false);
  const [mostrarModalEditar, setMostrarModalEditar] = useState(false);
  const [coleccionEditando, setColeccionEditando] = useState<ColeccionRecursos | null>(null);
  const [nombreNueva, setNombreNueva] = useState('');
  const [descripcionNueva, setDescripcionNueva] = useState('');
  const [colorSeleccionado, setColorSeleccionado] = useState('#3B82F6');
  const [recursoFavorito, setRecursoFavorito] = useState(false);

  useEffect(() => {
    cargarColecciones();
    if (recursoId && tipoRecurso) {
      verificarFavorito();
    }
  }, [recursoId, tipoRecurso]);

  const cargarColecciones = async () => {
    setCargando(true);
    try {
      const data = await getColecciones();
      setColecciones(data);
    } catch (error) {
      console.error('Error cargando colecciones:', error);
    } finally {
      setCargando(false);
    }
  };

  const verificarFavorito = async () => {
    // En producción, verificaríamos si el recurso está marcado como favorito
    setRecursoFavorito(false);
  };

  const handleCrearColeccion = async () => {
    if (!nombreNueva.trim()) return;

    try {
      const nueva = await crearColeccion(nombreNueva, descripcionNueva || undefined, colorSeleccionado);
      setColecciones([...colecciones, nueva]);
      setMostrarModalCrear(false);
      setNombreNueva('');
      setDescripcionNueva('');
      setColorSeleccionado('#3B82F6');

      // Si hay un recurso seleccionado, agregarlo automáticamente
      if (recursoId && tipoRecurso) {
        await agregarRecursoAColeccion(nueva.id, recursoId, tipoRecurso);
        await cargarColecciones();
      }
    } catch (error) {
      console.error('Error creando colección:', error);
    }
  };

  const handleEditarColeccion = async () => {
    if (!coleccionEditando || !nombreNueva.trim()) return;

    try {
      const actualizada = await actualizarColeccion(coleccionEditando.id, {
        nombre: nombreNueva,
        descripcion: descripcionNueva || undefined,
        color: colorSeleccionado,
      });
      if (actualizada) {
        await cargarColecciones();
        setMostrarModalEditar(false);
        setColeccionEditando(null);
        setNombreNueva('');
        setDescripcionNueva('');
      }
    } catch (error) {
      console.error('Error editando colección:', error);
    }
  };

  const handleEliminarColeccion = async (id: string) => {
    if (!confirm('¿Eliminar esta colección?')) return;

    try {
      await eliminarColeccion(id);
      await cargarColecciones();
    } catch (error) {
      console.error('Error eliminando colección:', error);
    }
  };

  const handleToggleFavorito = async () => {
    if (!recursoId || !tipoRecurso) return;

    try {
      const nuevoEstado = !recursoFavorito;
      await toggleFavoritoRecurso(recursoId, tipoRecurso, nuevoEstado);
      setRecursoFavorito(nuevoEstado);
    } catch (error) {
      console.error('Error cambiando favorito:', error);
    }
  };

  const handleAgregarAColeccion = async (coleccionId: string) => {
    if (!recursoId || !tipoRecurso) return;

    try {
      await agregarRecursoAColeccion(coleccionId, recursoId, tipoRecurso);
      await cargarColecciones();
    } catch (error) {
      console.error('Error agregando a colección:', error);
    }
  };

  const handleRemoverDeColeccion = async (coleccionId: string) => {
    if (!recursoId || !tipoRecurso) return;

    try {
      await removerRecursoDeColeccion(coleccionId, recursoId, tipoRecurso);
      await cargarColecciones();
    } catch (error) {
      console.error('Error removiendo de colección:', error);
    }
  };

  const abrirModalEditar = (coleccion: ColeccionRecursos) => {
    setColeccionEditando(coleccion);
    setNombreNueva(coleccion.nombre);
    setDescripcionNueva(coleccion.descripcion || '');
    setColorSeleccionado(coleccion.color || '#3B82F6');
    setMostrarModalEditar(true);
  };

  const estaEnColeccion = (coleccion: ColeccionRecursos): boolean => {
    if (!recursoId || !tipoRecurso) return false;
    return coleccion.recursos.some(r => r.id === recursoId && r.tipo === tipoRecurso);
  };

  return (
    <div className={className}>
      {/* Botón para anclar como favorito */}
      {recursoId && tipoRecurso && (
        <div className="mb-4">
          <Button
            variant={recursoFavorito ? 'secondary' : 'ghost'}
            size="sm"
            onClick={handleToggleFavorito}
            leftIcon={recursoFavorito ? <Pin className="h-4 w-4" /> : <PinOff className="h-4 w-4" />}
          >
            {recursoFavorito ? 'Desanclar favorito' : 'Anclar como favorito'}
          </Button>
        </div>
      )}

      {/* Lista de colecciones */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <Folder className="h-4 w-4" />
            Mis Colecciones
          </h3>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setMostrarModalCrear(true)}
            leftIcon={<Plus className="h-4 w-4" />}
          >
            Nueva
          </Button>
        </div>

        {cargando ? (
          <div className="text-center py-4 text-sm text-slate-500">Cargando...</div>
        ) : colecciones.length === 0 ? (
          <div className="text-center py-8 text-sm text-slate-500">
            <FolderPlus className="h-8 w-8 mx-auto mb-2 text-slate-400" />
            <p>No tienes colecciones aún</p>
            <p className="text-xs text-slate-400 mt-1">Crea una para organizar tus recursos favoritos</p>
          </div>
        ) : (
          colecciones.map(coleccion => {
            const estaAgregado = estaEnColeccion(coleccion);
            return (
              <Card
                key={coleccion.id}
                className="p-3 border border-slate-200 hover:border-slate-300 transition-colors"
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ backgroundColor: coleccion.color || '#3B82F6' }}
                      />
                      <h4 className="text-sm font-semibold text-slate-900 truncate">
                        {coleccion.nombre}
                      </h4>
                      {estaAgregado && (
                        <BookmarkCheck className="h-4 w-4 text-green-500 flex-shrink-0" />
                      )}
                    </div>
                    {coleccion.descripcion && (
                      <p className="text-xs text-slate-600 line-clamp-1 mb-2">
                        {coleccion.descripcion}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-slate-500">
                      <span>{coleccion.recursos.length} recursos</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    {recursoId && tipoRecurso && (
                      <Button
                        variant={estaAgregado ? 'secondary' : 'ghost'}
                        size="sm"
                        onClick={() =>
                          estaAgregado
                            ? handleRemoverDeColeccion(coleccion.id)
                            : handleAgregarAColeccion(coleccion.id)
                        }
                        className="text-xs"
                      >
                        {estaAgregado ? (
                          <>
                            <X className="h-3 w-3 mr-1" />
                            Quitar
                          </>
                        ) : (
                          <>
                            <Plus className="h-3 w-3 mr-1" />
                            Agregar
                          </>
                        )}
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => abrirModalEditar(coleccion)}
                      className="text-xs"
                    >
                      <Edit2 className="h-3 w-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEliminarColeccion(coleccion.id)}
                      className="text-xs text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </Card>
            );
          })
        )}
      </div>

      {/* Modal crear colección */}
      <Modal
        isOpen={mostrarModalCrear}
        onClose={() => {
          setMostrarModalCrear(false);
          setNombreNueva('');
          setDescripcionNueva('');
        }}
        title="Nueva Colección"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre *
            </label>
            <Input
              value={nombreNueva}
              onChange={(e) => setNombreNueva(e.target.value)}
              placeholder="Ej: Recetas Rápidas"
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {coloresDisponibles.map(color => (
                <button
                  key={color.valor}
                  onClick={() => setColorSeleccionado(color.valor)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    colorSeleccionado === color.valor
                      ? 'border-slate-900 scale-110'
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                  style={{ backgroundColor: color.valor }}
                  title={color.nombre}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                setMostrarModalCrear(false);
                setNombreNueva('');
                setDescripcionNueva('');
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleCrearColeccion} disabled={!nombreNueva.trim()}>
              Crear
            </Button>
          </div>
        </div>
      </Modal>

      {/* Modal editar colección */}
      <Modal
        isOpen={mostrarModalEditar}
        onClose={() => {
          setMostrarModalEditar(false);
          setColeccionEditando(null);
          setNombreNueva('');
          setDescripcionNueva('');
        }}
        title="Editar Colección"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Nombre *
            </label>
            <Input
              value={nombreNueva}
              onChange={(e) => setNombreNueva(e.target.value)}
              placeholder="Ej: Recetas Rápidas"
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
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Color
            </label>
            <div className="flex flex-wrap gap-2">
              {coloresDisponibles.map(color => (
                <button
                  key={color.valor}
                  onClick={() => setColorSeleccionado(color.valor)}
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    colorSeleccionado === color.valor
                      ? 'border-slate-900 scale-110'
                      : 'border-slate-300 hover:border-slate-400'
                  }`}
                  style={{ backgroundColor: color.valor }}
                  title={color.nombre}
                />
              ))}
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-2">
            <Button
              variant="ghost"
              onClick={() => {
                setMostrarModalEditar(false);
                setColeccionEditando(null);
                setNombreNueva('');
                setDescripcionNueva('');
              }}
            >
              Cancelar
            </Button>
            <Button onClick={handleEditarColeccion} disabled={!nombreNueva.trim()}>
              Guardar
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

