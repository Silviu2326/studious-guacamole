import React, { useState, useEffect, useRef } from 'react';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';
import { Tooltip } from '../../../components/componentsreutilizables';
import { 
  HelpCircle, 
  Video, 
  X, 
  Play, 
  CheckCircle2, 
  Settings,
  BookOpen,
  Sparkles
} from 'lucide-react';
import type { ContenidoEntrenamiento, EstadoEntrenamiento } from '../types';
import {
  getEstadoEntrenamiento,
  getContenidoEntrenamiento,
  getContenidoPorFeature,
  marcarContenidoVisto,
  actualizarPreferenciasEntrenamiento,
} from '../api/entrenamientoContextual';
import { useAuth } from '../../../context/AuthContext';

interface EntrenamientoContextualProps {
  featureId?: string; // ID de la función para mostrar entrenamiento específico
  children: React.ReactNode;
  className?: string;
}

interface VideoPlayerProps {
  video: ContenidoEntrenamiento['contenido']['video'];
  onClose: () => void;
  onComplete: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ video, onClose, onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      setCurrentTime(videoElement.currentTime);
      // Marcar como completo si se ha visto el 90%
      if (videoElement.currentTime / videoElement.duration > 0.9) {
        onComplete();
      }
    };

    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    return () => videoElement.removeEventListener('timeupdate', handleTimeUpdate);
  }, [onComplete]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (playing) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setPlaying(!playing);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="relative bg-black rounded-lg overflow-hidden">
      <video
        ref={videoRef}
        src={video?.url}
        className="w-full max-h-[60vh]"
        controls={false}
        onPlay={() => setPlaying(true)}
        onPause={() => setPlaying(false)}
      >
        {video?.subtitulos && <track kind="subtitles" src={video.subtitulos} default />}
        Tu navegador no soporta la reproducción de video.
      </video>
      
      <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
        {!playing && (
          <button
            onClick={togglePlay}
            className="bg-white bg-opacity-90 rounded-full p-4 hover:bg-opacity-100 transition-all"
            aria-label="Reproducir video"
          >
            <Play className="w-8 h-8 text-gray-900" fill="currentColor" />
          </button>
        )}
      </div>

      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-4">
        <div className="flex items-center justify-between text-white text-sm">
          <span>{formatTime(currentTime)} / {formatTime(video?.duracion || 0)}</span>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white hover:bg-opacity-20 rounded"
            aria-label="Cerrar video"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export const EntrenamientoContextual: React.FC<EntrenamientoContextualProps> = ({
  featureId,
  children,
  className = '',
}) => {
  const { user } = useAuth();
  const [estado, setEstado] = useState<EstadoEntrenamiento | null>(null);
  const [contenido, setContenido] = useState<ContenidoEntrenamiento | null>(null);
  const [mostrarVideo, setMostrarVideo] = useState(false);
  const [mostrarConfiguracion, setMostrarConfiguracion] = useState(false);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (user?.id && featureId) {
      cargarDatos();
    }
  }, [user?.id, featureId]);

  const cargarDatos = async () => {
    if (!user?.id || !featureId) return;

    setCargando(true);
    try {
      const [estadoData, contenidoData] = await Promise.all([
        getEstadoEntrenamiento(user.id),
        getContenidoPorFeature(featureId),
      ]);

      setEstado(estadoData);
      setContenido(contenidoData);
    } catch (error) {
      console.error('Error cargando datos de entrenamiento:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleMostrarTooltip = () => {
    if (!contenido || !estado) return null;

    const tieneTooltip = contenido.tipo === 'tooltip' || contenido.tipo === 'ambos';
    const debeMostrar = estado.preferencias.mostrarTooltips && tieneTooltip;

    if (!debeMostrar || !contenido.contenido.tooltip) return null;

    return (
      <Tooltip
        content={contenido.contenido.tooltip.texto}
        position={contenido.contenido.tooltip.posicion || 'top'}
      >
        <div className="inline-flex items-center">
          {children}
          {!estado.contenidoVisto.includes(contenido.id) && (
            <Sparkles className="w-3 h-3 text-blue-500 ml-1 animate-pulse" />
          )}
        </div>
      </Tooltip>
    );
  };

  const handleAbrirVideo = async () => {
    if (!contenido || !estado || !user?.id) return;

    const tieneVideo = contenido.tipo === 'video' || contenido.tipo === 'ambos';
    if (!tieneVideo || !contenido.contenido.video) return;

    if (estado.preferencias.mostrarVideos) {
      setMostrarVideo(true);
    }
  };

  const handleCompletarVideo = async () => {
    if (!contenido || !user?.id) return;
    await marcarContenidoVisto(user.id, contenido.id);
    if (estado) {
      setEstado({
        ...estado,
        contenidoVisto: [...estado.contenidoVisto, contenido.id],
      });
    }
  };

  const handleMarcarVisto = async () => {
    if (!contenido || !user?.id) return;
    await marcarContenidoVisto(user.id, contenido.id);
    if (estado) {
      setEstado({
        ...estado,
        contenidoVisto: [...estado.contenidoVisto, contenido.id],
      });
    }
  };

  if (cargando || !contenido || !estado) {
    return <>{children}</>;
  }

  const tieneTooltip = contenido.tipo === 'tooltip' || contenido.tipo === 'ambos';
  const tieneVideo = contenido.tipo === 'video' || contenido.tipo === 'ambos';
  const yaVisto = estado.contenidoVisto.includes(contenido.id);
  const mostrarTooltip = estado.preferencias.mostrarTooltips && tieneTooltip;
  const mostrarBotonVideo = estado.preferencias.mostrarVideos && tieneVideo;

  return (
    <>
      <div className={`relative inline-flex items-center group ${className}`}>
        {mostrarTooltip ? (
          handleMostrarTooltip() || <>{children}</>
        ) : (
          <>
            {children}
            {!yaVisto && (
              <button
                onClick={() => {
                  if (tieneVideo) {
                    handleAbrirVideo();
                  } else {
                    handleMarcarVisto();
                  }
                }}
                className="ml-1 p-1 text-blue-500 hover:text-blue-700 rounded"
                aria-label={`Ver entrenamiento: ${contenido.titulo}`}
                title={contenido.titulo}
              >
                <HelpCircle className="w-4 h-4" />
              </button>
            )}
          </>
        )}

        {mostrarBotonVideo && !yaVisto && (
          <button
            onClick={handleAbrirVideo}
            className="ml-1 p-1 text-purple-500 hover:text-purple-700 rounded"
            aria-label={`Ver video tutorial: ${contenido.titulo}`}
            title={`Ver video: ${contenido.titulo}`}
          >
            <Video className="w-4 h-4" />
          </button>
        )}

        <button
          onClick={() => setMostrarConfiguracion(true)}
          className="ml-1 p-1 text-gray-400 hover:text-gray-600 rounded opacity-0 group-hover:opacity-100 transition-opacity"
          aria-label="Configurar entrenamiento"
        >
          <Settings className="w-3 h-3" />
        </button>
      </div>

      {/* Modal de Video */}
      {mostrarVideo && contenido.contenido.video && (
        <Modal
          isOpen={mostrarVideo}
          onClose={() => setMostrarVideo(false)}
          title={contenido.titulo}
          size="large"
        >
          <div className="space-y-4">
            <p className="text-sm text-gray-600">{contenido.descripcion}</p>
            <VideoPlayer
              video={contenido.contenido.video}
              onClose={() => setMostrarVideo(false)}
              onComplete={handleCompletarVideo}
            />
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  handleMarcarVisto();
                  setMostrarVideo(false);
                }}
              >
                Marcar como visto
              </Button>
              <Button onClick={() => setMostrarVideo(false)}>Cerrar</Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Modal de Configuración */}
      {mostrarConfiguracion && estado && (
        <Modal
          isOpen={mostrarConfiguracion}
          onClose={() => setMostrarConfiguracion(false)}
          title="Configuración de Entrenamiento"
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Mostrar tooltips</label>
              <input
                type="checkbox"
                checked={estado.preferencias.mostrarTooltips}
                onChange={async (e) => {
                  const nuevasPreferencias = {
                    ...estado.preferencias,
                    mostrarTooltips: e.target.checked,
                  };
                  const nuevoEstado = await actualizarPreferenciasEntrenamiento(
                    user!.id,
                    nuevasPreferencias
                  );
                  setEstado(nuevoEstado);
                }}
                className="rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Mostrar videos</label>
              <input
                type="checkbox"
                checked={estado.preferencias.mostrarVideos}
                onChange={async (e) => {
                  const nuevasPreferencias = {
                    ...estado.preferencias,
                    mostrarVideos: e.target.checked,
                  };
                  const nuevoEstado = await actualizarPreferenciasEntrenamiento(
                    user!.id,
                    nuevasPreferencias
                  );
                  setEstado(nuevoEstado);
                }}
                className="rounded"
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Auto-mostrar nuevas funciones</label>
              <input
                type="checkbox"
                checked={estado.preferencias.autoMostrarNuevasFunciones}
                onChange={async (e) => {
                  const nuevasPreferencias = {
                    ...estado.preferencias,
                    autoMostrarNuevasFunciones: e.target.checked,
                  };
                  const nuevoEstado = await actualizarPreferenciasEntrenamiento(
                    user!.id,
                    nuevasPreferencias
                  );
                  setEstado(nuevoEstado);
                }}
                className="rounded"
              />
            </div>

            <div>
              <label className="text-sm font-medium block mb-2">Nivel preferido</label>
              <select
                value={estado.preferencias.nivelPreferido}
                onChange={async (e) => {
                  const nuevasPreferencias = {
                    ...estado.preferencias,
                    nivelPreferido: e.target.value as any,
                  };
                  const nuevoEstado = await actualizarPreferenciasEntrenamiento(
                    user!.id,
                    nuevasPreferencias
                  );
                  setEstado(nuevoEstado);
                }}
                className="w-full border rounded-lg px-3 py-2 text-sm"
              >
                <option value="todos">Todos los niveles</option>
                <option value="basico">Básico</option>
                <option value="intermedio">Intermedio</option>
                <option value="avanzado">Avanzado</option>
              </select>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button onClick={() => setMostrarConfiguracion(false)}>Cerrar</Button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

// Componente para mostrar panel de nuevas funciones
interface PanelNuevasFuncionesProps {
  onClose?: () => void;
}

export const PanelNuevasFunciones: React.FC<PanelNuevasFuncionesProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [contenidoNoVisto, setContenidoNoVisto] = useState<ContenidoEntrenamiento[]>([]);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (user?.id) {
      cargarContenidoNoVisto();
    }
  }, [user?.id]);

  const cargarContenidoNoVisto = async () => {
    if (!user?.id) return;

    setCargando(true);
    try {
      const { getContenidoNoVisto } = await import('../api/entrenamientoContextual');
      const contenido = await getContenidoNoVisto(user.id);
      setContenidoNoVisto(contenido);
    } catch (error) {
      console.error('Error cargando contenido no visto:', error);
    } finally {
      setCargando(false);
    }
  };

  if (cargando) {
    return (
      <Card className="p-4">
        <div className="text-center">Cargando...</div>
      </Card>
    );
  }

  if (contenidoNoVisto.length === 0) {
    return (
      <Card className="p-4">
        <div className="flex items-center gap-2 text-green-600">
          <CheckCircle2 className="w-5 h-5" />
          <span>¡Has visto todo el contenido de entrenamiento disponible!</span>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-blue-500" />
          <h3 className="font-semibold">Nuevas Funciones</h3>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded"
            aria-label="Cerrar"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div className="space-y-3">
        {contenidoNoVisto.map((item) => (
          <div
            key={item.id}
            className="p-3 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="font-medium text-sm">{item.titulo}</h4>
                <p className="text-xs text-gray-600 mt-1">{item.descripcion}</p>
                <div className="flex items-center gap-2 mt-2">
                  {item.tipo === 'video' || item.tipo === 'ambos' ? (
                    <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">
                      <Video className="w-3 h-3 inline mr-1" />
                      Video
                    </span>
                  ) : null}
                  {item.tipo === 'tooltip' || item.tipo === 'ambos' ? (
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">
                      <HelpCircle className="w-3 h-3 inline mr-1" />
                      Tooltip
                    </span>
                  ) : null}
                  <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    {item.nivel}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

