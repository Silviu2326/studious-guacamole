import React, { useState, useEffect } from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import {
  getActividadSuscripcionesReciente,
} from '../api/suscripciones';
import {
  ActividadSuscripcionesReciente,
} from '../types';
import {
  TrendingUp,
  TrendingDown,
  Users,
  RefreshCw,
  XCircle,
  ArrowRightLeft,
  Snowflake,
  CreditCard,
} from 'lucide-react';

interface ResumenActividadSuscripcionesProps {
  entrenadorId?: string;
  onRefresh?: () => void;
}

export const ResumenActividadSuscripciones: React.FC<ResumenActividadSuscripcionesProps> = ({
  entrenadorId,
  onRefresh,
}) => {
  const [actividad, setActividad] = useState<ActividadSuscripcionesReciente | null>(null);
  const [loading, setLoading] = useState(false);

  // Cargar actividad reciente al montar el componente
  useEffect(() => {
    cargarActividad();
  }, [entrenadorId]);

  const cargarActividad = async () => {
    setLoading(true);
    try {
      const hoy = new Date();
      const hace30Dias = new Date(hoy);
      hace30Dias.setDate(hoy.getDate() - 30);
      
      const data = await getActividadSuscripcionesReciente({
        entrenadorId,
        fechaInicio: hace30Dias.toISOString().split('T')[0],
        fechaFin: hoy.toISOString().split('T')[0],
      });
      setActividad(data);
    } catch (error) {
      console.error('Error cargando actividad:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = () => {
    cargarActividad();
    onRefresh?.();
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="w-6 h-6 animate-spin text-gray-400" />
        </div>
      </Card>
    );
  }

  if (!actividad) {
    return null;
  }

  const { resumen } = actividad;

  return (
    <Card className="p-6 bg-white shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">Resumen de Actividad Reciente</h3>
          <p className="text-sm text-gray-500 mt-1">Últimos 30 días</p>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleRefresh}
          disabled={loading}
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Actualizar
        </Button>
      </div>

      {/* Tarjetas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Nuevas suscripciones últimos 7 días */}
        <div className="p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-lg border border-green-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-green-700">Nuevas (7 días)</p>
            <Users className="w-5 h-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-green-900">{resumen.nuevasSuscripciones7Dias}</p>
          <p className="text-xs text-green-600 mt-1">Total 30 días: {resumen.nuevasSuscripciones30Dias}</p>
        </div>

        {/* Renovaciones realizadas */}
        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-blue-700">Renovaciones</p>
            <RefreshCw className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-blue-900">{resumen.renovacionesRealizadas}</p>
          <p className="text-xs text-blue-600 mt-1">Últimos 30 días</p>
        </div>

        {/* Cancelaciones y churn */}
        <div className="p-4 bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-red-700">Cancelaciones</p>
            <XCircle className="w-5 h-5 text-red-600" />
          </div>
          <p className="text-2xl font-bold text-red-900">{resumen.cancelaciones}</p>
          <p className="text-xs text-red-600 mt-1">Churn: {resumen.churn.toFixed(1)}%</p>
        </div>

        {/* Cambios de plan */}
        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200">
          <div className="flex items-center justify-between mb-2">
            <p className="text-sm font-medium text-purple-700">Cambios de Plan</p>
            <ArrowRightLeft className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-2xl font-bold text-purple-900">{resumen.cambiosPlan}</p>
          <p className="text-xs text-purple-600 mt-1">Upgrades/Downgrades</p>
        </div>
      </div>

      {/* Métricas adicionales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        {/* Congelaciones */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Congelaciones</p>
              <p className="text-xl font-bold text-gray-900">{resumen.congelaciones}</p>
            </div>
            <Snowflake className="w-6 h-6 text-gray-400" />
          </div>
        </div>

        {/* Pagos fallidos */}
        <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pagos Fallidos</p>
              <p className="text-xl font-bold text-gray-900">{resumen.pagosFallidos}</p>
            </div>
            <CreditCard className="w-6 h-6 text-gray-400" />
          </div>
        </div>
      </div>

    </Card>
  );
};

