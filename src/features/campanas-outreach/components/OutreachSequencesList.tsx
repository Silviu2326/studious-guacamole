import React, { useState } from 'react';
import { Card, Button, Select } from '../../../components/componentsreutilizables';
import { OutreachSequence } from '../types';
import { 
  MessageSquare, 
  Mail, 
  Smartphone, 
  Bell, 
  Users, 
  List, 
  Target, 
  BarChart3, 
  Settings, 
  Pause, 
  Play,
  RefreshCw,
  Search,
  X,
  Loader2,
  Package
} from 'lucide-react';

// Componente LightInput para inputs según guía de estilos
type LightInputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
};

const LightInput: React.FC<LightInputProps> = ({ leftIcon, rightIcon, className = '', ...props }) => (
  <div className={`relative ${className}`}>
    {leftIcon && (
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span className="text-slate-400">{leftIcon}</span>
      </span>
    )}
    <input
      {...props}
      className={[
        'w-full rounded-xl bg-white text-slate-900 placeholder-slate-400',
        'ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400',
        leftIcon ? 'pl-10' : 'pl-3',
        rightIcon ? 'pr-10' : 'pr-3',
        'py-2.5'
      ].join(' ')}
    />
    {rightIcon && (
      <span className="absolute inset-y-0 right-0 flex items-center pr-3">
        {rightIcon}
      </span>
    )}
  </div>
);

interface OutreachSequencesListProps {
  sequences: OutreachSequence[];
  loading: boolean;
}

export const OutreachSequencesList: React.FC<OutreachSequencesListProps> = ({
  sequences,
  loading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'paused' | 'completed'>('all');

  const statusOptions = [
    { value: 'all', label: 'Todos los estados' },
    { value: 'active', label: 'Activas' },
    { value: 'paused', label: 'Pausadas' },
    { value: 'completed', label: 'Completadas' }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'paused':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
      default:
        return 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activa';
      case 'paused': return 'Pausada';
      case 'completed': return 'Completada';
      default: return status;
    }
  };

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case 'whatsapp': return <MessageSquare className="w-4 h-4" />;
      case 'email': return <Mail className="w-4 h-4" />;
      case 'sms': return <Smartphone className="w-4 h-4" />;
      case 'push_notification': return <Bell className="w-4 h-4" />;
      default: return <Bell className="w-4 h-4" />;
    }
  };

  const filteredSequences = sequences.filter(sequence => {
    const matchesSearch = sequence.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         sequence.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || sequence.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
        <p className="text-gray-600">Cargando...</p>
      </Card>
    );
  }

  const filtrosActivos = (searchTerm ? 1 : 0) + (statusFilter !== 'all' ? 1 : 0);
  const hayFiltrosActivos = filtrosActivos > 0;

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="flex-1">
                <LightInput
                  placeholder="Buscar secuencias por nombre o descripción..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  leftIcon={<Search size={20} />}
                  rightIcon={
                    searchTerm ? (
                      <button
                        onClick={() => setSearchTerm('')}
                        className="text-slate-400 hover:text-slate-600"
                      >
                        <X size={16} />
                      </button>
                    ) : undefined
                  }
                />
              </div>
            </div>
          </div>

          {/* Panel de filtros */}
          <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4">
            <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Estado
                </label>
                <Select
                  options={statusOptions}
                  value={statusFilter}
                  onChange={(value) => setStatusFilter(value as any)}
                  placeholder="Filtrar por estado"
                />
              </div>
            </div>
          </div>

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{filteredSequences.length} {filteredSequences.length === 1 ? 'secuencia encontrada' : 'secuencias encontradas'}</span>
            {hayFiltrosActivos && (
              <span>{filtrosActivos} {filtrosActivos === 1 ? 'filtro aplicado' : 'filtros aplicados'}</span>
            )}
          </div>
        </div>
      </Card>

      {/* Lista de secuencias */}
      {filteredSequences.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Package size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay secuencias de outreach</h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== 'all'
              ? 'No se encontraron secuencias con los filtros aplicados'
              : 'Crea tu primera secuencia de outreach para automatizar el seguimiento'
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSequences.map((sequence) => (
            <Card key={sequence.id} variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden p-6 bg-white shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {sequence.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(sequence.status)}`}>
                      {getStatusLabel(sequence.status)}
                    </span>
                  </div>
                  
                  {sequence.description && (
                    <p className="text-gray-600 mb-4">
                      {sequence.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span className="text-slate-600">
                        {sequence.audience.size} contactos
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <List className="w-4 h-4" />
                      <span className="text-slate-600">
                        {sequence.steps.length} pasos
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Target className="w-4 h-4" />
                      <span className="text-slate-600">
                        {sequence.triggers.length} trigger{sequence.triggers.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Pasos de la secuencia */}
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold text-gray-900 mb-2">
                      Pasos de la secuencia:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {sequence.steps.map((step, index) => (
                        <div
                          key={step.id}
                          className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-sm"
                        >
                          <span className="text-xs font-semibold text-gray-500">
                            {index + 1}
                          </span>
                          <span>{getChannelIcon(step.channel)}</span>
                          <span className="text-slate-600 truncate max-w-32">
                            {step.name}
                          </span>
                          <span className="text-xs text-gray-500">
                            +{step.delay.value}{step.delay.unit === 'minutes' ? 'm' : step.delay.unit === 'hours' ? 'h' : 'd'}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col lg:flex-row items-start lg:items-center gap-6">
                  {/* Métricas */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {sequence.metrics.totalContacts}
                      </div>
                      <div className="text-xs text-gray-500">
                        Total
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-lg font-semibold text-gray-900">
                        {sequence.metrics.activeSequences}
                      </div>
                      <div className="text-xs text-gray-500">
                        Activas
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-lg font-semibold text-blue-600">
                        {sequence.metrics.responseRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        Respuesta
                      </div>
                    </div>
                    
                    <div>
                      <div className="text-lg font-semibold text-green-600">
                        {sequence.metrics.conversionRate.toFixed(1)}%
                      </div>
                      <div className="text-xs text-gray-500">
                        Conversión
                      </div>
                    </div>
                  </div>
                  
                  {/* Acciones */}
                  <div className="flex flex-col gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Ver Detalles
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <Settings className="w-4 h-4 mr-1" />
                      Configurar
                    </Button>
                    
                    {sequence.status === 'active' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:text-yellow-300 dark:hover:bg-yellow-900/20"
                      >
                        <Pause className="w-4 h-4 mr-1" />
                        Pausar
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20"
                      >
                        <Play className="w-4 h-4 mr-1" />
                        Activar
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};