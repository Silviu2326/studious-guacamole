import React, { useState } from 'react';
import { X, GripVertical, Eye, EyeOff, Save } from 'lucide-react';
import { TabConfig, TabId } from '../types';
import { Card, Button } from '../../../components/componentsreutilizables';

interface TabConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  tabs: TabConfig[];
  onSave: (tabs: TabConfig[]) => void;
}

export const TabConfigModal: React.FC<TabConfigModalProps> = ({
  isOpen,
  onClose,
  tabs,
  onSave,
}) => {
  const [localTabs, setLocalTabs] = useState<TabConfig[]>(tabs);
  const [draggedTabId, setDraggedTabId] = useState<TabId | null>(null);
  const [dragOverTabId, setDragOverTabId] = useState<TabId | null>(null);

  // Update local tabs when props change
  React.useEffect(() => {
    if (isOpen) {
      setLocalTabs(tabs);
    }
  }, [tabs, isOpen]);

  if (!isOpen) return null;

  const handleToggleVisibility = (tabId: TabId) => {
    setLocalTabs((prev) =>
      prev.map((tab) =>
        tab.id === tabId ? { ...tab, visible: !tab.visible } : tab
      )
    );
  };

  const handleDragStart = (tabId: TabId) => {
    setDraggedTabId(tabId);
  };

  const handleDragOver = (e: React.DragEvent, tabId: TabId) => {
    e.preventDefault();
    if (draggedTabId === null || draggedTabId === tabId) return;
    setDragOverTabId(tabId);
  };

  const handleDragLeave = () => {
    setDragOverTabId(null);
  };

  const handleDrop = (e: React.DragEvent, targetTabId: TabId) => {
    e.preventDefault();
    if (draggedTabId === null || draggedTabId === targetTabId) {
      setDraggedTabId(null);
      setDragOverTabId(null);
      return;
    }

    const draggedTab = localTabs.find(t => t.id === draggedTabId);
    const targetTab = localTabs.find(t => t.id === targetTabId);
    
    if (!draggedTab || !targetTab) {
      setDraggedTabId(null);
      setDragOverTabId(null);
      return;
    }

    // Only reorder visible tabs
    const visibleTabs = localTabs.filter(t => t.visible).sort((a, b) => a.order - b.order);
    const draggedVisibleIndex = visibleTabs.findIndex(t => t.id === draggedTabId);
    const targetVisibleIndex = visibleTabs.findIndex(t => t.id === targetTabId);

    if (draggedVisibleIndex === -1 || targetVisibleIndex === -1) {
      setDraggedTabId(null);
      setDragOverTabId(null);
      return;
    }

    // Reorder visible tabs
    const reorderedVisible = [...visibleTabs];
    const [removed] = reorderedVisible.splice(draggedVisibleIndex, 1);
    reorderedVisible.splice(targetVisibleIndex, 0, removed);

    // Update order for all visible tabs
    const updatedTabs = localTabs.map(tab => {
      const newIndex = reorderedVisible.findIndex(t => t.id === tab.id);
      if (newIndex !== -1) {
        return { ...tab, order: newIndex };
      }
      return tab;
    });

    setLocalTabs(updatedTabs);
    setDraggedTabId(null);
    setDragOverTabId(null);
  };

  const handleDragEnd = () => {
    setDraggedTabId(null);
    setDragOverTabId(null);
  };

  const handleSave = () => {
    onSave(localTabs);
    onClose();
  };

  const visibleTabs = localTabs.filter((tab) => tab.visible);
  const hiddenTabs = localTabs.filter((tab) => !tab.visible);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col bg-white shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Personalizar Tabs
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Reordena y oculta las tabs según tus prioridades
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Visible Tabs - Reordenables */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3">
              Tabs Visibles (Arrastra para reordenar)
            </h3>
            <div className="space-y-2">
              {visibleTabs
                .sort((a, b) => a.order - b.order)
                .map((tab) => {
                  const isDragging = draggedTabId === tab.id;
                  const isDragOver = dragOverTabId === tab.id;
                  return (
                    <div
                      key={tab.id}
                      draggable
                      onDragStart={() => handleDragStart(tab.id)}
                      onDragOver={(e) => handleDragOver(e, tab.id)}
                      onDragLeave={handleDragLeave}
                      onDrop={(e) => handleDrop(e, tab.id)}
                      onDragEnd={handleDragEnd}
                      className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all cursor-move ${
                        isDragging
                          ? 'border-blue-500 bg-blue-50 opacity-50'
                          : isDragOver
                          ? 'border-blue-400 bg-blue-50 border-dashed'
                          : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                      }`}
                    >
                      <GripVertical
                        size={20}
                        className="text-gray-400 flex-shrink-0"
                      />
                      <span className="flex-1 text-sm font-medium text-gray-900">
                        {tab.label}
                      </span>
                      <button
                        onClick={() => handleToggleVisibility(tab.id)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Ocultar tab"
                      >
                        <EyeOff size={18} className="text-gray-500" />
                      </button>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* Hidden Tabs */}
          {hiddenTabs.length > 0 && (
            <div>
              <h3 className="text-sm font-semibold text-gray-700 mb-3">
                Tabs Ocultas
              </h3>
              <div className="space-y-2">
                {hiddenTabs
                  .sort((a, b) => a.order - b.order)
                  .map((tab) => (
                    <div
                      key={tab.id}
                      className="flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 bg-gray-50 opacity-60"
                    >
                      <div className="w-5" /> {/* Spacer for alignment */}
                      <span className="flex-1 text-sm font-medium text-gray-500">
                        {tab.label}
                      </span>
                      <button
                        onClick={() => handleToggleVisibility(tab.id)}
                        className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Mostrar tab"
                      >
                        <Eye size={18} className="text-gray-500" />
                      </button>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button variant="outline" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave} leftIcon={<Save size={18} />}>
            Guardar Cambios
          </Button>
        </div>
      </Card>
    </div>
  );
};

