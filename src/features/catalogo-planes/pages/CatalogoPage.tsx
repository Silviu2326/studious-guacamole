import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card, Button } from '../../../components/componentsreutilizables';
import { CatalogoPlanes } from '../components/CatalogoPlanes';
import { GestorBonos } from '../components/GestorBonos';
import { PlanForm } from '../components/PlanForm';
import { Plan, Bono, Cliente, EstadoPlan } from '../types';
import { planesMock, bonosMock } from '../data/mockData';
import { 
  Package, 
  Gift, 
  Plus, 
  Download, 
  Upload,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  X,
  AlertCircle
} from 'lucide-react';

// Mock de clientes para desarrollo
const MOCK_CLIENTES: Cliente[] = [
  {
    id: 'cliente-001',
    nombre: 'Juan Pérez',
    email: 'juan.perez@example.com',
    telefono: '+34 600 123 456',
    fechaRegistro: new Date('2024-01-15')
  },
  {
    id: 'cliente-002',
    nombre: 'María García',
    email: 'maria.garcia@example.com',
    telefono: '+34 600 234 567',
    fechaRegistro: new Date('2024-02-20')
  },
  {
    id: 'cliente-003',
    nombre: 'Carlos López',
    email: 'carlos.lopez@example.com',
    telefono: '+34 600 345 678',
    fechaRegistro: new Date('2024-03-10')
  }
];

