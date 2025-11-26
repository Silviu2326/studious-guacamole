import React, { useState, useEffect } from 'react';
import {
  Collaborator,
  PostApproval,
  ApprovalWorkflow,
  getCollaborators,
  inviteCollaborator,
  updateCollaborator,
  deleteCollaborator,
  getPostApprovals,
  submitForApproval,
  approvePost,
  rejectPost,
  getApprovalWorkflow,
  CollaboratorRole,
  ApprovalStatus
} from '../api/collaborators';
import { SocialPost, getPlatformIcon } from '../api/social';
import { Card, Button, Modal, Select } from '../../../components/componentsreutilizables';
import {
  Users,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  XCircle,
  Clock,
  UserCheck,
  Mail,
  Shield,
  Eye,
  FileEdit
} from 'lucide-react';

interface CollaboratorManagerProps {
  posts: SocialPost[];
  onApprovalUpdate?: () => void;
}

export const CollaboratorManager: React.FC<CollaboratorManagerProps> = ({
  posts,
  onApprovalUpdate
}) => {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [approvals, setApprovals] = useState<PostApproval[]>([]);
  const [workflow, setWorkflow] = useState<ApprovalWorkflow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isApprovalModalOpen, setIsApprovalModalOpen] = useState(false);
  const [selectedCollaborator, setSelectedCollaborator] = useState<Collaborator | null>(null);
  const [selectedApproval, setSelectedApproval] = useState<PostApproval | null>(null);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<CollaboratorRole>('editor');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [collabsData, approvalsData, workflowData] = await Promise.all([
        getCollaborators(),
        getPostApprovals(),
        getApprovalWorkflow()
      ]);
      setCollaborators(collabsData);
      setApprovals(approvalsData);
      setWorkflow(workflowData);
    } catch (err) {
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInvite = async () => {
    if (!inviteEmail) return;
    
    try {
      const newCollaborator = await inviteCollaborator(inviteEmail, inviteRole);
      setCollaborators(prev => [...prev, newCollaborator]);
      setInviteEmail('');
      setIsModalOpen(false);
      alert('Invitación enviada exitosamente');
    } catch (err: any) {
      alert('Error al invitar: ' + err.message);
    }
  };

  const handleApprove = async (approvalId: string) => {
    try {
      const updated = await approvePost(approvalId, 'collab_001', 'Aprobado');
      setApprovals(prev => prev.map(a => a.id === approvalId ? updated : a));
      onApprovalUpdate?.();
      setIsApprovalModalOpen(false);
    } catch (err: any) {
      alert('Error al aprobar: ' + err.message);
    }
  };

  const handleReject = async (approvalId: string, comments: string) => {
    try {
      const updated = await rejectPost(approvalId, 'collab_001', comments);
      setApprovals(prev => prev.map(a => a.id === approvalId ? updated : a));
      onApprovalUpdate?.();
      setIsApprovalModalOpen(false);
    } catch (err: any) {
      alert('Error al rechazar: ' + err.message);
    }
  };

  const getRoleLabel = (role: CollaboratorRole): string => {
    switch (role) {
      case 'admin':
        return 'Administrador';
      case 'editor':
        return 'Editor';
      case 'approver':
        return 'Aprobador';
      case 'viewer':
        return 'Visualizador';
      default:
        return role;
    }
  };

  const getRoleColor = (role: CollaboratorRole): string => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-700';
      case 'editor':
        return 'bg-blue-100 text-blue-700';
      case 'approver':
        return 'bg-green-100 text-green-700';
      case 'viewer':
        return 'bg-gray-100 text-gray-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusColor = (status: ApprovalStatus): string => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'pending':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: ApprovalStatus): string => {
    switch (status) {
      case 'approved':
        return 'Aprobado';
      case 'rejected':
        return 'Rechazado';
      case 'pending':
        return 'Pendiente';
      default:
        return 'Borrador';
    }
  };

  if (isLoading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Users size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando colaboradores...</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users size={24} className="text-blue-600" />
          <div>
            <h3 className="text-xl font-bold text-gray-900">Gestión de Colaboradores</h3>
            <p className="text-sm text-gray-600">Invita colaboradores y gestiona aprobaciones de contenido</p>
          </div>
        </div>
        <Button
          onClick={() => {
            setSelectedCollaborator(null);
            setIsModalOpen(true);
          }}
          leftIcon={<Plus size={18} />}
        >
          Invitar Colaborador
        </Button>
      </div>

      {/* Collaborators List */}
      <div>
        <h4 className="text-lg font-semibold text-gray-900 mb-4">Colaboradores</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {collaborators.map((collab) => (
            <Card
              key={collab.id}
              className="p-5 bg-white shadow-sm ring-1 ring-gray-200 hover:ring-blue-400 transition-all"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3 flex-1">
                  {collab.avatarUrl ? (
                    <img
                      src={collab.avatarUrl}
                      alt={collab.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <Users size={24} className="text-blue-600" />
                    </div>
                  )}
                  <div className="flex-1">
                    <h5 className="font-semibold text-gray-900">{collab.name}</h5>
                    <p className="text-sm text-gray-600">{collab.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${getRoleColor(collab.role)}`}>
                        {getRoleLabel(collab.role)}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        collab.status === 'active' ? 'bg-green-100 text-green-700' :
                        collab.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {collab.status === 'active' ? 'Activo' :
                         collab.status === 'pending' ? 'Pendiente' : 'Inactivo'}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedCollaborator(collab);
                      setIsModalOpen(true);
                    }}
                  >
                    <Edit2 size={16} />
                  </Button>
                </div>
              </div>
              
              <div className="pt-3 border-t border-gray-200">
                <div className="grid grid-cols-2 gap-2 text-xs text-gray-600">
                  <div>
                    <span className="font-medium text-gray-700">Puede crear:</span>
                    <span className="ml-1">{collab.permissions.canCreate ? 'Sí' : 'No'}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Puede aprobar:</span>
                    <span className="ml-1">{collab.permissions.canApprove ? 'Sí' : 'No'}</span>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Approval Queue */}
      {workflow?.requireApproval && (
        <div>
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Cola de Aprobación</h4>
          <div className="space-y-4">
            {approvals.filter(a => a.status === 'pending').length > 0 ? (
              approvals.filter(a => a.status === 'pending').map((approval) => (
                <Card
                  key={approval.id}
                  className="p-5 bg-white shadow-sm ring-1 ring-gray-200 hover:ring-yellow-400 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-lg">{getPlatformIcon(approval.post.platform || 'instagram')}</span>
                        <h5 className="font-semibold text-gray-900">Post Pendiente de Aprobación</h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(approval.status)}`}>
                          {getStatusLabel(approval.status)}
                        </span>
                      </div>
                      <p className="text-sm text-gray-700 mb-2 line-clamp-2">{approval.post.content}</p>
                      <div className="flex items-center gap-4 text-xs text-gray-600">
                        <div className="flex items-center gap-1">
                          <UserCheck size={12} />
                          <span>Enviado por: {collaborators.find(c => c.id === approval.submittedBy)?.name || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock size={12} />
                          <span>{new Date(approval.submittedAt).toLocaleDateString('es-ES')}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button
                        onClick={() => {
                          setSelectedApproval(approval);
                          setIsApprovalModalOpen(true);
                        }}
                        variant="secondary"
                        size="sm"
                        leftIcon={<Eye size={16} />}
                      >
                        Revisar
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <Card className="p-8 text-center bg-white shadow-sm">
                <CheckCircle2 size={48} className="mx-auto text-green-400 mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay aprobaciones pendientes</h3>
                <p className="text-gray-600">Todos los posts han sido revisados</p>
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Invite Modal */}
      {isModalOpen && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedCollaborator(null);
            setInviteEmail('');
          }}
          title={selectedCollaborator ? 'Editar Colaborador' : 'Invitar Colaborador'}
          size="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                value={inviteEmail || selectedCollaborator?.email || ''}
                onChange={(e) => setInviteEmail(e.target.value)}
                placeholder="email@ejemplo.com"
                disabled={!!selectedCollaborator}
                className="w-full rounded-xl bg-white text-gray-900 placeholder-gray-400 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5 disabled:bg-gray-100"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Rol
              </label>
              <Select
                value={selectedCollaborator?.role || inviteRole}
                onChange={(e) => {
                  if (selectedCollaborator) {
                    updateCollaborator(selectedCollaborator.id, { role: e.target.value as CollaboratorRole });
                  } else {
                    setInviteRole(e.target.value as CollaboratorRole);
                  }
                }}
                options={[
                  { value: 'admin', label: 'Administrador' },
                  { value: 'editor', label: 'Editor' },
                  { value: 'approver', label: 'Aprobador' },
                  { value: 'viewer', label: 'Visualizador' }
                ]}
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedCollaborator(null);
                  setInviteEmail('');
                }}
              >
                Cancelar
              </Button>
              {selectedCollaborator ? (
                <Button onClick={() => setIsModalOpen(false)}>
                  Guardar Cambios
                </Button>
              ) : (
                <Button onClick={handleInvite} leftIcon={<Mail size={18} />}>
                  Enviar Invitación
                </Button>
              )}
            </div>
          </div>
        </Modal>
      )}

      {/* Approval Modal */}
      {isApprovalModalOpen && selectedApproval && (
        <Modal
          isOpen={isApprovalModalOpen}
          onClose={() => {
            setIsApprovalModalOpen(false);
            setSelectedApproval(null);
          }}
          title="Revisar Post para Aprobación"
          size="lg"
        >
          <div className="space-y-4">
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Contenido:</p>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-900 whitespace-pre-wrap">
                  {selectedApproval.post.content}
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <span className="text-lg">{getPlatformIcon(selectedApproval.post.platform || 'instagram')}</span>
              <span className="capitalize">{selectedApproval.post.platform}</span>
              {selectedApproval.post.scheduledAt && (
                <>
                  <span>•</span>
                  <span>{new Date(selectedApproval.post.scheduledAt).toLocaleString('es-ES')}</span>
                </>
              )}
            </div>
            
            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Comentarios (opcional):</p>
              <textarea
                id="approval-comments"
                placeholder="Añade comentarios sobre tu decisión..."
                rows={3}
                className="w-full rounded-xl bg-white text-gray-900 placeholder-gray-400 ring-1 ring-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 px-4 py-2.5"
              />
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <Button
                variant="secondary"
                onClick={() => {
                  setIsApprovalModalOpen(false);
                  setSelectedApproval(null);
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                onClick={() => {
                  const comments = (document.getElementById('approval-comments') as HTMLTextAreaElement)?.value || '';
                  handleReject(selectedApproval.id, comments);
                }}
                leftIcon={<XCircle size={18} />}
              >
                Rechazar
              </Button>
              <Button
                onClick={() => handleApprove(selectedApproval.id)}
                leftIcon={<CheckCircle2 size={18} />}
              >
                Aprobar
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

