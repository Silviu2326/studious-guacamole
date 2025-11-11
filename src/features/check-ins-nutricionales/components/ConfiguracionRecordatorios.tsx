import React, { useEffect, useState } from 'react';
import { Card, Button, Modal, Input, Select } from '../../../components/componentsreutilizables';
import { Bell, Clock } from 'lucide-react';
import {
  ConfigRecordatoriosCheckInNutricional,
  HorarioComida,
  getConfigRecordatorios,
  setConfigRecordatorios,
  TipoComida,
} from '../api/recordatorios';

interface ConfiguracionRecordatoriosProps {
  isOpen: boolean;
  onClose: () => void;
  entrenadorId: string;
  clienteId: string;
}

const TIPOS_COMIDA: { value: TipoComida; label: string }[] = [
  { value: 'desayuno', label: 'Desayuno' },
  { value: 'almuerzo', label: 'Almuerzo' },
  { value: 'merienda', label: 'Merienda' },
  { value: 'cena', label: 'Cena' },
  { value: 'snack', label: 'Snack' },
];

const DIAS_SEMANA: { value: 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom'; label: string }[] = [
  { value: 'lun', label: 'Lunes' },
  { value: 'mar', label: 'Martes' },
  { value: 'mie', label: 'Miércoles' },
  { value: 'jue', label: 'Jueves' },
  { value: 'vie', label: 'Viernes' },
  { value: 'sab', label: 'Sábado' },
  { value: 'dom', label: 'Domingo' },
];

export const ConfiguracionRecordatorios: React.FC<ConfiguracionRecordatoriosProps> = ({
  isOpen,
  onClose,
  entrenadorId,
  clienteId,
}) => {
  const [config, setConfig] = useState<ConfigRecordatoriosCheckInNutricional | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    if (isOpen) {
      cargarConfig();
    }
  }, [isOpen, entrenadorId, clienteId]);

  const cargarConfig = async () => {
    setCargando(true);
    try {
      const conf = await getConfigRecordatorios(entrenadorId, clienteId);
      setConfig(conf);
    } catch (error) {
      console.error('Error al cargar configuración:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleSave = async () => {
    if (!config) return;
    try {
      await setConfigRecordatorios(entrenadorId, clienteId, config);
      onClose();
    } catch (error) {
      console.error('Error al guardar configuración:', error);
      alert('Error al guardar la configuración');
    }
  };

  const updateHorario = (tipoComida: TipoComida, updates: Partial<HorarioComida>) => {
    if (!config) return;
    setConfig({
      ...config,
      horariosComidas: config.horariosComidas.map((h) =>
        h.tipoComida === tipoComida ? { ...h, ...updates } : h
      ),
    });
  };

  const toggleDia = (dia: 'lun' | 'mar' | 'mie' | 'jue' | 'vie' | 'sab' | 'dom') => {
    if (!config) return;
    const dias = config.dias.includes(dia)
      ? config.dias.filter((d) => d !== dia)
      : [...config.dias, dia];
    setConfig({ ...config, dias });
  };

  if (cargando || !config) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Configuración de Recordatorios">
        <div className="p-4">Cargando...</div>
      </Modal>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Configuración de Recordatorios" size="lg">
      <div className="space-y-6">
        {/* Activar/Desactivar */}
        <Card className="p-4 bg-white">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-semibold text-gray-900">Recordatorios automáticos</h3>
              <p className="text-sm text-slate-600 mt-1">
                Activa recordatorios según el horario de cada comida
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={config.enabled}
                onChange={(e) => setConfig({ ...config, enabled: e.target.checked })}
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>
        </Card>

        {config.enabled && (
          <>
            {/* Horarios de comidas */}
            <Card className="p-4 bg-white">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Horarios de comidas</h3>
              <div className="space-y-3">
                {config.horariosComidas.map((horario) => (
                  <div key={horario.tipoComida} className="flex items-center gap-3 p-3 border rounded-lg">
                    <label className="flex items-center gap-2 cursor-pointer flex-1">
                      <input
                        type="checkbox"
                        checked={horario.activo}
                        onChange={(e) =>
                          updateHorario(horario.tipoComida, { activo: e.target.checked })
                        }
                        className="w-5 h-5"
                      />
                      <span className="text-sm font-medium text-gray-900 min-w-[100px]">
                        {TIPOS_COMIDA.find((t) => t.value === horario.tipoComida)?.label}
                      </span>
                    </label>
                    <div className="flex items-center gap-2">
                      <Clock size={16} className="text-slate-500" />
                      <Input
                        type="time"
                        value={horario.hora}
                        onChange={(e) => updateHorario(horario.tipoComida, { hora: e.target.value })}
                        className="w-32"
                        disabled={!horario.activo}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </Card>

            {/* Configuración general */}
            <Card className="p-4 bg-white">
              <h3 className="text-base font-semibold text-gray-900 mb-4">Configuración general</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Minutos de anticipación
                  </label>
                  <Input
                    type="number"
                    value={config.minutosAnticipacion}
                    onChange={(e) =>
                      setConfig({ ...config, minutosAnticipacion: Number(e.target.value) })
                    }
                    min={0}
                    max={120}
                    className="w-full"
                  />
                  <p className="text-xs text-slate-500 mt-1">
                    Tiempo antes de la hora de la comida para enviar el recordatorio
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Canal de notificación
                  </label>
                  <Select
                    value={config.canal}
                    onChange={(e) =>
                      setConfig({ ...config, canal: e.target.value as 'push' | 'email' | 'ambos' })
                    }
                    options={[
                      { value: 'push', label: 'Notificación push' },
                      { value: 'email', label: 'Email' },
                      { value: 'ambos', label: 'Ambos' },
                    ]}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Días activos
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {DIAS_SEMANA.map((dia) => (
                      <button
                        key={dia.value}
                        onClick={() => toggleDia(dia.value)}
                        className={`px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                          config.dias.includes(dia.value)
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        {dia.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Horas silenciosas */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-slate-700">
                      Horas silenciosas
                    </label>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={config.horasSilenciosas?.enabled || false}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            horasSilenciosas: {
                              ...config.horasSilenciosas,
                              enabled: e.target.checked,
                              start: config.horasSilenciosas?.start || '22:00',
                              end: config.horasSilenciosas?.end || '08:00',
                            },
                          })
                        }
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  {config.horasSilenciosas?.enabled && (
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={config.horasSilenciosas.start}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            horasSilenciosas: {
                              ...config.horasSilenciosas!,
                              start: e.target.value,
                            },
                          })
                        }
                        className="w-32"
                      />
                      <span className="text-sm text-slate-600">a</span>
                      <Input
                        type="time"
                        value={config.horasSilenciosas.end}
                        onChange={(e) =>
                          setConfig({
                            ...config,
                            horasSilenciosas: {
                              ...config.horasSilenciosas!,
                              end: e.target.value,
                            },
                          })
                        }
                        className="w-32"
                      />
                    </div>
                  )}
                </div>
              </div>
            </Card>
          </>
        )}

        {/* Botones */}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={onClose}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>
            <Bell size={18} className="mr-2" />
            Guardar configuración
          </Button>
        </div>
      </div>
    </Modal>
  );
};

