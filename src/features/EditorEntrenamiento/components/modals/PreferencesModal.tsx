import React from 'react';
import { Save, Calendar, Scale, Layout } from 'lucide-react';
import { Modal } from '../../../../components/componentsreutilizables/Modal';
import { Button } from '../../../../components/componentsreutilizables/Button';
import { useUIContext } from '../../context/UIContext';
import { useUserPreferences } from '../../context/UserPreferencesContext';

export const PreferencesModal: React.FC = () => {
  const { isPreferencesModalOpen, setPreferencesModalOpen } = useUIContext();
  const { units, firstDayOfWeek, defaultView, density, autoSave, updatePreferences } = useUserPreferences();

  const handleClose = () => {
    setPreferencesModalOpen(false);
  };

  return (
    <Modal
      isOpen={isPreferencesModalOpen}
      onClose={handleClose}
      title="Preferencias del Editor"
      size="md"
      footer={
        <div className="flex justify-end w-full">
          <Button variant="primary" onClick={handleClose}>
            Cerrar
          </Button>
        </div>
      }
    >
      <div className="space-y-6 p-1">
        {/* Units */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-800 font-medium">
            <Scale size={18} className="text-blue-500" />
            <h4>Unidades de Medida</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updatePreferences({ units: 'metric' })}
              className={`flex items-center justify-center py-3 px-4 rounded-lg border transition-all ${units === 'metric'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              <span className="font-medium">Métrico (kg/km)</span>
            </button>
            <button
              onClick={() => updatePreferences({ units: 'imperial' })}
              className={`flex items-center justify-center py-3 px-4 rounded-lg border transition-all ${units === 'imperial'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              <span className="font-medium">Imperial (lbs/mi)</span>
            </button>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* First Day of Week */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-800 font-medium">
            <Calendar size={18} className="text-blue-500" />
            <h4>Primer día de la semana</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updatePreferences({ firstDayOfWeek: 'monday' })}
              className={`flex items-center justify-center py-3 px-4 rounded-lg border transition-all ${firstDayOfWeek === 'monday'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              <span className="font-medium">Lunes</span>
            </button>
            <button
              onClick={() => updatePreferences({ firstDayOfWeek: 'sunday' })}
              className={`flex items-center justify-center py-3 px-4 rounded-lg border transition-all ${firstDayOfWeek === 'sunday'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              <span className="font-medium">Domingo</span>
            </button>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Default View */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-800 font-medium">
            <Layout size={18} className="text-blue-500" />
            <h4>Vista por defecto</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updatePreferences({ defaultView: 'weekly' })}
              className={`flex items-center justify-center py-3 px-4 rounded-lg border transition-all ${defaultView === 'weekly'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              <span className="font-medium">Semanal</span>
            </button>
            <button
              onClick={() => updatePreferences({ defaultView: 'excel' })}
              className={`flex items-center justify-center py-3 px-4 rounded-lg border transition-all ${defaultView === 'excel'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              <span className="font-medium">Excel (Lista)</span>
            </button>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Layout Density */}
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-gray-800 font-medium">
            <Layout size={18} className="text-blue-500" />
            <h4>Densidad del Diseño</h4>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => updatePreferences({ density: 'comfortable' })}
              className={`flex items-center justify-center py-3 px-4 rounded-lg border transition-all ${density === 'comfortable'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              <span className="font-medium">Cómodo</span>
            </button>
            <button
              onClick={() => updatePreferences({ density: 'compact' })}
              className={`flex items-center justify-center py-3 px-4 rounded-lg border transition-all ${density === 'compact'
                  ? 'bg-blue-50 border-blue-500 text-blue-700 ring-1 ring-blue-500'
                  : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
            >
              <span className="font-medium">Compacto</span>
            </button>
          </div>

          {/* Visual Preview */}
          <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-100">
            <h5 className="text-xs font-medium text-gray-500 mb-3 uppercase tracking-wider">Vista Previa</h5>
            <div className="grid grid-cols-2 gap-4">
              {/* Comfortable Preview */}
              <div className="space-y-2">
                <span className="text-xs text-gray-500 block text-center mb-1">Cómodo</span>
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-4 flex flex-col gap-3">
                  <div className="flex justify-between items-center">
                    <div className="h-4 w-20 bg-gray-200 rounded"></div>
                    <div className="h-4 w-4 bg-gray-100 rounded-full"></div>
                  </div>
                  <div className="h-8 w-full bg-blue-50 rounded border border-blue-100"></div>
                  <div className="h-8 w-full bg-gray-50 rounded border border-gray-100"></div>
                </div>
              </div>

              {/* Compact Preview */}
              <div className="space-y-2">
                <span className="text-xs text-gray-500 block text-center mb-1">Compacto</span>
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-2 flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <div className="h-3 w-16 bg-gray-200 rounded"></div>
                    <div className="h-3 w-3 bg-gray-100 rounded-full"></div>
                  </div>
                  <div className="h-6 w-full bg-blue-50 rounded border border-blue-100"></div>
                  <div className="h-6 w-full bg-gray-50 rounded border border-gray-100"></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className="border-gray-100" />

        {/* Auto Save */}
        <div className="flex items-center justify-between p-1">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${autoSave ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
              <Save size={16} />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Auto-guardado</h4>
              <p className="text-xs text-gray-500">Guardar cambios automáticamente</p>
            </div>
          </div>

          <button
            onClick={() => updatePreferences({ autoSave: !autoSave })}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${autoSave ? 'bg-blue-600' : 'bg-gray-200'}`}
          >
            <span
              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${autoSave ? 'translate-x-6' : 'translate-x-1'}`}
            />
          </button>
        </div>
      </div>
    </Modal>
  );
};
