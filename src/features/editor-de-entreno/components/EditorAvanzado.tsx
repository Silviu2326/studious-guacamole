import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { 
  TopBar, 
  LeftPanel, 
  CenterArea, 
  RightPanel,
  CommandPalette 
} from './advanced';
import { SmartFillSolver } from './advanced/SmartFill';
import { AutoprogressionEngine } from './advanced/Autoprogression';
import { AutosaveVersioning, useAutosave, Version } from './advanced/AutosaveVersioning';
import { ComparadorSemanas } from './advanced/ComparadorSemanas';
import { RevisarSeguridad } from './advanced/RevisarSeguridad';
import { VersionSelector } from './advanced/VersionSelector';
import { 
  SesionEntrenamiento, 
  PlanificacionSemana,
  VistaEditor,
  ClientePerfil,
  EstadoCliente,
  Restricciones 
} from '../types/advanced';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

interface EditorAvanzadoProps {
  clienteId?: string;
  clientePerfil?: ClientePerfil;
  estadoCliente?: EstadoCliente;
  sesionInicial?: SesionEntrenamiento;
  planificacionInicial?: PlanificacionSemana;
  onGuardar?: (sesion: SesionEntrenamiento) => void;
  onGuardarYProgramar?: (planificacion: PlanificacionSemana) => void;
  onClose?: () => void;
}

