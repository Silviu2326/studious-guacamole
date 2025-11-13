import React, { useState, useEffect } from 'react';
import { Card, Button, Badge } from '../../../components/componentsreutilizables';
import { Dieta, Comida, TipoComida, MacrosNutricionales } from '../types';
import { getDietaAnterior, getHistorialCambios } from '../api';
import { HistorialCambioDieta } from '../types';
import { 
  Eye, 
  EyeOff, 
  ChevronDown, 
  ChevronUp, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  Calendar,
  Target,
  History,
  X
} from 'lucide-react';

export type TipoComparacion = 'anterior' | 'objetivo' | 'historica' | null;

interface GhostModeComparisonProps {
  dietaActual: Dieta;
  onComparacionChange?: (tipo: TipoComparacion, dietaComparacion: Dieta | null) => void;
}

const diasSemana = [
  { id: 'lunes', label: 'L', nombre: 'Lunes' },
  { id: 'martes', label: 'M', nombre: 'Martes' },
  { id: 'miercoles', label: 'X', nombre: 'Miércoles' },
  { id: 'jueves', label: 'J', nombre: 'Jueves' },
  { id: 'viernes', label: 'V', nombre: 'Viernes' },
  { id: 'sabado', label: 'S', nombre: 'Sábado' },
  { id: 'domingo', label: 'D', nombre: 'Domingo' },
] as const;

const bloquesComida = [
  { id: 'desayuno', nombre: 'Desayuno' },
  { id: 'media-manana', nombre: 'Snack mañana' },
  { id: 'almuerzo', nombre: 'Comida' },
  { id: 'merienda', nombre: 'Snack tarde' },
  { id: 'cena', nombre: 'Cena' },
  { id: 'post-entreno', nombre: 'Extra opcional' },
] as const;

