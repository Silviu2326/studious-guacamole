import React, { useState, useEffect } from 'react';
import { Modal, Button, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import { Supplier, SupplierFormData, SUPPLIER_CATEGORIES } from '../types';
import { Mail, Phone, User, FileText, Building2 } from 'lucide-react';

interface SupplierFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (formData: SupplierFormData) => void;
  initialData?: Partial<Supplier>;
  loading?: boolean;
}

export const SupplierFormModal: React.FC<SupplierFormModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  initialData,
  loading = false,
}) => {
  const [formData, setFormData] = useState<SupplierFormData>({
    name: '',
    category: SUPPLIER_CATEGORIES[0],
    status: 'pending_approval',
    contact: {
      name: '',
      email: '',
      phone: '',
    },
    fiscalData: {
      nif: '',
      cif: '',
      address: '',
    },
    notes: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        name: initialData.name || '',
        category: initialData.category || SUPPLIER_CATEGORIES[0],
        status: initialData.status || 'pending_approval',
        contact: {
          name: initialData.contact?.name || '',
          email: initialData.contact?.email || '',
          phone: initialData.contact?.phone || '',
        },
        fiscalData: {
          nif: initialData.fiscalData?.nif || '',
          cif: initialData.fiscalData?.cif || '',
          address: initialData.fiscalData?.address || '',
        },
        notes: initialData.notes || '',
      });
      setErrors({});
    } else if (!initialData && isOpen) {
      // Reset form when creating new supplier
      setFormData({
        name: '',
        category: SUPPLIER_CATEGORIES[0],
        status: 'pending_approval',
        contact: {
          name: '',
          email: '',
          phone: '',
        },
        fiscalData: {
          nif: '',
          cif: '',
          address: '',
        },
        notes: '',
      });
      setErrors({});
    }
  }, [initialData, isOpen]);

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido';
    }

    if (!formData.contact.name.trim()) {
      newErrors.contactName = 'El nombre de contacto es requerido';
    }

    if (!formData.contact.email.trim()) {
      newErrors.contactEmail = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.contact.email)) {
      newErrors.contactEmail = 'El email no es válido';
    }

    if (!formData.contact.phone.trim()) {
      newErrors.contactPhone = 'El teléfono es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onSubmit(formData);
    }
  };

  const categoryOptions = SUPPLIER_CATEGORIES.map((cat) => ({
    value: cat,
    label: cat,
  }));

  const statusOptions = [
    { value: 'pending_approval', label: 'Pendiente de Aprobación' },
    { value: 'approved', label: 'Aprobado' },
    { value: 'rejected', label: 'Rechazado' },
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={initialData ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading} type="submit">
            {initialData ? 'Guardar Cambios' : 'Crear Proveedor'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Información básica */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Información Básica
          </h3>
          
          <Input
            label="Nombre del Proveedor"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            error={errors.name}
            placeholder="Ej: TechnoGym Ibérica"
            leftIcon={<Building2 className="w-4 h-4" />}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Categoría"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              options={categoryOptions}
            />

            <Select
              label="Estado de Homologación"
              value={formData.status}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  status: e.target.value as 'approved' | 'pending_approval' | 'rejected',
                })
              }
              options={statusOptions}
            />
          </div>
        </div>

        {/* Información de contacto */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <User className="w-5 h-5" />
            Información de Contacto
          </h3>

          <Input
            label="Nombre de Contacto"
            value={formData.contact.name}
            onChange={(e) =>
              setFormData({
                ...formData,
                contact: { ...formData.contact, name: e.target.value },
              })
            }
            error={errors.contactName}
            placeholder="Ej: Carlos Pérez"
            leftIcon={<User className="w-4 h-4" />}
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Email"
              type="email"
              value={formData.contact.email}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, email: e.target.value },
                })
              }
              error={errors.contactEmail}
              placeholder="contacto@empresa.com"
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <Input
              label="Teléfono"
              type="tel"
              value={formData.contact.phone}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  contact: { ...formData.contact, phone: e.target.value },
                })
              }
              error={errors.contactPhone}
              placeholder="600112233"
              leftIcon={<Phone className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Datos fiscales */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Datos Fiscales (Opcional)
          </h3>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="NIF/CIF"
              value={formData.fiscalData?.nif || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fiscalData: {
                    ...formData.fiscalData,
                    nif: e.target.value,
                  },
                })
              }
              placeholder="A12345678"
            />

            <Input
              label="CIF (si aplica)"
              value={formData.fiscalData?.cif || ''}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  fiscalData: {
                    ...formData.fiscalData,
                    cif: e.target.value,
                  },
                })
              }
              placeholder="B12345678"
            />
          </div>

          <Input
            label="Dirección"
            value={formData.fiscalData?.address || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                fiscalData: {
                  ...formData.fiscalData,
                  address: e.target.value,
                },
              })
            }
            placeholder="Calle, Número, Ciudad, CP"
          />
        </div>

        {/* Notas */}
        <Textarea
          label="Notas Internas"
          value={formData.notes || ''}
          onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          placeholder="Información adicional sobre el proveedor..."
          rows={4}
        />
      </form>
    </Modal>
  );
};

