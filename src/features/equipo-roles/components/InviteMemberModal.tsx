import React, { useState } from 'react';
import { Modal, Input, Select, Button } from '../../../components/componentsreutilizables';
import { Role } from '../types';
import { Mail, User } from 'lucide-react';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (invitationData: { name: string; email: string; roleId: string }) => void;
  availableRoles: Role[];
  loading?: boolean;
}

export const InviteMemberModal: React.FC<InviteMemberModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  availableRoles,
  loading = false,
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    roleId: '',
  });
  const [formErrors, setFormErrors] = useState<{ email?: string; name?: string; roleId?: string }>({});

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const errors: { email?: string; name?: string; roleId?: string } = {};
    
    if (!formData.name.trim()) {
      errors.name = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'El correo electrónico es requerido';
    } else if (!validateEmail(formData.email)) {
      errors.email = 'El correo electrónico no es válido';
    }
    
    if (!formData.roleId) {
      errors.roleId = 'Debe seleccionar un rol';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    onSubmit(formData);
    // Reset form after submission
    setFormData({ name: '', email: '', roleId: '' });
    setFormErrors({});
  };

  const handleClose = () => {
    setFormData({ name: '', email: '', roleId: '' });
    setFormErrors({});
    onClose();
  };

  const roleOptions = availableRoles.map(role => ({
    value: role.id,
    label: role.name,
  }));

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Invitar Nuevo Miembro"
      size="md"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            Enviar Invitación
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nombre Completo"
          value={formData.name}
          onChange={(e) => {
            setFormData({ ...formData, name: e.target.value });
            setFormErrors({ ...formErrors, name: undefined });
          }}
          error={formErrors.name}
          leftIcon={<User size={16} />}
          placeholder="Ej: Ana García"
          required
        />

        <Input
          label="Correo Electrónico"
          type="email"
          value={formData.email}
          onChange={(e) => {
            setFormData({ ...formData, email: e.target.value });
            setFormErrors({ ...formErrors, email: undefined });
          }}
          error={formErrors.email}
          leftIcon={<Mail size={16} />}
          placeholder="ana.garcia@example.com"
          required
        />

        <Select
          label="Rol"
          options={roleOptions}
          value={formData.roleId}
          onChange={(e) => {
            setFormData({ ...formData, roleId: e.target.value });
            setFormErrors({ ...formErrors, roleId: undefined });
          }}
          error={formErrors.roleId}
          placeholder="Seleccione un rol"
          required
        />
      </form>
    </Modal>
  );
};

