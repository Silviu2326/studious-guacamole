import React from 'react';
import { ModuleConfig } from '../api/personalization';
import { ToggleLeft, ToggleRight } from 'lucide-react';

interface EngineSettingsModuleProps {
  title: string;
  config: ModuleConfig;
  onConfigChange: (newConfig: ModuleConfig) => void;
}

export const EngineSettingsModule: React.FC<EngineSettingsModuleProps> = ({
  title,
  config,
  onConfigChange
}) => {
  const handleToggle = () => {
    onConfigChange({ ...config, enabled: !config.enabled });
  };

  const handleSliderChange = (field: keyof ModuleConfig, value: number) => {
    onConfigChange({ ...config, [field]: value });
  };

  const handleCheckboxChange = (field: keyof ModuleConfig, checked: boolean) => {
    onConfigChange({ ...config, [field]: checked });
  };

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        <button onClick={handleToggle} className="p-2">
          {config.enabled ? (
            <ToggleRight className="w-8 h-8 text-green-600" />
          ) : (
            <ToggleLeft className="w-8 h-8 text-gray-400" />
          )}
        </button>
      </div>

      {config.enabled && (
        <div className="space-y-4 pt-4 border-t border-gray-200">
          {/* Max Weight Increase Percent */}
          {config.maxWeightIncreasePercent !== undefined && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Aumento máximo de peso semanal
                </label>
                <span className="text-sm font-bold text-purple-600">
                  {config.maxWeightIncreasePercent}%
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="20"
                value={config.maxWeightIncreasePercent}
                onChange={(e) => handleSliderChange('maxWeightIncreasePercent', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>5%</span>
                <span>20%</span>
              </div>
            </div>
          )}

          {/* Review Required */}
          {config.reviewRequired !== undefined && (
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Requerir revisión manual
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  Todas las sugerencias deben ser aprobadas antes de aplicarse
                </p>
              </div>
              <button
                onClick={() => handleCheckboxChange('reviewRequired', !config.reviewRequired)}
                className="p-2"
              >
                {config.reviewRequired ? (
                  <ToggleRight className="w-8 h-8 text-green-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-400" />
                )}
              </button>
            </div>
          )}

          {/* Max Offers Per Month */}
          {config.maxOffersPerMonth !== undefined && (
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Máximo de ofertas por mes
                </label>
                <span className="text-sm font-bold text-purple-600">
                  {config.maxOffersPerMonth}
                </span>
              </div>
              <input
                type="range"
                min="1"
                max="5"
                value={config.maxOffersPerMonth}
                onChange={(e) => handleSliderChange('maxOffersPerMonth', parseInt(e.target.value))}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-600 mt-1">
                <span>1</span>
                <span>5</span>
              </div>
            </div>
          )}

          {/* Auto Send */}
          {config.autoSend !== undefined && (
            <div className="flex items-center justify-between">
              <div>
                <label className="text-sm font-medium text-gray-700">
                  Envío automático
                </label>
                <p className="text-xs text-gray-600 mt-1">
                  Aplicar sugerencias sin revisión manual
                </p>
              </div>
              <button
                onClick={() => handleCheckboxChange('autoSend', !config.autoSend)}
                className="p-2"
              >
                {config.autoSend ? (
                  <ToggleRight className="w-8 h-8 text-green-600" />
                ) : (
                  <ToggleLeft className="w-8 h-8 text-gray-400" />
                )}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

