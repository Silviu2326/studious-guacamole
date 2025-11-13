import React, { useState, useEffect } from 'react';
import { Card, MetricCards, Button, Modal, Input } from '../../../components/componentsreutilizables';
import { Flame, Target, Droplet, Wheat, TrendingUp, Activity, Moon, AlertCircle, Edit2, Save, X } from 'lucide-react';
import { Dieta, PreferenciasMetricas, ComparacionPlanAnterior, DatosExternosCliente, TipoMetrica, NotasMetricas } from '../types';
import { getPreferenciasMetricas } from '../utils/preferenciasMetricas';
import { MetricCardData } from '../../../components/componentsreutilizables';
import { compararConPlanAnterior, getDatosExternosCliente, getNotasMetricas, actualizarNotaMetrica } from '../api';

interface MetricasDietaProps {
  dieta: Dieta;
  preferencias?: PreferenciasMetricas;
}

export const MetricasDieta: React.FC<MetricasDietaProps> = ({ 
  dieta, 
  preferencias 
}) => {
  const [comparacion, setComparacion] = useState<ComparacionPlanAnterior | null>(null);
  const [datosExternos, setDatosExternos] = useState<DatosExternosCliente | null>(null);
  const [cargando, setCargando] = useState(true);
  const [notasMetricas, setNotasMetricas] = useState<NotasMetricas | null>(null);
  const [editandoNota, setEditandoNota] = useState<TipoMetrica | null>(null);
  const [notaTemporal, setNotaTemporal] = useState<string>('');

  // Obtener preferencias (cliente específico o por defecto)
  const prefs = preferencias || getPreferenciasMetricas(dieta.clienteId);

  useEffect(() => {
    const cargarDatos = async () => {
      setCargando(true);
      try {
        // Cargar comparación con plan anterior, datos externos y notas en paralelo
        const [comparacionData, datosExternosData, notasData] = await Promise.all([
          compararConPlanAnterior(dieta),
          getDatosExternosCliente(dieta.clienteId),
          getNotasMetricas(dieta.id),
        ]);
        setComparacion(comparacionData);
        setDatosExternos(datosExternosData);
        setNotasMetricas(notasData);
      } catch (error) {
        console.error('Error cargando datos:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarDatos();
  }, [dieta]);

  // Función para obtener dirección de tendencia basada en desviación y objetivo
  const obtenerDireccionTendencia = (desviacion: number, tipo: 'calorias' | 'proteinas' | 'carbohidratos' | 'grasas'): 'up' | 'down' | 'neutral' => {
    if (Math.abs(desviacion) < 1) return 'neutral';
    
    // Para pérdida de peso/grasa: menos calorías es mejor, así que desviación negativa es positiva (up)
    if ((dieta.objetivo === 'perdida-peso' || dieta.objetivo === 'perdida-grasa') && tipo === 'calorias') {
      return desviacion < 0 ? 'up' : 'down';
    }
    
    // Para ganancia muscular: más calorías y proteínas es mejor (up es positivo)
    if ((dieta.objetivo === 'ganancia-muscular' || dieta.objetivo === 'superavit-calorico') && (tipo === 'calorias' || tipo === 'proteinas')) {
      return desviacion > 0 ? 'up' : 'down';
    }
    
    // Por defecto: cambios positivos son up
    return desviacion > 0 ? 'up' : 'down';
  };

  // Calcular métricas
  const calcularMetricas = (): MetricCardData[] => {
    const metricas: MetricCardData[] = [];
    
    // Filtrar y ordenar métricas según preferencias
    const metricasVisibles = prefs.metricas
      .filter(m => m.visible)
      .sort((a, b) => a.orden - b.orden);
    
    metricasVisibles.forEach(config => {
      switch (config.id) {
        case 'kcal':
          const desviacionKcal = comparacion?.desviacion.calorias || 0;
          const direccionKcal = obtenerDireccionTendencia(desviacionKcal, 'calorias');
          metricas.push({
            id: 'kcal',
            title: 'Kcal Objetivo',
            value: `${dieta.macros.calorias}`,
            subtitle: comparacion?.dietaAnterior 
              ? `vs. plan anterior: ${comparacion.dietaAnterior.macros.calorias} kcal`
              : 'Calorías diarias',
            icon: <Flame className="w-6 h-6" />,
            color: 'primary',
            trend: comparacion?.dietaAnterior ? {
              value: Math.abs(desviacionKcal),
              direction: direccionKcal,
              label: `vs. anterior`,
            } : undefined,
          });
          break;
          
        case 'macronutrientes':
          // Para macronutrientes, mostrar la desviación promedio
          const desviacionPromedio = comparacion ? 
            (Math.abs(comparacion.desviacion.proteinas) + 
             Math.abs(comparacion.desviacion.carbohidratos) + 
             Math.abs(comparacion.desviacion.grasas)) / 3 : 0;
          const direccionMacros = comparacion?.tendencia === 'mejora' ? 'up' : 
                                  comparacion?.tendencia === 'empeora' ? 'down' : 'neutral';
          metricas.push({
            id: 'macronutrientes',
            title: 'Macronutrientes',
            value: `P: ${dieta.macros.proteinas}g | C: ${dieta.macros.carbohidratos}g | G: ${dieta.macros.grasas}g`,
            subtitle: comparacion?.dietaAnterior 
              ? `P: ${comparacion.desviacion.proteinas.toFixed(1)}% | C: ${comparacion.desviacion.carbohidratos.toFixed(1)}% | G: ${comparacion.desviacion.grasas.toFixed(1)}%`
              : 'Proteínas | Carbohidratos | Grasas',
            icon: <Target className="w-6 h-6" />,
            color: 'info',
            trend: comparacion?.dietaAnterior ? {
              value: desviacionPromedio,
              direction: direccionMacros,
              label: `tendencia: ${comparacion.tendencia}`,
            } : undefined,
          });
          break;
          
        case 'ratio-proteina':
          if (dieta.pesoCliente && dieta.pesoCliente > 0) {
            const ratioProteina = (dieta.macros.proteinas / dieta.pesoCliente).toFixed(2);
            const desviacionProteina = comparacion?.desviacion.proteinas || 0;
            const direccionProteina = obtenerDireccionTendencia(desviacionProteina, 'proteinas');
            metricas.push({
              id: 'ratio-proteina',
              title: 'Ratio Proteína/kg',
              value: `${ratioProteina} g/kg`,
              subtitle: comparacion?.dietaAnterior 
                ? `Desviación: ${desviacionProteina.toFixed(1)}% vs. anterior`
                : `${dieta.macros.proteinas}g proteína / ${dieta.pesoCliente}kg`,
              icon: <TrendingUp className="w-6 h-6" />,
              color: 'success',
              trend: comparacion?.dietaAnterior ? {
                value: Math.abs(desviacionProteina),
                direction: direccionProteina,
                label: `vs. anterior`,
              } : undefined,
            });
          } else {
            // Mostrar solo proteínas si no hay peso del cliente
            const desviacionProteina = comparacion?.desviacion.proteinas || 0;
            const direccionProteina = obtenerDireccionTendencia(desviacionProteina, 'proteinas');
            metricas.push({
              id: 'ratio-proteina',
              title: 'Proteínas',
              value: `${dieta.macros.proteinas}g`,
              subtitle: comparacion?.dietaAnterior 
                ? `Desviación: ${desviacionProteina.toFixed(1)}% vs. anterior`
                : 'Peso del cliente no disponible',
              icon: <TrendingUp className="w-6 h-6" />,
              color: 'success',
              trend: comparacion?.dietaAnterior ? {
                value: Math.abs(desviacionProteina),
                direction: direccionProteina,
                label: `vs. anterior`,
              } : undefined,
            });
          }
          break;
          
        case 'vasos-agua':
          const vasosAgua = dieta.vasosAgua || 8; // Valor por defecto: 8 vasos
          metricas.push({
            id: 'vasos-agua',
            title: 'Vasos de Agua',
            value: `${vasosAgua}`,
            subtitle: 'Vasos diarios recomendados',
            icon: <Droplet className="w-6 h-6" />,
            color: 'info',
          });
          break;
          
        case 'fibra':
          const fibra = dieta.fibra || calcularFibraEstimada(dieta.macros); // Calcular si no está definida
          metricas.push({
            id: 'fibra',
            title: 'Fibra',
            value: `${fibra}g`,
            subtitle: 'Gramos de fibra diarios',
            icon: <Wheat className="w-6 h-6" />,
            color: 'warning',
          });
          break;
      }
    });

    // Agregar métricas de datos externos si están disponibles
    if (datosExternos) {
      // Actividad
      if (datosExternos.actividad) {
        metricas.push({
          id: 'actividad',
          title: 'Actividad Diaria',
          value: `${datosExternos.actividad.pasos.toLocaleString()} pasos`,
          subtitle: `${(datosExternos.actividad.distancia / 1000).toFixed(1)} km | ${datosExternos.actividad.caloriasQuemadas} kcal`,
          icon: <Activity className="w-6 h-6" />,
          color: 'success',
        });
      }

      // Sueño
      if (datosExternos.sueño) {
        const calidadLabels = {
          'excellent': 'Excelente',
          'good': 'Buena',
          'fair': 'Regular',
          'poor': 'Mala',
        };
        metricas.push({
          id: 'sueño',
          title: 'Sueño',
          value: `${datosExternos.sueño.horasSueño.toFixed(1)}h`,
          subtitle: `Calidad: ${calidadLabels[datosExternos.sueño.calidad]}`,
          icon: <Moon className="w-6 h-6" />,
          color: datosExternos.sueño.calidad === 'excellent' || datosExternos.sueño.calidad === 'good' ? 'info' : 'warning',
        });
      }

      // Estrés
      if (datosExternos.estres) {
        const nivelEstres = datosExternos.estres.nivel;
        const colorEstres = nivelEstres < 30 ? 'success' : nivelEstres < 60 ? 'warning' : 'error';
        metricas.push({
          id: 'estres',
          title: 'Nivel de Estrés',
          value: `${nivelEstres}/100`,
          subtitle: datosExternos.estres.fuente || 'Nivel actual',
          icon: <AlertCircle className="w-6 h-6" />,
          color: colorEstres,
        });
      }
    }
    
    return metricas;
  };
  
  // Calcular fibra estimada basada en macronutrientes (aproximación)
  const calcularFibraEstimada = (macros: typeof dieta.macros): number => {
    // Estimación: aproximadamente 10-15g de fibra por cada 1000kcal
    // O más conservador: 14g por cada 1000kcal
    return Math.round((macros.calorias / 1000) * 14);
  };

  // Funciones para manejar notas
  const handleEditarNota = (metricaId: TipoMetrica) => {
    const notaActual = notasMetricas?.notas[metricaId] || '';
    setNotaTemporal(notaActual);
    setEditandoNota(metricaId);
  };

  const handleGuardarNota = async (metricaId: TipoMetrica) => {
    try {
      await actualizarNotaMetrica(dieta.id, metricaId, notaTemporal.trim() || undefined);
      const notasActualizadas = await getNotasMetricas(dieta.id);
      if (notasActualizadas) {
        setNotasMetricas(notasActualizadas);
      }
      setEditandoNota(null);
      setNotaTemporal('');
    } catch (error) {
      console.error('Error guardando nota:', error);
    }
  };

  const handleCancelarEdicion = () => {
    setEditandoNota(null);
    setNotaTemporal('');
  };

  const obtenerNota = (metricaId: TipoMetrica): string | undefined => {
    return notasMetricas?.notas[metricaId];
  };
  
  const metricas = calcularMetricas();
  
  if (cargando) {
    return (
      <Card className="p-6 bg-white shadow-sm">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando métricas...</p>
        </div>
      </Card>
    );
  }

  if (metricas.length === 0) {
    return (
      <Card className="p-6 bg-white shadow-sm">
        <div className="text-center py-8">
          <p className="text-gray-600">
            No hay métricas configuradas para mostrar. Configura las métricas en las preferencias.
          </p>
        </div>
      </Card>
    );
  }
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">
          Métricas Clave de la Dieta
        </h3>
        {comparacion?.dietaAnterior && (
          <span className="text-sm text-gray-600">
            Comparado con plan anterior
          </span>
        )}
      </div>
      <MetricCards data={metricas} columns={metricas.length <= 3 ? metricas.length : 4} />
      
      {/* Notas de métricas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {metricas.map((metrica) => {
          const nota = obtenerNota(metrica.id as TipoMetrica);
          const estaEditando = editandoNota === metrica.id;
          
          return (
            <Card key={metrica.id} className="p-4 bg-white shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <h4 className="text-sm font-semibold text-gray-900">{metrica.title}</h4>
                {!estaEditando && (
                  <button
                    onClick={() => handleEditarNota(metrica.id as TipoMetrica)}
                    className="p-1 hover:bg-gray-100 rounded transition-colors"
                    title="Editar nota"
                  >
                    <Edit2 className="w-4 h-4 text-gray-500" />
                  </button>
                )}
              </div>
              
              {estaEditando ? (
                <div className="space-y-2">
                  <Input
                    value={notaTemporal}
                    onChange={(e) => setNotaTemporal(e.target.value)}
                    placeholder="Ej: subir a 2000 ml de agua"
                    className="text-sm"
                  />
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => handleGuardarNota(metrica.id as TipoMetrica)}
                      className="flex items-center gap-1"
                    >
                      <Save className="w-3 h-3" />
                      Guardar
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={handleCancelarEdicion}
                      className="flex items-center gap-1"
                    >
                      <X className="w-3 h-3" />
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="min-h-[2rem]">
                  {nota ? (
                    <p className="text-sm text-gray-700 italic">{nota}</p>
                  ) : (
                    <p className="text-xs text-gray-400 italic">Sin nota. Haz clic en el icono para añadir una.</p>
                  )}
                </div>
              )}
            </Card>
          );
        })}
      </div>
    </div>
  );
};
