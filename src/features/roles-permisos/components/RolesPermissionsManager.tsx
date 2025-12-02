import React, { useState, useEffect } from 'react';
import { Card, Button, ConfirmModal } from '../../../components/componentsreutilizables';
import { RoleListTable } from './RoleListTable';
import { RoleEditorModal } from './RoleEditorModal';
import { RolesApiService } from '../api';
import { Role, PermissionGroup } from '../types';
import { Plus, Search, AlertCircle } from 'lucide-react';

export const RolesPermissionsManager: React.FC = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<PermissionGroup[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [roleToDelete, setRoleToDelete] = useState<Role | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Cargar datos iniciales
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const [rolesData, permissionsData] = await Promise.all([
        RolesApiService.getRoles(),
        RolesApiService.getPermissions(),
      ]);
      setRoles(rolesData);
      setPermissions(permissionsData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar los datos');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateRole = () => {
    setSelectedRole(null);
    setIsModalOpen(true);
  };

  const handleEditRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      setSelectedRole(role);
      setIsModalOpen(true);
    }
  };

  const handleDeleteRole = (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (role) {
      setRoleToDelete(role);
      setIsDeleteModalOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!roleToDelete) return;

    setIsLoading(true);
    try {
      await RolesApiService.deleteRole(roleToDelete.id);
      await loadData();
      setIsDeleteModalOpen(false);
      setRoleToDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al eliminar el rol');
      setIsLoading(false);
    }
  };

  const handleCloneRole = async (roleId: string) => {
    const role = roles.find(r => r.id === roleId);
    if (!role) return;

    setIsLoading(true);
    try {
      const clonedRole = {
        name: `${role.name} (Copia)`,
        description: role.description,
        permissions: role.permissions || [],
      };
      await RolesApiService.createRole(clonedRole);
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al clonar el rol');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveRole = async (roleData: Partial<Role>) => {
    if (selectedRole) {
      // Actualizar rol existente
      await RolesApiService.updateRole(selectedRole.id, roleData);
    } else {
      // Crear nuevo rol
      await RolesApiService.createRole({
        name: roleData.name!,
        description: roleData.description!,
        permissions: roleData.permissions || [],
      });
    }
    await loadData();
  };

  // Filtrar roles por término de búsqueda
  const filteredRoles = roles.filter(role =>
    role.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    role.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const rolesWithUserCount: Role[] = filteredRoles.map(role => ({
    ...role,
    userCount: role.userCount || 0,
  }));

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button onClick={handleCreateRole}>
          <Plus size={20} className="mr-2" />
          Crear Nuevo Rol
        </Button>
      </div>

      {/* Sistema de Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                  placeholder="Buscar roles por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Resumen de resultados */}
          {filteredRoles.length > 0 && (
            <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
              <span>{filteredRoles.length} {filteredRoles.length === 1 ? 'rol encontrado' : 'roles encontrados'}</span>
              {searchTerm && (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                >
                  Limpiar búsqueda
                </button>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Error Alert */}
      {error && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <div className="flex items-start gap-3 text-left">
            <AlertCircle size={48} className="text-red-500 flex-shrink-0" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Tabla de roles */}
      <RoleListTable
        roles={rolesWithUserCount as any}
        onEdit={handleEditRole}
        onDelete={handleDeleteRole}
        onClone={handleCloneRole}
        loading={isLoading}
      />

      {/* Modal de edición/creación */}
      <RoleEditorModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedRole(null);
        }}
        onSave={handleSaveRole}
        initialData={selectedRole}
        allPermissions={permissions}
      />

      {/* Modal de confirmación de eliminación */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setRoleToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Eliminar Rol"
        message={
          roleToDelete
            ? `¿Estás seguro de que quieres eliminar el rol "${roleToDelete.name}"? ${
                roleToDelete.userCount > 0
                  ? `Este rol tiene ${roleToDelete.userCount} usuario(s) asignado(s).`
                  : ''
              }`
            : ''
        }
        confirmText="Eliminar"
        cancelText="Cancelar"
        variant="destructive"
      />
    </div>
  );
};

