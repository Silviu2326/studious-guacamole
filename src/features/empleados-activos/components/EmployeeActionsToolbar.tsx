// Barra de herramientas con búsqueda, filtros y acciones principales

import React from 'react';
import { Card, Button } from '../../../components/componentsreutilizables';
import { Search, Upload, Download, X, ChevronDown } from 'lucide-react';
import { EmployeeFilters } from '../types';

interface EmployeeActionsToolbarProps {
  filters: EmployeeFilters;
  onFilterChange: (newFilters: Partial<EmployeeFilters>) => void;
  onImportClick: () => void;
  onExportClick: () => void;
  isExporting?: boolean;
}

// Componente LightInput interno para inputs sin dark mode
const LightInput: React.FC<{
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
}> = ({ leftIcon, rightIcon, placeholder, value, onChange, className = '' }) => (
  <div className={`relative ${className}`}>
    {leftIcon && (
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
        <span className="text-slate-400">{leftIcon}</span>
      </span>
    )}
    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className={[
        'w-full rounded-xl bg-white text-slate-900 placeholder-slate-400',
        'ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400',
        leftIcon ? 'pl-10' : 'pl-3',
        rightIcon ? 'pr-10' : 'pr-3',
        'py-2.5'
      ].join(' ')}
    />
    {rightIcon && (
      <span className="absolute inset-y-0 right-0 flex items-center pr-3">
        {rightIcon}
      </span>
    )}
  </div>
);

// Componente LightSelect interno para selects sin dark mode
const LightSelect: React.FC<{
  options: { value: string; label: string }[];
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  placeholder?: string;
  className?: string;
}> = ({ options, value, onChange, placeholder, className = '' }) => (
  <div className={`relative ${className}`}>
    <select
      value={value}
      onChange={onChange}
      className={[
        'w-full appearance-none rounded-xl bg-white text-slate-900',
        'ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400',
        'py-2.5 pl-3 pr-9'
      ].join(' ')}
    >
      {placeholder && <option value="">{placeholder}</option>}
      {options.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
    <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" />
  </div>
);

export const EmployeeActionsToolbar: React.FC<EmployeeActionsToolbarProps> = ({
  filters,
  onFilterChange,
  onImportClick,
  onExportClick,
  isExporting = false,
}) => {
  const statusOptions = [
    { value: '', label: 'Todos los estados' },
    { value: 'active', label: 'Activos' },
    { value: 'inactive', label: 'Inactivos' },
  ];

  const filtrosActivos = Object.values(filters).filter(
    v => v !== undefined && v !== '' && v !== null
  ).length;

  return (
    <Card className="mb-6 bg-white shadow-sm">
      <div className="space-y-4">
        {/* Toolbar superior */}
        <div className="flex items-center justify-end">
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={onImportClick}
              className="whitespace-nowrap"
            >
              <Upload size={20} className="mr-2" />
              Importar
            </Button>
            
            <Button
              variant="secondary"
              onClick={onExportClick}
              loading={isExporting}
              className="whitespace-nowrap"
            >
              <Download size={20} className="mr-2" />
              Exportar
            </Button>
          </div>
        </div>

        {/* Barra de búsqueda */}
        <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex gap-4">
            <div className="flex-1">
              <LightInput
                placeholder="Buscar por nombre, apellido o email..."
                value={filters.search || ''}
                onChange={(e) => onFilterChange({ search: e.target.value, page: 1 })}
                leftIcon={<Search size={20} />}
                rightIcon={
                  filters.search ? (
                    <button
                      onClick={() => onFilterChange({ search: '', page: 1 })}
                      className="text-slate-400 hover:text-slate-600"
                    >
                      <X size={16} />
                    </button>
                  ) : undefined
                }
              />
            </div>
            
            <div className="w-48">
              <LightSelect
                options={statusOptions}
                value={filters.status || ''}
                onChange={(e) => onFilterChange({ status: e.target.value as any || undefined, page: 1 })}
                placeholder="Filtrar por estado"
              />
            </div>
          </div>
        </div>

        {/* Resumen de resultados */}
        <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
          <span>Se muestran todos los empleados</span>
          {filtrosActivos > 0 && (
            <span>{filtrosActivos} filtros aplicados</span>
          )}
        </div>
      </div>
    </Card>
  );
};

