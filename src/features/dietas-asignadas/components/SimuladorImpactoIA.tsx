import React, { useState, useEffect } from 'react';
import { Card, Button, Modal } from '../../../components/componentsreutilizables';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Calculator, 
  Clock, 
  Euro, 
  Flame,
  ArrowRight,
  CheckCircle2,
  X,
  Loader2,
  AlertCircle
} from 'lucide-react';
import { SimulacionImpactoIA, RecomendacionIA, Dieta } from '../types';
import { simularImpactoRecomendacion } from '../api/simulacionImpacto';

interface SimuladorImpactoIAProps {
  dieta: Dieta;
  recomendacion: RecomendacionIA;
  isOpen: boolean;
  onClose: () => void;
  onAplicar?: (simulacion: SimulacionImpactoIA) => void;
}

export const SimuladorImpactoIA: React.FC<SimuladorImpactoIAProps> = ({
  dieta,
  recomendacion,
  isOpen,
  onClose,
  onAplicar,
}) => {
  const [simulacion, setSimulacion] = useState<SimulacionImpactoIA | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen && recomendacion) {
      cargarSimulacion();
    } else {
      setSimulacion(null);
      setError(null);
    }
  }, [isOpen, recomendacion]);

  const cargarSimulacion = async () => {
    setCargando(true);
    setError(null);
    try {
      const resultado = await simularImpactoRecomendacion(dieta.id, recomendacion);
      setSimulacion(resultado);
    } catch (err) {
      console.error('Error simulando impacto:', err);
      setError('Error al simular el impacto de la recomendación');
    } finally {
      setCargando(false);
    }
  };

  const getIconoTendencia = (tendencia: 'aumento' | 'disminucion' | 'sin-cambio') => {
    switch (tendencia) {
      case 'aumento':
        return <TrendingUp className="w-4 h-4 text-red-600" />;
      case 'disminucion':
        return <TrendingDown className="w-4 h-4 text-green-600" />;
      case 'sin-cambio':
        return <Minus className="w-4 h-4 text-gray-400" />;
    }
  };

  const getColorTendencia = (tendencia: 'aumento' | 'disminucion' | 'sin-cambio', tipo: 'calorias' | 'coste' | 'tiempo') => {
    // Para calorías, aumento puede ser malo o bueno dependiendo del objetivo
    // Para coste y tiempo, aumento generalmente es malo
    if (tendencia === 'sin-cambio') {
      return 'text-gray-600';
    }
    
    if (tipo === 'calorias') {
      // Depende del objetivo de la dieta
      if (dieta.objetivo === 'perdida-peso' || dieta.objetivo === 'perdida-grasa') {
        return tendencia === 'aumento' ? 'text-red-600' : 'text-green-600';
      } else if (dieta.objetivo === 'ganancia-muscular' || dieta.objetivo === 'superavit-calorico') {
        return tendencia === 'aumento' ? 'text-green-600' : 'text-red-600';
      }
      return tendencia === 'aumento' ? 'text-orange-600' : 'text-blue-600';
    }
    
    // Para coste y tiempo, aumento es generalmente negativo
    return tendencia === 'aumento' ? 'text-red-600' : 'text-green-600';
  };

  const formatearValor = (valor: number, tipo: 'calorias' | 'coste' | 'tiempo' | 'macros') => {
    switch (tipo) {
      case 'calorias':
        return `${valor > 0 ? '+' : ''}${valor.toFixed(0)} kcal`;
      case 'coste':
        return `${valor > 0 ? '+' : ''}${valor.toFixed(2)} €`;
      case 'tiempo':
        return `${valor > 0 ? '+' : ''}${valor.toFixed(0)} min`;
      case 'macros':
        return `${valor > 0 ? '+' : ''}${valor.toFixed(1)} g`;
      default:
        return valor.toFixed(2);
    }
  };

  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="large">
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calculator className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Simulación de Impacto</h2>
              <p className="text-sm text-gray-600">{recomendacion.titulo}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Cerrar"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Contenido */}
        {cargando ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="w-8 h-8 text-blue-600 animate-spin mb-3" />
            <p className="text-sm text-gray-600">Calculando impacto de la recomendación...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="w-8 h-8 text-red-600 mb-3" />
            <p className="text-sm text-red-600">{error}</p>
            <Button
              variant="primary"
              size="sm"
              onClick={cargarSimulacion}
              className="mt-4"
            >
              Reintentar
            </Button>
          </div>
        ) : simulacion ? (
          <div className="space-y-6">
            {/* Resumen de la recomendación */}
            <Card className="bg-blue-50 border-blue-200">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Recomendación</h3>
                <p className="text-sm text-gray-700">{recomendacion.descripcion}</p>
                <p className="text-xs text-gray-600 mt-2">{recomendacion.razon}</p>
              </div>
            </Card>

            {/* Comparación Antes/Después */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Estado Antes */}
              <Card className="border-gray-200">
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Estado Actual</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-gray-600">Calorías</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {simulacion.estadoAntes.calorias.toFixed(0)} kcal
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Euro className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">Coste</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {simulacion.estadoAntes.costeTotal.toFixed(2)} €
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-600">Tiempo</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {simulacion.estadoAntes.tiempoPreparacionTotal.toFixed(0)} min
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Macros</div>
                      <div className="text-xs text-gray-700">
                        P: {simulacion.estadoAntes.proteinas.toFixed(1)}g | 
                        C: {simulacion.estadoAntes.carbohidratos.toFixed(1)}g | 
                        G: {simulacion.estadoAntes.grasas.toFixed(1)}g
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Estado Después */}
              <Card className="border-blue-200 bg-blue-50">
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-4">Estado Proyectado</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-sm text-gray-600">Calorías</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {simulacion.estadoDespues.calorias.toFixed(0)} kcal
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Euro className="w-4 h-4 text-green-600" />
                        <span className="text-sm text-gray-600">Coste</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {simulacion.estadoDespues.costeTotal.toFixed(2)} €
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-sm text-gray-600">Tiempo</span>
                      </div>
                      <span className="font-semibold text-gray-900">
                        {simulacion.estadoDespues.tiempoPreparacionTotal.toFixed(0)} min
                      </span>
                    </div>
                    <div className="pt-2 border-t border-gray-200">
                      <div className="text-xs text-gray-500 mb-1">Macros</div>
                      <div className="text-xs text-gray-700">
                        P: {simulacion.estadoDespues.proteinas.toFixed(1)}g | 
                        C: {simulacion.estadoDespues.carbohidratos.toFixed(1)}g | 
                        G: {simulacion.estadoDespues.grasas.toFixed(1)}g
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Variaciones */}
            <Card className="border-purple-200 bg-purple-50">
              <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-4">Variaciones</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Variación Calorías */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Flame className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-gray-700">Calorías</span>
                      </div>
                      {getIconoTendencia(simulacion.variaciones.calorias.tendencia)}
                    </div>
                    <div className={`text-lg font-bold ${getColorTendencia(simulacion.variaciones.calorias.tendencia, 'calorias')}`}>
                      {formatearValor(simulacion.variaciones.calorias.valor, 'calorias')}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {simulacion.variaciones.calorias.porcentaje > 0 ? '+' : ''}
                      {simulacion.variaciones.calorias.porcentaje.toFixed(1)}%
                    </div>
                  </div>

                  {/* Variación Coste */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Euro className="w-4 h-4 text-green-600" />
                        <span className="text-sm font-medium text-gray-700">Coste</span>
                      </div>
                      {getIconoTendencia(simulacion.variaciones.coste.tendencia)}
                    </div>
                    <div className={`text-lg font-bold ${getColorTendencia(simulacion.variaciones.coste.tendencia, 'coste')}`}>
                      {formatearValor(simulacion.variaciones.coste.valor, 'coste')}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {simulacion.variaciones.coste.porcentaje > 0 ? '+' : ''}
                      {simulacion.variaciones.coste.porcentaje.toFixed(1)}%
                    </div>
                  </div>

                  {/* Variación Tiempo */}
                  <div className="bg-white p-3 rounded-lg border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-700">Tiempo</span>
                      </div>
                      {getIconoTendencia(simulacion.variaciones.tiempoPreparacion.tendencia)}
                    </div>
                    <div className={`text-lg font-bold ${getColorTendencia(simulacion.variaciones.tiempoPreparacion.tendencia, 'tiempo')}`}>
                      {formatearValor(simulacion.variaciones.tiempoPreparacion.valor, 'tiempo')}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      {simulacion.variaciones.tiempoPreparacion.porcentaje > 0 ? '+' : ''}
                      {simulacion.variaciones.tiempoPreparacion.porcentaje.toFixed(1)}%
                    </div>
                  </div>
                </div>

                {/* Variaciones de Macros */}
                {simulacion.variaciones.macros && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm font-medium text-gray-700 mb-3">Variaciones de Macros</div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="bg-white p-2 rounded border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Proteínas</div>
                        <div className={`text-sm font-semibold ${getColorTendencia(simulacion.variaciones.macros.proteinas.tendencia, 'macros')}`}>
                          {formatearValor(simulacion.variaciones.macros.proteinas.valor, 'macros')}
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Carbohidratos</div>
                        <div className={`text-sm font-semibold ${getColorTendencia(simulacion.variaciones.macros.carbohidratos.tendencia, 'macros')}`}>
                          {formatearValor(simulacion.variaciones.macros.carbohidratos.valor, 'macros')}
                        </div>
                      </div>
                      <div className="bg-white p-2 rounded border border-gray-200">
                        <div className="text-xs text-gray-500 mb-1">Grasas</div>
                        <div className={`text-sm font-semibold ${getColorTendencia(simulacion.variaciones.macros.grasas.tendencia, 'macros')}`}>
                          {formatearValor(simulacion.variaciones.macros.grasas.valor, 'macros')}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>

            {/* Impacto en Objetivos */}
            {simulacion.impactoObjetivos && (
              <Card className="border-green-200 bg-green-50">
                <div className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-3">Impacto en Objetivos</h3>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm text-gray-600">Cumplimiento de objetivos</div>
                      <div className="text-xs text-gray-500">
                        Objetivo: {simulacion.impactoObjetivos.objetivo.replace('-', ' ')}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        {simulacion.impactoObjetivos.cumplimientoDespues.toFixed(0)}%
                      </div>
                      <div className={`text-sm font-medium ${simulacion.impactoObjetivos.mejora >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {simulacion.impactoObjetivos.mejora >= 0 ? '+' : ''}
                        {simulacion.impactoObjetivos.mejora.toFixed(1)}% vs. actual
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            )}

            {/* Acciones */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200">
              <Button variant="ghost" onClick={onClose}>
                Cancelar
              </Button>
              {onAplicar && (
                <Button
                  variant="primary"
                  onClick={() => onAplicar(simulacion)}
                  leftIcon={<CheckCircle2 className="w-4 h-4" />}
                >
                  Aplicar Recomendación
                </Button>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  );
};

