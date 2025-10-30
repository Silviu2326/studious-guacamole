import React from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Plan, UserRole } from '../types';
import { Clock, Users, Dumbbell, Calendar, Star, CheckCircle } from 'lucide-react';

interface PlanCardProps {
  plan: Plan;
  userType: UserRole;
  onSelect: (plan: Plan) => void;
  onEdit: (plan: Plan) => void;
  onDelete: (planId: string) => void;
  isSelected?: boolean;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  userType,
  onSelect,
  onEdit,
  onDelete,
  isSelected = false
}) => {
  const precioFinal = plan.precio.base * (1 - plan.precio.descuento / 100);
  const tieneDescuento = plan.precio.descuento > 0;

  const renderEntrenadorContent = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Dumbbell className="h-5 w-5 text-indigo-600" />
          <span className="text-sm font-medium text-gray-700">
            {plan.sesiones} sesiones
          </span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-5 w-5 text-indigo-600" />
          <span className="text-sm font-medium text-gray-700">
            {plan.validezMeses} meses
          </span>
        </div>
      </div>
      
      <div className="bg-indigo-50 rounded-lg p-3">
        <p className="text-sm text-indigo-700">
          Precio por sesión: {(precioFinal / (plan.sesiones || 1)).toFixed(2)}€
        </p>
      </div>
    </div>
  );

  const renderGimnasioContent = () => (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <Star className="h-5 w-5 text-indigo-600" />
        <span className="text-sm font-medium text-gray-700 capitalize">
          {plan.tipoAcceso?.replace('_', ' ')}
        </span>
      </div>
      
      {plan.clasesIlimitadas && (
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-sm text-green-700">Clases ilimitadas</span>
        </div>
      )}
      
      {plan.instalacionesIncluidas && plan.instalacionesIncluidas.length > 0 && (
        <div className="bg-gray-50 rounded-lg p-3">
          <h4 className="text-sm font-medium text-gray-900 mb-2">Instalaciones incluidas:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {plan.instalacionesIncluidas.map((instalacion, index) => (
              <li key={index} className="flex items-center space-x-2">
                <CheckCircle className="h-3 w-3 text-green-500" />
                <span>{instalacion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <Card 
      variant={isSelected ? "elevated" : "hover"} 
      className={`relative transition-all duration-200 ${
        isSelected ? 'ring-2 ring-indigo-500 ring-offset-2' : ''
      } ${!plan.activo ? 'opacity-60' : ''}`}
    >
      {tieneDescuento && (
        <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
          -{plan.precio.descuento}%
        </div>
      )}
      
      {!plan.activo && (
        <div className="absolute top-4 left-4 bg-gray-500 text-white text-xs font-medium px-2 py-1 rounded">
          Inactivo
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{plan.nombre}</h3>
          <p className="text-sm text-gray-600 mt-1">{plan.descripcion}</p>
        </div>

        {userType === 'entrenador' ? renderEntrenadorContent() : renderGimnasioContent()}

        <div className="border-t pt-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              {tieneDescuento && (
                <span className="text-sm text-gray-500 line-through">
                  {plan.precio.base}€
                </span>
              )}
              <div className="flex items-baseline space-x-1">
                <span className="text-2xl font-bold text-gray-900">
                  {precioFinal.toFixed(2)}€
                </span>
                {userType === 'gimnasio' && (
                  <span className="text-sm text-gray-500">/mes</span>
                )}
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span className="text-xs text-gray-500">
                {plan.fechaActualizacion.toLocaleDateString()}
              </span>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={() => onSelect(plan)}
              disabled={!plan.activo}
            >
              {userType === 'entrenador' ? 'Asignar Bono' : 'Seleccionar Plan'}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onEdit(plan)}
            >
              Editar
            </Button>
            
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onDelete(plan.id)}
            >
              Eliminar
            </Button>
          </div>
        </div>
      </div>
    </Card>
  );
};