import React, { useMemo, useState } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../../components/componentsreutilizables';
import { AdherenciaTracker } from '../components/AdherenciaTracker';
import { CumplimientoCliente } from '../components/CumplimientoCliente';
import { OcupacionClase } from '../components/OcupacionClase';
import { SeguimientoGrupal } from '../components/SeguimientoGrupal';
import { MetricasAdherencia } from '../components/Metrics/MetricasAdherencia';
import { AlertasAdherencia } from '../components/AlertasAdherencia';
import { AnalizadorTendencias } from '../components/AnalizadorTendencias';
import { OptimizadorAdherencia } from '../components/OptimizadorAdherencia';
import { ConfiguracionResumenSemanal } from '../components/ConfiguracionResumenSemanal';
import { 
  Activity, 
  BarChart3, 
  TrendingUp, 
  AlertCircle, 
  Settings, 
  UserCheck, 
  Calendar,
  Users 
} from 'lucide-react';

export const AdherenciaCumplimientoEntrenoPage: React.FC = () => {
  const { user } = useAuth();
  const esEntrenador = user?.role === 'entrenador';
  const esGimnasio = user?.role === 'gimnasio';

  const [tabActiva, setTabActiva] = useState<string>('resumen');

  const tabs = useMemo(() => {
    const comunes = [
      { id: 'resumen', label: 'Resumen', icon: BarChart3 },
      { id: 'metricas', label: 'Métricas', icon: Activity },
      { id: 'tendencias', label: 'Tendencias', icon: TrendingUp },
      { id: 'alertas', label: 'Alertas', icon: AlertCircle },
      { id: 'optimizacion', label: 'Optimización', icon: Settings },
    ];
    const entrenadorTabs = [
      { id: 'cumplimiento-individual', label: 'Cumplimiento Individual', icon: UserCheck },
    ];
    const gimnasioTabs = [
      { id: 'ocupacion-clases', label: 'Ocupación de Clases', icon: Calendar },
      { id: 'seguimiento-grupal', label: 'Seguimiento Grupal', icon: Users },
    ];
    if (esEntrenador) return [...comunes, ...entrenadorTabs];
    if (esGimnasio) return [...comunes, ...gimnasioTabs];
    return comunes;
  }, [esEntrenador, esGimnasio]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Activity size={24} className="text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Adherencia y Cumplimiento de Entreno
                </h1>
                <p className="text-gray-600">
                  {esEntrenador 
                    ? 'Monitorea y optimiza el seguimiento individual de tus clientes'
                    : esGimnasio 
                    ? 'Análisis de adherencia y ocupación para optimizar operaciones'
                    : 'Seguimiento completo de adherencia y cumplimiento'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        <Card className="p-0 bg-white shadow-sm">
          {/* Tablist */}
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones adherencia"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              {tabs.map(({ id, label, icon: Icon }) => {
                const activo = tabActiva === id;
                return (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={activo}
                    onClick={() => setTabActiva(id)}
                    className={[
                      'inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all',
                      activo
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    ].join(' ')}
                  >
                    <Icon
                      size={18}
                      className={activo ? 'opacity-100' : 'opacity-70'}
                    />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Contenido de la pestaña activa */}
        <div className="mt-6">
          {tabActiva === 'resumen' && <AdherenciaTracker modo={esEntrenador ? 'entrenador' : 'gimnasio'} />}
          {tabActiva === 'metricas' && <MetricasAdherencia modo={esEntrenador ? 'entrenador' : 'gimnasio'} />}
          {tabActiva === 'tendencias' && <AnalizadorTendencias modo={esEntrenador ? 'entrenador' : 'gimnasio'} />}
          {tabActiva === 'alertas' && <AlertasAdherencia modo={esEntrenador ? 'entrenador' : 'gimnasio'} />}
          {tabActiva === 'optimizacion' && <OptimizadorAdherencia modo={esEntrenador ? 'entrenador' : 'gimnasio'} />}
          {tabActiva === 'cumplimiento-individual' && esEntrenador && <CumplimientoCliente />}
          {tabActiva === 'ocupacion-clases' && esGimnasio && <OcupacionClase />}
          {tabActiva === 'seguimiento-grupal' && esGimnasio && <SeguimientoGrupal />}
        </div>
      </div>
    </div>
  );
};

export default AdherenciaCumplimientoEntrenoPage;


