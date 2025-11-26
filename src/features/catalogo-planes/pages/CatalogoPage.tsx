import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Card } from '../../../components/componentsreutilizables';
import { CatalogoPlanes } from '../components/CatalogoPlanes';
import { GestorBonos } from '../components/GestorBonos';
import { PlanForm } from '../components/PlanForm';
import { Plan, Bono, Cliente } from '../types';
import { 
  MOCK_PLANES_ENTRENADOR, 
  MOCK_PLANES_GIMNASIO, 
  MOCK_BONOS, 
  MOCK_CLIENTES 
} from '../data/mockData';
import { Package, Users, BarChart3 } from 'lucide-react';

export const CatalogoPage: React.FC = () => {
  const { user } = useAuth();
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [bonos, setBonos] = useState<Bono[]>(MOCK_BONOS);
  const [clientes] = useState<Cliente[]>(MOCK_CLIENTES);
  const [showPlanForm, setShowPlanForm] = useState(false);
  const [editingPlan, setEditingPlan] = useState<Plan | null>(null);
  const [activeTab, setActiveTab] = useState('catalogo');

  useEffect(() => {
    // Cargar planes según el tipo de usuario
    if (user?.role === 'entrenador') {
      setPlanes(MOCK_PLANES_ENTRENADOR);
    } else if (user?.role === 'gimnasio') {
      setPlanes(MOCK_PLANES_GIMNASIO);
    }
  }, [user?.role]);

  const handleSelectPlan = (plan: Plan) => {
    console.log('Plan seleccionado:', plan);
    // Aquí se podría abrir un modal para asignar el plan a un cliente
  };

  const handleEditPlan = (plan: Plan) => {
    setEditingPlan(plan);
    setShowPlanForm(true);
  };

  const handleDeletePlan = (planId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este plan?')) {
      setPlanes(prev => prev.filter(p => p.id !== planId));
    }
  };

  const handleCreatePlan = () => {
    setEditingPlan(null);
    setShowPlanForm(true);
  };

  const handleSubmitPlan = (planData: Partial<Plan>) => {
    if (editingPlan) {
      // Actualizar plan existente
      setPlanes(prev => prev.map(p => 
        p.id === editingPlan.id 
          ? { ...p, ...planData, id: editingPlan.id }
          : p
      ));
    } else {
      // Crear nuevo plan
      const newPlan: Plan = {
        id: Date.now().toString(),
        ...planData,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      } as Plan;
      setPlanes(prev => [...prev, newPlan]);
    }
    setShowPlanForm(false);
    setEditingPlan(null);
  };

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

  const getTabsForRole = () => {
    const baseTabs = [
      {
        id: 'catalogo',
        label: user.role === 'entrenador' ? 'Catálogo de Bonos' : 'Catálogo de Membresías',
        icon: Package
      }
    ];

    if (user.role === 'entrenador') {
      baseTabs.push({
        id: 'bonos',
        label: 'Gestión de Bonos',
        icon: Users
      });
    }

    baseTabs.push({
      id: 'estadisticas',
      label: 'Estadísticas',
      icon: BarChart3
    });

    return baseTabs;
  };

  const tabItems = getTabsForRole();

  const renderTabContent = () => {
    switch (activeTab) {
      case 'catalogo':
        return (
          <CatalogoPlanes
            userType={user.role}
            planes={planes}
            onSelectPlan={handleSelectPlan}
            onEditPlan={handleEditPlan}
            onDeletePlan={handleDeletePlan}
            onCreatePlan={handleCreatePlan}
          />
        );
      
      case 'bonos':
        if (user.role === 'entrenador') {
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
        }
        return null;
      
      case 'estadisticas':
        return (
          <Card className="p-8 text-center bg-white shadow-sm">
            <BarChart3 size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Estadísticas y Reportes
            </h3>
            <p className="text-gray-600 mb-4">
              Las estadísticas detalladas estarán disponibles próximamente.
            </p>
          </Card>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
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
                  {user.role === 'entrenador' ? 'Gestión de Bonos PT' : 'Gestión de Membresías'}
                </h1>
                <p className="text-gray-600">
                  {user.role === 'entrenador' 
                    ? 'Administra tus bonos de entrenamiento personalizado y clientes'
                    : 'Administra las membresías y planes de tu gimnasio'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contenido principal */}
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-6 py-8">
        {/* Sistema de Tabs */}
        <Card className="p-0 bg-white shadow-sm">
          <div className="px-4 py-3">
            <div
              role="tablist"
              aria-label="Secciones"
              className="flex items-center gap-2 rounded-2xl bg-slate-100 p-1"
            >
              {tabItems.map(({ id, label, icon: Icon }) => {
                const activo = activeTab === id;
                return (
                  <button
                    key={id}
                    role="tab"
                    aria-selected={activo}
                    onClick={() => setActiveTab(id)}
                    className={`inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                      activo
                        ? 'bg-white text-slate-900 shadow-sm ring-1 ring-slate-200'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-white/70'
                    }`}
                  >
                    <Icon
                      size={18}
                      className={activo ? 'opacity-100' : 'opacity-70'}
                    />
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </Card>

        {/* Contenido de la pestaña activa */}
        <div className="mt-6">
          {renderTabContent()}
        </div>
      </div>

      {/* Modal de formulario de plan */}
      <PlanForm
        isOpen={showPlanForm}
        onClose={() => {
          setShowPlanForm(false);
          setEditingPlan(null);
        }}
        onSubmit={handleSubmitPlan}
        userType={user.role}
        editingPlan={editingPlan}
      />
    </div>
  );
};