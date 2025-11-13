import React, { useState, useEffect, useRef } from 'react';
import { ObjectiveKPIComment, Mention, PermissionEntity } from '../types';
import { Card, Button, Input, Badge } from '../../../components/componentsreutilizables';
import { MessageSquare, Send, User, AtSign, X, Reply, Trash2, Edit2 } from 'lucide-react';
import { getTeamMembers } from '../api/permissions';
import { getComments, addComment, updateComment, deleteComment } from '../api/comments';
// Helper function to format date distance
const formatDateDistance = (date: string): string => {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - targetDate.getTime()) / 1000);
  
  if (diffInSeconds < 60) return 'hace unos segundos';
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `hace ${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `hace ${hours} ${hours === 1 ? 'hora' : 'horas'}`;
  }
  if (diffInSeconds < 2592000) {
    const days = Math.floor(diffInSeconds / 86400);
    return `hace ${days} ${days === 1 ? 'día' : 'días'}`;
  }
  if (diffInSeconds < 31536000) {
    const months = Math.floor(diffInSeconds / 2592000);
    return `hace ${months} ${months === 1 ? 'mes' : 'meses'}`;
  }
  const years = Math.floor(diffInSeconds / 31536000);
  return `hace ${years} ${years === 1 ? 'año' : 'años'}`;
};

interface ObjectiveKPICommentsProps {
  objectiveId?: string;
  kpiId?: string;
  onCommentAdded?: () => void;
}

export const ObjectiveKPIComments: React.FC<ObjectiveKPICommentsProps> = ({
  objectiveId,
  kpiId,
  onCommentAdded,
}) => {
  const [comments, setComments] = useState<ObjectiveKPIComment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editingContent, setEditingContent] = useState('');
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');
  const [teamMembers, setTeamMembers] = useState<PermissionEntity[]>([]);
  const [showMentions, setShowMentions] = useState(false);
  const [mentionQuery, setMentionQuery] = useState('');
  const [mentionPosition, setMentionPosition] = useState(0);
  const [selectedMentions, setSelectedMentions] = useState<Mention[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadComments();
    loadTeamMembers();
  }, [objectiveId, kpiId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const data = await getComments(objectiveId, kpiId);
      setComments(data);
    } catch (error) {
      console.error('Error loading comments:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadTeamMembers = async () => {
    try {
      const members = await getTeamMembers();
      setTeamMembers(members);
    } catch (error) {
      console.error('Error loading team members:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    const cursorPosition = e.target.selectionStart;
    
    setNewComment(value);
    
    // Detectar @ para mostrar mención
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lastAtIndex = textBeforeCursor.lastIndexOf('@');
    
    if (lastAtIndex !== -1) {
      const textAfterAt = textBeforeCursor.substring(lastAtIndex + 1);
      // Si no hay espacio después del @, mostrar sugerencias
      if (!textAfterAt.includes(' ') && !textAfterAt.includes('\n')) {
        setMentionQuery(textAfterAt);
        setMentionPosition(lastAtIndex);
        setShowMentions(true);
        return;
      }
    }
    
    setShowMentions(false);
  };

  const handleMentionSelect = (member: PermissionEntity) => {
    const textBeforeMention = newComment.substring(0, mentionPosition);
    const textAfterMention = newComment.substring(mentionPosition + mentionQuery.length + 1);
    const mentionText = `@${member.name} `;
    
    const updatedComment = textBeforeMention + mentionText + textAfterMention;
    setNewComment(updatedComment);
    
    // Agregar mención a la lista
    const mention: Mention = {
      userId: member.id,
      userName: member.name,
      userEmail: member.email,
      position: mentionPosition,
      length: mentionText.length - 1, // Sin el espacio final
    };
    setSelectedMentions([...selectedMentions, mention]);
    
    setShowMentions(false);
    setMentionQuery('');
    
    // Restaurar foco en textarea
    setTimeout(() => {
      textareaRef.current?.focus();
      const newPosition = mentionPosition + mentionText.length;
      textareaRef.current?.setSelectionRange(newPosition, newPosition);
    }, 0);
  };

  const filteredMembers = teamMembers.filter((member) =>
    member.name.toLowerCase().includes(mentionQuery.toLowerCase()) ||
    member.email?.toLowerCase().includes(mentionQuery.toLowerCase())
  );

  const handleSubmit = async () => {
    if (!newComment.trim()) return;

    try {
      await addComment({
        objectiveId,
        kpiId,
        content: newComment,
        mentions: selectedMentions,
      });
      
      setNewComment('');
      setSelectedMentions([]);
      loadComments();
      onCommentAdded?.();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Error al agregar el comentario');
    }
  };

  const handleReply = async (parentCommentId: string) => {
    if (!replyContent.trim()) return;

    try {
      await addComment({
        objectiveId,
        kpiId,
        content: replyContent,
        parentCommentId,
      });
      
      setReplyContent('');
      setReplyingToId(null);
      loadComments();
      onCommentAdded?.();
    } catch (error) {
      console.error('Error adding reply:', error);
      alert('Error al agregar la respuesta');
    }
  };

  const handleEdit = async (commentId: string) => {
    if (!editingContent.trim()) return;

    try {
      await updateComment(commentId, editingContent);
      setEditingCommentId(null);
      setEditingContent('');
      loadComments();
      onCommentAdded?.();
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Error al actualizar el comentario');
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!window.confirm('¿Estás seguro de eliminar este comentario?')) return;

    try {
      await deleteComment(commentId);
      loadComments();
      onCommentAdded?.();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Error al eliminar el comentario');
    }
  };

  const renderMentions = (content: string, mentions?: Mention[]) => {
    if (!mentions || mentions.length === 0) {
      return <span>{content}</span>;
    }

    const parts: (string | JSX.Element)[] = [];
    let lastIndex = 0;

    // Ordenar menciones por posición
    const sortedMentions = [...mentions].sort((a, b) => a.position - b.position);

    sortedMentions.forEach((mention, index) => {
      // Agregar texto antes de la mención
      if (mention.position > lastIndex) {
        parts.push(content.substring(lastIndex, mention.position));
      }

      // Agregar mención
      parts.push(
        <span
          key={`mention-${index}`}
          className="inline-flex items-center gap-1 px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded font-medium"
        >
          <AtSign className="w-3 h-3" />
          {mention.userName}
        </span>
      );

      lastIndex = mention.position + mention.length;
    });

    // Agregar texto restante
    if (lastIndex < content.length) {
      parts.push(content.substring(lastIndex));
    }

    return <span>{parts}</span>;
  };

  const renderComment = (comment: ObjectiveKPIComment, isReply = false) => (
    <div key={comment.id} className={isReply ? 'ml-8 mt-3' : ''}>
      <Card className={`p-4 ${isReply ? 'bg-gray-50' : ''}`}>
        <div className="flex items-start gap-3">
          <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0">
            <User className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-sm text-gray-900">{comment.createdByName}</span>
              <span className="text-xs text-gray-500">
                {formatDateDistance(comment.createdAt)}
              </span>
            </div>
            {editingCommentId === comment.id ? (
              <div className="space-y-2">
                <textarea
                  value={editingContent}
                  onChange={(e) => setEditingContent(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                />
                <div className="flex gap-2">
                  <Button variant="primary" size="sm" onClick={() => handleEdit(comment.id)}>
                    Guardar
                  </Button>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditingContent('');
                    }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <div className="text-sm text-gray-700 mb-2">
                  {renderMentions(comment.content, comment.mentions)}
                </div>
                <div className="flex items-center gap-3">
                  {!isReply && (
                    <button
                      onClick={() => {
                        setReplyingToId(comment.id);
                        setReplyContent('');
                      }}
                      className="text-xs text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <Reply className="w-3 h-3" />
                      Responder
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setEditingCommentId(comment.id);
                      setEditingContent(comment.content);
                    }}
                    className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    Editar
                  </button>
                  <button
                    onClick={() => handleDelete(comment.id)}
                    className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Eliminar
                  </button>
                </div>
                {replyingToId === comment.id && (
                  <div className="mt-3 space-y-2">
                    <textarea
                      value={replyContent}
                      onChange={(e) => setReplyContent(e.target.value)}
                      placeholder="Escribe una respuesta..."
                      className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button variant="primary" size="sm" onClick={() => handleReply(comment.id)}>
                        Responder
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        onClick={() => {
                          setReplyingToId(null);
                          setReplyContent('');
                        }}
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </Card>
      {comment.replies && comment.replies.length > 0 && (
        <div className="mt-2">
          {comment.replies.map((reply) => renderComment(reply, true))}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <MessageSquare className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Comentarios</h3>
        {comments.length > 0 && (
          <Badge variant="blue">{comments.length}</Badge>
        )}
      </div>

      {/* Comentarios existentes */}
      {loading ? (
        <div className="text-center py-8 text-gray-500">Cargando comentarios...</div>
      ) : comments.length === 0 ? (
        <Card className="p-8 text-center">
          <MessageSquare className="w-12 h-12 mx-auto text-gray-400 mb-3" />
          <p className="text-gray-600">No hay comentarios aún. Sé el primero en comentar.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => renderComment(comment))}
        </div>
      )}

      {/* Formulario de nuevo comentario */}
      <Card className="p-4">
        <div className="space-y-3">
          <div className="relative">
            <textarea
              ref={textareaRef}
              value={newComment}
              onChange={handleInputChange}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                  handleSubmit();
                }
              }}
              placeholder="Escribe un comentario... Usa @ para mencionar miembros del equipo"
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              rows={3}
            />
            {showMentions && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-md shadow-lg max-h-48 overflow-y-auto">
                {filteredMembers.length === 0 ? (
                  <div className="p-3 text-sm text-gray-500 text-center">
                    No se encontraron miembros
                  </div>
                ) : (
                  filteredMembers.map((member) => (
                    <button
                      key={member.id}
                      onClick={() => handleMentionSelect(member)}
                      className="w-full px-3 py-2 text-left hover:bg-gray-50 flex items-center gap-2"
                    >
                      <User className="w-4 h-4 text-gray-400" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{member.name}</div>
                        {member.email && (
                          <div className="text-xs text-gray-500">{member.email}</div>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <p className="text-xs text-gray-500">
              Presiona Cmd/Ctrl + Enter para enviar
            </p>
            <Button variant="primary" onClick={handleSubmit} disabled={!newComment.trim()}>
              <Send className="w-4 h-4 mr-2" />
              Comentar
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

