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
import { CamposPersonalizadosCheckIn } from './CamposPersonalizadosCheckIn';
import { GestorPlantillasCheckIn } from './GestorPlantillasCheckIn';
import { AnalyticsCheckInsVsPlan } from './AnalyticsCheckInsVsPlan';
import {
  CheckInEntreno,
  crearCheckIn,
  actualizarCheckIn,
  getCheckIns,
  getHistorialCheckIns,
  getCheckInsAnalytics,
  getObjetivosPlanSemana,
} from '../api/checkins';
import { getConfigSemaforos, evaluarSemaforo, ConfigSemaforos } from '../api/semaforos';
import { useAuth } from '../../../context/AuthContext';
import { getAlertas, resolverAlerta, crearAlerta } from '../api/alertas';
import { analizarPatrones, AnalisisPatrones } from '../api/patrones';
import {
  getPlantillaActivaPorCliente,
  PlantillaCheckIn,
} from '../api/plantillas';
import {
  getWearableLinkStatus,
  fetchRecentWearableMetrics,
  linkWearableSource,
  correlateSensationsWithMetrics,
  WearableMetricSample,
} from '../api/wearables';
import {
  getConfigRecordatorios,
  setConfigRecordatorios,
  ConfigRecordatoriosCheckIn,
  iniciarVerificacionRecordatoriosCheckIn,
} from '../api/recordatorios';
import {
  getConfigReglas,
  setConfigReglas,
  evaluarYAplicarReglas,
  ConfigReglasAutomaticas,
  ReglaAutomatica,
} from '../api/reglas';

interface CheckInsEntrenoProps {
  clienteId?: string;
  sesionId?: string;
}

