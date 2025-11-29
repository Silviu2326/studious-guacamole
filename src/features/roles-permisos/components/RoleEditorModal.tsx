import React, { useState, useEffect } from 'react';
import { Modal } from '../../../components/componentsreutilizables';
import { Button, Input, Textarea } from '../../../components/componentsreutilizables';
import { PermissionSelector } from './PermissionSelector';
import { Role, PermissionGroup } from '../types';
import { AlertCircle } from 'lucide-react';

export interface RoleEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (roleData: Partial<Role>) => Promise<void>;
  initialData?: Role | null;
  allPermissions: PermissionGroup[];
}

export const RoleEditorModal: React.FC<RoleEditorModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  allPermissions,
}) => {
  const [roleName, setRoleName] = useState('');
  const [roleDescription, setRoleDescription] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (initialData) {
      setRoleName(initialData.name);
      setRoleDescription(initialData.description);
      setSelectedPermissions(initialData.permissions || []);
      setError(null);
    } else {
      // Modo creación
      setRoleName('');
      setRoleDescription('');
      setSelectedPermissions([]);
      setError(null);
    }
  }, [initialData, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!roleName.trim()) {
      setError('El nombre del rol es requerido');
      return;
    }

    setIsLoading(true);
    try {
      const roleData: Partial<Role> = {
        name: roleName.trim(),
        description: roleDescription.trim(),
        permissions: selectedPermissions,
      };

      await onSave(roleData);
      
      // Reset form
      setRoleName('');
      setRoleDescription('');
      setSelectedPermissions([]);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar el rol');
    } finally {
      setIsLoading(false);
    }
  };

  const modalTitle = initialData ? 'Editar Rol' : 'Crear Nuevo Rol';

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      size="xl"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={isLoading} type="submit">
            {initialData ? 'Actualizar' : 'Crear'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-200">
            <div className="flex items-start gap-3">
              <AlertCircle size={20} className="text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700">
                {error}
              </p>
            </div>
          </div>
        )}

        <div className="space-y-4">
          <Input
            label="Nombre del Rol"
            value={roleName}
            onChange={(e) => setRoleName(e.target.value)}
            placeholder="Ej: Recepcionista, Entrenador Senior"
            required
            disabled={initialData?.isDefault}
          />
          
          <Textarea
            label="Descripción"
            value={roleDescription}
            onChange={(e) => setRoleDescription(e.target.value)}
            placeholder="Describe las responsabilidades y alcance de este rol"
            rows={3}
          />

          {initialData?.isDefault && (
            <div className="p-3 rounded-xl bg-yellow-50 border border-yellow-200">
              <p className="text-sm text-yellow-700">
                Este es un rol por defecto. No se pueden modificar sus permisos.
              </p>
            </div>
          )}
        </div>

        {!initialData?.isDefault && (
          <div className="space-y-3">
            <h3 className="text-lg font-semibold text-gray-900">
              Permisos
            </h3>
            <p className="text-sm text-gray-600">
              Selecciona los permisos que tendrá este rol. Los permisos están agrupados por categoría.
            </p>
            <PermissionSelector
              permissionGroups={allPermissions}
              selectedPermissions={selectedPermissions}
              onChange={setSelectedPermissions}
            />
            <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
              <p className="text-sm text-purple-700">
                {selectedPermissions.length} permiso{selectedPermissions.length !== 1 ? 's' : ''} seleccionado{selectedPermissions.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        )}
      </form>
    </Modal>
  );
};

