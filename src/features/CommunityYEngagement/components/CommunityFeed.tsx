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
import { Filter, RefreshCw, Loader2, MessageSquare, AlertCircle } from 'lucide-react';
import { Button, Card } from '../../../components/componentsreutilizables';

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
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando publicaciones...</p>
      </Card>
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
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4 flex-col sm:flex-row">
              <div className="flex-1 flex items-center gap-2">
                <Filter size={16} className="text-slate-600" />
                <div className="flex gap-2 flex-wrap">
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
                      className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                        activeFilter === filter.value
                          ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                          : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                      }`}
                    >
                      {filter.label}
                    </button>
                  ))}
                </div>
              </div>
              <Button variant="ghost" size="sm" onClick={handleRefresh}>
                <RefreshCw size={18} className="mr-2" />
                Actualizar
              </Button>
            </div>
          </div>
        </div>
      </Card>

      {/* Lista de publicaciones */}
      {error ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar</h3>
          <p className="text-gray-600 mb-4">{error}</p>
        </Card>
      ) : posts.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay publicaciones aún</h3>
          <p className="text-gray-600">Sé el primero en compartir algo con la comunidad</p>
        </Card>
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

