import React, { useState, useEffect } from 'react';
import { AccessibilityConfig, ThemeMode, DensityMode } from '../types';
import { getAccessibilityConfig, updateAccessibilityConfig, applyAccessibilityConfig } from '../api/accessibility';
import { useAuth } from '../../../context/AuthContext';
import { Modal, Button, Select } from '../../../components/componentsreutilizables';
import { Moon, Sun, Monitor, Layout, Eye, Volume2, Settings, Check } from 'lucide-react';

interface AccessibilitySettingsProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AccessibilitySettings: React.FC<AccessibilitySettingsProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  const [config, setConfig] = useState<AccessibilityConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isOpen && user?.id) {
      loadConfig();
    }
  }, [isOpen, user?.id]);

  const loadConfig = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const loadedConfig = await getAccessibilityConfig(user.id);
      setConfig(loadedConfig);
      applyAccessibilityConfig(loadedConfig);
    } catch (error) {
      console.error('Error loading accessibility config:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!config || !user?.id) return;

    setSaving(true);
    try {
      await updateAccessibilityConfig(user.id, config);
      onClose();
    } catch (error) {
      console.error('Error saving accessibility config:', error);
      alert('Error al guardar la configuración');
    } finally {
      setSaving(false);
    }
  };

  const handleThemeChange = (theme: ThemeMode) => {
    if (!config) return;
    setConfig({ ...config, theme });
    // Aplicar inmediatamente para preview
    applyAccessibilityConfig({ ...config, theme });
  };

  const handleDensityChange = (density: DensityMode) => {
    if (!config) return;
    setConfig({ ...config, density });
    applyAccessibilityConfig({ ...config, density });
  };

  const handleScreenReaderToggle = (enabled: boolean) => {
    if (!config) return;
    setConfig({
      ...config,
      screenReaderSupport: {
        ...config.screenReaderSupport,
        enabled,
      },
    });
  };

  const handleScreenReaderOptionChange = (option: 'announceChanges' | 'announceProgress' | 'verboseMode', value: boolean) => {
    if (!config) return;
    setConfig({
      ...config,
      screenReaderSupport: {
        ...config.screenReaderSupport,
        [option]: value,
      },
    });
  };

  const handleHighContrastToggle = (enabled: boolean) => {
    if (!config) return;
    setConfig({ ...config, highContrast: enabled });
    applyAccessibilityConfig({ ...config, highContrast: enabled });
  };

  const handleReducedMotionToggle = (enabled: boolean) => {
    if (!config) return;
    setConfig({ ...config, reducedMotion: enabled });
    applyAccessibilityConfig({ ...config, reducedMotion: enabled });
  };

  const handleFontSizeChange = (fontSize: AccessibilityConfig['fontSize']) => {
    if (!config) return;
    setConfig({ ...config, fontSize });
    applyAccessibilityConfig({ ...config, fontSize });
  };

  if (loading || !config) {
    return (
      <Modal isOpen={isOpen} onClose={onClose} title="Configuración de Accesibilidad" size="lg">
        <div className="p-8 text-center">
          <div className="text-gray-500">Cargando configuración...</div>
        </div>
      </Modal>
    );
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Configuración de Accesibilidad"
      size="lg"
      footer={
        <div className="flex gap-3">
          <Button variant="secondary" onClick={onClose} disabled={saving}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSave} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar Configuración'}
          </Button>
        </div>
      }
    >
      <div className="space-y-8">
        {/* Modo Oscuro */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Moon className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Modo Oscuro</h3>
          </div>
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => handleThemeChange('light')}
              className={`p-4 rounded-lg border-2 transition-all ${
                config.theme === 'light'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Sun className={`w-6 h-6 mx-auto mb-2 ${config.theme === 'light' ? 'text-blue-600' : 'text-gray-400'}`} />
              <div className={`text-sm font-medium ${config.theme === 'light' ? 'text-blue-900' : 'text-gray-700'}`}>
                Claro
              </div>
            </button>
            <button
              onClick={() => handleThemeChange('dark')}
              className={`p-4 rounded-lg border-2 transition-all ${
                config.theme === 'dark'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Moon className={`w-6 h-6 mx-auto mb-2 ${config.theme === 'dark' ? 'text-blue-600' : 'text-gray-400'}`} />
              <div className={`text-sm font-medium ${config.theme === 'dark' ? 'text-blue-900' : 'text-gray-700'}`}>
                Oscuro
              </div>
            </button>
            <button
              onClick={() => handleThemeChange('auto')}
              className={`p-4 rounded-lg border-2 transition-all ${
                config.theme === 'auto'
                  ? 'border-blue-600 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <Monitor className={`w-6 h-6 mx-auto mb-2 ${config.theme === 'auto' ? 'text-blue-600' : 'text-gray-400'}`} />
              <div className={`text-sm font-medium ${config.theme === 'auto' ? 'text-blue-900' : 'text-gray-700'}`}>
                Automático
              </div>
            </button>
          </div>
        </div>

        {/* Control de Densidad */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Layout className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Control de Densidad</h3>
          </div>
          <Select
            value={config.density}
            onChange={(e) => handleDensityChange(e.target.value as DensityMode)}
            options={[
              { value: 'compact', label: 'Compacto - Más información en menos espacio' },
              { value: 'comfortable', label: 'Cómodo - Espaciado equilibrado (recomendado)' },
              { value: 'spacious', label: 'Espacioso - Más espacio entre elementos' },
            ]}
          />
          <p className="text-xs text-gray-500 mt-2">
            Ajusta el espaciado entre elementos para una experiencia más cómoda
          </p>
        </div>

        {/* Soporte para Lectores de Pantalla */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Volume2 className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Soporte para Lectores de Pantalla</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Habilitar soporte</h4>
                <p className="text-xs text-gray-600">
                  Activa el soporte para lectores de pantalla y tecnologías asistivas
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.screenReaderSupport.enabled}
                  onChange={(e) => handleScreenReaderToggle(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {config.screenReaderSupport.enabled && (
              <div className="space-y-3 pl-4 border-l-2 border-blue-200">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Anunciar cambios dinámicos</h4>
                    <p className="text-xs text-gray-600">Anuncia automáticamente cambios en la interfaz</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.screenReaderSupport.announceChanges}
                      onChange={(e) => handleScreenReaderOptionChange('announceChanges', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Anunciar cambios de progreso</h4>
                    <p className="text-xs text-gray-600">Anuncia actualizaciones de progreso de objetivos</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.screenReaderSupport.announceProgress}
                      onChange={(e) => handleScreenReaderOptionChange('announceProgress', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900">Modo verboso</h4>
                    <p className="text-xs text-gray-600">Proporciona descripciones más detalladas</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={config.screenReaderSupport.verboseMode}
                      onChange={(e) => handleScreenReaderOptionChange('verboseMode', e.target.checked)}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                  </label>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Configuración Adicional */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Settings className="w-5 h-5 text-gray-600" />
            <h3 className="text-lg font-semibold text-gray-900">Configuración Adicional</h3>
          </div>

          <div className="space-y-4">
            {/* Alto Contraste */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Alto Contraste</h4>
                <p className="text-xs text-gray-600">Mejora la visibilidad con mayor contraste</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.highContrast}
                  onChange={(e) => handleHighContrastToggle(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Movimiento Reducido */}
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
              <div>
                <h4 className="text-sm font-medium text-gray-900 mb-1">Reducir Movimiento</h4>
                <p className="text-xs text-gray-600">Reduce animaciones y transiciones</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={config.reducedMotion}
                  onChange={(e) => handleReducedMotionToggle(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            {/* Tamaño de Fuente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Tamaño de Fuente</label>
              <Select
                value={config.fontSize}
                onChange={(e) => handleFontSizeChange(e.target.value as AccessibilityConfig['fontSize'])}
                options={[
                  { value: 'small', label: 'Pequeño (14px)' },
                  { value: 'medium', label: 'Mediano (16px) - Recomendado' },
                  { value: 'large', label: 'Grande (18px)' },
                  { value: 'extra-large', label: 'Muy Grande (20px)' },
                ]}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

