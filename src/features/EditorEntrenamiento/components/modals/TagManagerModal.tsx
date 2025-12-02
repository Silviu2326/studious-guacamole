import React, { useState } from 'react';
import { X, Plus, Trash2, GitMerge, Check, Edit2 } from 'lucide-react';
import { Modal } from '../../../../components/componentsreutilizables/Modal';
import { Button } from '../../../../components/componentsreutilizables/Button';
import { useProgramContext } from '../../context/ProgramContext';
import { useUIContext } from '../../context/UIContext';
import { Tag } from '../../types/training';

const PRESET_COLORS = [
  'blue', 'red', 'green', 'orange', 'purple', 'pink', 'yellow', 'gray', 'teal', 'indigo'
];

const CATEGORIES = ['muscle', 'pattern', 'equipment', 'intensity', 'other'] as const;

export const TagManagerModal: React.FC = () => {
  const { isTagManagerOpen, setTagManagerOpen } = useUIContext();
  const { globalTags, createTag, updateTag, deleteTag, mergeTags } = useProgramContext();
  
  const [isCreating, setIsCreating] = useState(false);
  const [newTag, setNewTag] = useState<Partial<Tag>>({ color: 'blue', category: 'other', label: '' });
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<Tag>>({});

  const [mergingId, setMergingId] = useState<string | null>(null);
  const [mergeTargetId, setMergeTargetId] = useState<string>('');

  const onClose = () => setTagManagerOpen(false);

  const handleCreate = () => {
    if (!newTag.label) return;
    const tag: Tag = {
      id: crypto.randomUUID(),
      label: newTag.label,
      color: newTag.color || 'blue',
      category: newTag.category || 'other',
    };
    createTag(tag);
    setNewTag({ color: 'blue', category: 'other', label: '' });
    setIsCreating(false);
  };

  const startEditing = (tag: Tag) => {
    setEditingId(tag.id);
    setEditForm({ ...tag });
    setMergingId(null);
  };

  const saveEdit = () => {
    if (editingId && editForm.label) {
      updateTag(editingId, editForm);
      setEditingId(null);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({});
  };

  const startMerging = (tagId: string) => {
    setMergingId(tagId);
    setMergeTargetId('');
    setEditingId(null);
  };

  const confirmMerge = () => {
    if (mergingId && mergeTargetId) {
      mergeTags(mergingId, mergeTargetId);
      setMergingId(null);
      setMergeTargetId('');
    }
  };

  return (
    <Modal
      isOpen={isTagManagerOpen}
      onClose={onClose}
      title="Gestión de Tags"
      size="lg"
      footer={
        <div className="flex justify-end w-full">
          <Button variant="secondary" onClick={onClose}>
            Cerrar
          </Button>
        </div>
      }
    >
      <div className="space-y-4 p-1 min-h-[400px]">
        <div className="flex justify-between items-center mb-4">
          <p className="text-sm text-gray-500">Administra las etiquetas globales del programa.</p>
          <Button 
            variant="primary" 
            size="sm" 
            onClick={() => setIsCreating(true)} 
            disabled={isCreating}
            icon={Plus}
          >
            Nuevo Tag
          </Button>
        </div>

        {/* Create New Tag Form */}
        {isCreating && (
          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-4 animate-in fade-in slide-in-from-top-2">
            <div className="grid grid-cols-12 gap-3 items-end">
              <div className="col-span-4">
                <label className="text-xs font-medium text-gray-700 mb-1 block">Nombre</label>
                <input
                  type="text"
                  value={newTag.label}
                  onChange={(e) => setNewTag({ ...newTag, label: e.target.value })}
                  className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Hipertrofia"
                  autoFocus
                />
              </div>
              <div className="col-span-3">
                <label className="text-xs font-medium text-gray-700 mb-1 block">Categoría</label>
                <select
                  value={newTag.category}
                  onChange={(e) => setNewTag({ ...newTag, category: e.target.value as any })}
                  className="w-full px-2 py-1.5 text-sm border rounded focus:ring-2 focus:ring-blue-500"
                >
                  {CATEGORIES.map(c => (
                    <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                  ))}
                </select>
              </div>
              <div className="col-span-3">
                <label className="text-xs font-medium text-gray-700 mb-1 block">Color</label>
                <div className="flex flex-wrap gap-1">
                  {PRESET_COLORS.map(c => (
                    <button
                      key={c}
                      type="button"
                      onClick={() => setNewTag({ ...newTag, color: c })}
                      className={`w-5 h-5 rounded-full transition-transform hover:scale-110 ${newTag.color === c ? 'ring-2 ring-offset-1 ring-gray-400 scale-110' : ''}`}
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              <div className="col-span-2 flex gap-1">
                <Button size="sm" variant="primary" onClick={handleCreate} disabled={!newTag.label} className="w-full">
                  <Check size={14} />
                </Button>
                <Button size="sm" variant="ghost" onClick={() => setIsCreating(false)} className="w-full">
                  <X size={14} />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Tag List */}
        <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">
          {globalTags.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No hay tags definidos. Crea uno nuevo.
            </div>
          ) : (
            globalTags.map(tag => (
              <div 
                key={tag.id} 
                className={`group flex items-center p-3 rounded-lg border transition-all ${
                  editingId === tag.id ? 'bg-blue-50 border-blue-200' : 
                  mergingId === tag.id ? 'bg-amber-50 border-amber-200' : 'bg-white border-gray-100 hover:border-gray-300'
                }`}
              >
                {editingId === tag.id ? (
                  // Edit Mode
                  <div className="grid grid-cols-12 gap-3 items-center w-full">
                     <div className="col-span-4">
                      <input
                        type="text"
                        value={editForm.label || ''}
                        onChange={(e) => setEditForm({ ...editForm, label: e.target.value })}
                        className="w-full px-2 py-1 text-sm border rounded"
                      />
                    </div>
                    <div className="col-span-3">
                      <select
                        value={editForm.category}
                        onChange={(e) => setEditForm({ ...editForm, category: e.target.value as any })}
                        className="w-full px-2 py-1 text-sm border rounded"
                      >
                        {CATEGORIES.map(c => (
                          <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>
                        ))}
                      </select>
                    </div>
                    <div className="col-span-3 flex flex-wrap gap-1">
                      {PRESET_COLORS.map(c => (
                        <button
                          key={c}
                          onClick={() => setEditForm({ ...editForm, color: c })}
                          className={`w-4 h-4 rounded-full ${editForm.color === c ? 'ring-2 ring-offset-1 ring-gray-400' : ''}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <div className="col-span-2 flex justify-end gap-1">
                      <button onClick={saveEdit} className="p-1 text-green-600 hover:bg-green-100 rounded"><Check size={16} /></button>
                      <button onClick={cancelEdit} className="p-1 text-gray-400 hover:bg-gray-100 rounded"><X size={16} /></button>
                    </div>
                  </div>
                ) : mergingId === tag.id ? (
                  // Merge Mode
                  <div className="flex items-center gap-3 w-full animate-in fade-in">
                    <GitMerge size={18} className="text-amber-500" />
                    <span className="text-sm font-medium text-gray-700">Fusionar "{tag.label}" en:</span>
                    <select
                      value={mergeTargetId}
                      onChange={(e) => setMergeTargetId(e.target.value)}
                      className="flex-1 px-2 py-1.5 text-sm border rounded"
                    >
                      <option value="">Seleccionar destino...</option>
                      {globalTags.filter(t => t.id !== tag.id).map(t => (
                        <option key={t.id} value={t.id}>{t.label}</option>
                      ))}
                    </select>
                    <div className="flex gap-1">
                      <Button size="xs" variant="primary" onClick={confirmMerge} disabled={!mergeTargetId}>Confirmar</Button>
                      <Button size="xs" variant="ghost" onClick={() => setMergingId(null)}>Cancelar</Button>
                    </div>
                  </div>
                ) : (
                  // Display Mode
                  <>
                    <div 
                      className="w-4 h-4 rounded-full mr-3 flex-shrink-0" 
                      style={{ backgroundColor: tag.color }} 
                      title={`Color: ${tag.color}`}
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-gray-900 truncate">{tag.label}</h4>
                      <span className="text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded-full">
                        {tag.category}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button 
                        onClick={() => startEditing(tag)}
                        className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                        title="Editar"
                      >
                        <Edit2 size={14} />
                      </button>
                      <button 
                        onClick={() => startMerging(tag.id)}
                        className="p-1.5 text-gray-400 hover:text-amber-600 hover:bg-amber-50 rounded transition-colors"
                        title="Fusionar"
                      >
                        <GitMerge size={14} />
                      </button>
                      <button 
                        onClick={() => deleteTag(tag.id)}
                        className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                        title="Eliminar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </Modal>
  );
};
