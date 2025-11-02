import React, { useState, useEffect } from 'react';
import { Card, Badge, Table, TableColumn, Button } from '../../../components/componentsreutilizables';
import { PagoPendiente, ClasificacionRiesgo } from '../types';
import { morosidadAPI } from '../api/morosidad';
import { AlertTriangle, Shield, TrendingUp, DollarSign, Clock, User } from 'lucide-react';

interface ClasificadorRiesgoProps {
  onRefresh?: () => void;
}

export const ClasificadorRiesgo: React.FC<ClasificadorRiesgoProps> = ({ onRefresh }) => {
  const [pagos, setPagos] = useState<PagoPendiente[]>([]);
  const [clasificaciones, setClasificaciones] = useState<ClasificacionRiesgo[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const pagosData = await morosidadAPI.obtenerPagosPendientes();
      setPagos(pagosData);
      
      // Generar clasificaciones de riesgo
      const nuevasClasificaciones = pagosData.map(pago => clasificarRiesgo(pago));
      setClasificaciones(nuevasClasificaciones);
    } catch (error) {
      console.error('Error al cargar datos:', error);
    } finally {
      setLoading(false);
    }
  };

  const clasificarRiesgo = (pago: PagoPendiente): ClasificacionRiesgo => {
    // Factores de riesgo
    const historialPago = pago.recordatoriosEnviados > 0 ? 30 : 70; // Mejor historial = menos recordatorios
    const diasRetraso = Math.min(pago.diasRetraso * 2, 100); // Más días = más riesgo
    const monto = pago.montoPendiente > 500000 ? 70 : pago.montoPendiente > 200000 ? 50 : 30;
    const frecuenciaContacto = pago.recordatoriosEnviados * 10; // Más contactos = más esfuerzo
    const patronPago = 50; // Mock - normalmente se basaría en historial
    
    // Calcular puntuación (0-100, más alto = más riesgo)
    const puntuacion = (
      (historialPago * 0.2) +
      (diasRetraso * 0.3) +
      (monto * 0.2) +
      (frecuenciaContacto * 0.15) +
      (patronPago * 0.15)
    );
    
    // Determinar nivel de riesgo
    let riesgo: 'bajo' | 'medio' | 'alto' | 'critico';
    if (puntuacion < 30) {
      riesgo = 'bajo';
    } else if (puntuacion < 50) {
      riesgo = 'medio';
    } else if (puntuacion < 70) {
      riesgo = 'alto';
    } else {
      riesgo = 'critico';
    }
    
    // Probabilidad de cobro (inversa al riesgo)
    const probabilidadCobro = 100 - puntuacion;
    
    // Recomendaciones
    const recomendaciones: string[] = [];
    if (puntuacion >= 70) {
      recomendaciones.push('Escalar a gestión especial');
      recomendaciones.push('Considerar acción legal');
    } else if (puntuacion >= 50) {
      recomendaciones.push('Contacto directo urgente');
      recomendaciones.push('Negociar plan de pagos');
    } else if (puntuacion >= 30) {
      recomendaciones.push('Enviar recordatorio firme');
      recomendaciones.push('Seguimiento cercano');
    } else {
      recomendaciones.push('Recordatorio estándar');
      recomendaciones.push('Monitoreo regular');
    }
    
    return {
      pagoPendienteId: pago.id,
      riesgo,
      puntuacion: Math.round(puntuacion),
      factores: {
        historialPago: Math.round(historialPago),
        diasRetraso: Math.round(diasRetraso),
        monto: Math.round(monto),
        frecuenciaContacto: Math.round(frecuenciaContacto),
        patronPago: Math.round(patronPago)
      },
      recomendaciones,
      probabilidadCobro: Math.round(probabilidadCobro),
      fechaEvaluacion: new Date()
    };
  };

  const obtenerBadgeRiesgo = (riesgo: string) => {
    const riesgos: Record<string, { label: string; variant: 'gray' | 'blue' | 'green' | 'yellow' | 'red' }> = {
      bajo: { label: 'Bajo', variant: 'green' },
      medio: { label: 'Medio', variant: 'yellow' },
      alto: { label: 'Alto', variant: 'yellow' },
      critico: { label: 'Crítico', variant: 'red' }
    };
    
    const riesgoInfo = riesgos[riesgo] || riesgos.bajo;
    return (
      <Badge variant={riesgoInfo.variant} size="sm">
        {riesgoInfo.label}
      </Badge>
    );
  };

  const obtenerColorProbabilidad = (probabilidad: number) => {
    if (probabilidad >= 70) return 'text-green-600';
    if (probabilidad >= 50) return 'text-yellow-600';
    if (probabilidad >= 30) return 'text-orange-600';
    return 'text-red-600';
  };

  const datosConRiesgo = clasificaciones.map(clas => {
    const pago = pagos.find(p => p.id === clas.pagoPendienteId);
    return { ...clas, pago };
  }).filter(item => item.pago);

  const columnas: TableColumn<any>[] = [
    {
      key: 'numeroFactura',
      label: 'Factura',
      render: (_, row) => row.pago.numeroFactura
    },
    {
      key: 'cliente',
      label: 'Cliente',
      render: (_, row) => row.pago.cliente.nombre
    },
    {
      key: 'diasRetraso',
      label: 'Días Retraso',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-gray-400" />
          <span>{row.pago.diasRetraso}</span>
        </div>
      )
    },
    {
      key: 'monto',
      label: 'Monto',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span>{row.pago.montoPendiente.toLocaleString('es-CO')} COP</span>
        </div>
      ),
      align: 'right'
    },
    {
      key: 'riesgo',
      label: 'Riesgo',
      render: (_, row) => obtenerBadgeRiesgo(row.riesgo)
    },
    {
      key: 'puntuacion',
      label: 'Puntuación',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <div className="w-16 bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                row.puntuacion >= 70 ? 'bg-red-600' :
                row.puntuacion >= 50 ? 'bg-orange-600' :
                row.puntuacion >= 30 ? 'bg-yellow-600' : 'bg-green-600'
              }`}
              style={{ width: `${row.puntuacion}%` }}
            />
          </div>
          <span className="text-sm font-medium">{row.puntuacion}/100</span>
        </div>
      )
    },
    {
      key: 'probabilidadCobro',
      label: 'Probabilidad Cobro',
      render: (_, row) => (
        <div className={`flex items-center gap-2 ${obtenerColorProbabilidad(row.probabilidadCobro)}`}>
          <TrendingUp className="w-4 h-4" />
          <span className="font-medium">{row.probabilidadCobro}%</span>
        </div>
      )
    },
    {
      key: 'recomendaciones',
      label: 'Recomendaciones',
      render: (_, row) => (
        <div className="max-w-md">
          <ul className="list-disc list-inside text-sm text-gray-600">
            {row.recomendaciones.slice(0, 2).map((rec: string, idx: number) => (
              <li key={idx}>{rec}</li>
            ))}
          </ul>
        </div>
      )
    }
  ];

  const resumenRiesgo = {
    bajo: datosConRiesgo.filter(d => d.riesgo === 'bajo').length,
    medio: datosConRiesgo.filter(d => d.riesgo === 'medio').length,
    alto: datosConRiesgo.filter(d => d.riesgo === 'alto').length,
    critico: datosConRiesgo.filter(d => d.riesgo === 'critico').length
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-900 mb-2">
          Clasificación de Riesgo
        </h2>
        <p className="text-gray-600">
          Evaluación automática de riesgo para cada pago pendiente
        </p>
      </div>

      {/* Resumen de riesgos */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-green-600" />
              <span className="font-medium text-gray-900">Riesgo Bajo</span>
            </div>
            <div className="text-3xl font-bold text-green-600">{resumenRiesgo.bajo}</div>
          </div>
        </Card>
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Shield className="w-5 h-5 text-yellow-600" />
              <span className="font-medium text-gray-900">Riesgo Medio</span>
            </div>
            <div className="text-3xl font-bold text-yellow-600">{resumenRiesgo.medio}</div>
          </div>
        </Card>
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
              <span className="font-medium text-gray-900">Riesgo Alto</span>
            </div>
            <div className="text-3xl font-bold text-orange-600">{resumenRiesgo.alto}</div>
          </div>
        </Card>
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <span className="font-medium text-gray-900">Riesgo Crítico</span>
            </div>
            <div className="text-3xl font-bold text-red-600">{resumenRiesgo.critico}</div>
          </div>
        </Card>
      </div>

      <Table
        data={datosConRiesgo}
        columns={columnas}
        loading={loading}
        emptyMessage="No hay datos de clasificación disponibles"
      />
    </div>
  );
};

