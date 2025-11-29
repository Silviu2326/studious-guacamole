import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { ClientNote } from '../types';
import { getClientNotes, createClientNote } from '../api/client360';
import { Loader2, StickyNote, Calendar, User, Plus, Lock } from 'lucide-react';
import { useAuth } from '../../../context/AuthContext';

interface NotesTabProps {
  clientId: string;
}

export const NotesTab: React.FC<NotesTabProps> = ({ clientId }) => {
  const { user } = useAuth();
  const [notes, setNotes] = useState<ClientNote[]>([]);
  const [loading, setLoading] = useState(true);
  const [showNewNoteForm, setShowNewNoteForm] = useState(false);
  const [newNoteContent, setNewNoteContent] = useState('');

  useEffect(() => {
    loadNotes();
  }, [clientId]);

  const loadNotes = async () => {
    setLoading(true);
    try {
      const data = await getClientNotes(clientId);
      setNotes(data);
    } catch (error) {
      console.error('Error cargando notas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateNote = async () => {
    if (!newNoteContent.trim() || !user) return;

    try {
      const newNote = await createClientNote(
        clientId,
        newNoteContent,
        user.id,
        user.name || 'Usuario'
      );
      setNotes([newNote, ...notes]);
      setNewNoteContent('');
      setShowNewNoteForm(false);
    } catch (error) {
      console.error('Error creando nota:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="p-8 text-center">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando notas...</p>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6">
      {/* Botón para agregar nota */}
      <div className="flex justify-end">
        <Button onClick={() => setShowNewNoteForm(!showNewNoteForm)}>
          <Plus size={20} className="mr-2" />
          Nueva Nota
        </Button>
      </div>

      {/* Formulario de nueva nota */}
      {showNewNoteForm && (
        <Card className="p-4 bg-blue-50 border-blue-200 shadow-sm">
          <textarea
            value={newNoteContent}
            onChange={(e) => setNewNoteContent(e.target.value)}
            placeholder="Escribe tu nota aquí..."
            className="w-full min-h-[100px] p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
          />
          <div className="flex justify-end gap-2 mt-3">
            <Button variant="ghost" onClick={() => { setShowNewNoteForm(false); setNewNoteContent(''); }}>
              Cancelar
            </Button>
            <Button onClick={handleCreateNote} disabled={!newNoteContent.trim()}>
              Guardar Nota
            </Button>
          </div>
        </Card>
      )}

      {/* Lista de notas */}
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <StickyNote size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay notas</h3>
          <p className="text-gray-600">Aún no se han agregado notas para este cliente</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notes.map((note) => (
            <Card key={note.id} className="p-4 bg-white shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <StickyNote size={20} className="text-blue-600" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <User size={14} className="text-gray-400" />
                      <span className="text-sm font-medium text-gray-700">
                        {note.authorName}
                      </span>
                      {note.isPrivate && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Lock size={12} />
                          <span>Privada</span>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <Calendar size={12} />
                      <span>{formatDate(note.createdAt)}</span>
                    </div>
                  </div>

                  <p className="text-sm text-gray-700 whitespace-pre-wrap mb-3">
                    {note.content}
                  </p>

                  {note.tags && note.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {note.tags.map((tag, idx) => (
                        <span
                          key={idx}
                          className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

