import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { 
  MessageSquare, 
  AtSign, 
  User, 
  Stethoscope, 
  Dumbbell,
  Brain,
  UserCircle,
  CheckCircle2,
  X,
  Send,
  AlertCircle,
  Loader2,
  Plus,
  Trash2,
} from 'lucide-react';
import type { 
  ComentarioProfesional, 
  MencionProfesional, 
  TipoProfesional,
  TipoComida 
} from '../types';
import { 
  getComentariosProfesionales,
  getComentariosPorComida,
  crearComentarioProfesional,
  marcarComentarioResuelto,
  agregarRespuestaComentario,
  eliminarComentarioProfesional,
  getProfesionalesDisponibles,
} from '../api/comentariosProfesionales';
import { useAuth } from '../../../context/AuthContext';

interface ComentariosProfesionalesProps {
  dietaId: string;
  clienteId: string;
  comidaId?: string;
  dia?: string;
  tipoComida?: TipoComida;
  onComentarioCreado?: () => void;
}

export const ComentariosProfesionales: React.FC<ComentariosProfesionalesProps> = ({
  dietaId,
  clienteId,
  comidaId,
  dia,
  tipoComida,
  onComentarioCreado,
}) => {
  const { user } = useAuth();
  const [comentarios, setComentarios] = useState<ComentarioProfesional[]>([]);
  const [profesionales, setProfesionales] = useState<MencionProfesional[]>([]);
  const [cargando, setCargando] = useState(false);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [nuevoComentario, setNuevoComentario] = useState({
    contenido: '',
    menciones: [] as string[],
    prioridad: 'media' as 'alta' | 'media' | 'baja',
  });
  const [respondiendoA, setRespondiendoA] = useState<string | null>(null);
  const [respuestaTexto, setRespuestaTexto] = useState('');

  useEffect(() => {
    cargarDatos();
  }, [dietaId, comidaId]);

  const cargarDatos = async () => {
    setCargando(true);
    try {
      const [comentariosData, profesionalesData] = await Promise.all([
        comidaId 
          ? getComentariosPorComida(dietaId, comidaId)
          : getComentariosProfesionales(dietaId),
        getProfesionalesDisponibles(clienteId),
      ]);
      setComentarios(comentariosData);
      setProfesionales(profesionalesData);
    } catch (error) {
      console.error('Error cargando comentarios:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleCrearComentario = async () => {
    if (!nuevoComentario.contenido.trim()) return;

    try {
      const mencionesSeleccionadas = profesionales.filter(p => 
        nuevoComentario.menciones.includes(p.profesionalId)
      );

      await crearComentarioProfesional({
        dietaId,
        clienteId,
        comidaId,
        dia,
        tipoComida,
        contenido: nuevoComentario.contenido,
        menciones: mencionesSeleccionadas,
        prioridad: nuevoComentario.prioridad,
        creadoPor: user?.id || 'dietista-1',
        creadoPorNombre: user?.name || 'Dietista',
      });

      setNuevoComentario({ contenido: '', menciones: [], prioridad: 'media' });
      setMostrarFormulario(false);
      await cargarDatos();
      onComentarioCreado?.();
    } catch (error) {
      console.error('Error creando comentario:', error);
    }
  };

  const handleResponder = async (comentarioId: string) => {
    if (!respuestaTexto.trim()) return;

    try {
      await agregarRespuestaComentario(comentarioId, {
        comentarioId,
        contenido: respuestaTexto,
        respondidoPor: user?.id || 'profesional-1',
        respondidoPorNombre: user?.name || 'Profesional',
        tipoProfesional: 'entrenador', // En producción vendría del perfil del usuario
      });

      setRespuestaTexto('');
      setRespondiendoA(null);
      await cargarDatos();
    } catch (error) {
      console.error('Error respondiendo comentario:', error);
    }
  };

  const handleMarcarResuelto = async (comentarioId: string) => {
    try {
      await marcarComentarioResuelto(comentarioId);
      await cargarDatos();
    } catch (error) {
      console.error('Error marcando comentario como resuelto:', error);
    }
  };

  const handleEliminar = async (comentarioId: string) => {
    if (!confirm('¿Estás seguro de eliminar este comentario?')) return;

    try {
      await eliminarComentarioProfesional(comentarioId);
      await cargarDatos();
    } catch (error) {
      console.error('Error eliminando comentario:', error);
    }
  };

  const toggleMencion = (profesionalId: string) => {
    setNuevoComentario(prev => ({
      ...prev,
      menciones: prev.menciones.includes(profesionalId)
        ? prev.menciones.filter(id => id !== profesionalId)
        : [...prev.menciones, profesionalId],
    }));
  };

  const getIconoTipoProfesional = (tipo: TipoProfesional) => {
    switch (tipo) {
      case 'entrenador':
        return <Dumbbell className="h-4 w-4" />;
      case 'medico':
        return <Stethoscope className="h-4 w-4" />;
      case 'fisioterapeuta':
        return <User className="h-4 w-4" />;
      case 'psicologo':
        return <Brain className="h-4 w-4" />;
      default:
        return <UserCircle className="h-4 w-4" />;
    }
  };

  const getColorPrioridad = (prioridad: 'alta' | 'media' | 'baja') => {
    switch (prioridad) {
      case 'alta':
        return 'bg-red-100 text-red-700 border-red-300';
      case 'media':
        return 'bg-yellow-100 text-yellow-700 border-yellow-300';
      case 'baja':
        return 'bg-blue-100 text-blue-700 border-blue-300';
    }
  };

  if (cargando) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center py-4">
          <Loader2 className="h-5 w-5 animate-spin text-blue-500" />
          <span className="ml-2 text-sm text-gray-600">Cargando comentarios...</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5 text-blue-500" />
          <h4 className="font-semibold text-sm text-gray-900">
            Comentarios para Profesionales
          </h4>
          {comentarios.length > 0 && (
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
              {comentarios.length}
            </span>
          )}
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setMostrarFormulario(!mostrarFormulario)}
        >
          <Plus className="h-4 w-4 mr-1" />
          Nuevo comentario
        </Button>
      </div>

      {/* Formulario de nuevo comentario */}
      {mostrarFormulario && (
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 space-y-3">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Comentario
            </label>
            <textarea
              value={nuevoComentario.contenido}
              onChange={(e) => setNuevoComentario(prev => ({ ...prev, contenido: e.target.value }))}
              placeholder="Escribe un comentario para coordinar con otros profesionales..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-2">
              Mencionar profesionales
            </label>
            <div className="flex flex-wrap gap-2">
              {profesionales.map((profesional) => (
                <button
                  key={profesional.profesionalId}
                  onClick={() => toggleMencion(profesional.profesionalId)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs border transition-colors ${
                    nuevoComentario.menciones.includes(profesional.profesionalId)
                      ? 'bg-blue-100 border-blue-300 text-blue-700'
                      : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  {getIconoTipoProfesional(profesional.tipo)}
                  <span>{profesional.profesionalNombre}</span>
                  {nuevoComentario.menciones.includes(profesional.profesionalId) && (
                    <CheckCircle2 className="h-3 w-3" />
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">
              Prioridad
            </label>
            <select
              value={nuevoComentario.prioridad}
              onChange={(e) => setNuevoComentario(prev => ({ 
                ...prev, 
                prioridad: e.target.value as 'alta' | 'media' | 'baja' 
              }))}
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          <div className="flex gap-2">
            <Button
              variant="primary"
              size="sm"
              onClick={handleCrearComentario}
              disabled={!nuevoComentario.contenido.trim()}
            >
              <Send className="h-4 w-4 mr-1" />
              Enviar
            </Button>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => {
                setMostrarFormulario(false);
                setNuevoComentario({ contenido: '', menciones: [], prioridad: 'media' });
              }}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {/* Lista de comentarios */}
      {comentarios.length === 0 && !mostrarFormulario ? (
        <div className="text-center py-8 text-sm text-gray-500">
          <MessageSquare className="h-8 w-8 mx-auto mb-2 text-gray-300" />
          <p>No hay comentarios aún</p>
          <p className="text-xs mt-1">Crea un comentario para coordinar con otros profesionales</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comentarios.map((comentario) => (
            <div
              key={comentario.id}
              className={`p-3 rounded-lg border ${
                comentario.resuelto
                  ? 'bg-gray-50 border-gray-200'
                  : comentario.prioridad === 'alta'
                  ? 'bg-red-50 border-red-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-gray-900">
                      {comentario.creadoPorNombre || 'Dietista'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {new Date(comentario.creadoEn).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {comentario.prioridad && (
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${getColorPrioridad(comentario.prioridad)}`}>
                        {comentario.prioridad}
                      </span>
                    )}
                    {comentario.resuelto && (
                      <span className="text-xs px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                        Resuelto
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-700 mb-2">{comentario.contenido}</p>
                  
                  {/* Menciones */}
                  {comentario.menciones.length > 0 && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {comentario.menciones.map((mencion) => (
                        <div
                          key={mencion.profesionalId}
                          className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-700 rounded-full text-xs"
                        >
                          <AtSign className="h-3 w-3" />
                          {getIconoTipoProfesional(mencion.tipo)}
                          <span>{mencion.profesionalNombre}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                {!comentario.resuelto && (
                  <button
                    onClick={() => handleEliminar(comentario.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>

              {/* Respuestas */}
              {comentario.respuestas && comentario.respuestas.length > 0 && (
                <div className="ml-4 mt-2 space-y-2 border-l-2 border-gray-200 pl-3">
                  {comentario.respuestas.map((respuesta) => (
                    <div key={respuesta.id} className="text-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-gray-900">
                          {respuesta.respondidoPorNombre}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(respuesta.creadoEn).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </span>
                      </div>
                      <p className="text-gray-700">{respuesta.contenido}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Formulario de respuesta */}
              {respondiendoA === comentario.id ? (
                <div className="mt-2 space-y-2">
                  <textarea
                    value={respuestaTexto}
                    onChange={(e) => setRespuestaTexto(e.target.value)}
                    placeholder="Escribe tu respuesta..."
                    className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={2}
                  />
                  <div className="flex gap-2">
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleResponder(comentario.id)}
                      disabled={!respuestaTexto.trim()}
                    >
                      <Send className="h-4 w-4 mr-1" />
                      Responder
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        setRespondiendoA(null);
                        setRespuestaTexto('');
                      }}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                !comentario.resuelto && (
                  <div className="flex gap-2 mt-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => setRespondiendoA(comentario.id)}
                    >
                      <MessageSquare className="h-3 w-3 mr-1" />
                      Responder
                    </Button>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleMarcarResuelto(comentario.id)}
                    >
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                      Marcar resuelto
                    </Button>
                  </div>
                )
              )}
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};