export const GhostModeComparison: React.FC<GhostModeComparisonProps> = ({
  dietaActual,
  onComparacionChange,
}) => {
  const [tipoComparacion, setTipoComparacion] = useState<TipoComparacion>(null);
  const [dietaComparacion, setDietaComparacion] = useState<Dieta | null>(null);
  const [historialVersiones, setHistorialVersiones] = useState<HistorialCambioDieta[]>([]);
  const [versionSeleccionada, setVersionSeleccionada] = useState<string | null>(null);
  const [mostrarSelector, setMostrarSelector] = useState(false);
  const [cargando, setCargando] = useState(false);

  useEffect(() => {
    if (tipoComparacion === 'historica') {
      cargarHistorialVersiones();
    }
  }, [tipoComparacion, dietaActual.id]);

  const cargarHistorialVersiones = async () => {
    setCargando(true);
    try {
      const historial = await getHistorialCambios(dietaActual.id);
      setHistorialVersiones(historial.filter(h => h.snapshot));
    } catch (error) {
      console.error('Error cargando historial:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleTipoComparacion = async (tipo: TipoComparacion) => {
    setTipoComparacion(tipo);
    setMostrarSelector(false);
    setCargando(true);

    try {
      let dieta: Dieta | null = null;

      if (tipo === 'anterior') {
        dieta = await getDietaAnterior(dietaActual.clienteId, dietaActual.fechaInicio);
      } else if (tipo === 'objetivo') {
        // Crear una dieta "objetivo" basada en los macros objetivo
        dieta = {
          ...dietaActual,
          id: `${dietaActual.id}-objetivo`,
          nombre: `${dietaActual.nombre} - Objetivo`,
          comidas: [], // Se calcularán basándose en los macros objetivo
        };
      } else if (tipo === 'historica' && versionSeleccionada) {
        const version = historialVersiones.find(v => v.id === versionSeleccionada);
        dieta = version?.snapshot || null;
      }

      setDietaComparacion(dieta);
      onComparacionChange?.(tipo, dieta);
    } catch (error) {
      console.error('Error cargando comparación:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleVersionHistorica = async (versionId: string) => {
    setVersionSeleccionada(versionId);
    const version = historialVersiones.find(v => v.id === versionId);
    if (version?.snapshot) {
      setDietaComparacion(version.snapshot);
      onComparacionChange?.('historica', version.snapshot);
    }
  };

  const calcularMacrosDia = (comidas: Comida[]): MacrosNutricionales => {
    return comidas.reduce(
      (acc, comida) => ({
        calorias: acc.calorias + comida.calorias,
        proteinas: acc.proteinas + comida.proteinas,
        carbohidratos: acc.carbohidratos + comida.carbohidratos,
        grasas: acc.grasas + comida.grasas,
      }),
      { calorias: 0, proteinas: 0, carbohidratos: 0, grasas: 0 }
    );
  };

  const calcularDiferencia = (actual: number, comparacion: number): { valor: number; porcentaje: number } => {
    const diferencia = actual - comparacion;
    const porcentaje = comparacion > 0 ? (diferencia / comparacion) * 100 : 0;
    return { valor: diferencia, porcentaje };
  };

  const getIconoTendencia = (diferencia: number) => {
    if (Math.abs(diferencia) < 1) return <Minus className="w-3 h-3" />;
    return diferencia > 0 ? (
      <TrendingUp className="w-3 h-3 text-red-500" />
    ) : (
      <TrendingDown className="w-3 h-3 text-green-500" />
    );
  };

  const getColorDiferencia = (diferencia: number) => {
    if (Math.abs(diferencia) < 1) return 'text-slate-500';
    return diferencia > 0 ? 'text-red-600' : 'text-green-600';
  };

  if (!tipoComparacion || !dietaComparacion) {
    return (
      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          onClick={() => setMostrarSelector(!mostrarSelector)}
          leftIcon={<Eye className="w-4 h-4" />}
        >
          Comparar semana
        </Button>
        {mostrarSelector && (
          <Card className="absolute z-50 mt-10 border border-slate-200 bg-white shadow-lg p-3 min-w-[200px]">
            <div className="space-y-2">
              <button
                onClick={() => handleTipoComparacion('anterior')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm"
              >
                <Calendar className="w-4 h-4 text-blue-500" />
                <span>Semana anterior</span>
              </button>
              <button
                onClick={() => handleTipoComparacion('objetivo')}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm"
              >
                <Target className="w-4 h-4 text-emerald-500" />
                <span>Objetivo</span>
              </button>
              <button
                onClick={() => {
                  setTipoComparacion('historica');
                  setMostrarSelector(false);
                  cargarHistorialVersiones();
                }}
                className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 flex items-center gap-2 text-sm"
              >
                <History className="w-4 h-4 text-purple-500" />
                <span>Versión histórica</span>
              </button>
            </div>
          </Card>
        )}
      </div>
    );
  }

  const macrosActual = calcularMacrosDia(dietaActual.comidas);
  const macrosComparacion = calcularMacrosDia(dietaComparacion.comidas);
  const diferenciaCalorias = calcularDiferencia(macrosActual.calorias, macrosComparacion.calorias);
  const diferenciaProteinas = calcularDiferencia(macrosActual.proteinas, macrosComparacion.proteinas);
  const diferenciaCarbohidratos = calcularDiferencia(macrosActual.carbohidratos, macrosComparacion.carbohidratos);
  const diferenciaGrasas = calcularDiferencia(macrosActual.grasas, macrosComparacion.grasas);

  return (
    <Card className="border-2 border-blue-200 bg-blue-50/50 p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Eye className="w-4 h-4 text-blue-600" />
          <span className="text-sm font-semibold text-blue-900">
            Modo fantasma: {tipoComparacion === 'anterior' ? 'Semana anterior' : tipoComparacion === 'objetivo' ? 'Objetivo' : 'Versión histórica'}
          </span>
          {tipoComparacion === 'historica' && historialVersiones.length > 0 && (
            <select
              value={versionSeleccionada || ''}
              onChange={(e) => handleVersionHistorica(e.target.value)}
              className="ml-2 text-xs border border-blue-300 rounded px-2 py-1 bg-white"
            >
              <option value="">Seleccionar versión...</option>
              {historialVersiones.map((v) => (
                <option key={v.id} value={v.id}>
                  {new Date(v.fechaCambio).toLocaleDateString('es-ES')} - {v.descripcion}
                </option>
              ))}
            </select>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            setTipoComparacion(null);
            setDietaComparacion(null);
            setVersionSeleccionada(null);
            onComparacionChange?.(null, null);
          }}
          leftIcon={<X className="w-4 h-4" />}
        >
          Cerrar
        </Button>
      </div>

      {/* Comparación de macros */}
      <div className="grid grid-cols-4 gap-3 text-xs">
        <div className="bg-white/80 rounded-lg p-2 border border-blue-200">
          <div className="text-slate-500 mb-1">Calorías</div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-slate-900">{Math.round(macrosComparacion.calorias)}</span>
            <span className={getColorDiferencia(diferenciaCalorias.valor)}>
              ({diferenciaCalorias.valor > 0 ? '+' : ''}{Math.round(diferenciaCalorias.valor)})
            </span>
            {getIconoTendencia(diferenciaCalorias.porcentaje)}
          </div>
        </div>
        <div className="bg-white/80 rounded-lg p-2 border border-blue-200">
          <div className="text-slate-500 mb-1">Proteínas</div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-slate-900">{Math.round(macrosComparacion.proteinas)}g</span>
            <span className={getColorDiferencia(diferenciaProteinas.valor)}>
              ({diferenciaProteinas.valor > 0 ? '+' : ''}{Math.round(diferenciaProteinas.valor)}g)
            </span>
            {getIconoTendencia(diferenciaProteinas.porcentaje)}
          </div>
        </div>
        <div className="bg-white/80 rounded-lg p-2 border border-blue-200">
          <div className="text-slate-500 mb-1">Carbohidratos</div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-slate-900">{Math.round(macrosComparacion.carbohidratos)}g</span>
            <span className={getColorDiferencia(diferenciaCarbohidratos.valor)}>
              ({diferenciaCarbohidratos.valor > 0 ? '+' : ''}{Math.round(diferenciaCarbohidratos.valor)}g)
            </span>
            {getIconoTendencia(diferenciaCarbohidratos.porcentaje)}
          </div>
        </div>
        <div className="bg-white/80 rounded-lg p-2 border border-blue-200">
          <div className="text-slate-500 mb-1">Grasas</div>
          <div className="flex items-center gap-1">
            <span className="font-semibold text-slate-900">{Math.round(macrosComparacion.grasas)}g</span>
            <span className={getColorDiferencia(diferenciaGrasas.valor)}>
              ({diferenciaGrasas.valor > 0 ? '+' : ''}{Math.round(diferenciaGrasas.valor)}g)
            </span>
            {getIconoTendencia(diferenciaGrasas.porcentaje)}
          </div>
        </div>
      </div>

      {/* Comparación de comidas por día (vista simplificada) */}
      <div className="text-xs text-blue-700">
        <p className="font-semibold mb-2">Variedad de comidas:</p>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <span>Comidas únicas (actual):</span>
            <span className="font-semibold">{new Set(dietaActual.comidas.map(c => c.nombre)).size}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Comidas únicas (comparación):</span>
            <span className="font-semibold">{new Set(dietaComparacion.comidas.map(c => c.nombre)).size}</span>
          </div>
        </div>
      </div>
    </Card>
  );
};

