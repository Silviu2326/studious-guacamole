import React, { useState, useEffect } from 'react';
import { PostCard } from './PostCard';
import { NewPostForm } from './NewPostForm';
import { Post } from '../api/community';
import { 
  getPosts, 
  getGroups,
  deletePost,
  reactToPost,
  addComment,
  CommunityFilters,
  Group
} from '../api/community';
import { Filter, RefreshCw } from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';

interface CommunityFeedProps {
  groupId?: string | null;
  filterBy?: 'latest' | 'trending' | 'questions';
}

export const CommunityFeed: React.FC<CommunityFeedProps> = ({ 
  groupId = null,
  filterBy = 'latest'
}) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [activeFilter, setActiveFilter] = useState<'latest' | 'trending' | 'questions'>(filterBy);

  useEffect(() => {
    loadGroups();
  }, []);

  useEffect(() => {
    loadPosts();
  }, [groupId, activeFilter, currentPage]);

  const loadGroups = async () => {
    try {
      const data = await getGroups();
      setGroups(data);
    } catch (err) {
      console.error('Error al cargar grupos:', err);
    }
  };

  const loadPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const filters: CommunityFilters = {
        groupId: groupId || undefined,
        filterBy: activeFilter
      };
      const response = await getPosts(currentPage, 10, filters);
      setPosts(prev => currentPage === 1 ? response.data : [...prev, ...response.data]);
      setHasMore(response.pagination.currentPage < response.pagination.totalPages);
    } catch (err) {
      setError('Error al cargar publicaciones');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleReact = async (postId: string, reactionType: string) => {
    try {
      await reactToPost(postId, reactionType);
      // Actualizar estado local optimista
      setPosts(prev => prev.map(post => {
        if (post.id === postId) {
          const newReactions = { ...post.reactions };
          newReactions[reactionType] = (newReactions[reactionType] || 0) + 1;
          return { ...post, reactions: newReactions };
        }
        return post;
      }));
    } catch (err) {
      console.error('Error al reaccionar:', err);
    }
  };

  const handleComment = async (postId: string) => {
    // TODO: Abrir modal de comentarios
    console.log('Comentar en post:', postId);
  };

  const handleDelete = async (postId: string) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta publicación?')) {
      return;
    }

    try {
      await deletePost(postId);
      setPosts(prev => prev.filter(post => post.id !== postId));
    } catch (err) {
      console.error('Error al eliminar:', err);
      alert('Error al eliminar la publicación');
    }
  };

  const handleRefresh = () => {
    setCurrentPage(1);
    loadPosts();
  };

  const availableGroups = groups.filter(g => !g.isPrivate || true); // TODO: Filtrar por permisos

  if (loading && posts.length === 0) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Cargando publicaciones...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Formulario de nueva publicación */}
      <NewPostForm 
        availableGroups={availableGroups}
        onSubmitSuccess={handleRefresh}
      />

      {/* Filtros */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <div className="flex gap-2">
            {[
              { label: 'Más Recientes', value: 'latest' as const },
              { label: 'Tendencias', value: 'trending' as const },
              { label: 'Preguntas', value: 'questions' as const }
            ].map(filter => (
              <button
                key={filter.value}
                onClick={() => {
                  setActiveFilter(filter.value);
                  setCurrentPage(1);
                }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  activeFilter === filter.value
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
        <Button variant="secondary" size="sm" onClick={handleRefresh}>
          <RefreshCw className="w-4 h-4 mr-2" />
          Actualizar
        </Button>
      </div>

      {/* Lista de publicaciones */}
      {error ? (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p className="mb-2">No hay publicaciones aún</p>
          <p className="text-sm">Sé el primero en compartir algo con la comunidad</p>
        </div>
      ) : (
        <div className="space-y-4">
          {posts.map(post => (
            <PostCard
              key={post.id}
              post={post}
              onReact={handleReact}
              onComment={handleComment}
              onDelete={handleDelete}
            />
          ))}
          {hasMore && (
            <div className="text-center pt-4">
              <Button
                variant="secondary"
                onClick={() => setCurrentPage(prev => prev + 1)}
                disabled={loading}
              >
                {loading ? 'Cargando...' : 'Cargar más'}
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