export const CheckInsEntreno: React.FC<CheckInsEntrenoProps> = ({
  clienteId,
  sesionId,
}) => {
  const { user } = useAuth();
  const [configSemaforos, setConfigSemaforos] = useState<ConfigSemaforos | null>(null);
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
  const [plantillaActiva, setPlantillaActiva] = useState<PlantillaCheckIn | null>(null);
  const [camposPersonalizados, setCamposPersonalizados] = useState<Record<string, any>>({});
  const [mostrarGestorPlantillas, setMostrarGestorPlantillas] = useState(false);
  const [configRecordatorios, setConfigRecordatoriosState] = useState<ConfigRecordatoriosCheckIn | null>(null);
  const [timerRecordatorios, setTimerRecordatorios] = useState<NodeJS.Timeout | null>(null);
  const [mediaAdjunta, setMediaAdjunta] = useState<Array<{ id: string; type: 'image' | 'video'; url: string; thumbnailUrl?: string }>>([]);
  const [analytics, setAnalytics] = useState<any | null>(null);
  const [objetivos, setObjetivos] = useState<any | null>(null);
  const [wearableStatus, setWearableStatus] = useState<{ linked: boolean; source?: string; lastSyncAt?: string } | null>(null);
  const [wearableSamples, setWearableSamples] = useState<WearableMetricSample[]>([]);
  const [attachLatestWearable, setAttachLatestWearable] = useState<boolean>(true);
  const [reglasConfig, setReglasConfig] = useState<ConfigReglasAutomaticas | null>(null);

  useEffect(() => {
    cargarDatos();
  }, [clienteId, sesionId]);

  const cargarDatos = async () => {
    if (!clienteId) return;

    const [checkInsData, historialData, alertasData, analisisData, tplActiva, objetivosPlan, analyticsData] = await Promise.all([
      getCheckIns(clienteId, sesionId),
      getHistorialCheckIns(clienteId, 30),
      getAlertas(clienteId, false),
      analizarPatrones(clienteId),
      getPlantillaActivaPorCliente(clienteId),
      getObjetivosPlanSemana(clienteId),
      getCheckInsAnalytics(clienteId),
    ]);

    setCheckIns(checkInsData);
    setHistorial(historialData);
    setAlertas(alertasData);
    setAnalisis(analisisData);
    setPlantillaActiva(tplActiva);
    setCamposPersonalizados({});
    setObjetivos(objetivosPlan);
    setAnalytics(analyticsData);

    // Wearables
    const status = await getWearableLinkStatus(clienteId);
    setWearableStatus(status);
    if (status.linked) {
      const samples = await fetchRecentWearableMetrics(clienteId);
      setWearableSamples(samples);
    } else {
      setWearableSamples([]);
    }
    // Reglas automáticas
    const reglas = await getConfigReglas(clienteId);
    setReglasConfig(reglas);
  };

  useEffect(() => {
    if (user?.id) {
      getConfigSemaforos(user.id).then(setConfigSemaforos);
    }
  }, [user?.id]);

  const handleEvaluarSensaciones = async (sensacion: string, dolorLumbar: boolean) => {
    const nuevoCheckIn: Omit<CheckInEntreno, 'id' | 'createdAt' | 'updatedAt'> = {
      ...checkInActual,
      sensaciones: sensacion,
      dolorLumbar,
      serie: serieActual,
      semaforo: configSemaforos
        ? evaluarSemaforo(
            { rpe: checkInActual.rpe, dolorLumbar, sensaciones: sensacion },
            configSemaforos
          )
        : dolorLumbar
        ? 'rojo'
        : sensacion.toLowerCase().includes('mal') || sensacion.toLowerCase().includes('regular')
        ? 'amarillo'
        : 'verde',
      camposPersonalizados: Object.keys(camposPersonalizados).length ? camposPersonalizados : undefined,
      media: mediaAdjunta.length
        ? mediaAdjunta.map((m) => ({
            ...m,
            createdAt: new Date().toISOString(),
          }))
        : undefined,
      wearableMetrics:
        attachLatestWearable && wearableSamples.length > 0
          ? {
              source: wearableSamples[wearableSamples.length - 1].source,
              heartRateBpm: wearableSamples[wearableSamples.length - 1].heartRateBpm,
              hrvMs: wearableSamples[wearableSamples.length - 1].hrvMs,
              capturedAt: wearableSamples[wearableSamples.length - 1].capturedAt,
              raw: wearableSamples[wearableSamples.length - 1].raw,
            }
          : undefined,
    } as any;

    const checkInGuardado = await crearCheckIn(nuevoCheckIn);
    if (checkInGuardado) {
      await cargarDatos();

      if (dolorLumbar) {
        const alerta = await crearAlerta({
          checkInId: checkInGuardado.id!,
          tipo: 'dolor_lumbar',
          severidad: 'alta',
          mensaje: 'Se detectó dolor lumbar durante el ejercicio',
          fecha: new Date().toISOString(),
          resuelta: false,
          recomendacion: 'Considerar modificar el ejercicio o reducir la intensidad',
        });
        // Aplicar reglas automáticas si corresponden
        if (alerta && clienteId) {
          const res = await evaluarYAplicarReglas(clienteId, alerta, checkInGuardado.id!);
          if (res.aplicado) {
            await actualizarCheckIn(checkInGuardado.id!, { ajusteAplicado: true });
          }
          // Resolver alerta si está así configurado
          const cfg = reglasConfig || (await getConfigReglas(clienteId));
          if (cfg.autoResolverAlerta && alerta.id) {
            await resolverAlerta(alerta.id);
          }
          await cargarDatos();
        } else {
          await cargarDatos();
        }
      }

      setCheckInActual({
        clienteId: clienteId || '',
        sesionId: sesionId,
        fecha: new Date().toISOString(),
        semaforo: 'verde',
        dolorLumbar: false,
      });
      setSerieActual(serieActual + 1);
      setMediaAdjunta([]);
      setMostrarModal(false);
    }
  };

  const handleRegistrarRPE = async (rpe: number) => {
    if (!checkInActual.id) {
      const nuevoCheckIn: Omit<CheckInEntreno, 'id' | 'createdAt' | 'updatedAt'> = {
        ...checkInActual,
        rpe,
        semaforo:
          configSemaforos
            ? evaluarSemaforo(
                { rpe, dolorLumbar: checkInActual.dolorLumbar, sensaciones: checkInActual.sensaciones },
                configSemaforos
              )
            : checkInActual.semaforo || 'verde',
        serie: serieActual,
        camposPersonalizados: Object.keys(camposPersonalizados).length ? camposPersonalizados : undefined,
        media: mediaAdjunta.length
          ? mediaAdjunta.map((m) => ({
              ...m,
              createdAt: new Date().toISOString(),
            }))
          : undefined,
      } as any;

      const checkInGuardado = await crearCheckIn(nuevoCheckIn);
      if (checkInGuardado) {
        setCheckInActual({ ...checkInActual, id: checkInGuardado.id });
        setRpeRegistrado(rpe);
        setMediaAdjunta([]);
        await cargarDatos();
      }
    } else {
      const semaforoActualizado =
        configSemaforos
          ? evaluarSemaforo(
              { rpe, dolorLumbar: checkInActual.dolorLumbar, sensaciones: checkInActual.sensaciones },
              configSemaforos
            )
          : undefined;
      await actualizarCheckIn(checkInActual.id, { rpe, ...(semaforoActualizado ? { semaforo: semaforoActualizado } : {}) });
      setRpeRegistrado(rpe);
      await cargarDatos();
    }
  };

  const handleAdjuntarMedia: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const nuevos = Array.from(files).slice(0, 6).map((file) => {
      const url = URL.createObjectURL(file);
      const isVideo = file.type.startsWith('video');
      return {
        id: `${file.name}-${Date.now()}`,
        type: isVideo ? 'video' : 'image',
        url,
        thumbnailUrl: isVideo ? undefined : url,
      };
    });
    setMediaAdjunta((prev) => [...prev, ...nuevos].slice(0, 6));
    // reset input
    e.currentTarget.value = '';
  };

  const removeMedia = (id: string) => {
    setMediaAdjunta((prev) => prev.filter((m) => m.id !== id));
  };

  const handleResolverAlerta = async (alertaId: string) => {
    await resolverAlerta(alertaId);
    await cargarDatos();
  };

  // Cargar y gestionar configuración de recordatorios simples
  useEffect(() => {
    const init = async () => {
      if (!clienteId) return;
      const conf = await getConfigRecordatorios('entrenador_demo');
      setConfigRecordatoriosState(conf);
      if (timerRecordatorios) {
        clearInterval(timerRecordatorios);
      }
      if (conf.enabled) {
        const t = iniciarVerificacionRecordatoriosCheckIn('entrenador_demo', clienteId);
        setTimerRecordatorios(t);
      }
    };
    init();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clienteId]);

  const handleGuardarConfigRecordatorios = async (updates: Partial<ConfigRecordatoriosCheckIn>) => {
    if (!configRecordatorios) return;
    const next = { ...configRecordatorios, ...updates };
    await setConfigRecordatorios('entrenador_demo', next);
    setConfigRecordatoriosState(next);
    if (timerRecordatorios) {
      clearInterval(timerRecordatorios);
      setTimerRecordatorios(null);
    }
    if (next.enabled && clienteId) {
      const t = iniciarVerificacionRecordatoriosCheckIn('entrenador_demo', clienteId);
      setTimerRecordatorios(t);
    }
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
    {
      id: 'analytics',
      label: 'Analytics',
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: 'ajustes',
      label: 'Ajustes',
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

            {plantillaActiva && (
              <CamposPersonalizadosCheckIn
                plantilla={plantillaActiva}
                values={camposPersonalizados}
                onChange={setCamposPersonalizados}
              />
            )}

            <RegistradorRPE
              onRegistrar={handleRegistrarRPE}
              valorInicial={rpeRegistrado || checkInActual.rpe}
            />

            {/* Sincronización de wearables */}
            <Card className="p-6 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <h4 className="text-lg font-semibold text-gray-900">Métricas de wearables</h4>
                <div className="flex items-center gap-2">
                  <label className="text-sm">Adjuntar la última muestra al check-in</label>
                  <input
                    type="checkbox"
                    checked={attachLatestWearable}
                    onChange={(e) => setAttachLatestWearable(e.target.checked)}
                  />
                </div>
              </div>
              {!wearableStatus?.linked ? (
                <div className="flex items-center justify-between">
                  <p className="text-sm text-slate-600">
                    No hay un dispositivo vinculado. Vincula un proveedor para sincronizar FC/HRV.
                  </p>
                  <Button
                    onClick={async () => {
                      if (!clienteId) return;
                      await linkWearableSource(clienteId, 'garmin');
                      await cargarDatos();
                    }}
                  >
                    Vincular Garmin (demo)
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm text-slate-700">
                    <span>
                      Vinculado a {wearableStatus.source?.toUpperCase()} • Última sync:{' '}
                      {wearableStatus.lastSyncAt
                        ? new Date(wearableStatus.lastSyncAt).toLocaleString('es-ES')
                        : '—'}
                    </span>
                    <Button
                      onClick={async () => {
                        if (!clienteId) return;
                        const samples = await fetchRecentWearableMetrics(clienteId);
                        setWearableSamples(samples);
                      }}
                      variant="secondary"
                    >
                      Re-sincronizar
                    </Button>
                  </div>
                  {wearableSamples.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="p-3 rounded-lg bg-slate-50">
                        <div className="text-xs text-slate-500">FC (Última)</div>
                        <div className="text-xl font-bold text-slate-800">
                          {wearableSamples[wearableSamples.length - 1].heartRateBpm ?? '—'} bpm
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50">
                        <div className="text-xs text-slate-500">HRV (Última)</div>
                        <div className="text-xl font-bold text-slate-800">
                          {wearableSamples[wearableSamples.length - 1].hrvMs ?? '—'} ms
                        </div>
                      </div>
                      <div className="p-3 rounded-lg bg-slate-50">
                        <div className="text-xs text-slate-500">Capturado</div>
                        <div className="text-sm font-medium text-slate-800">
                          {new Date(
                            wearableSamples[wearableSamples.length - 1].capturedAt
                          ).toLocaleTimeString('es-ES')}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-slate-500">No hay muestras recientes.</div>
                  )}
                  {!!checkInActual.sensaciones && wearableSamples.length > 0 && (
                    <div className="text-xs text-slate-600">
                      {correlateSensationsWithMetrics(
                        checkInActual.sensaciones,
                        wearableSamples
                      ).correlationHint || '—'}
                    </div>
                  )}
                </div>
              )}
            </Card>

            {/* Adjuntar fotos / videos */}
            <Card className="p-6 bg-white shadow-sm">
              <h4 className="text-lg font-semibold text-gray-900 mb-3">Adjuntar medios (técnica/molestias)</h4>
              <div className="flex items-center gap-3">
                <input
                  type="file"
                  accept="image/*,video/*"
                  multiple
                  onChange={handleAdjuntarMedia}
                  className="text-sm"
                />
                <span className="text-xs text-slate-500">Hasta 6 archivos</span>
              </div>
              {mediaAdjunta.length > 0 && (
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  {mediaAdjunta.map((m) => (
                    <div key={m.id} className="relative rounded-lg overflow-hidden border border-slate-200">
                      {m.type === 'image' ? (
                        <img src={m.thumbnailUrl || m.url} alt="adjunto" className="h-24 w-full object-cover" />
                      ) : (
                        <video src={m.url} className="h-24 w-full object-cover" />
                      )}
                      <button
                        type="button"
                        onClick={() => removeMedia(m.id)}
                        className="absolute right-1 top-1 rounded-full bg-white/90 px-2 py-0.5 text-xs text-slate-700 shadow"
                        aria-label="Eliminar adjunto"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </Card>

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

      case 'analytics':
        return (
          <AnalyticsCheckInsVsPlan
            clienteId={clienteId!}
            analytics={analytics}
            objetivos={objetivos}
          />
        );

      case 'ajustes':
        return (
          <div className="space-y-6">
            <Card className="p-6 bg-white shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Recordatorios automáticos de check-in</h3>
                  <p className="text-sm text-slate-600">Envía un recordatorio antes de cada sesión.</p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm">Activar</label>
                  <input
                    type="checkbox"
                    checked={!!configRecordatorios?.enabled}
                    onChange={(e) => handleGuardarConfigRecordatorios({ enabled: e.target.checked })}
                    className="w-5 h-5"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Minutos de anticipación</label>
                  <input
                    type="number"
                    className="w-full rounded-xl ring-1 ring-slate-300 px-3 py-2"
                    value={configRecordatorios?.minutosAnticipacion ?? 60}
                    onChange={(e) =>
                      handleGuardarConfigRecordatorios({ minutosAnticipacion: Number(e.target.value) })
                    }
                    min={5}
                    step={5}
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Canal</label>
                  <select
                    className="w-full rounded-xl ring-1 ring-slate-300 px-3 py-2"
                    value={configRecordatorios?.canal || 'ambos'}
                    onChange={(e) => handleGuardarConfigRecordatorios({ canal: e.target.value as any })}
                  >
                    <option value="push">Push</option>
                    <option value="email">Email</option>
                    <option value="ambos">Ambos</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <label className="text-sm font-medium text-slate-700">Horas silenciosas</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={!!configRecordatorios?.horasSilenciosas?.enabled}
                      onChange={(e) =>
                        handleGuardarConfigRecordatorios({
                          horasSilenciosas: {
                            ...(configRecordatorios?.horasSilenciosas || { start: '22:00', end: '08:00' }),
                            enabled: e.target.checked,
                          },
                        })
                      }
                    />
                    <input
                      type="time"
                      className="rounded-xl ring-1 ring-slate-300 px-3 py-2"
                      value={configRecordatorios?.horasSilenciosas?.start || '22:00'}
                      onChange={(e) =>
                        handleGuardarConfigRecordatorios({
                          horasSilenciosas: {
                            ...(configRecordatorios?.horasSilenciosas || { enabled: true, end: '08:00' }),
                            start: e.target.value,
                          },
                        } as any)
                      }
                    />
                    <span className="text-sm">a</span>
                    <input
                      type="time"
                      className="rounded-xl ring-1 ring-slate-300 px-3 py-2"
                      value={configRecordatorios?.horasSilenciosas?.end || '08:00'}
                      onChange={(e) =>
                        handleGuardarConfigRecordatorios({
                          horasSilenciosas: {
                            ...(configRecordatorios?.horasSilenciosas || { enabled: true, start: '22:00' }),
                            end: e.target.value,
                          },
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Reglas automáticas de ajustes ante alertas */}
            <Card className="p-6 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Reglas automáticas de ajustes</h3>
                  <p className="text-sm text-slate-600">
                    Aplica ajustes en el plan cuando se disparen alertas específicas.
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-sm">Resolver alerta automáticamente</label>
                  <input
                    type="checkbox"
                    checked={!!reglasConfig?.autoResolverAlerta}
                    onChange={async (e) => {
                      if (!clienteId || !reglasConfig) return;
                      const next = { ...reglasConfig, autoResolverAlerta: e.target.checked };
                      const saved = await setConfigReglas(clienteId, next);
                      setReglasConfig(saved);
                    }}
                  />
                </div>
              </div>
              <div className="space-y-3">
                {(reglasConfig?.reglas || []).map((regla: ReglaAutomatica, idx: number) => (
                  <div key={regla.id} className="p-3 border border-slate-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <input
                          type="checkbox"
                          checked={regla.enabled}
                          onChange={async (e) => {
                            if (!clienteId || !reglasConfig) return;
                            const clone = { ...reglasConfig };
                            clone.reglas[idx] = { ...regla, enabled: e.target.checked };
                            const saved = await setConfigReglas(clienteId, clone);
                            setReglasConfig(saved);
                          }}
                        />
                        <div className="text-sm text-slate-700">
                          Si tipo: <span className="font-semibold">{regla.coincidencia.tipo}</span> y
                          severidad: <span className="font-semibold">{regla.coincidencia.severidad}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <label className="text-sm text-slate-600">Ajuste</label>
                        <select
                          className="rounded-xl ring-1 ring-slate-300 px-3 py-2 text-sm"
                          value={regla.ajuste}
                          onChange={async (e) => {
                            if (!clienteId || !reglasConfig) return;
                            const clone = { ...reglasConfig };
                            clone.reglas[idx] = { ...regla, ajuste: e.target.value as any };
                            const saved = await setConfigReglas(clienteId, clone);
                            setReglasConfig(saved);
                          }}
                        >
                          <option value="reducir_intensidad">Reducir intensidad</option>
                          <option value="cambiar_ejercicio">Cambiar ejercicio</option>
                          <option value="aumentar_descanso">Aumentar descanso</option>
                          <option value="mantener">Mantener</option>
                        </select>
                      </div>
                    </div>
                    {!!regla.nota && <div className="text-xs text-slate-500 mt-2">{regla.nota}</div>}
                  </div>
                ))}
                {(!reglasConfig || reglasConfig.reglas.length === 0) && (
                  <div className="text-sm text-slate-500">No hay reglas configuradas.</div>
                )}
              </div>
            </Card>

            <Card className="p-6 bg-white shadow-sm">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">Plantillas de check-in</h3>
                  <p className="text-sm text-slate-600">Crea y asigna plantillas con campos personalizados.</p>
                </div>
                <Button onClick={() => setMostrarGestorPlantillas(true)}>Gestionar plantillas</Button>
              </div>
              {plantillaActiva ? (
                <div className="text-sm text-slate-700">
                  Plantilla activa para este cliente: <span className="font-semibold">{plantillaActiva.nombre}</span>
                </div>
              ) : (
                <div className="text-sm text-slate-500">No hay plantilla activa asignada.</div>
              )}
            </Card>
          </div>
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
      <GestorPlantillasCheckIn
        isOpen={mostrarGestorPlantillas}
        onClose={async () => {
          setMostrarGestorPlantillas(false);
          if (clienteId) {
            const tplAct = await getPlantillaActivaPorCliente(clienteId);
            setPlantillaActiva(tplAct);
          }
        }}
        clienteId={clienteId}
      />
    </div>
  );
};

