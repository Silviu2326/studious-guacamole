import React, { useState } from 'react';
import { EventoReto, TipoEvento, TipoReto, DuracionReto, ObjetivoReto, EstadoEvento } from '../types';
import { Modal, Button, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { useAuth } from '../../../context/AuthContext';

interface CreadorRetoProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (evento: Omit<EventoReto, 'id' | 'createdAt' | 'updatedAt' | 'participantes' | 'ranking' | 'contenidoMotivacional' | 'premios'>) => void;
  eventoEditar?: EventoReto;
  esEntrenador?: boolean;
}

export const CreadorReto: React.FC<CreadorRetoProps> = ({
  isOpen,
  onClose,
  onSubmit,
  eventoEditar,
  esEntrenador = false,
}) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    tipo: (eventoEditar?.tipo || (esEntrenador ? 'reto' : 'evento')) as TipoEvento,
    tipoReto: (eventoEditar?.tipoReto || (esEntrenador ? 'personal' : 'grupal')) as TipoReto | undefined,
    titulo: eventoEditar?.titulo || '',
    descripcion: eventoEditar?.descripcion || '',
    duracionDias: eventoEditar?.duracionDias || undefined as DuracionReto | undefined,
    fechaInicio: eventoEditar?.fechaInicio ? new Date(eventoEditar.fechaInicio).toISOString().split('T')[0] : '',
    fechaFin: eventoEditar?.fechaFin ? new Date(eventoEditar.fechaFin).toISOString().split('T')[0] : '',
    objetivo: eventoEditar?.objetivo || undefined as ObjetivoReto | undefined,
    reglas: eventoEditar?.reglas.join('\n') || '',
    capacidadMaxima: eventoEditar?.capacidadMaxima?.toString() || '',
    requisitos: eventoEditar?.requisitos?.join('\n') || '',
    estado: (eventoEditar?.estado || 'borrador') as EstadoEvento,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors: Record<string, string> = {};
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = 'El título es requerido';
    }
    
    if (!formData.descripcion.trim()) {
      newErrors.descripcion = 'La descripción es requerida';
    }
    
    if (formData.tipo === 'reto' && !formData.duracionDias) {
      newErrors.duracionDias = 'La duración es requerida para retos';
    }
    
    if (!formData.fechaInicio) {
      newErrors.fechaInicio = 'La fecha de inicio es requerida';
    }
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    
    const reglasArray = formData.reglas.split('\n').filter(r => r.trim());
    
    const nuevoEvento = {
      tipo: formData.tipo,
      tipoReto: formData.tipoReto,
      titulo: formData.titulo.trim(),
      descripcion: formData.descripcion.trim(),
      duracionDias: formData.tipo === 'reto' ? (formData.duracionDias as DuracionReto) : undefined,
      fechaInicio: new Date(formData.fechaInicio),
      fechaFin: formData.fechaFin ? new Date(formData.fechaFin) : undefined,
      objetivo: formData.objetivo,
      reglas: reglasArray,
      capacidadMaxima: formData.capacidadMaxima ? parseInt(formData.capacidadMaxima) : undefined,
      requisitos: formData.requisitos ? formData.requisitos.split('\n').filter(r => r.trim()) : undefined,
      estado: formData.estado,
      creadorId: user?.id || '',
      creadorNombre: user?.name || '',
    };
    
    onSubmit(nuevoEvento);
    handleClose();
  };

  const handleClose = () => {
    setErrors({});
    setFormData({
      tipo: esEntrenador ? 'reto' : 'evento',
      tipoReto: esEntrenador ? 'personal' : 'grupal',
      titulo: '',
      descripcion: '',
      duracionDias: undefined,
      fechaInicio: '',
      fechaFin: '',
      objetivo: undefined,
      reglas: '',
      capacidadMaxima: '',
      requisitos: '',
      estado: 'borrador',
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={eventoEditar ? 'Editar Evento/Reto' : (esEntrenador ? 'Crear Reto Personal' : 'Crear Evento/Reto')}
      size="xl"
      footer={
        <div className="flex justify-end space-x-3">
          <Button variant="secondary" onClick={handleClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {eventoEditar ? 'Guardar Cambios' : 'Crear'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Select
            label="Tipo"
            value={formData.tipo}
            onChange={(e) => setFormData({ ...formData, tipo: e.target.value as TipoEvento })}
            options={[
              { value: 'reto', label: 'Reto' },
              { value: 'evento', label: 'Evento' },
            ]}
            error={errors.tipo}
          />
          
          {formData.tipo === 'reto' && (
            <Select
              label="Tipo de Reto"
              value={formData.tipoReto || ''}
              onChange={(e) => setFormData({ ...formData, tipoReto: e.target.value as TipoReto })}
              options={[
                { value: 'personal', label: 'Personal (Entrenador)' },
                { value: 'grupal', label: 'Grupal (Gimnasio)' },
              ]}
            />
          )}
          
          {formData.tipo === 'reto' && (
            <Select
              label="Duración (días)"
              value={formData.duracionDias?.toString() || ''}
              onChange={(e) => setFormData({ ...formData, duracionDias: parseInt(e.target.value) as DuracionReto })}
              options={[
                { value: '7', label: '7 días' },
                { value: '14', label: '14 días' },
                { value: '21', label: '21 días' },
                { value: '30', label: '30 días' },
                { value: '60', label: '60 días' },
                { value: '90', label: '90 días' },
              ]}
              error={errors.duracionDias}
            />
          )}
          
          <Select
            label="Objetivo"
            value={formData.objetivo || ''}
            onChange={(e) => setFormData({ ...formData, objetivo: e.target.value as ObjetivoReto || undefined })}
            options={[
              { value: '', label: 'Sin objetivo específico' },
              { value: 'perdida_peso', label: 'Pérdida de peso' },
              { value: 'ganancia_muscular', label: 'Ganancia muscular' },
              { value: 'resistencia', label: 'Resistencia' },
              { value: 'flexibilidad', label: 'Flexibilidad' },
              { value: 'general', label: 'General' },
            ]}
          />
        </div>
        
        <Input
          label="Título"
          value={formData.titulo}
          onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
          error={errors.titulo}
          placeholder={esEntrenador ? 'Ej: Reto 30 días conmigo' : 'Ej: Masterclass de movilidad sábado 18:00'}
        />
        
        <Textarea
          label="Descripción"
          value={formData.descripcion}
          onChange={(e) => setFormData({ ...formData, descripcion: e.target.value })}
          error={errors.descripcion}
          rows={4}
          placeholder="Describe el evento o reto..."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Fecha de Inicio"
            type="date"
            value={formData.fechaInicio}
            onChange={(e) => setFormData({ ...formData, fechaInicio: e.target.value })}
            error={errors.fechaInicio}
          />
          
          <Input
            label="Fecha de Fin (opcional)"
            type="date"
            value={formData.fechaFin}
            onChange={(e) => setFormData({ ...formData, fechaFin: e.target.value })}
          />
        </div>
        
        {formData.tipo === 'evento' && (
          <Input
            label="Capacidad Máxima"
            type="number"
            value={formData.capacidadMaxima}
            onChange={(e) => setFormData({ ...formData, capacidadMaxima: e.target.value })}
            placeholder="Número máximo de participantes"
          />
        )}
        
        <Textarea
          label="Reglas (una por línea)"
          value={formData.reglas}
          onChange={(e) => setFormData({ ...formData, reglas: e.target.value })}
          rows={4}
          placeholder="Cada línea es una regla diferente..."
        />
        
        {formData.tipo === 'evento' && (
          <Textarea
            label="Requisitos (opcional, una por línea)"
            value={formData.requisitos}
            onChange={(e) => setFormData({ ...formData, requisitos: e.target.value })}
            rows={3}
            placeholder="Requisitos para participar..."
          />
        )}
      </form>
    </Modal>
  );
};

