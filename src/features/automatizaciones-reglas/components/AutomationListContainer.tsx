import React, { useState, useEffect } from 'react';
import { Card, Button, MetricCards } from '../../../components/componentsreutilizables';
import { AutomationCard } from './AutomationCard';
import { AutomationEditorModal } from './AutomationEditorModal';
import { ConfirmModal } from '../../../components/componentsreutilizables/Modal';
import { 
  Plus, 
  Grid3X3, 
  List, 
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Zap,
  AlertCircle,
  Loader2,
  Search,
  Filter,
  X,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Automation, AutomationFilters, TriggerType, ActionType } from '../types';
import { getAutomations, createAutomation, updateAutomation, deleteAutomation } from '../api';

type VistaType = 'grid' | 'list';

type OrdenCampo = 'name' | 'created_at' | 'executions_last_30d' | 'success_rate';
type OrdenDireccion = 'asc' | 'desc';

interface Orden {
  campo: OrdenCampo;
  direccion: OrdenDireccion;
}

export const AutomationListContainer: React.FC = () => {
  const [automations, setAutomations] = useState<Automation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [vista, setVista] = useState<VistaType>('grid');
  const [automationSeleccionada, setAutomationSeleccionada] = useState<Automation | null>(null);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [modoModal, setModoModal] = useState<'crear' | 'editar' | 'ver'>('crear');
  const [confirmModalAbierto, setConfirmModalAbierto] = useState(false);
  const [automationAEliminar, setAutomationAEliminar] = useState<Automation | null>(null);
  
  // Filtros
  const [filtros, setFiltros] = useState<AutomationFilters>({
    status: 'all',
    search: '',
  });
  const [mostrarFiltrosAvanzados, setMostrarFiltrosAvanzados] = useState(false);
  const [orden, setOrden] = useState<Orden>({ campo: 'created_at', direccion: 'desc' });
  const [paginaActual, setPaginaActual] = useState(1);
  const itemsPorPagina = 12;

  useEffect(() => {
    cargarAutomations();
  }, [filtros, orden, paginaActual]);

  const cargarAutomations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAutomations();
      setAutomations(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar automatizaciones');
    } finally {
      setLoading(false);
    }
  };

  const handleCrearAutomation = () => {
    setAutomationSeleccionada(null);
    setModoModal('crear');
    setModalAbierto(true);
  };

  const handleEditarAutomation = (automation: Automation) => {
    setAutomationSeleccionada(automation);
    setModoModal('editar');
    setModalAbierto(true);
  };

  const handleVerAutomation = (automation: Automation) => {
    setAutomationSeleccionada(automation);
    setModoModal('ver');
    setModalAbierto(true);
  };

  const handleEliminarAutomation = (automation: Automation) => {
    setAutomationAEliminar(automation);
    setConfirmModalAbierto(true);
  };

  const confirmarEliminacion = async () => {
    if (automationAEliminar) {
      try {
        await deleteAutomation(automationAEliminar.id);
        await cargarAutomations();
        setConfirmModalAbierto(false);
        setAutomationAEliminar(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al eliminar automatización');
      }
    }
  };

  const handleGuardarAutomation = async (datos: any) => {
    try {
      if (modoModal === 'crear') {
        await createAutomation(datos);
      } else if (modoModal === 'editar' && automationSeleccionada) {
        await updateAutomation(automationSeleccionada.id, datos);
      }
      await cargarAutomations();
      setModalAbierto(false);
      setAutomationSeleccionada(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al guardar automatización');
    }
  };

  const handleToggleActive = async (automation: Automation) => {
    try {
      await updateAutomation(automation.id, { is_active: !automation.is_active });
      await cargarAutomations();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al actualizar automatización');
    }
  };

  const handleCambiarOrden = (campo: OrdenCampo) => {
    const nuevaDireccion = orden.campo === campo && orden.direccion === 'asc' ? 'desc' : 'asc';
    setOrden({ campo, direccion: nuevaDireccion });
  };

  const handleFiltrosChange = (nuevosFiltros: Partial<AutomationFilters>) => {
    setFiltros(prev => ({ ...prev, ...nuevosFiltros }));
    setPaginaActual(1);
  };

  const limpiarFiltros = () => {
    setFiltros({ status: 'all', search: '' });
    setPaginaActual(1);
  };

  const filtrarAutomations = (autos: Automation[]) => {
    return autos.filter(auto => {
      if (filtros.status === 'active' && !auto.is_active) return false;
      if (filtros.status === 'inactive' && auto.is_active) return false;
      if (filtros.search && !auto.name.toLowerCase().includes(filtros.search.toLowerCase())) return false;
      if (filtros.trigger_type && auto.trigger_type !== filtros.trigger_type) return false;
      if (filtros.action_type && auto.action_type !== filtros.action_type) return false;
      return true;
    });
  };

  const ordenarAutomations = (autos: Automation[]) => {
    return [...autos].sort((a, b) => {
      let valorA: any, valorB: any;
      switch (orden.campo) {
        case 'name':
          valorA = a.name.toLowerCase();
          valorB = b.name.toLowerCase();
          break;
        case 'created_at':
          valorA = new Date(a.created_at).getTime();
          valorB = new Date(b.created_at).getTime();
          break;
        case 'executions_last_30d':
          valorA = a.executions_last_30d;
          valorB = b.executions_last_30d;
          break;
        case 'success_rate':
          valorA = a.success_rate;
          valorB = b.success_rate;
          break;
        default:
          return 0;
      }
      
      if (valorA < valorB) return orden.direccion === 'asc' ? -1 : 1;
      if (valorA > valorB) return orden.direccion === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const automationsFiltradas = ordenarAutomations(filtrarAutomations(automations));
  const totalAutomations = automationsFiltradas.length;
  const totalPaginas = Math.ceil(totalAutomations / itemsPorPagina);
  const inicio = (paginaActual - 1) * itemsPorPagina;
  const fin = inicio + itemsPorPagina;
  const automationsPagina = automationsFiltradas.slice(inicio, fin);

  const opcionesOrden = [
    { campo: 'name' as const, label: 'Nombre' },
    { campo: 'created_at' as const, label: 'Fecha de creación' },
    { campo: 'executions_last_30d' as const, label: 'Ejecuciones' },
    { campo: 'success_rate' as const, label: 'Tasa de éxito' }
  ];

  const generarPaginas = () => {
    const paginas = [];
    const maxPaginas = 5;
    let inicio = Math.max(1, paginaActual - Math.floor(maxPaginas / 2));
    let fin = Math.min(totalPaginas, inicio + maxPaginas - 1);
    
    if (fin - inicio < maxPaginas - 1) {
      inicio = Math.max(1, fin - maxPaginas + 1);
    }

    for (let i = inicio; i <= fin; i++) {
      paginas.push(i);
    }
    
    return paginas;
  };

  const activeCount = automations.filter(a => a.is_active).length;
  const totalExecutions = automations.reduce((sum, a) => sum + a.executions_last_30d, 0);
  const avgSuccessRate = automations.length > 0 
    ? automations.reduce((sum, a) => sum + a.success_rate, 0) / automations.length 
    : 0;

  const filtrosActivos = Object.values(filtros).filter(v => v && v !== 'all').length;

  if (error && !loading) {
    return (
      <Card className="p-8 text-center bg-white shadow-sm">
        <AlertCircle size={48} className="mx-auto text-red-500 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Error al cargar automatizaciones</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={() => cargarAutomations()}>
          Reintentar
        </Button>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Toolbar superior */}
      <div className="flex items-center justify-end">
        <Button onClick={handleCrearAutomation}>
          <Plus size={20} className="mr-2" />
          Nueva Automatización
        </Button>
      </div>

      {/* KPIs */}
      <MetricCards
        data={[
          {
            id: 'total',
            title: 'Total automatizaciones',
            value: automations.length,
            color: 'info',
          },
          {
            id: 'active',
            title: 'Activas',
            value: activeCount,
            color: 'success',
          },
          {
            id: 'executions',
            title: 'Ejecuciones (30d)',
            value: totalExecutions,
            color: 'warning',
          },
          {
            id: 'success',
            title: 'Tasa de éxito',
            value: `${avgSuccessRate.toFixed(1)}%`,
            color: 'info',
          },
        ]}
      />

      {/* Filtros */}
      <Card className="mb-6 bg-white shadow-sm">
        <div className="space-y-4">
          {/* Barra de búsqueda */}
          <div className="rounded-2xl bg-slate-50 ring-1 ring-slate-200 p-3">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Buscar automatizaciones..."
                  value={filtros.search || ''}
                  onChange={(e) => handleFiltrosChange({ search: e.target.value })}
                  className="w-full rounded-xl bg-white text-slate-900 placeholder-slate-400 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 pl-10 pr-3 py-2.5"
                />
              </div>
              <Button
                variant={mostrarFiltrosAvanzados ? 'secondary' : 'ghost'}
                onClick={() => setMostrarFiltrosAvanzados(!mostrarFiltrosAvanzados)}
              >
                <Filter size={18} className="mr-2" />
                Filtros
                {filtrosActivos > 0 && (
                  <span className="ml-2 px-2 py-0.5 bg-blue-100 text-blue-600 rounded-full text-xs font-medium">
                    {filtrosActivos}
                  </span>
                )}
                {mostrarFiltrosAvanzados ? (
                  <ChevronUp size={16} className="ml-2" />
                ) : (
                  <ChevronDown size={16} className="ml-2" />
                )}
              </Button>
              {filtrosActivos > 0 && (
                <Button variant="ghost" onClick={limpiarFiltros}>
                  <X size={18} className="mr-2" />
                  Limpiar
                </Button>
              )}
            </div>
          </div>

          {/* Panel de filtros avanzados */}
          {mostrarFiltrosAvanzados && (
            <div className="rounded-2xl bg-white ring-1 ring-slate-200 p-4 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Estado
                  </label>
                  <select
                    value={filtros.status || 'all'}
                    onChange={(e) => handleFiltrosChange({ status: e.target.value as any })}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 py-2.5 pl-3 pr-9 appearance-none"
                  >
                    <option value="all">Todos</option>
                    <option value="active">Activas</option>
                    <option value="inactive">Inactivas</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo de Trigger
                  </label>
                  <select
                    value={filtros.trigger_type || ''}
                    onChange={(e) => handleFiltrosChange({ trigger_type: e.target.value as TriggerType || undefined })}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 py-2.5 pl-3 pr-9 appearance-none"
                  >
                    <option value="">Todos</option>
                    <option value="MEMBER_CREATED">Miembro Creado</option>
                    <option value="MEMBER_INACTIVITY">Inactividad</option>
                    <option value="PAYMENT_FAILED">Pago Fallido</option>
                    <option value="PAYMENT_SUCCESS">Pago Exitoso</option>
                    <option value="CLASS_BOOKING">Reserva de Clase</option>
                    <option value="MEMBERSHIP_EXPIRING">Membresía Por Vencer</option>
                    <option value="CHECK_IN">Check-in</option>
                    <option value="LEAD_CREATED">Lead Creado</option>
                    <option value="GOAL_ACHIEVED">Objetivo Alcanzado</option>
                    <option value="SESSION_COMPLETED">Sesión Completada</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Tipo de Acción
                  </label>
                  <select
                    value={filtros.action_type || ''}
                    onChange={(e) => handleFiltrosChange({ action_type: e.target.value as ActionType || undefined })}
                    className="w-full rounded-xl bg-white text-slate-900 ring-1 ring-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-400 py-2.5 pl-3 pr-9 appearance-none"
                  >
                    <option value="">Todos</option>
                    <option value="SEND_EMAIL">Enviar Email</option>
                    <option value="SEND_WHATSAPP">Enviar WhatsApp</option>
                    <option value="SEND_SMS">Enviar SMS</option>
                    <option value="CREATE_TASK">Crear Tarea</option>
                    <option value="ASSIGN_TAG">Asignar Etiqueta</option>
                    <option value="ADD_SEGMENT">Añadir a Segmento</option>
                    <option value="SEND_PUSH_NOTIFICATION">Notificación Push</option>
                    <option value="APPLY_DISCOUNT">Aplicar Descuento</option>
                    <option value="SEND_REMINDER">Enviar Recordatorio</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Resumen de resultados */}
          <div className="flex justify-between items-center text-sm text-slate-600 border-t border-slate-200 pt-4">
            <span>{totalAutomations} automatizaciones encontradas</span>
            {filtrosActivos > 0 && <span>{filtrosActivos} filtros aplicados</span>}
          </div>
        </div>
      </Card>

      {/* Controles de vista y ordenamiento */}
      <Card className="p-4 bg-white shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-4">
            {/* Selector de vista */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Vista:</span>
              <div className="flex border rounded-lg overflow-hidden">
                <Button
                  variant={vista === 'grid' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setVista('grid')}
                  className="p-2 rounded-none"
                >
                  <Grid3X3 size={16} />
                </Button>
                <Button
                  variant={vista === 'list' ? 'primary' : 'ghost'}
                  size="sm"
                  onClick={() => setVista('list')}
                  className="p-2 rounded-none"
                >
                  <List size={16} />
                </Button>
              </div>
            </div>

            {/* Selector de ordenamiento */}
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium text-gray-700">Ordenar por:</span>
              <div className="flex flex-wrap gap-1">
                {opcionesOrden.map((opcion) => (
                  <Button
                    key={opcion.campo}
                    variant={orden.campo === opcion.campo ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => handleCambiarOrden(opcion.campo)}
                    className="px-3 py-1 text-sm"
                  >
                    {opcion.label}
                    {orden.campo === opcion.campo && (
                      <ArrowUpDown size={12} className={orden.direccion === 'desc' ? 'rotate-180' : ''} />
                    )}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Información de resultados */}
          <div className="text-sm text-gray-600">
            Página {paginaActual} de {totalPaginas} ({totalAutomations} automatizaciones)
          </div>
        </div>
      </Card>

      {/* Grid/Lista de automatizaciones */}
      {loading ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Loader2 size={48} className="mx-auto text-blue-500 animate-spin mb-4" />
          <p className="text-gray-600">Cargando automatizaciones...</p>
        </Card>
      ) : automationsPagina.length === 0 ? (
        <Card className="p-8 text-center bg-white shadow-sm">
          <Zap size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay automatizaciones</h3>
          <p className="text-gray-600 mb-4">
            {filtrosActivos > 0 
              ? 'No se encontraron automatizaciones con los filtros aplicados'
              : 'Crea tu primera automatización para comenzar'}
          </p>
          {filtrosActivos === 0 && (
            <Button onClick={handleCrearAutomation}>
              <Plus size={18} className="mr-2" />
              Nueva Automatización
            </Button>
          )}
        </Card>
      ) : vista === 'grid' ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {automationsPagina.map((automation) => (
            <AutomationCard
              key={automation.id}
              automation={automation}
              onEdit={handleEditarAutomation}
              onDelete={handleEliminarAutomation}
              onView={handleVerAutomation}
              onToggleActive={handleToggleActive}
            />
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          {automationsPagina.map((automation) => (
            <AutomationCard
              key={automation.id}
              automation={automation}
              onEdit={handleEditarAutomation}
              onDelete={handleEliminarAutomation}
              onView={handleVerAutomation}
              onToggleActive={handleToggleActive}
              variant="list"
            />
          ))}
        </div>
      )}

      {/* Paginación */}
      {totalPaginas > 1 && (
        <Card className="p-4 bg-white shadow-sm">
          <div className="flex justify-center items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPaginaActual(prev => Math.max(1, prev - 1))}
              disabled={paginaActual === 1}
            >
              <ChevronLeft size={16} />
            </Button>
            {generarPaginas().map((pagina) => (
              <Button
                key={pagina}
                variant={pagina === paginaActual ? 'primary' : 'ghost'}
                size="sm"
                onClick={() => setPaginaActual(pagina)}
              >
                {pagina}
              </Button>
            ))}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPaginaActual(prev => Math.min(totalPaginas, prev + 1))}
              disabled={paginaActual === totalPaginas}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </Card>
      )}

      {/* Modales */}
      {modalAbierto && (
        <AutomationEditorModal
          isOpen={modalAbierto}
          onClose={() => {
            setModalAbierto(false);
            setAutomationSeleccionada(null);
          }}
          onSave={handleGuardarAutomation}
          automation={automationSeleccionada}
          mode={modoModal}
        />
      )}

      <ConfirmModal
        isOpen={confirmModalAbierto}
        onClose={() => {
          setConfirmModalAbierto(false);
          setAutomationAEliminar(null);
        }}
        onConfirm={confirmarEliminacion}
        title="Eliminar automatización"
        message={`¿Estás seguro de eliminar la automatización "${automationAEliminar?.name}"? Esta acción no se puede deshacer.`}
      />
    </div>
  );
};