// Tipo para notificaciones toast
interface ToastNotification {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

export const CatalogoPage: React.FC = () => {
  const { user } = useAuth();
  const [planes, setPlanes] = useState<Plan[]>(planesMock);
  const [bonos, setBonos] = useState<Bono[]>(bonosMock);
  const [clientes] = useState<Cliente[]>(MOCK_CLIENTES);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [activeTab, setActiveTab] = useState<'planes' | 'bonos'>('planes');
  const [toast, setToast] = useState<ToastNotification | null>(null);
  const tabsScrollRef = useRef<HTMLDivElement>(null);

  // Auto-dismiss toast después de 3 segundos
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Función helper para mostrar toast
  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ id: Date.now().toString(), message, type });
  };

  // Handlers para planes
  const handleSelectPlan = (plan: Plan) => {
    console.log('Plan seleccionado:', plan);
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setShowPlanForm(true);
  };

  const handleDeletePlan = (planId: string) => {
    const plan = planes.find(p => p.id === planId);
    if (window.confirm('¿Estás seguro de que quieres eliminar este plan?')) {
      setPlanes(prev => prev.filter(p => p.id !== planId));
      if (plan) {
        showToast(`Plan "${plan.nombre}" eliminado correctamente.`, 'success');
      }
    }
  };

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setShowPlanForm(true);
  };

  const handleDuplicatePlan = (plan: Plan) => {
    // Generar nombre único para la copia
    const nombreBase = plan.nombre.trim();
    let nombreCopia: string;
    
    if (nombreBase.endsWith('(copia)')) {
      // Si ya tiene "(copia)", buscar si hay más copias y numerar
      const baseSinCopia = nombreBase.replace(/\s*\(copia\)\s*$/, '').trim();
      const copiasExistentes = planes.filter(p => 
        p.nombre.trim().startsWith(baseSinCopia) && 
        p.nombre.trim() !== nombreBase
      );
      const numeroCopia = copiasExistentes.length + 1;
      nombreCopia = numeroCopia > 1 ? `${baseSinCopia} (copia ${numeroCopia})` : `${baseSinCopia} (copia)`;
    } else {
      // Verificar si ya existe una copia con este nombre
      const copiasExistentes = planes.filter(p => 
        p.nombre.trim() === `${nombreBase} (copia)` || 
        p.nombre.trim().startsWith(`${nombreBase} (copia `)
      );
      if (copiasExistentes.length > 0) {
        const numeroCopia = copiasExistentes.length + 1;
        nombreCopia = `${nombreBase} (copia ${numeroCopia})`;
      } else {
        nombreCopia = `${nombreBase} (copia)`;
      }
    }
    
    const duplicatedPlan: Plan = {
      ...plan,
      id: `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      nombre: nombreCopia,
      estado: 'borrador',
      esPopular: false,
      esRecomendado: false,
      esNuevo: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setPlanes(prev => [...prev, duplicatedPlan]);
    showToast(`Plan "${plan.nombre}" duplicado correctamente. El nuevo plan "${nombreCopia}" está en estado borrador.`, 'success');
  };

  const handleArchivePlans = (planIds: string[]) => {
    if (window.confirm(`¿Estás seguro de que quieres archivar ${planIds.length} ${planIds.length === 1 ? 'plan' : 'planes'}?`)) {
      setPlanes(prev => prev.map(p => 
        planIds.includes(p.id) 
          ? { ...p, estado: 'archivado' as EstadoPlan, updatedAt: new Date() }
          : p
      ));
      showToast(`${planIds.length} ${planIds.length === 1 ? 'plan archivado' : 'planes archivados'} correctamente.`, 'success');
    }
  };

  const handleArchivePlan = (plan: Plan) => {
    if (window.confirm(`¿Estás seguro de que quieres archivar el plan "${plan.nombre}"?`)) {
      setPlanes(prev => prev.map(p => 
        p.id === plan.id 
          ? { ...p, estado: 'archivado' as EstadoPlan, updatedAt: new Date() }
          : p
      ));
      showToast(`Plan "${plan.nombre}" archivado correctamente.`, 'success');
    }
  };

  const handleToggleEstadoPlan = (plan: Plan) => {
    // Solo permitir toggle entre activo e inactivo (no desde archivado o borrador directamente)
    let nuevoEstado: EstadoPlan;
    if (plan.estado === 'activo') {
      nuevoEstado = 'inactivo';
    } else if (plan.estado === 'inactivo') {
      nuevoEstado = 'activo';
    } else {
      // Si está en borrador o archivado, activar directamente
      nuevoEstado = 'activo';
    }
    
    setPlanes(prev => prev.map(p => 
      p.id === plan.id 
        ? { ...p, estado: nuevoEstado, updatedAt: new Date() }
        : p
    ));
    
    const mensaje = nuevoEstado === 'activo' 
      ? `Plan "${plan.nombre}" activado correctamente.`
      : `Plan "${plan.nombre}" desactivado correctamente.`;
    showToast(mensaje, 'success');
  };

  const handleViewDetailsPlan = (plan: Plan) => {
    // TODO: Implementar modal o panel de detalles
    console.log('Ver detalles del plan:', plan);
    alert(`Detalles del plan: ${plan.nombre}\n\nDescripción: ${plan.descripcion}\nPrecio: ${plan.precioBase} ${plan.moneda}\nEstado: ${plan.estado}`);
  };

  const handleSubmitPlan = (planData: Partial<Plan> | Plan) => {
    if (editingPlan) {
      setPlanes(prev => prev.map(p => 
        p.id === editingPlan.id 
          ? { ...p, ...planData, id: editingPlan.id, updatedAt: new Date() }
          : p
      ));
      showToast(`Plan "${planData.nombre || editingPlan.nombre}" actualizado correctamente.`, 'success');
    } else {
      const newPlan: Plan = {
        id: `plan-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        ...planData,
        createdAt: new Date(),
        updatedAt: new Date()
      } as Plan;
      setPlanes(prev => [...prev, newPlan]);
      showToast(`Plan "${planData.nombre}" creado correctamente.`, 'success');
    }
    setShowPlanForm(false);
    setEditingPlan(null);
  };

  // Handlers para bonos
  const handleCreateBono = (bonoData: Partial<Bono>) => {
    const newBono: Bono = {
      id: Date.now().toString(),
      ...bonoData
    } as Bono;
    setBonos(prev => [...prev, newBono]);
  };

  const handleUpdateBono = (id: string, bonoData: Partial<Bono>) => {
    setBonos(prev => prev.map(b => 
      b.id === id ? { ...b, ...bonoData } : b
    ));
  };

  const handleDeleteBono = (id: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este bono?')) {
      setBonos(prev => prev.filter(b => b.id !== id));
    }
  };

  // Handlers para acciones globales
  const handleImport = () => {
    // TODO: Implementar lógica de importación
    console.log('Importar catálogo');
    alert('Funcionalidad de importación en desarrollo');
  };

  const handleExport = () => {
    // TODO: Implementar lógica de exportación
    console.log('Exportar catálogo');
    const data = {
      planes,
      bonos
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `catalogo-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Scroll horizontal para tabs en móvil
  const scrollTabs = (direction: 'left' | 'right') => {
    if (tabsScrollRef.current) {
      const scrollAmount = 200;
      tabsScrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth'
      });
    }
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900">Acceso requerido</h2>
          <p className="text-gray-600 mt-2">Debes iniciar sesión para acceder a esta página.</p>
        </div>
      </div>
    );
  }

  const renderTabContent = () => {
    switch (activeTab) {
      case 'planes':
        return (
          <CatalogoPlanes
            planes={planes}
            onSelectPlan={handleSelectPlan}
            onEditPlan={handleEditPlan}
            onDeletePlan={handleDeletePlan}
            onCreatePlan={handleCreatePlan}
            onDuplicatePlan={handleDuplicatePlan}
            onArchivePlans={handleArchivePlans}
            onArchivePlan={handleArchivePlan}
            onToggleEstadoPlan={handleToggleEstadoPlan}
            onViewDetailsPlan={handleViewDetailsPlan}
          />
        );
      
      case 'bonos':
        return (
          <GestorBonos
            bonos={bonos}
            clientes={clientes}
            planes={planes}
            onCreateBono={handleCreateBono}
            onUpdateBono={handleUpdateBono}
            onDeleteBono={handleDeleteBono}
          />
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-full fade-in duration-300">
          <div className={`flex items-center gap-3 px-4 py-3 rounded-lg shadow-lg border ${
            toast.type === 'success' 
              ? 'bg-green-50 border-green-200 text-green-800' 
              : toast.type === 'error'
              ? 'bg-red-50 border-red-200 text-red-800'
              : 'bg-blue-50 border-blue-200 text-blue-800'
          }`}>
            {toast.type === 'success' ? (
              <CheckCircle2 size={20} className="text-green-600" />
            ) : toast.type === 'error' ? (
              <AlertCircle size={20} className="text-red-600" />
            ) : (
              <AlertCircle size={20} className="text-blue-600" />
            )}
            <p className="text-sm font-medium">{toast.message}</p>
            <button 
              onClick={() => setToast(null)}
              className="ml-2 p-1 hover:bg-black/5 rounded-full transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="border-b border-gray-200/60 bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6">
          <div className="py-6">
            <div className="flex items-center">
              {/* Icono con contenedor */}
              <div className="p-2 bg-blue-100 rounded-xl mr-4 ring-1 ring-blue-200/70">
                <Package size={24} className="text-blue-600" />
              </div>
              
              {/* Título y descripción */}
              <div>
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight text-gray-900">
                  Catálogo de Planes & Bonos
                </h1>
                <p className="text-gray-600 mt-1">
                  Gestiona tus planes de suscripción, bonos y paquetes desde un solo lugar
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Área de acciones globales */}
        <Card className="mb-6 bg-white shadow-sm">
          <div className="p-4">
            <div className="flex flex-wrap items-center gap-3">
              <Button
                variant="primary"
                onClick={handleCreatePlan}
                className="flex items-center gap-2"
              >
                <Plus size={18} />
                <span>Crear plan</span>
              </Button>
              
              <Button
                variant="secondary"
                onClick={() => {
                  setActiveTab('bonos');
                  // El GestorBonos tiene su propio botón de crear que se mostrará al cambiar al tab
                }}
                className="flex items-center gap-2"
              >
                <Gift size={18} />
                <span>Crear bono</span>
              </Button>
              
              <div className="flex-1" />
              
              <Button
                variant="ghost"
                onClick={handleImport}
                className="flex items-center gap-2"
              >
                <Upload size={18} />
                <span className="hidden sm:inline">Importar</span>
              </Button>
              
              <Button
                variant="ghost"
                onClick={handleExport}
                className="flex items-center gap-2"
              >
                <Download size={18} />
                <span className="hidden sm:inline">Exportar</span>
              </Button>
            </div>
          </div>
        </Card>

        {/* Sistema de Tabs */}
        <Card className="p-0 bg-white shadow-sm">
          <div className="px-4 py-3">
            {/* Desktop: tabs con scroll horizontal si es necesario */}
            <div className="hidden md:block relative">
              <div
                ref={tabsScrollRef}
                role="tablist"
                aria-label="Secciones del catálogo"
                className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1 overflow-x-auto scrollbar-hide"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                <button
                  role="tab"
                  aria-selected={activeTab === 'planes'}
                  onClick={() => setActiveTab('planes')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'planes'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Package
                    size={18}
                    className={activeTab === 'planes' ? 'opacity-100' : 'opacity-70'}
                  />
                  <span>Planes de suscripción</span>
                </button>
                
                <button
                  role="tab"
                  aria-selected={activeTab === 'bonos'}
                  onClick={() => setActiveTab('bonos')}
                  className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                    activeTab === 'bonos'
                      ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                  }`}
                >
                  <Gift
                    size={18}
                    className={activeTab === 'bonos' ? 'opacity-100' : 'opacity-70'}
                  />
                  <span>Bonos y paquetes</span>
                </button>
              </div>
            </div>

            {/* Mobile: tabs con scroll horizontal y controles */}
            <div className="md:hidden relative">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => scrollTabs('left')}
                  className="p-2 rounded-lg hover:bg-slate-200 transition-colors flex-shrink-0"
                  aria-label="Scroll izquierda"
                >
                  <ChevronLeft size={20} className="text-slate-600" />
                </button>
                
                <div
                  ref={tabsScrollRef}
                  role="tablist"
                  aria-label="Secciones del catálogo"
                  className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1 overflow-x-auto scrollbar-hide flex-1"
                  style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                  <button
                    role="tab"
                    aria-selected={activeTab === 'planes'}
                    onClick={() => setActiveTab('planes')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'planes'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Package
                      size={18}
                      className={activeTab === 'planes' ? 'opacity-100' : 'opacity-70'}
                    />
                    <span>Planes</span>
                  </button>
                  
                  <button
                    role="tab"
                    aria-selected={activeTab === 'bonos'}
                    onClick={() => setActiveTab('bonos')}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all whitespace-nowrap ${
                      activeTab === 'bonos'
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Gift
                      size={18}
                      className={activeTab === 'bonos' ? 'opacity-100' : 'opacity-70'}
                    />
                    <span>Bonos</span>
                  </button>
                </div>
                
                <button
                  onClick={() => scrollTabs('right')}
                  className="p-2 rounded-lg hover:bg-slate-200 transition-colors flex-shrink-0"
                  aria-label="Scroll derecha"
                >
                  <ChevronRight size={20} className="text-slate-600" />
                </button>
              </div>
            </div>
          </div>
        </Card>

        {/* Contenido de la pestaña activa */}
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Modal de formulario de plan */}
      {showPlanForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-7xl w-full max-h-[90vh] overflow-y-auto relative">
            <button
              onClick={() => {
                setShowPlanForm(false);
                setEditingPlan(null);
              }}
              className="absolute top-4 right-4 z-10 p-2 rounded-full hover:bg-gray-100 transition-colors"
              aria-label="Cerrar"
            >
              <X size={20} className="text-gray-600" />
            </button>
            <PlanForm
              initialPlan={editingPlan || undefined}
              onSubmit={handleSubmitPlan}
              onCancel={() => {
                setShowPlanForm(false);
                setEditingPlan(null);
              }}
              existingPlans={planes}
              showPreview={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};