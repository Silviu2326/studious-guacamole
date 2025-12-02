import React, { useState, useEffect } from 'react';
import { Modal, Input, Button, Card } from '../../../components/componentsreutilizables';
import { Role, PermissionGroup } from '../types';
import { CheckCircle2, Circle, Shield } from 'lucide-react';

interface RoleEditorProps {
  role: Role | null;
  allPermissions: PermissionGroup[];
  onSave: (roleData: { name: string; permissions: string[] }) => void;
  isOpen: boolean;
  onClose: () => void;
  loading?: boolean;
}

export const RoleEditor: React.FC<RoleEditorProps> = ({
  role,
  allPermissions,
  onSave,
  isOpen,
  onClose,
  loading = false,
}) => {
  const [roleName, setRoleName] = useState('');
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);
  const [nameError, setNameError] = useState<string>('');

  useEffect(() => {
    if (role) {
      setRoleName(role.name);
      setSelectedPermissions(role.permissions || []);
    } else {
      setRoleName('');
      setSelectedPermissions([]);
    }
    setNameError('');
  }, [role, isOpen]);

  const togglePermission = (permissionKey: string) => {
    setSelectedPermissions((prev) =>
      prev.includes(permissionKey)
        ? prev.filter((p) => p !== permissionKey)
        : [...prev, permissionKey]
    );
  };

  const toggleCategory = (category: PermissionGroup) => {
    const categoryPermissions = category.permissions.map((p) => p.key);
    const allSelected = categoryPermissions.every((key) => selectedPermissions.includes(key));

    if (allSelected) {
      // Deseleccionar todos los permisos de esta categoría
      setSelectedPermissions((prev) =>
        prev.filter((key) => !categoryPermissions.includes(key))
      );
    } else {
      // Seleccionar todos los permisos de esta categoría
      setSelectedPermissions((prev) => {
        const newPermissions = [...prev];
        categoryPermissions.forEach((key) => {
          if (!newPermissions.includes(key)) {
            newPermissions.push(key);
          }
        });
        return newPermissions;
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!roleName.trim()) {
      setNameError('El nombre del rol es requerido');
      return;
    }

    if (selectedPermissions.length === 0) {
      setNameError('Debe seleccionar al menos un permiso');
      return;
    }

    onSave({
      name: roleName.trim(),
      permissions: selectedPermissions,
    });
  };

  const handleClose = () => {
    setRoleName('');
    setSelectedPermissions([]);
    setNameError('');
    onClose();
  };

  const isCategorySelected = (category: PermissionGroup): boolean => {
    const categoryPermissions = category.permissions.map((p) => p.key);
    return categoryPermissions.length > 0 && categoryPermissions.every((key) => selectedPermissions.includes(key));
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={role ? 'Editar Rol' : 'Crear Nuevo Rol'}
      size="lg"
      footer={
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={handleClose} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSubmit} loading={loading}>
            {role ? 'Guardar Cambios' : 'Crear Rol'}
          </Button>
        </div>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <Input
            label="Nombre del Rol"
            value={roleName}
            onChange={(e) => {
              setRoleName(e.target.value);
              setNameError('');
            }}
            error={nameError}
            placeholder="Ej: Coordinador de Clases"
            required
            disabled={!!role && !role.isCustom}
          />
          {role && !role.isCustom && (
            <p className="mt-1 text-xs text-gray-500">
              Los roles predefinidos no se pueden renombrar
            </p>
          )}
        </div>

        <div>
          <div className="flex items-center gap-2 mb-4">
            <Shield className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              Permisos
            </h3>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {allPermissions.map((category) => {
              const categorySelected = isCategorySelected(category);
              return (
                <Card key={category.category} className="p-4 bg-white shadow-sm">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-base font-semibold text-gray-900">
                      {category.category}
                    </h4>
                    <button
                      type="button"
                      onClick={() => toggleCategory(category)}
                      className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                    >
                      {categorySelected ? 'Deseleccionar todos' : 'Seleccionar todos'}
                    </button>
                  </div>
                  <div className="space-y-2">
                    {category.permissions.map((permission) => {
                      const isSelected = selectedPermissions.includes(permission.key);
                      return (
                        <div
                          key={permission.key}
                          className={`flex items-start gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                            isSelected
                              ? 'bg-blue-50 border-blue-200'
                              : 'bg-white border-gray-200 hover:bg-gray-50'
                          }`}
                          onClick={() => togglePermission(permission.key)}
                        >
                          <button
                            type="button"
                            className="mt-0.5 flex-shrink-0"
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePermission(permission.key);
                            }}
                          >
                            {isSelected ? (
                              <CheckCircle2 className="w-5 h-5 text-blue-600" />
                            ) : (
                              <Circle className="w-5 h-5 text-gray-400" />
                            )}
                          </button>
                          <div className="flex-1">
                            <div className="font-medium text-gray-900">
                              {permission.label}
                            </div>
                            {permission.description && (
                              <div className="mt-1 text-xs text-gray-500">
                                {permission.description}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              );
            })}
          </div>

          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600">
              Permisos seleccionados: {selectedPermissions.length}
            </p>
          </div>
        </div>
      </form>
    </Modal>
  );
};

