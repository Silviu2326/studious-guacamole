import React, { useState } from 'react';
import { Card } from '../../../components/componentsreutilizables';
import { Button } from '../../../components/componentsreutilizables';
import { Badge } from '../../../components/componentsreutilizables';
import {
  Sparkles,
  Lightbulb,
  Target,
  TrendingUp,
  CheckCircle2,
  X,
  RefreshCw,
  Zap,
} from 'lucide-react';
import type { RecomendacionProgreso } from '../types';

export const OptimizadorProgreso: React.FC = () => {
  const [optimizacionesAplicadas, setOptimizacionesAplicadas] = useState<string[]>([]);

  // Datos de ejemplo
  const optimizacionesEjemplo: RecomendacionProgreso[] = [
    {
      id: '1',
      progresoId: 'p1',
      tipo: 'aumentar_carga',
      titulo: 'Aumentar carga progresiva en Press Banca',
      descripcion:
        'Basado en el análisis de los últimos 30 días, el cliente ha mostrado adaptación constante. Recomendamos aumentar la carga en 5kg manteniendo las repeticiones actuales.',
      prioridad: 'alta',
      fecha: '2025-01-15',
      aplicada: false,
    },
    {
      id: '2',
      progresoId: 'p1',
      tipo: 'modificar_repeticiones',
      titulo: 'Optimizar rango de repeticiones',
      descripcion:
        'Variar el rango de repeticiones entre 6-8 y 10-12 puede mejorar la adaptación y evitar estancamientos.',
      prioridad: 'media',
      fecha: '2025-01-15',
      aplicada: false,
    },
    {
      id: '3',
      progresoId: 'p1',
      tipo: 'enfocar_flexibilidad',
      titulo: 'Enfatizar trabajo de flexibilidad',
      descripcion:
        'Se detectó limitación en el rango de movimiento. Incorporar estiramientos activos después de cada sesión.',
      prioridad: 'media',
      fecha: '2025-01-14',
      aplicada: false,
    },
  ];

  const getTipoIcon = (tipo: RecomendacionProgreso['tipo']) => {
    switch (tipo) {
      case 'aumentar_carga':
        return <TrendingUp size={20} className="text-blue-600" />;
      case 'cambiar_ejercicio':
        return <RefreshCw size={20} className="text-green-600" />;
      case 'modificar_repeticiones':
        return <Target size={20} className="text-purple-600" />;
      case 'enfocar_flexibilidad':
        return <Zap size={20} className="text-orange-600" />;
      case 'periodo_descanso':
        return <CheckCircle2 size={20} className="text-gray-600" />;
    }
  };

  const getTipoLabel = (tipo: RecomendacionProgreso['tipo']) => {
    switch (tipo) {
      case 'aumentar_carga':
        return 'Aumentar Carga';
      case 'cambiar_ejercicio':
        return 'Cambiar Ejercicio';
      case 'modificar_repeticiones':
        return 'Modificar Repeticiones';
      case 'enfocar_flexibilidad':
        return 'Enfocar Flexibilidad';
      case 'periodo_descanso':
        return 'Periodo de Descanso';
    }
  };

  const getPrioridadColor = (prioridad: RecomendacionProgreso['prioridad']) => {
    switch (prioridad) {
      case 'alta':
        return 'red';
      case 'media':
        return 'yellow';
      case 'baja':
        return 'gray';
    }
  };

  const handleAplicar = (id: string) => {
    setOptimizacionesAplicadas([...optimizacionesAplicadas, id]);
  };

  const optimizacionesNoAplicadas = optimizacionesEjemplo.filter(
    (opt) => !optimizacionesAplicadas.includes(opt.id)
  );

  return (
    <div className="space-y-6">
      {/* Toolbar Superior */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Sparkles size={24} className="text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Optimizador de Progreso</h2>
            <p className="text-sm text-gray-600">
              Recomendaciones inteligentes basadas en IA
            </p>
          </div>
        </div>
        <Button variant="secondary" onClick={() => {}} leftIcon={<RefreshCw size={20} />}>
          Regenerar Optimizaciones
        </Button>
      </div>

      {/* Resumen */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Lightbulb size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Optimizaciones</h3>
                <p className="text-2xl font-bold text-blue-600">
                  {optimizacionesEjemplo.length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle2 size={20} className="text-green-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Aplicadas</h3>
                <p className="text-2xl font-bold text-green-600">
                  {optimizacionesAplicadas.length}
                </p>
              </div>
            </div>
          </div>
        </Card>

        <Card className="bg-white shadow-sm">
          <div className="p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Target size={20} className="text-yellow-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Pendientes</h3>
                <p className="text-2xl font-bold text-yellow-600">
                  {optimizacionesNoAplicadas.length}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Lista de Optimizaciones */}
      <div className="space-y-4">
        {optimizacionesEjemplo.map((optimizacion) => {
          const aplicada = optimizacionesAplicadas.includes(optimizacion.id);
          return (
            <Card
              key={optimizacion.id}
              variant="hover"
              className={`transition-shadow ${
                aplicada ? 'bg-green-50/50 ring-1 ring-green-200' : ''
              }`}
            >
              <div className="p-4">
                <div className="flex items-start gap-4">
                  <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                    {getTipoIcon(optimizacion.tipo)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {optimizacion.titulo}
                          </h3>
                          <Badge variant={getPrioridadColor(optimizacion.prioridad) as any}>
                            {optimizacion.prioridad}
                          </Badge>
                          <Badge variant="gray">{getTipoLabel(optimizacion.tipo)}</Badge>
                          {aplicada && (
                            <Badge variant="green" leftIcon={<CheckCircle2 size={12} />}>
                              Aplicada
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 mt-2 mb-3">
                          {optimizacion.descripcion}
                        </p>
                      </div>
                    </div>

                    {!aplicada && (
                      <div className="flex gap-2">
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => handleAplicar(optimizacion.id)}
                        >
                          Aplicar Optimización
                        </Button>
                        <Button variant="ghost" size="sm" onClick={() => {}}>
                          <X size={16} />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Estado vacío */}
      {optimizacionesEjemplo.length === 0 && (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Sparkles size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            No hay optimizaciones disponibles
          </h3>
          <p className="text-gray-600 mb-4">
            Genera nuevas optimizaciones basadas en los datos actuales
          </p>
          <Button onClick={() => {}} leftIcon={<RefreshCw size={20} />}>
            Generar Optimizaciones
          </Button>
        </Card>
      )}
    </div>
  );
};

