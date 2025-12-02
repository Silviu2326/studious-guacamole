import React, { useState } from 'react';
import { ServiceType, SERVICE_LABELS, SERVICE_COLORS } from '../types';
import { Package, X } from 'lucide-react';

interface ServiceTypeSelectorProps {
  value?: ServiceType;
  onChange: (serviceType: ServiceType) => void;
  compact?: boolean;
}

export const ServiceTypeSelector: React.FC<ServiceTypeSelectorProps> = ({
  value,
  onChange,
  compact = false
}) => {
  const [showPicker, setShowPicker] = useState(false);

  const services: ServiceType[] = ['1-1', 'online', 'nutricion', 'combo', 'grupal'];

  const handleSelect = (service: ServiceType) => {
    onChange(service);
    setShowPicker(false);
  };

  if (compact && value) {
    const colors = SERVICE_COLORS[value];
    return (
      <button
        onClick={() => setShowPicker(true)}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium border ${colors.bg} ${colors.text} ${colors.border} hover:opacity-80 transition-opacity`}
      >
        <Package className="w-3 h-3" />
        {SERVICE_LABELS[value]}
      </button>
    );
  }

  return (
    <div className="relative">
      {value ? (
        <button
          onClick={() => setShowPicker(!showPicker)}
          className={`inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border-2 transition-all ${
            SERVICE_COLORS[value].bg
          } ${SERVICE_COLORS[value].text} ${SERVICE_COLORS[value].border}`}
        >
          <Package className="w-4 h-4" />
          {SERVICE_LABELS[value]}
        </button>
      ) : (
        <button
          onClick={() => setShowPicker(true)}
          className="inline-flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium border-2 border-dashed border-gray-300 text-gray-600 hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
        >
          <Package className="w-4 h-4" />
          Seleccionar servicio
        </button>
      )}

      {showPicker && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setShowPicker(false)}
          />
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-xl shadow-xl border border-gray-200 z-50 p-2">
            <div className="space-y-1">
              {services.map(service => {
                const colors = SERVICE_COLORS[service];
                const isSelected = value === service;

                return (
                  <button
                    key={service}
                    onClick={() => handleSelect(service)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                      isSelected
                        ? `${colors.bg} ${colors.text} font-semibold`
                        : 'hover:bg-gray-50 text-gray-700'
                    }`}
                  >
                    <Package className="w-4 h-4" />
                    <span className="flex-1 text-left">{SERVICE_LABELS[service]}</span>
                    {isSelected && (
                      <div className="w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};

