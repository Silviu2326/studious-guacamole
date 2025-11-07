import React from 'react';
import { Button } from '../../../../components/componentsreutilizables';
import { 
  Save, 
  Calendar, 
  FileText, 
  Grid3x3, 
  LayoutGrid,
  Copy,
  RotateCcw,
  RotateCw,
  Zap,
  ZapOff,
  Command,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  X,
  History,
  Minimize2,
  GitCompare,
  Shield
} from 'lucide-react';
import { VistaEditor, EstadoCliente } from '../../types/advanced';

interface TopBarProps {
  vistaActiva: VistaEditor;
  onVistaChange: (vista: VistaEditor) => void;
  onGuardar: () => void;
  onGuardarYProgramar: () => void;
  onAplicarPlantilla: (rango: 'dia' | 'semana' | 'rango') => void;
  onDuplicarDia: () => void;
  autoprogressionEnabled: boolean;
  onAutoprogressionToggle: (enabled: boolean) => void;
  onDeshacer: () => void;
  onRehacer: () => void;
  canDeshacer: boolean;
  canRehacer: boolean;
  estadoCliente?: EstadoCliente;
  onCommandPalette: () => void;
  onClose?: () => void;
  onCondensarDia?: () => void;
  onCompararSemanas?: () => void;
  onRevisarSeguridad?: () => void;
  onVerVersiones?: () => void;
  ultimaVersion?: string;
}

