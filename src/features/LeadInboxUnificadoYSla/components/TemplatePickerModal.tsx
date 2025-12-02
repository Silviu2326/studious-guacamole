import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Sparkles, 
  FileText,
  DollarSign,
  Clock as ClockIcon,
  Package,
  MessageSquare,
  TrendingUp,
  Copy,
  Check
} from 'lucide-react';
import { Button } from '../../../components/componentsreutilizables';
import { MessageTemplate } from '../types';
import { MessageTemplateService } from '../services/messageTemplates';

interface TemplatePickerModalProps {
  leadName: string;
  onSelect: (content: string) => void;
  onClose: () => void;
}

export const TemplatePickerModal: React.FC<TemplatePickerModalProps> = ({
  leadName,
  onSelect,
  onClose
}) => {
  const [templates, setTemplates] = useState<MessageTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<MessageTemplate['category'] | 'all'>('all');
  const [selectedTemplate, setSelectedTemplate] = useState<MessageTemplate | null>(null);
  const [templateVariables, setTemplateVariables] = useState<Record<string, string>>({});
  const [previewContent, setPreviewContent] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    loadTemplates();
  }, []);

  useEffect(() => {
    if (selectedTemplate) {
      // Set default values for variables
      const defaults: Record<string, string> = {
        nombre: leadName,
        precio: '€50',
        precio_basico: '€120',
        precio_premium: '€180',
        servicio: 'entrenamiento personal'
      };
      setTemplateVariables(defaults);
      
      // Generate preview
      const preview = MessageTemplateService.replaceVariables(selectedTemplate.content, defaults);
      setPreviewContent(preview);
    }
  }, [selectedTemplate, leadName]);

  const loadTemplates = async () => {
    setLoading(true);
    try {
      const data = await MessageTemplateService.getTemplates();
      setTemplates(data);
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleVariableChange = (variable: string, value: string) => {
    const updated = { ...templateVariables, [variable]: value };
    setTemplateVariables(updated);
    
    if (selectedTemplate) {
      const preview = MessageTemplateService.replaceVariables(selectedTemplate.content, updated);
      setPreviewContent(preview);
    }
  };

  const handleUseTemplate = async () => {
    if (!selectedTemplate) return;
    
    await MessageTemplateService.useTemplate(selectedTemplate.id);
    onSelect(previewContent);
  };

  const handleCopyTemplate = (template: MessageTemplate) => {
    const defaultVars: Record<string, string> = {
      nombre: leadName,
      precio: '€50',
      precio_basico: '€120',
      precio_premium: '€180',
      servicio: 'entrenamiento personal'
    };
    const content = MessageTemplateService.replaceVariables(template.content, defaultVars);
    navigator.clipboard.writeText(content);
    setCopiedId(template.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getCategoryIcon = (category: MessageTemplate['category']) => {
    switch (category) {
      case 'precios':
        return <DollarSign className="w-4 h-4" />;
      case 'horarios':
        return <ClockIcon className="w-4 h-4" />;
      case 'servicios':
        return <Package className="w-4 h-4" />;
      case 'seguimiento':
        return <TrendingUp className="w-4 h-4" />;
      default:
        return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getCategoryLabel = (category: MessageTemplate['category']) => {
    const labels = {
      precios: 'Precios',
      horarios: 'Horarios',
      servicios: 'Servicios',
      seguimiento: 'Seguimiento',
      otros: 'Otros'
    };
    return labels[category];
  };

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = searchQuery === '' || 
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.content.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories: Array<MessageTemplate['category'] | 'all'> = [
    'all', 'servicios', 'precios', 'horarios', 'seguimiento', 'otros'
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-white/20 rounded-xl backdrop-blur">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-xl font-bold">Plantillas de respuesta rápida</h2>
                <p className="text-sm text-white/90">Selecciona y personaliza tu mensaje</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="p-6 border-b border-gray-200 bg-gray-50">
          <div className="flex gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar plantillas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedCategory === category
                    ? 'bg-purple-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {category === 'all' ? 'Todas' : getCategoryLabel(category as MessageTemplate['category'])}
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-hidden flex">
          {/* Templates List */}
          <div className="w-2/5 border-r border-gray-200 overflow-y-auto bg-gray-50">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
                <p className="text-gray-600">Cargando plantillas...</p>
              </div>
            ) : filteredTemplates.length === 0 ? (
              <div className="p-8 text-center">
                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">No se encontraron plantillas</p>
              </div>
            ) : (
              <div className="p-4 space-y-2">
                {filteredTemplates.map(template => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedTemplate?.id === template.id
                        ? 'bg-purple-100 border-2 border-purple-500 shadow-sm'
                        : 'bg-white hover:bg-gray-50 border border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-lg ${
                          selectedTemplate?.id === template.id ? 'bg-purple-200' : 'bg-gray-100'
                        }`}>
                          {getCategoryIcon(template.category)}
                        </div>
                        <h3 className="font-semibold text-gray-900 text-sm">{template.name}</h3>
                      </div>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopyTemplate(template);
                        }}
                        className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors"
                        title="Copiar plantilla"
                      >
                        {copiedId === template.id ? (
                          <Check className="w-4 h-4 text-green-600" />
                        ) : (
                          <Copy className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{template.content}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs text-gray-500">Usada {template.usageCount} veces</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Preview and Variables */}
          <div className="flex-1 p-6 overflow-y-auto">
            {selectedTemplate ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{selectedTemplate.name}</h3>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                      {getCategoryLabel(selectedTemplate.category)}
                    </span>
                    <span className="text-xs text-gray-500">
                      Usada {selectedTemplate.usageCount} veces
                    </span>
                  </div>
                </div>

                {/* Variables */}
                {selectedTemplate.variables.length > 0 && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-gray-900">Personalizar variables:</h4>
                    {selectedTemplate.variables.map(variable => (
                      <div key={variable}>
                        <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">
                          {variable.replace('_', ' ')}
                        </label>
                        <input
                          type="text"
                          value={templateVariables[variable] || ''}
                          onChange={(e) => handleVariableChange(variable, e.target.value)}
                          className="w-full px-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                          placeholder={`Ingresa ${variable}`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                {/* Preview */}
                <div>
                  <h4 className="font-semibold text-gray-900 mb-2">Vista previa:</h4>
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 border-2 border-gray-200 rounded-2xl p-6">
                    <div className="bg-white rounded-xl p-4 shadow-sm">
                      <p className="text-sm text-gray-900 whitespace-pre-wrap">{previewContent}</p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleUseTemplate}
                  variant="primary"
                  size="lg"
                  fullWidth
                  className="!rounded-xl"
                >
                  Usar esta plantilla
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-600">Selecciona una plantilla para ver la vista previa</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

