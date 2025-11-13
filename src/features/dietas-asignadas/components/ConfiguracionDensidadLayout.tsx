import React, { useState, useEffect } from 'react';
import { Modal, Button } from '../../../components/componentsreutilizables';
import { LayoutGrid, Maximize2, Minimize2, Eye } from 'lucide-react';
import type { PreferenciasDensidadLayout, DensidadLayout } from '../types';
import {
  getPreferenciasDensidadLayout,
  guardarPreferenciasDensidadLayout,
  aplicarPreferenciasDensidadLayout,
} from '../api/preferenciasDensidadLayout';
import { useAuth } from '../../../context/AuthContext';

interface ConfiguracionDensidadLayoutProps {
  onClose?: () => void;
}

const densidades: { valor: DensidadLayout; label: string; icono: React.ReactNode; descripcion: string }[] = [
  {
    valor: 'compacto',
    label: 'Compacto',
    icono: <Minimize2 className="w-5 h-5" />,
    descripcion: 'Máximo contenido visible, menos espacio entre elementos',
  },
  {
    valor: 'estandar',
    label: 'Estándar',
    icono: <LayoutGrid className="w-5 h-5" />,
    descripcion: 'Balance entre contenido y espacio (recomendado)',
  },
  {
    valor: 'amplio',
    label: 'Amplio',
    icono: <Maximize2 className="w-5 h-5" />,
    descripcion: 'Más espacio entre elementos, mejor legibilidad',
  },
];

export const ConfiguracionDensidadLayout: React.FC<ConfiguracionDensidadLayoutProps> = ({ onClose }) => {
  const { user } = useAuth();
  const [preferencias, setPreferencias] = useState<PreferenciasDensidadLayout | null>(null);
  const [cargando, setCargando] = useState(true);
  const [guardando, setGuardando] = useState(false);

  useEffect(() => {
    cargarPreferencias();
  }, []);

  const cargarPreferencias = async () => {
    if (!user?.id) return;
    
    setCargando(true);
    try {
      const prefs = await getPreferenciasDensidadLayout(user.id);
      setPreferencias(prefs);
      aplicarPreferenciasDensidadLayout(prefs);
    } catch (error) {
      console.error('Error cargando preferencias de densidad:', error);
    } finally {
      setCargando(false);
    }
  };

  const handleCambiarDensidad = async (densidad: DensidadLayout) => {
    if (!preferencias || !user?.id) return;

    const nuevasPreferencias: PreferenciasDensidadLayout = {
      ...preferencias,
      densidad,
    };
    setPreferencias(nuevasPreferencias);
    aplicarPreferenciasDensidadLayout(nuevasPreferencias);
  };

  const handleGuardar = async () => {
    if (!preferencias || !user?.id) return;

    setGuardando(true);
    try {
      await guardarPreferenciasDensidadLayout(preferencias);
      alert('Preferencias de densidad guardadas correctamente');
      onClose?.();
    } catch (error) {
      console.error('Error guardando preferencias:', error);
      alert('Error al guardar las preferencias. Por favor, intenta de nuevo.');
    } finally {
      setGuardando(false);
    }
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
        <LayoutGrid className="w-5 h-5 text-gray-600" />
        <h3 className="text-lg font-semibold text-gray-900">Personalizar Densidad del Layout</h3>
      </div>

      <p className="text-sm text-gray-600 mb-4">
        Elige cuánto contenido ver a la vez ajustando la densidad del layout. Los cambios se aplican inmediatamente.
      </p>

      {/* Selección de Densidad */}
      <div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {densidades.map((densidad) => (
            <button
              key={densidad.valor}
              onClick={() => handleCambiarDensidad(densidad.valor)}
              className={`p-6 border-2 rounded-lg text-left transition-all ${
                preferencias.densidad === densidad.valor
                  ? 'border-blue-500 bg-blue-50 shadow-md'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  preferencias.densidad === densidad.valor
                    ? 'bg-blue-100 text-blue-600'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {densidad.icono}
                </div>
                <span className="font-semibold text-base">{densidad.label}</span>
              </div>
              <p className="text-sm text-gray-600">{densidad.descripcion}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Vista Previa */}
      <div className="border rounded-lg p-4 bg-gray-50">
        <div className="flex items-center gap-2 mb-3">
          <Eye className="w-4 h-4 text-gray-600" />
          <h4 className="text-sm font-medium text-gray-700">Vista Previa</h4>
        </div>
        <div className={`space-y-2 ${preferencias.densidad === 'compacto' ? 'p-2' : preferencias.densidad === 'amplio' ? 'p-4' : 'p-3'}`}>
          <div className={`bg-white rounded border ${preferencias.densidad === 'compacto' ? 'p-2' : preferencias.densidad === 'amplio' ? 'p-4' : 'p-3'}`}>
            <div className={`font-medium ${preferencias.densidad === 'compacto' ? 'text-sm' : preferencias.densidad === 'amplio' ? 'text-lg' : 'text-base'}`}>
              Ejemplo de Card
            </div>
            <div className={`text-gray-600 mt-1 ${preferencias.densidad === 'compacto' ? 'text-xs' : preferencias.densidad === 'amplio' ? 'text-base' : 'text-sm'}`}>
              Este es un ejemplo de cómo se verá el contenido con la densidad seleccionada.
            </div>
          </div>
          <div className={`bg-white rounded border ${preferencias.densidad === 'compacto' ? 'p-2' : preferencias.densidad === 'amplio' ? 'p-4' : 'p-3'}`}>
            <div className={`font-medium ${preferencias.densidad === 'compacto' ? 'text-sm' : preferencias.densidad === 'amplio' ? 'text-lg' : 'text-base'}`}>
              Otro Ejemplo
            </div>
            <div className={`text-gray-600 mt-1 ${preferencias.densidad === 'compacto' ? 'text-xs' : preferencias.densidad === 'amplio' ? 'text-base' : 'text-sm'}`}>
              Observa el espaciado y el tamaño de los elementos.
            </div>
          </div>
        </div>
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

