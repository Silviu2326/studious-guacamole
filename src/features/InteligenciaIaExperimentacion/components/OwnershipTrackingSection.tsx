import React, { useState, useEffect } from 'react';
import { Card, Badge, Button, Modal, Input, Textarea, Select } from '../../../components/componentsreutilizables';
import { OwnershipAssignment, OwnershipStatus, TeamMember } from '../types';
import { getOwnershipAssignmentsService, assignOwnerService, updateOwnershipProgressService, getTeamMembersService } from '../services/intelligenceService';
import { useAuth } from '../../../context/AuthContext';
import {
  User,
  CheckCircle2,
  Clock,
  AlertCircle,
  X,
  Plus,
  Loader2,
  TrendingUp,
  FileText,
  BookOpen,
  Calendar,
  MessageSquare,
} from 'lucide-react';

interface OwnershipTrackingSectionProps {
  trainerId?: string;
  itemId?: string;
  itemType?: 'insight' | 'playbook';
}

export const OwnershipTrackingSection: React.FC<OwnershipTrackingSectionProps> = ({
  trainerId,
  itemId,
  itemType,
}) => {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState<OwnershipAssignment[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [summary, setSummary] = useState({
    assigned: 0,
    in_progress: 0,
    completed: 0,
    blocked: 0,
    overdue: 0,
  });
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<OwnershipAssignment | null>(null);
  const [isProgressModalOpen, setIsProgressModalOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [assignFormData, setAssignFormData] = useState({
    ownerId: '',
    dueDate: '',
    priority: 'medium' as 'high' | 'medium' | 'low',
    notes: '',
  });
  const [progressFormData, setProgressFormData] = useState({
    progress: 0,
    status: 'assigned' as OwnershipStatus,
    message: '',
  });

  useEffect(() => {
    loadAssignments();
    loadTeamMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trainerId, itemId, itemType]);

  const loadAssignments = async () => {
    setIsLoading(true);
    try {
      const response = await getOwnershipAssignmentsService({
        trainerId: trainerId || user?.id,
        itemId,
        itemType,
      });
      if (response.success) {
        setAssignments(response.assignments);
        setSummary(response.summary);
      }
    } catch (error) {
      console.error('Error cargando asignaciones', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadTeamMembers = async () => {
    try {
      const members = await getTeamMembersService();
      setTeamMembers(members);
    } catch (error) {
      console.error('Error cargando miembros del equipo', error);
    }
  };

  const handleAssignOwner = async () => {
    if (!itemId || !itemType || !assignFormData.ownerId) return;

    try {
      const response = await assignOwnerService({
        itemId,
        itemType,
        ownerId: assignFormData.ownerId,
        dueDate: assignFormData.dueDate || undefined,
        priority: assignFormData.priority,
        notes: assignFormData.notes || undefined,
      });
      if (response.success) {
        setIsAssignModalOpen(false);
        setAssignFormData({ ownerId: '', dueDate: '', priority: 'medium', notes: '' });
        loadAssignments();
      }
    } catch (error) {
      console.error('Error asignando dueño', error);
    }
  };

  const handleUpdateProgress = async () => {
    if (!selectedAssignment) return;

    try {
      const response = await updateOwnershipProgressService({
        assignmentId: selectedAssignment.id,
        progress: progressFormData.progress,
        status: progressFormData.status,
        update: progressFormData.message ? {
          message: progressFormData.message,
          progress: progressFormData.progress,
          status: progressFormData.status,
        } : undefined,
      });
      if (response.success) {
        setIsProgressModalOpen(false);
        setSelectedAssignment(null);
        setProgressFormData({ progress: 0, status: 'assigned', message: '' });
        loadAssignments();
      }
    } catch (error) {
      console.error('Error actualizando progreso', error);
    }
  };

  const openProgressModal = (assignment: OwnershipAssignment) => {
    setSelectedAssignment(assignment);
    setProgressFormData({
      progress: assignment.progress,
      status: assignment.status,
      message: '',
    });
    setIsProgressModalOpen(true);
  };

  const getStatusBadgeVariant = (status: OwnershipStatus) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'blue';
      case 'blocked':
        return 'red';
      case 'cancelled':
        return 'secondary';
      default:
        return 'yellow';
    }
  };

  const getStatusIcon = (status: OwnershipStatus) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 size={16} className="text-green-600" />;
      case 'in_progress':
        return <Clock size={16} className="text-blue-600" />;
      case 'blocked':
        return <AlertCircle size={16} className="text-red-600" />;
      case 'cancelled':
        return <X size={16} className="text-slate-400" />;
      default:
        return <Clock size={16} className="text-yellow-600" />;
    }
  };

  const getPriorityBadgeVariant = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return 'red';
      case 'medium':
        return 'yellow';
      default:
        return 'blue';
    }
  };

  const isOverdue = (assignment: OwnershipAssignment) => {
    if (!assignment.dueDate) return false;
    return new Date(assignment.dueDate) < new Date() && assignment.status !== 'completed';
  };

  if (isLoading) {
    return (
      <Card className="p-8 bg-white shadow-sm border border-slate-200/70">
        <div className="flex items-center justify-center gap-3 text-slate-500">
          <Loader2 className="animate-spin" size={20} />
          <span>Cargando asignaciones...</span>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">Seguimiento de Ownership</h2>
          <p className="text-sm text-slate-600 mt-1">
            Asigna dueños a insights y playbooks y sigue su progreso
          </p>
        </div>
        {itemId && itemType && (
          <Button
            onClick={() => setIsAssignModalOpen(true)}
            leftIcon={<Plus size={16} />}
          >
            Asignar dueño
          </Button>
        )}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card className="p-4 bg-white shadow-sm border border-slate-200/70">
          <div className="flex items-center gap-2 mb-2">
            <User size={16} className="text-slate-600" />
            <span className="text-sm text-slate-600">Asignados</span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{summary.assigned}</p>
        </Card>
        <Card className="p-4 bg-white shadow-sm border border-slate-200/70">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-blue-600" />
            <span className="text-sm text-slate-600">En progreso</span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{summary.in_progress}</p>
        </Card>
        <Card className="p-4 bg-white shadow-sm border border-slate-200/70">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle2 size={16} className="text-green-600" />
            <span className="text-sm text-slate-600">Completados</span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{summary.completed}</p>
        </Card>
        <Card className="p-4 bg-white shadow-sm border border-slate-200/70">
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle size={16} className="text-red-600" />
            <span className="text-sm text-slate-600">Bloqueados</span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{summary.blocked}</p>
        </Card>
        <Card className="p-4 bg-white shadow-sm border border-slate-200/70">
          <div className="flex items-center gap-2 mb-2">
            <Calendar size={16} className="text-yellow-600" />
            <span className="text-sm text-slate-600">Vencidos</span>
          </div>
          <p className="text-2xl font-semibold text-slate-900">{summary.overdue}</p>
        </Card>
      </div>

      {/* Assignments List */}
      <div className="space-y-4">
        {assignments.length === 0 ? (
          <Card className="p-8 bg-white shadow-sm border border-slate-200/70">
            <div className="text-center space-y-4">
              <div className="p-4 rounded-full bg-slate-100 text-slate-600 inline-flex">
                <User size={24} />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  No hay asignaciones
                </h3>
                <p className="text-sm text-slate-600 mb-4">
                  Asigna dueños a insights o playbooks para comenzar a seguir su progreso.
                </p>
                {itemId && itemType && (
                  <Button
                    onClick={() => setIsAssignModalOpen(true)}
                    leftIcon={<Plus size={16} />}
                  >
                    Asignar dueño
                  </Button>
                )}
              </div>
            </div>
          </Card>
        ) : (
          assignments.map((assignment) => (
            <Card key={assignment.id} className="p-6 bg-white shadow-sm border border-slate-200/70">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {assignment.itemType === 'insight' ? (
                      <FileText size={18} className="text-indigo-600" />
                    ) : (
                      <BookOpen size={18} className="text-emerald-600" />
                    )}
                    <h3 className="text-lg font-semibold text-slate-900">{assignment.itemName}</h3>
                    <Badge variant="secondary" size="sm">
                      {assignment.itemType === 'insight' ? 'Insight' : 'Playbook'}
                    </Badge>
                    {isOverdue(assignment) && (
                      <Badge variant="red" size="sm">
                        Vencido
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-4 text-sm text-slate-600 mb-3">
                    <div className="flex items-center gap-1">
                      <User size={14} />
                      <span>{assignment.ownerName}</span>
                    </div>
                    {assignment.dueDate && (
                      <div className="flex items-center gap-1">
                        <Calendar size={14} />
                        <span>{new Date(assignment.dueDate).toLocaleDateString('es-ES')}</span>
                      </div>
                    )}
                    <Badge variant={getPriorityBadgeVariant(assignment.priority)} size="sm">
                      {assignment.priority === 'high' ? 'Alta' : assignment.priority === 'medium' ? 'Media' : 'Baja'}
                    </Badge>
                  </div>
                  {assignment.notes && (
                    <p className="text-sm text-slate-600 mb-3">{assignment.notes}</p>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    {getStatusIcon(assignment.status)}
                    <Badge variant={getStatusBadgeVariant(assignment.status)} size="sm">
                      {assignment.status === 'assigned' ? 'Asignado' :
                       assignment.status === 'in_progress' ? 'En progreso' :
                       assignment.status === 'completed' ? 'Completado' :
                       assignment.status === 'blocked' ? 'Bloqueado' : 'Cancelado'}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-600">Progreso</span>
                      <span className="text-sm font-semibold text-slate-900">{assignment.progress}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${assignment.progress}%` }} />
                    </div>
                  </div>
                </div>
              </div>
              {assignment.milestones && assignment.milestones.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-2">Hitos:</p>
                  <div className="space-y-2">
                    {assignment.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center justify-between text-sm">
                        <span className="text-slate-600">{milestone.title}</span>
                        <Badge variant={milestone.status === 'completed' ? 'success' : milestone.status === 'in_progress' ? 'blue' : 'secondary'} size="sm">
                          {milestone.status === 'completed' ? 'Completado' :
                           milestone.status === 'in_progress' ? 'En progreso' : 'Pendiente'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {assignment.blockers && assignment.blockers.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-2">Bloqueadores:</p>
                  <div className="space-y-2">
                    {assignment.blockers.filter((b) => !b.resolved).map((blocker) => (
                      <div key={blocker.id} className="flex items-start gap-2 text-sm">
                        <AlertCircle size={16} className="text-red-600 mt-0.5" />
                        <span className="text-slate-600">{blocker.description}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {assignment.updates && assignment.updates.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <p className="text-sm font-medium text-slate-700 mb-2">Actualizaciones:</p>
                  <div className="space-y-2">
                    {assignment.updates.slice(-3).map((update) => (
                      <div key={update.id} className="flex items-start gap-2 text-sm">
                        <MessageSquare size={16} className="text-slate-400 mt-0.5" />
                        <div className="flex-1">
                          <p className="text-slate-600">{update.message}</p>
                          <p className="text-xs text-slate-400 mt-1">
                            {update.updatedByName} - {new Date(update.updatedAt).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              <div className="mt-4 flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => openProgressModal(assignment)}
                >
                  Actualizar progreso
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Assign Owner Modal */}
      <Modal
        isOpen={isAssignModalOpen}
        onClose={() => setIsAssignModalOpen(false)}
        title="Asignar dueño"
        size="md"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Dueño *
            </label>
            <Select
              value={assignFormData.ownerId}
              onChange={(e) => setAssignFormData({ ...assignFormData, ownerId: e.target.value })}
            >
              <option value="">Seleccionar dueño</option>
              {teamMembers.map((member) => (
                <option key={member.id} value={member.id}>
                  {member.name} ({member.role})
                </option>
              ))}
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Fecha de vencimiento
            </label>
            <Input
              type="date"
              value={assignFormData.dueDate}
              onChange={(e) => setAssignFormData({ ...assignFormData, dueDate: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Prioridad
            </label>
            <Select
              value={assignFormData.priority}
              onChange={(e) => setAssignFormData({ ...assignFormData, priority: e.target.value as 'high' | 'medium' | 'low' })}
            >
              <option value="low">Baja</option>
              <option value="medium">Media</option>
              <option value="high">Alta</option>
            </Select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Notas
            </label>
            <Textarea
              value={assignFormData.notes}
              onChange={(e) => setAssignFormData({ ...assignFormData, notes: e.target.value })}
              rows={3}
              placeholder="Notas adicionales sobre la asignación..."
            />
          </div>
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
            <Button
              variant="ghost"
              onClick={() => setIsAssignModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              onClick={handleAssignOwner}
              disabled={!assignFormData.ownerId}
            >
              Asignar
            </Button>
          </div>
        </div>
      </Modal>

      {/* Update Progress Modal */}
      <Modal
        isOpen={isProgressModalOpen}
        onClose={() => setIsProgressModalOpen(false)}
        title="Actualizar progreso"
        size="md"
      >
        {selectedAssignment && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Progreso (%)
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                value={progressFormData.progress}
                onChange={(e) => setProgressFormData({ ...progressFormData, progress: parseInt(e.target.value) || 0 })}
              />
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden mt-2">
                <div className="h-full bg-indigo-600 rounded-full transition-all" style={{ width: `${progressFormData.progress}%` }} />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Estado
              </label>
              <Select
                value={progressFormData.status}
                onChange={(e) => setProgressFormData({ ...progressFormData, status: e.target.value as OwnershipStatus })}
              >
                <option value="assigned">Asignado</option>
                <option value="in_progress">En progreso</option>
                <option value="completed">Completado</option>
                <option value="blocked">Bloqueado</option>
                <option value="cancelled">Cancelado</option>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Mensaje (opcional)
              </label>
              <Textarea
                value={progressFormData.message}
                onChange={(e) => setProgressFormData({ ...progressFormData, message: e.target.value })}
                rows={3}
                placeholder="Actualización sobre el progreso..."
              />
            </div>
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-200">
              <Button
                variant="ghost"
                onClick={() => setIsProgressModalOpen(false)}
              >
                Cancelar
              </Button>
              <Button
                onClick={handleUpdateProgress}
              >
                Actualizar
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default OwnershipTrackingSection;

