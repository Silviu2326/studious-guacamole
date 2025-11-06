import React from 'react';
import { PlanificacionSemana } from '../../types/advanced';
import { Modal, Badge } from '../../../../components/componentsreutilizables';
import { AlertTriangle, CheckCircle2, XCircle } from 'lucide-react';

interface RevisarSeguridadProps {
  planificacion: PlanificacionSemana;
  isOpen: boolean;
  onClose: () => void;
}

interface SeguridadCheck {
  tipo: 'pico_carga' | 'desequilibrio' | 'distribucion' | 'ok';
  severidad: 'alta' | 'media' | 'baja';
  mensaje: string;
  sugerencia?: string;
}

/**
 * Revisar Seguridad (checker rápido): picos de carga, desequilibrios empuje/tirón, rodilla/cadera, vertical/horizontal
 */
export const RevisarSeguridad: React.FC<RevisarSeguridadProps> = ({
  planificacion,
  isOpen,
  onClose,
}) => {
  const realizarChecks = (): SeguridadCheck[] => {
    const checks: SeguridadCheck[] = [];

    // Calcular métricas por patrón
    const patrones: Record<string, { series: number; volumen: number; carga: number }> = {
      empuje: { series: 0, volumen: 0, carga: 0 },
      tiron: { series: 0, volumen: 0, carga: 0 },
      rodilla: { series: 0, volumen: 0, carga: 0 },
      cadera: { series: 0, volumen: 0, carga: 0 },
      vertical: { series: 0, volumen: 0, carga: 0 },
      horizontal: { series: 0, volumen: 0, carga: 0 },
    };

    let cargaTotal = 0;
    let volumenTotal = 0;

    Object.values(planificacion).forEach(sesion => {
      if (!sesion) return;
      
      sesion.ejercicios?.forEach(ej => {
        const nombreEj = ej.ejercicio.nombre.toLowerCase();
        const volumen = ej.series?.reduce((sum, s) => sum + s.repeticiones, 0) || 0;
        const carga = ej.series?.reduce((sum, s) => sum + (s.peso || 0) * s.repeticiones, 0) || 0;
        
        volumenTotal += volumen;
        cargaTotal += carga;

        // Detectar patrones
        if (nombreEj.includes('press') || nombreEj.includes('push')) {
          patrones.empuje.series += ej.series?.length || 0;
          patrones.empuje.volumen += volumen;
          patrones.empuje.carga += carga;
        }
        if (nombreEj.includes('remo') || nombreEj.includes('pull') || nombreEj.includes('row')) {
          patrones.tiron.series += ej.series?.length || 0;
          patrones.tiron.volumen += volumen;
          patrones.tiron.carga += carga;
        }
        if (nombreEj.includes('sentadilla') || nombreEj.includes('squat')) {
          patrones.rodilla.series += ej.series?.length || 0;
          patrones.rodilla.volumen += volumen;
          patrones.rodilla.carga += carga;
        }
        if (nombreEj.includes('muerto') || nombreEj.includes('deadlift')) {
          patrones.cadera.series += ej.series?.length || 0;
          patrones.cadera.volumen += volumen;
          patrones.cadera.carga += carga;
        }
      });
    });

    // Check 1: Desequilibrio Empuje/Tirón
    const ratioEmpujeTiron = patrones.empuje.series / (patrones.tiron.series || 1);
    if (ratioEmpujeTiron > 1.5) {
      checks.push({
        tipo: 'desequilibrio',
        severidad: 'alta',
        mensaje: 'Desequilibrio Empuje/Tirón: Demasiado empuje',
        sugerencia: `Aumenta ejercicios de tirón. Actual: ${patrones.empuje.series} empuje vs ${patrones.tiron.series} tirón`,
      });
    } else if (ratioEmpujeTiron < 0.67) {
      checks.push({
        tipo: 'desequilibrio',
        severidad: 'alta',
        mensaje: 'Desequilibrio Empuje/Tirón: Demasiado tirón',
        sugerencia: `Aumenta ejercicios de empuje. Actual: ${patrones.empuje.series} empuje vs ${patrones.tiron.series} tirón`,
      });
    }

    // Check 2: Desequilibrio Rodilla/Cadera
    const ratioRodillaCadera = patrones.rodilla.series / (patrones.cadera.series || 1);
    if (ratioRodillaCadera > 2 || ratioRodillaCadera < 0.5) {
      checks.push({
        tipo: 'desequilibrio',
        severidad: 'media',
        mensaje: 'Desequilibrio Rodilla/Cadera',
        sugerencia: `Balance: ${patrones.rodilla.series} rodilla vs ${patrones.cadera.series} cadera`,
      });
    }

    // Check 3: Pico de carga (si hay carga muy alta en un solo día)
    const cargasPorDia = Object.values(planificacion).map(sesion => {
      if (!sesion) return 0;
      return sesion.ejercicios?.reduce((sum, ej) => {
        return sum + (ej.series?.reduce((s, serie) => s + (serie.peso || 0) * serie.repeticiones, 0) || 0);
      }, 0) || 0;
    });
    const cargaPromedio = cargasPorDia.reduce((a, b) => a + b, 0) / cargasPorDia.length;
    const cargaMaxima = Math.max(...cargasPorDia);
    
    if (cargaMaxima > cargaPromedio * 1.5 && cargaPromedio > 0) {
      checks.push({
        tipo: 'pico_carga',
        severidad: 'media',
        mensaje: 'Pico de carga detectado',
        sugerencia: `Día con carga máxima (${cargaMaxima.toFixed(0)}) es ${((cargaMaxima / cargaPromedio - 1) * 100).toFixed(0)}% mayor que el promedio`,
      });
    }

    // Check 4: Distribución de ejercicios
    const diasConEjercicios = Object.values(planificacion).filter(s => s && s.ejercicios && s.ejercicios.length > 0).length;
    if (diasConEjercicios < 3) {
      checks.push({
        tipo: 'distribucion',
        severidad: 'baja',
        mensaje: 'Distribución limitada',
        sugerencia: `Solo ${diasConEjercicios} días con ejercicios. Considera distribuir mejor la carga`,
      });
    }

    // Si no hay problemas, añadir check OK
    if (checks.length === 0) {
      checks.push({
        tipo: 'ok',
        severidad: 'baja',
        mensaje: 'Planificación balanceada',
      });
    }

    return checks;
  };

  const checks = realizarChecks();

  const getIcon = (check: SeguridadCheck) => {
    if (check.tipo === 'ok') return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (check.severidad === 'alta') return <XCircle className="w-5 h-5 text-red-600" />;
    return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
  };

  const getSeverityBadge = (severidad: string) => {
    const variants = {
      alta: 'red',
      media: 'yellow',
      baja: 'green',
    } as const;
    return <Badge variant={variants[severidad as keyof typeof variants] || 'gray'}>{severidad}</Badge>;
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Revisar Seguridad" size="lg">
      <div className="space-y-4">
        {checks.map((check, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-lg border ${
              check.severidad === 'alta'
                ? 'bg-red-50 border-red-200'
                : check.severidad === 'media'
                ? 'bg-yellow-50 border-yellow-200'
                : 'bg-green-50 border-green-200'
            }`}
          >
            <div className="flex items-start gap-3">
              {getIcon(check)}
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold text-gray-900">{check.mensaje}</span>
                  {getSeverityBadge(check.severidad)}
                </div>
                {check.sugerencia && (
                  <p className="text-sm text-gray-600 mt-1">{check.sugerencia}</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  );
};




