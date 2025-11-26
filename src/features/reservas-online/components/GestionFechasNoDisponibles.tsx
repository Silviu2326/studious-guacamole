import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Input } from '../../../components/componentsreutilizables/Input';
import { Calendar, X, Plus, Save, AlertCircle, CheckCircle, Trash2 } from 'lucide-react';
import {
  getFechasNoDisponibles,
  marcarFechaNoDisponible,
  desmarcarFechaNoDisponible,
  FechaNoDisponible,
} from '../api/fechasNoDisponibles';

interface GestionFechasNoDisponiblesProps {
  entrenadorId: string;
}

export const GestionFechasNoDisponibles: React.FC<GestionFechasNoDisponiblesProps> = ({
  entrenadorId,
}) => {
  const [fechasNoDisponibles, setFechasNoDisponibles] = useState<FechaNoDisponible[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [fechaSeleccionada, setFechaSeleccionada] = useState('');
  const [motivo, setMotivo] = useState('');
  const [mensajeExito, setMensajeExito] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    cargarFechasNoDisponibles();
  }, [entrenadorId]);

  const cargarFechasNoDisponibles = async () => {
    setLoading(true);
    try {
      // Cargar fechas del próximo año
      const fechaInicio = new Date();
      const fechaFin = new Date();
      fechaFin.setFullYear(fechaFin.getFullYear() + 1);
      
      const fechas = await getFechasNoDisponibles(entrenadorId, fechaInicio, fechaFin);
      setFechasNoDisponibles(fechas);
    } catch (error) {
      console.error('Error cargando fechas no disponibles:', error);
      setError('Error al cargar las fechas no disponibles');
    } finally {
      setLoading(false);
    }
  };

  const handleAgregarFecha = async () => {
    if (!fechaSeleccionada) {
      setError('Por favor, selecciona una fecha');
      return;
    }

    setError(null);
    setGuardando(true);

    try {
      const fecha = new Date(fechaSeleccionada);
      await marcarFechaNoDisponible(entrenadorId, fecha, motivo || undefined);
      setMensajeExito('Fecha marcada como no disponible correctamente');
      setFechaSeleccionada('');
      setMotivo('');
      setMostrarFormulario(false);
      await cargarFechasNoDisponibles();
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (error) {
      console.error('Error marcando fecha como no disponible:', error);
      setError('Error al marcar la fecha como no disponible');
    } finally {
      setGuardando(false);
    }
  };

  const handleEliminarFecha = async (fechaId: string) => {
    setGuardando(true);
    setError(null);

    try {
      await desmarcarFechaNoDisponible(entrenadorId, fechaId);
      setMensajeExito('Fecha eliminada correctamente');
      await cargarFechasNoDisponibles();
      setTimeout(() => setMensajeExito(null), 3000);
    } catch (error) {
      console.error('Error eliminando fecha no disponible:', error);
      setError('Error al eliminar la fecha');
    } finally {
      setGuardando(false);
    }
  };

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Cargando fechas no disponibles...</p>
      </Card>
    );
  }

  return (
    <Card className="bg-white shadow-sm">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-blue-600" />
            <div>
              <h3 className="text-xl font-bold text-gray-900">Fechas No Disponibles</h3>
              <p className="text-sm text-gray-600 mt-1">
                Marca fechas específicas como no disponibles para que no se puedan hacer reservas en esos días
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            onClick={() => setMostrarFormulario(!mostrarFormulario)}
            iconLeft={Plus}
          >
            Agregar Fecha
          </Button>
        </div>

        {mensajeExito && (
          <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-600" />
            <p className="text-sm text-green-800">{mensajeExito}</p>
          </div>
        )}

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {mostrarFormulario && (
          <div className="mb-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="text-lg font-semibold text-gray-900 mb-4">Agregar Fecha No Disponible</h4>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Fecha
                </label>
                <input
                  type="date"
                  value={fechaSeleccionada}
                  onChange={(e) => setFechaSeleccionada(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <Input
                label="Motivo (opcional)"
                value={motivo}
                onChange={(e) => setMotivo(e.target.value)}
                placeholder="Ej: Vacaciones, Día festivo, etc."
              />
              <div className="flex gap-3">
                <Button
                  variant="primary"
                  onClick={handleAgregarFecha}
                  disabled={guardando || !fechaSeleccionada}
                  loading={guardando}
                  iconLeft={Save}
                >
                  Guardar
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => {
                    setMostrarFormulario(false);
                    setFechaSeleccionada('');
                    setMotivo('');
                    setError(null);
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          </div>
        )}

        {fechasNoDisponibles.length === 0 ? (
          <div className="text-center py-8">
            <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No hay fechas marcadas como no disponibles</p>
            <p className="text-sm text-gray-500 mt-2">
              Agrega fechas para bloquear reservas en días específicos
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {fechasNoDisponibles
              .sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime())
              .map((fecha) => (
                <div
                  key={fecha.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-4">
                    <Calendar className="w-5 h-5 text-gray-600" />
                    <div>
                      <p className="font-semibold text-gray-900">
                        {new Date(fecha.fecha).toLocaleDateString('es-ES', {
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      {fecha.motivo && (
                        <p className="text-sm text-gray-600 mt-1">{fecha.motivo}</p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => handleEliminarFecha(fecha.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                    title="Eliminar fecha"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
          </div>
        )}
      </div>
    </Card>
  );
};


