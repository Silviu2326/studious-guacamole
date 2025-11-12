import React, { useState } from 'react';
import {
  Mail,
  Plus,
  Edit,
  Trash2,
  Send,
  Search,
  Calendar,
  Clock,
  Eye,
  MousePointerClick,
  TrendingUp,
  Users,
  FileText,
  Settings,
  BarChart3,
  CheckCircle2,
  XCircle,
  Pause,
  Play,
} from 'lucide-react';
import { Card, Button, Badge, Modal } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { Newsletter, NewsletterTemplate, NewsletterStatus, NewsletterFrequency } from '../types';

interface NewsletterEditorProps {
  newsletters?: Newsletter[];
  templates?: NewsletterTemplate[];
  loading?: boolean;
  className?: string;
  onNewsletterCreate?: () => void;
  onNewsletterEdit?: (newsletter: Newsletter) => void;
  onNewsletterDelete?: (newsletterId: string) => void;
  onNewsletterSend?: (newsletterId: string) => void;
  onNewsletterSchedule?: (newsletterId: string) => void;
  onNewsletterPause?: (newsletterId: string) => void;
  onNewsletterResume?: (newsletterId: string) => void;
  onTemplateCreate?: () => void;
  onTemplateEdit?: (template: NewsletterTemplate) => void;
  onTemplateDelete?: (templateId: string) => void;
  onViewTracking?: (newsletterId: string) => void;
}

