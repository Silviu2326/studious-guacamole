import React, { useState, useRef, useEffect } from 'react';
import { X, Send, Check } from 'lucide-react';
import { useCollaboration, Comment, Collaborator } from '../../context/CollaborationContext';

interface CommentThreadProps {
  exerciseId: string;
  onClose: () => void;
  position?: { x: number; y: number };
}

export const CommentThread: React.FC<CommentThreadProps> = ({ exerciseId, onClose, position }) => {
  const { comments, addComment, resolveThread, currentUser, activeUsers } = useCollaboration();
  const [newCommentText, setNewCommentText] = useState('');
  const threadComments = comments[exerciseId] || [];
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Focus input on mount
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!newCommentText.trim()) return;
    
    addComment(exerciseId, newCommentText);
    setNewCommentText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const getAuthorDetails = (authorId: string) => {
    if (authorId === currentUser?.id) return currentUser;
    // Try to find in active users, otherwise return fallback
    const user = activeUsers.find(u => u.id === authorId);
    return user || { name: 'Usuario', color: '#9CA3AF', id: authorId, status: 'idle' } as Collaborator;
  };

  const style: React.CSSProperties = position ? {
    position: 'fixed',
    left: position.x,
    top: position.y,
    zIndex: 50
  } : {};

  return (
    <div 
      ref={containerRef}
      style={style}
      className="w-80 bg-white rounded-lg shadow-xl border border-gray-200 flex flex-col animate-in fade-in zoom-in-95 duration-200"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-100 bg-gray-50 rounded-t-lg">
        <span className="text-sm font-semibold text-gray-700">Comentarios</span>
        <div className="flex items-center gap-1">
          <button 
            onClick={() => resolveThread(exerciseId)}
            className="text-xs flex items-center gap-1 text-green-600 hover:bg-green-50 px-2 py-1 rounded transition-colors"
            title="Resolver hilo"
          >
            <Check size={14} />
            Resolver
          </button>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded hover:bg-gray-200 transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      </div>

      {/* Comments List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 max-h-60">
        {threadComments.length === 0 ? (
          <div className="text-center text-gray-400 text-xs py-4 italic">
            No hay comentarios aún.
          </div>
        ) : (
          threadComments.map((comment: Comment) => {
            const author = getAuthorDetails(comment.authorId);
            const isMe = comment.authorId === currentUser?.id;
            
            return (
              <div key={comment.id} className={`flex gap-2 ${isMe ? 'flex-row-reverse' : ''}`}>
                <div 
                  className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0"
                  style={{ backgroundColor: author.color }}
                  title={author.name}
                >
                  {author.avatar ? (
                     <img src={author.avatar} alt={author.name} className="w-full h-full rounded-full" />
                  ) : (
                     author.name.charAt(0).toUpperCase()
                  )}
                </div>
                <div className={`flex flex-col max-w-[85%] ${isMe ? 'items-end' : 'items-start'}`}>
                  <div className={`px-3 py-2 rounded-lg text-sm ${
                    isMe ? 'bg-blue-50 text-blue-900 rounded-tr-none' : 'bg-gray-100 text-gray-800 rounded-tl-none'
                  }`}>
                    {comment.text}
                  </div>
                  <span className="text-[10px] text-gray-400 mt-1">
                    {author.name} • {new Date(comment.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 border-t border-gray-100 bg-white rounded-b-lg">
        <div className="relative">
          <textarea
            ref={inputRef}
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Escribe un comentario..."
            className="w-full text-sm border-gray-300 rounded-md pr-10 py-2 pl-3 focus:ring-blue-500 focus:border-blue-500 min-h-[40px] max-h-[80px] resize-none"
            rows={1}
          />
          <button 
            onClick={() => handleSubmit()}
            disabled={!newCommentText.trim()}
            className="absolute right-2 bottom-2 text-blue-500 hover:text-blue-600 disabled:text-gray-300 transition-colors p-1"
          >
            <Send size={16} />
          </button>
        </div>
        <div className="text-[10px] text-gray-400 mt-1 ml-1">
          Enter para enviar, Shift+Enter para nueva línea
        </div>
      </div>
    </div>
  );
};