export const TopBar: React.FC<TopBarProps> = ({
  vistaActiva,
  onVistaChange,
  onGuardar,
  onGuardarYProgramar,
  onAplicarPlantilla,
  onDuplicarDia,
  autoprogressionEnabled,
  onAutoprogressionToggle,
  onDeshacer,
  onRehacer,
  canDeshacer,
  canRehacer,
  estadoCliente,
  onCommandPalette,
  onClose,
  onCondensarDia,
  onCompararSemanas,
  onRevisarSeguridad,
  onVerVersiones,
  ultimaVersion,
}) => {
  const vistas = [
    { id: 'diario', label: 'Diario', icon: <FileText className="w-4 h-4" /> },
    { id: 'semana', label: 'Semana', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'calendario', label: 'Calendario', icon: <Calendar className="w-4 h-4" /> },
    { id: 'excel', label: 'Excel', icon: <Grid3x3 className="w-4 h-4" /> },
  ] as const;

  const getSemaforoColor = () => {
    if (!estadoCliente?.dolorActual) return 'gray';
    return estadoCliente.dolorActual.intensidad === 'verde' ? 'green' :
           estadoCliente.dolorActual.intensidad === 'amarillo' ? 'yellow' : 'red';
  };

  return (
    <div className="h-16 border-b border-gray-200 bg-white flex items-center justify-between px-4 shadow-sm z-10">
      {/* Izquierda: Guardar y acciones */}
      <div className="flex items-center gap-2">
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Cerrar editor"
          >
            <X className="w-4 h-4 text-gray-600" />
          </button>
        )}
        <Button
          size="sm"
          onClick={onGuardar}
          leftIcon={<Save className="w-4 h-4" />}
        >
          Guardar
        </Button>
        <div className="relative group">
          <Button
            size="sm"
            variant="secondary"
            onClick={onGuardarYProgramar}
          >
            Guardar y programar ▾
          </Button>
          <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-20">
            <button
              onClick={() => onAplicarPlantilla('dia')}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
            >
              Aplicar plantilla (Día)
            </button>
            <button
              onClick={() => onAplicarPlantilla('semana')}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm"
            >
              Aplicar plantilla (Semana)
            </button>
            <button
              onClick={() => onAplicarPlantilla('rango')}
              className="w-full text-left px-4 py-2 hover:bg-gray-50 text-sm rounded-b-lg"
            >
              Aplicar plantilla (Rango)
            </button>
          </div>
        </div>
      </div>

      {/* Centro: Vistas */}
      <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
        {vistas.map((vista) => (
          <button
            key={vista.id}
            onClick={() => onVistaChange(vista.id as VistaEditor)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              vistaActiva === vista.id
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {vista.icon}
            {vista.label}
          </button>
        ))}
      </div>

      {/* Derecha: Acciones y estado */}
      <div className="flex items-center gap-2">
        {/* Duplicar Día */}
        <button
          onClick={onDuplicarDia}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Duplicar Día (⌘D)"
        >
          <Copy className="w-4 h-4 text-gray-600" />
        </button>

        {/* Condensar Día */}
        {onCondensarDia && (
          <button
            onClick={onCondensarDia}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Condensar día (prioriza compuestos)"
          >
            <Minimize2 className="w-4 h-4 text-gray-600" />
          </button>
        )}

        {/* Comparar Semanas */}
        {onCompararSemanas && (
          <button
            onClick={onCompararSemanas}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Comparar semanas"
          >
            <GitCompare className="w-4 h-4 text-gray-600" />
          </button>
        )}

        {/* Revisar Seguridad */}
        {onRevisarSeguridad && (
          <button
            onClick={onRevisarSeguridad}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            title="Revisar seguridad"
          >
            <Shield className="w-4 h-4 text-gray-600" />
          </button>
        )}

        {/* Autoprogression */}
        <button
          onClick={() => onAutoprogressionToggle(!autoprogressionEnabled)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
            autoprogressionEnabled
              ? 'bg-purple-100 text-purple-700'
              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}
          title="Autoprogression ON/OFF"
        >
          {autoprogressionEnabled ? (
            <Zap className="w-4 h-4" />
          ) : (
            <ZapOff className="w-4 h-4" />
          )}
          <span className="hidden md:inline">Auto</span>
        </button>

        {/* Deshacer/Rehacer */}
        <div className="flex items-center gap-1 border-l border-gray-200 pl-2">
          <button
            onClick={onDeshacer}
            disabled={!canDeshacer}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Deshacer (⌘Z)"
          >
            <RotateCcw className="w-4 h-4 text-gray-600" />
          </button>
          <button
            onClick={onRehacer}
            disabled={!canRehacer}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Rehacer (⌘⇧Z)"
          >
            <RotateCw className="w-4 h-4 text-gray-600" />
          </button>
        </div>

        {/* Command Palette */}
        <button
          onClick={onCommandPalette}
          className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium text-gray-600 transition-colors"
          title="Command Palette (⌘K)"
        >
          <Command className="w-4 h-4" />
          <span className="hidden md:inline">⌘K</span>
        </button>

        {/* Versiones */}
        {onVerVersiones && (
          <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
            <button
              onClick={onVerVersiones}
              className="flex items-center gap-1 px-2 py-1 hover:bg-gray-100 rounded-lg transition-colors"
              title="Ver versiones guardadas"
            >
              <History className="w-4 h-4 text-gray-400" />
              {ultimaVersion && (
                <span className="text-xs text-gray-600">{ultimaVersion}</span>
              )}
            </button>
          </div>
        )}

        {/* Estado del cliente */}
        {estadoCliente && (
          <div className="flex items-center gap-2 border-l border-gray-200 pl-3">
            <div className="flex items-center gap-1">
              <TrendingUp className="w-4 h-4 text-gray-400" />
              <span className="text-xs text-gray-600">
                {estadoCliente.adherenciaSemana}%
              </span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-600">Fatiga:</span>
              <span className={`text-xs font-medium ${
                estadoCliente.fatigaReportada === 'baja' ? 'text-green-600' :
                estadoCliente.fatigaReportada === 'media' ? 'text-yellow-600' : 'text-red-600'
              }`}>
                {estadoCliente.fatigaReportada}
              </span>
            </div>
            {estadoCliente.dolorActual && (
              <div className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded-full ${
                  getSemaforoColor() === 'green' ? 'bg-green-500' :
                  getSemaforoColor() === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                {estadoCliente.dolorActual.zona && (
                  <span className="text-xs text-gray-600">{estadoCliente.dolorActual.zona}</span>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