const statusColors: Record<NewsletterStatus, string> = {
  draft: 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300',
  scheduled: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  sending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300',
  sent: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  paused: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const statusLabels: Record<NewsletterStatus, string> = {
  draft: 'Borrador',
  scheduled: 'Programado',
  sending: 'Enviando',
  sent: 'Enviado',
  paused: 'Pausado',
  cancelled: 'Cancelado',
};

const frequencyLabels: Record<NewsletterFrequency, string> = {
  weekly: 'Semanal',
  biweekly: 'Quincenal',
  monthly: 'Mensual',
  custom: 'Personalizado',
};

const categoryLabels: Record<NewsletterTemplate['category'], string> = {
  'fitness-tips': 'Tips de Fitness',
  nutrition: 'Nutrición',
  motivation: 'Motivación',
  'success-stories': 'Historias de Éxito',
  challenges: 'Retos',
  general: 'General',
};

export const NewsletterEditor: React.FC<NewsletterEditorProps> = ({
  newsletters = [],
  templates = [],
  loading = false,
  className = '',
  onNewsletterCreate,
  onNewsletterEdit,
  onNewsletterDelete,
  onNewsletterSend,
  onNewsletterSchedule,
  onNewsletterPause,
  onNewsletterResume,
  onTemplateCreate,
  onTemplateEdit,
  onTemplateDelete,
  onViewTracking,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'newsletters' | 'templates'>('newsletters');
  const [statusFilter, setStatusFilter] = useState<NewsletterStatus | 'all'>('all');

  if (loading) {
    return (
      <Card className={className}>
        <div className={`${ds.shimmer} h-64 rounded-2xl`} />
      </Card>
    );
  }

  const filteredNewsletters = newsletters.filter((newsletter) => {
    const matchesSearch =
      searchQuery === '' ||
      newsletter.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      newsletter.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || newsletter.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const filteredTemplates = templates.filter(
    (template) =>
      searchQuery === '' ||
      template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <Card className={className}>
      <div className="flex items-start justify-between mb-6">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-100 to-pink-200 flex items-center justify-center">
              <Mail className="w-5 h-5 text-purple-600" />
            </span>
            <h2 className={`${ds.typography.h2} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
              Editor de Newsletters
            </h2>
          </div>
          <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
            Crea newsletters con plantillas, programa envíos recurrentes y mide engagement con tracking de aperturas y clics
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="purple" size="md">
            {newsletters.length} newsletters
          </Badge>
          <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={onNewsletterCreate}>
            Nuevo newsletter
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 mb-6 border-b border-slate-200 dark:border-slate-700">
        <button
          onClick={() => setActiveTab('newsletters')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'newsletters'
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <Mail size={16} />
            <span>Newsletters ({newsletters.length})</span>
          </div>
        </button>
        <button
          onClick={() => setActiveTab('templates')}
          className={`px-4 py-2 text-sm font-medium transition-colors ${
            activeTab === 'templates'
              ? 'text-purple-600 dark:text-purple-400 border-b-2 border-purple-600 dark:border-purple-400'
              : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <FileText size={16} />
            <span>Plantillas ({templates.length})</span>
          </div>
        </button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar newsletters o plantillas..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
        {activeTab === 'newsletters' && (
          <div className="flex items-center gap-2">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as NewsletterStatus | 'all')}
              className="px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="all">Todos los estados</option>
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Newsletters Tab */}
      {activeTab === 'newsletters' && (
        <div className="space-y-4">
          {filteredNewsletters.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-12 text-center">
              <Mail className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className={`${ds.typography.body} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-4`}>
                No hay newsletters creados aún
              </p>
              <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={onNewsletterCreate}>
                Crear primer newsletter
              </Button>
            </div>
          ) : (
            filteredNewsletters.map((newsletter) => (
              <div
                key={newsletter.id}
                className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {newsletter.name}
                      </h3>
                      <Badge className={statusColors[newsletter.status]} size="sm">
                        {statusLabels[newsletter.status]}
                      </Badge>
                      {newsletter.schedule && (
                        <Badge variant="blue" size="sm">
                          <Calendar className="w-3 h-3 mr-1" />
                          {frequencyLabels[newsletter.schedule.frequency]}
                        </Badge>
                      )}
                    </div>
                    <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark} mb-2`}>
                      {newsletter.description}
                    </p>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                        Asunto:
                      </span>
                      <span className={`${ds.typography.bodySmall} font-medium ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {newsletter.subject}
                      </span>
                    </div>
                    {newsletter.segmentName && (
                      <Badge variant="gray" size="sm">
                        Segmento: {newsletter.segmentName}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-2 ml-4">
                    {newsletter.tracking && (
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<BarChart3 size={14} />}
                        onClick={() => onViewTracking?.(newsletter.id)}
                      >
                        Ver tracking
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Edit size={14} />}
                      onClick={() => onNewsletterEdit?.(newsletter)}
                    >
                      Editar
                    </Button>
                    {newsletter.status === 'draft' && (
                      <Button
                        variant="primary"
                        size="sm"
                        leftIcon={<Send size={14} />}
                        onClick={() => onNewsletterSend?.(newsletter.id)}
                      >
                        Enviar
                      </Button>
                    )}
                    {newsletter.status === 'scheduled' && newsletter.schedule && (
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Pause size={14} />}
                        onClick={() => onNewsletterPause?.(newsletter.id)}
                      >
                        Pausar
                      </Button>
                    )}
                    {newsletter.status === 'paused' && newsletter.schedule && (
                      <Button
                        variant="ghost"
                        size="sm"
                        leftIcon={<Play size={14} />}
                        onClick={() => onNewsletterResume?.(newsletter.id)}
                      >
                        Reanudar
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Trash2 size={14} />}
                      onClick={() => onNewsletterDelete?.(newsletter.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>

                {/* Stats */}
                {newsletter.tracking && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 mb-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="w-4 h-4 text-slate-400" />
                        <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                          Tasa apertura
                        </span>
                      </div>
                      <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {newsletter.tracking.openRate.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <MousePointerClick className="w-4 h-4 text-slate-400" />
                        <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                          Tasa clics
                        </span>
                      </div>
                      <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {newsletter.tracking.clickRate.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <Users className="w-4 h-4 text-slate-400" />
                        <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                          Destinatarios
                        </span>
                      </div>
                      <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {newsletter.tracking.totalRecipients}
                      </p>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <TrendingUp className="w-4 h-4 text-slate-400" />
                        <span className={`${ds.typography.caption} ${ds.color.textMuted} ${ds.color.textMutedDark}`}>
                          CTR/Open
                        </span>
                      </div>
                      <p className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                        {newsletter.tracking.clickToOpenRate.toFixed(1)}%
                      </p>
                    </div>
                  </div>
                )}

                {/* Schedule Info */}
                {newsletter.schedule && (
                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Próximo envío: {formatDate(newsletter.schedule.nextScheduledDate)}
                          </span>
                        </div>
                        {newsletter.schedule.lastSentDate && (
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4" />
                            <span>Último envío: {formatDate(newsletter.schedule.lastSentDate)}</span>
                          </div>
                        )}
                      </div>
                      <Badge variant={newsletter.schedule.isActive ? 'green' : 'gray'} size="sm">
                        {newsletter.schedule.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 mr-1" />
                            Programación activa
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 mr-1" />
                            Programación pausada
                          </>
                        )}
                      </Badge>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {/* Templates Tab */}
      {activeTab === 'templates' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
              Usa plantillas predefinidas para crear newsletters más rápido
            </p>
            <Button variant="secondary" size="sm" leftIcon={<Plus size={16} />} onClick={onTemplateCreate}>
              Nueva plantilla
            </Button>
          </div>
          {filteredTemplates.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 p-12 text-center">
              <FileText className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className={`${ds.typography.body} ${ds.color.textMuted} ${ds.color.textMutedDark} mb-4`}>
                No hay plantillas creadas aún
              </p>
              <Button variant="primary" size="sm" leftIcon={<Plus size={16} />} onClick={onTemplateCreate}>
                Crear primera plantilla
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900/50 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} ${ds.color.textPrimaryDark}`}>
                          {template.name}
                        </h3>
                        {template.isDefault && (
                          <Badge variant="blue" size="sm">
                            Por defecto
                          </Badge>
                        )}
                      </div>
                      <Badge variant="gray" size="sm" className="mb-2">
                        {categoryLabels[template.category]}
                      </Badge>
                      <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} ${ds.color.textSecondaryDark}`}>
                        {template.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Edit size={14} />}
                      onClick={() => onTemplateEdit?.(template)}
                      className="flex-1"
                    >
                      Editar
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      leftIcon={<Trash2 size={14} />}
                      onClick={() => onTemplateDelete?.(template.id)}
                    >
                      Eliminar
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </Card>
  );
};

