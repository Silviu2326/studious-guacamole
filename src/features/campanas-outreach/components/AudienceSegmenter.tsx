import React, { useState } from 'react';
import { Card, Button, Input } from '../../../components/componentsreutilizables';
import { ds } from '../../adherencia/ui/ds';
import { AudienceSegment } from '../types';

interface AudienceSegmenterProps {
  segments: AudienceSegment[];
  loading: boolean;
}

export const AudienceSegmenter: React.FC<AudienceSegmenterProps> = ({
  segments,
  loading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const filteredSegments = segments.filter(segment =>
    segment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    segment.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCriteriaDescription = (segment: AudienceSegment): string => {
    const criteria = segment.criteria;
    const descriptions: string[] = [];

    if (criteria.demographics) {
      if (criteria.demographics.ageRange) {
        descriptions.push(`Edad: ${criteria.demographics.ageRange[0]}-${criteria.demographics.ageRange[1]} años`);
      }
      if (criteria.demographics.gender && criteria.demographics.gender !== 'all') {
        const genderLabels = { male: 'Hombres', female: 'Mujeres', other: 'Otros' };
        descriptions.push(`Género: ${genderLabels[criteria.demographics.gender]}`);
      }
    }

    if (criteria.behavior) {
      if (criteria.behavior.membershipStatus) {
        const statusLabels = {
          active: 'Socios activos',
          inactive: 'Socios inactivos',
          expired: 'Membresías vencidas',
          trial: 'En período de prueba'
        };
        descriptions.push(statusLabels[criteria.behavior.membershipStatus]);
      }
      
      if (criteria.behavior.lastVisit) {
        const { operator, value } = criteria.behavior.lastVisit;
        if (operator === 'before' && value instanceof Date) {
          const daysSince = Math.floor((Date.now() - value.getTime()) / (1000 * 60 * 60 * 24));
          descriptions.push(`Sin visita hace ${daysSince}+ días`);
        }
      }
      
      if (criteria.behavior.attendanceFrequency) {
        const { operator, value, period } = criteria.behavior.attendanceFrequency;
        descriptions.push(`Asistencia ${operator === 'greater_than' ? '>' : operator === 'less_than' ? '<' : '='} ${value} veces por ${period === 'week' ? 'semana' : 'mes'}`);
      }
    }

    if (criteria.engagement) {
      if (criteria.engagement.appUsage) {
        const usageLabels = { high: 'Alto uso de app', medium: 'Uso medio de app', low: 'Bajo uso de app' };
        descriptions.push(usageLabels[criteria.engagement.appUsage]);
      }
    }

    return descriptions.length > 0 ? descriptions.join(', ') : 'Sin criterios específicos';
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div key={i} className={`${ds.shimmer} rounded-2xl h-32`} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header y búsqueda */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div className="flex-1">
          <Input
            placeholder="Buscar segmentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          variant="primary"
        >
          <span className="mr-2">➕</span>
          Crear Segmento
        </Button>
      </div>

      {/* Lista de segmentos */}
      {filteredSegments.length === 0 ? (
        <Card className="text-center py-12">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-400 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">👥</span>
          </div>
          <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} mb-2`}>
            No hay segmentos de audiencia
          </h3>
          <p className={`${ds.typography.body} ${ds.color.textSecondary} mb-6`}>
            {searchTerm
              ? 'No se encontraron segmentos con los filtros aplicados'
              : 'Crea tu primer segmento para organizar tu audiencia'
            }
          </p>
          <Button onClick={() => setShowCreateForm(true)} variant="primary">
            Crear Primer Segmento
          </Button>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredSegments.map((segment) => (
            <Card key={segment.id} variant="hover" className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} mb-2`}>
                    {segment.name}
                  </h3>
                  {segment.description && (
                    <p className={`${ds.typography.body} ${ds.color.textSecondary} mb-3`}>
                      {segment.description}
                    </p>
                  )}
                </div>
                
                <div className="text-center ml-4">
                  <div className={`${ds.typography.h2} ${ds.color.textPrimary}`}>
                    {segment.size}
                  </div>
                  <div className={`${ds.typography.caption} ${ds.color.textMuted}`}>
                    contactos
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <h4 className={`${ds.typography.bodySmall} font-semibold ${ds.color.textPrimary} mb-2`}>
                  Criterios de segmentación:
                </h4>
                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary}`}>
                  {getCriteriaDescription(segment)}
                </p>
              </div>

              <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <Button variant="ghost" size="sm">
                    <span className="mr-1">📊</span>
                    Ver Detalles
                  </Button>
                  <Button variant="ghost" size="sm">
                    <span className="mr-1">⚙️</span>
                    Editar
                  </Button>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:text-red-400 dark:hover:text-red-300 dark:hover:bg-red-900/20"
                >
                  <span className="mr-1">🗑️</span>
                  Eliminar
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Segmentos predefinidos sugeridos */}
      <Card className="p-6">
        <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} mb-4`}>
          Segmentos Sugeridos para Gimnasios
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              name: 'Nuevos Miembros',
              description: 'Socios registrados en los últimos 30 días',
              icon: '🆕',
              criteria: 'Fecha de registro reciente'
            },
            {
              name: 'Miembros VIP',
              description: 'Socios con alta frecuencia de visitas',
              icon: '⭐',
              criteria: 'Más de 15 visitas/mes'
            },
            {
              name: 'En Riesgo de Baja',
              description: 'Sin visitas en las últimas 2 semanas',
              icon: '⚠️',
              criteria: 'Inactividad prolongada'
            },
            {
              name: 'Interesados en PT',
              description: 'Han consultado sobre entrenamiento personal',
              icon: '💪',
              criteria: 'Interés en servicios premium'
            },
            {
              name: 'Cumpleañeros del Mes',
              description: 'Celebran cumpleaños este mes',
              icon: '🎂',
              criteria: 'Fecha de nacimiento'
            },
            {
              name: 'Leads Calientes',
              description: 'Prospectos con alta probabilidad de conversión',
              icon: '🔥',
              criteria: 'Engagement alto'
            }
          ].map((suggestion, index) => (
            <div
              key={index}
              className="p-4 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl hover:border-blue-400 dark:hover:border-blue-500 transition-colors cursor-pointer"
              onClick={() => setShowCreateForm(true)}
            >
              <div className="text-center">
                <div className="text-3xl mb-2">{suggestion.icon}</div>
                <h4 className={`${ds.typography.bodyLarge} font-semibold ${ds.color.textPrimary} mb-1`}>
                  {suggestion.name}
                </h4>
                <p className={`${ds.typography.bodySmall} ${ds.color.textSecondary} mb-2`}>
                  {suggestion.description}
                </p>
                <p className={`${ds.typography.caption} ${ds.color.textMuted}`}>
                  {suggestion.criteria}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {/* Modal de creación (placeholder) */}
      {showCreateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className={`${ds.typography.h2} ${ds.color.textPrimary}`}>
                Crear Nuevo Segmento
              </h2>
              <Button
                onClick={() => setShowCreateForm(false)}
                variant="ghost"
                size="sm"
              >
                ✕
              </Button>
            </div>
            
            <div className="text-center py-12">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <span className="text-4xl text-white">🔧</span>
              </div>
              <h3 className={`${ds.typography.h3} ${ds.color.textPrimary} mb-4`}>
                Constructor de Segmentos
              </h3>
              <p className={`${ds.typography.body} ${ds.color.textSecondary} mb-6`}>
                El constructor avanzado de segmentos estará disponible próximamente. 
                Podrás crear segmentos personalizados basados en demografía, comportamiento, 
                engagement y criterios personalizados.
              </p>
              <div className="flex justify-center gap-3">
                <Button onClick={() => setShowCreateForm(false)} variant="ghost">
                  Cerrar
                </Button>
                <Button onClick={() => setShowCreateForm(false)} variant="primary">
                  Entendido
                </Button>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
};