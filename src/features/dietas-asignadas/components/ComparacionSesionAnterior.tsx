import React, { useEffect, useState } from 'react';
import { Card, Badge } from '../../../components/componentsreutilizables';
import { ArrowUp, ArrowDown, Minus, TrendingUp, TrendingDown, Calendar, Clock } from 'lucide-react';
import { ComparacionSesionAnterior as ComparacionSesionAnteriorType, Comida } from '../types';
import { compararSesionAnterior } from '../api';

interface ComparacionSesionAnteriorProps {
  comida: Comida;
  clienteId: string;
  diaSemana?: string;
  fechaActual?: string;
  mostrarSiempre?: boolean; // Si es false, solo se muestra si hay comparación disponible
}

export const ComparacionSesionAnterior: React.FC<ComparacionSesionAnteriorProps> = ({
  comida,
  clienteId,
  diaSemana,
  fechaActual,
  mostrarSiempre = false,
}) => {
  const [comparacion, setComparacion] = useState<ComparacionSesionAnteriorType | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const cargarComparacion = async () => {
      setCargando(true);
      try {
        const resultado = await compararSesionAnterior(comida, clienteId, diaSemana, fechaActual);
        setComparacion(resultado);
      } catch (error) {
        console.error('Error cargando comparación:', error);
      } finally {
        setCargando(false);
      }
    };

    cargarComparacion();
  }, [comida, clienteId, diaSemana, fechaActual]);

  if (cargando) {
    return null;
  }

  if (!comparacion || !comparacion.comidaAnterior) {
    if (!mostrarSiempre) return null;
    
    return (
      <Card className="border border-slate-200 bg-slate-50/50 p-3">
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar className="w-3 h-3" />
          <span>No hay sesión anterior disponible para comparar</span>
        </div>
      </Card>
    );
  }

  const { comidaAnterior, diferencias, porcentajesCambio, tendencia, mensaje, tipoComparacion } = comparacion;

  const getTendenciaColor = () => {
    switch (tendencia) {
      case 'mejora':
        return 'bg-emerald-50 border-emerald-200 text-emerald-900';
      case 'desviacion':
        return 'bg-amber-50 border-amber-200 text-amber-900';
      default:
        return 'bg-slate-50 border-slate-200 text-slate-700';
    }
  };

  const getTendenciaIcon = () => {
    switch (tendencia) {
      case 'mejora':
        return <TrendingUp className="w-4 h-4 text-emerald-600" />;
      case 'desviacion':
        return <TrendingDown className="w-4 h-4 text-amber-600" />;
      default:
        return <Minus className="w-4 h-4 text-slate-500" />;
    }
  };

  const getTipoComparacionLabel = () => {
    switch (tipoComparacion) {
      case 'dia-anterior':
        return 'Día anterior';
      case 'semana-anterior':
        return 'Semana anterior';
      case 'mismo-dia-semana-anterior':
        return 'Mismo día, semana anterior';
      default:
        return 'Sesión anterior';
    }
  };

  const renderDiferencia = (label: string, valor: number, porcentaje: number, unidad: string = '') => {
    const esPositivo = valor > 0;
    const esSignificativo = Math.abs(porcentaje) > 5;
    
    return (
      <div className="flex items-center justify-between text-xs">
        <span className="text-slate-600">{label}</span>
        <div className="flex items-center gap-2">
          <span className={`font-medium ${esPositivo ? 'text-emerald-600' : 'text-red-600'}`}>
            {esPositivo ? '+' : ''}{valor.toFixed(1)}{unidad}
          </span>
          {esSignificativo && (
            <span className={`text-[10px] ${esPositivo ? 'text-emerald-600' : 'text-red-600'}`}>
              ({esPositivo ? '+' : ''}{porcentaje.toFixed(1)}%)
            </span>
          )}
        </div>
      </div>
    );
  };

  return (
    <Card className={`border-2 ${getTendenciaColor()} p-4 space-y-3`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          {getTendenciaIcon()}
          <div>
            <h4 className="text-sm font-semibold">Comparación con sesión anterior</h4>
            <p className="text-xs text-slate-600 mt-0.5">{getTipoComparacionLabel()}</p>
          </div>
        </div>
        <Badge className={`text-xs ${
          tendencia === 'mejora' ? 'bg-emerald-100 text-emerald-700' :
          tendencia === 'desviacion' ? 'bg-amber-100 text-amber-700' :
          'bg-slate-100 text-slate-700'
        }`}>
          {tendencia === 'mejora' ? 'Mejora' : tendencia === 'desviacion' ? 'Desviación' : 'Estable'}
        </Badge>
      </div>

      {mensaje && (
        <p className="text-xs text-slate-600 italic">{mensaje}</p>
      )}

      <div className="grid grid-cols-2 gap-3 pt-2 border-t border-slate-200">
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Actual</p>
          <div className="space-y-1">
            <div className="text-xs text-slate-600">
              <span className="font-medium">{comida.calorias}</span> kcal
            </div>
            <div className="text-xs text-slate-600">
              P: <span className="font-medium">{comida.proteinas}g</span> · 
              H: <span className="font-medium">{comida.carbohidratos}g</span> · 
              G: <span className="font-medium">{comida.grasas}g</span>
            </div>
          </div>
        </div>
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Anterior</p>
          <div className="space-y-1">
            <div className="text-xs text-slate-600">
              <span className="font-medium">{comidaAnterior.calorias}</span> kcal
            </div>
            <div className="text-xs text-slate-600">
              P: <span className="font-medium">{comidaAnterior.proteinas}g</span> · 
              H: <span className="font-medium">{comidaAnterior.carbohidratos}g</span> · 
              G: <span className="font-medium">{comidaAnterior.grasas}g</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-slate-200 space-y-2">
        <p className="text-xs font-semibold text-slate-700 uppercase tracking-wide">Diferencias</p>
        {renderDiferencia('Calorías', diferencias.calorias, porcentajesCambio.calorias, ' kcal')}
        {renderDiferencia('Proteínas', diferencias.proteinas, porcentajesCambio.proteinas, ' g')}
        {renderDiferencia('Carbohidratos', diferencias.carbohidratos, porcentajesCambio.carbohidratos, ' g')}
        {renderDiferencia('Grasas', diferencias.grasas, porcentajesCambio.grasas, ' g')}
      </div>
    </Card>
  );
};

