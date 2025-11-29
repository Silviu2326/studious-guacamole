import { useState, useEffect, useMemo } from 'react';
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
  Send,
  Film,
  Image as ImageIcon,
  Loader2,
} from 'lucide-react';
import { Badge, Button, Card, Modal, Input, Select, Textarea } from '../../../components/componentsreutilizables';
import type {
  ContentAssignment,
  ContentTeamRole,
  ContentAssignmentStatus,
  ContentAssignmentPriority,
  TeamMember,
  ContentPiece,
  CreateContentAssignmentRequest,
} from '../types';
import {
  getContentAssignments,
  getTeamMembers,
  getAvailableContentPieces,
  createContentAssignment,
  getAssignmentStats,
} from '../api/contentAssignments';

interface ContentTeamAssignmentProps {
  loading?: boolean;
}

const roleLabel: Record<ContentTeamRole, string> = {
  'video-editor': 'Editor de Video',
  designer: 'Diseñador',
  copywriter: 'Copywriter',
  'community-manager': 'Community Manager',
};

const statusLabel: Record<ContentAssignmentStatus, string> = {
  pending: 'Pendiente',
  'in-progress': 'En progreso',
  completed: 'Completada',
  reviewed: 'Revisada',
  'needs-revision': 'Necesita revisión',
  cancelled: 'Cancelada',
};

const priorityLabel: Record<ContentAssignmentPriority, string> = {
  low: 'Baja',
  medium: 'Media',
  high: 'Alta',
  urgent: 'Urgente',
};

const statusColor: Record<ContentAssignmentStatus, React.ComponentProps<typeof Badge>['variant']> = {
  pending: 'yellow',
  'in-progress': 'blue',
  completed: 'green',
  reviewed: 'purple',
  'needs-revision': 'orange',
  cancelled: 'gray',
};

const priorityColor: Record<ContentAssignmentPriority, React.ComponentProps<typeof Badge>['variant']> = {
  low: 'gray',
  medium: 'blue',
  high: 'orange',
  urgent: 'red',
};

