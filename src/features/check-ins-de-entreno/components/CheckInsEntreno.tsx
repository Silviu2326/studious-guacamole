import React, { useState, useEffect } from 'react';
import { Card, Button, Tabs, Modal } from '../../../components/componentsreutilizables';
import { CheckCircle, Plus, Users, Calendar, TrendingUp } from 'lucide-react';
import { SemáforoSerie } from './SemáforoSerie';
import { EvaluacionSensaciones } from './EvaluacionSensaciones';
import { RegistradorRPE } from './RegistradorRPE';
import { HistorialCheckIns } from './HistorialCheckIns';
import { AlertasDolor } from './AlertasDolor';
import { AnalizadorPatrones } from './AnalizadorPatrones';
import { AjustadorAutomatico } from './AjustadorAutomatico';
import {
  CheckInEntreno,
  crearCheckIn,
  actualizarCheckIn,
  getCheckIns,
  getHistorialCheckIns,
  getCheckInsAnalytics,
} from '../api/checkins';
import { getAlertas, resolverAlerta, crearAlerta } from '../api/alertas';
import { analizarPatrones, AnalisisPatrones } from '../api/patrones';

interface CheckInsEntrenoProps {
  clienteId?: string;
  sesionId?: string;
}

export const CheckInsEntreno: React.FC<CheckInsEntrenoProps> = ({
  clienteId,
  sesionId,
}) => {
  const [checkIns, setCheckIns] = useState<CheckInEntreno[]>([]);
  const [historial, setHistorial] = useState<any[]>([]);
  const [alertas, setAlertas] = useState<any[]>([]);
  const [analisis, setAnalisis] = useState<AnalisisPatrones | null>(null);
  const [tabActiva, setTabActiva] = useState('nuevo');
  const [mostrarModal, setMostrarModal] = useState(false);
  const [checkInActual, setCheckInActual] = useState<Partial<CheckInEntreno>>({
    clienteId: clienteId || '',
    sesionId: sesionId,
    fecha: new Date().toISOString(),
    semaforo: 'verde',
    dolorLumbar: false,
  });
  const [serieActual, setSerieActual] = useState(1);
  const [rpeRegistrado, setRpeRegistrado] = useState<number | null>(null);

  useEffect(() => {
    cargarDatos();
  }, [clienteId, sesionId]);

  const cargarDatos = async () => {
    if (!clienteId) return;

    const [checkInsData, historialData, alertasData, analisisData] = await Promise.all([
      getCheckIns(clienteId, sesionId),
      getHistorialCheckIns(clienteId, 30),
      getAlertas(clienteId, false),
      analizarPatrones(clienteId),
    ]);

    setCheckIns(checkInsData);
    setHistorial(historialData);
    setAlertas(alertasData);
    setAnalisis(analisisData);
  };

  const handleEvaluarSensaciones = async (sensacion: string, dolorLumbar: boolean) => {
    const nuevoCheckIn: Omit<CheckInEntreno, 'id' | 'createdAt' | 'updatedAt'> = {
      ...checkInActual,
      sensaciones: sensacion,
      dolorLumbar,
      serie: serieActual,
      semaforo: dolorLumbar ? 'rojo' : sensacion.toLowerCase().includes('mal') || sensacion.toLowerCase().includes('regular') ? 'amarillo' : 'verde',
    } as any;

    const checkInGuardado = await crearCheckIn(nuevoCheckIn);
    if (checkInGuardado) {
      await cargarDatos();

      if (dolorLumbar) {
        await crearAlerta({
          checkInId: checkInGuardado.id!,
          tipo: 'dolor_lumbar',
          severidad: 'alta',
          mensaje: 'Se detectó dolor lumbar durante el ejercicio',
          fecha: new Date().toISOString(),
          resuelta: false,
          recomendacion: 'Considerar modificar el ejercicio o reducir la intensidad',
        });
        await cargarDatos();
      }

      setCheckInActual({
        clienteId: clienteId || '',
        sesionId: sesionId,
        fecha: new Date().toISOString(),
        semaforo: 'verde',
        dolorLumbar: false,
      });
      setSerieActual(serieActual + 1);
      setMostrarModal(false);
    }
  };

  const handleRegistrarRPE = async (rpe: number) => {
    if (!checkInActual.id) {
      const nuevoCheckIn: Omit<CheckInEntreno, 'id' | 'createdAt' | 'updatedAt'> = {
        ...checkInActual,
        rpe,
        serie: serieActual,
      } as any;

      const checkInGuardado = await crearCheckIn(nuevoCheckIn);
      if (checkInGuardado) {
        setCheckInActual({ ...checkInActual, id: checkInGuardado.id });
        setRpeRegistrado(rpe);
        await cargarDatos();
      }
    } else {
      await actualizarCheckIn(checkInActual.id, { rpe });
      setRpeRegistrado(rpe);
      await cargarDatos();
    }
  };

  const handleResolverAlerta = async (alertaId: string) => {
    await resolverAlerta(alertaId);
    await cargarDatos();
  };

  const tabs = [
    {
      id: 'nuevo',
      label: 'Nuevo Check-in',
      icon: <Plus className="w-4 h-4" />,
    },
    {
      id: 'historial',
      label: 'Historial',
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: 'alertas',
      label: 'Alertas',
      icon: <CheckCircle className="w-4 h-4" />,
    },
    {
      id: 'analisis',
      label: 'Análisis',
      icon: <Users className="w-4 h-4" />,
    },
  ];

  const renderTabContent = () => {
    switch (tabActiva) {
      case 'nuevo':
        return (
          <div className="space-y-6">
            {/* Información de Serie Actual */}
            <Card className="p-6 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">Serie {serieActual}</h3>
                  <p className="text-sm text-slate-600">
                    {new Date().toLocaleDateString('es-ES', {
                      weekday: 'long',
                      day: 'numeric',
                      month: 'long',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <SemáforoSerie estado={checkInActual.semaforo || 'verde'} serie={serieActual} size="lg" />
                </div>
              </div>
              
              {/* Resumen de Check-ins de hoy */}
              {checkIns.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-200">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium text-slate-700">
                      Check-ins de hoy: {checkIns.length}
                    </span>
                    <div className="flex items-center gap-2">
                      {checkIns.map((ci, idx) => (
                        <SemáforoSerie
                          key={ci.id || idx}
                          estado={ci.semaforo}
                          serie={ci.serie}
                          size="sm"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </Card>

            <EvaluacionSensaciones
              onEvaluar={handleEvaluarSensaciones}
              valorInicial={checkInActual.sensaciones}
              dolorLumbarInicial={checkInActual.dolorLumbar}
            />

            <RegistradorRPE
              onRegistrar={handleRegistrarRPE}
              valorInicial={rpeRegistrado || checkInActual.rpe}
            />

            {analisis && (
              <AjustadorAutomatico
                clienteId={clienteId!}
                checkInId={checkInActual.id || 'nuevo'}
                onAjusteAplicado={cargarDatos}
              />
            )}

            {/* Estadísticas Rápidas */}
            {checkIns.length > 0 && (
              <Card className="p-6 bg-gradient-to-br from-blue-50 to-purple-50 shadow-sm">
                <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <TrendingUp size={20} className="text-blue-600" />
                  Estadísticas de la Sesión
                </h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 rounded-lg bg-white/80">
                    <div className="text-2xl font-bold text-blue-600">
                      {checkIns.filter(c => c.semaforo === 'verde').length}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">Verde</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/80">
                    <div className="text-2xl font-bold text-yellow-600">
                      {checkIns.filter(c => c.semaforo === 'amarillo').length}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">Amarillo</div>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-white/80">
                    <div className="text-2xl font-bold text-red-600">
                      {checkIns.filter(c => c.semaforo === 'rojo').length}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">Rojo</div>
                  </div>
                </div>
                {checkIns.filter(c => c.rpe).length > 0 && (
                  <div className="mt-4 pt-4 border-t border-slate-200">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-slate-700">RPE Promedio:</span>
                      <span className="text-lg font-bold text-purple-600">
                        {(checkIns.filter(c => c.rpe).reduce((sum, c) => sum + (c.rpe || 0), 0) / 
                          checkIns.filter(c => c.rpe).length).toFixed(1)}
                      </span>
                    </div>
                  </div>
                )}
              </Card>
            )}
          </div>
        );

      case 'historial':
        return <HistorialCheckIns historial={historial} />;

      case 'alertas':
        return (
          <AlertasDolor
            alertas={alertas}
            onResolver={handleResolverAlerta}
          />
        );

      case 'analisis':
        return (
          <AnalizadorPatrones
            analisis={analisis}
            loading={false}
          />
        );

      default:
        return null;
    }
  };

  if (!clienteId) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <Users size={48} className="mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Selecciona un Cliente
        </h3>
        <p className="text-gray-600">Selecciona un cliente para ver sus check-ins</p>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Sistema de Tabs */}
      <Card className="p-0 bg-white shadow-sm">
        <div className="px-4 py-3">
          <div
            role="tablist"
            aria-label="Secciones"
            className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
          >
            {tabs.map((tab) => {
              const Icon = tab.id === 'nuevo' ? Plus : tab.id === 'historial' ? Calendar : tab.id === 'alertas' ? CheckCircle : Users;
              const isActive = tabActiva === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setTabActiva(tab.id)}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Icon size={18} className={isActive ? 'opacity-100' : 'opacity-70'} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </Card>

      {/* Contenido de Tabs */}
      <div className="mt-6">
        {renderTabContent()}
      </div>
    </div>
  );
};

