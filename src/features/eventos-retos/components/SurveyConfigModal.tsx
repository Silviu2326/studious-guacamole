// Modal para configurar/revisar encuesta post-evento

import React, { useState, useEffect } from 'react';
import { Modal, Card, Button } from '../../../components/componentsreutilizables';
import { X, Plus, Trash2, GripVertical, Save, Eye } from 'lucide-react';
import { PreguntaEncuesta, EncuestaPostEvento, configurarEncuestaPostEvento, obtenerEncuestaPostEvento } from '../services/feedbackService';
import { Evento } from '../api/events';
import { Textarea } from '../../../components/componentsreutilizables/Textarea';
import { Select } from '../../../components/componentsreutilizables/Select';

interface SurveyConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  evento: Evento;
  onSave: () => void;
}

const PREGUNTAS_PREDETERMINADAS: PreguntaEncuesta[] = [
  {
    id: 'q1',
    texto: '¿Cómo calificarías tu experiencia general en este evento?',
    tipo: 'rating',
    orden: 1,
    requerida: true,
  },
  {
    id: 'q2',
    texto: '¿Qué te gustó más del evento?',
    tipo: 'texto',
    orden: 2,
    requerida: false,
  },
  {
    id: 'q3',
    texto: '¿Qué mejorarías o cambiarías?',
    tipo: 'texto',
    orden: 3,
    requerida: false,
  },
  {
    id: 'q4',
    texto: '¿Recomendarías este evento a otros?',
    tipo: 'rating',
    orden: 4,
    requerida: true,
  },
];

export const SurveyConfigModal: React.FC<SurveyConfigModalProps> = ({
  isOpen,
  onClose,
  evento,
  onSave,
}) => {
  const [preguntas, setPreguntas] = useState<PreguntaEncuesta[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const encuesta = obtenerEncuestaPostEvento(evento.id);
      if (encuesta && encuesta.preguntas.length > 0) {
        setPreguntas(encuesta.preguntas);
      } else {
        // Usar preguntas predeterminadas
        setPreguntas([...PREGUNTAS_PREDETERMINADAS]);
      }
    }
  }, [isOpen, evento.id]);

  const agregarPregunta = () => {
    const nuevaPregunta: PreguntaEncuesta = {
      id: `q_${Date.now()}`,
      texto: '',
      tipo: 'texto',
      orden: preguntas.length + 1,
      requerida: false,
    };
    setPreguntas([...preguntas, nuevaPregunta]);
  };

  const eliminarPregunta = (preguntaId: string) => {
    if (preguntas.length <= 1) {
      alert('Debe haber al menos una pregunta en la encuesta.');
      return;
    }
    setPreguntas(preguntas.filter(p => p.id !== preguntaId).map((p, index) => ({
      ...p,
      orden: index + 1,
    })));
  };

  const actualizarPregunta = (preguntaId: string, campo: keyof PreguntaEncuesta, valor: any) => {
    setPreguntas(preguntas.map(p => 
      p.id === preguntaId ? { ...p, [campo]: valor } : p
    ));
  };

  const moverPregunta = (index: number, direccion: 'arriba' | 'abajo') => {
    if (direccion === 'arriba' && index === 0) return;
    if (direccion === 'abajo' && index === preguntas.length - 1) return;

    const nuevasPreguntas = [...preguntas];
    const temp = nuevasPreguntas[index];
    nuevasPreguntas[index] = nuevasPreguntas[direccion === 'arriba' ? index - 1 : index + 1];
    nuevasPreguntas[direccion === 'arriba' ? index - 1 : index + 1] = temp;

    // Actualizar orden
    nuevasPreguntas.forEach((p, i) => {
      p.orden = i + 1;
    });

    setPreguntas(nuevasPreguntas);
  };

  const guardarEncuesta = () => {
    // Validar que todas las preguntas tengan texto
    const preguntasInvalidas = preguntas.filter(p => !p.texto.trim());
    if (preguntasInvalidas.length > 0) {
      alert('Todas las preguntas deben tener un texto.');
      return;
    }

    setLoading(true);
    try {
      configurarEncuestaPostEvento(evento.id, preguntas);
      onSave();
      onClose();
    } catch (error) {
      console.error('Error guardando encuesta:', error);
      alert('Error al guardar la encuesta.');
    } finally {
      setLoading(false);
    }
  };

  const usarPreguntasPredeterminadas = () => {
    setPreguntas([...PREGUNTAS_PREDETERMINADAS]);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Configurar Encuesta Post-Evento
            </h2>
            <p className="text-sm text-gray-500 mt-1">{evento.nombre}</p>
          </div>
          <Button
            variant="ghost"
            onClick={onClose}
            className="p-2"
          >
            <X className="w-5 h-5" />
          </Button>
        </div>

        <div className="mb-4 flex items-center justify-between">
          <p className="text-sm text-gray-600">
            Configura las preguntas que recibirán los participantes después del evento.
          </p>
          <Button
            variant="secondary"
            size="sm"
            onClick={usarPreguntasPredeterminadas}
          >
            Usar Preguntas Predeterminadas
          </Button>
        </div>

        <div className="space-y-4 mb-6">
          {preguntas.map((pregunta, index) => (
            <Card key={pregunta.id} className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex flex-col gap-1 mt-1">
                  <button
                    onClick={() => moverPregunta(index, 'arriba')}
                    disabled={index === 0}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    title="Mover arriba"
                  >
                    <GripVertical className="w-4 h-4 rotate-90" />
                  </button>
                  <button
                    onClick={() => moverPregunta(index, 'abajo')}
                    disabled={index === preguntas.length - 1}
                    className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30"
                    title="Mover abajo"
                  >
                    <GripVertical className="w-4 h-4 -rotate-90" />
                  </button>
                </div>

                <div className="flex-1 space-y-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pregunta {pregunta.orden}
                    </label>
                    <Textarea
                      value={pregunta.texto}
                      onChange={(e) => actualizarPregunta(pregunta.id, 'texto', e.target.value)}
                      placeholder="Escribe la pregunta aquí..."
                      rows={2}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Tipo de Pregunta
                      </label>
                      <Select
                        value={pregunta.tipo}
                        onChange={(value) => actualizarPregunta(pregunta.id, 'tipo', value)}
                        options={[
                          { value: 'texto', label: 'Texto libre' },
                          { value: 'rating', label: 'Valoración (1-5 estrellas)' },
                          { value: 'opcion', label: 'Opción múltiple' },
                        ]}
                      />
                    </div>

                    <div className="flex items-center pt-8">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={pregunta.requerida}
                          onChange={(e) => actualizarPregunta(pregunta.id, 'requerida', e.target.checked)}
                          className="rounded"
                        />
                        <span className="text-sm text-gray-700">Pregunta requerida</span>
                      </label>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => eliminarPregunta(pregunta.id)}
                  className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                  title="Eliminar pregunta"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </Card>
          ))}
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <Button
            variant="secondary"
            onClick={agregarPregunta}
            iconLeft={<Plus className="w-4 h-4" />}
          >
            Agregar Pregunta
          </Button>

          <div className="flex gap-3">
            <Button variant="secondary" onClick={onClose}>
              Cancelar
            </Button>
            <Button
              variant="primary"
              onClick={guardarEncuesta}
              iconLeft={<Save className="w-4 h-4" />}
              disabled={loading || preguntas.length === 0}
            >
              {loading ? 'Guardando...' : 'Guardar Encuesta'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

