import React, { useState, useRef, useEffect } from 'react';
import { Modal, Button, Input } from '../../../components/componentsreutilizables';
import { FileText, Mic, Video, X, Play, Pause, Trash2, Plus } from 'lucide-react';
import type { NotaBloque, TipoNota } from '../types';
import { guardarNotaBloque, eliminarNotaBloque } from '../api/notasBloque';

interface NotasBloqueProps {
  bloqueId: string;
  notas: NotaBloque[];
  onNotasChange: (notas: NotaBloque[]) => void;
}

export const NotasBloque: React.FC<NotasBloqueProps> = ({
  bloqueId,
  notas,
  onNotasChange,
}) => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [tipoNotaSeleccionado, setTipoNotaSeleccionado] = useState<TipoNota | null>(null);
  const [textoNota, setTextoNota] = useState('');
  const [grabandoAudio, setGrabandoAudio] = useState(false);
  const [grabandoVideo, setGrabandoVideo] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [reproduciendoAudio, setReproduciendoAudio] = useState<string | null>(null);
  const [reproduciendoVideo, setReproduciendoVideo] = useState<string | null>(null);
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const videoChunksRef = useRef<Blob[]>([]);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const videoPlayerRef = useRef<HTMLVideoElement | null>(null);

  const handleAbrirModal = (tipo: TipoNota) => {
    setTipoNotaSeleccionado(tipo);
    setTextoNota('');
    setAudioUrl(null);
    setVideoUrl(null);
    setMostrarModal(true);
  };

  const handleCerrarModal = () => {
    if (grabandoAudio) {
      detenerGrabacionAudio();
    }
    if (grabandoVideo) {
      detenerGrabacionVideo();
    }
    setMostrarModal(false);
    setTipoNotaSeleccionado(null);
    setTextoNota('');
    setAudioUrl(null);
    setVideoUrl(null);
  };

  const iniciarGrabacionAudio = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setGrabandoAudio(true);
    } catch (error) {
      console.error('Error al iniciar grabación de audio:', error);
      alert('No se pudo acceder al micrófono. Por favor, verifica los permisos.');
    }
  };

  const detenerGrabacionAudio = () => {
    if (mediaRecorderRef.current && grabandoAudio) {
      mediaRecorderRef.current.stop();
      setGrabandoAudio(false);
    }
  };

  const iniciarGrabacionVideo = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      videoChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          videoChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const videoBlob = new Blob(videoChunksRef.current, { type: 'video/webm' });
        const url = URL.createObjectURL(videoBlob);
        setVideoUrl(url);
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setGrabandoVideo(true);
    } catch (error) {
      console.error('Error al iniciar grabación de video:', error);
      alert('No se pudo acceder a la cámara/micrófono. Por favor, verifica los permisos.');
    }
  };

  const detenerGrabacionVideo = () => {
    if (mediaRecorderRef.current && grabandoVideo) {
      mediaRecorderRef.current.stop();
      setGrabandoVideo(false);
    }
  };

  const handleGuardarNota = async () => {
    if (!tipoNotaSeleccionado) return;

    let nuevaNota: Partial<NotaBloque> = {
      bloqueId,
      tipo: tipoNotaSeleccionado,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
      creadoPor: 'user-1', // En producción vendría del contexto de autenticación
    };

    if (tipoNotaSeleccionado === 'texto' && textoNota.trim()) {
      nuevaNota.contenido = textoNota.trim();
    } else if (tipoNotaSeleccionado === 'audio' && audioUrl) {
      // En producción, aquí se subiría el archivo a un servidor y se obtendría la URL
      nuevaNota.urlArchivo = audioUrl;
      // Calcular duración aproximada (en producción se calcularía del archivo real)
      nuevaNota.duracion = 0;
    } else if (tipoNotaSeleccionado === 'video' && videoUrl) {
      // En producción, aquí se subiría el archivo a un servidor y se obtendría la URL
      nuevaNota.urlArchivo = videoUrl;
      // Calcular duración aproximada (en producción se calcularía del archivo real)
      nuevaNota.duracion = 0;
    } else {
      alert('Por favor, completa la nota antes de guardar.');
      return;
    }

    try {
      const notaGuardada = await guardarNotaBloque(nuevaNota as NotaBloque);
      onNotasChange([...notas, notaGuardada]);
      handleCerrarModal();
    } catch (error) {
      console.error('Error al guardar nota:', error);
      alert('Error al guardar la nota. Por favor, intenta de nuevo.');
    }
  };

  const handleEliminarNota = async (notaId: string) => {
    if (!confirm('¿Eliminar esta nota?')) return;

    try {
      await eliminarNotaBloque(notaId);
      onNotasChange(notas.filter(n => n.id !== notaId));
    } catch (error) {
      console.error('Error al eliminar nota:', error);
      alert('Error al eliminar la nota. Por favor, intenta de nuevo.');
    }
  };

  const handleReproducirAudio = (nota: NotaBloque) => {
    if (reproduciendoAudio === nota.id) {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        audioPlayerRef.current = null;
      }
      setReproduciendoAudio(null);
    } else {
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
      }
      const audio = new Audio(nota.urlArchivo);
      audioPlayerRef.current = audio;
      audio.play();
      setReproduciendoAudio(nota.id);
      audio.onended = () => {
        setReproduciendoAudio(null);
        audioPlayerRef.current = null;
      };
    }
  };

  const handleReproducirVideo = (nota: NotaBloque) => {
    if (reproduciendoVideo === nota.id) {
      if (videoPlayerRef.current) {
        videoPlayerRef.current.pause();
        videoPlayerRef.current = null;
      }
      setReproduciendoVideo(null);
    } else {
      if (videoPlayerRef.current) {
        videoPlayerRef.current.pause();
      }
      const video = document.createElement('video');
      video.src = nota.urlArchivo || '';
      video.controls = true;
      video.style.width = '100%';
      video.style.maxHeight = '400px';
      videoPlayerRef.current = video;
      setReproduciendoVideo(nota.id);
      video.onended = () => {
        setReproduciendoVideo(null);
        videoPlayerRef.current = null;
      };
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-slate-600">Notas del dietista</span>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAbrirModal('texto')}
            className="h-7 px-2 text-xs"
            title="Agregar nota de texto"
          >
            <FileText className="w-3 h-3 mr-1" />
            Texto
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAbrirModal('audio')}
            className="h-7 px-2 text-xs"
            title="Agregar nota de audio"
          >
            <Mic className="w-3 h-3 mr-1" />
            Audio
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleAbrirModal('video')}
            className="h-7 px-2 text-xs"
            title="Agregar nota de video"
          >
            <Video className="w-3 h-3 mr-1" />
            Video
          </Button>
        </div>
      </div>

      {notas.length > 0 && (
        <div className="space-y-2">
          {notas.map((nota) => (
            <div
              key={nota.id}
              className="bg-slate-50 border border-slate-200 rounded-lg p-2 text-xs"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1">
                  {nota.tipo === 'texto' && (
                    <p className="text-slate-700">{nota.contenido}</p>
                  )}
                  {nota.tipo === 'audio' && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReproducirAudio(nota)}
                        className="h-6 px-2"
                      >
                        {reproduciendoAudio === nota.id ? (
                          <Pause className="w-3 h-3" />
                        ) : (
                          <Play className="w-3 h-3" />
                        )}
                      </Button>
                      <span className="text-slate-600">Nota de audio</span>
                      {nota.duracion && (
                        <span className="text-slate-400">({Math.round(nota.duracion)}s)</span>
                      )}
                    </div>
                  )}
                  {nota.tipo === 'video' && (
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleReproducirVideo(nota)}
                        className="h-6 px-2"
                      >
                        {reproduciendoVideo === nota.id ? (
                          <Pause className="w-3 h-3" />
                        ) : (
                          <Play className="w-3 h-3" />
                        )}
                      </Button>
                      <span className="text-slate-600">Nota de video</span>
                      {nota.duracion && (
                        <span className="text-slate-400">({Math.round(nota.duracion)}s)</span>
                      )}
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEliminarNota(nota.id)}
                  className="h-6 w-6 p-0 text-red-500 hover:text-red-700"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal
        isOpen={mostrarModal}
        onClose={handleCerrarModal}
        title={
          tipoNotaSeleccionado === 'texto'
            ? 'Agregar nota de texto'
            : tipoNotaSeleccionado === 'audio'
            ? 'Agregar nota de audio'
            : 'Agregar nota de video'
        }
      >
        <div className="space-y-4">
          {tipoNotaSeleccionado === 'texto' && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Instrucciones personalizadas
              </label>
              <textarea
                value={textoNota}
                onChange={(e) => setTextoNota(e.target.value)}
                placeholder="Escribe las instrucciones personalizadas para este bloque..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm min-h-[120px]"
                rows={5}
              />
            </div>
          )}

          {tipoNotaSeleccionado === 'audio' && (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                {!audioUrl ? (
                  <div className="text-center space-y-3">
                    {!grabandoAudio ? (
                      <Button
                        onClick={iniciarGrabacionAudio}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Mic className="w-4 h-4 mr-2" />
                        Iniciar grabación
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-red-600">
                          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                          <span className="font-medium">Grabando...</span>
                        </div>
                        <Button
                          onClick={detenerGrabacionAudio}
                          variant="outline"
                        >
                          Detener grabación
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 w-full">
                    <audio src={audioUrl} controls className="w-full" />
                    <Button
                      onClick={() => {
                        setAudioUrl(null);
                        audioChunksRef.current = [];
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Regrabar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          {tipoNotaSeleccionado === 'video' && (
            <div className="space-y-3">
              <div className="flex items-center justify-center">
                {!videoUrl ? (
                  <div className="text-center space-y-3">
                    {!grabandoVideo ? (
                      <Button
                        onClick={iniciarGrabacionVideo}
                        className="bg-red-500 hover:bg-red-600 text-white"
                      >
                        <Video className="w-4 h-4 mr-2" />
                        Iniciar grabación
                      </Button>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-red-600">
                          <div className="w-3 h-3 bg-red-600 rounded-full animate-pulse" />
                          <span className="font-medium">Grabando video...</span>
                        </div>
                        <Button
                          onClick={detenerGrabacionVideo}
                          variant="outline"
                        >
                          Detener grabación
                        </Button>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-3 w-full">
                    <video src={videoUrl} controls className="w-full max-h-[400px]" />
                    <Button
                      onClick={() => {
                        setVideoUrl(null);
                        videoChunksRef.current = [];
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Regrabar
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={handleCerrarModal}>
              Cancelar
            </Button>
            <Button
              onClick={handleGuardarNota}
              disabled={
                (tipoNotaSeleccionado === 'texto' && !textoNota.trim()) ||
                (tipoNotaSeleccionado === 'audio' && !audioUrl) ||
                (tipoNotaSeleccionado === 'video' && !videoUrl)
              }
            >
              Guardar nota
            </Button>
          </div>
        </div>
      </Modal>

      {reproduciendoVideo && videoPlayerRef.current && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 max-w-4xl w-full mx-4">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">Reproduciendo video</h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  if (videoPlayerRef.current) {
                    videoPlayerRef.current.pause();
                    videoPlayerRef.current = null;
                  }
                  setReproduciendoVideo(null);
                }}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            <div ref={(el) => {
              if (el && videoPlayerRef.current) {
                el.innerHTML = '';
                el.appendChild(videoPlayerRef.current);
              }
            }} />
          </div>
        </div>
      )}
    </div>
  );
};

