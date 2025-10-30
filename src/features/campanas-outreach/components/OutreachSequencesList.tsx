import React, { useState } from 'react';
import { Card, Button, Input, Select } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { OutreachSequence } from '../types';

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
      case 'whatsapp': return '💬';
      case 'email': return '📧';
      case 'sms': return '📱';
      case 'push_notification': return '🔔';
      default: return '📢';
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
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`${ds.shimmer} rounded-2xl h-40`} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Buscar secuencias..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Select
          options={statusOptions}
          value={statusFilter}
          onChange={(value) => setStatusFilter(value as any)}
          placeholder="Filtrar por estado"
        />
      </div>

      {/* Lista de secuencias */}
      {filteredSequences.length === 0 ? (
        <Card className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">🔄</span>
          </div>
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} mb-2`}>
            No hay secuencias de outreach
          </h3>
          <p className={`${ds.typography.body} ${ds.color.textSecondary}`}>
            {searchTerm || statusFilter !== 'all'
              ? 'No se encontraron secuencias con los filtros aplicados'
              : 'Crea tu primera secuencia de outreach para automatizar el seguimiento'
            }
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredSequences.map((sequence) => (
            <Card key={sequence.id} variant="hover" className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className={`${ds.typography.h3} ${ds.color.textPrimary}`}>
                      {sequence.name}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(sequence.status)}`}>
                      {getStatusLabel(sequence.status)}
                    </span>
                  </div>
                  
                  {sequence.description && (
                    <p className={`${ds.typography.body} ${ds.color.textSecondary} mb-4`}>
                      {sequence.description}
                    </p>
                  )}
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                    <div className="flex items-center gap-2">
                      <span className="text-lg">👥</span>
                      <span className={ds.color.textSecondary}>
                        {sequence.audience.size} contactos
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg">📋</span>
                      <span className={ds.color.textSecondary}>
                        {sequence.steps.length} pasos
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-lg">🎯</span>
                      <span className={ds.color.textSecondary}>
                        {sequence.triggers.length} trigger{sequence.triggers.length !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  {/* Pasos de la secuencia */}
                  <div className="space-y-2">
                    <h4 className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} mb-2`}>
                      Pasos de la secuencia:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {sequence.steps.map((step, index) => (
                        <div
                          key={step.id}
                          className="flex items-center gap-2 px-3 py-1 bg-gray-100 dark:bg-gray-800 rounded-lg text-sm"
                        >
                          <span className="text-xs font-semibold text-gray-500 dark:text-gray-400">
                            {index + 1}
                          </span>
                          <span>{getChannelIcon(step.channel)}</span>
                          <span className={`${ds.color.textSecondary} truncate max-w-32`}>
                            {step.name}
                          </span>
                          <span className={`text-xs ${ds.color.textMuted}`}>
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
                      <div className={`${ds.typography.h4} ${ds.color.textPrimary}`}>
                        {sequence.metrics.totalContacts}
                      </div>
                      <div className={`${ds.typography.caption} ${ds.color.textMuted}`}>
                        Total
                      </div>
                    </div>
                    
                    <div>
                      <div className={`${ds.typography.h4} ${ds.color.textPrimary}`}>
                        {sequence.metrics.activeSequences}
                      </div>
                      <div className={`${ds.typography.caption} ${ds.color.textMuted}`}>
                        Activas
                      </div>
                    </div>
                    
                    <div>
                      <div className={`${ds.typography.h4} text-blue-600 dark:text-blue-400`}>
                        {sequence.metrics.responseRate.toFixed(1)}%
                      </div>
                      <div className={`${ds.typography.caption} ${ds.color.textMuted}`}>
                        Respuesta
                      </div>
                    </div>
                    
                    <div>
                      <div className={`${ds.typography.h4} text-green-600 dark:text-green-400`}>
                        {sequence.metrics.conversionRate.toFixed(1)}%
                      </div>
                      <div className={`${ds.typography.caption} ${ds.color.textMuted}`}>
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
                      <span className="mr-1">📊</span>
                      Ver Detalles
                    </Button>
                    
                    <Button
                      variant="ghost"
                      size="sm"
                    >
                      <span className="mr-1">⚙️</span>
                      Configurar
                    </Button>
                    
                    {sequence.status === 'active' ? (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-yellow-600 hover:text-yellow-700 hover:bg-yellow-50 dark:text-yellow-400 dark:hover:text-yellow-300 dark:hover:bg-yellow-900/20"
                      >
                        <span className="mr-1">⏸️</span>
                        Pausar
                      </Button>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-green-600 hover:text-green-700 hover:bg-green-50 dark:text-green-400 dark:hover:text-green-300 dark:hover:bg-green-900/20"
                      >
                        <span className="mr-1">▶️</span>
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