import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Post, Comment } from '../api/community';
import { 
  Heart, 
  MessageCircle, 
  MoreVertical,
  Flag,
  Trash2,
  Pin
} from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface PostCardProps {
  post: Post;
  onReact?: (postId: string, reactionType: string) => void;
  onComment?: (postId: string) => void;
  onDelete?: (postId: string) => void;
}

export const PostCard: React.FC<PostCardProps> = ({ 
  post, 
  onReact, 
  onComment,
  onDelete 
}) => {
  const { user } = useAuth();
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return 'hace un momento';
    if (diffInSeconds < 3600) return `hace ${Math.floor(diffInSeconds / 60)} min`;
    if (diffInSeconds < 86400) return `hace ${Math.floor(diffInSeconds / 3600)} h`;
    if (diffInSeconds < 604800) return `hace ${Math.floor(diffInSeconds / 86400)} días`;
    
    return date.toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleShowComments = async () => {
    if (!showComments && comments.length === 0) {
      setLoadingComments(true);
      // TODO: Cargar comentarios desde API
      setLoadingComments(false);
    }
    setShowComments(!showComments);
  };

  const canDelete = user?.id === post.author.id || user?.role === 'trainer' || user?.role === 'admin';

  return (
    <Card className="p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-start gap-3">
          {/* Avatar */}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-semibold flex-shrink-0">
            {post.author.avatarUrl ? (
              <img 
                src={post.author.avatarUrl} 
                alt={post.author.name}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              post.author.name.charAt(0).toUpperCase()
            )}
          </div>
          
          {/* Información del autor */}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
              {post.author.role === 'trainer' && (
                <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded">
                  Entrenador
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
              <span>{formatDate(post.createdAt)}</span>
              {post.groupName && (
                <>
                  <span>•</span>
                  <span>{post.groupName}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Badges */}
        {post.author.badges && post.author.badges.length > 0 && (
          <div className="flex gap-1">
            {post.author.badges.slice(0, 2).map(badge => (
              <div
                key={badge.id}
                className="w-6 h-6 rounded-full bg-yellow-100 border-2 border-yellow-300"
                title={badge.name}
              />
            ))}
          </div>
        )}

        {/* Menu de acciones */}
        <div className="relative">
          <button className="p-1 hover:bg-gray-100 rounded-lg transition-colors">
            <MoreVertical className="w-4 h-4 text-gray-500" />
          </button>
        </div>
      </div>

      {/* Pinned indicator */}
      {post.isPinned && (
        <div className="flex items-center gap-1 text-blue-600 text-sm font-medium mb-2">
          <Pin className="w-3 h-3" />
          <span>Fijado</span>
        </div>
      )}

      {/* Tipo de publicación */}
      {post.type === 'question' && (
        <div className="mb-2">
          <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded">
            Pregunta
          </span>
        </div>
      )}

      {/* Contenido */}
      <p className="text-gray-900 mb-4 whitespace-pre-wrap">{post.content}</p>

      {/* Media */}
      {post.mediaUrl && (
        <div className="mb-4 rounded-lg overflow-hidden">
          {post.mediaType === 'image' ? (
            <img 
              src={post.mediaUrl} 
              alt="Contenido multimedia"
              className="w-full max-h-96 object-cover"
            />
          ) : (
            <video 
              src={post.mediaUrl}
              controls
              className="w-full max-h-96"
            />
          )}
        </div>
      )}

      {/* Acciones (Reacciones y Comentarios) */}
      <div className="flex items-center gap-6 pt-4 border-t border-gray-100">
        {/* Reacciones */}
        <button
          onClick={() => onReact?.(post.id, 'celebrate')}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <Heart className="w-5 h-5" />
          <span className="text-sm font-medium">
            {Object.values(post.reactions).reduce((sum, count) => sum + (count || 0), 0)}
          </span>
        </button>

        {/* Comentarios */}
        <button
          onClick={handleShowComments}
          className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
        >
          <MessageCircle className="w-5 h-5" />
          <span className="text-sm font-medium">{post.commentCount}</span>
        </button>

        {/* Reportar */}
        <button className="flex items-center gap-2 text-gray-400 hover:text-red-600 transition-colors">
          <Flag className="w-4 h-4" />
        </button>

        {/* Eliminar (solo autor o admin) */}
        {canDelete && onDelete && (
          <button
            onClick={() => onDelete(post.id)}
            className="flex items-center gap-2 text-gray-400 hover:text-red-600 transition-colors ml-auto"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Comentarios */}
      {showComments && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          {loadingComments ? (
            <div className="text-center text-gray-500 py-4">Cargando comentarios...</div>
          ) : comments.length === 0 ? (
            <div className="text-center text-gray-500 py-4">No hay comentarios aún</div>
          ) : (
            <div className="space-y-3">
              {comments.map(comment => (
                <div key={comment.id} className="flex gap-3">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-300 to-gray-400 flex items-center justify-center text-white text-xs font-semibold flex-shrink-0">
                    {comment.author.avatarUrl ? (
                      <img 
                        src={comment.author.avatarUrl} 
                        alt={comment.author.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      comment.author.name.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-sm text-gray-900">{comment.author.name}</span>
                      <span className="text-xs text-gray-500">{formatDate(comment.createdAt)}</span>
                    </div>
                    <p className="text-sm text-gray-700 mt-1">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          <button
            onClick={() => onComment?.(post.id)}
            className="mt-3 text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            Escribir un comentario...
          </button>
        </div>
      )}
    </Card>
  );
};


