import React, { useState, useEffect } from 'react';
import { Card, Button, Modal, Select } from '../../../components/componentsreutilizables';
import type { SelectOption } from '../../../components/componentsreutilizables';
import { Tag, TrendingUp, Heart, X } from 'lucide-react';
import {
  RecursoBiblioteca,
  NivelAdherencia,
  NivelSatisfaccion,
  EtiquetaAdherenciaRecurso,
} from '../types';
import {
  getEtiquetasAdherenciaRecurso,
  guardarEtiquetaAdherencia,
  eliminarEtiquetaAdherencia,
} from '../api/etiquetasAdherencia';

interface EtiquetarAdherenciaProps {
  recurso: RecursoBiblioteca;
  clienteId?: string;
  clienteNombre?: string;
  isOpen: boolean;
  onClose: () => void;
  onEtiquetaGuardada?: (etiqueta: EtiquetaAdherenciaRecurso) => void;
}

const nivelesAdherencia: SelectOption[] = [
  { value: 'excelente', label: 'Excelente' },
  { value: 'muy-bueno', label: 'Muy Bueno' },
  { value: 'bueno', label: 'Bueno' },
  { value: 'regular', label: 'Regular' },
  { value: 'bajo', label: 'Bajo' },
];

const nivelesSatisfaccion: SelectOption[] = [
  { value: 'muy-alto', label: 'Muy Alto' },
  { value: 'alto', label: 'Alto' },
  { value: 'medio', label: 'Medio' },
  { value: 'bajo', label: 'Bajo' },
  { value: 'muy-bajo', label: 'Muy Bajo' },
];

