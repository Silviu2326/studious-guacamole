import React, { useState, useEffect } from 'react';
import { Share2, Users, Mail, CheckCircle2, Eye, Send, X, User, Search } from 'lucide-react';
import { Badge, Button, Card } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { WeeklyAIStrategy, TeamMember, WeeklySummaryShare, TeamMemberRole } from '../types';

interface ShareWeeklySummaryProps {
  strategy: WeeklyAIStrategy | null;
  className?: string;
  onShare?: (recipients: TeamMember[], message?: string) => Promise<void>;
  onLoadTeamMembers?: () => Promise<TeamMember[]>;
}

const roleLabel: Record<TeamMemberRole, string> = {
  community_manager: 'Community Manager',
  nutricionista: 'Nutricionista',
  entrenador: 'Entrenador',
  otro: 'Otro',
};

const roleIcon: Record<TeamMemberRole, React.ReactNode> = {
  community_manager: <Users className="w-4 h-4" />,
  nutricionista: <User className="w-4 h-4" />,
  entrenador: <User className="w-4 h-4" />,
  otro: <User className="w-4 h-4" />,
};

export const ShareWeeklySummary: React.FC<ShareWeeklySummaryProps> = ({
  strategy,
  className = '',
  onShare,
  onLoadTeamMembers,
}) => {
  const [showShareModal, setShowShareModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [message, setMessage] = useState('');
  const [sharing, setSharing] = useState(false);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [shareHistory, setShareHistory] = useState<WeeklySummaryShare[]>([]);

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
      await onShare(recipients, message || undefined);
      
      // Create share record
      const newShare: WeeklySummaryShare = {
        id: `share_${Date.now()}`,
        strategyId: strategy?.id || '',
        sharedBy: 'current_user', // This should come from auth context
        sharedByName: 'Tú',
        sharedAt: new Date().toISOString(),
        recipients,
        message: message || undefined,
        status: 'sent',
        viewedBy: [],
        acknowledgedBy: [],
      };
      
      setShareHistory([newShare, ...shareHistory]);
      setShowShareModal(false);
      setSelectedMembers([]);
      setMessage('');
    } catch (error) {
      console.error('Error compartiendo resumen:', error);
      alert('Error al compartir el resumen');
    } finally {
      setSharing(false);
    }
  };

  if (!strategy) {
    return null;
  }

  const selectedRecipients = teamMembers.filter((m) => selectedMembers.includes(m.id));

  return (
    <>
      <Card className={`p-6 ${className}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-200 dark:from-indigo-900/40 dark:to-purple-900/30 rounded-xl">
              <Share2 className="w-5 h-5 text-indigo-600 dark:text-indigo-300" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100">
                Compartir con el equipo
              </h3>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Alinea acciones compartiendo el resumen semanal con tu equipo (community manager, nutricionista)
              </p>
            </div>
          </div>
          <Button
            variant="primary"
            size="sm"
            onClick={() => setShowShareModal(true)}
            className="inline-flex items-center gap-2"
          >
            <Share2 className="w-4 h-4" />
            Compartir
          </Button>
        </div>

        {shareHistory.length > 0 && (
          <div className="mt-4 space-y-2">
            {shareHistory.slice(0, 3).map((share) => (
              <div
                key={share.id}
                className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400" />
                    <span className="text-sm font-medium text-gray-900 dark:text-slate-100">
                      Compartido {new Date(share.sharedAt).toLocaleDateString('es-ES', {
                        day: 'numeric',
                        month: 'short',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>
                  <Badge variant="success" size="sm">
                    {share.recipients.length} destinatario{share.recipients.length !== 1 ? 's' : ''}
                  </Badge>
                </div>
                <div className="flex flex-wrap gap-2">
                  {share.recipients.map((recipient) => (
                    <Badge key={recipient.id} variant="secondary" size="sm" className="flex items-center gap-1">
                      {roleIcon[recipient.role]}
                      {recipient.name}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Share Modal */}
      {showShareModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
                  Compartir Resumen Semanal
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowShareModal(false)}
                  className="p-1"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
              <p className="text-sm text-gray-600 dark:text-slate-400">
                Selecciona los miembros del equipo con los que quieres compartir este resumen semanal
              </p>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Buscar por nombre, email o rol..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Selected Recipients */}
              {selectedRecipients.length > 0 && (
                <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-200 dark:border-indigo-800">
                  <p className="text-xs font-medium text-indigo-900 dark:text-indigo-300 mb-2">
                    Seleccionados ({selectedRecipients.length}):
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedRecipients.map((member) => (
                      <Badge
                        key={member.id}
                        variant="primary"
                        className="flex items-center gap-1"
                      >
                        {roleIcon[member.role]}
                        {member.name}
                        <button
                          onClick={() => handleToggleMember(member.id)}
                          className="ml-1 hover:opacity-70"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Team Members List */}
              <div className="space-y-2">
                {loadingMembers ? (
                  <div className="space-y-2">
                    {Array.from({ length: 3 }).map((_, i) => (
                      <div key={i} className={`${ds.shimmer} h-16 rounded-lg`} />
                    ))}
                  </div>
                ) : filteredMembers.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Users className="w-12 h-12 mx-auto mb-2 opacity-50" />
                    <p>No se encontraron miembros del equipo</p>
                  </div>
                ) : (
                  filteredMembers.map((member) => {
                    const isSelected = selectedMembers.includes(member.id);
                    return (
                      <div
                        key={member.id}
                        onClick={() => handleToggleMember(member.id)}
                        className={`p-4 rounded-lg border cursor-pointer transition-all ${
                          isSelected
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 dark:border-indigo-500'
                            : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 bg-white dark:bg-gray-800/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                            isSelected
                              ? 'border-indigo-500 bg-indigo-500'
                              : 'border-gray-300 dark:border-gray-600'
                          }`}>
                            {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="text-sm font-semibold text-gray-900 dark:text-slate-100">
                                {member.name}
                              </h4>
                              <Badge variant="secondary" size="sm" className="flex items-center gap-1">
                                {roleIcon[member.role]}
                                {roleLabel[member.role]}
                              </Badge>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-slate-400">{member.email}</p>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-slate-300 mb-2">
                  Mensaje personalizado (opcional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Añade un mensaje para tu equipo..."
                  rows={3}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
                />
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 dark:border-gray-700 flex items-center justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setShowShareModal(false)}
                disabled={sharing}
              >
                Cancelar
              </Button>
              <Button
                variant="primary"
                onClick={handleShare}
                disabled={sharing || selectedMembers.length === 0}
                className="inline-flex items-center gap-2"
              >
                {sharing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Compartiendo...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Compartir con {selectedMembers.length} miembro{selectedMembers.length !== 1 ? 's' : ''}
                  </>
                )}
              </Button>
            </div>
          </Card>
        </div>
      )}
    </>
  );
};

