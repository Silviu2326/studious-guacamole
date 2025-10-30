import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../context/AuthContext';
import { Tabs } from '../../../components/componentsreutilizables';
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
import { Package, Users, BarChart3, Settings } from 'lucide-react';

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
          <div className="space-y-6">
            <div className="text-center py-12">
              <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Estadísticas y Reportes
              </h3>
              <p className="text-gray-600">
                Las estadísticas detalladas estarán disponibles próximamente.
              </p>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header principal */}
      <div className="bg-white border-b border-gray-200 pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {user.role === 'entrenador' ? 'Gestión de Bonos PT' : 'Gestión de Membresías'}
            </h1>
            <p className="text-gray-600 mt-2">
              {user.role === 'entrenador' 
                ? 'Administra tus bonos de entrenamiento personalizado y clientes'
                : 'Administra las membresías y planes de tu gimnasio'
              }
            </p>
          </div>
          
          <div className="mt-4 sm:mt-0">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Settings className="h-4 w-4" />
              <span>Rol: {user.role === 'entrenador' ? 'Entrenador' : 'Gimnasio'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navegación por pestañas */}
      <Tabs
        tabs={getTabsForRole()}
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />

      {/* Contenido de la pestaña activa */}
      <div className="min-h-[600px]">
        {renderTabContent()}
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