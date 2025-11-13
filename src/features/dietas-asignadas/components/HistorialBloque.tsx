import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../../../components/componentsreutilizables';
import {
  History,
  MessageSquare,
  FileText,
  Edit,
  ThumbsUp,
  Users,
  GitBranch,
  Clock,
  User,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import type { HistorialBloque, EntradaHistorialBloque, TipoEntradaHistorial } from '../types';
import { getHistorialBloque, agregarDecisionHistorial } from '../api/historialBloque';

interface HistorialBloqueProps {
  bloqueId: string;
  bloqueNombre?: string;
  dietaId: string;
  onClose?: () => void;
}

const iconosPorTipo: Record<TipoEntradaHistorial, React.ReactNode> = {
  'comentario-profesional': <MessageSquare className="w-4 h-4" />,
  'nota-bloque': <FileText className="w-4 h-4" />,
  'cambio-dieta': <Edit className="w-4 h-4" />,
  'feedback-cliente': <ThumbsUp className="w-4 h-4" />,
  'decision-dietista': <User className="w-4 h-4" />,
  'sugerencia-colaborador': <Users className="w-4 h-4" />,
  'version-plan': <GitBranch className="w-4 h-4" />,
};

const coloresPorTipo: Record<TipoEntradaHistorial, string> = {
  'comentario-profesional': 'bg-blue-100 text-blue-800 border-blue-200',
  'nota-bloque': 'bg-purple-100 text-purple-800 border-purple-200',
  'cambio-dieta': 'bg-orange-100 text-orange-800 border-orange-200',
  'feedback-cliente': 'bg-green-100 text-green-800 border-green-200',
  'decision-dietista': 'bg-indigo-100 text-indigo-800 border-indigo-200',
  'sugerencia-colaborador': 'bg-pink-100 text-pink-800 border-pink-200',
  'version-plan': 'bg-gray-100 text-gray-800 border-gray-200',
};

const etiquetasPorTipo: Record<TipoEntradaHistorial, string> = {
  'comentario-profesional': 'Comentario',
  'nota-bloque': 'Nota',
  'cambio-dieta': 'Cambio',
  'feedback-cliente': 'Feedback',
  'decision-dietista': 'Decisión',
  'sugerencia-colaborador': 'Sugerencia',
  'version-plan': 'Versión',
};

export const HistorialBloque: React.FC<HistorialBloqueProps> = ({
  bloqueId,
  bloqueNombre,
  dietaId,
  onClose,
}) => {
  const [historial, setHistorial] = useState<HistorialBloque | null>(null);
  const [cargando, setCargando] = useState(true);
  const [mostrarFormularioDecision, setMostrarFormularioDecision] = useState(false);
  const [decisionTexto, setDecisionTexto] = useState('');
  const [razonDecision, setRazonDecision] = useState('');
  const [entradasExpandidas, setEntradasExpandidas] = useState<Set<string>>(new Set());

  useEffect(() => {
    cargarHistorial();
  }, [bloqueId, dietaId]);

  const cargarHistorial = async () => {
    setCargando(true);
    try {
      const historialData = await getHistorialBloque(bloqueId, dietaId);
      setHistorial(historialData);
    } catch (error) {
      console.error('Error cargando historial:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleAgregarDecision = async () => {
    if (!decisionTexto.trim()) return;

    try {
      const nuevaEntrada = await agregarDecisionHistorial(bloqueId, decisionTexto, razonDecision);
      // Recargar historial
      await cargarHistorial();
      setMostrarFormularioDecision(false);
      setDecisionTexto('');
      setRazonDecision('');
    } catch (error) {
      console.error('Error agregando decisión:', error);
      alert('Error al agregar la decisión. Por favor, intenta de nuevo.');
    }
  };

  const toggleExpandirEntrada = (entradaId: string) => {
    const nuevasExpandidas = new Set(entradasExpandidas);
    if (nuevasExpandidas.has(entradaId)) {
      nuevasExpandidas.delete(entradaId);
    } else {
      nuevasExpandidas.add(entradaId);
    }
    setEntradasExpandidas(nuevasExpandidas);
  };

  const formatearFecha = (fecha: string) => {
    const fechaObj = new Date(fecha);
    const ahora = new Date();
    const diffMs = ahora.getTime() - fechaObj.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Hace un momento';
    if (diffMins < 60) return `Hace ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    
    return fechaObj.toLocaleDateString('es-ES', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (cargando) {
    return (
      <div className="p-4 text-center">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-sm text-gray-600">Cargando historial...</p>
      </div>
    );
  }

  if (!historial || historial.totalEntradas === 0) {
    return (
      <div className="p-6 text-center">
        <History className="w-12 h-12 mx-auto text-gray-400 mb-3" />
        <p className="text-gray-600 mb-4">No hay historial disponible para este bloque.</p>
        <Button
          onClick={() => setMostrarFormularioDecision(true)}
          variant="outline"
          size="sm"
        >
          Agregar decisión
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Encabezado */}
      <div className="flex items-center justify-between border-b pb-3">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
            <History className="w-5 h-5" />
            Historial del Bloque
          </h3>
          {bloqueNombre && (
            <p className="text-sm text-gray-600 mt-1">{bloqueNombre}</p>
          )}
          <p className="text-xs text-gray-500 mt-1">
            {historial.totalEntradas} entrada{historial.totalEntradas !== 1 ? 's' : ''} en total
          </p>
        </div>
        <Button
          onClick={() => setMostrarFormularioDecision(true)}
          size="sm"
          variant="outline"
        >
          Agregar decisión
        </Button>
      </div>

      {/* Timeline de entradas */}
      <div className="space-y-3">
        {historial.entradas.map((entrada, index) => {
          const estaExpandida = entradasExpandidas.has(entrada.id);
          const tieneDetalles = entrada.datos && Object.keys(entrada.datos).length > 0;

          return (
            <div
              key={entrada.id}
              className={`border rounded-lg p-4 ${coloresPorTipo[entrada.tipo]}`}
            >
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-0.5">
                  {iconosPorTipo[entrada.tipo]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-semibold px-2 py-0.5 rounded bg-white/50">
                          {etiquetasPorTipo[entrada.tipo]}
                        </span>
                        <span className="text-xs text-gray-600 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatearFecha(entrada.fecha)}
                        </span>
                      </div>
                      <h4 className="font-semibold text-sm mb-1">{entrada.titulo}</h4>
                      <p className="text-sm mb-2">{entrada.descripcion}</p>
                      
                      {entrada.realizadoPorNombre && (
                        <p className="text-xs text-gray-600 flex items-center gap-1">
                          <User className="w-3 h-3" />
                          {entrada.realizadoPorNombre}
                        </p>
                      )}

                      {/* Detalles expandibles */}
                      {tieneDetalles && (
                        <div className="mt-2">
                          <button
                            onClick={() => toggleExpandirEntrada(entrada.id)}
                            className="text-xs text-gray-600 hover:text-gray-900 flex items-center gap-1"
                          >
                            {estaExpandida ? (
                              <>
                                <ChevronUp className="w-3 h-3" />
                                Ocultar detalles
                              </>
                            ) : (
                              <>
                                <ChevronDown className="w-3 h-3" />
                                Ver detalles
                              </>
                            )}
                          </button>

                          {estaExpandida && entrada.datos && (
                            <div className="mt-2 p-3 bg-white/50 rounded text-xs space-y-2">
                              {entrada.datos.tipoCambio && (
                                <div>
                                  <span className="font-semibold">Tipo de cambio: </span>
                                  {entrada.datos.tipoCambio}
                                </div>
                              )}
                              {entrada.datos.sensacion !== undefined && (
                                <div>
                                  <span className="font-semibold">Sensación: </span>
                                  {entrada.datos.sensacion}/5
                                </div>
                              )}
                              {entrada.datos.saciedad !== undefined && (
                                <div>
                                  <span className="font-semibold">Saciedad: </span>
                                  {entrada.datos.saciedad}/5
                                </div>
                              )}
                              {entrada.datos.estadoSugerencia && (
                                <div>
                                  <span className="font-semibold">Estado: </span>
                                  {entrada.datos.estadoSugerencia}
                                </div>
                              )}
                              {entrada.datos.numeroVersion && (
                                <div>
                                  <span className="font-semibold">Versión: </span>
                                  {entrada.datos.numeroVersion}
                                </div>
                              )}
                              {entrada.datos.mencionaProfesionales && entrada.datos.mencionaProfesionales.length > 0 && (
                                <div>
                                  <span className="font-semibold">Menciona a: </span>
                                  {entrada.datos.mencionaProfesionales.join(', ')}
                                </div>
                              )}
                              {entrada.datos.razon && (
                                <div>
                                  <span className="font-semibold">Razón: </span>
                                  {entrada.datos.razon}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Formulario para agregar decisión */}
      {mostrarFormularioDecision && (
        <Modal
          isOpen={mostrarFormularioDecision}
          onClose={() => {
            setMostrarFormularioDecision(false);
            setDecisionTexto('');
            setRazonDecision('');
          }}
          title="Agregar Decisión"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Decisión
              </label>
              <textarea
                value={decisionTexto}
                onChange={(e) => setDecisionTexto(e.target.value)}
                placeholder="Describe la decisión tomada..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-[100px]"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Razón (opcional)
              </label>
              <textarea
                value={razonDecision}
                onChange={(e) => setRazonDecision(e.target.value)}
                placeholder="Explica la razón de esta decisión..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm min-h-[80px]"
                rows={3}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setMostrarFormularioDecision(false);
                  setDecisionTexto('');
                  setRazonDecision('');
                }}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleAgregarDecision}
                disabled={!decisionTexto.trim()}
              >
                Guardar decisión
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

