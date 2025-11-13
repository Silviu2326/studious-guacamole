import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../../../components/componentsreutilizables';
import { 
  Zap, 
  Target, 
  Sparkles, 
  FileDown, 
  RefreshCw, 
  ChevronDown 
} from 'lucide-react';

interface QuickAccessMenuProps {
  onCreateObjective: () => void;
  onGenerateAIPlan: () => void;
  onExportReport: () => void;
  onUpdateData: () => void;
  isUpdating?: boolean;
}

export const QuickAccessMenu: React.FC<QuickAccessMenuProps> = ({
  onCreateObjective,
  onGenerateAIPlan,
  onExportReport,
  onUpdateData,
  isUpdating = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const menuItems = [
    {
      id: 'create-objective',
      label: 'Crear Objetivo',
      icon: Target,
      onClick: () => {
        onCreateObjective();
        setIsOpen(false);
      },
      description: 'Crear un nuevo objetivo de rendimiento',
    },
    {
      id: 'generate-ai-plan',
      label: 'Generar Plan de Acción IA',
      icon: Sparkles,
      onClick: () => {
        onGenerateAIPlan();
        setIsOpen(false);
      },
      description: 'Generar un plan de acción con inteligencia artificial',
    },
    {
      id: 'export-report',
      label: 'Exportar Reporte',
      icon: FileDown,
      onClick: () => {
        onExportReport();
        setIsOpen(false);
      },
      description: 'Exportar reporte de rendimiento',
    },
    {
      id: 'update-data',
      label: 'Actualizar Datos',
      icon: RefreshCw,
      onClick: () => {
        onUpdateData();
        setIsOpen(false);
      },
      description: 'Actualizar todos los datos',
      loading: isUpdating,
    },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="primary"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        leftIcon={<Zap size={18} />}
        className="flex items-center gap-2"
      >
        Accesos Rápidos
        <ChevronDown 
          size={16} 
          className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} 
        />
      </Button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 bg-white border border-slate-200 rounded-xl shadow-lg z-50 overflow-hidden">
          <div className="p-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={item.onClick}
                  disabled={item.loading}
                  className="w-full flex items-start gap-3 px-3 py-2.5 rounded-lg hover:bg-blue-50 transition-colors text-left group"
                >
                  <div className={`mt-0.5 ${item.loading ? 'animate-spin' : ''}`}>
                    <Icon 
                      size={18} 
                      className={`${
                        item.id === 'create-objective' ? 'text-blue-600' :
                        item.id === 'generate-ai-plan' ? 'text-purple-600' :
                        item.id === 'export-report' ? 'text-green-600' :
                        'text-orange-600'
                      } group-hover:scale-110 transition-transform`} 
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900">
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500 mt-0.5">
                      {item.description}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

