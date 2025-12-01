import React from 'react';
import { Card, Button, Badge, Checkbox } from '../../../components/componentsreutilizables';
import { Plan, TipoPlan, EstadoPlan } from '../types';
import { 
  Calendar, 
  Star, 
  TrendingUp, 
  Sparkles,
  Edit2,
  Trash2,
  Archive,
  Copy,
  Power,
  PowerOff,
  Eye,
  Check
} from 'lucide-react';

interface PlanCardProps {
  plan: Plan;
  onSelect?: (plan: Plan) => void;
  onEdit?: (plan: Plan) => void;
  onDelete?: (planId: string) => void;
  onDuplicate?: (plan: Plan) => void;
  onToggleEstado?: (plan: Plan) => void;
  onArchive?: (plan: Plan) => void;
  onViewDetails?: (plan: Plan) => void;
  viewMode?: 'grid' | 'list';
  isSelectMode?: boolean;
  isSelected?: boolean;
  onToggleSelect?: () => void;
}

const tipoLabels: Record<TipoPlan, string> = {
  suscripcion: 'Suscripción',
  bono: 'Bono',
  paquete: 'Paquete',
  pt: 'PT',
  grupal: 'Grupal'
};

const estadoConfig: Record<EstadoPlan, { 
  label: string; 
  variant: 'success' | 'error' | 'secondary' | 'yellow';
  borderColor: string;
  bgOverlay?: string;
}> = {
  activo: { 
    label: 'Activo', 
    variant: 'success',
    borderColor: 'border-green-200'
  },
  inactivo: { 
    label: 'Inactivo', 
    variant: 'error',
    borderColor: 'border-gray-300'
  },
  archivado: { 
    label: 'Archivado', 
    variant: 'secondary',
    borderColor: 'border-gray-300',
    bgOverlay: 'bg-gray-50/80'
  },
  borrador: { 
    label: 'Borrador', 
    variant: 'yellow',
    borderColor: 'border-yellow-200'
  }
};

