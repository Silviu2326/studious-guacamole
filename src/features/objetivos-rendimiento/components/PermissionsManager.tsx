import React, { useState, useEffect } from 'react';
import { ObjectivePermissions, KPIPermissions, PermissionEntity, Objective, KPI } from '../types';
import { Card, Button, Modal, Input, Select, Badge } from '../../../components/componentsreutilizables';
import { Shield, User, Users, X, Plus, Search, Eye, Edit2, Settings } from 'lucide-react';
import { getTeamMembers, getRoles } from '../api/permissions';

interface PermissionsManagerProps {
  objective?: Objective;
  kpi?: KPI;
  onSave: (permissions: ObjectivePermissions | KPIPermissions) => void;
  onClose: () => void;
  isOpen: boolean;
}

export const PermissionsManager: React.FC<PermissionsManagerProps> = ({
  objective,
  kpi,
  onSave,
  onClose,
  isOpen,
}) => {
  const [permissions, setPermissions] = useState<ObjectivePermissions | KPIPermissions>({
    view: [],
    edit: [],
    ...(objective ? { approve: [] } : {}),
    ...(kpi ? { manage: [] } : {}),
  });
  const [availableUsers, setAvailableUsers] = useState<PermissionEntity[]>([]);
  const [availableRoles, setAvailableRoles] = useState<PermissionEntity[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'view' | 'edit' | 'approve' | 'manage'>('view');

  useEffect(() => {
    if (isOpen) {
      loadData();
      if (objective?.permissions) {
        setPermissions(objective.permissions);
      } else if (kpi?.permissions) {
        setPermissions(kpi.permissions);
      }
    }
  }, [isOpen, objective, kpi]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [users, roles] = await Promise.all([
        getTeamMembers(),
        getRoles(),
      ]);
      setAvailableUsers(users);
      setAvailableRoles(roles);
    } catch (error) {
      console.error('Error loading permissions data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = availableUsers.filter(
    (user) =>
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredRoles = availableRoles.filter((role) =>
    role.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const addPermission = (entityId: string, permissionType: 'view' | 'edit' | 'approve' | 'manage') => {
    const currentList = permissions[permissionType] || [];
    if (!currentList.includes(entityId)) {
      setPermissions({
        ...permissions,
        [permissionType]: [...currentList, entityId],
      });
    }
  };

  const removePermission = (entityId: string, permissionType: 'view' | 'edit' | 'approve' | 'manage') => {
    const currentList = permissions[permissionType] || [];
    setPermissions({
      ...permissions,
      [permissionType]: currentList.filter((id) => id !== entityId),
    });
  };

  const getEntityName = (entityId: string): string => {
    const user = availableUsers.find((u) => u.id === entityId);
    if (user) return user.name;
    const role = availableRoles.find((r) => r.id === entityId);
    return role?.name || entityId;
  };

  const getEntityType = (entityId: string): 'user' | 'role' => {
    return availableUsers.some((u) => u.id === entityId) ? 'user' : 'role';
  };

  const handleSave = () => {
    onSave(permissions);
    onClose();
  };

  const tabs = [
    { id: 'view' as const, label: 'Ver', icon: Eye },
    { id: 'edit' as const, label: 'Editar', icon: Edit2 },
    ...(objective ? [{ id: 'approve' as const, label: 'Aprobar', icon: Shield }] : []),
    ...(kpi ? [{ id: 'manage' as const, label: 'Gestionar', icon: Settings }] : []),
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Gestionar Permisos - ${objective?.title || kpi?.name || ''}`}
      size="xl"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Guardar Permisos
          </Button>
        </div>
      }
    >
      <div className="space-y-6">
        <Card className="p-4 bg-blue-50 border border-blue-200">
          <div className="flex items-start gap-3">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5" />
            <div className="flex-1">
              <h3 className="text-sm font-semibold text-blue-900 mb-1">Gestión de Permisos</h3>
              <p className="text-sm text-blue-700">
                Controla quién puede ver, editar, aprobar o gestionar este {objective ? 'objetivo' : 'KPI'}.
                Puedes asignar permisos a usuarios individuales o a roles completos.
              </p>
            </div>
          </div>
        </Card>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Current permissions */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">
            Permisos de {tabs.find((t) => t.id === activeTab)?.label}
          </h4>
          <div className="space-y-2">
            {(permissions[activeTab] || []).length === 0 ? (
              <p className="text-sm text-gray-500 italic">No hay permisos asignados</p>
            ) : (
              (permissions[activeTab] || []).map((entityId) => {
                const entityType = getEntityType(entityId);
                return (
                  <div
                    key={entityId}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <div className="flex items-center gap-3">
                      {entityType === 'user' ? (
                        <User className="w-5 h-5 text-gray-600" />
                      ) : (
                        <Users className="w-5 h-5 text-gray-600" />
                      )}
                      <div>
                        <div className="font-medium text-gray-900">{getEntityName(entityId)}</div>
                        <Badge variant={entityType === 'user' ? 'blue' : 'purple'} className="mt-1">
                          {entityType === 'user' ? 'Usuario' : 'Rol'}
                        </Badge>
                      </div>
                    </div>
                    <button
                      onClick={() => removePermission(entityId, activeTab)}
                      className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Add permissions */}
        <div>
          <h4 className="text-sm font-semibold text-gray-900 mb-3">Agregar Permisos</h4>
          <Input
            placeholder="Buscar usuarios o roles..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="mb-4"
            icon={<Search className="w-4 h-4" />}
          />

          {/* Users */}
          <div className="mb-4">
            <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <User className="w-4 h-4" />
              Usuarios
            </h5>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredUsers
                .filter((user) => !(permissions[activeTab] || []).includes(user.id))
                .map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded border border-gray-200"
                  >
                    <div>
                      <div className="font-medium text-sm text-gray-900">{user.name}</div>
                      {user.email && (
                        <div className="text-xs text-gray-500">{user.email}</div>
                      )}
                    </div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => addPermission(user.id, activeTab)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar
                    </Button>
                  </div>
                ))}
              {filteredUsers.filter((user) => !(permissions[activeTab] || []).includes(user.id))
                .length === 0 && (
                <p className="text-sm text-gray-500 italic text-center py-2">
                  No hay usuarios disponibles
                </p>
              )}
            </div>
          </div>

          {/* Roles */}
          <div>
            <h5 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Roles
            </h5>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredRoles
                .filter((role) => !(permissions[activeTab] || []).includes(role.id))
                .map((role) => (
                  <div
                    key={role.id}
                    className="flex items-center justify-between p-2 hover:bg-gray-50 rounded border border-gray-200"
                  >
                    <div className="font-medium text-sm text-gray-900">{role.name}</div>
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => addPermission(role.id, activeTab)}
                    >
                      <Plus className="w-4 h-4 mr-1" />
                      Agregar
                    </Button>
                  </div>
                ))}
              {filteredRoles.filter((role) => !(permissions[activeTab] || []).includes(role.id))
                .length === 0 && (
                <p className="text-sm text-gray-500 italic text-center py-2">
                  No hay roles disponibles
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

