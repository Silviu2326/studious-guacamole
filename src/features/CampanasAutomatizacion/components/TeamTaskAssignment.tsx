import React, { useState, useMemo } from 'react';
import { Badge, Button, Card, Modal, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import {
  UserPlus,
  CheckCircle2,
  Clock,
  XCircle,
  AlertCircle,
  MessageSquare,
  FileText,
  Calendar,
  Users,
  Filter,
  Search,
  Plus,
  Edit,
  Trash2,
  Send,
} from 'lucide-react';
import { ds } from '../../adherencia/ui/ds';
import { TeamTask, TeamMemberRole, TaskStatus, TaskPriority, MultiChannelCampaign, MessagingChannel } from '../types';

const roleLabel: Record<TeamMemberRole, string> = {
  'copywriter': 'Copywriter',
  'community-manager': 'Community Manager',
  'designer': 'Diseñador',
  'video-editor': 'Editor de Video',
  'other': 'Otro',
};

const statusLabel: Record<TaskStatus, string> = {
  'pending': 'Pendiente',
  'in-progress': 'En progreso',
  'completed': 'Completada',
  'reviewed': 'Revisada',
  'cancelled': 'Cancelada',
};

const priorityLabel: Record<TaskPriority, string> = {
  'low': 'Baja',
  'medium': 'Media',
  'high': 'Alta',
  'urgent': 'Urgente',
};

const statusColor: Record<TaskStatus, React.ComponentProps<typeof Badge>['variant']> = {
  'pending': 'yellow',
  'in-progress': 'blue',
  'completed': 'green',
  'reviewed': 'purple',
  'cancelled': 'gray',
};

const priorityColor: Record<TaskPriority, React.ComponentProps<typeof Badge>['variant']> = {
  'low': 'gray',
  'medium': 'blue',
  'high': 'orange',
  'urgent': 'red',
};

const channelLabel: Record<MessagingChannel, string> = {
  email: 'Email',
  whatsapp: 'WhatsApp',
  sms: 'SMS',
  push: 'Push',
  'in-app': 'In-App',
};

interface TeamTaskAssignmentProps {
  campaign: MultiChannelCampaign;
  tasks?: TeamTask[];
  loading?: boolean;
  className?: string;
  onTaskCreate?: (task: Omit<TeamTask, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onTaskUpdate?: (taskId: string, task: Partial<TeamTask>) => void;
  onTaskDelete?: (taskId: string) => void;
  onTaskStatusChange?: (taskId: string, status: TaskStatus) => void;
}

export const TeamTaskAssignment: React.FC<TeamTaskAssignmentProps> = ({
  campaign,
  tasks = [],
  loading = false,
  className = '',
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
  onTaskStatusChange,
}) => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<TeamTask | null>(null);
  const [filterRole, setFilterRole] = useState<TeamMemberRole | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<TaskStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const initialFormState = useMemo(
    () => ({
      title: '',
      description: '',
      role: 'copywriter' as TeamMemberRole,
      assignedTo: {
        userId: '',
        userName: '',
        userEmail: '',
        role: 'copywriter' as TeamMemberRole,
        roleLabel: roleLabel['copywriter'],
      },
      priority: 'medium' as TaskPriority,
      dueDate: '',
      deliverables: [
        {
          type: 'copy' as const,
          description: '',
          requirements: [] as string[],
          examples: [] as string[],
        },
      ],
    }),
    []
  );

  const [formData, setFormData] = useState(initialFormState);

  // Mock team members - En producción esto vendría de un servicio
  const teamMembers = useMemo(
    () => [
      { id: '1', name: 'María González', email: 'maria@example.com', role: 'copywriter' as TeamMemberRole },
      { id: '2', name: 'Carlos Rodríguez', email: 'carlos@example.com', role: 'community-manager' as TeamMemberRole },
      { id: '3', name: 'Ana Martínez', email: 'ana@example.com', role: 'designer' as TeamMemberRole },
    ],
    []
  );

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesRole = filterRole === 'all' || task.role === filterRole;
      const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
      const matchesSearch =
        searchTerm === '' ||
        task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        task.description.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [tasks, filterRole, filterStatus, searchTerm]);

  const tasksByRole = useMemo(() => {
    const grouped: Record<TeamMemberRole, TeamTask[]> = {
      copywriter: [],
      'community-manager': [],
      designer: [],
      'video-editor': [],
      other: [],
    };
    tasks.forEach((task) => {
      if (grouped[task.role]) {
        grouped[task.role].push(task);
      }
    });
    return grouped;
  }, [tasks]);

  const tasksByStatus = useMemo(() => {
    const grouped: Record<TaskStatus, TeamTask[]> = {
      pending: [],
      'in-progress': [],
      completed: [],
      reviewed: [],
      cancelled: [],
    };
    tasks.forEach((task) => {
      grouped[task.status].push(task);
    });
    return grouped;
  }, [tasks]);

  const handleInputChange = (field: keyof typeof formData) => (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const value = event.target.value;
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRoleChange = (role: TeamMemberRole) => {
    setFormData((prev) => ({
      ...prev,
      role,
      assignedTo: {
        ...prev.assignedTo,
        role,
        roleLabel: roleLabel[role],
      },
    }));
  };

  const handleTeamMemberChange = (userId: string) => {
    const member = teamMembers.find((m) => m.id === userId);
    if (member) {
      setFormData((prev) => ({
        ...prev,
        assignedTo: {
          userId: member.id,
          userName: member.name,
          userEmail: member.email,
          role: member.role,
          roleLabel: roleLabel[member.role],
        },
        role: member.role,
      }));
    }
  };

  const handleCloseModal = () => {
    setIsCreateModalOpen(false);
    setFormData(initialFormState);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (onTaskCreate) {
      onTaskCreate({
        campaignId: campaign.id,
        campaignName: campaign.name,
        title: formData.title,
        description: formData.description,
        assignedTo: formData.assignedTo,
        role: formData.role,
        status: 'pending',
        priority: formData.priority,
        dueDate: formData.dueDate || undefined,
        context: {
          campaignObjective: campaign.objective,
          targetAudience: campaign.targetSegments.join(', '),
          channels: campaign.channels,
          campaignGoals: [campaign.objective],
        },
        deliverables: formData.deliverables,
        createdBy: 'current-user-id', // En producción usar el usuario actual
      });
    }
    handleCloseModal();
  };

  const handleViewTask = (task: TeamTask) => {
    setSelectedTask(task);
    setIsViewModalOpen(true);
  };

  const handleStatusChange = (taskId: string, newStatus: TaskStatus) => {
    if (onTaskStatusChange) {
      onTaskStatusChange(taskId, newStatus);
    }
  };

  const handleDelete = (taskId: string) => {
    if (onTaskDelete && confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      onTaskDelete(taskId);
    }
  };

  if (loading && tasks.length === 0) {
    return (
      <Card className={className}>
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className={`${ds.shimmer} h-24`} />
          ))}
        </div>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100">Tareas del Equipo</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Asigna tareas a copywriters y community managers desde la campaña
            </p>
          </div>
          <Button
            size="sm"
            leftIcon={<Plus size={16} />}
            onClick={() => setIsCreateModalOpen(true)}
          >
            Asignar Tarea
          </Button>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-sm text-slate-600 dark:text-slate-400">Total</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{tasks.length}</div>
          </div>
          <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-900/20">
            <div className="text-sm text-yellow-600 dark:text-yellow-400">Pendientes</div>
            <div className="text-2xl font-bold text-yellow-700 dark:text-yellow-300">
              {tasksByStatus.pending.length}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20">
            <div className="text-sm text-blue-600 dark:text-blue-400">En progreso</div>
            <div className="text-2xl font-bold text-blue-700 dark:text-blue-300">
              {tasksByStatus['in-progress'].length}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20">
            <div className="text-sm text-green-600 dark:text-green-400">Completadas</div>
            <div className="text-2xl font-bold text-green-700 dark:text-green-300">
              {tasksByStatus.completed.length}
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex-1 min-w-[200px]">
            <Input
              placeholder="Buscar tareas..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              leftIcon={<Search size={16} />}
            />
          </div>
          <Select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as TeamMemberRole | 'all')}
            leftIcon={<Users size={16} />}
          >
            <option value="all">Todos los roles</option>
            {Object.entries(roleLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
          <Select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as TaskStatus | 'all')}
            leftIcon={<Filter size={16} />}
          >
            <option value="all">Todos los estados</option>
            {Object.entries(statusLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        {/* Lista de tareas */}
        <div className="space-y-3">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <UserPlus className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-slate-400">No hay tareas asignadas</p>
              <Button
                size="sm"
                variant="secondary"
                className="mt-4"
                onClick={() => setIsCreateModalOpen(true)}
              >
                Asignar primera tarea
              </Button>
            </div>
          ) : (
            filteredTasks.map((task) => (
              <div
                key={task.id}
                className="p-4 rounded-lg border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 transition-colors cursor-pointer"
                onClick={() => handleViewTask(task)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-semibold text-slate-900 dark:text-slate-100">{task.title}</h4>
                      <Badge variant={statusColor[task.status]} size="sm">
                        {statusLabel[task.status]}
                      </Badge>
                      <Badge variant={priorityColor[task.priority]} size="sm">
                        {priorityLabel[task.priority]}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{task.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-500">
                      <span className="flex items-center gap-1">
                        <Users size={14} />
                        {task.assignedTo.userName} ({roleLabel[task.role]})
                      </span>
                      {task.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar size={14} />
                          {new Date(task.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleViewTask(task);
                      }}
                    >
                      Ver
                    </Button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Modal para crear tarea */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModal}
        title="Asignar Tarea al Equipo"
        size="lg"
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Título de la tarea
            </label>
            <Input
              value={formData.title}
              onChange={handleInputChange('title')}
              placeholder="Ej: Crear copy para email de bienvenida"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Descripción
            </label>
            <Textarea
              value={formData.description}
              onChange={handleInputChange('description')}
              placeholder="Describe la tarea en detalle..."
              rows={4}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Rol
              </label>
              <Select
                value={formData.role}
                onChange={(e) => handleRoleChange(e.target.value as TeamMemberRole)}
                required
              >
                {Object.entries(roleLabel).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Asignar a
              </label>
              <Select
                value={formData.assignedTo.userId}
                onChange={(e) => handleTeamMemberChange(e.target.value)}
                required
              >
                <option value="">Seleccionar miembro del equipo</option>
                {teamMembers
                  .filter((m) => m.role === formData.role)
                  .map((member) => (
                    <option key={member.id} value={member.id}>
                      {member.name} ({roleLabel[member.role]})
                    </option>
                  ))}
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Prioridad
              </label>
              <Select
                value={formData.priority}
                onChange={handleInputChange('priority')}
                required
              >
                {Object.entries(priorityLabel).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </Select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Fecha límite
              </label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={handleInputChange('dueDate')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Contexto de la campaña
            </label>
            <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-sm">
              <p className="font-medium mb-1">Objetivo: {campaign.objective}</p>
              <p className="mb-1">Audiencia: {campaign.targetSegments.join(', ')}</p>
              <p>Canales: {campaign.channels.map((c) => channelLabel[c]).join(', ')}</p>
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
            <Button type="button" variant="secondary" onClick={handleCloseModal}>
              Cancelar
            </Button>
            <Button type="submit" leftIcon={<Send size={16} />}>
              Asignar Tarea
            </Button>
          </div>
        </form>
      </Modal>

      {/* Modal para ver tarea */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title={selectedTask?.title || 'Detalles de la Tarea'}
        size="lg"
      >
        {selectedTask && (
          <div className="space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Badge variant={statusColor[selectedTask.status]} size="sm">
                  {statusLabel[selectedTask.status]}
                </Badge>
                <Badge variant={priorityColor[selectedTask.priority]} size="sm">
                  {priorityLabel[selectedTask.priority]}
                </Badge>
              </div>
              <p className="text-slate-600 dark:text-slate-400">{selectedTask.description}</p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Asignado a
                </label>
                <p className="text-sm text-slate-900 dark:text-slate-100">
                  {selectedTask.assignedTo.userName} ({roleLabel[selectedTask.role]})
                </p>
              </div>
              {selectedTask.dueDate && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Fecha límite
                  </label>
                  <p className="text-sm text-slate-900 dark:text-slate-100">
                    {new Date(selectedTask.dueDate).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Contexto de la campaña
              </label>
              <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50 text-sm">
                <p className="font-medium mb-1">Objetivo: {selectedTask.context.campaignObjective}</p>
                <p className="mb-1">Audiencia: {selectedTask.context.targetAudience}</p>
                <p>Canales: {selectedTask.context.channels.map((c) => channelLabel[c]).join(', ')}</p>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Entregables
              </label>
              <div className="space-y-2">
                {selectedTask.deliverables.map((deliverable, index) => (
                  <div key={index} className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                    <p className="font-medium text-sm">{deliverable.description}</p>
                    {deliverable.requirements && deliverable.requirements.length > 0 && (
                      <ul className="mt-2 text-sm text-slate-600 dark:text-slate-400 list-disc list-inside">
                        {deliverable.requirements.map((req, reqIndex) => (
                          <li key={reqIndex}>{req}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
              <Button
                variant="secondary"
                onClick={() => {
                  if (selectedTask.status !== 'completed') {
                    handleStatusChange(selectedTask.id, 'completed');
                  }
                  setIsViewModalOpen(false);
                }}
                disabled={selectedTask.status === 'completed'}
              >
                Marcar como completada
              </Button>
              <Button variant="secondary" onClick={() => setIsViewModalOpen(false)}>
                Cerrar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </Card>
  );
};

