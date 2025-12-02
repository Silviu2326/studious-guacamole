import React, { useState, useEffect } from 'react';
import { X, FileText, Sparkles, Search } from 'lucide-react';
import { Modal, Button, Input, Textarea, Select } from '../../../components/componentsreutilizables';
import { Cita, NotaSesion, PlantillaNotaSesion, TipoCita } from '../types';
import {
  crearNotaSesion,
  getPlantillasNotasPorTipo,
  getNotaSesionPorCita,
  actualizarNotaSesion,
} from '../api/notasSesion';
import { useAuth } from '../../../context/AuthContext';

interface ModalAgregarNotaSesionProps {
  isOpen: boolean;
  onClose: () => void;
  cita: Cita | null;
  onNotaCreada?: (nota: NotaSesion) => void;
}

export const ModalAgregarNotaSesion: React.FC<ModalAgregarNotaSesionProps> = ({
  isOpen,
  onClose,
  cita,
  onNotaCreada,
}) => {
  const { user } = useAuth();
  const [plantillas, setPlantillas] = useState<PlantillaNotaSesion[]>([]);
  const [plantillaSeleccionada, setPlantillaSeleccionada] = useState<string>('');
  const [buscandoPlantilla, setBuscandoPlantilla] = useState(false);
  const [notaExistente, setNotaExistente] = useState<NotaSesion | null>(null);
  const [loading, setLoading] = useState(false);
  
  const [formData, setFormData] = useState({
    queSeTrabajo: '',
    comoSeSintio: '',
    observaciones: '',
    proximosPasos: '',
  });

  useEffect(() => {
    if (isOpen && cita) {
      cargarPlantillas();
      cargarNotaExistente();
    } else {
      // Limpiar formulario cuando se cierra
      setFormData({
        queSeTrabajo: '',
        comoSeSintio: '',
        observaciones: '',
        proximosPasos: '',
      });
      setPlantillaSeleccionada('');
      setNotaExistente(null);
    }
  }, [isOpen, cita]);

  const cargarPlantillas = async () => {
    if (!cita) return;
    setBuscandoPlantilla(true);
    try {
      const plantillasData = await getPlantillasNotasPorTipo(cita.tipo, user?.id);
      setPlantillas(plantillasData);
    } catch (error) {
      console.error('Error cargando plantillas:', error);
    } finally {
      setBuscandoPlantilla(false);
    }
  };

  const cargarNotaExistente = async () => {
    if (!cita) return;
    try {
      const nota = await getNotaSesionPorCita(cita.id);
      if (nota) {
        setNotaExistente(nota);
        setFormData({
          queSeTrabajo: nota.queSeTrabajo,
          comoSeSintio: nota.comoSeSintio,
          observaciones: nota.observaciones || '',
          proximosPasos: nota.proximosPasos || '',
        });
      }
    } catch (error) {
      console.error('Error cargando nota existente:', error);
    }
  };

  const aplicarPlantilla = (plantilla: PlantillaNotaSesion) => {
    setFormData({
      queSeTrabajo: plantilla.queSeTrabajo,
      comoSeSintio: plantilla.comoSeSintio,
      observaciones: plantilla.observaciones || '',
      proximosPasos: plantilla.proximosPasos || '',
    });
    setPlantillaSeleccionada(plantilla.id);
  };

  const handleSubmit = async () => {
    if (!cita) return;
    
    if (!formData.queSeTrabajo.trim() || !formData.comoSeSintio.trim()) {
      alert('Por favor completa los campos obligatorios: Qué se trabajó y Cómo se sintió');
      return;
    }

    setLoading(true);
    try {
      if (notaExistente) {
        // Actualizar nota existente
        const notaActualizada = await actualizarNotaSesion(
          notaExistente.id,
          {
            ...formData,
            plantillaId: plantillaSeleccionada || undefined,
          },
          user?.id
        );
        if (onNotaCreada) {
          onNotaCreada(notaActualizada);
        }
      } else {
        // Crear nueva nota
        const nuevaNota = await crearNotaSesion(
          {
            citaId: cita.id,
            clienteId: cita.clienteId,
            clienteNombre: cita.clienteNombre,
            fechaSesion: new Date(cita.fechaInicio),
            ...formData,
            plantillaId: plantillaSeleccionada || undefined,
          },
          user?.id
        );
        if (onNotaCreada) {
          onNotaCreada(nuevaNota);
        }
      }
      onClose();
    } catch (error) {
      console.error('Error guardando nota:', error);
      alert('Error al guardar la nota. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  if (!cita) return null;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={notaExistente ? 'Editar Nota de Sesión' : 'Agregar Nota de Sesión'}
      size="lg"
      footer={
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            <X className="w-4 h-4 mr-2" />
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} disabled={loading}>
            <FileText className="w-4 h-4 mr-2" />
            {loading ? 'Guardando...' : notaExistente ? 'Actualizar Nota' : 'Guardar Nota'}
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Información de la sesión */}
        <div className="p-4 bg-slate-50 rounded-lg">
          <h3 className="font-semibold text-gray-900 mb-2">{cita.titulo}</h3>
          <p className="text-sm text-gray-600">
            {new Date(cita.fechaInicio).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-sm text-gray-600">
            {new Date(cita.fechaInicio).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            })}{' '}
            - {new Date(cita.fechaFin).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}
          </p>
        </div>

        {/* Plantillas */}
        {plantillas.length > 0 && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Sparkles className="w-4 h-4" />
              <span>Plantillas de Notas Frecuentes</span>
            </div>
            <Select
              label="Seleccionar plantilla"
              value={plantillaSeleccionada}
              onChange={(e) => {
                const plantillaId = e.target.value;
                setPlantillaSeleccionada(plantillaId);
                if (plantillaId) {
                  const plantilla = plantillas.find(p => p.id === plantillaId);
                  if (plantilla) {
                    aplicarPlantilla(plantilla);
                  }
                }
              }}
              options={[
                { value: '', label: 'Sin plantilla' },
                ...plantillas.map(p => ({
                  value: p.id,
                  label: `${p.nombre} ${p.usoFrecuente > 0 ? `(${p.usoFrecuente} usos)` : ''}`,
                })),
              ]}
            />
            {buscandoPlantilla && (
              <p className="text-xs text-gray-500">Buscando plantillas...</p>
            )}
          </div>
        )}

        {/* Campos del formulario */}
        <div className="space-y-4">
          <Textarea
            label="Qué se trabajó *"
            value={formData.queSeTrabajo}
            onChange={(e) => setFormData({ ...formData, queSeTrabajo: e.target.value })}
            placeholder="Describe qué ejercicios o actividades se realizaron en la sesión..."
            rows={4}
            required
          />

          <Textarea
            label="Cómo se sintió el cliente *"
            value={formData.comoSeSintio}
            onChange={(e) => setFormData({ ...formData, comoSeSintio: e.target.value })}
            placeholder="Describe cómo se sintió el cliente durante la sesión, su nivel de energía, motivación, etc."
            rows={4}
            required
          />

          <Textarea
            label="Observaciones"
            value={formData.observaciones}
            onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
            placeholder="Observaciones adicionales, progreso notado, dificultades, etc."
            rows={3}
          />

          <Textarea
            label="Próximos pasos"
            value={formData.proximosPasos}
            onChange={(e) => setFormData({ ...formData, proximosPasos: e.target.value })}
            placeholder="Qué se debe trabajar en la próxima sesión, ajustes al programa, recomendaciones, etc."
            rows={3}
          />
        </div>
      </div>
    </Modal>
  );
};


