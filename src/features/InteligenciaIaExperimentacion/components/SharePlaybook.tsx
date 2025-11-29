import React, { useState, useEffect } from 'react';
import { Share2, Users, User, X, Search, CheckCircle2, Eye } from 'lucide-react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import { PlaybookRecord, TeamMember, PlaybookShare, TeamMemberRole } from '../types';

interface SharePlaybookProps {
  playbook: PlaybookRecord;
  className?: string;
  onShare?: (playbookId: string, recipients: TeamMember[], message?: string, accessLevel?: 'view' | 'edit' | 'execute') => Promise<void>;
  onLoadTeamMembers?: () => Promise<TeamMember[]>;
  onClose?: () => void;
}

const roleLabel: Record<TeamMemberRole, string> = {
  community_manager: 'Community Manager',
  nutricionista: 'Nutricionista',
  entrenador: 'Entrenador',
  marketing_manager: 'Marketing Manager',
  otro: 'Otro',
};

const roleIcon: Record<TeamMemberRole, React.ReactNode> = {
  community_manager: <Users className="w-4 h-4" />,
  nutricionista: <User className="w-4 h-4" />,
  entrenador: <User className="w-4 h-4" />,
  marketing_manager: <User className="w-4 h-4" />,
  otro: <User className="w-4 h-4" />,
};

export const SharePlaybook: React.FC<SharePlaybookProps> = ({
  playbook,
  className = '',
  onShare,
  onLoadTeamMembers,
  onClose,
}) => {
  const [showShareModal, setShowShareModal] = useState(true);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [accessLevel, setAccessLevel] = useState<'view' | 'edit' | 'execute'>('view');
  const [sharing, setSharing] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [shareHistory, setShareHistory] = useState<PlaybookShare[]>([]);

  useEffect(() => {
    if (showShareModal && onLoadTeamMembers) {
      loadTeamMembers();
    }
  }, [showShareModal]);

  const loadTeamMembers = async () => {
    if (!onLoadTeamMembers) return;
    
    setLoadingMembers(true);
    try {
      const members = await onLoadTeamMembers();
      setTeamMembers(members);
    } catch (error) {
      console.error('Error cargando miembros del equipo:', error);
    } finally {
      setLoadingMembers(false);
    }
  };

  const filteredMembers = teamMembers.filter((member) => {
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      roleLabel[member.role].toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  const handleToggleMember = (memberId: string) => {
    setSelectedMembers((prev) =>
      prev.includes(memberId)
        ? prev.filter((id) => id !== memberId)
        : [...prev, memberId]
    );
  };

  const handleShare = async () => {
    if (selectedMembers.length === 0) {
      alert('Por favor selecciona al menos un miembro del equipo');
      return;
    }

    if (!onShare) {
      alert('Función de compartir no disponible');
      return;
    }

    setSharing(true);
    try {
      const recipients = teamMembers.filter((m) => selectedMembers.includes(m.id));
      await onShare(playbook.id, recipients, message || undefined, accessLevel);
      
      // Create share record
      const newShare: PlaybookShare = {
        id: `share_${Date.now()}`,
        playbookId: playbook.id,
        sharedBy: 'current_user', // This should come from auth context
        sharedByName: 'Tú',
        sharedAt: new Date().toISOString(),
        recipients,
        message: message || undefined,
        status: 'sent',
        viewedBy: [],
        acknowledgedBy: [],
        accessLevel,
      };
      
      setShareHistory([newShare, ...shareHistory]);
      setShowShareModal(false);
      setSelectedMembers([]);
      setMessage('');
      // Close modal and notify parent
      if (onClose) {
        onClose();
      }
    } catch (error) {
      console.error('Error compartiendo playbook:', error);
      alert('Error al compartir el playbook');
    } finally {
      setSharing(false);
    }
  };

  const handleClose = () => {
    setShowShareModal(false);
    setSelectedMembers([]);
    setMessage('');
    if (onClose) {
      onClose();
    }
  };

  const selectedRecipients = teamMembers.filter((m) => selectedMembers.includes(m.id));

  if (!showShareModal) {
    return null;
  }

  return (
    <>
      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-slate-200 dark:border-slate-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100">
                  Compartir Playbook: {playbook.name}
                </h3>
                <button
                  onClick={handleClose}
                  className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 dark:text-slate-400"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Comparte este playbook con tu equipo para que entiendan el contexto y los pasos a seguir.
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Playbook Info */}
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 mb-1">
                  {playbook.name}
                </h4>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
                  {playbook.objective}
                </p>
                {playbook.strategy && (
                  <p className="text-sm text-slate-500 dark:text-slate-500 line-clamp-2">
                    {playbook.strategy.overview}
                  </p>
                )}
              </div>

              {/* Access Level */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Nivel de acceso
                </label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAccessLevel('view')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      accessLevel === 'view'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Ver
                  </button>
                  <button
                    onClick={() => setAccessLevel('edit')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      accessLevel === 'edit'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => setAccessLevel('execute')}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      accessLevel === 'execute'
                        ? 'bg-indigo-600 text-white'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    Ejecutar
                  </button>
                </div>
              </div>

              {/* Team Members Search */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Selecciona miembros del equipo
                </label>
                <div className="relative mb-3">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Buscar por nombre, email o rol..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="max-h-48 overflow-y-auto border border-slate-200 dark:border-slate-700 rounded-lg">
                  {loadingMembers ? (
                    <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                      Cargando miembros del equipo...
                    </div>
                  ) : filteredMembers.length === 0 ? (
                    <div className="p-4 text-center text-slate-500 dark:text-slate-400">
                      No se encontraron miembros del equipo
                    </div>
                  ) : (
                    filteredMembers.map((member) => (
                      <div
                        key={member.id}
                        onClick={() => handleToggleMember(member.id)}
                        className={`p-3 flex items-center gap-3 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700 last:border-b-0 ${
                          selectedMembers.includes(member.id)
                            ? 'bg-indigo-50 dark:bg-indigo-900/20'
                            : ''
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={selectedMembers.includes(member.id)}
                          onChange={() => handleToggleMember(member.id)}
                          className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-slate-900 dark:text-slate-100">
                              {member.name}
                            </p>
                            <Badge variant="secondary" size="sm" className="flex items-center gap-1">
                              {roleIcon[member.role]}
                              {roleLabel[member.role]}
                            </Badge>
                          </div>
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            {member.email}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Selected Recipients */}
              {selectedRecipients.length > 0 && (
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                    Destinatarios seleccionados ({selectedRecipients.length})
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipients.map((recipient) => (
                      <Badge
                        key={recipient.id}
                        variant="success"
                        size="sm"
                        className="flex items-center gap-1"
                      >
                        {roleIcon[recipient.role]}
                        {recipient.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-slate-100 mb-2">
                  Mensaje personalizado (opcional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Agrega un mensaje para que tu equipo entienda el contexto y los pasos a seguir..."
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex items-center justify-end gap-3">
              <Button
                variant="ghost"
                onClick={handleClose}
                disabled={sharing}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleShare}
                disabled={sharing || selectedMembers.length === 0}
                leftIcon={<Share2 size={16} />}
              >
                {sharing ? 'Compartiendo...' : 'Compartir playbook'}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

export default SharePlaybook;

