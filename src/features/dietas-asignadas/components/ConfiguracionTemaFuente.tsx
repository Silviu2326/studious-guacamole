import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../../../components/componentsreutilizables';
import { Palette, Type, Settings, Eye, Moon, Sun, Monitor, BookOpen, Contrast, Accessibility } from 'lucide-react';
import type { PreferenciasTemaFuente, TemaColor, TamañoFuente, ConfiguracionAccesibilidad } from '../types';
import {
  getPreferenciasTemaFuente,
  guardarPreferenciasTemaFuente,
  aplicarPreferenciasTemaFuente,
} from '../api/preferenciasTemaFuente';
import {
  getConfiguracionAccesibilidad,
  guardarConfiguracionAccesibilidad,
  aplicarConfiguracionAccesibilidad,
} from '../api/accesibilidad';
import { useAuth } from '../../../context/AuthContext';

interface ConfiguracionTemaFuenteProps {
  onClose?: () => void;
}

const temas: { valor: TemaColor; label: string; icono: React.ReactNode; descripcion: string }[] = [
  {
    valor: 'claro',
    label: 'Claro',
    icono: <Sun className="w-5 h-5" />,
    descripcion: 'Tema claro estándar',
  },
  {
    valor: 'oscuro',
    label: 'Oscuro',
    icono: <Moon className="w-5 h-5" />,
    descripcion: 'Tema oscuro para reducir fatiga visual',
  },
  {
    valor: 'auto',
    label: 'Automático',
    icono: <Monitor className="w-5 h-5" />,
    descripcion: 'Sigue la preferencia del sistema',
  },
  {
    valor: 'sepia',
    label: 'Sepia',
    icono: <BookOpen className="w-5 h-5" />,
    descripcion: 'Tono cálido para lectura prolongada',
  },
  {
    valor: 'alto-contraste',
    label: 'Alto Contraste',
    icono: <Contrast className="w-5 h-5" />,
    descripcion: 'Máximo contraste para mejor legibilidad',
  },
];

const tamañosFuente: { valor: TamañoFuente; label: string; tamaño: string }[] = [
  { valor: 'pequeño', label: 'Pequeño', tamaño: '14px' },
  { valor: 'mediano', label: 'Mediano', tamaño: '16px' },
  { valor: 'grande', label: 'Grande', tamaño: '18px' },
  { valor: 'muy-grande', label: 'Muy Grande', tamaño: '20px' },
];

