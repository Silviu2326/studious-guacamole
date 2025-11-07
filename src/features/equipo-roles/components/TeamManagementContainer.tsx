import React, { useState, useEffect } from 'react';
import { Card, Button, Select, MetricCards, Badge } from '../../../components/componentsreutilizables';
import { TeamMembersTable } from './TeamMembersTable';
import { InviteMemberModal } from './InviteMemberModal';
import { RoleEditor } from './RoleEditor';
import { TeamService, RolesService } from '../api';
import { TeamMember, Role, PermissionGroup } from '../types';
import { UserPlus, Shield, Users, Search, Loader2, Package, AlertCircle } from 'lucide-react';

export const TeamManagementContainer: React.FC = () => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByRole, setFilterByRole] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<string>('members');
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);
  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);
  const [roleLoading, setRoleLoading] = useState(false);
  const [pagination, setPagination] = useState({
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  });

  // Permisos del sistema agrupados por categoría
  const systemPermissions: PermissionGroup[] = [
    {
      category: 'Clientes',
      permissions: [
        { key: 'view_clients', label: 'Ver Clientes', description: 'Visualizar lista de clientes' },
        { key: 'edit_clients', label: 'Editar Clientes', description: 'Modificar información de clientes' },
        { key: 'delete_clients', label: 'Eliminar Clientes', description: 'Eliminar clientes del sistema' },
        { key: 'view_client_notes', label: 'Ver Notas de Clientes', description: 'Acceder a notas y comentarios' },
        { key: 'edit_client_notes', label: 'Editar Notas de Clientes', description: 'Crear y modificar notas' },
      ],
    },
    {
      category: 'Clases y Horarios',
      permissions: [
        { key: 'manage_classes', label: 'Gestionar Clases', description: 'Crear, editar y eliminar clases grupales' },
        { key: 'view_schedule', label: 'Ver Horario', description: 'Visualizar calendario y horarios' },
        { key: 'manage_appointments', label: 'Gestionar Citas', description: 'Programar y modificar citas' },
      ],
    },
    {
      category: 'Finanzas',
      permissions: [
        { key: 'view_financial_reports', label: 'Ver Informes Financieros', description: 'Acceder a reportes de ingresos y egresos' },
        { key: 'manage_payments', label: 'Gestionar Pagos', description: 'Procesar pagos y cobros' },
        { key: 'view_sales', label: 'Ver Ventas', description: 'Visualizar historial de ventas' },
      ],
    },
    {
      category: 'Equipo',
      permissions: [
        { key: 'manage_team', label: 'Gestionar Equipo', description: 'Invitar y gestionar miembros del equipo' },
        { key: 'manage_roles', label: 'Gestionar Roles', description: 'Crear y editar roles personalizados' },
      ],
    },
    {
      category: 'Entrenamientos',
      permissions: [
        { key: 'view_routines', label: 'Ver Rutinas', description: 'Visualizar rutinas de entrenamiento' },
        { key: 'edit_routines', label: 'Editar Rutinas', description: 'Modificar rutinas de entrenamiento' },
        { key: 'assign_routines', label: 'Asignar Rutinas', description: 'Asignar rutinas a clientes' },
      ],
    },
  ];

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadMembers();
  }, [searchTerm, filterByRole, pagination.page]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [membersData, rolesData] = await Promise.all([
        TeamService.getMembers({
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm || undefined,
          roleId: filterByRole !== 'all' ? filterByRole : undefined,
        }),
        RolesService.getRoles(),
      ]);

      setTeamMembers(membersData.data);
      setPagination(membersData.pagination);
      setRoles(rolesData);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los datos');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadMembers = async () => {
    try {
      setIsLoading(true);
      const membersData = await TeamService.getMembers({
        page: pagination.page,
        limit: pagination.limit,
        search: searchTerm || undefined,
        roleId: filterByRole !== 'all' ? filterByRole : undefined,
      });
      setTeamMembers(membersData.data);
      setPagination(membersData.pagination);
    } catch (err: any) {
      setError(err.message || 'Error al cargar los miembros');
      console.error('Error loading members:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInviteSubmit = async (invitationData: { name: string; email: string; roleId: string }) => {
    try {
      setInviteLoading(true);
      await TeamService.inviteMember(invitationData);
      setIsInviteModalOpen(false);
      await loadMembers();
    } catch (err: any) {
      setError(err.message || 'Error al enviar la invitación');
      console.error('Error inviting member:', err);
    } finally {
      setInviteLoading(false);
    }
  };

  const handleEditMember = (member: TeamMember) => {
    // Aquí se podría abrir un modal de edición diferente
    // Por ahora, no implementado
    console.log('Edit member:', member);
  };

  const handleToggleStatus = async (memberId: string, currentStatus: 'active' | 'inactive' | 'pending') => {
    try {
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await TeamService.updateMember(memberId, { status: newStatus });
      await loadMembers();
    } catch (err: any) {
      setError(err.message || 'Error al actualizar el estado del miembro');
      console.error('Error toggling status:', err);
    }
  };

  const handleSaveRole = async (roleData: { name: string; permissions: string[] }) => {
    try {
      setRoleLoading(true);
      await RolesService.createRole(roleData);
      setIsRoleModalOpen(false);
      await loadData();
    } catch (err: any) {
      setError(err.message || 'Error al crear el rol');
      console.error('Error saving role:', err);
    } finally {
      setRoleLoading(false);
    }
  };

  const roleOptions = [
    { value: 'all', label: 'Todos los roles' },
    ...roles.map((role) => ({ value: role.id, label: role.name })),
  ];

  const kpis = [
    {
      id: 'total',
      title: 'Total Miembros',
      value: pagination.total.toString(),
      icon: <Users className="w-6 h-6" />,
      color: 'info' as const,
    },
    {
      id: 'active',
      title: 'Activos',
      value: teamMembers.filter((m) => m.status === 'active').length.toString(),
      icon: <Users className="w-6 h-6" />,
      color: 'success' as const,
    },
    {
      id: 'inactive',
      title: 'Inactivos',
      value: teamMembers.filter((m) => m.status === 'inactive').length.toString(),
      icon: <Users className="w-6 h-6" />,
      color: 'error' as const,
    },
    {
      id: 'roles',
      title: 'Roles',
      value: roles.length.toString(),
      icon: <Shield className="w-6 h-6" />,
      color: 'primary' as const,
    },
  ];

  const renderTabContent = () => {
    if (activeTab === 'members') {
      return (
        <div className="space-y-6">
          {/* Toolbar */}
          <div className="flex items-center justify-end">
            <Button
              variant="primary"
              onClick={() => setIsInviteModalOpen(true)}
            >
              <UserPlus size={20} className="mr-2" />
              Invitar Miembro
            </Button>
          </div>

          {/* Sistema de Filtros */}
          <Card className="bg-white shadow-sm">
            <div className="space-y-4">
              {/* Barra de búsqueda */}
              <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
                <div className="flex gap-4">
                  <div className="relative flex-1">
                    <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                      <Search size={20} className="text-slate-400" />
                    </span>
                    <input
                      type="text"
                      className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                      placeholder="Buscar por nombre o email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </div>
                  <div className="w-64">
                    <Select
                      options={roleOptions}
                      value={filterByRole}
                      onChange={(e) => setFilterByRole(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              {/* Resumen de resultados */}
              <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
                <span>{pagination.total} resultados encontrados</span>
              </div>
            </div>
          </Card>

          {/* Error */}
          {error && (
            <Card className="p-8 text-center bg-white shadow-sm">
              <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
              <p className="text-gray-600 mb-4">{error}</p>
            </Card>
          )}

          {/* Tabla de miembros */}
          {isLoading && !teamMembers.length ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando...</p>
            </Card>
          ) : teamMembers.length === 0 && !error ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay miembros</h3>
              <p className="text-gray-600 mb-4">No se encontraron miembros del equipo. Invita a nuevos miembros para comenzar.</p>
              <Button
                variant="primary"
                onClick={() => setIsInviteModalOpen(true)}
              >
                <UserPlus size={20} className="mr-2" />
                Invitar Miembro
              </Button>
            </Card>
          ) : (
            <TeamMembersTable
              members={teamMembers}
              onEdit={handleEditMember}
              onToggleStatus={handleToggleStatus}
              loading={isLoading}
            />
          )}

          {/* Paginación */}
          {pagination.totalPages > 1 && (
            <Card className="p-4 bg-white shadow-sm">
              <div className="flex justify-center items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page - 1 })}
                  disabled={pagination.page === 1}
                >
                  Anterior
                </Button>
                <span className="text-sm text-gray-700">
                  Página {pagination.page} de {pagination.totalPages}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPagination({ ...pagination, page: pagination.page + 1 })}
                  disabled={pagination.page >= pagination.totalPages}
                >
                  Siguiente
                </Button>
              </div>
            </Card>
          )}
        </div>
      );
    }

    if (activeTab === 'roles') {
      return (
        <div className="space-y-6">
          {/* Toolbar */}
          <div className="flex items-center justify-end">
            <Button
              variant="primary"
              onClick={() => {
                setIsRoleModalOpen(true);
              }}
            >
              <Shield size={20} className="mr-2" />
              Crear Rol
            </Button>
          </div>

          {/* Estados de carga y vacío */}
          {isLoading && !roles.length ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
              <p className="text-gray-600">Cargando...</p>
            </Card>
          ) : roles.length === 0 && !error ? (
            <Card className="p-8 text-center bg-white shadow-sm">
              <Shield size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay roles</h3>
              <p className="text-gray-600 mb-4">Crea roles personalizados para gestionar los permisos de tu equipo.</p>
              <Button
                variant="primary"
                onClick={() => setIsRoleModalOpen(true)}
              >
                <Shield size={20} className="mr-2" />
                Crear Rol
              </Button>
            </Card>
          ) : (
            /* Grid de roles */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {roles.map((role) => (
                <Card key={role.id} variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
                  <div className="p-4 flex flex-col h-full">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {role.name}
                      </h4>
                      {role.isCustom && (
                        <Badge variant="blue" size="sm">
                          Personalizado
                        </Badge>
                      )}
                    </div>
                    {role.permissions && (
                      <p className="text-sm text-gray-600">
                        {role.permissions.length} permisos
                      </p>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <MetricCards data={kpis} />

      {/* Sistema de Tabs */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div
            role="tablist"
            aria-label="Secciones"
            className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
          >
            <button
              onClick={() => setActiveTab('members')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                activeTab === 'members'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <Users size={18} className={activeTab === 'members' ? 'opacity-100' : 'opacity-70'} />
              <span>Miembros del Equipo</span>
            </button>
            <button
              onClick={() => setActiveTab('roles')}
              className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                activeTab === 'roles'
                  ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
              }`}
            >
              <Shield size={18} className={activeTab === 'roles' ? 'opacity-100' : 'opacity-70'} />
              <span>Roles</span>
            </button>
          </div>
        </div>
        <div className="mt-6 px-4 pb-4">
          {renderTabContent()}
        </div>
      </Card>

      {/* Modales */}
      <InviteMemberModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onSubmit={handleInviteSubmit}
        availableRoles={roles}
        loading={inviteLoading}
      />

      <RoleEditor
        role={null}
        allPermissions={systemPermissions}
        onSave={handleSaveRole}
        isOpen={isRoleModalOpen}
        onClose={() => setIsRoleModalOpen(false)}
        loading={roleLoading}
      />
    </div>
  );
};

