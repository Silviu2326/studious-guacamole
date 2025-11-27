/**
 * Reporte Mensual Simple - KPIs Principales de Morosidad
 * 
 * Componente compacto que muestra un resumen ejecutivo de morosidad mensual
 * con los KPIs principales: total de morosidad, número de clientes, tasa de recuperación,
 * comparativa con mes anterior y comentario ejecutivo.
 * 
 * Este componente está diseñado para ser reutilizado en:
 * - Dashboard general de la aplicación
 * - Sección de reportes de morosidad
 * - Paneles ejecutivos
 * 
 * @component
 * @example
 * ```tsx
 * <ReporteMensualSimple onRefresh={() => console.log('Refreshed')} />
 * ```
 */

import React, { useState, useEffect } from 'react';
import { Card, Badge, Select } from '../../../components/componentsreutilizables';
import type { ReporteMensualMorosidadSimple, ComparativaMesAnterior } from '../types';
import { reportesMensualesAPI } from '../api/reportesMensuales';
import { 
  Calendar, 
  DollarSign, 
  Users, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Target,
  FileText,
  Loader2
} from 'lucide-react';

interface ReporteMensualSimpleProps {
  onRefresh?: () => void;
}

export const ReporteMensualSimple: React.FC<ReporteMensualSimpleProps> = ({ onRefresh }) => {
  const [reporte, setReporte] = useState<ReporteMensualMorosidadSimple | null>(null);
  const [loading, setLoading] = useState(false);
  const [mes, setMes] = useState(new Date().getMonth() + 1);
  const [año, setAño] = useState(new Date().getFullYear());

  useEffect(() => {
    cargarReporte();
  }, [mes, año]);

  const cargarReporte = async () => {
    setLoading(true);
    try {
      const reporteData = await reportesMensualesAPI.getReporteMensualMorosidadSimple(mes, año);
      setReporte(reporteData);
      if (onRefresh) {
        onRefresh();
      }
    } catch (error) {
      console.error('Error al cargar reporte mensual de morosidad:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatearMoneda = (valor: number) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(valor);
  };

  const obtenerNombreMes = (mesNum: number) => {
    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return meses[mesNum - 1];
  };

  const formatearPorcentaje = (valor: number) => {
    return `${(valor * 100).toFixed(1)}%`;
  };

  const obtenerIconoComparativa = (comparativa: ComparativaMesAnterior) => {
    switch (comparativa) {
      case 'sube':
        return <TrendingUp className="w-5 h-5 text-red-600" />;
      case 'baja':
        return <TrendingDown className="w-5 h-5 text-green-600" />;
      case 'igual':
        return <Minus className="w-5 h-5 text-gray-600" />;
      default:
        return <Minus className="w-5 h-5 text-gray-600" />;
    }
  };

  const obtenerTextoComparativa = (comparativa: ComparativaMesAnterior) => {
    switch (comparativa) {
      case 'sube':
        return 'Aumentó';
      case 'baja':
        return 'Disminuyó';
      case 'igual':
        return 'Se mantiene';
      default:
        return 'Sin comparación';
    }
  };

  const obtenerColorComparativa = (comparativa: ComparativaMesAnterior) => {
    switch (comparativa) {
      case 'sube':
        return 'red';
      case 'baja':
        return 'green';
      case 'igual':
        return 'blue';
      default:
        return 'blue';
    }
  };

  // Generar opciones de años (últimos 2 años y próximos 2 años)
  const añosDisponibles = [];
  const añoActual = new Date().getFullYear();
  for (let i = añoActual - 2; i <= añoActual + 2; i++) {
    añosDisponibles.push({ value: i.toString(), label: i.toString() });
  }

  // Generar opciones de meses
  const mesesDisponibles = [
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' }
  ];

  return (
    <div className="space-y-4">
      {/* Header con selector de período */}
      <Card className="bg-white shadow-sm">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Reporte Mensual de Morosidad
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                KPIs principales y análisis ejecutivo
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-gray-400" />
              <span className="text-sm font-medium text-gray-700">Período:</span>
            </div>
            <div className="w-40">
              <Select
                value={mes.toString()}
                onChange={(e) => setMes(parseInt(e.target.value))}
                options={mesesDisponibles}
              />
            </div>
            <div className="w-32">
              <Select
                value={año.toString()}
                onChange={(e) => setAño(parseInt(e.target.value))}
                options={añosDisponibles}
              />
            </div>
          </div>
        </div>
      </Card>

      {loading ? (
        <Card className="bg-white shadow-sm">
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400 mr-2" />
            <span className="text-gray-500">Cargando reporte...</span>
          </div>
        </Card>
      ) : reporte ? (
        <>
          {/* KPIs Principales */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Total de Morosidad */}
            <Card className="bg-white shadow-sm border-l-4 border-l-red-500">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <DollarSign className="w-5 h-5 text-red-600" />
                  </div>
                  {obtenerIconoComparativa(reporte.comparativaMesAnterior)}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total de Morosidad</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatearMoneda(reporte.totalMorosidad)}
                  </p>
                  <div className="mt-2">
                    <Badge variant={obtenerColorComparativa(reporte.comparativaMesAnterior) as any} size="sm">
                      {obtenerTextoComparativa(reporte.comparativaMesAnterior)} vs mes anterior
                    </Badge>
                  </div>
                </div>
              </div>
            </Card>

            {/* Número de Clientes */}
            <Card className="bg-white shadow-sm border-l-4 border-l-blue-500">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <Users className="w-5 h-5 text-blue-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Clientes en Morosidad</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {reporte.numeroClientes}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Clientes afectados
                  </p>
                </div>
              </div>
            </Card>

            {/* Tasa de Recuperación */}
            <Card className="bg-white shadow-sm border-l-4 border-l-green-500">
              <div className="p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Target className="w-5 h-5 text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Tasa de Recuperación</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatearPorcentaje(reporte.tasaRecuperacion)}
                  </p>
                  <p className="text-xs text-gray-500 mt-2">
                    Efectividad de cobro
                  </p>
                </div>
              </div>
            </Card>
          </div>

          {/* Comentario Ejecutivo */}
          {reporte.comentarioEjecutivo && (
            <Card className="bg-white shadow-sm">
              <div className="p-5">
                <div className="flex items-center gap-3 mb-3">
                  <FileText className="w-5 h-5 text-gray-600" />
                  <h4 className="text-sm font-semibold text-gray-900">
                    Análisis Ejecutivo - {obtenerNombreMes(mes)} {año}
                  </h4>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {reporte.comentarioEjecutivo}
                </p>
              </div>
            </Card>
          )}
        </>
      ) : (
        <Card className="bg-white shadow-sm">
          <div className="text-center py-12 text-gray-500">
            No se pudo cargar el reporte
          </div>
        </Card>
      )}
    </div>
  );
};