const periodicidadLabels: Record<string, string> = {
  mensual: '/mes',
  trimestral: '/trimestre',
  anual: '/año',
  puntual: 'único'
};

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  onSelect,
  onEdit,
  onDelete,
  onDuplicate,
  onToggleEstado,
  onArchive,
  onViewDetails,
  viewMode = 'grid',
  isSelectMode = false,
  isSelected = false,
  onToggleSelect
}) => {
  // Calcular precio final (usar precioBase o precio legacy)
  const precioBase = plan.precioBase || plan.precio?.base || 0;
  const descuento = plan.precio?.descuento || 0;
  const precioFinal = precioBase * (1 - descuento / 100);
  const tieneDescuento = descuento > 0;
  const moneda = plan.moneda || plan.precio?.moneda || 'EUR';

  // Configuración de estado
  const estadoInfo = estadoConfig[plan.estado];
  
  // Obtener características destacadas (máximo 6, priorizando las destacadas)
  const caracteristicasDestacadas = React.useMemo(() => {
    const todas = plan.caracteristicas || [];
    const destacadas = todas.filter(c => c.destacadoOpcional);
    const noDestacadas = todas.filter(c => !c.destacadoOpcional);
    const combinadas = [...destacadas, ...noDestacadas];
    return combinadas.slice(0, 6);
  }, [plan.caracteristicas]);

  // Renderizar vista de lista
  if (viewMode === 'list') {
    return (
      <Card 
        className={`transition-all overflow-hidden border-2 ${
          estadoInfo.borderColor
        } ${
          isSelected ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50' : ''
        } ${plan.estado !== 'activo' ? 'opacity-75' : ''} relative`}
      >
        {/* Overlay para archivados */}
        {plan.estado === 'archivado' && estadoInfo.bgOverlay && (
          <div className={`absolute inset-0 ${estadoInfo.bgOverlay} z-10 pointer-events-none rounded-lg`}>
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" size="sm">
                <Archive size={12} className="mr-1" />
                Archivado
              </Badge>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 p-4 relative z-0">
          {/* Checkbox de selección */}
          {isSelectMode && onToggleSelect && (
            <Checkbox
              checked={isSelected}
              onChange={onToggleSelect}
              className="flex-shrink-0"
            />
          )}

          {/* Información principal */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4 mb-2">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1 flex-wrap">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {plan.nombre}
                  </h3>
                  <Badge variant="gray" size="sm" className="capitalize">
                    {tipoLabels[plan.tipo]}
                  </Badge>
                  {plan.esPopular && (
                    <Badge variant="blue" size="sm">
                      <TrendingUp size={12} className="mr-1" />
                      Popular
                    </Badge>
                  )}
                  {plan.esRecomendado && (
                    <Badge variant="green" size="sm">
                      <Star size={12} className="mr-1" />
                      Recomendado
                    </Badge>
                  )}
                  {plan.esNuevo && (
                    <Badge variant="purple" size="sm">
                      <Sparkles size={12} className="mr-1" />
                      Nuevo
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                  {plan.descripcion}
                </p>
                
                {/* Características destacadas */}
                {caracteristicasDestacadas.length > 0 && (
                  <div className="flex items-center gap-4 text-xs text-gray-600 mb-2 flex-wrap">
                    {caracteristicasDestacadas.slice(0, 3).map((caracteristica) => (
                      <span key={caracteristica.id} className="flex items-center gap-1">
                        <Check size={12} className="text-green-600" />
                        {caracteristica.label}
                      </span>
                    ))}
                    {caracteristicasDestacadas.length > 3 && (
                      <span className="text-gray-400">
                        +{caracteristicasDestacadas.length - 3} más
                      </span>
                    )}
                  </div>
                )}

                <div className="flex items-center gap-4 text-xs text-gray-500">
                  <span className="capitalize">{plan.periodicidad}</span>
                  {plan.sesionesIncluidasOpcional && (
                    <>
                      <span>•</span>
                      <span>{plan.sesionesIncluidasOpcional} sesiones</span>
                    </>
                  )}
                </div>
              </div>

              {/* Precio y acciones */}
              <div className="flex items-center gap-6 flex-shrink-0">
                <div className="text-right">
                  {tieneDescuento && (
                    <div className="text-xs text-gray-500 line-through mb-1">
                      {precioBase.toFixed(2)} {moneda}
                    </div>
                  )}
                  <div className="text-2xl font-bold text-gray-900">
                    {precioFinal.toFixed(2)} {moneda}
                  </div>
                  <div className="text-xs text-gray-500">
                    {periodicidadLabels[plan.periodicidad] || ''}
                  </div>
                </div>

                <Badge variant={estadoInfo.variant} size="sm">
                  {estadoInfo.label}
                </Badge>

                <div className="flex items-center gap-2">
                  {onViewDetails && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onViewDetails(plan)}
                      title="Ver detalles"
                    >
                      <Eye size={16} />
                    </Button>
                  )}
                  {onEdit && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onEdit(plan)}
                      title="Editar"
                    >
                      <Edit2 size={16} />
                    </Button>
                  )}
                  {onDuplicate && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onDuplicate(plan)}
                      title="Duplicar"
                    >
                      <Copy size={16} />
                    </Button>
                  )}
                  {onToggleEstado && plan.estado !== 'archivado' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onToggleEstado(plan)}
                      title={plan.estado === 'activo' ? 'Desactivar' : 'Activar'}
                    >
                      {plan.estado === 'activo' ? (
                        <PowerOff size={16} />
                      ) : (
                        <Power size={16} />
                      )}
                    </Button>
                  )}
                  {onArchive && plan.estado !== 'archivado' && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onArchive(plan)}
                      title="Archivar"
                    >
                      <Archive size={16} />
                    </Button>
                  )}
                  {onSelect && plan.estado === 'activo' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => onSelect(plan)}
                    >
                      Seleccionar
                    </Button>
                  )}
                  {onDelete && (
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(plan.id)}
                      title="Eliminar"
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    );
  }

  // Renderizar vista de grid (tarjeta)
  return (
    <Card 
      variant="hover"
      className={`h-full flex flex-col transition-all duration-200 overflow-hidden relative border-2 ${
        estadoInfo.borderColor
      } ${
        isSelected ? 'ring-2 ring-blue-500 ring-offset-2 bg-blue-50' : ''
      } ${plan.estado !== 'activo' ? 'opacity-75' : ''} ${
        plan.estado === 'archivado' ? 'bg-gray-50' : ''
      }`}
    >
      {/* Overlay para archivados */}
      {plan.estado === 'archivado' && estadoInfo.bgOverlay && (
        <div className={`absolute inset-0 ${estadoInfo.bgOverlay} z-10 pointer-events-none rounded-lg flex items-center justify-center`}>
          <Badge variant="secondary" size="md" className="shadow-lg">
            <Archive size={14} className="mr-1" />
            Archivado
          </Badge>
        </div>
      )}

      {/* Badges superiores - Popular, Recomendado, Nuevo */}
      <div className="absolute top-3 right-3 flex flex-wrap gap-2 items-start justify-end z-20 max-w-[60%]">
        {plan.esPopular && (
          <Badge variant="blue" size="sm" className="shadow-sm">
            <TrendingUp size={10} className="mr-1" />
            Popular
          </Badge>
        )}
        {plan.esRecomendado && (
          <Badge variant="green" size="sm" className="shadow-sm">
            <Star size={10} className="mr-1" />
            Recomendado
          </Badge>
        )}
        {plan.esNuevo && (
          <Badge variant="purple" size="sm" className="shadow-sm">
            <Sparkles size={10} className="mr-1" />
            Nuevo
          </Badge>
        )}
        {tieneDescuento && (
          <Badge variant="red" size="sm" className="shadow-sm">
            -{descuento}%
          </Badge>
        )}
      </div>

      {/* Checkbox de selección en modo selección */}
      {isSelectMode && onToggleSelect && (
        <div className="absolute top-3 left-3 z-20">
          <Checkbox
            checked={isSelected}
            onChange={onToggleSelect}
          />
        </div>
      )}

      {/* Estado del plan */}
      {!isSelectMode && (
        <div className="absolute top-3 left-3 z-20">
          <Badge variant={estadoInfo.variant} size="sm" className="shadow-sm">
            {estadoInfo.label}
          </Badge>
        </div>
      )}

      <div className="p-5 space-y-4 flex flex-col h-full relative z-0">
        {/* Header con tipo y nombre */}
        <div className="pt-8">
          <div className="flex items-center justify-between mb-3">
            <Badge variant="gray" size="sm" className="capitalize font-semibold">
              {tipoLabels[plan.tipo]}
            </Badge>
            <div className="flex items-center text-xs text-gray-500">
              <Calendar className="h-3 w-3 mr-1" />
              {plan.createdAt.toLocaleDateString('es-ES', { 
                day: '2-digit', 
                month: 'short' 
              })}
            </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2 leading-tight">
            {plan.nombre}
          </h3>
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
            {plan.descripcion}
          </p>
        </div>

        {/* Precio destacado */}
        <div className="py-3 px-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200">
          <div className="text-center">
            {tieneDescuento && (
              <div className="text-xs text-gray-500 line-through mb-1">
                {precioBase.toFixed(2)} {moneda}
              </div>
            )}
            <div className="flex items-baseline justify-center gap-1">
              <span className="text-3xl font-extrabold text-gray-900">
                {precioFinal.toFixed(2)}
              </span>
              <span className="text-sm font-medium text-gray-600">{moneda}</span>
            </div>
            {periodicidadLabels[plan.periodicidad] && (
              <div className="text-xs text-gray-500 mt-1 font-medium">
                {periodicidadLabels[plan.periodicidad]}
              </div>
            )}
          </div>
        </div>

        {/* Características destacadas (3-6 bullets) */}
        {caracteristicasDestacadas.length > 0 && (
          <div className="flex-1 space-y-2">
            <h4 className="text-xs font-semibold text-gray-700 uppercase tracking-wide">
              Características
            </h4>
            <ul className="space-y-2">
              {caracteristicasDestacadas.map((caracteristica) => (
                <li key={caracteristica.id} className="flex items-start gap-2 text-sm text-gray-700">
                  <Check size={16} className="text-green-600 mt-0.5 flex-shrink-0" />
                  <span className="flex-1 leading-relaxed">
                    {caracteristica.label}
                    {caracteristica.destacadoOpcional && (
                      <Badge variant="yellow" size="sm" className="ml-2">
                        Destacado
                      </Badge>
                    )}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Información adicional */}
        {(plan.sesionesIncluidasOpcional || plan.beneficiosAdicionales?.length) && (
          <div className="text-xs text-gray-500 space-y-1 pt-2 border-t border-gray-100">
            {plan.sesionesIncluidasOpcional && (
              <div className="flex items-center gap-1">
                <span className="font-semibold text-gray-700">{plan.sesionesIncluidasOpcional}</span>
                <span>sesiones incluidas</span>
              </div>
            )}
            {plan.beneficiosAdicionales && plan.beneficiosAdicionales.length > 0 && (
              <div className="text-gray-600">
                {plan.beneficiosAdicionales.slice(0, 2).join(' • ')}
              </div>
            )}
          </div>
        )}

        {/* Botones de acción */}
        <div className="mt-auto pt-4 border-t border-gray-200 space-y-2">
          {/* Botón principal */}
          {onSelect && plan.estado === 'activo' && (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={() => onSelect(plan)}
              className="font-semibold"
            >
              Seleccionar plan
            </Button>
          )}
          
          {/* Botones secundarios en fila */}
          <div className="flex gap-2">
            {onViewDetails && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onViewDetails(plan)}
                title="Ver detalles"
                className="flex-1"
              >
                <Eye size={16} className="mr-1" />
                Detalles
              </Button>
            )}
            {onEdit && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(plan)}
                title="Editar"
              >
                <Edit2 size={16} />
              </Button>
            )}
            {onDuplicate && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onDuplicate(plan)}
                title="Duplicar"
              >
                <Copy size={16} />
              </Button>
            )}
            {onToggleEstado && plan.estado !== 'archivado' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onToggleEstado(plan)}
                title={plan.estado === 'activo' ? 'Desactivar' : 'Activar'}
              >
                {plan.estado === 'activo' ? (
                  <PowerOff size={16} />
                ) : (
                  <Power size={16} />
                )}
              </Button>
            )}
            {onArchive && plan.estado !== 'archivado' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onArchive(plan)}
                title="Archivar"
              >
                <Archive size={16} />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(plan.id)}
                title="Eliminar"
              >
                <Trash2 size={16} />
              </Button>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