export const ConfiguracionTemaFuente: React.FC<ConfiguracionTemaFuenteProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [preferencias, setPreferencias] = useState<PreferenciasTemaFuente | null>(null);
  const [configAccesibilidad, setConfigAccesibilidad] = useState<ConfiguracionAccesibilidad | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [mostrarAvanzado, setMostrarAvanzado] = useState(false);
  const [mostrarAccesibilidad, setMostrarAccesibilidad] = useState(false);

  useEffect(() => {
    cargarPreferencias();
  }, []);

  const cargarPreferencias = async () => {
    if (!user?.id) return;
    
    setCargando(true);
    try {
      const [prefs, accesibilidad] = await Promise.all([
        getPreferenciasTemaFuente(user.id),
        getConfiguracionAccesibilidad(user.id),
      ]);
      setPreferencias(prefs);
      setConfigAccesibilidad(accesibilidad);
      aplicarPreferenciasTemaFuente(prefs);
      aplicarConfiguracionAccesibilidad(accesibilidad);
    } catch (error) {
      console.error('Error cargando preferencias:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleCambiarTema = async (tema: TemaColor) => {
    if (!preferencias || !user?.id) return;

    const nuevasPreferencias: PreferenciasTemaFuente = {
      ...preferencias,
      tema,
    };
    setPreferencias(nuevasPreferencias);
    aplicarPreferenciasTemaFuente(nuevasPreferencias);
  };

  const handleCambiarTamañoFuente = async (tamañoFuente: TamañoFuente) => {
    if (!preferencias || !user?.id) return;

    const nuevasPreferencias: PreferenciasTemaFuente = {
      ...preferencias,
      tamañoFuente,
    };
    setPreferencias(nuevasPreferencias);
    aplicarPreferenciasTemaFuente(nuevasPreferencias);
  };

  const handleGuardar = async () => {
    if (!preferencias || !configAccesibilidad || !user?.id) return;

    setGuardando(true);
    try {
      await Promise.all([
        guardarPreferenciasTemaFuente(preferencias),
        guardarConfiguracionAccesibilidad(configAccesibilidad),
      ]);
      alert('Preferencias guardadas correctamente');
      onClose?.();
    } catch (error) {
      console.error('Error guardando preferencias:', error);
      alert('Error al guardar las preferencias. Por favor, intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
  };

  const handleCambiarModoAltoContraste = async (activado: boolean) => {
    if (!configAccesibilidad || !user?.id) return;
    
    const nuevaConfig = {
      ...configAccesibilidad,
      modoAltoContraste: activado,
    };
    setConfigAccesibilidad(nuevaConfig);
    aplicarConfiguracionAccesibilidad(nuevaConfig);
  };

  const handleCambiarSoporteLectorPantalla = async (activado: boolean) => {
    if (!configAccesibilidad || !user?.id) return;
    
    const nuevaConfig = {
      ...configAccesibilidad,
      soporteLectorPantalla: activado,
    };
    setConfigAccesibilidad(nuevaConfig);
    aplicarConfiguracionAccesibilidad(nuevaConfig);
  };

  const handleCambiarAnuncioLectorPantalla = (tipo: keyof ConfiguracionAccesibilidad['anunciosLectorPantalla'], valor: boolean) => {
    if (!configAccesibilidad) return;
    
    setConfigAccesibilidad({
      ...configAccesibilidad,
      anunciosLectorPantalla: {
        ...configAccesibilidad.anunciosLectorPantalla,
        [tipo]: valor,
      },
    });
  };

  const handleCambioAvanzado = (campo: string, valor: any) => {
    if (!preferencias) return;

    setPreferencias({
      ...preferencias,
      configuracionAvanzada: {
        ...preferencias.configuracionAvanzada,
        [campo]: valor,
      },
    });
  };

  if (cargando) {
    return (
      <div className="p-4 text-center">
        <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-sm text-gray-600">Cargando preferencias...</p>
      </div>
    );
  }

  if (!preferencias) {
    return (
      <div className="p-4 text-center">
        <p className="text-gray-600">Error al cargar las preferencias.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-2 mb-4">
        <Settings className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Configuración de Tema y Fuente</h3>
      </div>

      {/* Selección de Tema */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Palette className="w-4 h-4 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Tema de Color</label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {temas.map((tema) => (
            <button
              key={tema.valor}
              onClick={() => handleCambiarTema(tema.valor)}
              className={`p-4 border-2 rounded-lg text-left transition-all ${
                preferencias.tema === tema.valor
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center gap-2 mb-2">
                {tema.icono}
                <span className="font-medium text-sm">{tema.label}</span>
              </div>
              <p className="text-xs text-gray-600">{tema.descripcion}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Selección de Tamaño de Fuente */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <Type className="w-4 h-4 text-gray-600" />
          <label className="text-sm font-medium text-gray-700">Tamaño de Fuente</label>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {tamañosFuente.map((tamaño) => (
            <button
              key={tamaño.valor}
              onClick={() => handleCambiarTamañoFuente(tamaño.valor)}
              className={`p-4 border-2 rounded-lg text-center transition-all ${
                preferencias.tamañoFuente === tamaño.valor
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div
                className="font-medium mb-1"
                style={{ fontSize: tamaño.tamaño }}
              >
                Aa
              </div>
              <div className="text-xs text-gray-600">{tamaño.label}</div>
              <div className="text-xs text-gray-500 mt-1">{tamaño.tamaño}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Vista Previa */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Vista Previa</h4>
        <div className="space-y-2">
          <p className="text-sm">
            Este es un ejemplo de cómo se verá el texto con la configuración seleccionada.
          </p>
          <p className="text-sm font-medium">
            Texto en negrita para ver el contraste.
          </p>
          <p className="text-xs text-gray-600">
            Texto más pequeño para verificar la legibilidad.
          </p>
        </div>
      </div>

      {/* Configuración Avanzada */}
      <div>
        <button
          onClick={() => setMostrarAvanzado(!mostrarAvanzado)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <Eye className="w-4 h-4" />
          {mostrarAvanzado ? 'Ocultar' : 'Mostrar'} configuración avanzada
        </button>

        {mostrarAvanzado && (
          <div className="mt-4 space-y-4 p-4 border rounded-lg bg-gray-50">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tamaño de fuente personalizado (px)
              </label>
              <input
                type="number"
                min="12"
                max="24"
                value={preferencias.configuracionAvanzada?.tamañoFuentePersonalizado || 16}
                onChange={(e) =>
                  handleCambioAvanzado('tamañoFuentePersonalizado', parseInt(e.target.value))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Espaciado entre líneas (1.0 - 2.0)
              </label>
              <input
                type="number"
                min="1.0"
                max="2.0"
                step="0.1"
                value={preferencias.configuracionAvanzada?.espaciadoLinea || 1.5}
                onChange={(e) =>
                  handleCambioAvanzado('espaciadoLinea', parseFloat(e.target.value))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraste (1.0 - 3.0)
              </label>
              <input
                type="number"
                min="1.0"
                max="3.0"
                step="0.1"
                value={preferencias.configuracionAvanzada?.contraste || 1.0}
                onChange={(e) =>
                  handleCambioAvanzado('contraste', parseFloat(e.target.value))
                }
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color de fondo personalizado (hex)
              </label>
              <input
                type="color"
                value={preferencias.configuracionAvanzada?.colorFondo || '#ffffff'}
                onChange={(e) => handleCambioAvanzado('colorFondo', e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color de texto personalizado (hex)
              </label>
              <input
                type="color"
                value={preferencias.configuracionAvanzada?.colorTexto || '#000000'}
                onChange={(e) => handleCambioAvanzado('colorTexto', e.target.value)}
                className="w-full h-10 border border-gray-300 rounded-lg"
              />
            </div>
          </div>
        )}
      </div>

      {/* Configuración de Accesibilidad */}
      <div className="border-t pt-6">
        <button
          onClick={() => setMostrarAccesibilidad(!mostrarAccesibilidad)}
          className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900 mb-4"
        >
          <Accessibility className="w-4 h-4" />
          {mostrarAccesibilidad ? 'Ocultar' : 'Mostrar'} configuración de accesibilidad
        </button>

        {mostrarAccesibilidad && configAccesibilidad && (
          <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Modo Alto Contraste</h4>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Activa el modo de alto contraste para mejorar la legibilidad
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configAccesibilidad.modoAltoContraste}
                    onChange={(e) => handleCambiarModoAltoContraste(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-3">Soporte para Lectores de Pantalla</h4>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-gray-600">
                  Activa el soporte mejorado para lectores de pantalla
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={configAccesibilidad.soporteLectorPantalla}
                    onChange={(e) => handleCambiarSoporteLectorPantalla(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {configAccesibilidad.soporteLectorPantalla && (
                <div className="ml-4 space-y-3 mt-3">
                  <div className="text-xs font-medium text-gray-600 mb-2">Anuncios del lector de pantalla:</div>
                  
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={configAccesibilidad.anunciosLectorPantalla.cambiosEstado}
                      onChange={(e) => handleCambiarAnuncioLectorPantalla('cambiosEstado', e.target.checked)}
                      className="rounded"
                    />
                    <span>Anunciar cambios de estado (guardado, errores, etc.)</span>
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={configAccesibilidad.anunciosLectorPantalla.navegacion}
                      onChange={(e) => handleCambiarAnuncioLectorPantalla('navegacion', e.target.checked)}
                      className="rounded"
                    />
                    <span>Anunciar navegación entre secciones</span>
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={configAccesibilidad.anunciosLectorPantalla.interacciones}
                      onChange={(e) => handleCambiarAnuncioLectorPantalla('interacciones', e.target.checked)}
                      className="rounded"
                    />
                    <span>Anunciar interacciones (clic, hover, etc.)</span>
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={configAccesibilidad.anunciosLectorPantalla.contenidoDinamico}
                      onChange={(e) => handleCambiarAnuncioLectorPantalla('contenidoDinamico', e.target.checked)}
                      className="rounded"
                    />
                    <span>Anunciar cambios de contenido dinámico</span>
                  </label>

                  <div className="text-xs font-medium text-gray-600 mt-4 mb-2">Etiquetas ARIA:</div>
                  
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={configAccesibilidad.etiquetasARIA.usarLabelsDescriptivos}
                      onChange={(e) => {
                        setConfigAccesibilidad({
                          ...configAccesibilidad,
                          etiquetasARIA: {
                            ...configAccesibilidad.etiquetasARIA,
                            usarLabelsDescriptivos: e.target.checked,
                          },
                        });
                      }}
                      className="rounded"
                    />
                    <span>Usar labels descriptivos</span>
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={configAccesibilidad.etiquetasARIA.usarLandmarks}
                      onChange={(e) => {
                        setConfigAccesibilidad({
                          ...configAccesibilidad,
                          etiquetasARIA: {
                            ...configAccesibilidad.etiquetasARIA,
                            usarLandmarks: e.target.checked,
                          },
                        });
                      }}
                      className="rounded"
                    />
                    <span>Usar landmarks ARIA</span>
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={configAccesibilidad.etiquetasARIA.usarLiveRegions}
                      onChange={(e) => {
                        setConfigAccesibilidad({
                          ...configAccesibilidad,
                          etiquetasARIA: {
                            ...configAccesibilidad.etiquetasARIA,
                            usarLiveRegions: e.target.checked,
                          },
                        });
                      }}
                      className="rounded"
                    />
                    <span>Usar live regions para anuncios dinámicos</span>
                  </label>

                  <div className="text-xs font-medium text-gray-600 mt-4 mb-2">Navegación por teclado:</div>
                  
                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={configAccesibilidad.navegacionTeclado.skipLinks}
                      onChange={(e) => {
                        setConfigAccesibilidad({
                          ...configAccesibilidad,
                          navegacionTeclado: {
                            ...configAccesibilidad.navegacionTeclado,
                            skipLinks: e.target.checked,
                          },
                        });
                      }}
                      className="rounded"
                    />
                    <span>Mostrar enlaces para saltar al contenido</span>
                  </label>

                  <label className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={configAccesibilidad.navegacionTeclado.focusVisible}
                      onChange={(e) => {
                        setConfigAccesibilidad({
                          ...configAccesibilidad,
                          navegacionTeclado: {
                            ...configAccesibilidad.navegacionTeclado,
                            focusVisible: e.target.checked,
                          },
                        });
                      }}
                      className="rounded"
                    />
                    <span>Mostrar indicador de foco claramente</span>
                  </label>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Botones de acción */}
      <div className="flex justify-end gap-2 pt-4 border-t">
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button onClick={handleGuardar} disabled={guardando}>
          {guardando ? 'Guardando...' : 'Guardar Preferencias'}
        </Button>
      </div>
    </div>
  );
};

