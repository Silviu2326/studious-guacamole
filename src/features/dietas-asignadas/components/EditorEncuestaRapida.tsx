import React, { useState } from 'react';
import { Modal, Button, Input, Select, Card } from '../../../components/componentsreutilizables';
import { X, Plus, Trash2 } from 'lucide-react';
import {
  EncuestaRapida,
  TipoEncuestaRapida,
  PreguntaEncuestaRapida,
  TipoPreguntaEncuesta,
} from '../types';
import {
  crearEncuestaRapida,
  actualizarEncuestaRapida,
} from '../api/encuestasRapidas';
import { useAuth } from '../../../context/AuthContext';

interface EditorEncuestaRapidaProps {
  dietaId: string;
  clienteId: string;
  encuesta?: EncuestaRapida;
  tiposEncuesta: Array<{ tipo: TipoEncuestaRapida; nombre: string; descripcion: string }>;
  onCrear?: (tipo: TipoEncuestaRapida) => void;
  onCancel: () => void;
  onSave: () => void;
}

export const EditorEncuestaRapida: React.FC<EditorEncuestaRapidaProps> = ({
  dietaId,
  clienteId,
  encuesta,
  tiposEncuesta,
  onCrear,
  onCancel,
  onSave,
}) => {
  const { user } = useAuth();
  const [nombre, setNombre] = useState(encuesta?.nombre || '');
  const [descripcion, setDescripcion] = useState(encuesta?.descripcion || '');
  const [tipo, setTipo] = useState<TipoEncuestaRapida>(encuesta?.tipo || 'personalizada');
  const [preguntas, setPreguntas] = useState<PreguntaEncuestaRapida[]>(encuesta?.preguntas || []);
  const [frecuencia, setFrecuencia] = useState<'una-vez' | 'semanal' | 'mensual' | 'personalizada'>(
    encuesta?.frecuencia || 'una-vez'
  );
  const [diaSemana, setDiaSemana] = useState<string[]>(encuesta?.diaSemana || []);
  const [activa, setActiva] = useState(encuesta?.activa ?? true);
  const [guardando, setGuardando] = useState(false);

  const handleCrearPredefinida = (tipoEncuesta: TipoEncuestaRapida) => {
    if (onCrear) {
      onCrear(tipoEncuesta);
    }
  };

  const handleAñadirPregunta = (tipoPregunta: TipoPreguntaEncuesta) => {
    const nuevaPregunta: PreguntaEncuestaRapida = {
      id: `pregunta_${Date.now()}`,
      tipo: tipoPregunta,
      texto: '',
      requerida: true,
      orden: preguntas.length + 1,
      ...(tipoPregunta === 'escala' ? { escalaMin: 1, escalaMax: 5 } : {}),
      ...(tipoPregunta === 'multiple-opcion' ? { opciones: ['Opción 1', 'Opción 2'] } : {}),
      ...(tipoPregunta === 'rating-estrellas' ? { escalaMin: 1, escalaMax: 5 } : {}),
    };
    setPreguntas([...preguntas, nuevaPregunta]);
  };

  const handleActualizarPregunta = (id: string, actualizaciones: Partial<PreguntaEncuestaRapida>) => {
    setPreguntas(preguntas.map(p => p.id === id ? { ...p, ...actualizaciones } : p));
  };

  const handleEliminarPregunta = (id: string) => {
    setPreguntas(preguntas.filter(p => p.id !== id));
  };

  const handleGuardar = async () => {
    if (!nombre.trim() || !user?.id) return;
    
    setGuardando(true);
    try {
      if (encuesta) {
        await actualizarEncuestaRapida(encuesta.id, {
          nombre,
          descripcion,
          tipo,
          preguntas,
          frecuencia,
          diaSemana,
          activa,
        });
      } else {
        await crearEncuestaRapida({
          dietaId,
          clienteId,
          nombre,
          descripcion,
          tipo,
          preguntas,
          frecuencia,
          diaSemana,
          activa,
          creadoPor: user.id,
        });
      }
      onSave();
    } catch (error) {
      console.error('Error guardando encuesta:', error);
    } finally {
      setGuardando(false);
    }
  };

  const tiposPregunta: Array<{ tipo: TipoPreguntaEncuesta; nombre: string }> = [
    { tipo: 'escala', nombre: 'Escala' },
    { tipo: 'si-no', nombre: 'Sí/No' },
    { tipo: 'texto', nombre: 'Texto' },
    { tipo: 'multiple-opcion', nombre: 'Múltiple Opción' },
    { tipo: 'rating-estrellas', nombre: 'Rating Estrellas' },
  ];

  return (
    <Modal
      isOpen={true}
      onClose={onCancel}
      title={encuesta ? 'Editar Encuesta' : 'Nueva Encuesta'}
      size="xl"
    >
      <div className="space-y-6">
        {!encuesta && (
          <Card className="p-4 bg-blue-50 border border-blue-200">
            <h4 className="font-medium text-blue-900 mb-3">Encuestas Predefinidas</h4>
            <div className="grid grid-cols-2 gap-2">
              {tiposEncuesta.slice(0, -1).map(tipoEncuesta => (
                <Button
                  key={tipoEncuesta.tipo}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleCrearPredefinida(tipoEncuesta.tipo)}
                  className="text-left justify-start"
                >
                  <div>
                    <div className="font-medium">{tipoEncuesta.nombre}</div>
                    <div className="text-xs text-gray-600">{tipoEncuesta.descripcion}</div>
                  </div>
                </Button>
              ))}
            </div>
          </Card>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre
          </label>
          <Input
            value={nombre}
            onChange={e => setNombre(e.target.value)}
            placeholder="Nombre de la encuesta"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Descripción
          </label>
          <Input
            value={descripcion}
            onChange={e => setDescripcion(e.target.value)}
            placeholder="Descripción de la encuesta"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tipo
          </label>
          <Select
            value={tipo}
            onChange={e => setTipo(e.target.value as TipoEncuestaRapida)}
            options={tiposEncuesta.map(t => ({ value: t.tipo, label: t.nombre }))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Frecuencia
          </label>
          <Select
            value={frecuencia}
            onChange={e => setFrecuencia(e.target.value as typeof frecuencia)}
            options={[
              { value: 'una-vez', label: 'Una vez' },
              { value: 'semanal', label: 'Semanal' },
              { value: 'mensual', label: 'Mensual' },
              { value: 'personalizada', label: 'Personalizada' },
            ]}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Preguntas
          </label>
          <div className="space-y-4">
            {preguntas.map((pregunta, index) => (
              <Card key={pregunta.id} className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="font-medium text-gray-900">
                    Pregunta {index + 1}
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleEliminarPregunta(pregunta.id)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                <div className="space-y-3">
                  <Input
                    value={pregunta.texto}
                    onChange={e => handleActualizarPregunta(pregunta.id, { texto: e.target.value })}
                    placeholder="Texto de la pregunta"
                  />
                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={pregunta.requerida}
                        onChange={e => handleActualizarPregunta(pregunta.id, { requerida: e.target.checked })}
                      />
                      <span className="text-sm text-gray-700">Requerida</span>
                    </label>
                    {pregunta.tipo === 'escala' && (
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={pregunta.escalaMin || 1}
                          onChange={e => handleActualizarPregunta(pregunta.id, { escalaMin: parseInt(e.target.value) })}
                          className="w-20"
                        />
                        <span className="text-sm text-gray-600">a</span>
                        <Input
                          type="number"
                          value={pregunta.escalaMax || 5}
                          onChange={e => handleActualizarPregunta(pregunta.id, { escalaMax: parseInt(e.target.value) })}
                          className="w-20"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </Card>
            ))}
            <div className="flex gap-2">
              {tiposPregunta.map(tipoPregunta => (
                <Button
                  key={tipoPregunta.tipo}
                  variant="secondary"
                  size="sm"
                  onClick={() => handleAñadirPregunta(tipoPregunta.tipo)}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  {tipoPregunta.nombre}
                </Button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-200">
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={activa}
              onChange={e => setActiva(e.target.checked)}
            />
            <span className="text-sm text-gray-700">Activa</span>
          </label>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onCancel} disabled={guardando}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleGuardar} loading={guardando}>
              Guardar
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