const getNivelAdherenciaColor = (nivel?: NivelAdherencia) => {
  switch (nivel) {
    case 'excelente':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'muy-bueno':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200';
    case 'bueno':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'regular':
      return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'bajo':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

const getNivelSatisfaccionColor = (nivel?: NivelSatisfaccion) => {
  switch (nivel) {
    case 'muy-alto':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    case 'alto':
      return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    case 'medio':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'bajo':
      return 'bg-orange-100 text-orange-800 border-orange-200';
    case 'muy-bajo':
      return 'bg-red-100 text-red-800 border-red-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const EtiquetarAdherencia: React.FC<EtiquetarAdherenciaProps> = ({
  recurso,
  clienteId,
  clienteNombre,
  isOpen,
  onClose,
  onEtiquetaGuardada,
}) => {
  const [nivelAdherencia, setNivelAdherencia] = useState<NivelAdherencia | ''>('');
  const [nivelSatisfaccion, setNivelSatisfaccion] = useState<NivelSatisfaccion | ''>('');
  const [observaciones, setObservaciones] = useState('');
  const [cargando, setCargando] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [etiquetaExistente, setEtiquetaExistente] = useState<EtiquetaAdherenciaRecurso | null>(null);

  useEffect(() => {
    if (isOpen && recurso) {
      cargarEtiqueta();
    }
  }, [isOpen, recurso, clienteId]);

  const cargarEtiqueta = async () => {
    setCargando(true);
    try {
      const etiqueta = await getEtiquetasAdherenciaRecurso(recurso.id, clienteId);
      if (etiqueta) {
        setEtiquetaExistente(etiqueta);
        setNivelAdherencia(etiqueta.nivelAdherencia || '');
        setNivelSatisfaccion(etiqueta.nivelSatisfaccion || '');
        setObservaciones(etiqueta.observaciones || '');
      } else {
        setEtiquetaExistente(null);
        setNivelAdherencia('');
        setNivelSatisfaccion('');
        setObservaciones('');
      }
    } catch (error) {
      console.error('Error cargando etiqueta:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleGuardar = async () => {
    if (!nivelAdherencia && !nivelSatisfaccion) {
      alert('Por favor, selecciona al menos un nivel de adherencia o satisfacción');
      return;
    }

    setGuardando(true);
    try {
      const etiqueta = await guardarEtiquetaAdherencia(recurso.id, {
        nivelAdherencia: nivelAdherencia || undefined,
        nivelSatisfaccion: nivelSatisfaccion || undefined,
        observaciones: observaciones || undefined,
        clienteId,
      });
      
      setEtiquetaExistente(etiqueta);
      onEtiquetaGuardada?.(etiqueta);
      onClose();
    } catch (error) {
      console.error('Error guardando etiqueta:', error);
      alert('Error al guardar la etiqueta. Por favor, intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminar = async () => {
    if (!confirm('¿Eliminar la etiqueta de adherencia/satisfacción?')) {
      return;
    }

    setGuardando(true);
    try {
      const eliminada = await eliminarEtiquetaAdherencia(recurso.id, clienteId);
      if (eliminada) {
        setEtiquetaExistente(null);
        setNivelAdherencia('');
        setNivelSatisfaccion('');
        setObservaciones('');
        onEtiquetaGuardada?.(null as any); // Notificar que se eliminó
        onClose();
      }
    } catch (error) {
      console.error('Error eliminando etiqueta:', error);
      alert('Error al eliminar la etiqueta. Por favor, intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const handleCerrar = () => {
    setNivelAdherencia('');
    setNivelSatisfaccion('');
    setObservaciones('');
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleCerrar}
      title={`Etiquetar Recurso: ${recurso.nombre}`}
      size="md"
    >
      <div className="space-y-6">
        {clienteNombre && (
          <div className="rounded-lg bg-blue-50 border border-blue-200 p-3">
            <p className="text-sm text-blue-800">
              <strong>Cliente:</strong> {clienteNombre}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Esta etiqueta será específica para este cliente
            </p>
          </div>
        )}

        {cargando ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="text-sm text-gray-600 mt-2">Cargando etiqueta...</p>
          </div>
        ) : (
          <>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <TrendingUp className="inline h-4 w-4 mr-2 text-blue-500" />
                  Nivel de Adherencia
                </label>
                <Select
                  value={nivelAdherencia}
                  onChange={(e) => setNivelAdherencia(e.target.value as NivelAdherencia)}
                  options={[{ value: '', label: 'Sin seleccionar' }, ...nivelesAdherencia]}
                  className="w-full"
                />
                {nivelAdherencia && (
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getNivelAdherenciaColor(
                        nivelAdherencia as NivelAdherencia
                      )}`}
                    >
                      {nivelesAdherencia.find((n) => n.value === nivelAdherencia)?.label}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Heart className="inline h-4 w-4 mr-2 text-pink-500" />
                  Nivel de Satisfacción
                </label>
                <Select
                  value={nivelSatisfaccion}
                  onChange={(e) => setNivelSatisfaccion(e.target.value as NivelSatisfaccion)}
                  options={[{ value: '', label: 'Sin seleccionar' }, ...nivelesSatisfaccion]}
                  className="w-full"
                />
                {nivelSatisfaccion && (
                  <div className="mt-2">
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getNivelSatisfaccionColor(
                        nivelSatisfaccion as NivelSatisfaccion
                      )}`}
                    >
                      {nivelesSatisfaccion.find((n) => n.value === nivelSatisfaccion)?.label}
                    </span>
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Observaciones
                </label>
                <textarea
                  value={observaciones}
                  onChange={(e) => setObservaciones(e.target.value)}
                  placeholder="Añade observaciones sobre la adherencia o satisfacción del cliente con este recurso..."
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-200"
                  rows={4}
                />
              </div>
            </div>

            {etiquetaExistente && (
              <div className="rounded-lg bg-gray-50 border border-gray-200 p-3">
                <p className="text-xs text-gray-600">
                  Etiquetado el {new Date(etiquetaExistente.etiquetadoEn).toLocaleDateString('es-ES')}
                  {etiquetaExistente.actualizadoEn !== etiquetaExistente.etiquetadoEn && (
                    <span> · Actualizado el {new Date(etiquetaExistente.actualizadoEn).toLocaleDateString('es-ES')}</span>
                  )}
                </p>
              </div>
            )}

            <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-200">
              <div>
                {etiquetaExistente && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleEliminar}
                    disabled={guardando}
                    leftIcon={<X className="h-4 w-4" />}
                  >
                    Eliminar Etiqueta
                  </Button>
                )}
              </div>
              <div className="flex items-center gap-3">
                <Button variant="ghost" size="sm" onClick={handleCerrar} disabled={guardando}>
                  Cancelar
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleGuardar}
                  disabled={guardando || (!nivelAdherencia && !nivelSatisfaccion)}
                  leftIcon={<Tag className="h-4 w-4" />}
                >
                  {guardando ? 'Guardando...' : 'Guardar Etiqueta'}
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </Modal>
  );
};

