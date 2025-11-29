import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { Location, Member } from '../types';
import { getLocations } from '../../comparativa-entre-sedes/api';

interface NuevaTransferenciaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    memberId: string;
    destinationLocationId: string;
    effectiveDate: string;
    notes?: string;
  }) => Promise<void>;
}

// Mock data para miembros - En producción esto vendría de la API
const mockMembers: Member[] = [
  { id: '1', name: 'Juan Pérez', email: 'juan@example.com', phone: '+34 600 123 456' },
  { id: '2', name: 'María García', email: 'maria@example.com', phone: '+34 600 234 567' },
  { id: '3', name: 'Carlos López', email: 'carlos@example.com', phone: '+34 600 345 678' },
];

export const NuevaTransferenciaModal: React.FC<NuevaTransferenciaModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    memberId: '',
    destinationLocationId: '',
    effectiveDate: '',
    notes: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      loadLocations();
    }
  }, [isOpen]);

  const loadLocations = async () => {
    try {
      const data = await getLocations();
      setLocations(data);
    } catch (error) {
      console.error('Error cargando ubicaciones:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validación
    const newErrors: Record<string, string> = {};
    if (!formData.memberId) newErrors.memberId = 'Seleccione un socio';
    if (!formData.destinationLocationId) newErrors.destinationLocationId = 'Seleccione una sede de destino';
    if (!formData.effectiveDate) newErrors.effectiveDate = 'Seleccione una fecha efectiva';
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);
    try {
      await onSubmit(formData);
      // Reset form
      setFormData({ memberId: '', destinationLocationId: '', effectiveDate: '', notes: '' });
      setErrors({});
      onClose();
    } catch (error) {
      console.error('Error al crear transferencia:', error);
    } finally {
      setLoading(false);
    }
  };

  const memberOptions = mockMembers.map((m) => ({
    value: m.id,
    label: `${m.name} ${m.email ? `(${m.email})` : ''}`,
  }));

  const locationOptions = locations.map((l) => ({
    value: l.id,
    label: l.name,
  }));

  // Validar que la fecha efectiva no sea en el pasado
  const today = new Date().toISOString().split('T')[0];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Iniciar Nueva Transferencia"
      size="lg"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Select
          label="Socio a Transferir"
          options={memberOptions}
          value={formData.memberId}
          onChange={(e) => {
            setFormData({ ...formData, memberId: e.target.value });
            setErrors({ ...errors, memberId: '' });
          }}
          placeholder="Seleccione un socio"
          error={errors.memberId}
          required
        />

        <Select
          label="Sede de Destino"
          options={locationOptions}
          value={formData.destinationLocationId}
          onChange={(e) => {
            setFormData({ ...formData, destinationLocationId: e.target.value });
            setErrors({ ...errors, destinationLocationId: '' });
          }}
          placeholder="Seleccione la sede de destino"
          error={errors.destinationLocationId}
          required
        />

        <Input
          label="Fecha Efectiva"
          type="date"
          value={formData.effectiveDate}
          onChange={(e) => {
            setFormData({ ...formData, effectiveDate: e.target.value });
            setErrors({ ...errors, effectiveDate: '' });
          }}
          min={today}
          error={errors.effectiveDate}
          helperText="Fecha en la que la transferencia debe hacerse efectiva"
          required
        />

        <Textarea
          label="Notas (Opcional)"
          value={formData.notes}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Añada cualquier información adicional sobre esta transferencia..."
          rows={4}
          helperText="Información adicional para la sede de destino"
        />

        <div className="flex gap-3 justify-end pt-4 border-t border-gray-100">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" loading={loading}>
            Crear Transferencia
          </Button>
        </div>
      </form>
    </Modal>
  );
};

