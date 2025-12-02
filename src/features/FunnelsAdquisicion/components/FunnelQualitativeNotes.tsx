import React, { useState, useCallback } from 'react';
import { FileText, Plus, Tag, AlertCircle, CheckCircle2, TrendingUp, X, Edit2, Save } from 'lucide-react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { FunnelsAdquisicionService } from '../services/funnelsAdquisicionService';
import {
  FunnelQualitativeNotesResponse,
  FunnelQualitativeNote,
  CreateFunnelQualitativeNoteRequest,
  AcquisitionFunnelPerformance,
} from '../types';

interface FunnelQualitativeNotesProps {
  funnel: AcquisitionFunnelPerformance;
  onRefresh?: () => void;
  className?: string;
}

const categoryLabels: Record<FunnelQualitativeNote['category'], string> = {
  feedback_prospecto: 'Feedback de prospecto',
  observacion: 'Observación',
  mejora_sugerida: 'Mejora sugerida',
  problema_detectado: 'Problema detectado',
  exito: 'Éxito',
  otro: 'Otro',
};

const categoryColors: Record<FunnelQualitativeNote['category'], string> = {
  feedback_prospecto: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-300',
  observacion: 'bg-gray-50 border-gray-200 text-gray-800 dark:bg-gray-900/20 dark:border-gray-800 dark:text-gray-300',
  mejora_sugerida: 'bg-purple-50 border-purple-200 text-purple-800 dark:bg-purple-900/20 dark:border-purple-800 dark:text-purple-300',
  problema_detectado: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-300',
  exito: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-300',
  otro: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-300',
};

const priorityColors = {
  high: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  medium: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  low: 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300',
};

