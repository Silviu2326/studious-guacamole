// Componente DocumentLibraryContainer - Container principal
import React, { useState, useEffect, useMemo } from 'react';
import { Document, Category, DocumentFilters } from '../types';
import { documentsApi } from '../api/documentsApi';
import { DocumentList } from './DocumentList';
import { DocumentViewer } from './DocumentViewer';
import { DocumentUploadModal } from './DocumentUploadModal';
import { Card, Button, Badge, MetricCards } from '../../../components/componentsreutilizables';
import { Search, Plus, FileText, CheckCircle2, AlertTriangle, Clock } from 'lucide-react';

interface DocumentLibraryContainerProps {
  currentUser: { role: string; [key: string]: any };
}

export const DocumentLibraryContainer: React.FC<DocumentLibraryContainerProps> = ({
  currentUser
}) => {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedDocument, setSelectedDocument] = useState<Document | null>(null);
  const [filters, setFilters] = useState<DocumentFilters>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [stats, setStats] = useState({
    totalDocuments: 0,
    publishedDocuments: 0,
    pendingAcknowledges: 0,
    outdatedDocuments: 0
  });

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    loadDocuments();
  }, [filters]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      await Promise.all([loadDocuments(), loadCategories()]);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const loadDocuments = async () => {
    try {
      const filtersToApply = { ...filters };
      if (selectedCategory) {
        filtersToApply.category = selectedCategory;
      }
      if (searchTerm) {
        filtersToApply.search = searchTerm;
      }

      const data = await documentsApi.obtenerDocumentos(filtersToApply);
      setDocuments(data);
      
      // Calcular estadísticas
      setStats({
        totalDocuments: data.length,
        publishedDocuments: data.filter(d => d.status === 'published').length,
        pendingAcknowledges: data.filter(d => d.isRequired && !d.hasAcknowledged).length,
        outdatedDocuments: data.filter(d => {
          const daysSinceUpdate = (Date.now() - new Date(d.lastUpdatedAt).getTime()) / (1000 * 60 * 60 * 24);
          return daysSinceUpdate > 365;
        }).length
      });
    } catch (error) {
      console.error('Error al cargar documentos:', error);
    }
  };

  const loadCategories = async () => {
    try {
      const data = await documentsApi.obtenerCategorias();
      setCategories(data);
    } catch (error) {
      console.error('Error al cargar categorías:', error);
    }
  };

  const handleSelectDocument = (docId: string) => {
    const doc = documents.find(d => d.docId === docId);
    setSelectedDocument(doc || null);
  };

  const handleAcknowledge = async (docId: string, versionId: string) => {
    try {
      await documentsApi.acknowledgeDocument(docId, versionId);
      setDocuments(docs => 
        docs.map(d => d.docId === docId ? { ...d, hasAcknowledged: true } : d)
      );
      if (selectedDocument) {
        setSelectedDocument({ ...selectedDocument, hasAcknowledged: true });
      }
    } catch (error) {
      console.error('Error al confirmar lectura:', error);
    }
  };

  const handleUploadSuccess = () => {
    loadDocuments();
    loadCategories();
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    const newFilters: DocumentFilters = {};
    if (selectedCategory) {
      newFilters.category = selectedCategory;
    }
    if (value) {
      newFilters.search = value;
    }
    setFilters(newFilters);
  };

  const handleCategoryFilter = (categoryId: string) => {
    setSelectedCategory(categoryId);
    const newFilters: DocumentFilters = {};
    if (categoryId) {
      newFilters.category = categoryId;
    }
    if (searchTerm) {
      newFilters.search = searchTerm;
    }
    setFilters(newFilters);
  };

  const isManager = currentUser.role === 'gerente' || currentUser.role === 'admin';

  const metricsData = [
    {
      id: 'total',
      title: 'Total Documentos',
      value: stats.totalDocuments.toString(),
      icon: <FileText size={20} />,
      color: 'info' as const
    },
    {
      id: 'published',
      title: 'Publicados',
      value: stats.publishedDocuments.toString(),
      icon: <CheckCircle2 size={20} />,
      color: 'success' as const
    },
    {
      id: 'pending',
      title: 'Pendientes Confirmar',
      value: stats.pendingAcknowledges.toString(),
      icon: <AlertTriangle size={20} />,
      color: 'warning' as const
    },
    {
      id: 'outdated',
      title: 'Desactualizados',
      value: stats.outdatedDocuments.toString(),
      icon: <Clock size={20} />,
      color: 'error' as const
    }
  ];

  const tabItems = [
    { id: 'all', label: 'Todos' },
    ...categories.map(cat => ({ id: cat.categoryId, label: cat.name }))
  ];

  const activeTab = selectedCategory || 'all';

  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <MetricCards data={metricsData} columns={4} />

      {/* Filtros y búsqueda según guía de estilos */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Toolbar superior */}
          <div className="flex items-center justify-end">
            {isManager && (
              <Button
                variant="primary"
                onClick={() => setIsUploadModalOpen(true)}
                leftIcon={<Plus size={20} />}
              >
                Nuevo Documento
              </Button>
            )}
          </div>

          {/* Sistema de filtros según guía */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              {/* Input de búsqueda según guía */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                  placeholder="Buscar documentos..."
                  value={searchTerm}
                  onChange={(e) => handleSearch(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Tabs de categorías según guía */}
          <div
            role="tablist"
            aria-label="Categorías"
            className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
          >
            {tabItems.map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    const catId = tab.id === 'all' ? '' : tab.id;
                    handleCategoryFilter(catId);
                  }}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                  role="tab"
                  aria-selected={isActive}
                >
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{documents.length} {documents.length === 1 ? 'documento encontrado' : 'documentos encontrados'}</span>
          </div>
        </div>
      </Card>

      {/* Layout: lista y visor */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Lista de documentos */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">
              Documentos
            </h3>
            <Badge variant="gray">
              {documents.length}
            </Badge>
          </div>

          <DocumentList
            documents={documents}
            onSelectDocument={handleSelectDocument}
            isLoading={isLoading}
          />
        </div>

        {/* Visor de documentos */}
        <div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <DocumentViewer
            document={selectedDocument}
            onAcknowledge={handleAcknowledge}
            hasAcknowledged={selectedDocument?.hasAcknowledged || false}
          />
        </div>
      </div>

      {/* Modal de subida */}
      <DocumentUploadModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        onSuccess={handleUploadSuccess}
        categories={categories}
      />
    </div>
  );
};