export const EditorAvanzado: React.FC<EditorAvanzadoProps> = ({
  clienteId,
  clientePerfil,
  estadoCliente,
  sesionInicial,
  planificacionInicial,
  onGuardar,
  onGuardarYProgramar,
  onClose,
}) => {
  const { user } = useAuth();
  const isEntrenador = user?.role === 'entrenador';

  // Estado principal
  const [vistaActiva, setVistaActiva] = useState<VistaEditor>('diario');
  
  // Inicializar planificación con sesión inicial si existe
  const planificacionInicialConSesion = useMemo(() => {
    if (planificacionInicial) return planificacionInicial;
    if (sesionInicial) {
      return {
        lunes: sesionInicial,
      } as PlanificacionSemana;
    }
    // Crear sesión vacía por defecto
    const sesionVacia: SesionEntrenamiento = {
      nombre: 'Nueva Sesión',
      tipo: 'fuerza',
      ejercicios: [],
      duracion: 0,
      objetivo: '',
      progresion: {
        habilitada: false,
        tipo: 'automatica',
        frecuencia: 'semanal',
      },
      checkIns: {
        habilitado: false,
        tipos: [],
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    return {
      lunes: sesionVacia,
    } as PlanificacionSemana;
  }, [planificacionInicial, sesionInicial]);
  
  const [planificacion, setPlanificacion] = useState<PlanificacionSemana>(planificacionInicialConSesion);
  const [diaSeleccionado, setDiaSeleccionado] = useState<keyof PlanificacionSemana>('lunes');
  
  // Paneles
  const [leftPanelAbierto, setLeftPanelAbierto] = useState(true);
  const [rightPanelAbierto, setRightPanelAbierto] = useState(true);
  
  // Command Palette
  const [showCommandPalette, setShowCommandPalette] = useState(false);
  
  // Restricciones activas
  const [restricciones, setRestricciones] = useState<Restricciones>({
    tiempoDisponible: clientePerfil?.tiempoSemana,
    materialDisponible: clientePerfil?.materialDisponible,
    molestias: clientePerfil?.lesiones,
  });

  // Historial (undo/redo)
  const [historial, setHistorial] = useState<PlanificacionSemana[]>([planificacionInicialConSesion]);
  const [indiceHistorial, setIndiceHistorial] = useState(0);

  // Autoprogression
  const [autoprogressionEnabled, setAutoprogressionEnabled] = useState(false);

  // Autosave y versionado
  const [ultimaVersion, setUltimaVersion] = useState<string>('');
  const [mostrarVersiones, setMostrarVersiones] = useState(false);
  const [mostrarComparador, setMostrarComparador] = useState(false);
  const [mostrarSeguridad, setMostrarSeguridad] = useState(false);
  const [semanaComparacion, setSemanaComparacion] = useState<PlanificacionSemana | null>(null);

  // Activar autosave
  useAutosave(planificacion, true);

  // Sesión actual (calculada antes de los useEffects)
  const sesionActual = useMemo(() => {
    return planificacion[diaSeleccionado];
  }, [planificacion, diaSeleccionado]);

  // Función para actualizar sesión (definida antes de los useEffects)
  const actualizarSesion = useCallback((sesion: SesionEntrenamiento) => {
    setPlanificacion(prev => {
      const nuevaPlanificacion = {
        ...prev,
        [diaSeleccionado]: sesion,
      };
      
      // Actualizar historial
      setHistorial(prevHist => {
        const nuevoHistorial = prevHist.slice(0, indiceHistorial + 1);
        nuevoHistorial.push(nuevaPlanificacion);
        setIndiceHistorial(nuevoHistorial.length - 1);
        return nuevoHistorial;
      });
      
      return nuevaPlanificacion;
    });
  }, [diaSeleccionado, indiceHistorial]);
  
  // Aplicar autoprogression cuando se habilita
  useEffect(() => {
    if (autoprogressionEnabled && sesionActual && estadoCliente) {
      const config = AutoprogressionEngine.calcularProgresion(
        sesionActual,
        'fuerza', // TODO: Obtener del perfil del cliente
        estadoCliente.adherenciaSemana
      );
      
      if (config.semaforoRiesgo === 'verde') {
        const sesionProgresada = AutoprogressionEngine.aplicarProgresion(sesionActual, config);
        actualizarSesion(sesionProgresada);
      } else if (config.semaforoRiesgo === 'amarillo') {
        const confirmar = window.confirm(
          `Autoprogression: Riesgo moderado detectado.\n\n${config.sugerenciaVariante}\n\n¿Aplicar progresión moderada?`
        );
        if (confirmar) {
          const sesionProgresada = AutoprogressionEngine.aplicarProgresion(sesionActual, config);
          actualizarSesion(sesionProgresada);
        }
      } else {
        alert(`Autoprogression: Riesgo alto. ${config.sugerenciaVariante}`);
      }
    }
  }, [autoprogressionEnabled, sesionActual, estadoCliente, actualizarSesion]);

  const handleGuardar = useCallback(() => {
    if (sesionActual && onGuardar) {
      // Guardar versión antes de guardar
      const version = AutosaveVersioning.saveVersion(planificacion, 'Guardado manual', {
        action: 'guardar',
        usuario: user?.name || 'Usuario',
      });
      setUltimaVersion(AutosaveVersioning.formatVersionLabel(version));
      onGuardar(sesionActual);
    }
  }, [sesionActual, onGuardar, planificacion, user]);

  const handleGuardarYProgramar = useCallback(() => {
    if (onGuardarYProgramar) {
      onGuardarYProgramar(planificacion);
    }
  }, [planificacion, onGuardarYProgramar]);

  const handleDuplicarDia = useCallback(() => {
    if (!sesionActual) return;
    
    // Encontrar siguiente día disponible
    const dias: (keyof PlanificacionSemana)[] = ['lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'];
    const indiceActual = dias.indexOf(diaSeleccionado);
    const siguienteDia = dias[indiceActual + 1];
    
    if (siguienteDia) {
      const sesionDuplicada = {
        ...sesionActual,
        id: undefined,
        nombre: `${sesionActual.nombre} (Copia)`,
      };
      actualizarSesion(sesionDuplicada);
      setDiaSeleccionado(siguienteDia);
    }
  }, [sesionActual, diaSeleccionado, actualizarSesion]);

  const handleDeshacer = useCallback(() => {
    if (indiceHistorial > 0) {
      const nuevoIndice = indiceHistorial - 1;
      setIndiceHistorial(nuevoIndice);
      setPlanificacion(historial[nuevoIndice]);
    }
  }, [indiceHistorial, historial]);

  const handleRehacer = useCallback(() => {
    if (indiceHistorial < historial.length - 1) {
      const nuevoIndice = indiceHistorial + 1;
      setIndiceHistorial(nuevoIndice);
      setPlanificacion(historial[nuevoIndice]);
    }
  }, [indiceHistorial, historial]);

  // Atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Command Palette (⌘K / Ctrl+K)
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setShowCommandPalette(true);
      }
      
      // Duplicar día (⌘D / Ctrl+D)
      if ((e.metaKey || e.ctrlKey) && e.key === 'd' && vistaActiva !== 'excel') {
        e.preventDefault();
        handleDuplicarDia();
      }
      
      // Aplicar plantilla (⌘⇧A / Ctrl+Shift+A)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        // TODO: Abrir selector de plantillas
      }
      
      // Deshacer (⌘Z / Ctrl+Z)
      if ((e.metaKey || e.ctrlKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleDeshacer();
      }
      
      // Rehacer (⌘⇧Z / Ctrl+Shift+Z)
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'Z') {
        e.preventDefault();
        handleRehacer();
      }
      
      // Búsqueda en biblioteca (⌘/ / Ctrl+/)
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        // TODO: Focus en búsqueda de biblioteca
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [vistaActiva, handleDuplicarDia, handleDeshacer, handleRehacer]);

  const handleAplicarPlantilla = useCallback((plantillaId: string, rango: 'dia' | 'semana' | 'rango') => {
    // TODO: Implementar aplicación de plantilla
    console.log('Aplicar plantilla', plantillaId, rango);
  }, []);

  const handleSmartFill = useCallback((restricciones: Restricciones) => {
    if (!sesionActual) return;
    
    const resultado = SmartFillSolver.resolver(sesionActual, restricciones);
    
    if (resultado.cambios.length > 0) {
      const confirmar = window.confirm(
        `Smart Fill propone los siguientes cambios:\n\n${resultado.cambios.join('\n')}\n\n¿Aplicar cambios?`
      );
      
      if (confirmar) {
        // Guardar versión antes del cambio
        AutosaveVersioning.saveVersion(planificacion, 'Antes de Smart Fill', {
          action: 'smart-fill',
          usuario: user?.name || 'Usuario',
          cambios: resultado.cambios,
        });

        const sesionModificada = {
          ...sesionActual,
          ejercicios: resultado.ejercicios,
        };
        actualizarSesion(sesionModificada);
      }
    }
  }, [sesionActual, actualizarSesion, planificacion, user]);

  const handleCondensarDia = useCallback(() => {
    if (!sesionActual) return;
    
    // Guardar versión antes de condensar
    AutosaveVersioning.saveVersion(planificacion, 'Antes de condensar día', {
      action: 'condensar-dia',
      usuario: user?.name || 'Usuario',
    });

    // Priorizar compuestos y reducir accesorios
    const compuestos = sesionActual.ejercicios.filter(ej =>
      ['sentadilla', 'prensa', 'peso muerto', 'press banca', 'remo', 'press hombro'].some(
        nombre => ej.ejercicio.nombre.toLowerCase().includes(nombre)
      )
    );
    const accesorios = sesionActual.ejercicios.filter(ej => !compuestos.includes(ej));
    
    // Mantener todos los compuestos y solo 50% de accesorios
    const accesoriosReducidos = accesorios.slice(0, Math.ceil(accesorios.length * 0.5));
    const sesionCondensada = {
      ...sesionActual,
      ejercicios: [...compuestos, ...accesoriosReducidos],
    };
    
    actualizarSesion(sesionCondensada);
    alert('Día condensado: se mantuvieron compuestos y se redujeron accesorios');
  }, [sesionActual, actualizarSesion, planificacion, user]);

  const handleCompararSemanas = useCallback(() => {
    // Guardar semana actual para comparación
    setSemanaComparacion({ ...planificacion });
    setMostrarComparador(true);
  }, [planificacion]);

  const handleRevisarSeguridad = useCallback(() => {
    setMostrarSeguridad(true);
  }, []);

  return (
    <div className="h-screen flex flex-col bg-gray-50 overflow-hidden">
      {/* Top Bar - Siempre visible */}
      <TopBar
        vistaActiva={vistaActiva}
        onVistaChange={setVistaActiva}
        onGuardar={handleGuardar}
        onGuardarYProgramar={handleGuardarYProgramar}
        onAplicarPlantilla={handleAplicarPlantilla}
        onDuplicarDia={handleDuplicarDia}
        autoprogressionEnabled={autoprogressionEnabled}
        onAutoprogressionToggle={setAutoprogressionEnabled}
        onDeshacer={handleDeshacer}
        onRehacer={handleRehacer}
        canDeshacer={indiceHistorial > 0}
        canRehacer={indiceHistorial < historial.length - 1}
        estadoCliente={estadoCliente}
        onCommandPalette={() => setShowCommandPalette(true)}
        onClose={onClose}
        onCondensarDia={handleCondensarDia}
        onCompararSemanas={handleCompararSemanas}
        onRevisarSeguridad={handleRevisarSeguridad}
        onVerVersiones={() => setMostrarVersiones(true)}
        ultimaVersion={ultimaVersion}
      />

      {/* Contenido Principal */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel - Plegable */}
        {leftPanelAbierto && (
          <div className="w-80 border-r border-gray-200 bg-white overflow-y-auto">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <span className="font-semibold text-sm text-gray-700">Panel Lateral</span>
              <button
                onClick={() => setLeftPanelAbierto(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
            </div>
            <LeftPanel
              onAgregarEjercicio={(ejercicio) => {
                // TODO: Implementar agregar ejercicio
                console.log('Agregar ejercicio', ejercicio);
              }}
              onAplicarPlantilla={handleAplicarPlantilla}
              onAplicarBloque={(bloque) => {
                // TODO: Implementar aplicar bloque
                console.log('Aplicar bloque', bloque);
              }}
              clienteId={clienteId}
              restricciones={restricciones}
            />
          </div>
        )}

        {!leftPanelAbierto && (
          <button
            onClick={() => setLeftPanelAbierto(true)}
            className="fixed left-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border-r border-gray-200 rounded-r-lg shadow-sm hover:bg-gray-50"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        )}

        {/* Center Area - Multivistas */}
        <div className="flex-1 overflow-hidden">
          <CenterArea
            vista={vistaActiva}
            planificacion={planificacion}
            sesionActual={sesionActual}
            diaSeleccionado={diaSeleccionado}
            onDiaSeleccionado={setDiaSeleccionado}
            onSesionChange={actualizarSesion}
            clienteId={clienteId}
            estadoCliente={estadoCliente}
            restricciones={restricciones}
            onSmartFill={handleSmartFill}
            autoprogressionEnabled={autoprogressionEnabled}
          />
        </div>

        {/* Right Panel - Contextual/Personalizable */}
        {rightPanelAbierto && (
          <div className="w-96 border-l border-gray-200 bg-white overflow-y-auto">
            <div className="flex items-center justify-between p-3 border-b border-gray-200">
              <span className="font-semibold text-sm text-gray-700">Panel Contextual</span>
              <button
                onClick={() => setRightPanelAbierto(false)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
            <RightPanel
              clientePerfil={clientePerfil}
              estadoCliente={estadoCliente}
              sesionActual={sesionActual}
              planificacion={planificacion}
              onRestriccionesChange={setRestricciones}
            />
          </div>
        )}

        {!rightPanelAbierto && (
          <button
            onClick={() => setRightPanelAbierto(true)}
            className="fixed right-0 top-1/2 -translate-y-1/2 z-10 p-2 bg-white border-l border-gray-200 rounded-l-lg shadow-sm hover:bg-gray-50"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Command Palette */}
      {showCommandPalette && (
        <CommandPalette
          isOpen={showCommandPalette}
          onClose={() => setShowCommandPalette(false)}
          onCommand={(command) => {
            // TODO: Procesar comandos
            console.log('Comando ejecutado', command);
            setShowCommandPalette(false);
          }}
          planificacion={planificacion}
          diaSeleccionado={diaSeleccionado}
        />
      )}

      {/* Comparador de Semanas */}
      {mostrarComparador && semanaComparacion && (
        <ComparadorSemanas
          semanaA={planificacion}
          semanaB={semanaComparacion}
          isOpen={mostrarComparador}
          onClose={() => setMostrarComparador(false)}
        />
      )}

      {/* Revisar Seguridad */}
      <RevisarSeguridad
        planificacion={planificacion}
        isOpen={mostrarSeguridad}
        onClose={() => setMostrarSeguridad(false)}
      />

      {/* Selector de Versiones */}
      <VersionSelector
        isOpen={mostrarVersiones}
        onClose={() => setMostrarVersiones(false)}
        onRestore={(restored) => {
          setPlanificacion(restored);
          setMostrarVersiones(false);
        }}
      />
    </div>
  );
};