export const FunnelQualitativeNotes: React.FC<FunnelQualitativeNotesProps> = ({
  funnel,
  onRefresh,
  className = '',
}) => {
  const [notes, setNotes] = useState<FunnelQualitativeNotesResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddNote, setShowAddNote] = useState(false);
  const [editingNote, setEditingNote] = useState<string | null>(null);
  const [newNote, setNewNote] = useState<Partial<CreateFunnelQualitativeNoteRequest>>({
    note: '',
    category: 'feedback_prospecto',
    priority: 'medium',
    actionable: false,
  });

  const loadNotes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await FunnelsAdquisicionService.getFunnelQualitativeNotes(funnel.id);
      setNotes(data);
    } catch (error) {
      console.error('[FunnelQualitativeNotes] Error cargando notas:', error);
    } finally {
      setLoading(false);
    }
  }, [funnel.id]);

  React.useEffect(() => {
    loadNotes();
  }, [loadNotes]);

  const handleAddNote = async () => {
    if (!newNote.note || !newNote.category) return;

    try {
      await FunnelsAdquisicionService.createFunnelQualitativeNote({
        funnelId: funnel.id,
        note: newNote.note,
        category: newNote.category,
        tags: newNote.tags,
        prospectName: newNote.prospectName,
        priority: newNote.priority,
        actionable: newNote.actionable,
      } as CreateFunnelQualitativeNoteRequest);

      setNewNote({
        note: '',
        category: 'feedback_prospecto',
        priority: 'medium',
        actionable: false,
      });
      setShowAddNote(false);
      loadNotes();
      onRefresh?.();
    } catch (error) {
      console.error('[FunnelQualitativeNotes] Error creando nota:', error);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' });
  };

  if (loading && !notes) {
    return (
      <Card className={`p-6 ${className}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-1/3"></div>
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-100 dark:bg-gray-800 rounded"></div>
            ))}
          </div>
        </div>
      </Card>
    );
  }

  return (
    <Card className={`p-6 ${className}`}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-slate-100">
            Notas Cualitativas - {funnel.name}
          </h2>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowAddNote(!showAddNote)}
          className="inline-flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar nota
        </Button>
      </div>

      {showAddNote && (
        <div className="mb-6 p-4 rounded-xl border border-indigo-200 bg-indigo-50/50 dark:border-indigo-800 dark:bg-indigo-900/20">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100 mb-3">Nueva nota</h3>
          <div className="space-y-3">
            <textarea
              value={newNote.note || ''}
              onChange={(e) => setNewNote({ ...newNote, note: e.target.value })}
              placeholder="Escribe tu nota o feedback del prospecto..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100 focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              rows={3}
            />
            <div className="flex flex-wrap gap-3">
              <select
                value={newNote.category}
                onChange={(e) =>
                  setNewNote({ ...newNote, category: e.target.value as FunnelQualitativeNote['category'] })
                }
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
              >
                {Object.entries(categoryLabels).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
              <select
                value={newNote.priority}
                onChange={(e) => setNewNote({ ...newNote, priority: e.target.value as 'high' | 'medium' | 'low' })}
                className="px-3 py-2 border border-gray-300 dark:border-gray-700 rounded-lg bg-white dark:bg-slate-800 text-gray-900 dark:text-slate-100"
              >
                <option value="high">Alta prioridad</option>
                <option value="medium">Media prioridad</option>
                <option value="low">Baja prioridad</option>
              </select>
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={newNote.actionable}
                  onChange={(e) => setNewNote({ ...newNote, actionable: e.target.checked })}
                  className="rounded border-gray-300 dark:border-gray-700"
                />
                Requiere acción
              </label>
            </div>
            <div className="flex gap-2">
              <Button variant="primary" size="sm" onClick={handleAddNote}>
                <Save className="w-4 h-4 mr-2" />
                Guardar nota
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setShowAddNote(false)}>
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}

      {notes && notes.insights && notes.insights.length > 0 && (
        <div className="mb-6 p-4 rounded-xl border border-purple-200 bg-purple-50/50 dark:border-purple-800 dark:bg-purple-900/20">
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            <h3 className="text-sm font-semibold text-gray-900 dark:text-slate-100">Insights detectados</h3>
          </div>
          <div className="space-y-2">
            {notes.insights.map((insight) => (
              <div key={insight.id} className="text-sm text-gray-700 dark:text-slate-300">
                <span className="font-semibold">{insight.title}:</span> {insight.description}
                {insight.suggestedAction && (
                  <div className="mt-1 text-xs text-purple-600 dark:text-purple-400">
                    💡 {insight.suggestedAction}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {notes && notes.notes.length > 0 ? (
        <div className="space-y-4">
          {notes.notes.map((note) => (
            <div
              key={note.id}
              className={`rounded-xl border-2 p-4 ${categoryColors[note.category]}`}
            >
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-xs font-semibold px-2 py-1 rounded-full bg-white/50 dark:bg-black/20">
                    {categoryLabels[note.category]}
                  </span>
                  {note.priority && (
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${priorityColors[note.priority]}`}>
                      {note.priority === 'high' ? 'Alta' : note.priority === 'medium' ? 'Media' : 'Baja'} prioridad
                    </span>
                  )}
                  {note.actionable && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300">
                      Requiere acción
                    </span>
                  )}
                  {note.actionTaken && (
                    <span className="text-xs font-medium px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Acción tomada
                    </span>
                  )}
                </div>
                <span className="text-xs text-gray-600 dark:text-slate-400">{formatDate(note.createdAt)}</span>
              </div>
              <p className="text-sm text-gray-900 dark:text-slate-100 mb-2">{note.note}</p>
              {note.prospectName && (
                <p className="text-xs text-gray-600 dark:text-slate-400 mb-2">
                  Prospecto: <span className="font-semibold">{note.prospectName}</span>
                </p>
              )}
              {note.tags && note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {note.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1 text-xs px-2 py-1 rounded-full bg-white/50 dark:bg-black/20"
                    >
                      <Tag className="w-3 h-3" />
                      {tag}
                    </span>
                  ))}
                </div>
              )}
              {note.actionTaken && (
                <div className="mt-3 pt-3 border-t border-current/20">
                  <p className="text-xs font-semibold mb-1">Acción tomada:</p>
                  <p className="text-xs">{note.actionTaken}</p>
                  {note.actionTakenAt && (
                    <p className="text-xs mt-1 opacity-70">{formatDate(note.actionTakenAt)}</p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <FileText className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-slate-100 mb-1">
            No hay notas registradas
          </h3>
          <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
            Agrega notas cualitativas para mejorar las siguientes iteraciones del funnel
          </p>
          <Button variant="primary" size="sm" onClick={() => setShowAddNote(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Agregar primera nota
          </Button>
        </div>
      )}
    </Card>
  );
};

