import React from 'react';
import { Card } from '../../../components/componentsreutilizables/Card';
import { Badge } from '../../../components/componentsreutilizables/Badge';
import { Button } from '../../../components/componentsreutilizables/Button';
import { Template } from '../types';
import { Edit, Copy, Trash2, Calendar, Users, Dumbbell, Layers, Clock } from 'lucide-react';

interface TemplateCardProps {
  template: Template;
  onEdit: (id: string) => void;
  onDuplicate: (id: string) => void;
  onDelete: (id: string) => void;
}

export const TemplateCard: React.FC<TemplateCardProps> = ({
  template,
  onEdit,
  onDuplicate,
  onDelete,
}) => {
  // Calcular estadísticas de la estructura
  const totalPhases = template.structure?.phases.length || 0;
  const totalWeeks = template.structure?.phases.reduce((sum, phase) => sum + phase.weeks.length, 0) || 0;
  const totalDays = template.structure?.phases.reduce((sum, phase) => 
    sum + phase.weeks.reduce((weekSum, week) => weekSum + week.days.length, 0), 0
  ) || 0;
  const totalExercises = template.structure?.phases.reduce((sum, phase) =>
    sum + phase.weeks.reduce((weekSum, week) =>
      weekSum + week.days.reduce((daySum, day) => daySum + day.exercises.length, 0), 0
    ), 0
  ) || 0;

  // Formatear fecha de última actualización
  const formatDate = (dateString?: string) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    if (diffDays < 30) return `Hace ${Math.floor(diffDays / 7)} semanas`;
    return date.toLocaleDateString('es-ES', { month: 'short', day: 'numeric' });
  };

  return (
    <Card variant="hover" className="h-full flex flex-col transition-shadow overflow-hidden">
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-semibold text-gray-900 truncate">
                {template.name}
              </h3>
              {template.assignmentCount !== undefined && template.assignmentCount > 0 && (
                <Badge variant="success" size="sm" className="shrink-0">
                  {template.assignmentCount}
                </Badge>
              )}
            </div>
            {template.description && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {template.description}
              </p>
            )}
          </div>
        </div>

        {/* Metadata Grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
            <Calendar className="w-4 h-4 text-blue-500" />
            <div className="flex flex-col">
              <span className="font-medium">{template.durationWeeks}</span>
              <span className="text-xs text-gray-500">semanas</span>
            </div>
          </div>
          
          {template.assignmentCount !== undefined && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-gray-50 rounded-lg p-2">
              <Users className="w-4 h-4 text-green-500" />
              <div className="flex flex-col">
                <span className="font-medium">{template.assignmentCount}</span>
                <span className="text-xs text-gray-500">asignaciones</span>
              </div>
            </div>
          )}
        </div>

        {/* Estructura del programa */}
        {totalExercises > 0 && (
          <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
            <div className="grid grid-cols-2 gap-2 text-xs">
              {totalPhases > 0 && (
                <div className="flex items-center gap-1.5 text-gray-700">
                  <Layers className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-medium">{totalPhases}</span>
                  <span className="text-gray-500">fases</span>
                </div>
              )}
              {totalExercises > 0 && (
                <div className="flex items-center gap-1.5 text-gray-700">
                  <Dumbbell className="w-3.5 h-3.5 text-blue-600" />
                  <span className="font-medium">{totalExercises}</span>
                  <span className="text-gray-500">ejercicios</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {template.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="blue" size="sm" className="capitalize">
                {tag}
              </Badge>
            ))}
            {template.tags.length > 3 && (
              <Badge variant="outline" size="sm">
                +{template.tags.length - 3}
              </Badge>
            )}
          </div>
        )}

        {/* Fecha de actualización */}
        {template.updatedAt && (
          <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
            <Clock className="w-3.5 h-3.5" />
            <span>Actualizado {formatDate(template.updatedAt)}</span>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 mt-auto pt-3 border-t border-gray-100">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onEdit(template.id)}
            className="flex-1"
          >
            <Edit className="w-4 h-4 mr-2" />
            Editar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDuplicate(template.id)}
            className="flex-1"
          >
            <Copy className="w-4 h-4 mr-2" />
            Duplicar
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(template.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
};