export function ContentTeamAssignment({ loading: externalLoading }: ContentTeamAssignmentProps) {
  const [assignments, setAssignments] = useState<ContentAssignment[]>([]);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [contentPieces, setContentPieces] = useState<ContentPiece[]>([]);
  const [loading, setLoading] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [filterRole, setFilterRole] = useState<ContentTeamRole | 'all'>('all');
  const [filterStatus, setFilterStatus] = useState<ContentAssignmentStatus | 'all'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({
    pendingAssignments: 0,
    inProgressAssignments: 0,
    completedAssignments: 0,
    totalAssignments: 0,
  });

  const [formData, setFormData] = useState<Partial<CreateContentAssignmentRequest>>({
    contentPieceId: '',
    assignedToId: '',
    role: 'video-editor',
    priority: 'medium',
    dueDate: '',
    instructions: '',
    requirements: [],
    deliverables: [
      {
        type: 'video',
        description: '',
        format: '',
        specifications: [],
      },
    ],
    context: {},
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [assignmentsData, membersData, piecesData, statsData] = await Promise.all([
        getContentAssignments(),
        getTeamMembers(),
        getAvailableContentPieces(),
        getAssignmentStats(),
      ]);

      setAssignments(assignmentsData);
      setTeamMembers(membersData);
      setContentPieces(piecesData);
      setStats(statsData);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredAssignments = useMemo(() => {
    return assignments.filter((assignment) => {
      const matchesRole = filterRole === 'all' || assignment.role === filterRole;
      const matchesStatus = filterStatus === 'all' || assignment.status === filterStatus;
      const matchesSearch =
        searchTerm === '' ||
        assignment.contentPiece.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        assignment.instructions.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesRole && matchesStatus && matchesSearch;
    });
  }, [assignments, filterRole, filterStatus, searchTerm]);

  const handleCreateAssignment = async () => {
    if (!formData.contentPieceId || !formData.assignedToId || !formData.instructions) {
      alert('Por favor, completa todos los campos requeridos');
      return;
    }

    try {
      await createContentAssignment(formData as CreateContentAssignmentRequest);
      await loadData();
      setIsCreateModalOpen(false);
      setFormData({
        contentPieceId: '',
        assignedToId: '',
        role: 'video-editor',
        priority: 'medium',
        dueDate: '',
        instructions: '',
        requirements: [],
        deliverables: [
          {
            type: 'video',
            description: '',
            format: '',
            specifications: [],
          },
        ],
        context: {},
      });
    } catch (error) {
      console.error('Error creating assignment:', error);
      alert('Error al crear la asignación. Intenta nuevamente.');
    }
  };

  const getRoleIcon = (role: ContentTeamRole) => {
    switch (role) {
      case 'video-editor':
        return <Film className="w-4 h-4" />;
      case 'designer':
        return <ImageIcon className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  if (externalLoading) {
    return (
      <Card className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-1/3 bg-slate-200 rounded" />
          <div className="h-24 bg-slate-100 rounded-2xl" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-0 shadow-sm border border-slate-100">
      <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-indigo-500" />
            Asignación de Contenido a Equipo
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Asigna piezas de contenido a editores de video y diseñadores para que sepan qué y cómo producir
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Nueva Asignación
        </Button>
      </div>

      <div className="p-6 space-y-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="p-4 bg-yellow-50 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 font-medium">Pendientes</p>
                <p className="text-2xl font-bold text-yellow-900">{stats.pendingAssignments}</p>
              </div>
              <Clock className="w-8 h-8 text-yellow-600" />
            </div>
          </Card>
          <Card className="p-4 bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">En Progreso</p>
                <p className="text-2xl font-bold text-blue-900">{stats.inProgressAssignments}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-blue-600" />
            </div>
          </Card>
          <Card className="p-4 bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Completadas</p>
                <p className="text-2xl font-bold text-green-900">{stats.completedAssignments}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
          </Card>
          <Card className="p-4 bg-slate-50 border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-700 font-medium">Total</p>
                <p className="text-2xl font-bold text-slate-900">{stats.totalAssignments}</p>
              </div>
              <FileText className="w-8 h-8 text-slate-600" />
            </div>
          </Card>
        </div>

        {/* Filtros */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex-1 min-w-[200px]">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Buscar asignaciones..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select
            value={filterRole}
            onChange={(e) => setFilterRole(e.target.value as ContentTeamRole | 'all')}
            className="min-w-[150px]"
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
            onChange={(e) => setFilterStatus(e.target.value as ContentAssignmentStatus | 'all')}
            className="min-w-[150px]"
          >
            <option value="all">Todos los estados</option>
            {Object.entries(statusLabel).map(([value, label]) => (
              <option key={value} value={value}>
                {label}
              </option>
            ))}
          </Select>
        </div>

        {/* Lista de asignaciones */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : filteredAssignments.length === 0 ? (
          <Card className="p-12 text-center">
            <Users className="w-12 h-12 text-slate-300 mx-auto mb-4" />
            <p className="text-slate-500">No hay asignaciones disponibles</p>
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreateModalOpen(true)}
              className="mt-4"
            >
              Crear primera asignación
            </Button>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredAssignments.map((assignment) => (
              <Card key={assignment.id} className="p-4 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getRoleIcon(assignment.role)}
                      <h3 className="font-semibold text-slate-900">{assignment.contentPiece.title}</h3>
                      <Badge variant={statusColor[assignment.status]} size="sm">
                        {statusLabel[assignment.status]}
                      </Badge>
                      <Badge variant={priorityColor[assignment.priority]} size="sm">
                        {priorityLabel[assignment.priority]}
                      </Badge>
                    </div>
                    <p className="text-sm text-slate-600 mb-2">{assignment.contentPiece.description}</p>
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <UserPlus className="w-3 h-3" />
                        {assignment.assignedTo.name}
                      </span>
                      {assignment.dueDate && (
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {new Date(assignment.dueDate).toLocaleDateString()}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700 mt-2 bg-slate-50 p-2 rounded">
                      <strong>Instrucciones:</strong> {assignment.instructions}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Modal de creación */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Nueva Asignación de Contenido"
        size="lg"
        footer={
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setIsCreateModalOpen(false)}>
              Cancelar
            </Button>
            <Button variant="primary" onClick={handleCreateAssignment}>
              <Send className="w-4 h-4 mr-2" />
              Crear Asignación
            </Button>
          </div>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Pieza de Contenido *
            </label>
            <Select
              value={formData.contentPieceId}
              onChange={(e) => setFormData({ ...formData, contentPieceId: e.target.value })}
            >
              <option value="">Selecciona una pieza de contenido</option>
              {contentPieces.map((piece) => (
                <option key={piece.id} value={piece.id}>
                  {piece.title} ({piece.type})
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Rol *
            </label>
            <Select
              value={formData.role}
              onChange={(e) => {
                const role = e.target.value as ContentTeamRole;
                setFormData({ ...formData, role });
              }}
            >
              {Object.entries(roleLabel).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Asignar a *
            </label>
            <Select
              value={formData.assignedToId}
              onChange={(e) => setFormData({ ...formData, assignedToId: e.target.value })}
            >
              <option value="">Selecciona un miembro del equipo</option>
              {teamMembers
                .filter((member) => member.role === formData.role)
                .map((member) => (
                  <option key={member.id} value={member.id}>
                    {member.name} ({member.roleLabel})
                  </option>
                ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Prioridad *
            </label>
            <Select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value as ContentAssignmentPriority })
              }
            >
              {Object.entries(priorityLabel).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </Select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Fecha límite
            </label>
            <Input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Instrucciones * (Qué y cómo producir)
            </label>
            <Textarea
              value={formData.instructions}
              onChange={(e) => setFormData({ ...formData, instructions: e.target.value })}
              rows={4}
              placeholder="Describe qué se debe producir y cómo hacerlo..."
            />
          </div>
        </div>
      </Modal>
    </Card>
  );
}

